from flask import current_app
from typing import List, Dict, Optional, Tuple
from services.database import execute_query
from services.item_service import get_item_pic_url
from models.merchant import Merchant

def get_payment_type_name(payment_type: int) -> str:
    payment_types = {
        0: "Серебра",
        1: "Очков чести",
        2: "Очков хаоса",
        3: "Серебра хаоса"
    }
    return payment_types.get(payment_type, "Неизвестная валюта")


def apply_merchant_filters(merchants: List[Merchant], filters: Dict) -> List[Merchant]:
    """Apply filters to merchant list"""
    if not merchants or not filters:
        return merchants

    filtered_merchants = merchants

    try:
        # Remove empty filters
        filters = {k: v for k, v in filters.items() if v and k != '' and v != ''}
        
        if not filters:
            return merchants

        # Filter by payment type
        if payment_type := filters.get('paymentTypeFilter'):
            filtered_merchants = [m for m in filtered_merchants if m.mPaymentType == int(payment_type)]

        # Filter by item price range
        if price_min := filters.get('priceMin'):
            try:
                price_min = int(price_min)
                filtered_merchants = [m for m in filtered_merchants if m.Price >= price_min]
            except (ValueError, TypeError):
                pass
                
        if price_max := filters.get('priceMax'):
            try:
                price_max = int(price_max)
                filtered_merchants = [m for m in filtered_merchants if m.Price <= price_max]
            except (ValueError, TypeError):
                pass

        # Boolean filters
        if filters.get('eventMerchantFilter') == '1':
            filtered_merchants = [m for m in filtered_merchants if int(m.mIsEvent)]

        return filtered_merchants

    except Exception as e:
        print(f"Error in apply_merchant_filters: {e}")
        import traceback
        traceback.print_exc()
        return []

def merchant_to_dict(merchant: Merchant) -> dict:
    """Convert merchant object to dictionary for JSON response"""
    return {
        'ListID': merchant.ListID,
        'MID': merchant.MID,
        'MName': merchant.MName.replace('/n', ' ') if merchant.MName else '',
        'MClass': merchant.MClass,
        'ItemID': merchant.ItemID,
        'ItemName': merchant.IName,
        'Price': merchant.Price,
        'PaymentType': merchant.mPaymentType,
        'mIsEvent': merchant.mIsEvent,
        'ItemCount': merchant.ItemCount
    }






def get_merchant_by_id(merchant_list_id: int) -> Dict:
    query = """
    SELECT
        a.ListID,
        c.MID,
        c.MName,
        c.MClass,
        a.ItemID,
        d.IName,
        a.Price,
        b.mPaymentType,
        c.mIsEvent
    FROM TblMerchantSellList AS a
    INNER JOIN TblMerchantName b ON (a.ListID = b.mID)
    INNER JOIN DT_Monster c ON (b.mID = c.mSellMerchanID)
    LEFT JOIN DT_Item d ON (a.ItemID = d.IID)
    WHERE a.ListID = ?
    ORDER BY c.MID, a.ListID, d.IName
    """

    rows = execute_query(query, (merchant_list_id,))
    if not rows:
        return None
    
    merchants = {}
   
    for row in rows:
        mid = row.MID
       
        if mid not in merchants:
            merchants[mid] = {
                'MID': mid,
                'MName': row.MName.replace('/n', ' ') if row.MName else '',
                'MClass': row.MClass,
                'ListID': row.ListID,
                'mPaymentType': row.mPaymentType,
                'items_data': []
            }
       
        # Add item to merchant's items list
        item_pic = get_item_pic_url(row.ItemID)
        
        item_data = {
            'ItemID': row.ItemID,
            'ItemName': row.IName,
            'Price': row.Price,
            'PaymentType': get_payment_type_name(row.mPaymentType),
            'ItemPicture': item_pic or f"{current_app.config['GITHUB_URL']}no_item_image.png",
            'mIsEvent': int(row.mIsEvent) if row.mIsEvent is not None else 0  # Явное приведение к int
        }
        
        
        merchants[mid]['items_data'].append(item_data)

    result = list(merchants.values())

    return result

def get_merchants_list(search_term: str = '') -> Tuple[List[Merchant], Dict]:
    """Get all merchants with optional search"""
    query = """
    SELECT
      a.ListID,
      c.MID,
      c.MName,
      c.MClass,
      a.ItemID,
      d.IName,
      a.Price,
      b.mPaymentType,
      c.mIsEvent 
    FROM
      TblMerchantSellList AS a
      LEFT JOIN TblMerchantName AS b ON ( a.ListID = b.mID )
      LEFT JOIN DT_Monster AS c ON ( b.mID = c.mSellMerchanID )
      LEFT JOIN DT_Item AS d ON ( a.ItemID = d.IID ) 
    WHERE
      c.MID IS NOT NULL 
    """
    
    params = []
    if search_term:
        query += " AND (c.MName LIKE ? OR d.IName LIKE ? OR CAST(a.ListID AS VARCHAR) LIKE ?)"
        search_pattern = f'%{search_term}%'
        params.extend([search_pattern, search_pattern, search_pattern])

    query += " ORDER BY c.MID"
    
    rows = execute_query(query, params)
    merchants = []
    file_paths = {}
    
    # Используем словарь для группировки предметов по торговцам
    merchant_items = {}
    seen_monsters = set()
    
    for row in rows:
        if row.MID not in seen_monsters:
            seen_monsters.add(row.MID)
            merchant_items[row.MID] = []
            
            merchant = Merchant(
                ListID=row.ListID,
                MID=row.MID,
                MName=row.MName.replace('/n', ' ') if row.MName else '',
                MClass=row.MClass,
                ItemID=row.ItemID,
                IName=row.IName,
                Price=row.Price,
                mPaymentType=row.mPaymentType,
                mIsEvent=int(row.mIsEvent),
                ItemCount=0  # Инициализация
            )
            merchants.append(merchant)
            file_paths[row.ListID] = f"{current_app.config['GITHUB_URL']}{row.MID}.png"
        
        merchant_items[row.MID].append({
            'ItemID': row.ItemID,
            'IName': row.IName,
            'Price': row.Price
        })
    
    # Добавляем количество предметов каждому торговцу
    for merchant in merchants:
        merchant.ItemCount = len(merchant_items[merchant.MID])

    print(f"Уникальных торговцев: {len(merchants)}")
    return merchants, file_paths

def get_merchant_items(merchant_id: int) -> List[Dict]:
    """Get all items sold by a specific merchant"""
    query = """
    SELECT
        a.ListID,
        a.ItemID,
        d.IName,
        a.Price,
        b.mPaymentType
    FROM TblMerchantSellList AS a
    LEFT JOIN TblMerchantName AS b ON (a.ListID = b.mID)
    LEFT JOIN DT_Monster AS c ON (b.mID = c.mSellMerchanID)
    LEFT JOIN DT_Item AS d ON (a.ItemID = d.IID)
    WHERE c.MID = ?
    ORDER BY d.IName
    """
    
    rows = execute_query(query, (merchant_id,))
    merchant_items = []

    for row in rows:
        item_pic = None
        item_pic = get_item_pic_url(row.ItemID)



        merchant_items.append({
            "MerchantListID": row.ListID,
            "MerchantItemID": row.ItemID,
            "MerchantItemName": row.IName,
            "MerchantItemPrice": row.Price or 0,
            "MerchantPaymentType": get_payment_type_name(row.mPaymentType),
            "MerchantItemPicture": item_pic or f"{current_app.config['GITHUB_URL']}/no_monster/no_monster_image.png",
        })

    return merchant_items

def get_merchant_sellers(item_id: int) -> List[Dict]:
    """Get all merchants selling a specific item"""
    query = """
    SELECT
        a.ListID,
        c.MID,
        c.MName,
        a.Price,
        b.mPaymentType 
    FROM TblMerchantSellList AS a
    LEFT JOIN TblMerchantName AS b ON (a.ListID = b.mID)
    LEFT JOIN DT_Monster AS c ON (b.mID = c.mSellMerchanID)
    WHERE a.ItemID = ?
    ORDER BY c.MName
    """
    
    rows = execute_query(query, (item_id,))
    merchants = []

    for row in rows:
        if row.MID:  # Check that merchant exists
            merchants.append({
                "MerchantID": row.MID,
                "MerchantName": row.MName.replace('/n', ' ') if row.MName else '',
                "Price": row.Price,
                "PaymentType": get_payment_type_name(row.mPaymentType)
            })
    
    return merchants