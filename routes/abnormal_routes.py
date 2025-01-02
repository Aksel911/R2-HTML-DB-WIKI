from flask import Blueprint, render_template, current_app
from services.abnormal_service import (
    get_abnormal_detail,
    get_abnormals_list,
    get_abnormal_items,
    get_abnormal_skills
)
from concurrent.futures import ThreadPoolExecutor
from services.utils import with_app_context

bp = Blueprint('abnormals', __name__)


# ! Главная страница абнормалов
@bp.route('/abnormals')
def abnormals_list():
    """List all abnormal effects"""
    abnormals_data, file_paths = get_abnormals_list()
    
    return render_template(
        'abnormal_core/abnormal_page_route.html', # TODO: Старый дизайн
        abnormals=abnormals_data,
        item_resources=file_paths
    )

# ! Страница детальной информации об абнормале
@bp.route('/abnormal/<int:aid>')
def abnormal_detail(aid: int):
    """Abnormal effect detail page"""
    try:
        # Получаем основные данные
        abnormal = get_abnormal_detail(aid)
        if not abnormal:
            return "Abnormal effect not found", 404

        # Получаем приложение для использования в контексте
        app = current_app._get_current_object()

        # Создаем ThreadPoolExecutor для параллельного выполнения задач
        with ThreadPoolExecutor(max_workers=20) as executor:
            # Оборачиваем каждую функцию в контекст приложения
            def submit_with_context(func, *args, **kwargs):
                return executor.submit(with_app_context, func, app, *args, **kwargs)

            # Запускаем параллельные задачи
            future_items = submit_with_context(get_abnormal_items, aid)
            future_skills = submit_with_context(get_abnormal_skills, aid)

            # Получаем результаты
            abnormal_items = future_items.result()
            abnormal_skills = future_skills.result()

        # Рендеринг шаблона
        return render_template(
            'abnormal_core/abnormal_page_detail.html',
            abnormal=abnormal,
            abnormal_items=abnormal_items,
            abnormal_skills=abnormal_skills
        )

    except Exception as e:
        print(f"Error in abnormal detail route: {str(e)}")
        import traceback
        traceback.print_exc()
        return "Internal server error", 500
