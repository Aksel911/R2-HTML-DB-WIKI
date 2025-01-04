from typing import List, Dict, Optional, Tuple
from flask import current_app
from services.database import execute_query
from services.item_service import get_item_resource
from services.item_service import get_item_name
from services.utils import get_item_pic_url


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

def check_item_exists(item_id: int) -> bool:
    """Проверка существования предмета в базе данных"""
    query = "SELECT COUNT(*) as count FROM DT_Item WHERE IID = ?"
    result = execute_query(query, (item_id,), fetch_one=True)
    return result[0] > 0 if result else False

def get_craft_data() -> Dict:
    """Получение данных о крафте"""
    try:
        query = """
        SELECT DISTINCT
            a.mIDX,
            a.mRID,
            a.mGroup1,
            a.mGroup2,
            a.mSort,
            a.mCost,
            b.RItemID0,
            b.RSuccess,
            b.RIsCreateCnt,
            c.RItemID,
            c.RNum,
            c.ROrderNo
        FROM
            [dbo].[DT_RefineCreateInfo] AS a
            INNER JOIN DT_Refine AS b ON ( b.RID = a.mRID )
            INNER JOIN DT_RefineMaterial AS c ON ( c.RID = b.RID )
            INNER JOIN DT_Item AS i1 ON ( b.RItemID0 = i1.IID )
            INNER JOIN DT_Item AS i2 ON ( c.RItemID = i2.IID )
        ORDER BY
            a.mGroup1,
            a.mGroup2,
            a.mSort DESC
        """
        
        rows = execute_query(query)
        
        # Группируем данные по Group1 и Group2
        crafts_by_groups = {}
        
        for row in rows:
            try:
                group1 = row.mGroup1
                group2 = row.mGroup2
                result_item_id = row.RItemID0
                material_item_id = row.RItemID
                
                # Проверяем существование предметов
                if not (result_item_id and material_item_id):
                    continue
                
                if group1 not in crafts_by_groups:
                    crafts_by_groups[group1] = {}
                    
                group_key = f"{group1}{group2}"
                if group_key not in crafts_by_groups[group1]:
                    crafts_by_groups[group1][group_key] = []
                
                # Находим существующий крафт или создаем новый
                craft = None
                for existing_craft in crafts_by_groups[group1][group_key]:
                    if existing_craft['rid'] == row.mRID:
                        craft = existing_craft
                        break
                        
                if craft is None:
                    result_name = get_item_name(result_item_id)
                    if not result_name:
                        continue
                        
                    craft = {
                        'idx': row.mIDX,
                        'rid': row.mRID,
                        'sort': row.mSort,
                        'cost': row.mCost,
                        'result_item_id': result_item_id,
                        'success_rate': row.RSuccess,
                        'create_count': row.RIsCreateCnt,
                        'result_name': result_name,
                        'result_pic': get_item_pic_url(result_item_id),
                        'materials': []
                    }
                    crafts_by_groups[group1][group_key].append(craft)
                
                # Добавляем материал
                material_name = get_item_name(material_item_id)
                if material_name:
                    material = {
                        'item_id': material_item_id,
                        'count': row.RNum,
                        'order_no': row.ROrderNo,
                        'name': material_name,
                        'pic': get_item_pic_url(material_item_id)
                    }
                    craft['materials'].append(material)
                
                # Сортируем материалы по order_no
                craft['materials'].sort(key=lambda x: x['order_no'])
                
            except Exception as e:
                print(f"Error processing row: {row}")
                print(f"Error details: {e}")
                continue
        
        return crafts_by_groups
        
    except Exception as e:
        print(f"Error getting craft data: {e}")
        raise e
















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