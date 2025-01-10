from flask import Blueprint, render_template, jsonify, request, current_app
from services.craft_service import (
    get_craft_data,
    get_group_names,
    get_group_items,
    get_all_craft_data
)
from functools import wraps
import ujson
from flask_caching import Cache
import time

bp = Blueprint('craft', __name__)
cache = Cache(config={'CACHE_TYPE': 'simple'})

def cached_response(timeout=5 * 60):
    """Декоратор для кэширования ответов API"""
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            cache_key = f'route_{request.path}_{str(kwargs)}_{str(request.args)}'
            response = cache.get(cache_key)
            
            if response is not None:
                return response
                
            response = f(*args, **kwargs)
            cache.set(cache_key, response, timeout=timeout)
            return response
        return decorated_function
    return decorator

def json_response(data, status=200):
    """Оптимизированный JSON ответ"""
    return current_app.response_class(
        ujson.dumps(data),
        mimetype='application/json',
        status=status
    )

@bp.route('/craft_list')
def craft_list():
    """Страница крафта"""
    try:
        group1_names, group2_names = get_group_names()
        all_crafts = get_all_craft_data()
        
        return render_template(
            'craft_core/craft_page_route.html',
            group1_names=group1_names,
            group2_names=group2_names,
            all_crafts=all_crafts,
            enumerate=enumerate
        )
        
    except Exception as e:
        current_app.logger.error(f"Error loading craft page: {e}")
        return str(e), 500

@bp.route('/api/craft_group/<int:group_id>')
def get_craft_group(group_id):
    """API endpoint для получения предметов группы"""
    try:
        group2 = request.args.get('group2', None)
        items, has_more = get_group_items(group_id, group2)
        return jsonify({
            'items': items,
            'has_more': has_more
        })
        
    except Exception as e:
        current_app.logger.error(f"Error in get_craft_group: {e}")
        return jsonify({'error': str(e)}), 500

@bp.route('/api/craft_details/<int:rid>')
def get_craft_details(rid):
    """API endpoint для получения деталей крафта"""
    try:
        craft = get_craft_data(rid)
        if not craft:
            return jsonify({'error': 'Craft not found'}), 404
            
        return jsonify(craft)
        
    except Exception as e:
        current_app.logger.error(f"Error in get_craft_details: {e}")
        return jsonify({'error': str(e)}), 500

def init_app(app):
    """Инициализация расширений"""
    cache.init_app(app)