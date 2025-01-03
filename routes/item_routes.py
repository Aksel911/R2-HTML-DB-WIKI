import traceback
from flask import Blueprint, abort, render_template, jsonify, request, render_template, current_app

from services.item_service import (
    apply_filters,
    item_to_dict,
    get_item_by_id, 
    get_item_resource,
    get_items_by_type,
    get_item_model_resource,
    get_specific_proc_item,
    get_itemabnormalResist_data,
    get_rune_bead_data,
    get_item_bead_module_data,
    get_item_bead_holeprob_data,
    get_item_attribute_add_data,
    get_item_attribute_resist_data,
    get_item_protect_data,
    get_item_slain_data,
    get_item_panalty_data
)
from services.monster_service import get_monster_drop_info
from services.merchant_service import get_merchant_sellers
from services.craft_service import (
    check_base_items_for_craft,
    check_next_craft_item
)
from services.skill_service import get_item_skill, get_sid_by_spid
from services.abnormal_service import get_abnormal_in_skill
from functools import wraps, partial
from concurrent.futures import ThreadPoolExecutor



bp = Blueprint('items', __name__)


# ! Словарь с маппингом URL -> конфигурация
# TODO: Квестовые предметы
ITEM_ROUTES = {
        'item_all': {
        'types': list(range(43)),
        'title': '[Предметы] Все предметы',
        'header': 'Все предметы'
    },
    'weapon': {
        'types': [1, 18, 20],
        'title': '[Предметы] Оружие',
        'header': 'Оружие'
    },
    'armor': {
        'types': [3],
        'title': '[Предметы] Броня',
        'header': 'Броня'
    },
    'gloves': {
        'types': [7],
        'title': '[Предметы] Перчатки',
        'header': 'Перчатки'
    },
    'boots': {
        'types': [6],
        'title': '[Предметы] Ботинки',
        'header': 'Ботинки'
    },
    'helmet': {
        'types': [8],
        'title': '[Предметы] Шлема',
        'header': 'Шлема'
    },
    'shield': {
        'types': [2],
        'title': '[Предметы] Щиты',
        'header': 'Щиты'
    },
    'arrows': {
        'types': [19],
        'title': '[Предметы] Стрелы',
        'header': 'Стрелы'
    },
    'cloak': {
        'types': [17],
        'title': '[Предметы] Плащи',
        'header': 'Плащи'
    },
    'materials': {
        'types': [10, 16],
        'title': '[Предметы] Материалы',
        'header': 'Материалы'
    },
    'ring': {
        'types': [4],
        'title': '[Предметы] Кольца',
        'header': 'Кольца'
    },
    'belt': {
        'types': [9],
        'title': '[Предметы] Ремни',
        'header': 'Ремни'
    },
    'necklace': {
        'types': [5],
        'title': '[Предметы] Ожерелья',
        'header': 'Ожерелья'
    },
    'earrings': {
        'types': [42],
        'title': '[Предметы] Серьги',
        'header': 'Серьги'
    },
    'books': {
        'types': [12],
        'title': '[Предметы] Книги',
        'header': 'Книги'
    },
    'potions': {
        'types': [10],
        'title': '[Предметы] Зелья',
        'header': 'Зелья'
    },
    'etc': {
        'types': [14, 16, 13, 11],
        'title': '[Предметы] Разное',
        'header': 'Разное'
    },
    'event': {
        'types': [15],
        'title': '[Предметы] Ивентовые предметы',
        'header': 'Ивентовые предметы'
    },
    'sphere': {
        'types': [22, 23, 24, 25, 26, 27, 28, 29],
        'title': '[Предметы] Сферы',
        'header': 'Сферы'
    },
    'quest': {
    'types': [15, 16],
    'title': '[Предметы] Квестовые предметы',
    'header': 'Квестовые предметы'
    }
}


# ! Главная страница предметов
def with_filters(allowed_types):
    """Enhanced decorator for filtering with pagination and type restrictions"""
    def decorator(original_route):
        @wraps(original_route)
        def wrapped_route(*args, **kwargs):
            try:
                # Get search term
                search_term = request.args.get('search', '')
                
                # Get initial data for allowed types
                items = []
                file_paths = {}
                
                for item_type in allowed_types:
                    type_items, type_paths = get_items_by_type([item_type], search_term)
                    items.extend(type_items)
                    file_paths.update(type_paths)

                # If it's an AJAX request, handle filtering
                if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                    filters = request.args.to_dict()
                    
                    # Apply filters
                    filtered_items = apply_filters(items, filters)
                    
                    # Get pagination parameters
                    page = request.args.get('page', 1, type=int)
                    per_page = request.args.get('per_page', 25000, type=int) # ! PP LIMIT
                    
                    # Apply pagination
                    start_idx = (page - 1) * per_page
                    end_idx = start_idx + per_page
                    paginated_items = filtered_items[start_idx:end_idx]
                    
                    # Convert to dict for response
                    items_dict = [item_to_dict(item) for item in paginated_items]
                    #print(items_dict)
                    return jsonify({
                        'items': items_dict,
                        'resources': file_paths,
                        'total': len(filtered_items),
                        'pages': (len(filtered_items) + per_page - 1) // per_page
                    })
                
                # For normal request, pass data to route
                return original_route(items_wep=items, item_resources=file_paths, *args, **kwargs)
                
            except Exception as e:
                print(f"Error in route: {str(e)}")
                import traceback
                traceback.print_exc()
                return jsonify({'error': str(e)}), 500
                
        return wrapped_route
    return decorator

@bp.route('/<item_type>')
def item_page(item_type):
    """Universal route handler for all item types"""
    # Get configuration for the requested item type
    config = ITEM_ROUTES.get(item_type)
    if not config:
        abort(404)
    
    @with_filters(config['types'])
    def handle_item_page(items_wep=None, item_resources=None):
        if items_wep is None:
            # Особая обработка для квестовых предметов
            # if item_type == 'quest':
            #     mType = 1
            #     query = "SELECT mID FROM TblQuestCondition WHERE mType = ?"
                
            #     query_rows = execute_query(query, (mType,), fetch_one=False) 
            #     item_ids = [row.mID for row in query_rows]
                
            #     if not item_ids:
            #         return render_template(
            #             'item_core/item_page_route.html',
            #             items_wep=[],
            #             item_resources={},
            #             title=config["title"],
            #             header=config['header']
            #         )
                    
            #     items_wep, item_resources = get_items_by_type(item_ids)
            # else:
            
            # Стандартная обработка для всех остальных типов
            search_term = request.args.get('search', '')
            items_wep, item_resources = get_items_by_type(config['types'], search_term)
        
        return render_template(
            'item_core/item_page_route.html',
            items_wep=items_wep,
            item_resources=item_resources,
            title=config["title"],
            header=config['header']
        )
    
    return handle_item_page()




# ! Страница детальной информации предметов
def with_app_context(func, app, *args, **kwargs):
    with app.app_context():
        return func(*args, **kwargs)
@bp.route('/item/<int:item_id>')
def item_detail(item_id: int):
    try:
        # Получаем только базовую информацию о предмете
        if not (item := get_item_by_id(item_id)):
            return "Item not found", 404

        item_resource = get_item_resource(item_id)
        if not item_resource:
            return "Item resource not found", 404

        # Обработка класса использования
        try:
            use_class = int(item.IUseClass.split('/')[-1].replace('.png', ''))
        except (ValueError, AttributeError):
            return "Invalid item use class", 400

        # Получаем модель предмета, если она есть
        app = current_app._get_current_object()
        with ThreadPoolExecutor(max_workers=1) as executor:
            itemresource_result = executor.submit(with_app_context, 
                get_item_model_resource, app, item_id).result()

        # Обработка модели предмета
        item_model_no = None
        prefix = 'i'
        if itemresource_result:
            base = f"{int(itemresource_result.RPosX):03}{int(itemresource_result.RPosY):03}"
            if item.IType == 3:  # Доспехи
                prefix = 'p'
                replace_dict = {
                    1: [0, 1], 2: [2, 3], 4: [4, 5], 5: [0, 1, 4, 5],
                    7: [4, 5, 0, 1, 2, 3], 8: [6, 7], 15: [0, 1, 2, 3, 4, 5, 6, 7],
                    16: [8, 9], 18: [8, 9, 2, 3], 19: [8, 9, 2, 3, 0, 1],
                    20: [8, 9, 4, 5], 22: [8, 9, 4, 5, 2, 3],
                    23: [0, 1, 2, 3, 4, 5, 8, 9], 0: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
                    255: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
                }
                if use_class in replace_dict:
                    for index in replace_dict[use_class]:
                        item_model_no = f"0{index}0{base[3:]}"
            else:
                item_model_no = base
        elif item.IType not in [1, 18, 20, 2, 19]:  # Не оружие/щит/стрелы
            prefix = 'i'

        # Предварительная проверка наличия данных
        has_data = {
            'has_bead': item.IName.startswith('Руна'),
            'has_skill': bool(get_item_skill(item_id)),
            'has_craft': bool(check_base_items_for_craft(item_id)),
            'has_attributes': bool(get_item_attribute_add_data(item_id)),
            'has_protect': item.IType in [1, 2, 3, 4, 5, 6, 7, 8, 9, 17, 18, 19, 20, 42],  # Типы экипировки
            'has_abnormal': bool(get_itemabnormalResist_data(item_id))
        }

        # Рендеринг базового шаблона
        return render_template(
            'item_core/item_page_detail.html',
            item=item,
            file_path=item_resource.file_path,
            use_class=use_class,
            prefix=prefix,
            monstermodelno_result=item_model_no,
            has_data=has_data
        )
    except Exception as e:
        print(f"Error in item detail route: {str(e)}")
        import traceback
        traceback.print_exc()
        return "Internal server error", 500




@bp.route('/render_template/item/<path:template_name>', methods=['POST'])
def render_template_part(template_name):
    """Рендер частичных шаблонов"""
    try:
        data = request.get_json()
        return render_template(f'item_core/detail/{template_name}', **data)
    except Exception as e:
        return str(e), 500

# API endpoints with error handling
def api_response(func):
    """Декоратор для унификации API ответов"""
    @wraps(func)
    def wrapper(*args, **kwargs):
        try:
            return jsonify(func(*args, **kwargs))
        except Exception as e:
            print(f"Error in {func.__name__}: {str(e)}")
            traceback.print_exc()
            return jsonify({'error': str(e)}), 500
    return wrapper

@bp.route('/api/item/<int:item_id>/bead-hole')
@api_response
def get_item_bead_hole_data(item_id):
    data = get_item_bead_holeprob_data(item_id)
    return {'item_bead_holeprob_data': data}

@bp.route('/api/item/<int:item_id>/bead-rune')
@api_response
def get_item_bead_rune_data(item_id):
    data = get_rune_bead_data(item_id)
    return {'rune_bead_data': data}

@bp.route('/api/item/<int:item_id>/bead-module')
@api_response
def get_item_bead_module_data_route(item_id):
    data = get_item_bead_module_data(item_id)
    return {'item_bead_module_data': data}

@bp.route('/api/item/<int:item_id>/craft')
@api_response
def get_item_craft_data(item_id):
    data = check_base_items_for_craft(item_id)
    return {'craft_result': data} if data else {'craft_result': None}

@bp.route('/api/item/<int:item_id>/craft-need')
@api_response
def get_item_craft_need_data(item_id):
    data = check_next_craft_item(item_id)
    return {'craft_next': data} if data else {'craft_next': None}

@bp.route('/api/item/<int:item_id>/specific-proc')
@api_response
def get_item_specific_proc_data(item_id):
    data = get_specific_proc_item(item_id)
    return {'specificproc_data': data}

@bp.route('/api/item/<int:item_id>/skill')
@api_response
def get_item_skill_data(item_id):
    data = get_item_skill(item_id)
    if data and isinstance(data, tuple) and len(data) == 6:
        itemdskill_data, itemskill_pic, linked_skills, linked_skillsaid, transform_list, monster_pic_url = data
        return {
            'itemdskill_data': itemdskill_data,
            'itemskill_pic': itemskill_pic,
            'linked_skills': linked_skills,
            'linked_skillsaid': linked_skillsaid,
            'transform_list': transform_list,
            'monster_pic_url': monster_pic_url
        }
    return {}

@bp.route('/api/item/<int:item_id>/abnormal')
@api_response
def get_item_abnormal_data(item_id):
    skill_data = get_item_skill(item_id)
    if skill_data and isinstance(skill_data, tuple) and len(skill_data) == 6:
        _, _, _, linked_skillsaid, _, _ = skill_data
        abnormal_type_data, abnormal_type_pic = get_abnormal_in_skill(linked_skillsaid)
        return {
            'abnormal_type_data': abnormal_type_data,
            'abnormal_type_pic': abnormal_type_pic
        }
    return {}

@bp.route('/api/item/<int:item_id>/abnormal-resist')
@api_response
def get_item_abnormal_resist_data(item_id):
    data = get_itemabnormalResist_data(item_id)
    return {'item_abnormalResist_data': data}

@bp.route('/api/item/<int:item_id>/can-get')
@api_response
def get_item_sources_data(item_id):
    drops = get_monster_drop_info(item_id)
    sellers = get_merchant_sellers(item_id)
    return {
        'mondropinfo': drops,
        'merchant_sellers': sellers
    }

@bp.route('/api/item/<int:item_id>/protect-penality')
@api_response
def get_item_protect_penality_data(item_id):
    protect_data = get_item_protect_data(item_id)
    penality_data = get_item_panalty_data(item_id)
    return {
        'item_protect_data': protect_data,
        'item_panalty_data': penality_data
    }

@bp.route('/api/item/<int:item_id>/slain')
@api_response
def get_item_slain_data_route(item_id):
    data = get_item_slain_data(item_id)
    return {'item_slain_data': data}

@bp.route('/api/item/<int:item_id>/attribute-add')
@api_response
def get_item_attribute_add_data_route(item_id):
    data = get_item_attribute_add_data(item_id)
    return {'item_attribute_add_data': data}

@bp.route('/api/item/<int:item_id>/attribute-resist')
@api_response
def get_item_attribute_resist_data_route(item_id):
    data = get_item_attribute_resist_data(item_id)
    return {'item_attribute_resist_data': data}

@bp.route('/api/item/<int:item_id>/transform')
@api_response
def get_item_transform_data(item_id):
    skill_data = get_item_skill(item_id)
    if skill_data and isinstance(skill_data, tuple) and len(skill_data) == 6:
        _, _, _, _, transform_list, monster_pic_url = skill_data
        return {
            'transform_list': transform_list,
            'monster_pic_url': monster_pic_url
        }
    return {}

@bp.route('/api/item/<int:item_id>/skill-detail')
@api_response
def get_item_skill_detail(item_id):
    skill_data = get_item_skill(item_id)
    if skill_data and isinstance(skill_data, tuple) and len(skill_data) == 6:
        itemdskill_data, itemskill_pic, linked_skills, linked_skillsaid, transform_list, monster_pic_url = skill_data
        if linked_skillsaid:
            abnormal_data = get_abnormal_in_skill(linked_skillsaid)
            abnormal_type_data, abnormal_type_pic = abnormal_data
        else:
            abnormal_type_data, abnormal_type_pic = None, None
            
        return {
            'itemdskill_data': itemdskill_data,
            'itemskill_pic': itemskill_pic,
            'linked_skills': linked_skills,
            'linked_skillsaid': linked_skillsaid,
            'abnormal_type_data': abnormal_type_data,
            'abnormal_type_pic': abnormal_type_pic,
            'transform_list': transform_list,
            'monster_pic_url': monster_pic_url
        }
    return {}