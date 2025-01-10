from typing import List, Dict, Optional, Tuple, Any
from flask import current_app
from services.database import execute_query
from services.utils import get_item_pic_url
from services.item_service import get_item_resource
from functools import lru_cache
import time
from concurrent.futures import ThreadPoolExecutor
from collections import defaultdict
from apscheduler.schedulers.background import BackgroundScheduler


# Оптимизированное кэширование
class OptimizedCache:
    def __init__(self, max_size: int = 1000, ttl: int = 3600):
        self.cache = {}
        self.timestamps = {}
        self.max_size = max_size
        self.ttl = ttl
        self._executor = ThreadPoolExecutor(max_workers=4)

    def get(self, key: str) -> Optional[Any]:
        if key in self.cache:
            if time.time() - self.timestamps[key] < self.ttl:
                return self.cache[key]
            self._cleanup_key(key)
        return None

    def set(self, key: str, value: Any) -> None:
        if len(self.cache) >= self.max_size:
            self._cleanup_oldest()
        self.cache[key] = value
        self.timestamps[key] = time.time()

    def _cleanup_key(self, key: str) -> None:
        self.cache.pop(key, None)
        self.timestamps.pop(key, None)

    def _cleanup_oldest(self) -> None:
        if not self.timestamps:
            return
        oldest_key = min(self.timestamps, key=self.timestamps.get)
        self._cleanup_key(oldest_key)

query_cache = OptimizedCache()

def get_group_names() -> Tuple[Dict[int, str], Dict[str, str]]:
    """Получение названий групп"""
    group1_names = {
        0: 'Рефайн питомцев, материалы',
        1: 'Оружие',
        2: 'Доспехи',
        3: 'Аксессуары',
        4: 'Умения',
        5: 'Материалы',
        6: 'Питомцы',
        7: 'Особое'
    }
    
    group2_names = {
        '00': 'Рефайн питомцев, материалы',
        '11': 'Оружие',
        '12': 'Оружие дальнего боя',
        '21': 'Шлемы',
        '22': 'Доспехи',
        '23': 'Перчатки',
        '24': 'Сапоги',
        '25': 'Доп. защита',
        '26': 'Плащи',
        '31': 'Ожерелье',
        '32': 'Ремень',
        '33': 'Кольца'
    }
    
    return group1_names, group2_names

def get_group_items(group_id: int, group2: str = None) -> Tuple[List[Dict], bool]:
    """Получение предметов группы с пагинацией"""
    try:
        # Сначала проверяем наличие подгрупп для данной группы
        if group2 is None:
            subgroups_query = """
            SELECT DISTINCT mGroup2 
            FROM [dbo].[DT_RefineCreateInfo] WITH (NOLOCK)
            WHERE mGroup1 = ?
            """
            
            subgroups = execute_query(subgroups_query, (group_id,))
            has_subgroups = len(subgroups) > 1
            
            if has_subgroups:
                return [{'group2': row.mGroup2} for row in subgroups], False
        
        # Запрос предметов
        items_query = """
        SELECT DISTINCT
            a.mRID,
            a.mSort,
            b.RItemID0,
            b.RIsCreateCnt,
            i1.IName as result_name
        FROM [dbo].[DT_RefineCreateInfo] AS a WITH (NOLOCK)
        INNER JOIN DT_Refine AS b WITH (NOLOCK) ON b.RID = a.mRID
        INNER JOIN DT_Item AS i1 WITH (NOLOCK) ON b.RItemID0 = i1.IID
        WHERE a.mGroup1 = ?
        """ + (" AND a.mGroup2 = ?" if group2 else "") + """
        ORDER BY a.mSort DESC
        """
        
        params = (group_id, group2) if group2 else (group_id,)
        rows = execute_query(items_query, params)
        
        items = [{
            'rid': row.mRID,
            'result_item_id': row.RItemID0,
            'result_name': row.result_name,
            'result_pic': get_item_pic_url(row.RItemID0),
            'create_count': row.RIsCreateCnt
        } for row in rows]
        
        return items, len(items) >= 20
            
    except Exception as e:
        print(f"Error getting group items: {e}")
        return [], False

def get_craft_data(rid: int) -> Optional[Dict]:
    """Получение данных конкретного крафта"""
    cache_key = f'craft_data_{rid}'
    cached_result = query_cache.get(cache_key)
    if cached_result:
        return cached_result

    try:
        # Получаем основные данные крафта
        craft_query = """
        SELECT
            a.mIDX,
            a.mRID,
            a.mCost,
            b.RItemID0,
            b.RSuccess,
            b.RIsCreateCnt,
            i1.IName as result_name
        FROM [dbo].[DT_RefineCreateInfo] AS a WITH (NOLOCK)
        INNER JOIN DT_Refine AS b WITH (NOLOCK) ON b.RID = a.mRID
        INNER JOIN DT_Item AS i1 WITH (NOLOCK) ON b.RItemID0 = i1.IID
        WHERE a.mRID = ?
        """
        
        # Получаем материалы отдельным запросом
        materials_query = """
        SELECT
            c.RItemID,
            c.RNum,
            c.ROrderNo,
            i2.IName as material_name
        FROM DT_RefineMaterial AS c WITH (NOLOCK)
        INNER JOIN DT_Item AS i2 WITH (NOLOCK) ON c.RItemID = i2.IID
        WHERE c.RID = ?
        ORDER BY c.ROrderNo
        """
        
        craft_row = execute_query(craft_query, (rid,), fetch_one=True)
        if not craft_row:
            return None
            
        materials_rows = execute_query(materials_query, (rid,))
        
        result = {
            'idx': craft_row.mIDX,
            'rid': craft_row.mRID,
            'cost': craft_row.mCost,
            'result_item_id': craft_row.RItemID0,
            'success_rate': craft_row.RSuccess,
            'create_count': craft_row.RIsCreateCnt,
            'result_name': craft_row.result_name,
            'result_pic': get_item_pic_url(craft_row.RItemID0),
            'materials': [
                {
                    'item_id': row.RItemID,
                    'count': row.RNum,
                    'order_no': row.ROrderNo,
                    'name': row.material_name,
                    'pic': get_item_pic_url(row.RItemID)
                }
                for row in materials_rows
            ]
        }
        
        query_cache.set(cache_key, result)
        return result
        
    except Exception as e:
        print(f"Error getting craft data: {e}")
        return None

def get_all_craft_data() -> Dict:
    """Получение всех данных крафта"""
    try:
        query = """
        SELECT DISTINCT
            a.mRID,
            a.mGroup1,
            a.mGroup2,
            a.mSort,
            a.mCost,
            b.RItemID0,
            b.RSuccess,
            b.RIsCreateCnt,
            i1.IName as result_name
        FROM [dbo].[DT_RefineCreateInfo] AS a WITH (NOLOCK)
        INNER JOIN DT_Refine AS b WITH (NOLOCK) ON b.RID = a.mRID
        INNER JOIN DT_Item AS i1 WITH (NOLOCK) ON b.RItemID0 = i1.IID
        ORDER BY a.mGroup1, a.mGroup2, a.mSort DESC
        """
        
        all_items = execute_query(query)
        
        # Группируем данные
        grouped_data = defaultdict(lambda: defaultdict(list))
        
        for row in all_items:
            item_data = {
                'rid': row.mRID,
                'result_item_id': row.RItemID0,
                'result_name': row.result_name,
                'result_pic': get_item_pic_url(row.RItemID0),
                'create_count': row.RIsCreateCnt,
                'cost': row.mCost,
                'success_rate': row.RSuccess
            }
            grouped_data[row.mGroup1][str(row.mGroup2)].append(item_data)
            
        # Преобразуем defaultdict в обычный dict
        return {
            group1: dict(group2_data)
            for group1, group2_data in grouped_data.items()
        }
        
    except Exception as e:
        print(f"Error getting all craft data: {e}")
        return {}

def check_base_items_for_craft(item_id: int) -> List[Dict]:
    """Получение рецепта крафта для предмета"""
    query = """
    SELECT DISTINCT
        a.RID,
        a.RItemID0,
        b.IName,
        c.RItemID,
        b1.IName AS 'CraftItems',
        a.RSuccess,
        a.RIsCreateCnt,
        c.ROrderNo
    FROM
        DT_Refine AS a WITH (NOLOCK)
        INNER JOIN DT_Item AS b WITH (NOLOCK) ON (a.RItemID0 = b.IID)
        INNER JOIN DT_RefineMaterial AS c WITH (NOLOCK) ON (a.RID = c.RID)
        INNER JOIN DT_Item AS b1 WITH (NOLOCK) ON (c.RItemID = b1.IID) 
    WHERE
        a.RItemID0 = ? 
    ORDER BY
        a.RID, c.ROrderNo
    """

    rows = execute_query(query, (item_id,))
    unique_results = {}

    for row in rows:
        key = row.RItemID
        if key not in unique_results:
            item_resource = get_item_resource(row.RItemID)
            
            if item_resource:
                file_name = item_resource.RFileName.split('.')[0]
                image_path = f"{current_app.config['GITHUB_URL']}{file_name}_{item_resource.RPosX}_{item_resource.RPosY}.png"
            else:
                image_path = f"{current_app.config['GITHUB_URL']}no_item_image.png"

            unique_results[key] = {
                'RID': row.RID,
                'RItemID0': row.RItemID0,
                'IName': row.IName,
                'RItemID': row.RItemID,
                'CraftItems': row.CraftItems,
                'RSuccess': round(float(row.RSuccess), 1),
                'RIsCreateCnt': row.RIsCreateCnt,
                'ROrderNo': row.ROrderNo,
                'ImagePath': image_path
            }

    return list(unique_results.values())

def check_next_craft_item(item_id: int) -> List[Dict]:
    """Получение предметов, которые можно создать с использованием этого предмета"""
    query = """
    SELECT DISTINCT
        a.RID,
        a.RItemID0,
        b.IName,
        a.RSuccess,
        a.RIsCreateCnt
    FROM
        DT_Refine AS a WITH (NOLOCK)
        INNER JOIN DT_Item AS b WITH (NOLOCK) ON (a.RItemID0 = b.IID)
        INNER JOIN DT_RefineMaterial AS c WITH (NOLOCK) ON (a.RID = c.RID)
        INNER JOIN DT_Item AS b1 WITH (NOLOCK) ON (c.RItemID = b1.IID)
    WHERE
        c.RItemID = ?
    ORDER BY
        a.RID
    """

    rows = execute_query(query, (item_id,))
    unique_results = {}

    for row in rows:
        key = row.RItemID0
        if key not in unique_results:
            item_resource = get_item_resource(row.RItemID0)

            if item_resource:
                file_name = item_resource.RFileName.split('.')[0]
                image_path = f"{current_app.config['GITHUB_URL']}{file_name}_{item_resource.RPosX}_{item_resource.RPosY}.png"
            else:
                image_path = f"{current_app.config['GITHUB_URL']}no_item_image.png"

            unique_results[key] = {
                'RID': row.RID,
                'RItemID0': row.RItemID0,
                'IName': row.IName,
                'RSuccess': round(float(row.RSuccess), 1),
                'RIsCreateCnt': row.RIsCreateCnt,
                'ImagePath': image_path
            }

    return list(unique_results.values())

def check_all_base_items_for_craft(item_id: int) -> List[Dict]:
    """Получение всех базовых предметов для крафта (рекурсивно)"""
    query = """
    WITH RecursiveCraft AS (
        -- Base item (Level 1)
        SELECT
            a.RID,
            a.RItemID0,
            b.IName,
            c.RItemID,
            b1.IName AS CraftItems,
            a.RSuccess,
            a.RIsCreateCnt,
            c.ROrderNo,
            c.RNum,
            1 as Level
        FROM DT_Refine AS a WITH (NOLOCK)
        INNER JOIN DT_Item AS b WITH (NOLOCK) ON (a.RItemID0 = b.IID)
        INNER JOIN DT_RefineMaterial AS c WITH (NOLOCK) ON (a.RID = c.RID)
        INNER JOIN DT_Item AS b1 WITH (NOLOCK) ON (c.RItemID = b1.IID)
        WHERE a.RItemID0 = ?

        UNION ALL

        -- Recursive materials (Level 2+)
        SELECT
            a.RID,
            a.RItemID0,
            b.IName,
            c.RItemID,
            b1.IName AS CraftItems,
            a.RSuccess,
            a.RIsCreateCnt,
            c.ROrderNo,
            c.RNum,
            r.Level + 1
        FROM DT_Refine AS a WITH (NOLOCK)
        INNER JOIN DT_Item AS b WITH (NOLOCK) ON (a.RItemID0 = b.IID)
        INNER JOIN DT_RefineMaterial AS c WITH (NOLOCK) ON (a.RID = c.RID)
        INNER JOIN DT_Item AS b1 WITH (NOLOCK) ON (c.RItemID = b1.IID)
        INNER JOIN RecursiveCraft r ON a.RItemID0 = r.RItemID
        WHERE r.Level < 5  -- Ограничиваем глубину рекурсии до 5 уровней
    )
    SELECT DISTINCT
        RID,
        RItemID0,
        IName,
        RItemID,
        CraftItems,
        RSuccess,
        RIsCreateCnt,
        ROrderNo,
        RNum,
        Level
    FROM RecursiveCraft
    ORDER BY Level, ROrderNo
    """
    
    results = execute_query(query, (item_id,))
    craft_structure = {}
    
    for row in results:
        level = row[9]  # Level
        if level not in craft_structure:
            craft_structure[level] = {
                'main_items': {},
                'materials': {}
            }
            
        # Определяем основной предмет для уровня
        item_id = row[1]  # RItemID0
        if item_id not in craft_structure[level]['main_items']:
            craft_structure[level]['main_items'][item_id] = {
                'id': item_id,
                'name': row[2],  # IName
                'image': get_item_pic_url(item_id),
                'count': row[6],  # RIsCreateCnt
                'success_rate': row[5]  # RSuccess
            }
        
        # Добавляем материал
        material_id = row[3]  # RItemID
        if material_id not in craft_structure[level]['materials']:
            craft_structure[level]['materials'][material_id] = {
                'id': material_id,
                'name': row[4],  # CraftItems
                'image': get_item_pic_url(material_id),
                'count': row[8],  # RNum
                'success_rate': row[5],  # RSuccess
                'order': row[7]  # ROrderNo
            }

    # Преобразуем в список и сортируем
    craft_tree = []
    for level in sorted(craft_structure.keys()):
        level_data = craft_structure[level]
        main_items = list(level_data['main_items'].values())
        materials = sorted(level_data['materials'].values(), key=lambda x: x['order'])
        
        craft_tree.append({
            'level': level,
            'main_item': main_items[0] if main_items else None,
            'materials': materials
        })
    
    return craft_tree

# Функции для очистки кэша
def cleanup_cache():
    """Периодическая очистка кэша"""
    try:
        query_cache._cleanup_oldest()
    except Exception as e:
        print(f"Error cleaning cache: {e}")

# Инициализация фоновой задачи очистки кэша
def init_cache_cleanup(app):
    """Инициализация периодической очистки кэша"""
    scheduler = BackgroundScheduler()
    
    with app.app_context():
        scheduler.add_job(
            cleanup_cache,
            'interval',
            hours=1,
            id='cache_cleanup'
        )
        scheduler.start()

# Вспомогательные функции для оптимизации

def get_item_data_batch(item_ids: List[int]) -> Dict[int, Dict]:
    """Получение данных для нескольких предметов одновременно"""
    if not item_ids:
        return {}

    query = """
    SELECT 
        i.IID,
        i.IName,
        r.RFileName,
        r.RPosX,
        r.RPosY
    FROM DT_Item i WITH (NOLOCK)
    LEFT JOIN DT_ItemResource r WITH (NOLOCK) ON i.IID = r.IID
    WHERE i.IID IN ({})
    """.format(','.join('?' * len(item_ids)))

    rows = execute_query(query, item_ids)
    
    result = {}
    for row in rows:
        if row.RFileName:
            file_name = row.RFileName.split('.')[0]
            image_path = f"{current_app.config['GITHUB_URL']}{file_name}_{row.RPosX}_{row.RPosY}.png"
        else:
            image_path = f"{current_app.config['GITHUB_URL']}no_item_image.png"

        result[row.IID] = {
            'id': row.IID,
            'name': row.IName,
            'image': image_path
        }
    
    return result

@lru_cache(maxsize=1000)
def get_item_price(item_id: int) -> Optional[int]:
    """Получение цены предмета (кэшировано)"""
    query = """
    SELECT Price 
    FROM DT_Item WITH (NOLOCK)
    WHERE IID = ?
    """
    
    result = execute_query(query, (item_id,), fetch_one=True)
    return result.Price if result else None

def calculate_craft_cost(craft_data: Dict) -> Dict:
    """Расчет общей стоимости крафта"""
    total_cost = craft_data.get('cost', 0)
    materials_cost = 0
    
    for material in craft_data.get('materials', []):
        item_price = get_item_price(material['item_id'])
        if item_price:
            materials_cost += item_price * material['count']
    
    return {
        'craft_cost': total_cost,
        'materials_cost': materials_cost,
        'total_cost': total_cost + materials_cost
    }