import os
from dotenv import load_dotenv

# URLs for Google Sheets
MONSTER_CLASS_URL = "https://docs.google.com/spreadsheets/d/1fcCO8ZwJsENYZhKBpEfdgaTswANkrGolBtAcqVeTECs/edit?usp=sharing"
MONSTER_RACE_URL = "https://docs.google.com/spreadsheets/d/1c3Yh1GD-6GnDufvGzUdfRQtq5zHXkj9DRq_S9t1Lf9s/edit?usp=sharing"
#MONSTER_LOCATION_URL = "https://docs.google.com/spreadsheets/d/1rBuuiMUvlYZwNPaRhdk5PkhTQa1mwj5z8dUDKWoBetU/edit?usp=sharing"
MONSTER_LOCATION_URL = "https://docs.google.com/spreadsheets/d/1i4w5CL7Jn3t_N8A44uG6FppqjPEEBlVw4JFPjzo5jSk/edit?usp=sharing"
SKILLAPPLYRACE_URL = "https://docs.google.com/spreadsheets/d/1Vz-YWTOGnFUqzlieWfUg0NM-fSilneIEZ03FratjC2E/edit?usp=sharing"
ATTRIBUTE_TYPE_WEAPON_URL ="https://docs.google.com/spreadsheets/d/1p8ghiK3AR7Qy-Ckpc3tRcHgIDm507S5i_JBXHHe1dHM/edit?usp=sharing"
ATTRIBUTE_TYPE_ARMOR_URL ="https://docs.google.com/spreadsheets/d/1Y7Ryq9utZ3643XuvlDHhkLAshC6aZ0n9awoYFAq6wmw/edit?usp=sharing"

MONSTER_MGBJ_TYPE_URL = "https://docs.google.com/spreadsheets/d/1SLJYHODWDMFpcOIFEfTK7q0ORpufT753kYsRiqYE3p8/edit?usp=sharing"

# GitHub URL
GITHUB_URL = "https://raw.githubusercontent.com/Aksel911/R2-HTML-DB/main/static/"

def get_database_config():
    """Get database configuration from environment variables"""
    return {
        'DRIVER': os.getenv('DB_DRIVER'),
        'SERVER': os.getenv('DB_SERVER'),
        'DATABASE': os.getenv('DB_NAME'),
        'UID': os.getenv('DB_USER'),
        'PWD': os.getenv('DB_PASSWORD'),
    }

def load_config(app):
    """Load all configuration settings"""
    load_dotenv()
    
    # Check required environment variables
    required_env_vars = ['DB_USER', 'DB_PASSWORD']
    missing_vars = [var for var in required_env_vars if not os.getenv(var)]
    if missing_vars:
        raise ValueError(f"Missing required environment variables: {', '.join(missing_vars)}")
    
    # Set Flask configuration
    app.config['DATABASE_CONFIG'] = get_database_config()
    app.config['GITHUB_URL'] = GITHUB_URL
    app.config['DATABASE_NAME'] = os.getenv('DB_NAME', 'FNLParm')
    app.config['PORT'] = os.getenv('PORT', 5000) # Default port = 5000