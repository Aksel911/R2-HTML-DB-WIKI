from typing import List, Dict, Optional, Tuple
from flask import current_app
from models.skill import Skill, DT_Attribute, DT_SkillSlain
from services.database import execute_query
from services.utils import get_monster_pic_url, get_skill_icon_path, clean_dict, get_google_sheets_data, get_item_pic_url
from services.item_service import get_item_resource
from services.abnormal_service import (
    get_abnormal_skills
)
from config.settings import ATTRIBUTE_TYPE_WEAPON_URL



# ? Easy defs
# Поиск SID по SPID с картинкой
def get_sid_by_spid(spid):
    
    query = """
    SELECT
        a.mSPID,
        a.mName,
        a.mSpriteFile,
        a.mSpriteX,
        a.mSpriteY,
        b1.SID,
        b1.SName 
    FROM
        DT_SkillPack AS a
        
    INNER JOIN DT_SkillPackSkill AS b ON ( a.mSPID = b.mSPID )
    INNER JOIN DT_Skill AS b1 ON ( b.mSID = b1.SID )
        
    WHERE 
        a.mSPID = ?
            """
    row = execute_query(query, (spid,), fetch_one=True)
    spid_data = row
    
    if not spid_data:
        return None

    # Generate file paths
    spid_image = get_skill_icon_path(
            spid_data[2],  # mSpriteFile
            spid_data[3],  # mSpriteX
            spid_data[4]   # mSpriteY
        )

    
    return spid_data, spid_image


# rest of the code
def get_skills_list() -> Tuple[List[Tuple], Dict[int, str]]:
    """Get list of all skills"""
    query = """
        SELECT
          c.SID,
          c.SName,
          a.mSPID,
          a.mName,
          a.mDesc,
          a.mSpriteFile,
          a.mSpriteX,
          a.mSpriteY 
        FROM
          DT_SkillPack AS a
          LEFT JOIN DT_SkillPackSkill AS b ON ( a.mSPID = b.mSPID )
          LEFT JOIN DT_Skill AS c ON ( b.mSID = c.SID ) 
        ORDER BY
          c.SID
    """
    rows = execute_query(query)
    
    # Convert to list of tuples
    skills_data = [(
        row.SID,
        row.SName.replace('/n', ' ') if row.SName else '',
        row.mSPID,
        row.mName,
        row.mDesc.replace('/n', ' ') if row.mDesc else '',
        row.mSpriteFile,
        row.mSpriteX,
        row.mSpriteY
    ) for row in rows]

    # Generate file paths
    file_paths = {
        skill[0]: get_skill_icon_path(
            skill[5],  # mSpriteFile
            skill[6],  # mSpriteX
            skill[7]   # mSpriteY
        )
        for skill in skills_data
    }

    return skills_data, file_paths

# ? EAZY DEFS
def get_skill_name_by_sid(skill_id: int) -> Optional[str]:
    query = """
    SELECT SName FROM DT_Skill WHERE SID = ?
    """
    row = execute_query(query, (skill_id,), fetch_one=True)
    return row.SName if row else None


def get_monster_reget_skill_pic_icon_datasource(skill_id: int) -> Optional[str]:
    query ="""
    SELECT 
        mSpriteFile, 
        mSpriteX, 
        mSpriteY 
    FROM DT_SkillPack a
        LEFT JOIN DT_SkillPackSkill b ON (a.mSPID = b.mSPID)
    WHERE b.mSID = ?
    """
    icon_data = execute_query(query, (skill_id,), fetch_one=True)
    
    if icon_data:
        return icon_data
    else:
        return None


def get_skill_detail(skill_id: int) -> List[Optional[Skill]]:
    """Get detailed skill information"""
    query = """
        SELECT
            a.SID,
            a.SName,
            a.SDesc,
            a.SHitPlus,
            a.SMPPerUse,
            a.SType,
            b.SName as 'STypeDesc',
            a.SHPPerUse,
            a.SChaoUse,
            a.mApplyRadius,
            a.mApplyRace,
            a.mCastingDelay,
            a.mConsumeItem,
            a.mActiveType,
            a.mAnimation,
            a.mCastingSpeed,
            a.mSkillEffect,
            a.mCoolTime,
            a.mConsumeItem2,
            a.mConsumeItemCnt2,
            c1.IID,
            c1.IName,
            c1.IUseLevel,
            c1.IUseClass,
            d1.mSPID,
            d1.mDesc,
            e.AbnormalID,
            e1.ADesc,
            e1.AType,
            e1.ALevel,
            e2.AEffect,
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
            g1.MCParamName 
        FROM DT_SKill as a
        LEFT JOIN TP_SkillType as b ON (a.SType = b.SType)
        LEFT OUTER JOIN dbo.DT_ItemSkill as c ON (c.SID = a.SID)
        LEFT OUTER JOIN dbo.DT_Item as c1 ON (c1.IID = c.IID)
        LEFT OUTER JOIN dbo.DT_SkillPackSkill AS d ON (a.SID = d.mSID)
        LEFT OUTER JOIN dbo.DT_SkillPack AS d1 ON (d1.mSPID = d.mSPID)
        LEFT OUTER JOIN DT_SkillAbnormal AS e ON (e.SID = a.SID)
        LEFT OUTER JOIN DT_Abnormal as e1 on (e1.AID = e.AbnormalID)
        LEFT OUTER JOIN TP_AbnormalType as e2 on (e2.AType = e1.AType)
        LEFT OUTER JOIN DT_AbnormalModule AS f ON (e.AbnormalID = f.AID)
        LEFT OUTER JOIN DT_Module AS g ON (f.MID = g.MID)
        LEFT OUTER JOIN TP_ModuleType AS g1 ON (g1.MType = g.MType)
        WHERE a.SID = ?
    """
    
    rows = execute_query(query, (skill_id,), fetch_one=False)
    if not rows:
        return None

    skills = []
    
    for row in rows:
        item_id = row.IID
        item_pic = get_item_resource(item_id) if item_id else None

        abnormal_data = clean_dict({
            "AbnormalID": row.AbnormalID,
            "ADesc": row.ADesc,
            "AType": row.AType,
            "ALevel": row.ALevel,
            "AEffect": row.AEffect,
        })

        module_params = [
            {"name": name, "value": value}
            for name, value in [
                (row.MAParamName, row.MAParam),
                (row.MBParamName, row.MBParam),
                (row.MCParamName, row.MCParam)
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

        abnormal_type_data = None
        abnormal_type_pic = None
        if abnormal_data.get("AbnormalID"):
            abnormal_type_data, abnormal_type_pic = get_abnormal_in_skill(abnormal_data["AbnormalID"])

        skill = Skill(
            sid=row.SID,
            name=row.SName,
            desc=row.SDesc,
            hit_plus=row.SHitPlus,
            mp_per_use=row.SMPPerUse,
            skill_type=row.SType,
            type_desc=row.STypeDesc,
            hp_per_use=row.SHPPerUse,
            chao_use=row.SChaoUse,
            apply_radius=row.mApplyRadius,
            apply_race=row.mApplyRace,
            casting_delay=row.mCastingDelay,
            consume_item=row.mConsumeItem,
            active_type=row.mActiveType,
            animation=row.mAnimation,
            casting_speed=row.mCastingSpeed,
            skill_effect=row.mSkillEffect,
            cool_time=row.mCoolTime,
            consume_item2=row.mConsumeItem2,
            consume_item_cnt2=row.mConsumeItemCnt2,
            item_id=row.IID,
            item_pic=item_pic,
            item_name=row.IName,
            item_use_level=row.IUseLevel,
            item_use_class=row.IUseClass,
            skill_pack_id=row.mSPID,
            skill_pack_desc=row.mDesc,
            abnormal_data=abnormal_data,
            module_data=module_data,
            abnormal_type_data=abnormal_type_data,
            abnormal_type_pic=abnormal_type_pic
        )
        
        skills.append(skill)

    return skills


def get_abnormal_in_skill(aid: int) -> Optional[Tuple]:
    """Get abnormal information for a skill"""
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
            abnormaltype_data[4],  # AFileName
            abnormaltype_data[5],  # AIconX
            abnormaltype_data[6]   # AIconY
        )

        return abnormaltype_data, atype_pic_data

    except Exception as e:
        print(f"Error in get_abnormal_in_skill: {e}")
        return None


def get_item_skill(item_id: int) -> Optional[Tuple]:
    """Get skill details for an item"""
    if item_id is None:
        return None

    query = """
    SELECT 
        a.IID,
        a.IName,
        b1.SID,
        c1.AID,
        d1.MID,
        v.mSPID,
        v.mName,
        v.mSpriteFile,
        v.mSpriteX,
        v.mSpriteY,
        v2.SID AS v2_SID,
        v2.SName AS v2_SName,
        d1.MType,
        d1.MAParam,
        d1.MBParam,
        d1.MCParam
    FROM DT_Item a
        INNER JOIN DT_ItemSkill b 
            ON a.IID = b.IID AND a.IID = ?
        INNER JOIN DT_Skill b1 
            ON b.SID = b1.SID
        INNER JOIN DT_SkillAbnormal c 
            ON b1.SID = c.SID
        INNER JOIN DT_Abnormal c1 
            ON c.AbnormalID = c1.AID
        INNER JOIN DT_AbnormalModule d 
            ON c1.AID = d.AID
        INNER JOIN DT_Module d1 
            ON d.MID = d1.MID
        INNER JOIN DT_SkillPack v 
            ON d1.MAParam = v.mSPID
        INNER JOIN DT_SkillPackSkill v1 
            ON v.mSPID = v1.mSPID
        INNER JOIN DT_Skill v2 
            ON v1.mSID = v2.SID
    """
    
    try:
        row = execute_query(query, (item_id,), fetch_one=True)

        if not row:
            return None

        itemdskill_data = (
            row.IID, row.IName, row.SID, row.AID, 
            row.MID, row.mSPID, row.mName, 
            row.mSpriteFile, row.mSpriteX, 
            row.mSpriteY, row.v2_SID, row.v2_SName, row.MType, row.MAParam, row.MBParam, row.MCParam
        ) 
        
        itemskill_pic = get_skill_icon_path(
            row.mSpriteFile,
            row.mSpriteX,
            row.mSpriteY
        )
        
        linked_skills = 0
        linked_skillsaid = 0
        linked_skillsaid = itemdskill_data[3]
        
        transformlist_data = None
        monster_pic_url = None
        
        # TransformList
        if row.MType == 20:
            transformlist_result = get_transformlist_by_mttype(row.MAParam)
            if transformlist_result:
                temp_ma_param = itemdskill_data[13]
                transformlist_data = transformlist_result
                itemdskill_data = temp_ma_param
                #itemskill_pic = None
                
                #return itemdskill_data, itemskill_pic, linked_skills, linked_skillsaid, transformlist_data, monster_pic_url
        
        # Не для книг
        if row.MType != 101:
            #itemdskill_data = None
            #itemskill_pic = None
            linked_skills = get_abnormal_skills(row.AID)
        print(itemdskill_data, transformlist_data)
        return itemdskill_data, itemskill_pic, linked_skills, linked_skillsaid, transformlist_data, monster_pic_url

    except Exception as e:
        print(f"Error in get_item_skill: {e}")
        return None
    
    
def get_transformlist_by_mttype(mttype: int) -> Optional[List[Tuple]]:
    query = """
        SELECT
            a.mNo,
            a.mMonID,
            a.mLevel,
            a.mControl,
            b.MName
        FROM
            TblTransformList AS a
        INNER JOIN DT_Monster AS b ON (a.mMonID = b.MID)
        WHERE
            a.mGroupID = ?
        ORDER BY a.mMonID
    """
    try:
        rows = execute_query(query, (mttype,), fetch_one=False)
        if not rows:
            return None
       
        results = []
        for row in rows:
            transformlist_data = (row.mNo, row.mMonID, row.mLevel, row.mControl, row.MName.replace('/n', ' '), mttype)
            monster_pic_url = get_monster_pic_url(row.mMonID)
            results.append((transformlist_data, monster_pic_url))
           
        return results  # Возвращаем весь список трансформаций
    except Exception as e:
        print(f"Error in get_transformlist_by_mttype: {e}")
        return None
    

def get_skill_use_by_spid_items(spid_id: int) -> Optional[Tuple]:
    """Get skill details by ID"""
    
    if spid_id is None:
        return None
    
    query = """
    SELECT
    a.MID,
    b1.AID,
    c1.SID,
    c1.SName,
    d1.IID,
    d1.IName
    FROM DT_Module AS a
    INNER JOIN DT_AbnormalModule AS b ON (a.MID = b.MID)
    INNER JOIN DT_Abnormal AS b1 ON (b.AID = b1.AID)
    INNER JOIN DT_SkillAbnormal AS c ON (b1.AID = c.AbnormalID)
    INNER JOIN DT_Skill AS c1 ON (c.SID = c1.SID)
    INNER JOIN DT_ItemSkill AS d ON (c1.SID = d.SID)
    INNER JOIN DT_Item AS d1 ON (d.IID = d1.IID)
    WHERE a.MType = 101 AND a.MAParam = ?
    """
    try:
        
        row = execute_query(query, (spid_id,), fetch_one=True)
        #print(row)
        if not row:
            return None

        skill_for_item_data = (row.AID, row.SID, row.SName, row.IID, row.IName)

        item_id = row.IID

        skill_for_item_pic_data = get_item_resource(item_id)
        skill_for_item_pic = get_item_pic_url(skill_for_item_pic_data)
        
        return skill_for_item_data, skill_for_item_pic

    except Exception as e:
        print(f"Error in get_skill_use_by_spid_items: {e}")
        return None
    

def get_skill_use_by_sid(spid_id: int) -> Optional[Tuple]:
    """Get skill details by ID"""
    if spid_id is None:
        return None

    query = """
        SELECT
            a.MID,
            b1.AID,
            c1.SID,
            c1.SName,
            e1.mSPID,
            e1.mSpriteFile,
            e1.mSpriteX,
            e1.mSpriteY,
            d1.IID,
            d1.IName 
        FROM
            DT_Module AS a
            INNER JOIN DT_AbnormalModule AS b ON ( a.MID = b.MID )
            INNER JOIN DT_Abnormal AS b1 ON ( b.AID = b1.AID )
            INNER JOIN DT_SkillAbnormal AS c ON ( b1.AID = c.AbnormalID )
            INNER JOIN DT_Skill AS c1 ON ( c.SID = c1.SID )
            LEFT JOIN DT_SkillPackSkill AS e ON ( c1.SID = e.mSID )
            LEFT JOIN DT_SkillPack AS e1 ON ( e.mSPID = e1.mSPID )
            INNER JOIN DT_ItemSkill AS d ON ( c1.SID = d.SID )
            INNER JOIN DT_Item AS d1 ON ( d.IID = d1.IID ) 
        WHERE
            a.MType = 101 
            AND a.MAParam = ?
    """
    try:
        #cursor.execute(query, (spid_id,))
        #row = cursor.fetchone()
        row = execute_query(query, (spid_id,), fetch_one=True)
        #print(row)
        if not row:
            return None

        #skill_for_skill_data = (row.SID, row.SName, row.AID, row.MID, row.MType, row.MAParam, row.mSPID, row.mSpriteFile, row.mSpriteX, row.mSpriteY)
        skill_for_skill_data = (row.AID, row.SID, row.SName, row.mSPID, row.mSpriteFile, row.mSpriteX, row.mSpriteY, row.IID, row.IName)

        skill_for_skill_pic = get_skill_icon_path(row.mSpriteFile, row.mSpriteX, row.mSpriteY)


        return skill_for_skill_data, skill_for_skill_pic

    except Exception as e:
        print(f"Error in get_skill_use_by_sid: {e}")
        return None
    


# DT_ItemAttributeAdd Check
def get_skill_attribute_data(item_id: int) -> Optional[List[DT_Attribute]]:
    
    attribute_type_weapon_df = get_google_sheets_data(ATTRIBUTE_TYPE_WEAPON_URL)

    query = """
    SELECT
        a.AttrbuteID,
        b.AType,
        b.ALevel,
        b.ADiceDamage,
        b.ADamage 
    FROM
        DT_SkillAttribute AS a
        INNER JOIN DT_Attribute AS b ON ( b.AID = a.AttrbuteID ) 
    WHERE
        a.SID = ?
    """
    
    row = execute_query(query, (item_id,), fetch_one=True)
    
    if row:
        AName = attribute_type_weapon_df[attribute_type_weapon_df['AType'] == row[1]]['AName'].iloc[0] if not attribute_type_weapon_df.empty else ''

        return DT_Attribute(
            row.AttrbuteID,
            row.AType,
            AName,
            row.ALevel,
            row.ADiceDamage,
            row.ADamage
        )
    else:
        return None




# DT_SkillSlain Check
def get_skill_slain_data(item_id: int) -> Optional[List[DT_SkillSlain]]:
    
    query = """
    SELECT
        a.SlainID,
        b.SType,
        c.SName,
        b.SLevel,
        b.SHitPlus,
        b.SDDPlus,
        b.SRHitPlus,
        b.SRDDPlus
        
    FROM DT_SkillSlain AS a
        
    INNER JOIN DT_Slain AS b ON (a.SlainID = b.SID)
        
    INNER JOIN TP_SlainType AS c ON (b.SType = c.SType)
        
    WHERE a.SkillID = ?
    """
    
    row = execute_query(query, (item_id,), fetch_one=True)
    
    if row:
        return DT_SkillSlain(
            row.SlainID,
            row.SType,
            row.SName,
            row.SLevel,
            row.SHitPlus,
            row.SDDPlus,
            row.SRHitPlus,
            row.SRDDPlus
        )
    else:
        return None