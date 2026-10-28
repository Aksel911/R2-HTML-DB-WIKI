"""Связанные записи для детальных страниц: ссылки на дроп, продавцов и крафт.

Основные блоки детальных страниц подгружаются JS через /api и /render_template,
а эти пути закрыты для индексации — поэтому поисковик не видел ни одной ссылки
между монстрами, предметами и торговцами. Здесь собирается компактный серверный
список ссылок (templates/seo_related_links.html). Результат кэшируется по ID:
обход тысяч страниц краулерами не должен умножать запросы к MSSQL.
"""
import logging

from services.craft_service import check_base_items_for_craft, check_next_craft_item
from services.merchant_service import get_merchant_items, get_merchant_sellers
from services.monster_service import get_monster_drop_info, get_monster_drops
from services.ttl_cache import TTLCache

logger = logging.getLogger(__name__)

# Запись — несколько десятков коротких кортежей; 3000 ключей — это все монстры
# плюс самые посещаемые предметы при обходе
_cache = TTLCache(max_size=3000, ttl=6 * 3600, name='related_links')


def _group(title: str, links) -> dict | None:
    """Группа ссылок без дублей и пустых названий; None, если ссылок нет"""
    seen = set()
    clean = []
    for url, name in links:
        if not name or url in seen:
            continue
        seen.add(url)
        clean.append((url, str(name).replace('/n', ' ').strip()))
    return {'title': title, 'links': clean} if clean else None


def monster_related_links(monster_id: int, is_merchant: bool = False) -> list:
    """[{'title': 'Дроп', 'links': [(url, name), ...]}, ...] для страницы монстра"""
    key = ('monster', monster_id)
    cached_groups = _cache.get(key)
    if cached_groups is not None:
        return cached_groups

    groups = []
    try:
        drops = get_monster_drops(monster_id)
        groups.append(_group('Дроп', ((f"/item/{d['DItem']}", d['IName']) for d in drops)))

        if is_merchant:
            goods = get_merchant_items(monster_id)
            links = [(f"/item/{g['MerchantItemID']}", g['MerchantItemName']) for g in goods]
            if goods and goods[0].get('MerchantListID'):
                list_id = goods[0]['MerchantListID']
                links.insert(0, (f'/merchant/{list_id}', f'Магазин {list_id} (весь ассортимент)'))
            groups.append(_group('Продаёт', links))
    except Exception as e:
        # Блок вспомогательный: страница должна открыться и без него
        logger.warning(f'related_links: монстр {monster_id}: {e}')
        return []

    result = [g for g in groups if g]
    _cache.set(key, result)
    return result


def item_related_links(item_id: int, craft_recipe=None) -> list:
    """Группы ссылок для страницы предмета.

    craft_recipe — уже полученный результат check_base_items_for_craft,
    чтобы не повторять запрос (роут вызывает его для has_data).
    """
    key = ('item', item_id)
    cached_groups = _cache.get(key)
    if cached_groups is not None:
        return cached_groups

    groups = []
    try:
        drops = get_monster_drop_info(item_id)
        groups.append(_group('Выпадает с', ((f"/monster/{d['MID']}", d['MName']) for d in drops)))

        sellers = get_merchant_sellers(item_id)
        groups.append(_group(
            'Продают', ((f"/monster/{s['MerchantID']}", s['MerchantName']) for s in sellers)
        ))

        if craft_recipe is None:
            craft_recipe = check_base_items_for_craft(item_id)
        groups.append(_group(
            'Крафтится из', ((f"/item/{r['RItemID']}", r['CraftItems']) for r in craft_recipe or [])
        ))

        used_in = check_next_craft_item(item_id)
        groups.append(_group(
            'Нужен для крафта', ((f"/item/{r['RItemID0']}", r['IName']) for r in used_in or [])
        ))
    except Exception as e:
        logger.warning(f'related_links: предмет {item_id}: {e}')
        return []

    result = [g for g in groups if g]
    _cache.set(key, result)
    return result
