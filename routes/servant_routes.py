import traceback
from flask import Blueprint, render_template, jsonify, request
from services.servant_service import get_servants_list, servant_to_dict, check_servant_gathering, check_servant_skill_tree
from services.craft_service import check_all_base_items_for_craft, check_next_craft_item


bp = Blueprint('servants', __name__)

# ! Main page
@bp.route('/servants')
def servants_list():
    """Display all servants in a card layout"""
    try:
        servants = get_servants_list()  # Получаем отфильтрованный список
        
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            servants_dict = [servant_to_dict(servant) for servant in servants]
            return jsonify({
                'servants': servants_dict,
                'total': len(servants)
            })
            
        return render_template(
            'servant_core/servant_page_route.html',
            servants=servants,
            title='[Питомцы] Список питомцев',
            header='Список питомцев'
        )
        
    except Exception as e:
        print(f"Error in servants route: {str(e)}")
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


# ! Routes
@bp.route('/servant/<int:servant_id>')
def servant_detail(servant_id: int):
    """Servant detail page"""
    try:
        # Получаем данные конкретного слуги без фильтрации
        servant = get_servants_list(servant_id=servant_id)
        
        if not servant:
            return "Servant not found", 404

        # Добавляем total_stats если нужно
        if 'skills_by_level' in servant:
            levels = list(servant['skills_by_level'].keys())
            levels.sort(key=lambda x: int(x.split()[-1]) if 'Ур.' in x else 0)
            
            total_stats = {
                'level': f'{servant["name"]}',
                'stats': []
            }
            
            for level in levels:
                for ability in servant['skills_by_level'][level]:
                    ability_stats = next((s for s in total_stats['stats'] 
                                        if s['param_name'] == ability['param_name']), None)
                    if ability_stats:
                        ability_stats['value'] += ability['value']
                    else:
                        total_stats['stats'].append({
                            'module_name': ability['module_name'],
                            'module_type': ability['module_type'],
                            'param_name': ability['param_name'],
                            'value': ability['value']
                        })
            
            servant['total_stats'] = total_stats if total_stats['stats'] else None
        
        return render_template(
            'servant_core/servant_page_detail.html',
            servant=servant,
            title=f'[Слуги] {servant["name"]}',
            header=servant['name']
        )

    except Exception as e:
        print(f"Error in servant detail route: {str(e)}")
        traceback.print_exc()
        return "Internal server error", 500


# * Dynamic:

@bp.route('/<path:template_name>', methods=['POST'])
def render_template_part(template_name):
    """Render partial template for dynamic loading"""
    try:
        data = request.get_json()
        
        if not template_name.startswith('servant_core/detail/'):
            print(f"Invalid template path: {template_name}")
            return "Invalid template path", 400

        # Отфильтровываем None значения и передаем все данные напрямую в шаблон
        template_data = {k: v for k, v in data.items() if v is not None}
        rendered = render_template(template_name, **template_data)
        return rendered
            
    except Exception as e:
        print(f"Error rendering template: {str(e)}")
        traceback.print_exc()
        return str(e), 500


@bp.route('/api/servant/<int:servant_id>/base-craft')
def get_servant_craft_info(servant_id):
    try:
        base_craft_items_data = check_all_base_items_for_craft(servant_id)
        next_craft_item_data = check_next_craft_item(servant_id)
        
        response_data = {
            'craft_result': base_craft_items_data if base_craft_items_data else None,
            'craft_next': next_craft_item_data if next_craft_item_data else None
        }
        
        return jsonify(response_data)
    except Exception as e:
        print(f"Error in base-craft: {str(e)}")
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

@bp.route('/api/servant/<int:servant_id>/gathering')
def get_servant_gathering_info(servant_id):
    try:
        servant_gathering_data, servant_gathering_chest_data = check_servant_gathering(servant_id)
        
        if not servant_gathering_data:
            return jsonify({'message': 'No gathering data found'}), 404
        
        response_data = {
            'servant_gathering_data': servant_gathering_data,
            'servant_gathering_chest_data': servant_gathering_chest_data
        }
        
        return jsonify(response_data)
        
    except Exception as e:
        print(f"Error in gathering info: {str(e)}")
        traceback.print_exc()
        return jsonify({
            'error': 'Internal server error',
            'message': str(e)
        }), 500


@bp.route('/api/servant/<int:servant_id>/skill-tree')
def get_servant_skilltree_info(servant_id):
    try:
        servant_skilltree_data = check_servant_skill_tree(servant_id)
        
        if not servant_skilltree_data:
            return jsonify({'message': 'No skill tree data found'}), 404
        
        response_data = {
            'servant_skilltree_data': servant_skilltree_data
        }
        
        return jsonify(response_data)
        
    except Exception as e:
        print(f"Error in gathering info: {str(e)}")
        traceback.print_exc()
        return jsonify({
            'error': 'Internal server error',
            'message': str(e)
        }), 500










@bp.route('/api/servant/<int:servant_id>/evolution-tree')
def get_servant_evolution_tree(servant_id):
    """Get servant evolution tree data"""
    try:
        servants = get_servants_list()
        servant = next((s for s in servants if s['id'] == servant_id), None)
        if not servant:
            return jsonify({'error': 'Servant not found'}), 404
            
        return jsonify({
            'evolution_stage': servant['evolution_stage'],
            'evolution_target': servant['evolution_target']
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/api/servant/<int:servant_id>/skills')
def get_servant_skills(servant_id):
    """Get servant skills data"""
    try:
        servants = get_servants_list()
        servant = next((s for s in servants if s['id'] == servant_id), None)
        if not servant:
            return jsonify({'error': 'Servant not found'}), 404
            
        # Filter out basic stats, return only skill levels
        skills_by_level = {k: v for k, v in servant['skills_by_level'].items() 
                          if k != 'Основные'}
        
        return jsonify({
            'skills_by_level': skills_by_level
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/api/servant/<int:servant_id>/requirements')
def get_servant_requirements(servant_id):
    """Get servant evolution requirements"""
    try:
        servants = get_servants_list()
        servant = next((s for s in servants if s['id'] == servant_id), None)
        if not servant:
            return jsonify({'error': 'Servant not found'}), 404
            
        # You would need to implement the logic to get requirements
        # This is just a placeholder structure
        requirements = {
            'items': [],  # Required items for evolution
            'materials': [],  # Required materials
            'currency': []  # Required currency
        }
        
        return jsonify(requirements)
    except Exception as e:
        return jsonify({'error': str(e)}), 500