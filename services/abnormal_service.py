from typing import List, Dict, Optional, Tuple
from models.abnormal import Abnormal, AbnormalItem, AbnormalSkill, AbnormalListItem
from services.database import execute_query
from services.utils import get_skill_icon_path, clean_dict
from services.item_service import get_item_resource


def get_abnormals_list() -> Tuple[List[AbnormalListItem], Dict[int, str]]:
    """Get list of all abnormal effects"""
    query = """
        SELECT 
            e1.AID,
            e2.AName,
            e1.ADesc,
            e1.AType,
            e1.ALevel,
            e2.AEffect,
            e2.AFileName,
            e2.AIconX,
            e2.AIconY
        FROM DT_Abnormal as e1
        LEFT OUTER JOIN TP_AbnormalType as e2 on (e2.AType = e1.AType)
        ORDER BY e1.AID
    """
    
    rows = execute_query(query)
    abnormals_data = []
    file_paths = {}

    for row in rows:
        abnormal = AbnormalListItem(
            AID=row.AID,
            AName=row.AName.replace('/n', ' ⭑ ').replace('\\n', ' ⭑ ')  if row.AName else '',
            ADesc=row.ADesc.replace('/n', ' ⭑ ').replace('\\n', ' ⭑ ')  if row.ADesc else '',
            AType=row.AType,
            ALevel=row.ALevel,
            AEffect=row.AEffect,
            AFileName=row.AFileName,
            AIconX=row.AIconX,
            AIconY=row.AIconY,
            icon_path=get_skill_icon_path(
                row.AFileName,
                row.AIconX,
                row.AIconY
            )
        )
        abnormals_data.append(abnormal)
        file_paths[row.AID] = abnormal.icon_path

    return abnormals_data, file_paths

def get_abnormal_detail(aid: int) -> Optional[Abnormal]:
    """Get detailed abnormal effect information"""
    query = """
        SELECT
            e1.AID,
            e1.ADesc,
            e1.AType,
            e1.ALevel,
            e2.AEffect,
            e2.AName,
            f.MID,
            g.MType,
            g1.MName,
            g1.MDesc as 'ModuleDesc',
            g.Mlevel,
            g.MAParam,
            g1.MAParamName,
            g.MBParam,
            g1.MBParamName,
            g.MCParam,
            g1.MCParamName,
            a.SID,
            a.SName,
            a.SDesc
        FROM DT_Abnormal as e1
        LEFT OUTER JOIN DT_SkillAbnormal AS e ON (e1.AID = e.AbnormalID)
        LEFT OUTER JOIN TP_AbnormalType as e2 on (e2.AType = e1.AType)
        LEFT OUTER JOIN DT_AbnormalModule AS f ON (e1.AID = f.AID)
        LEFT OUTER JOIN DT_Module AS g ON (f.MID = g.MID)
        LEFT OUTER JOIN TP_ModuleType AS g1 ON (g1.MType = g.MType)
        LEFT OUTER JOIN DT_Skill as a ON (e.SID = a.SID)
        WHERE e1.AID = ?
    """
    
    row = execute_query(query, (aid,), fetch_one=True)
    if not row:
        return None

    abnormal_data = clean_dict({
        "AbnormalID": row.AID,
        "ADesc": row.ADesc.replace('\\n', '') if row.ADesc else '',
        "AType": row.AType,
        "ALevel": row.ALevel,
        "AEffect": row.AEffect,
        "AName": row.AName
    })

    module_params = [
        {"name": name, "value": value}
        for name, value in [
            (row.MAParamName.replace('\\n', '') if row.MAParamName else '', row.MAParam),
            (row.MBParamName.replace('\\n', '') if row.MBParamName else '', row.MBParam),
            (row.MCParamName.replace('\\n', '') if row.MCParamName else '', row.MCParam)
        ]
        if name is not None and value is not None
    ]

    module_data = clean_dict({
        "module_id": row.MID,
        "type": row.MType,
        "type_name": row.MName,
        "type_desc": row.ModuleDesc,
        "level": row.Mlevel,
        "params": module_params if module_params else None
    })

    skill_data = clean_dict({
        "SID": row.SID,
        "SName": row.SName,
        "SDesc": row.SDesc.replace('\\n', ' ') if row.SDesc else ''
    })

    abnormal_type_data, abnormal_type_pic = get_abnormal_in_skill(aid)

    return Abnormal(
        abnormal_data=abnormal_data,
        module_data=module_data,
        skill_data=skill_data,
        abnormal_type_data=abnormal_type_data,
        abnormal_type_pic=abnormal_type_pic
    )

def get_abnormal_skills(aid: int) -> List[AbnormalSkill]:
    """Get all related skills for abnormal effect"""
    if aid is None:
        return []

    query = """
    SELECT DISTINCT
        s.SID,
        s.SName,
        s.SDesc,
        sp.mSpriteFile,
        sp.mSpriteX,
        sp.mSpriteY
    FROM DT_Abnormal AS a
    INNER JOIN DT_SkillAbnormal AS sa ON (a.AID = sa.AbnormalID)
    INNER JOIN DT_Skill AS s ON (sa.SID = s.SID)
    LEFT JOIN DT_SkillPackSkill AS sps ON (s.SID = sps.mSID)
    LEFT JOIN DT_SkillPack AS sp ON (sps.mSPID = sp.mSPID)
    WHERE a.AID = ?
    """
    
    try:
        rows = execute_query(query, (aid,))
        skills = []
        
        for row in rows:
            skill_icon = get_skill_icon_path(
                row.mSpriteFile,
                row.mSpriteX,
                row.mSpriteY
            )
            
            skills.append(AbnormalSkill(
                id=row.SID,
                name=row.SName,
                desc=row.SDesc.replace('/n', ' ') if row.SDesc else '',
                icon=skill_icon
            ))
            
        return skills
    except Exception as e:
        print(f"Error in get_abnormal_skills: {e}")
        return []

def get_abnormal_items(aid: int) -> List[AbnormalItem]:
    """Get all related items for abnormal effect"""
    if aid is None:
        return []

    query = """
    SELECT DISTINCT
        i.IID,
        i.IName
    FROM DT_Abnormal AS a
    INNER JOIN DT_SkillAbnormal AS sa ON (a.AID = sa.AbnormalID)
    INNER JOIN DT_Skill AS s ON (sa.SID = s.SID)
    INNER JOIN DT_ItemSkill AS si ON (s.SID = si.SID)
    INNER JOIN DT_Item AS i ON (si.IID = i.IID)
    WHERE a.AID = ?
    """
    
    try:
        rows = execute_query(query, (aid,))
        items = []
        
        for row in rows:
            item_resource = get_item_resource(row.IID)
            item_pic = item_resource.file_path if item_resource else None
            
            items.append(AbnormalItem(
                id=row.IID,
                name=row.IName,
                icon=item_pic
            ))
            
        return items
    except Exception as e:
        print(f"Error in get_abnormal_items: {e}")
        return []

def get_abnormal_in_skill(aid: int) -> Optional[Tuple]:
    """Get abnormal effect information in skill context"""
    if aid is None:
        return None

    query = """
        SELECT
        a.AID,
        b.AName,
        b.AEffect,
        b.ARemovable,
        b.AFileName,
        b.AIconX,
        b.AIconY
        FROM DT_Abnormal AS a
        INNER JOIN TP_AbnormalType AS b ON (a.AType = b.AType)
        WHERE a.AID = ?
    """
    
    try:
        row = execute_query(query, (aid,), fetch_one=True)
        if not row:
            return None

        abnormaltype_data = (
            row.AID, row.AName, row.AEffect,
            row.ARemovable, row.AFileName,
            row.AIconX, row.AIconY
        )

        atype_pic_data = get_skill_icon_path(
            abnormaltype_data[4],
            abnormaltype_data[5],
            abnormaltype_data[6]
        )

        return abnormaltype_data, atype_pic_data

    except Exception as e:
        print(f"Error in get_abnormal_in_skill: {e}")
        return None