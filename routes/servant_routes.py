from flask import Blueprint, render_template, jsonify, request
from services.servant_service import get_servants_list, servant_to_dict

bp = Blueprint('servants', __name__)

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