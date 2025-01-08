from flask import Blueprint, jsonify, request, render_template
from services.doll_service import get_items_by_type, get_doll_selection

bp = Blueprint('dolls', __name__)

@bp.route('/doll')
def doll_main():
    """Главная страница системы кукол"""
    return render_template(
        'doll_core/doll_page_route.html',
        title='Система кукол'
    )

@bp.route('/ajax/Dolls/GetItemList/', methods=['POST'])
def get_item_list():
    """Получение списка предметов для слота"""
    try:
        print(request.form)
        item_type = request.form.get('type')
        class_id = request.form.get('classID')
        arrow = request.form.get('arrow', 'N') # Для стрел
        num = request.form.get('num') # Номер слота

        if not item_type or not class_id:
            return jsonify({'error': 'Missing parameters'}), 400

        # Передаём все параметры в сервис
        items = get_items_by_type(
            item_type=item_type,
            class_id=int(class_id),
            arrow=arrow,
            slot_num=num
        )
        return jsonify(items)

    except Exception as e:
        print(f"Error in get_item_list: {str(e)}")
        return jsonify({'error': str(e)}), 500

@bp.route('/ajax/Dolls/GetSelection/', methods=['POST'])
def get_selection():
    """Получение информации о бонусе сета сфер"""
    try:
        selection = request.form.get('selection', type=int)
        app = request.form.get('app', type=int)

        if selection is None or app is None:
            return jsonify({'error': 'Missing parameters'}), 400

        bonus = get_doll_selection(selection, app)
        
        if bonus:
            return jsonify({
                'type': 'success',
                'text': bonus
            })
        
        return jsonify({
            'type': 'error',
            'text': 'Set bonus not found'
        })

    except Exception as e:
        print(f"Error in get_selection: {str(e)}")
        return jsonify({'error': str(e)}), 500

