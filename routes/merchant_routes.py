from flask import Blueprint, render_template, request, jsonify, current_app, abort
import requests
from services.merchant_service import (
    get_merchants_list,
    get_merchant_by_id,
    get_merchant_items,
    apply_merchant_filters,
    merchant_to_dict
)
from functools import wraps

bp = Blueprint('merchants', __name__)

def with_merchant_filters(view_func):
    """Decorator for merchant filtering"""
    @wraps(view_func)
    def wrapped_view(*args, **kwargs):
        try:
            # Get search term
            search_term = request.args.get('search', '')
            merchants, file_paths = get_merchants_list(search_term)
            print(f"Количество элементов merchants: {len(merchants)}")
            
            
            # If it's an AJAX request, handle filtering
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                filters = request.args.to_dict()
                
                # Apply filters
                filtered_merchants = apply_merchant_filters(merchants, filters)
                
                # Get pagination parameters
                page = request.args.get('page', 1, type=int)
                per_page = request.args.get('per_page', 25000, type=int) # ! PP LIMIT
            
                # Apply pagination
                start_idx = (page - 1) * per_page
                end_idx = start_idx + per_page
                paginated_merchants = filtered_merchants[start_idx:end_idx]
                
                # Convert to dict for response
                merchants_dict = [merchant_to_dict(item) for item in paginated_merchants]
                print(f"Количество элементов: {len(merchants_dict)}")
                
                
                return jsonify({
                    'merchants': merchants_dict,
                    'resources': file_paths,
                    'total': len(filtered_merchants),
                    'pages': (len(filtered_merchants) + per_page - 1) // per_page
                })
                
            # For normal request, pass data to view
            return view_func(items=merchants, item_resources=file_paths, *args, **kwargs)
            
        except Exception as e:
            print(f"Error in route: {str(e)}")
            import traceback
            traceback.print_exc()
            return jsonify({'error': str(e)}), 500
            
    return wrapped_view

@bp.route('/merchants')
@with_merchant_filters
def merchants_list(items=None, item_resources=None):
    """List all merchants and their items"""
    return render_template(
        'merchant_core/merchant_page_route.html',
        items=items,
        item_resources=item_resources,
        title='[Торговцы] Список торговцев',
        header='Список торговцев'
    )

@bp.route('/merchant/<int:merchant_list_id>')
def merchant_detail(merchant_list_id: int):
    try:
        if not (merchant := get_merchant_by_id(merchant_list_id)):
            return "Merchant not found", 404
        
        return render_template(
            'merchant_core/merchant_page_detail.html',
            merchant=merchant,
            title=f'[Торговцы]',
            header=f'[Торговцы]'
        )
        
    except Exception as e:
        print(f"Error in merchant detail route: {str(e)}")
        import traceback
        traceback.print_exc()
        return "Internal server error", 500