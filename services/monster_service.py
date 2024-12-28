from typing import List, Dict, Optional, Tuple, Union
import pandas as pd
import requests
from flask import current_app
from models.monster import Monster
from services.database import execute_query, get_db_connection
from services.utils import get_google_sheets_data, get_skill_icon_path, clean_description
from config.settings import MONSTER_CLASS_URL, ATTRIBUTE_TYPE_WEAPON_URL, ATTRIBUTE_TYPE_ARMOR_URL
from models.monster import DT_MonsterResource, DT_MonsterAbnormalResist, DT_MonsterAttributeAdd, DT_MonsterAttributeResist, DT_MonsterProtect, DT_MonsterSlain



def apply_monster_filters(monsters: List[Monster], filters: Dict) -> List[Monster]:
    """Apply filters to monster list with improved numeric handling"""
    
    if not monsters or not filters:
        return monsters

    filtered_monsters = monsters

    try:
        # Remove empty filters
        filters = {k: v for k, v in filters.items() if v and k != '' and v != ''}
        
        if not filters:
            return monsters

        # Debug log
        #print("Applied filters:", filters)

        # Level range
        if level_min := filters.get('mLevelMin'):
            try:
                level_min = int(level_min)
                filtered_monsters = [m for m in filtered_monsters if m.mLevel >= level_min]
            except (ValueError, TypeError):
                pass
                
        if level_max := filters.get('mLevelMax'):
            try:
                level_max = int(level_max)
                filtered_monsters = [m for m in filtered_monsters if m.mLevel <= level_max]
            except (ValueError, TypeError):
                pass

        # Experience range
        if exp_min := filters.get('MExpMin'):
            try:
                exp_min = int(exp_min)
                filtered_monsters = [m for m in filtered_monsters if m.MExp >= exp_min]
            except (ValueError, TypeError):
                pass
                
        if exp_max := filters.get('MExpMax'):
            try:
                exp_max = int(exp_max)
                filtered_monsters = [m for m in filtered_monsters if m.MExp <= exp_max]
            except (ValueError, TypeError):
                pass

        # # Respawn Time range
        # if tick_min := filters.get('mTickMin'):
        #     try:
        #         tick_min = int(tick_min)
        #         filtered_monsters = [m for m in filtered_monsters if get_monster_mtick(m.MID) >= tick_min]
        #     except (ValueError, TypeError):
        #         pass
                
        # if tick_max := filters.get('mTickMax'):
        #     try:
        #         tick_max = int(tick_max)
        #         filtered_monsters = [m for m in filtered_monsters if get_monster_mtick(m.MID) <= tick_max]
        #     except (ValueError, TypeError):
        #         pass

        # Other filters remain the same...
        if class_filter := filters.get('classFilter'):
            filtered_monsters = [m for m in filtered_monsters if m.MClass == int(class_filter)]

        if race_filter := filters.get('raceFilter'):
            filtered_monsters = [m for m in filtered_monsters if m.MRaceType == int(race_filter)]

        if attack_type := filters.get('attackTypeFilter'):
            try:
                attack_type = int(attack_type)
                filtered_monsters = [m for m in filtered_monsters if m.mAttackType == attack_type]
            except ValueError:
                pass

        # Boolean filters
        if filters.get('eventMonsterFilter') == '1':
            filtered_monsters = [m for m in filtered_monsters if bool(m.mIsEvent)]
        if filters.get('testMonsterFilter') == '1':
            filtered_monsters = [m for m in filtered_monsters if bool(m.mIsTest)]
        if filters.get('showHpFilter') == '1':
            filtered_monsters = [m for m in filtered_monsters if bool(m.mIsShowHp)]

        return filtered_monsters

    except Exception as e:
        print(f"Error in apply_monster_filters: {e}")
        import traceback
        traceback.print_exc()
        return []

def monster_to_dict(monster: Monster) -> dict:
   """Convert monster object to dictionary for JSON response"""
   return {
       'MID': monster.MID,
       'MName': monster.MName, 
       'mLevel': monster.mLevel,
       'MClass': monster.MClass,
       'MExp': monster.MExp,
       'MHIT': monster.MHIT,
       'MMinD': monster.MMinD,
       'MMaxD': monster.MMaxD,
       'MAttackRateOrg': monster.MAttackRateOrg,
       'MMoveRateOrg': monster.MMoveRateOrg,
       'MAttackRateNew': monster.MAttackRateNew,
       'MMoveRateNew': monster.MMoveRateNew,
       'MHP': monster.MHP,
       'MMP': monster.MMP,
       'MMoveRange': monster.MMoveRange,
       'MGbjType': monster.MGbjType,
       'MRaceType': monster.MRaceType,
       'MAiType': monster.MAiType,
       'MCastingDelay': monster.MCastingDelay,
       'MChaotic': monster.MChaotic,
       'MSameRace1': monster.MSameRace1,
       'MSameRace2': monster.MSameRace2,
       'MSameRace3': monster.MSameRace3, 
       'MSameRace4': monster.MSameRace4,
       'mSightRange': monster.mSightRange,
       'mAttackRange': monster.mAttackRange,
       'mSkillRange': monster.mSkillRange,
       'mBodySize': monster.mBodySize,
       'mDetectTransF': monster.mDetectTransF,
       'mDetectTransP': monster.mDetectTransP,
       'mDetectChao': monster.mDetectChao,
       'mAiEx': monster.mAiEx,
       'mScale': monster.mScale,
       'mIsResistTransF': monster.mIsResistTransF,
       'mIsEvent': monster.mIsEvent,
       'mIsTest': bool(monster.mIsTest),
       'mHPNew': monster.mHPNew,
       'mMPNew': monster.mMPNew,
       'mBuyMerchanID': monster.mBuyMerchanID,
       'mSellMerchanID': monster.mSellMerchanID,
       'mChargeMerchanID': monster.mChargeMerchanID,
       'mTransformWeight': monster.mTransformWeight,
       'mNationOp': monster.mNationOp,
       'mHPRegen': monster.mHPRegen,
       'mMPRegen': monster.mMPRegen,
       'IContentsLv': monster.IContentsLv,
       'mIsEventTest': monster.mIsEventTest,
       'mIsShowHp': monster.mIsShowHp,
       'mSupportType': monster.mSupportType,
       'mVolitionOfHonor': monster.mVolitionOfHonor,
       'mWMapIconType': monster.mWMapIconType,
       'mIsAmpliableTermOfValidity': monster.mIsAmpliableTermOfValidity,
       'mAttackType': monster.mAttackType,
       'mTransType': monster.mTransType,
       'mDPV': monster.mDPV,
       'mMPV': monster.mMPV,
       'mRPV': monster.mRPV,
       'mDDV': monster.mDDV,
       'mMDV': monster.mMDV,
       'mRDV': monster.mRDV,
       'mSubDDWhenCritical': monster.mSubDDWhenCritical,
       'mEnemySubCriticalHit': monster.mEnemySubCriticalHit,
       'mEventQuest': monster.mEventQuest,
       'mEScale': monster.mEScale
   }





def get_monster_resource(monster_id: int) -> Optional[DT_MonsterResource]:
    """Get monster resource by MID with caching"""
    query = "SELECT RFileName FROM DT_MonsterResource WHERE ROwnerID = ?"
    row = execute_query(query, (monster_id,), fetch_one=True)
    
    if row:
        return DT_MonsterResource(
            row.RFileName
        )
    return None

def get_monster_resource_url(RFileName):
    monster_model_no = f"{current_app.config['GITHUB_URL']}models/m{int(RFileName):05}"
    
def get_monster_pic_url(monster_id: int):
    monster_pic_url = f"{current_app.config['GITHUB_URL']}{monster_id}.png"
    return monster_pic_url

# Respawn Time Info
def get_monster_mtick(monster_id: int, mIsEvent: int) -> Union[tuple[int, int], tuple[int, int]]:
    query = f"SELECT mTick, mVarRespawnTick FROM {current_app.config['DATABASE_NAME']}.dbo.TblMonsterSpot WHERE mMID = ? AND mIsEvent = ?"
    result = execute_query(query, (monster_id, mIsEvent), fetch_one=True)
    
    if result is None:
        return 0, 0
    
    return result[0], result[1]



def get_monster_by_id(monster_id: int) -> Optional[Monster]:
    """Get monster by ID"""
    query = """
    SELECT 
        MID,
        MName,
        mLevel,
        MClass,
        MExp,
        MHIT,
        MMinD,
        MMaxD,
        MAttackRateOrg,
        MMoveRateOrg,
        MAttackRateNew,
        MMoveRateNew,
        MHP,
        MMP,
        MMoveRange,
        MGbjType,
        MRaceType,
        MAiType,
        MCastingDelay,
        MChaotic,
        MSameRace1,
        MSameRace2,
        MSameRace3,
        MSameRace4,
        mSightRange,
        mAttackRange,
        mSkillRange,
        mBodySize,
        mDetectTransF,
        mDetectTransP,
        mDetectChao,
        mAiEx,
        mScale,
        mIsResistTransF,
        mIsEvent,
        mIsTest,
        mHPNew,
        mMPNew,
        mBuyMerchanID,
        mSellMerchanID,
        mChargeMerchanID,
        mTransformWeight,
        mNationOp,
        mHPRegen,
        mMPRegen,
        IContentsLv,
        mIsEventTest,
        mIsShowHp,
        mSupportType,
        mVolitionOfHonor,
        mWMapIconType,
        mIsAmpliableTermOfValidity,
        mAttackType,
        mTransType,
        mDPV,
        mMPV,
        mRPV,
        mDDV,
        mMDV,
        mRDV,
        mSubDDWhenCritical,
        mEnemySubCriticalHit,
        mEventQuest,
        mEScale
    FROM DT_Monster 
    WHERE MID = ?
    """
    
    row = execute_query(query, (monster_id,), fetch_one=True)
    #print(row)
    if row:
        return Monster(
            MID=row.MID,
            MName=row.MName,
            mLevel=row.mLevel,
            MClass=row.MClass,
            MExp=row.MExp,
            MHIT=row.MHIT,
            MMinD=row.MMinD,
            MMaxD=row.MMaxD,
            MAttackRateOrg=row.MAttackRateOrg,
            MMoveRateOrg=row.MMoveRateOrg,
            MAttackRateNew=row.MAttackRateNew,
            MMoveRateNew=row.MMoveRateNew,
            MHP=row.MHP,
            MMP=row.MMP,
            MMoveRange=row.MMoveRange,
            MGbjType=row.MGbjType,
            MRaceType=row.MRaceType,
            MAiType=row.MAiType,
            MCastingDelay=row.MCastingDelay,
            MChaotic=row.MChaotic,
            MSameRace1=row.MSameRace1,
            MSameRace2=row.MSameRace2,
            MSameRace3=row.MSameRace3,
            MSameRace4=row.MSameRace4,
            mSightRange=row.mSightRange,
            mAttackRange=row.mAttackRange,
            mSkillRange=row.mSkillRange,
            mBodySize=row.mBodySize,
            mDetectTransF=int(row.mDetectTransF),
            mDetectTransP=int(row.mDetectTransP),
            mDetectChao=int(row.mDetectChao),
            mAiEx=row.mAiEx,
            mScale=row.mScale,
            mIsResistTransF=int(row.mIsResistTransF),
            mIsEvent=int(row.mIsEvent),
            mIsTest=int(row.mIsTest),
            mHPNew=row.mHPNew,
            mMPNew=row.mMPNew,
            mBuyMerchanID=row.mBuyMerchanID,
            mSellMerchanID=row.mSellMerchanID,
            mChargeMerchanID=row.mChargeMerchanID,
            mTransformWeight=row.mTransformWeight,
            mNationOp=row.mNationOp,
            mHPRegen=row.mHPRegen,
            mMPRegen=row.mMPRegen,
            IContentsLv=row.IContentsLv,
            mIsEventTest=int(row.mIsEventTest),
            mIsShowHp=int(row.mIsShowHp),
            mSupportType=row.mSupportType,
            mVolitionOfHonor=row.mVolitionOfHonor,
            mWMapIconType=row.mWMapIconType,
            mIsAmpliableTermOfValidity=int(row.mIsAmpliableTermOfValidity),
            mAttackType=row.mAttackType,
            mTransType=row.mTransType,
            mDPV=row.mDPV,
            mMPV=row.mMPV,
            mRPV=row.mRPV,
            mDDV=row.mDDV,
            mMDV=row.mMDV,
            mRDV=row.mRDV,
            mSubDDWhenCritical=row.mSubDDWhenCritical,
            mEnemySubCriticalHit=row.mEnemySubCriticalHit,
            mEventQuest=int(row.mEventQuest),
            mEScale=row.mEScale
        )
    return None

def get_monster_drops(monster_id: int) -> List[Dict]:
    """Get all drops for a specific monster"""
    monster_class_df = get_google_sheets_data(MONSTER_CLASS_URL)
    
    query = f"""
    SELECT
        a.MID,
        a.MName,
        a.mClass,
        w.DDropType,
        q.DPercent as GroupDropChance,
        q.DGroup as DropGroupID,
        w.DName as Description,
        e.DDrop as DDropID,
        e.DPercent as ItemDropChance,
        r.DItem,
        c.IName as ItemName,
        r.DNumber as Quantity,
        i.RFileName,
        i.RPosX,
        i.RPosY
    FROM {current_app.config['DATABASE_NAME']}.dbo.DT_Monster a
    LEFT JOIN {current_app.config['DATABASE_NAME']}.dbo.DT_MonsterDrop q ON a.MID = q.MID
    LEFT JOIN {current_app.config['DATABASE_NAME']}.dbo.TP_DropGroup w ON q.DGroup = w.DGroup
    LEFT JOIN {current_app.config['DATABASE_NAME']}.dbo.DT_DropGroup e ON w.DGroup = e.DGroup
    LEFT JOIN {current_app.config['DATABASE_NAME']}.dbo.DT_DropItem r ON e.DDrop = r.DDrop
    LEFT JOIN {current_app.config['DATABASE_NAME']}.dbo.DT_Item c ON r.DItem = c.IID
    LEFT JOIN {current_app.config['DATABASE_NAME']}.dbo.DT_ItemResource i ON c.IID = i.ROwnerID AND i.RType = 2
    WHERE a.MID = ? AND c.IIsEvent = 0
    ORDER BY r.DItem
    """
    
    rows = execute_query(query, (monster_id,))
    unique_results = {}

    for row in rows:
        # Get monster class info from Google Sheets data
        monster_class_info = monster_class_df[
            monster_class_df['MClass'] == row.mClass
        ]['MName'].iloc[0] if not monster_class_df.empty else ''

        key = row.DItem
        pic = None
        if row.RFileName and row.RPosX is not None and row.RPosY is not None:
            pic = f"{current_app.config['GITHUB_URL']}{row.RFileName.split('.')[0]}_{row.RPosX}_{row.RPosY}.png"

        if key not in unique_results:
            unique_results[key] = {
                "MID": row.MID,
                "MName": row.MName,
                "MClass": monster_class_info,
                "DDropType": row.DDropType,
                "DPercentGroup": row.GroupDropChance,
                "DGroup": row.DropGroupID,
                "DName": row.Description,
                "DDrop": row.DDropID,
                "DPercentItem": round(float(row.ItemDropChance), 1),
                "DItem": row.DItem,
                "IName": row.ItemName,
                "DNumber": row.Quantity,
                "Pic": pic if pic else f"{current_app.config['GITHUB_URL']}no_item_image.png",
                "count": 1
            }
        else:
            unique_results[key]["count"] += 1
            unique_results[key]["DNumber"] += row.Quantity

    results = list(unique_results.values())
    results.sort(key=lambda x: x["DItem"])
    return results


def get_monster_drop_info(item_id: int) -> List[Dict]:
    """Get all drops for a specific monster"""
    monster_class_df = get_google_sheets_data(MONSTER_CLASS_URL)
   
    query = f"""
        SELECT
            a.MID,
            a.MName,
            a.mClass,  
            w.DDropType,
            q.DPercent as GroupDropChance,
            q.DGroup as DropGroupID,
            w.DName as Description,
            e.DDrop as DDropID,
            e.DPercent as ItemDropChance,
            r.DItem,
            c.IName as ItemName,
            r.DNumber as Quantity
        FROM {current_app.config['DATABASE_NAME']}.dbo.DT_Monster a
        LEFT JOIN {current_app.config['DATABASE_NAME']}.dbo.DT_MonsterDrop q ON a.MID = q.MID
        LEFT JOIN {current_app.config['DATABASE_NAME']}.dbo.TP_DropGroup w ON q.DGroup = w.DGroup
        LEFT JOIN {current_app.config['DATABASE_NAME']}.dbo.DT_DropGroup e ON w.DGroup = e.DGroup
        LEFT JOIN {current_app.config['DATABASE_NAME']}.dbo.DT_DropItem r ON e.DDrop = r.DDrop
        LEFT JOIN {current_app.config['DATABASE_NAME']}.dbo.DT_Item c ON r.DItem = c.IID
        WHERE r.DItem = ? AND c.IIsEvent = 0
        ORDER BY a.MID
    """
   
    rows = execute_query(query, (item_id,), fetch_one=False)
    unique_results = {}
    for row in rows:
        # Получаем информацию о классе монстра из данных Google Sheets
        monster_class_info = monster_class_df[
            monster_class_df['MClass'] == row.mClass
        ]['MName'].iloc[0] if not monster_class_df.empty else ''
       
        # Используем комбинацию MID и DGroup как ключ
        key = (row.MID, row.DropGroupID)
        
        pic = f"{current_app.config['GITHUB_URL']}{row.MID}.png"
        
        if key not in unique_results:
            unique_results[key] = {
                "MID": row.MID,
                "MName": row.MName.replace("/n", " "),
                "MClass": monster_class_info,
                "DDropType": row.DDropType,
                "DPercentGroup": row.GroupDropChance,
                "DGroup": row.DropGroupID,
                "DName": row.Description,
                "DDrop": row.DDropID,
                "DPercentItem": round(float(row.ItemDropChance), 1),
                "DItem": row.DItem,
                "IName": row.ItemName,
                "DNumber": row.Quantity,
                "Pic": pic if pic else f"{current_app.config['GITHUB_URL']}no_item_image.png",
                "count": 1
            }
        else:
            # Обновляем только счетчик, так как это тот же самый монстр и группа
            unique_results[key]["count"] += 1
            
    # Преобразуем словарь в список и сортируем
    results = list(unique_results.values())
    results.sort(key=lambda x: (x["MID"], x["DGroup"]))
   
    return results


def get_monsters_by_class(class_ids: List[int], search_term: str = '') -> Tuple[List[Monster], Dict]:
    """Get monsters by class IDs with optional search"""
    class_str = ','.join(str(c) for c in class_ids)
    #print(f"XXXXXXX {class_str}")
    # Base query
    query = """
        SELECT *
        FROM DT_Monster 
        WHERE MClass IN ({})
    """.format(class_str)
    
    # Add search condition if provided
    params = []
    if search_term:
        query += " AND (MName LIKE ? OR CAST(MID AS VARCHAR) LIKE ?)"
        search_pattern = f'%{search_term}%'
        params.extend([search_pattern, search_pattern])
        
    query += " ORDER BY MID"
    
    #print(query)
    
    # Execute query
    rows = execute_query(query, params, fetch_one=False)
    
    # Convert to DT_Monster objects (with only needed fields)
    monsters = []
    file_paths = {}
    
    for row in rows:
        monster = Monster(
            MID=row.MID,
            MName=row.MName,
            mLevel=row.mLevel,
            MClass=row.MClass,
            MExp=row.MExp,
            MHIT=row.MHIT,
            MMinD=row.MMinD,
            MMaxD=row.MMaxD,
            MAttackRateOrg=row.MAttackRateOrg,
            MMoveRateOrg=row.MMoveRateOrg,
            MAttackRateNew=row.MAttackRateNew,
            MMoveRateNew=row.MMoveRateNew,
            MHP=row.MHP,
            MMP=row.MMP,
            MMoveRange=row.MMoveRange,
            MGbjType=row.MGbjType,
            MRaceType=row.MRaceType,
            MAiType=row.MAiType,
            MCastingDelay=row.MCastingDelay,
            MChaotic=row.MChaotic,
            MSameRace1=row.MSameRace1,
            MSameRace2=row.MSameRace2,
            MSameRace3=row.MSameRace3,
            MSameRace4=row.MSameRace4,
            mSightRange=row.mSightRange,
            mAttackRange=row.mAttackRange,
            mSkillRange=row.mSkillRange,
            mBodySize=row.mBodySize,
            mDetectTransF=int(row.mDetectTransF),
            mDetectTransP=int(row.mDetectTransP),
            mDetectChao=int(row.mDetectChao),
            mAiEx=row.mAiEx,
            mScale=row.mScale,
            mIsResistTransF=int(row.mIsResistTransF),
            mIsEvent=int(row.mIsEvent),
            mIsTest=int(row.mIsTest),
            mHPNew=row.mHPNew,
            mMPNew=row.mMPNew,
            mBuyMerchanID=row.mBuyMerchanID,
            mSellMerchanID=row.mSellMerchanID,
            mChargeMerchanID=row.mChargeMerchanID,
            mTransformWeight=row.mTransformWeight,
            mNationOp=row.mNationOp,
            mHPRegen=row.mHPRegen,
            mMPRegen=row.mMPRegen,
            IContentsLv=row.IContentsLv,
            mIsEventTest=int(row.mIsEventTest),
            mIsShowHp=int(row.mIsShowHp),
            mSupportType=row.mSupportType,
            mVolitionOfHonor=row.mVolitionOfHonor,
            mWMapIconType=row.mWMapIconType,
            mIsAmpliableTermOfValidity=int(row.mIsAmpliableTermOfValidity),
            mAttackType=row.mAttackType,
            mTransType=row.mTransType,
            mDPV=row.mDPV,
            mMPV=row.mMPV,
            mRPV=row.mRPV,
            mDDV=row.mDDV,
            mMDV=row.mMDV,
            mRDV=row.mRDV,
            mSubDDWhenCritical=row.mSubDDWhenCritical,
            mEnemySubCriticalHit=row.mEnemySubCriticalHit,
            mEventQuest=int(row.mEventQuest),
            mEScale=row.mEScale
        )
        monsters.append(monster)
        file_paths[row.MID] = f"{current_app.config['GITHUB_URL']}{row.MID}.png"

    return monsters, file_paths



def get_monsterabnormalResist_data(monster_id: int) -> Optional[List[DT_MonsterAbnormalResist]]:
    """Get monster resource by MID with caching"""
    query = """
        SELECT DISTINCT
            a.MID,
            b.MName,
            a.AID,
            c.ADesc,
            c1.AType,
            c1.AName AS 'ATypeDesc',
            d1.SID,
            d1.SName,
            v1.mSPID,
            v1.mName,
            v1.mDesc,
            v1.mSpriteFile,
            v1.mSpriteX,
            v1.mSpriteY 
            -- Можно добавить модули:
            --   e1.MID AS 'ModuleID',
            --   e1.MType,
            --   e2.MName AS 'MTypeDesc',
            --   e2.MDesc,
            --   
            --   
            --   e1.MAParam,
            --   e2.MAParamName,
            --   
            --   e1.MBParam,
            --   e2.MBParamName,
            --   
            --   e1.MCParam,
            --   e2.MCParamName
            --
    
    FROM
    DT_MonsterAbnormalResist AS a
    
    LEFT OUTER JOIN DT_Monster AS b ON ( b.MID = a.MID )
    
    LEFT OUTER JOIN DT_Abnormal AS c ON ( c.AID = a.AID )
    LEFT OUTER JOIN TP_AbnormalType AS c1 ON ( c1.AType = c.AType )

    LEFT OUTER JOIN DT_SkillAbnormal AS d ON ( c.AID = d.AbnormalID )
    LEFT OUTER JOIN DT_Skill AS d1 ON ( d.SID = d1.SID )
    LEFT OUTER JOIN DT_SkillPackSkill AS v ON ( d1.SID = v.mSID )
    LEFT OUTER JOIN DT_SkillPack AS v1 ON ( v.mSPID = v1.mSPID ) 
    
    --   LEFT JOIN DT_AbnormalModule AS e ON (c.AID = e.AID)
    --   LEFT JOIN DT_Module AS e1 ON (e.MID = e1.MID)
    --   LEFT JOIN TP_ModuleType AS e2 ON (e1.MType = e2.MType)
    
    WHERE
        a.MID = ? 
    ORDER BY
        a.MID
    """
    rows  = execute_query(query, (monster_id,), fetch_one=False)
    
    if rows:
        result = []
        for row in rows:
            # Создаем базовый словарь с данными
            resist_data = {
                'MID': row[0],
                'MName': row[1],
                'AID': row[2],
                'ADesc': clean_description(row[3]),
                'AType': row[4],
                'ATypeDesc': clean_description(row[5]),
                'SID': row[6],
                'SName': row[7],
                'mSPID': row[8],
                'SkillPackName': row[9],
                'SkillPackDesc': clean_description(row[10]),
            }
            
            # Генерируем путь к иконке используя get_skill_icon_path
            resist_data['skill_icon_path'] = get_skill_icon_path(
                sprite_file=row[11],  # mSpriteFile
                sprite_x=row[12],     # mSpriteX
                sprite_y=row[13]      # mSpriteY
            )
            
            result.append(resist_data)
        
        return result
    
    return None





# DT_MonsterAttributeAdd Check
def get_monster_attribute_add_data(monster_id: int) -> Optional[List[DT_MonsterAttributeAdd]]:
    attribute_type_weapon_df = get_google_sheets_data(ATTRIBUTE_TYPE_WEAPON_URL)

    query = """
    SELECT
        a.AID,
        b.AType,
        b.ALevel,
        b.ADiceDamage,
        b.ADamage 
    FROM
        DT_MonsterAttributeAdd AS a
    INNER JOIN DT_AttributeAdd AS b ON ( a.AID = b.AID )

    WHERE
        a.MID = ?
    """
    
    row = execute_query(query, (monster_id,), fetch_one=True)
    
    if row:
        AName = attribute_type_weapon_df[attribute_type_weapon_df['AType'] == row[1]]['AName'].iloc[0] if not attribute_type_weapon_df.empty else ''

        return DT_MonsterAttributeAdd(
            row.AID,
            row.AType,
            AName,
            row.ALevel,
            row.ADiceDamage,
            row.ADamage
        )
    else:
        return None
    


# DT_MonsterAttributeResist Check
def get_monster_attribute_resist_data(monster_id: int) -> Optional[List[DT_MonsterAttributeResist]]:
    attribute_type_weapon_df = get_google_sheets_data(ATTRIBUTE_TYPE_ARMOR_URL)

    query = """
    SELECT
        a.AID,
        b.AType,
        b.ALevel,
        b.ADiceDamage,
        b.ADamage 
    FROM
        DT_MonsterAttributeResist AS a
    INNER JOIN DT_AttributeResist AS b ON ( a.AID = b.AID )
    
    WHERE
        a.MID = ?
    """
    
    row = execute_query(query, (monster_id,), fetch_one=True)
    
    if row:
        AName = attribute_type_weapon_df[attribute_type_weapon_df['AType'] == row[1]]['AName'].iloc[0] if not attribute_type_weapon_df.empty else ''

        return DT_MonsterAttributeResist(
            row.AID,
            row.AType,
            AName,
            row.ALevel,
            row.ADiceDamage,
            row.ADamage
        )
    else:
        return None
    
    
# DT_ItemProtect Check
def get_monster_protect_data(monster_id: int) -> Optional[List[DT_MonsterProtect]]:
    
    query = """
    SELECT
        a.SID,
        c.SID as 'ProtectSID',
        e.SName,
        c.SLevel,
        c.SDPV,
        c.SMPV,
        c.SRPV,
        c.SDDV,
        c.SMDV,
        c.SRDV 
    FROM
        DT_MonsterProtect AS a

    INNER JOIN DT_Protect AS c ON ( a.SID = c.SID )
    INNER JOIN TP_SlainType AS e ON ( c.SType = e.SType ) 
    
    WHERE a.MID = ?
    """
    
    row = execute_query(query, (monster_id,), fetch_one=True)
    
    if row:
        return DT_MonsterProtect(
            row.SID,
            row.ProtectSID,
            row.SName,
            row.SLevel,
            row.SDPV,
            row.SMPV,
            row.SRPV,
            row.SDDV,
            row.SMDV,
            row.SRDV
        )
    else:
        return None
    
    

# DT_MonsterSlain Check
def get_monster_slain_data(item_id: int) -> Optional[List[DT_MonsterSlain]]:
    
    query = """
    SELECT
        a.SID,
        b.SType,
        c.SName,
        b.SLevel,
        b.SHitPlus,
        b.SDDPlus,
        b.SRHitPlus,
        b.SRDDPlus
        
    FROM DT_MonsterSlain AS a
        
    INNER JOIN DT_Slain AS b ON (a.SID = b.SID)
        
    INNER JOIN TP_SlainType AS c ON (b.SType = c.SType)
        
    WHERE a.MID = ?
    """
    
    row = execute_query(query, (item_id,), fetch_one=True)
    
    if row:
        return DT_MonsterSlain(
            row.SID,
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
    
    
    

# ? ^^ EASY Functions

# Получить имя монстра по MID
def get_monster_name(monster_id: int):
    query = "SELECT MName FROM DT_Monster WHERE MID = ?"
    mname = execute_query(query, (monster_id,), fetch_one=True)
    
    if mname:
        return mname[0].replace("\\n", " ").replace("/n", " ")
    return None
