from typing import List, Dict, Optional
from flask import current_app
from services.database import execute_query
from services.utils import get_monster_pic_url, get_item_pic_url


DEFAULT_IMAGE_URL = "https://raw.githubusercontent.com/Aksel911/R2-HTML-DB/main/static/no_monster/no_monster_image.png"

def safe_get_item_pic(item_id: int) -> str:
    """Безопасное получение URL картинки предмета с fallback на дефолтное изображение"""
    try:
        pic_url = get_item_pic_url(item_id)
        return pic_url if pic_url else DEFAULT_IMAGE_URL
    except Exception:
        return DEFAULT_IMAGE_URL

def get_quests_data() -> List[Dict]:
    """Получение данных о квестах"""
    try:
        query = """
        SELECT
            a.mQuestNo,
            a.mQuestNm,
            a.mClass,
            b.mDesc AS class_desc,
            a.mLevel1,
            a.mLevel2,
            a.mPreQuestNo,
            a.mIsOverlap,
            a.mQuestDesc,
            e.mDesc AS quest_info_desc,
            a.mAbandonment,
            a.mDifficulty,
            a.mRewardNo,
            c.mExp,
            c.mID AS reward_item_id,
            c1.IName AS reward_name,
            c.mCnt AS reward_count,
            c.mBinding,
            c.mStatus,
            c.mEffTime,
            c.mValTime,
            w.mID AS required_item_id,
            c2.IName AS required_item_name,
            w.mCnt AS required_count,
            a.mPlace,
            r.mPlaceNm AS place_name,
            a.mPosX,
            a.mPosY,
            a.mPosZ,
            d.mMonsterID AS ref_monster_id,
            a.mFindNPC,
            q1.MName AS find_npc_name,
            a.mCompletionNPC,
            q.MName AS completion_npc_name 
        FROM TblQuest AS a
        LEFT OUTER JOIN FNLParm1602.dbo.TP_PlayerClass AS b ON (b.mClassNo = a.mClass)
        LEFT OUTER JOIN TblQuestReward AS c ON (c.mRewardNo = a.mRewardNo)
        LEFT OUTER JOIN DT_Item AS c1 ON (c1.IID = c.mID)
        LEFT OUTER JOIN TblQuestRefMonster AS d ON (d.mQuestNo = a.mQuestNo)
        LEFT OUTER JOIN DT_Monster AS q ON (q.MID = a.mCompletionNPC)
        LEFT OUTER JOIN DT_Monster AS q1 ON (q1.MID = d.mMonsterID)
        LEFT OUTER JOIN TblQuestCondition AS w ON (w.mQuestNo = a.mQuestNo)
        LEFT OUTER JOIN DT_Item AS c2 ON (c2.IID = w.mID)
        LEFT OUTER JOIN TblQuestInfo AS e ON (e.mQuestNo = a.mQuestNo)
        LEFT OUTER JOIN TblPlace AS r ON (r.mPlaceNo = a.mPlace)
        ORDER BY a.mQuestNo
        """
        
        results = execute_query(query)
        quests_dict = {}  # Словарь для группировки квестов по mQuestNo
        
        for row in results:
            quest_no = row[0]
            
            # Если квест еще не добавлен в словарь, создаем базовую структуру
            if quest_no not in quests_dict:
                quests_dict[quest_no] = {
                    'questNo': quest_no,
                    'questName': row[1],
                    'level': f"{row[4]}-{row[5]}" if row[5] else str(row[4]),
                    'class': row[3] or 'Все классы',
                    'difficulty': row[11],
                    'description': row[8],
                    'place': row[25],
                    'rewards': {
                        'exp': row[13],
                        'itemList': []
                    },
                    'requirements': {
                        'itemList': []
                    },
                    'npcs': {
                        'completion': None,
                        'find': None
                    }
                }

                # Добавляем NPC только один раз при создании квеста
                if row[32]:  # mCompletionNPC
                    try:
                        npc_pic = get_monster_pic_url(row[32])
                        quests_dict[quest_no]['npcs']['completion'] = {
                            'id': row[32],
                            'name': row[33],
                            'pic': npc_pic if npc_pic else DEFAULT_IMAGE_URL
                        }
                    except Exception:
                        quests_dict[quest_no]['npcs']['completion'] = {
                            'id': row[32],
                            'name': row[33],
                            'pic': DEFAULT_IMAGE_URL
                        }

                if row[30]:  # mFindNPC
                    try:
                        npc_pic = get_monster_pic_url(row[30])
                        quests_dict[quest_no]['npcs']['find'] = {
                            'id': row[30],
                            'name': row[31],
                            'pic': npc_pic if npc_pic else DEFAULT_IMAGE_URL
                        }
                    except Exception:
                        quests_dict[quest_no]['npcs']['find'] = {
                            'id': row[30],
                            'name': row[31],
                            'pic': DEFAULT_IMAGE_URL
                        }

            # Добавляем награду, если она есть и её еще нет в списке
            if row[14] and row[15]:  # reward_item_id и reward_name
                reward_item = {
                    'id': row[14],
                    'name': row[15] or 'Неизвестный предмет',
                    'count': row[16] or 1,
                    'pic': safe_get_item_pic(row[14])
                }
                if reward_item not in quests_dict[quest_no]['rewards']['itemList']:
                    quests_dict[quest_no]['rewards']['itemList'].append(reward_item)

            # Добавляем требуемый предмет, если он есть и его еще нет в списке
            if row[21] and row[22]:  # required_item_id и required_item_name
                required_item = {
                    'id': row[21],
                    'name': row[22] or 'Неизвестный предмет',
                    'count': row[23] or 1,
                    'pic': safe_get_item_pic(row[21])
                }
                if required_item not in quests_dict[quest_no]['requirements']['itemList']:
                    quests_dict[quest_no]['requirements']['itemList'].append(required_item)

        # Преобразуем словарь в список
        quests = list(quests_dict.values())
        return quests
        
    except Exception as e:
        print(f"Error getting quests data: {e}")
        return []