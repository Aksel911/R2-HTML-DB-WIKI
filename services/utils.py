import pandas as pd
from typing import Optional
from flask import current_app

# Оборачиваем каждую функцию в контекст приложения
def with_app_context(func, app, *args, **kwargs):
    with app.app_context():
        return func(*args, **kwargs)



def get_google_sheets_data(url: str) -> pd.DataFrame:
    """Fetch data from Google Sheets"""
    try:
        # Convert the Google Sheets URL to export format
        sheet_id = url.split('/d/')[1].split('/')[0]
        export_url = f"https://docs.google.com/spreadsheets/d/{sheet_id}/export?format=csv"
        
        # Read the CSV directly from the export URL
        df = pd.read_csv(export_url)
        return df
    except Exception as e:
        print(f"Error fetching Google Sheets data: {e}")
        return pd.DataFrame()

def get_skill_icon_path(sprite_file: Optional[str], sprite_x: Optional[int], 
                       sprite_y: Optional[int], default_icon: str = "no_monster/no_monster_image.png") -> str:
    """Generate path to skill icon"""
    try:
        if not sprite_file:
            return f"{current_app.config['GITHUB_URL']}{default_icon}"

        # Remove .dds extension if present
        if sprite_file.endswith(".dds"):
            sprite_file = sprite_file[:-4]

        # Check for valid coordinates
        if sprite_x is not None and sprite_y is not None:
            return f"{current_app.config['GITHUB_URL']}{sprite_file}_{sprite_x}_{sprite_y}.png"
        else:
            return f"{current_app.config['GITHUB_URL']}{default_icon}"

    except Exception as e:
        print(f"Error creating icon path: {e}")
        return f"{current_app.config['GITHUB_URL']}{default_icon}"

def clean_description(desc: Optional[str]) -> str:
    """Clean and format description text"""
    if not desc:
        return ''
    return desc.replace('/n', ' ⭑ ').replace('\\n', ' ⭑ ')

def clean_dict(d: dict) -> dict:
    """Remove None values from dictionary"""
    return {k: v for k, v in d.items() if v is not None}

def get_payment_type_name(payment_type: int) -> str:
    """Get payment type name"""
    payment_types = {
        0: "Серебра",
        1: "Очков чести",
        2: "Очков хаоса",
        3: "ШОПа"
    }
    return payment_types.get(payment_type, "Неизвестная валюта")