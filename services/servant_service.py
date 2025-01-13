from typing import List, Dict, Optional
from services.database import execute_query
from services.utils import get_item_pic_url
from services.item_service import get_material_draw_info
from services.skill_service import get_sid_by_spid


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
        rows = execute_query(query)

    servant_groups = {}
    
    for row in rows:
        #ame = row.STID1_mName.split('(')[0].strip() if row.STID1_mName else ""
        name = row.STID1_mName
        element = get_element_sort_order(row.STID2_mName, row.STID2) if row.STID2_mName or row.STID2 else ""
        level = f"Ур. {row.mLevel}" if row.mLevel else "Основные"
        
        group_key = f"{name}{element}"
        
        if group_key not in servant_groups:
            servant_groups[group_key] = {
                'id': row.IID,
                'OriginPetName': row.OriginPetName,
                'name': name,
                'element_info': element,
                'mLevel': row.mLevel,
                'element_id': row.STID2 if row.STID2 else None,
                'element_order': row.STID2_mName if row.STID2_mName else None,
                'evolution_stage': row.STID2_mName if row.STID2_mName else None,
                'RItemID0': row.RItemID0 if row.RItemID0 else None,
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

        # Инициализируем уровень, если его еще нет
        if level not in current_group['skills_by_level']:
            current_group['skills_by_level'][level] = []
        
        ModuleType = row.MType if row.MType else None
        ModuleName = row.MName if row.MName else None
        
        # Проверяем наличие модуля в текущем уровне
        if ModuleName and ModuleType:
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
                    # Проверяем уникальность комбинации модуля и параметра
                    if not any(
                        a['module_name'] == ModuleName and 
                        a['param_name'] == ability['param_name'] and
                        a['value'] == ability['value']
                        for a in current_group['skills_by_level'][level]
                    ):
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


def get_servant_detail(servant_id: int) -> List[Dict]:
    """Получение детальной информации о слуге"""
    query = """
    SELECT DISTINCT
            a.IID,
            a.SStep,
            a.STID1,
            b1.mSTNID,
            b1.mName,
            t1.MType,
            y1.MName AS MTypeName1,
            t1.MLevel,
            t1.MAParam,
            y1.MAParamName,
            t1.MBParam,
            y1.MBParamName,
            t1.MCParam,
            y1.MCParamName,
            c1.mSPID AS SPID1,
            f1.AbnormalID AS AID1,
            a.STID2,
            t2.MType AS MType2,
            y2.MName AS MTypeName2,
            t2.MLevel AS MLevel2,
            t2.MAParam AS MAParam2,
            y2.MAParamName AS MAParamName2,
            t2.MBParam AS MBParam2,
            y2.MBParamName AS MBParamName2,
            t2.MCParam AS MCParam2,
            y2.MCParamName AS MCParamName2,
            c2.mSPID AS SPID2,
            f2.AbnormalID AS AID2,
            a.STID3,
            t3.MType AS MType3,
            y3.MName AS MTypeName3,
            t3.MLevel AS MLevel3,
            t3.MAParam AS MAParam3,
            y3.MAParamName AS MAParamName3,
            t3.MBParam AS MBParam3,
            y3.MBParamName AS MBParamName3,
            t3.MCParam AS MCParam3,
            y3.MCParamName AS MCParamName3,
            c3.mSPID AS SPID3,
            f3.AbnormalID AS AID3
        FROM TblServantSkillTree AS a
        LEFT JOIN DT_SkillTreeNode AS b1 ON (a.STID1 = b1.mSTID)  
        LEFT JOIN DT_SkillTreeNodeItem AS c1 ON (c1.mSTNID = b1.mSTNID)
        LEFT JOIN DT_SkillPackSkill AS e1 ON (e1.mSPID = c1.mSPID)
        LEFT JOIN DT_SkillAbnormal AS f1 ON (f1.SID = e1.mSID)
        LEFT JOIN DT_AbnormalModule AS r1 ON (r1.AID = f1.AbnormalID)
        LEFT JOIN DT_Module AS t1 ON (t1.MID = r1.MID)
        LEFT JOIN TP_ModuleType AS y1 ON (y1.MType = t1.MType)
        LEFT JOIN DT_SkillTreeNode AS b2 ON (a.STID2 = b2.mSTID)
        LEFT JOIN DT_SkillTreeNodeItem AS c2 ON (c2.mSTNID = b2.mSTNID)  
        LEFT JOIN DT_SkillPackSkill AS e2 ON (e2.mSPID = c2.mSPID)
        LEFT JOIN DT_SkillAbnormal AS f2 ON (f2.SID = e2.mSID)
        LEFT JOIN DT_AbnormalModule AS r2 ON (r2.AID = f2.AbnormalID)
        LEFT JOIN DT_Module AS t2 ON (t2.MID = r2.MID)
        LEFT JOIN TP_ModuleType AS y2 ON (y2.MType = t2.MType)
        LEFT JOIN DT_SkillTreeNode AS b3 ON (a.STID3 = b3.mSTID)
        LEFT JOIN DT_SkillTreeNodeItem AS c3 ON (c3.mSTNID = b3.mSTNID)
        LEFT JOIN DT_SkillPackSkill AS e3 ON (e3.mSPID = c3.mSPID)  
        LEFT JOIN DT_SkillAbnormal AS f3 ON (f3.SID = e3.mSID)
        LEFT JOIN DT_AbnormalModule AS r3 ON (r3.AID = f3.AbnormalID)
        LEFT JOIN DT_Module AS t3 ON (t3.MID = r3.MID)
        LEFT JOIN TP_ModuleType AS y3 ON (y3.MType = t3.MType)
        WHERE a.IID = ? AND a.SStep = 0;
    """
    
    try:
        rows = execute_query(query, (servant_id,), fetch_one=False)
        
        print(f"Total rows: {len(rows)}")
        
        if not rows:
            return {}
        
        servant_data_list = []  # Используем список вместо словаря
        for row in rows:
            skill_images = {
                'skill1': 'xxx',
                'skill2': 'xx',
                'skill3': 'xyu'
            }

            servant_data = {
                'id': row[0],  # IID
                'step': row[1],  # SStep
                'skills': [
                    {
                        'stid': row[2],  # STID1
                        'skill_pack_id': row[14],  # SPID1
                        'abnormal_id': row[15],  # AID1
                        'module': {
                            'type': row[5],  # MType
                            'name': row[6],  # MTypeName1
                            'level': row[7],  # MLevel
                            'params': {
                                'a': {'name': row[8], 'value': row[9]},
                                'b': {'name': row[10], 'value': row[11]},
                                'c': {'name': row[12], 'value': row[13]}
                            }
                        },
                        'image': skill_images['skill1']
                    },
                    {
                        'stid': row[16],  # STID2
                        'skill_pack_id': row[25],  # SPID2
                        'abnormal_id': row[26],  # AID2
                        'module': {
                            'type': row[17],  # MType2
                            'name': row[18],  # MTypeName2
                            'level': row[19],  # MLevel2
                            'params': {
                                'a': {'name': row[20], 'value': row[21]},
                                'b': {'name': row[22], 'value': row[23]},
                                'c': {'name': row[24], 'value': row[25]}
                            }
                        },
                        'image': skill_images['skill2']
                    },
                    {
                        'stid': row[27],  # STID3
                        'skill_pack_id': row[36],  # SPID3
                        'abnormal_id': row[37],  # AID3
                        'module': {
                            'type': row[28],  # MType3
                            'name': row[29],  # MTypeName3
                            'level': row[30],  # MLevel3
                            'params': {
                                'a': {'name': row[31], 'value': row[32]},
                                'b': {'name': row[33], 'value': row[34]},
                                'c': {'name': row[35], 'value': row[36]}
                            }
                        },
                        'image': skill_images['skill3']
                    }
                ]
            }

            # Добавляем данные в список
            servant_data_list.append(servant_data)

        print(f"Number of servants: {len(servant_data_list)}")
        #print(servant_data_list)  # Печатаем список
        return servant_data_list


    except Exception as e:
        print(f"Ошибка в get_servant_detail: {e}")
        return {}

    
    


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


# TODO:
def check_servant_skill_tree(servant_id):
    # query = """
    # SELECT
    #     a.SServerType,
    #     a.SIsSpeed,
    #     a.SServantIID,
    #     b.IName AS 'ServantIName',
    #     a.SResultIID,
    #     b1.IName AS 'ChestIName',
    #     a.SCount 
    # FROM
    #     TblServantGathering AS a
    #     INNER JOIN DT_Item AS b ON ( b.IID = a.SServantIID )
    #     INNER JOIN DT_Item AS b1 ON ( b1.IID = a.SResultIID ) 
    # WHERE
    #     a.SServerType = 1 
    # AND a.SIsSpeed = 0 
    # AND a.SServantIID = ?
    # """

    # row = execute_query(query, (servant_id,), fetch_one=True)
    
    kek = get_servant_detail(servant_id)
    
    #print(kek)
    
    
    
    servant_skilltree_data = 'WORKS!'
    return kek