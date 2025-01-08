# skill_tree_routes.py

from flask import Blueprint, render_template, jsonify
from services.skill_tree_service import get_skill_nodes
import logging

logger = logging.getLogger(__name__)
bp = Blueprint('skill_tree', __name__)

TREE_TYPES = {
    4: 'Общее древо',
    
    5: 'Древо атаки рыцаря',
    6: 'Древо защиты рыцаря',
    
    7: 'Древо атаки рейнджера',
    8: 'Древо ловушек рейнджера',
    
    9: 'Древо магии мага',
    10: 'Древо темной магии мага',
    
    11: 'Древо боя ассасина',
    12: 'Древо скрытности ассасина',
    
    13: 'Древо духов призывателя',
    14: 'Древо тотемов призывателя',
    
    1: 'Базовое древо гильдии',
    2: 'Древо захвата замка',
    3: 'Специальное древо гильдии',
    
    15: 'Сила',
    16: 'Ловкость',
    17: 'Интеллект'
}

SKILL_TREES = {
    'common': {'id': 4, 'name': 'Общее древо'},
    'knight': [
        {'id': 5, 'name': 'Древо атаки'},
        {'id': 6, 'name': 'Древо защиты'}
    ],
    'ranger': [
        {'id': 7, 'name': 'Древо атаки'},
        {'id': 8, 'name': 'Древо ловушек'}
    ],
    'mage': [
        {'id': 9, 'name': 'Древо магии'},
        {'id': 10, 'name': 'Древо темной магии'}
    ],
    'assassin': [
        {'id': 11, 'name': 'Древо боя'},
        {'id': 12, 'name': 'Древо скрытности'}
    ],
    'summoner': [
        {'id': 13, 'name': 'Древо духов'},
        {'id': 14, 'name': 'Древо тотемов'}
    ],
    'guild': [
        {'id': 1, 'name': 'Базовое древо гильдии'},
        {'id': 2, 'name': 'Древо захвата замка'},
        {'id': 3, 'name': 'Специальное древо гильдии'}
    ],
    'pet': [
        {'id': 15, 'name': 'Сила'},
        {'id': 16, 'name': 'Интеллект'},
        {'id': 17, 'name': 'Ловкость'}
    ],
}

    # 'pet': [
    #     *[{'id': i, 'name': f'Древо питомца {i}'} for i in range(15, 66)]
    # ]



@bp.route('/skill_tree')
def skill_tree():
    """Главная страница древа умений"""
    try:
        return render_template(
            'skill_tree_core/skill_tree_page_route.html',
            skill_trees=SKILL_TREES,
            tree_types=TREE_TYPES
        )
    except Exception as e:
        logger.error(f"Error loading skill tree page: {e}")
        return jsonify({'error': str(e)}), 500



@bp.route('/api/skill_tree/<int:tree_id>')
def get_tree_data(tree_id):
    """API для получения данных дерева"""
    try:
        nodes = get_skill_nodes(tree_id)
        return jsonify(nodes)
    except Exception as e:
        logger.error(f"Error getting tree data: {e}")
        return jsonify({'error': str(e)}), 500