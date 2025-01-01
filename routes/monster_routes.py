from flask import Blueprint, render_template, current_app, abort, jsonify, request
import requests
from services.monster_service import (
    get_monster_by_id,
    get_monster_drops,
    get_monsters_by_class,
    get_monster_resource,
    get_monster_mtick,
    get_monsterabnormalResist_data,
    get_monster_attribute_add_data,
    get_monster_attribute_resist_data,
    get_monster_protect_data,
    get_monster_slain_data,
    apply_monster_filters,
    monster_to_dict,
    
    
)
from services.utils import get_google_sheets_data
from services.merchant_service import (
    get_merchant_items,
    get_payment_type_name
)
from services.database import execute_query
from config.settings import MONSTER_CLASS_URL, MONSTER_RACE_URL, MONSTER_LOCATION_URL
import pandas as pd
from functools import wraps

bp = Blueprint('monsters', __name__)


MONSTER_ROUTES = {
    'monster_all': {
        'classes': list(range(1, 39)),  # Все классы монстров
        'title': '[Монстры] Все монстры',
        'header': 'Все монстры'
    },
    'monster_regular': {
        'classes': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
        'title': '[Монстры] Обычные монстры',
        'header': 'Обычные монстры'
    },
    'monster_boss': {
        'classes': [29, 38, 37, 36, 34],
        'title': '[Монстры] Боссы',
        'header': 'Боссы'
    },
    'monster_raidboss': {
    'classes': [26],
    'title': '[Монстры] Рейд-Боссы',
    'header': 'Рейд-Боссы'
    },
    'monster_imennoy': {
    'classes': [28],
    'title': '[Монстры] Именные-Боссы',
    'header': 'Именные-Боссы'
    },
    'monster_npc': {
        'classes': [23],
        'title': '[Монстры] NPC',
        'header': 'NPC'
    },
    'monster_event': {
        'classes': [27],
        'title': '[Монстры] Монстры события',
        'header': 'Монстры события'
    }
}

# Route decorator for monster filtering
def with_monster_filters(allowed_classes):
    """Enhanced decorator for filtering with pagination and class restrictions"""
    def decorator(original_route):
        @wraps(original_route)
        def wrapped_route(*args, **kwargs):
            try:
                # Get search term
                search_term = request.args.get('search', '')
                
                monsters = []
                file_paths = {}
                
                # for monsters_type in allowed_classes:
                #     type_monsters, type_paths = get_monsters_by_class([monsters_type], search_term)
                #     monsters.extend(type_monsters)
                #     file_paths.update(type_paths)
                
                type_monsters, type_paths = get_monsters_by_class(allowed_classes, search_term)
                monsters.extend(type_monsters)
                file_paths.update(type_paths)
                
                
                # If it's an AJAX request, handle filtering
                if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                    filters = request.args.to_dict()
                    
                    # Apply filters
                    filtered_monsters = apply_monster_filters(monsters, filters)
                    
                    # Get pagination parameters
                    page = request.args.get('page', 1, type=int)
                    per_page = request.args.get('per_page', 25000, type=int) # ! PP LIMIT
                
                    # Apply pagination
                    start_idx = (page - 1) * per_page
                    end_idx = start_idx + per_page
                    paginated_monsters = filtered_monsters[start_idx:end_idx]
                    
                    # Convert to dict for response
                    monsters_dict = [monster_to_dict(item) for item in paginated_monsters]
                    
                    return jsonify({
                        'monsters': monsters_dict,
                        'resources': file_paths,
                        'total': len(filtered_monsters),
                        'pages': (len(filtered_monsters) + per_page - 1) // per_page
                    })
                    
                # For normal request, pass data to route
                return original_route(items=monsters, item_resources=file_paths, *args, **kwargs)
                
            except Exception as e:
                print(f"Error in route: {str(e)}")
                import traceback
                traceback.print_exc()
                return jsonify({'error': str(e)}), 500
                
        return wrapped_route
    return decorator



@bp.route('/monster/<int:monster_id>')
def monster_detail(monster_id: int):
    """Страница деталей монстра"""
    # Получение данных монстра
    if not (monster := get_monster_by_id(monster_id)):
        return "Monster not found", 404
    #print(monster)
    # Преобразуем monster в словарь для удобства работы
    monster_dict = {
        'MID': monster.MID,
        'MName': monster.MName.replace('/n', ' '),
        'MClass': monster.MClass,
        'mLevel': monster.mLevel,
        'mExp': monster.MExp,
        'MHIT': monster.MHIT,
        'MMinD': monster.MMinD,
        'MMaxD': monster.MMaxD,
        'MAttackRateOrg': monster.MAttackRateOrg,
        'MMoveRateOrg': monster.MMoveRateOrg,
        'MHP': monster.MHP,
        'MMP': monster.MMP,
        'MMoveRange': monster.MMoveRange,
        'MRaceType': monster.MRaceType,
        'mSightRange': monster.mSightRange,
        'mAttackRange': monster.mAttackRange,
        'mSkillRange': monster.mSkillRange,
        'mScale': monster.mScale,
        'mIsEvent': monster.mIsEvent,
        'mIsTest': monster.mIsTest,
        'mHPRegen': monster.mHPRegen,
        'mMPRegen': monster.mMPRegen,
        'mIsShowHp': monster.mIsShowHp,
        'mAttackType': monster.mAttackType,
        'mVolitionOfHonor': monster.mVolitionOfHonor,
        'MAttackRateNew': monster.MAttackRateNew,
        'MMoveRateNew': monster.MMoveRateNew,
        'MGbjType': monster.MGbjType,
        'MAiType': monster.MAiType,
        'MCastingDelay': monster.MCastingDelay,
        'MChaotic': monster.MChaotic,
        'MSameRace1': monster.MSameRace1,
        'MSameRace2': monster.MSameRace2,
        'MSameRace3': monster.MSameRace3,
        'MSameRace4': monster.MSameRace4,
        'mBodySize': monster.mBodySize,
        'mDetectTransF': int(monster.mDetectTransF),
        'mDetectTransP': int(monster.mDetectTransP),
        'mDetectChao': int(monster.mDetectChao),
        'mAiEx': monster.mAiEx,
        'mIsResistTransF': int(monster.mIsResistTransF),
        'mHPNew': monster.mHPNew,
        'mMPNew': monster.mMPNew,
        'mBuyMerchanID': monster.mBuyMerchanID,
        'mSellMerchanID': monster.mSellMerchanID,
        'mChargeMerchanID': monster.mChargeMerchanID,
        'mTransformWeight': monster.mTransformWeight,
        'mNationOp': monster.mNationOp,
        'IContentsLv': monster.IContentsLv,
        'mIsEventTest': int(monster.mIsEventTest),
        'mSupportType': monster.mSupportType,
        'mWMapIconType': monster.mWMapIconType,
        'mIsAmpliableTermOfValidity': int(monster.mIsAmpliableTermOfValidity),
        'mTransType': monster.mTransType,
        'mDPV': monster.mDPV,
        'mMPV': monster.mMPV,
        'mRPV': monster.mRPV,
        'mDDV': monster.mDDV,
        'mMDV': monster.mMDV,
        'mRDV': monster.mRDV,
        'mSubDDWhenCritical': monster.mSubDDWhenCritical,
        'mEnemySubCriticalHit': monster.mEnemySubCriticalHit,
        'mEventQuest': int(monster.mEventQuest),
        'mEScale': monster.mEScale
    }
    

    # Получение данных из Google Sheets
    sheets_data = {
        'class': get_google_sheets_data(MONSTER_CLASS_URL),
        'race': get_google_sheets_data(MONSTER_RACE_URL),
        'location': get_google_sheets_data(MONSTER_LOCATION_URL)
    }

    # Получение информации о классе
    class_info = {"MName": ""}
    if not sheets_data['class'].empty:
        class_match = sheets_data['class'][sheets_data['class']['MClass'] == monster_dict['MClass']]
        if not class_match.empty:
            class_info["MName"] = class_match.iloc[0]['MName']

    # Получение информации о расе
    race_info = {"mDesc": None}
    if not sheets_data['race'].empty:
        race_match = sheets_data['race'][sheets_data['race']['MRaceType'] == monster_dict['MRaceType']]
        if not race_match.empty:
            race_info["mDesc"] = race_match.iloc[0]['mDesc']

    
    
    
    def get_respawn_info(time_in_seconds):
        hours = int(time_in_seconds / 60) // 60
        minutes = int(time_in_seconds / 60)
        
        # Формируем строку времени
        if hours > 0 and minutes % 60 > 0:
            formatted_time = f"{hours}ч {minutes % 60}м"
        elif hours > 0:
            formatted_time = f"{hours}ч"
        elif minutes > 0:
            formatted_time = f"{minutes}м"
        else:
            formatted_time = f"{time_in_seconds} сек"
            
        return {
            "mTickMin": int(time_in_seconds / 60),
            "mTickSec": time_in_seconds % 60,
            "mTick": time_in_seconds,
            "hours": hours,
            "formatted_time": formatted_time
        }
    
    # Получение времени респауна
    respawn_info_normal = {}
    respawn_info_event = {}

    # Для mIsEvent = 0
    mTick_normal, mVarRespawnTick_normal = get_monster_mtick(monster_id, 0)
    if mTick_normal > 0:
        respawn_info_normal = {
            "normal": get_respawn_info(mTick_normal),
            "event": get_respawn_info(mVarRespawnTick_normal)
        }

    # Для mIsEvent = 1
    mTick_event, mVarRespawnTick_event = get_monster_mtick(monster_id, 1)
    if mTick_event > 0:
        respawn_info_event = {
            "normal": get_respawn_info(mTick_event),
            "event": get_respawn_info(mVarRespawnTick_event)
        }
    
    
    
    
    # Получение локации монстра
    monster_location = []
    if not sheets_data['location'].empty:
        location_match = sheets_data['location'][sheets_data['location']['MID'] == monster_id]
        if not location_match.empty:
            monster_location = [
                {
                    "Location": row['mPlaceNmRus'],
                    "LocationLevel": None if pd.isna(row['mMapNmRus']) else row['mMapNmRus']
                }
                for _, row in location_match.iterrows()
            ]
            #print(monster_location)


    # Обработка изображений
    file_path = f"{current_app.config['GITHUB_URL']}{monster_id}.png"
    file_path_gif = f"{current_app.config['GITHUB_URL']}gif/{monster_id}_IDLE.gif"
    try:
        if requests.head(file_path_gif).status_code != 200:
            file_path_gif = None
    except:
        file_path_gif = None

    # Получение модели монстра
    prefix = 'm'  # Префикс по умолчанию для всех монстров
    monster_model_no = None
    if model_result := get_monster_resource(monster_id):
        monster_model_no = f"{int(model_result.RFileName):05}"

    # Получение дополнительных данных
    monster_abnormalResist_data = get_monsterabnormalResist_data(monster_id) or None
    monster_attribute_add_data = get_monster_attribute_add_data(monster_id) or None
    monster_attribute_resist_data = get_monster_attribute_resist_data(monster_id) or None
    monster_protect_data = get_monster_protect_data(monster_id) or None
    monster_slain_data = get_monster_slain_data(monster_id) or None

    return render_template(
        'monster_core/monster_page_detail.html',
        item=monster_dict,  # Передаем словарь вместо объекта
        file_path=file_path,
        file_path_gif=file_path_gif,
        classinfo=class_info,
        raceinfo=race_info,
        respawn_info_normal=respawn_info_normal,
        respawn_info_event=respawn_info_event,
        monlocationinfo=monster_location,
        merchant_items=get_merchant_items(monster_id),
        mondropinfo=get_monster_drops(monster_id),
        monstermodelno_result=monster_model_no,
        monster_abnormalResist_data=monster_abnormalResist_data,
        monster_attribute_add_data=monster_attribute_add_data,
        monster_attribute_resist_data=monster_attribute_resist_data,
        monster_protect_data=monster_protect_data,
        monster_slain_data=monster_slain_data,
        prefix=prefix
    )
    
    
    
# Изменим определение маршрута
@bp.route('/monster_<type>')
def monster_page(type):
    route_key = f'monster_{type}'
    config = MONSTER_ROUTES.get(route_key)
    
    if not config:
        abort(404)
        
    @with_monster_filters(config['classes'])
    def handle_monster_page(items=None, item_resources=None):
        # If it's an AJAX request
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            try:
                # Get filters from request
                filters = request.args.to_dict()
                
                # Apply filters
                filtered_monsters = apply_monster_filters(items, filters)
                
                # Get pagination parameters
                page = request.args.get('page', 1, type=int)
                per_page = request.args.get('per_page', 25000, type=int)
                
                # Calculate pagination
                start_idx = (page - 1) * per_page
                end_idx = start_idx + per_page
                paginated_monsters = filtered_monsters[start_idx:end_idx]
                
                # Convert monsters to dict for JSON response
                monsters_dict = [monster_to_dict(monster) for monster in paginated_monsters]
                
                return jsonify({
                    'monsters': monsters_dict,
                    'resources': item_resources,
                    'total': len(filtered_monsters),
                    'filtered': len(filtered_monsters),
                    'pages': (len(filtered_monsters) + per_page - 1) // per_page
                })
                
            except Exception as e:
                print(f"Error processing request: {str(e)}")
                import traceback
                traceback.print_exc()
                return jsonify({'error': str(e)}), 500
        
        # For normal page load
        return render_template(
            'monster_core/monster_page_route.html',
            items=items,
            item_resources=item_resources,
            title=config["title"],
            header=config['header']
        )
    
    return handle_monster_page()




# @bp.route('/monster_regular')
# def monster_regular():
#     monsters, file_paths = get_monsters_by_class(
#         [1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 24, 25, 31, 32, 2]
#     )
#     return render_template('monster/monster_regular.html', items=monsters, item_resources=file_paths)

# @bp.route('/monster_imennoy')
# def monster_imennoy():
#     monsters, file_paths = get_monsters_by_class([28])
#     return render_template('monster/monster_imennoy.html', items=monsters, item_resources=file_paths)

# @bp.route('/monster_boss')
# def monster_boss():
#     monsters, file_paths = get_monsters_by_class([29, 33, 34, 35, 36, 37, 38])
#     return render_template('monster/monster_boss.html', items=monsters, item_resources=file_paths)

# @bp.route('/monster_raidboss')
# def monster_raid_boss():
#     monsters, file_paths = get_monsters_by_class([26])
#     return render_template('monster/monster_raidboss.html', items=monsters, item_resources=file_paths)

# @bp.route('/monster_event')
# def monster_event():
#     monsters, file_paths = get_monsters_by_class([27])
#     return render_template('monster/monster_event.html', items=monsters, item_resources=file_paths)

# @bp.route('/monster_npc')
# def monster_npc():
#     monsters, file_paths = get_monsters_by_class([23, 35])
#     return render_template('monster/monster_npc.html', items=monsters, item_resources=file_paths)