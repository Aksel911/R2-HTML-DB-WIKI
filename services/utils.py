import io
import time
import logging
import threading

import pandas as pd
from typing import List, Dict, Optional, Tuple, Union
from flask import current_app
import requests
from services.database import execute_query
from models.item import (DT_Item, DT_ItemResource, TblSpecificProcItem, DT_ItemAbnormalResist,
DT_Bead, DT_ItemBeadModule, TblBeadHoleProb, DT_ItemAttributeAdd, 
DT_ItemAttributeResist, DT_ItemProtect, DT_ItemSlain, DT_ItemPanalty)


logger = logging.getLogger(__name__)

__all__ = ['with_app_context', 'clean_description', 'get_google_sheets_data', 'get_skill_icon_path', 'clean_dict', 'get_monster_pic_url']
DEFAULT_IMAGE_URL = "https://raw.githubusercontent.com/Aksel911/R2-HTML-DB/main/static/no_monster/no_monster_image.png"

# Оборачиваем каждую функцию в контекст приложения
def with_app_context(func, app, *args, **kwargs):
    with app.app_context():
        return func(*args, **kwargs)


# --- Кэш Google Sheets ---------------------------------------------------
# Данные справочные и меняются редко, а страница монстра тянет до 4 таблиц,
# поэтому держим их в памяти процесса с TTL.
SHEETS_CACHE_TTL = 3600      # сек
SHEETS_HTTP_TIMEOUT = 10     # сек, иначе запрос может висеть бесконечно

_sheets_cache: Dict[str, Tuple[float, pd.DataFrame]] = {}  # sheet_id -> (время загрузки, данные)
_sheets_cache_lock = threading.Lock()
_sheets_fetch_locks: Dict[str, threading.Lock] = {}        # чтобы один лист не качали несколько потоков сразу


def _get_fetch_lock(sheet_id: str) -> threading.Lock:
    with _sheets_cache_lock:
        lock = _sheets_fetch_locks.get(sheet_id)
        if lock is None:
            lock = _sheets_fetch_locks[sheet_id] = threading.Lock()
        return lock


def _download_sheet(sheet_id: str) -> pd.DataFrame:
    export_url = f"https://docs.google.com/spreadsheets/d/{sheet_id}/export?format=csv"
    response = requests.get(export_url, timeout=SHEETS_HTTP_TIMEOUT)
    response.raise_for_status()
    # BytesIO, а не response.text: не даём requests угадывать кодировку (там UTF-8)
    return pd.read_csv(io.BytesIO(response.content))


def _refresh_sheet(sheet_id: str) -> Optional[pd.DataFrame]:
    """Скачать лист и положить в кэш. Возвращает df или None при ошибке."""
    with _get_fetch_lock(sheet_id):
        # Пока ждали блокировку, кэш мог обновить другой поток
        with _sheets_cache_lock:
            entry = _sheets_cache.get(sheet_id)
        if entry and time.monotonic() - entry[0] < SHEETS_CACHE_TTL:
            return entry[1]

        try:
            df = _download_sheet(sheet_id)
            with _sheets_cache_lock:
                _sheets_cache[sheet_id] = (time.monotonic(), df)
            return df
        except Exception as e:
            logger.error(f"Error fetching Google Sheets data ({sheet_id}): {e}")
            return None


def get_google_sheets_data(url: str) -> pd.DataFrame:
    """Fetch data from Google Sheets (с TTL-кэшем в памяти процесса).

    Stale-while-revalidate: если TTL истёк, но старые данные есть — сразу
    отдаём их, а свежие качаем в фоновом потоке. Запрос пользователя ждёт
    скачивания только при самом первом обращении к листу после старта.

    Возвращает объект ИЗ кэша без копии — вызывающий код обязан только читать
    (булевы маски/срезы создают новые DataFrame, кэш они не трогают).
    """
    try:
        sheet_id = url.split('/d/')[1].split('/')[0]
    except (IndexError, AttributeError):
        logger.error(f"Не удалось разобрать ссылку на Google Sheets: {url}")
        return pd.DataFrame()

    with _sheets_cache_lock:
        entry = _sheets_cache.get(sheet_id)

    if entry:
        if time.monotonic() - entry[0] >= SHEETS_CACHE_TTL:
            # Протухло — обновляем в фоне, если никто уже не обновляет
            fetch_lock = _get_fetch_lock(sheet_id)
            if fetch_lock.acquire(blocking=False):
                fetch_lock.release()
                threading.Thread(
                    target=_refresh_sheet, args=(sheet_id,), daemon=True,
                    name=f'sheets-refresh-{sheet_id[:8]}'
                ).start()
        return entry[1]

    # Первое обращение — данных нет вообще, придётся подождать скачивания
    df = _refresh_sheet(sheet_id)
    return df if df is not None else pd.DataFrame()

def clean_description(desc: Optional[str]) -> str:
    """Clean and format description text"""
    if not desc:
        return ''
    return desc.replace('/n', ' ⭑ ').replace('\\n', ' ⭑ ')

def clean_dict(d: dict) -> dict:
    """Remove None values from dictionary"""
    return {k: v for k, v in d.items() if v is not None}



####

def get_skill_icon_path(sprite_file: Optional[str], sprite_x: Optional[int], 
                       sprite_y: Optional[int], default_icon: str = "no_monster/no_monster_image.png") -> str:
    """Generate path to skill icon"""
    try:
        if not sprite_file:
            return DEFAULT_IMAGE_URL

        # Remove .dds extension if present
        if sprite_file.endswith(".dds"):
            sprite_file = sprite_file[:-4]

        # Check for valid coordinates
        if sprite_x is not None and sprite_y is not None:
            return f"{current_app.config['GITHUB_URL']}{sprite_file}_{sprite_x}_{sprite_y}.png"
        else:
            return DEFAULT_IMAGE_URL

    except Exception as e:
        logger.error(f"Error creating icon path: {e}")
        return DEFAULT_IMAGE_URL
    
    

def get_monster_pic_url(monster_id: int):
    try:
        monster_pic_url = f"{current_app.config['GITHUB_URL']}{monster_id}.png"
        return monster_pic_url
    except Exception as e:
        logger.error(f"Error creating monster pic url: {e}")
        return DEFAULT_IMAGE_URL






# ! ITEM RESOURCE LOGIC
# def url_exists(url: str, timeout: float = 2.0) -> bool:
#     """
#     Проверяет, существует ли ресурс по URL.
#     Возвращает True, если URL доступен (не 404), иначе False.
#     """
#     try:
#         response = requests.head(url, timeout=timeout)
#         return response.status_code != 404
#     except requests.RequestException:
#         return False


def get_item_resource(item_ids: Union[int, List[int]], r_type: int = 2) -> Union[Optional[DT_ItemResource], Dict[int, DT_ItemResource]]:
    """Get item resource by ID with caching. Now supports both single ID and list of IDs"""
    single_id = isinstance(item_ids, int)
    ids = [item_ids] if single_id else item_ids
    
    if not ids:
        return None if single_id else {}
        
    placeholders = ','.join('?' * len(ids))
    # Явный список колонок вместо SELECT * — тянем только то, что реально нужно
    query = (
        f"SELECT ROwnerID, RFileName, RPosX, RPosY FROM DT_ItemResource "
        f"WHERE ROwnerID IN ({placeholders}) AND RType = ?"
    )
    
    rows = execute_query(query, ids + [r_type], fetch_one=False)
    
    # Создаем словарь id -> resource
    resources_dict = {}
    for row in rows:
        resources_dict[row.ROwnerID] = DT_ItemResource(
            row.ROwnerID,
            row.RFileName,
            row.RPosX,
            row.RPosY
        )
    
    if single_id:
        return resources_dict.get(item_ids)
    return resources_dict

def get_item_pic_url(item_id, r_type: int = 2):
    """Получаем ссылку на изображение предмета по его ID"""
    if isinstance(item_id, int):
        item_id = get_item_resource(item_id, r_type=r_type)
        
    if hasattr(item_id, 'RFileName') and hasattr(item_id, 'RPosX') and hasattr(item_id, 'RPosY'):
        item_pic_url = f"{current_app.config['GITHUB_URL']}{item_id.RFileName}_{item_id.RPosX}_{item_id.RPosY}.png"
        #print(f"[get_item_pic_url] item_id: {item_id}, item_pic_url: {item_pic_url}")
        
        # Проверяем доступность изображения (Хуйня тормозящая)
        # if not url_exists(item_pic_url):
        #     item_pic_url = DEFAULT_IMAGE_URL
        
        return item_pic_url
    else:
        logger.warning(f"Объект item_id ({item_id}) не содержит необходимых атрибутов (RFileName, RPosX, RPosY)")
        return DEFAULT_IMAGE_URL
