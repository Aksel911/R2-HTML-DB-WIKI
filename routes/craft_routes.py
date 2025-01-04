from flask import Blueprint, render_template, jsonify, request
from services.craft_service import (
    get_craft_data,
    get_group_names,
    get_group_items,
    get_all_craft_data
)

bp = Blueprint('craft', __name__)

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
        print(f"Error loading craft page: {e}")
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
        print(f"Error in get_craft_group: {e}")
        return jsonify({'error': str(e)}), 500

@bp.route('/api/craft_details/<int:rid>')
def get_craft_details(rid):
    """API endpoint для получения деталей крафта"""
    try:
        craft = get_craft_data(rid)
        if craft:
            return jsonify(craft)
        return jsonify({'error': 'Craft not found'}), 404
    except Exception as e:
        print(f"Error in get_craft_details: {e}")
        return jsonify({'error': str(e)}), 500