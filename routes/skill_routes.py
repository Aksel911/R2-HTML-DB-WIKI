from flask import Blueprint, render_template, current_app
from services.skill_service import (
    get_skill_detail,
    get_skills_list,
    get_skill_use_by_spid_items,
    get_skill_use_by_sid,
    get_monster_reget_skill_pic_icon_datasource,
    get_skill_attribute_data,
    get_skill_slain_data
)
from services.utils import get_google_sheets_data
from config.settings import SKILLAPPLYRACE_URL
from services.utils import get_skill_icon_path, with_app_context
from concurrent.futures import ThreadPoolExecutor

bp = Blueprint('skills', __name__)

# ! Главная страница скиллов
@bp.route('/skills')
def skills_list():
    """List all skills"""
    skills_data, file_paths = get_skills_list()
    return render_template(
        'skill_core/skill_page_route.html', # TODO: Старый дизайн
        skills=skills_data,
        item_resources=file_paths
    )
    


# ! Страница детальной информации о скилле
@bp.route('/skill/<int:skill_id>')
def skill_detail(skill_id: int):
    """Страница деталей навыка"""
    try:
        # Получение основных данных навыка
        if not (skills := get_skill_detail(skill_id)):
            return "Skill not found", 404

        skill = skills[0]  # Берем первый навык для основной информации
        spid_id = skill.skill_pack_id

        # Получаем приложение для использования в контексте
        app = current_app._get_current_object()

        # Создаем ThreadPoolExecutor для параллельного выполнения задач
        with ThreadPoolExecutor(max_workers=20) as executor:
            def submit_with_context(func, *args, **kwargs):
                return executor.submit(with_app_context, func, app, *args, **kwargs)

            # Запускаем параллельные задачи
            future_skill_for_item = submit_with_context(get_skill_use_by_spid_items, spid_id)
            future_skill_for_skill = submit_with_context(get_skill_use_by_sid, spid_id)
            future_icon_data = submit_with_context(get_monster_reget_skill_pic_icon_datasource, skill_id)
            future_attribute_data = submit_with_context(get_skill_attribute_data, skill_id)
            future_slain_data = submit_with_context(get_skill_slain_data, skill_id)
            
            # Если есть apply_race, запускаем получение данных из Google Sheets
            if skill.apply_race is not None:
                future_race_data = executor.submit(get_google_sheets_data, SKILLAPPLYRACE_URL)
            else:
                future_race_data = None

            # Получаем результаты
            skill_for_item = future_skill_for_item.result()
            skill_for_item_data, skill_for_item_pic = skill_for_item or (None, None)

            skill_for_skill = future_skill_for_skill.result()
            skill_for_skill_data, skill_for_skill_pic = skill_for_skill or (None, None)

            skill_attribute_add_data = future_attribute_data.result() or None
            skill_slain_data = future_slain_data.result() or None
            icon_data = future_icon_data.result()

            # Обработка класса использования
            use_class = None
            if skill.item_use_class:
                try:
                    use_class = int(skill.item_use_class.split('/')[-1].replace('.png', ''))
                except (ValueError, AttributeError):
                    pass

            # Обработка иконки навыка
            skill_icon = None
            if icon_data:
                skill_icon = get_skill_icon_path(
                    icon_data.mSpriteFile,
                    icon_data.mSpriteX,
                    icon_data.mSpriteY
                )

            # Обработка информации о расе
            race_info = None
            if future_race_data:
                skill_apply_race_df = future_race_data.result()
                if not skill_apply_race_df.empty:
                    race_match = skill_apply_race_df[skill_apply_race_df['mApplyRace'] == skill.apply_race]
                    if not race_match.empty:
                        race_info = race_match.iloc[0]['mDesc']

        # Рендеринг шаблона
        return render_template(
            'skill_core/skill_page_detail.html',
            skill=skill,
            skills=skills,
            use_class=use_class,
            race_info=race_info,
            skill_icon=skill_icon,
            skill_for_item_data=skill_for_item_data,
            skill_for_item_pic=skill_for_item_pic,
            skill_for_skill_data=skill_for_skill_data,
            skill_for_skill_pic=skill_for_skill_pic,
            skill_attribute_add_data=skill_attribute_add_data,
            skill_slain_data=skill_slain_data
        )

    except Exception as e:
        print(f"Error in skill detail route: {str(e)}")
        import traceback
        traceback.print_exc()
        return "Internal server error", 500