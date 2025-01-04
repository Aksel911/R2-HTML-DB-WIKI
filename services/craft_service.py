from typing import List, Dict, Optional, Tuple
from flask import current_app
from services.database import execute_query
from services.utils import get_item_pic_url
from services.item_service import get_item_resource
import time

# Кеширование запросов
CACHE_TIMEOUT = 3600  # 1 час

class QueryCache:
    def __init__(self):
        self.cache = {}
        self.timestamps = {}

    def get(self, key):
        if key in self.cache:
            if time.time() - self.timestamps[key] < CACHE_TIMEOUT:
                return self.cache[key]
            else:
                del self.cache[key]
                del self.timestamps[key]
        return None

    def set(self, key, value):
        self.cache[key] = value
        self.timestamps[key] = time.time()

query_cache = QueryCache()

def get_group_names() -> Tuple[Dict[int, str], Dict[str, str]]:
    """Получение названий групп"""
    cache_key = 'group_names'
    cached_result = query_cache.get(cache_key)
    if cached_result:
        return cached_result

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
    
    result = (group1_names, group2_names)
    query_cache.set(cache_key, result)
    return result

def get_group_items(group_id: int, group2: str = None) -> Tuple[List[Dict], bool]:
    """Получение предметов группы с пагинацией"""
    try:
        # Сначала проверяем наличие подгрупп для данной группы
        subgroups_query = """
        SELECT DISTINCT mGroup2 
        FROM [dbo].[DT_RefineCreateInfo] WITH (NOLOCK)
        WHERE mGroup1 = ?
        """
        
        subgroups = execute_query(subgroups_query, (group_id,))
        has_subgroups = len(subgroups) > 1  # Больше одной подгруппы
        
        if has_subgroups and not group2:
            # Возвращаем список подгрупп
            return [{'group2': row.mGroup2} for row in subgroups], False
        else:
            # Запрос предметов (либо для конкретной подгруппы, либо для всей группы)
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
            
            items = [
                {
                    'rid': row.mRID,
                    'result_item_id': row.RItemID0,
                    'result_name': row.result_name,
                    'result_pic': get_item_pic_url(row.RItemID0),
                    'create_count': row.RIsCreateCnt
                }
                for row in rows
            ]
            
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
        
        craft_row = execute_query(craft_query, (rid,), fetch_one=True)
        if not craft_row:
            return None
            
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
        print(f"Craft query: {craft_query}")
        print(f"RID: {rid}")
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
        grouped_data = {}
        for row in all_items:
            group1 = row.mGroup1
            group2 = str(row.mGroup2)
            
            if group1 not in grouped_data:
                grouped_data[group1] = {}
                
            if group2 not in grouped_data[group1]:
                grouped_data[group1][group2] = []
                
            item_data = {
                'rid': row.mRID,
                'result_item_id': row.RItemID0,
                'result_name': row.result_name,
                'result_pic': get_item_pic_url(row.RItemID0),
                'create_count': row.RIsCreateCnt,
                'cost': row.mCost,
                'success_rate': row.RSuccess
            }
            
            grouped_data[group1][group2].append(item_data)
            
        return grouped_data
        
    except Exception as e:
        print(f"Error getting all craft data: {e}")
        return {}










def check_base_items_for_craft(item_id: int) -> List[Dict]:
    """Get crafting recipe for an item"""
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
        DT_Refine AS a
        INNER JOIN DT_Item AS b ON (a.RItemID0 = b.IID)
        INNER JOIN DT_RefineMaterial AS c ON (a.RID = c.RID)
        INNER JOIN DT_Item AS b1 ON (c.RItemID = b1.IID) 
    WHERE
        a.RItemID0 = ? 
    ORDER BY
        a.RID, c.ROrderNo
    """

    rows = execute_query(query, (item_id,))
    unique_results = {}

    for row in rows:
        # Use RItemID as key for uniqueness
        key = row.RItemID

        # Update record only if it doesn't exist
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
    """Get items that can be crafted using this item"""
    query = """
    SELECT DISTINCT
        a.RID,
        a.RItemID0,
        b.IName,
        a.RSuccess,
        a.RIsCreateCnt
    FROM
        DT_Refine AS a
        INNER JOIN DT_Item AS b ON (a.RItemID0 = b.IID)
        INNER JOIN DT_RefineMaterial AS c ON (a.RID = c.RID)
        INNER JOIN DT_Item AS b1 ON (c.RItemID = b1.IID)
    WHERE
        c.RItemID = ?
    ORDER BY
        a.RID
    """

    rows = execute_query(query, (item_id,))
    unique_results = {}

    for row in rows:
        # Use RItemID0 as key for uniqueness
        key = row.RItemID0

        # Update record only if it doesn't exist
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