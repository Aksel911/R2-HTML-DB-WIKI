from typing import List, Dict, Optional
from services.database import execute_query

def get_items_by_type(item_type: str, class_id: int, arrow: str = 'N', slot_num: str = None) -> List[Dict]:
    """Получение списка предметов по типу для определенного класса и слота"""
    
    # Проверяем на оружие-щит
    if slot_num == '0004' and item_type == 'shield':  
        # Получаем данные о текущем оружии для проверки совместимости
        weapon_query = """
        SELECT no_shield, need_arrow 
        FROM DT_Item 
        WHERE IID = (SELECT IID FROM doll_equipped WHERE slot = '0010')
        """
        weapon = execute_query(weapon_query, fetch_one=True)
        if weapon and weapon.no_shield == 'Y':
            return []  # Щит запрещен для этого оружия
            
    if item_type == 'main-sph':
        query = """
        SELECT 
            i.IID,
            i.IName,
            i.IType,
            i.ILevel,
            i.IStatus,
            i.IUseClass
        FROM DT_Item i
        WHERE i.IType IN (22, 23, 24, 25, 26, 27, 28, 29)
        """
        rows = execute_query(query, params, fetch_one=False)
    
    else:
        query = """
        SELECT 
            i.IID,
            i.IName,
            i.IType,
            i.ILevel,
            i.IStatus,
            i.IUseClass
        FROM DT_Item i
        WHERE i.IType IN ?
        """
        
        params = item_type
        rows = execute_query(query, params, fetch_one=False)
    
    if arrow == 'Y':
         query += " AND i.need_arrow = 'Y'"

  
    items = []
    for row in rows:
        items.append({
            'id': row.IID,
            'title': row.IName, 
            'icon': row.icon if row.icon else '/static/img/no_item.png',
            'type': row.IType,
            'level': row.ILevel,
            'status': row.IStatus,
            'improvement': 0  # Улучшение по умолчанию
        })
        
    return items

def get_doll_selection(selection: int, app: int) -> Optional[str]:
    """Получение информации о бонусе сета сфер"""
    query = """
    SELECT bonus_text
    FROM DT_SphereSet 
    WHERE selection = ? AND app = ?
    """
    
    row = execute_query(query, (selection, app), fetch_one=True)
    return row.bonus_text if row else None