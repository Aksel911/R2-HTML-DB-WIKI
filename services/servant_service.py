from typing import List, Dict
from services.database import execute_query
from services.utils import get_item_pic_url
from services.item_service import get_material_draw_info

# Main config
STypeMapping = {
    0: "Базовый",
    1: "Тип HP",
    2: "Тип MP",
    3: "Другой тип",
    4: "Тип HP MP",
    5: "Второй тип HP",
    6: "Второй тип MP",
    7: "Тип HP",
    8: "Тип восстановления HP",
    9: "Тип MP",
    10: "Тип восстановления MP",
    11: "Тип веса",
    12: "Тип времени перевопл.",
    13: "Тип HP MP",
    14: "Тип восстановления HP MP",
    15: "Тип HP/Вес",
    16: "Тип восст.HP/вр. вопл.",
    17: "MP/Вес",
    18: "Тип восст.MP/вр.трансф."
}



base_priority = {
        'Сила': 1,
        'Интеллект': 2,
        'Ловкость': 3
    }

# Порядок элементов первого уровня
element_order_1 = {
    'Стойкость': 'Огонь (I)',
    'Мудрость': 'Вода (I)',
    'Проворство': 'Земля (I)',
    'Стойкость/Мудрость': 'Луна (I)',
    'Стойкость/Проворство': 'Солнце (I)',
    'Мудрость/Проворство': 'Ветер (I)'
}

# Порядок элементов второго уровня
element_order_2 = {
    'Ближний бой': 'Огонь (II)',
    'Магический бой': 'Вода (II)',
    'Дальний бой': 'Земля (II)',
    'Ближний/Магический бой': 'Луна (II)',
    'Ближний/Дальний бой': 'Солнце (II)',
    'Дальний/Магический бой': 'Ветер (II)'
}

# STID2 маппинг
stid2_mapping = {
    # Уровень I
    18: 'Огонь (I)', 30: 'Огонь (I)', 42: 'Огонь (I)',
    20: 'Вода (I)', 32: 'Вода (I)', 44: 'Вода (I)',
    22: 'Земля (I)', 34: 'Земля (I)', 46: 'Земля (I)',
    24: 'Луна (I)', 36: 'Луна (I)', 48: 'Луна (I)',
    26: 'Солнце (I)', 38: 'Солнце (I)', 50: 'Солнце (I)',
    28: 'Ветер (I)', 40: 'Ветер (I)', 52: 'Ветер (I)',
    # Уровень II
    19: 'Огонь (II)', 31: 'Огонь (II)', 43: 'Огонь (II)',
    21: 'Вода (II)', 33: 'Вода (II)', 45: 'Вода (II)',
    23: 'Земля (II)', 35: 'Земля (II)', 47: 'Земля (II)',
    25: 'Луна (II)', 37: 'Луна (II)', 49: 'Луна (II)',
    27: 'Солнце (II)', 39: 'Солнце (II)', 51: 'Солнце (II)',
    29: 'Ветер (II)', 41: 'Ветер (II)', 53: 'Ветер (II)'
}



def get_base_type_priority(name: str) -> int:
    """Get priority for base types"""
    return base_priority.get(name, 100)

def get_element_sort_order(stid2_name: str = None, stid2: int = None) -> str:
    
    # Базовые типы всегда первые
    if stid2_name and any(x in stid2_name for x in ['Интеллект', 'Ловкость', 'Сила']) or stid2 in [15, 16, 17]:
        return 'Базовое направление'
    
    # Проверяем по STID2 сначала
    if stid2 and stid2 in stid2_mapping:
        return stid2_mapping[stid2]

    # Проверяем по имени
    if stid2_name:
        # Проверяем элементы первого уровня
        for key, value in element_order_1.items():
            if key in stid2_name:
                return value
        
        # Проверяем элементы второго уровня
        for key, value in element_order_2.items():
            if key in stid2_name:
                return value

    return 'Неизвестно'

def get_sort_order_priority(element_info: str) -> int:
    """Get numerical priority for sorting elements"""
    order = {
        'Базовое направление': 0,
        'Огонь (I)': 1,
        'Вода (I)': 2,
        'Земля (I)': 3,
        'Луна (I)': 4,
        'Солнце (I)': 5,
        'Ветер (I)': 6,
        'Огонь (II)': 7,
        'Вода (II)': 8,
        'Земля (II)': 9,
        'Луна (II)': 10,
        'Солнце (II)': 11,
        'Ветер (II)': 12,
        'Неизвестно': 99
    }
    return order.get(element_info, 99)


def extract_level(text: str) -> int:
    """Extract level number from text"""
    if not text:
        return 0
    roman_to_int = {'I': 1, 'II': 2, 'III': 3, 'IV': 4, 'V': 5}
    for roman in roman_to_int:
        if f"({roman})" in text:
            return roman_to_int[roman]
    return 0


def get_servants_list(servant_id: int = None) -> List[Dict]:
    
    query = """
    SELECT DISTINCT
        a1.IID,
        b.IName AS 'OriginPetName',
        a.STID1,
        e.mName AS 'STID1_mName',
        a.STID2,
        e1.mName AS 'STID2_mName',
        a.RID,
        c.RItemID0,
        c1.IName AS 'AfterCraftPetName',
        v.mLevel,
        t.MID,
        t.MType,
        t1.MName,
        t.MAParam,
        t1.MAParamName,
        t.MBParam,
        t1.MBParamName,
        t.MCParam,
        t1.MCParamName,
        a1.SCategory,
        a1.SEvolutionStep,
        a1.SType,
        CASE a1.SType 
            WHEN 0 THEN 'Базовый'
            WHEN 1 THEN 'Тип HP'
            WHEN 2 THEN 'Тип MP'
            WHEN 3 THEN 'Другой тип'
            WHEN 4 THEN 'Тип HP MP'
            WHEN 5 THEN 'Второй тип HP'
            WHEN 6 THEN 'Второй тип MP'
            WHEN 7 THEN 'Тип HP'
            WHEN 8 THEN 'Тип восстановления HP'
            WHEN 9 THEN 'Тип MP'
            WHEN 10 THEN 'Тип восстановления MP'
            WHEN 11 THEN 'Тип веса'
            WHEN 12 THEN 'Тип времени перевопл.'
            WHEN 13 THEN 'Тип HP MP'
            WHEN 14 THEN 'Тип восстановления HP MP'
            WHEN 15 THEN 'Тип HP/Вес'
            WHEN 16 THEN 'Тип восст.HP/вр. вопл.'
            WHEN 17 THEN 'MP/Вес'
            WHEN 18 THEN 'Тип восст.MP/вр.трансф.'
        END as STypeDesc
    FROM TblServantType AS a1
    LEFT OUTER JOIN TblServantEvolution AS a ON (a1.IID = a.IID)
    LEFT OUTER JOIN DT_Item AS b ON (b.IID = a1.IID)
    LEFT OUTER JOIN DT_Refine AS c ON (c.RID = a.RID)
    LEFT OUTER JOIN DT_Item AS c1 ON (c.RItemID0 = c1.IID)
    LEFT OUTER JOIN TP_SkillTree AS e ON (e.mSTID = a.STID1)
    LEFT OUTER JOIN TP_SkillTree AS e1 ON (e1.mSTID = a.STID2)
    LEFT OUTER JOIN DT_SkillTreeNode AS d1 ON (d1.mSTID = a.STID2)
    LEFT OUTER JOIN DT_SkillTreeNodeItem AS v ON (v.mSTNID = d1.mSTNID)
    LEFT OUTER JOIN DT_SkillPackSkill AS v1 ON (v1.mSPID = v.mSPID)
    LEFT OUTER JOIN DT_SkillAbnormal AS v2 ON (v2.SID = v1.mSID)
    LEFT OUTER JOIN DT_AbnormalModule AS v3 ON (v2.AbnormalID = v3.AID)
    LEFT OUTER JOIN DT_Module AS t ON (t.MID = v3.MID)
    LEFT OUTER JOIN TP_ModuleType AS t1 ON (t1.MType = t.MType)
    """

    # Если запрашиваем конкретного пета - не применяем фильтры
    if servant_id is not None:
        query += " WHERE a1.IID = ?"
        rows = execute_query(query, (servant_id,))
    else:
        # Здесь можно добавить WHERE условия для фильтрации списка
        rows = execute_query(query)

    servant_groups = {}
    
    for row in rows:
        name = row.STID1_mName.split('(')[0].strip() if row.STID1_mName else ""
        element = get_element_sort_order(row.STID2_mName, row.STID2) if row.STID2_mName or row.STID2 else ""
        level = f"Ур. {row.mLevel}" if row.mLevel else "Основные"
        
        group_key = f"{name}{element}"
        
        if group_key not in servant_groups:
            servant_groups[group_key] = None
            
        current_group = servant_groups[group_key]
        if current_group is None or (row.mLevel and (current_group.get('mLevel') is None or row.mLevel > current_group.get('mLevel', 0))):
            servant_groups[group_key] = {
                'id': row.IID,
                'OriginPetName': row.OriginPetName,
                'name': name,
                'element_info': element,
                'mLevel': row.mLevel,
                'element_id': row.STID2 if row.STID2 else None,
                'element_order': row.STID2_mName if row.STID2_mName else None,
                'evolution_stage': row.STID2_mName if row.STID2_mName else None,
                'evolution_target': row.AfterCraftPetName if row.AfterCraftPetName else None,
                'image_url': get_item_pic_url(row.IID, r_type=1) if row.IID else None,
                'skills_by_level': {},
                'base_priority': get_base_type_priority(name) if name else None,
                'element_sort': get_element_sort_order(element) if element else None,
                'SCategory': row.SCategory if row.SCategory else None,
                'SEvolutionStep': row.SEvolutionStep if row.SEvolutionStep else None,
                'SType': row.SType if row.SType else None,
                'STypeDesc': row.STypeDesc if row.STypeDesc else None
            }
            
        current_group = servant_groups[group_key]
        if current_group is None:
            continue

        if level not in current_group['skills_by_level']:
            current_group['skills_by_level'][level] = []
        
        ModuleType = row.MType if row.MType else None
        ModuleName = row.MName if row.MName else None
        
        for param_name, param_value in [
            (row.MAParamName, row.MAParam),
            (row.MBParamName, row.MBParam),
            (row.MCParamName, row.MCParam)
        ]:
            if param_name and param_value is not None:
                ability = {
                    'module_name': ModuleName,
                    'module_type': ModuleType,
                    'param_name': param_name,
                    'value': param_value
                }
                if not any(a['param_name'] == ability['param_name'] for a in current_group['skills_by_level'][level]):
                    current_group['skills_by_level'][level].append(ability)

    result = list(servant_groups.values())
    
    # Для одиночного пета возвращаем его без сортировки
    if servant_id is not None and result:
        return result[0]
        
    # Для списка применяем сортировку
    result.sort(key=lambda x: (
        x['base_priority'] if x['base_priority'] is not None else float('inf'),
        get_sort_order_priority(x['element_info']) if x['element_info'] is not None else float('inf'),
        x['name'] if x['name'] is not None else ""
    ))
    
    return result



def servant_to_dict(servant: Dict) -> Dict:
    return {
        'id': servant.get('id'),
        'name': servant.get('name', ''),
        'element_info': servant.get('element_info', ''),
        'element_id': servant.get('element_id'),
        'element_order': servant.get('element_order'),
        'evolution_stage': servant.get('evolution_stage'),
        'evolution_target': servant.get('evolution_target'),
        'image_url': servant.get('image_url'),
        'skills_by_level': servant.get('skills_by_level', {}),
        'STypeDesc': servant.get('STypeDesc', ''),
        'base_priority': servant.get('base_priority'),
        'element_sort': servant.get('element_sort')
    }







# * ROUTES

def check_servant_gathering(servant_id):
    query = """
    SELECT
        a.SServerType,
        a.SIsSpeed,
        a.SServantIID,
        b.IName AS 'ServantIName',
        a.SResultIID,
        b1.IName AS 'ChestIName',
        a.SCount 
    FROM
        TblServantGathering AS a
        INNER JOIN DT_Item AS b ON ( b.IID = a.SServantIID )
        INNER JOIN DT_Item AS b1 ON ( b1.IID = a.SResultIID ) 
    WHERE
        a.SServerType = 1 
    AND a.SIsSpeed = 0 
    AND a.SServantIID = ?
    """

    row = execute_query(query, (servant_id,), fetch_one=True)
    gathering_data = {}

    if not row:
        return None, None
    
    servant_pic = get_item_pic_url(row.SServantIID, r_type=2)
    
    chest_pic = get_item_pic_url(row.SResultIID, r_type=2)
    chest_data = get_material_draw_info(row.SResultIID)
    
    gathering_data = {
        "SServerType": row.SServerType,
        "SIsSpeed": row.SIsSpeed,
        "SServantIID": row.SServantIID,
        "ServantIName": row.ServantIName,
        "ServantPic": servant_pic,
        "ChestPic": chest_pic,
        "SResultIID": row.SResultIID,
        "ChestIName": row.ChestIName,
        "SCount": row.SCount
    }
    #print(f"XYXYXYXYXYXYXY {gathering_data}, {chest_data}")
    return gathering_data, chest_data