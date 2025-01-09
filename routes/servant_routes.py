import traceback
from flask import Blueprint, render_template, jsonify, request
from services.servant_service import get_servants_list, servant_to_dict
from services.craft_service import check_all_base_items_for_craft, check_next_craft_item

bp = Blueprint('servants', __name__)

# ! Main page
@bp.route('/servants')
def servants_list():
    """Display all servants in a card layout"""
    try:
        servants = get_servants_list()
        
        # If it's an AJAX request, return JSON
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            servants_dict = [servant_to_dict(servant) for servant in servants]
            return jsonify({
                'servants': servants_dict,
                'total': len(servants)
            })
            
        # For normal request, render template
        return render_template(
            'servant_core/servant_page_route.html',
            servants=servants,
            title='[Питомцы] Список питомцев',
            header='Список питомцев'
        )
        
    except Exception as e:
        print(f"Error in servants route: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


# ! Routes
@bp.route('/servant/<int:servant_id>')
def servant_detail(servant_id: int):
    """Servant detail page"""
    try:
        # Get all servants
        servants = get_servants_list()
        
        # Find the specific servant
        servant = next((s for s in servants if s['id'] == servant_id), None)
        
        if not servant:
            return "Servant not found", 404

        # Convert servant data for template
        servant_data = {
            'id': servant['id'],
            'name': servant['name'],
            'element_info': servant['element_info'],
            'element_id': servant['element_id'],
            'element_order': servant['element_order'],
            'evolution_stage': servant['evolution_stage'],
            'evolution_target': servant['evolution_target'],
            'image_url': servant['image_url'],
            'skills_by_level': servant['skills_by_level'],
            'total_stats': servant['total_stats']
        }
        
        # Render template with servant data
        return render_template(
            'servant_core/servant_page_detail.html',
            servant=servant_data,
            title=f'[Слуги] {servant_data["name"]}',
            header=servant_data['name']
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

        # Проверяем, что путь к шаблону корректный
        if template_name.startswith('servant_core/detail/'):
            rendered = render_template(
                template_name,
                craft_result=data.get('craft_result', []),
                craft_next=data.get('craft_next', [])
            )
            return rendered
        else:
            print(f"Invalid template path: {template_name}")
            return "Invalid template path", 400
        
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