from typing import List, Dict
from services.database import execute_query
from services.utils import get_item_pic_url


# Main config
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
    """
    Get element order based on STID2_mName content or STID2 value
    Returns element in exact order needed for sorting
    """
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


def get_servants_list() -> List[Dict]:
    """Get all servants with their skills and stats"""
    query = """
    SELECT DISTINCT
        a.IID,
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
        t1.MCParamName
    FROM TblServantEvolution AS a
    INNER JOIN DT_Item AS b ON (b.IID = a.IID)
    INNER JOIN DT_Refine AS c ON (c.RID = a.RID)
    INNER JOIN DT_Item AS c1 ON (c.RItemID0 = c1.IID)
    LEFT OUTER JOIN TP_SkillTree AS e ON (e.mSTID = a.STID1)
    LEFT OUTER JOIN TP_SkillTree AS e1 ON (e1.mSTID = a.STID2)
    INNER JOIN DT_SkillTreeNode AS d1 ON (d1.mSTID = a.STID2)
    INNER JOIN DT_SkillTreeNodeItem AS v ON (v.mSTNID = d1.mSTNID)
    INNER JOIN DT_SkillPackSkill AS v1 ON (v1.mSPID = v.mSPID)
    INNER JOIN DT_SkillAbnormal AS v2 ON (v2.SID = v1.mSID)
    INNER JOIN DT_AbnormalModule AS v3 ON (v2.AbnormalID = v3.AID)
    INNER JOIN DT_Module AS t ON (t.MID = v3.MID)
    INNER JOIN TP_ModuleType AS t1 ON (t1.MType = t.MType)
    ORDER BY e.mName, v.mLevel, a.IID
    """
   
    rows = execute_query(query)
    servant_groups = {}
   
    for row in rows:
        name = row.STID1_mName.split('(')[0].strip() if row.STID1_mName else ""
        element = get_element_sort_order(row.STID2_mName, row.STID2)
        level = f"Ур. {row.mLevel}" if row.mLevel else "Основные"
       
        group_key = f"{name}{element}"
       
        if group_key not in servant_groups:
            servant_groups[group_key] = {
                'id': row.IID,
                'name': name,
                'element_info': element,
                'element_id': row.STID2,
                'element_order': row.STID2_mName,
                'evolution_stage': row.STID2_mName,
                'evolution_target': row.AfterCraftPetName,
                'image_url': get_item_pic_url(row.IID, r_type=1),
                'skills_by_level': {},
                'base_priority': get_base_type_priority(name),
                'element_sort': get_element_sort_order(element)
            }
       
        if level not in servant_groups[group_key]['skills_by_level']:
            servant_groups[group_key]['skills_by_level'][level] = []
       
        ModuleType = row.MType
        ModuleName = row.MName
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
                if not any(a['param_name'] == ability['param_name'] for a in servant_groups[group_key]['skills_by_level'][level]):
                    servant_groups[group_key]['skills_by_level'][level].append(ability)
                    
    for group_key, servant_data in servant_groups.items():
        levels = list(servant_data['skills_by_level'].keys())
        levels.sort(key=lambda x: int(x.split()[-1]) if 'Ур.' in x else 0)
        
        total_stats = {
            'level': f'{name}',
            'stats': []
        }
        
        # Собираем информацию по всем уровням
        for level in levels:
            for ability in servant_data['skills_by_level'][level]:
                ability_stats = next((s for s in total_stats['stats'] if s['param_name'] == ability['param_name']), None)
                if ability_stats:
                    ability_stats['value'] += ability['value']
                else:
                    total_stats['stats'].append({
                        'module_name': ability['module_name'],
                        'module_type': ability['module_type'], 
                        'param_name': ability['param_name'],
                        'value': ability['value']
                    })
                    
        servant_data['total_stats'] = total_stats if total_stats['stats'] else None

   
    result = list(servant_groups.values())
    
    result.sort(key=lambda x: (
        x['base_priority'], 
        get_sort_order_priority(x['element_info']),
        x['name']
    ))
    
    print(result)
    return result

def servant_to_dict(servant: Dict) -> Dict:
    return {
        'id': servant['id'],
        'name': servant['name'],
        'element_info': servant['element_info'],
        'element_id': servant['element_id'],
        'element_order': servant['element_order'],
        'evolution_stage': servant['evolution_stage'],
        'evolution_target': servant['evolution_target'],
        'image_url': servant['image_url'],
        'skills_by_level': servant['skills_by_level']
    }