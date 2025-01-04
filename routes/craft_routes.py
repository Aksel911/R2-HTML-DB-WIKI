from flask import Blueprint, render_template, jsonify, request
from services.craft_service import get_craft_data, get_group_names

bp = Blueprint('craft', __name__)

@bp.route('/craft_list')
def craft_list():
    """Страница крафта"""
    try:
        crafts = get_craft_data()
        group1_names, group2_names = get_group_names()
        
        return render_template(
            'craft_core/craft_page_route.html',
            crafts=crafts,
            group1_names=group1_names,
            group2_names=group2_names,
            enumerate=enumerate
        )
    except Exception as e:
        print(f"Error loading craft page: {e}")
        return str(e), 500

@bp.route('/api/craft_details/<int:rid>')
def get_craft_details(rid):
    """Получение деталей крафта"""
    try:
        crafts = get_craft_data()
        
        # Ищем крафт по rid
        for group1 in crafts:
            for group2 in crafts[group1]:
                for craft in crafts[group1][group2]:
                    if craft['rid'] == rid:
                        return jsonify(craft)
        
        return jsonify({'error': 'Craft not found'}), 404
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500