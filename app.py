from flask import Flask, render_template, request
from routes import register_routes
from config.settings import load_config
from os.path import splitext, exists
from os import makedirs
from flask_talisman import Talisman
import logging
import traceback
from datetime import datetime

# Setup logging configuration
def setup_logging(app):
    # Create logs directory if it doesn't exist
    log_dir = 'logs'
    if not exists(log_dir):
        makedirs(log_dir)
        
    # Get current date for file names
    current_date = datetime.now().strftime('%Y-%m-%d')
    
    # Форматтер для обычных логов
    class RequestFormatter(logging.Formatter):
        def format(self, record):
            if hasattr(record, 'request_data'):
                # Форматирование для запроса
                return (
                    f"\n{'='*100}\n"
                    f"TIME: {self.formatTime(record)}\n"
                    f"TYPE: {record.levelname}\n"
                    f"REQUEST: {record.request_data['method']} {record.request_data['url']}\n"
                    f"HEADERS:\n{json.dumps(record.request_data['headers'], indent=2)}\n"
                    f"BODY: {record.request_data['body']}\n"
                    f"{'='*100}"
                )
            elif hasattr(record, 'response_data'):
                # Форматирование для ответа
                return (
                    f"\n{'-'*100}\n"
                    f"TIME: {self.formatTime(record)}\n"
                    f"RESPONSE: {record.response_data['status']}\n"
                    f"HEADERS:\n{json.dumps(record.response_data['headers'], indent=2)}\n"
                    f"{'-'*100}"
                )
            else:
                # Общий формат для других логов
                return (
                    f"\n{'-'*50}\n"
                    f"TIME: {self.formatTime(record)}\n"
                    f"TYPE: {record.levelname}\n"
                    f"MODULE: {record.module}\n"
                    f"MESSAGE: {record.getMessage()}\n"
                    f"{'-'*50}"
                )

    # File handler for all logs with date in filename
    file_handler = logging.FileHandler(
        f'{log_dir}/app_{current_date}.log',
        encoding='utf-8'
    )
    file_handler.setFormatter(RequestFormatter())
    file_handler.setLevel(logging.INFO)
    
    # Error file handler with date in filename
    error_file_handler = logging.FileHandler(
        f'{log_dir}/error_{current_date}.log',
        encoding='utf-8'
    )
    error_file_handler.setFormatter(logging.Formatter(
        "\n{'='*100}\n"
        "TIME: %(asctime)s\n"
        "ERROR: %(levelname)s\n"
        "MODULE: %(module)s\n"
        "LOCATION: %(pathname)s:%(lineno)d\n"
        "FUNCTION: %(funcName)s\n"
        "MESSAGE: %(message)s\n"
        "TRACEBACK:\n%(exc_info)s\n"
        f"{'='*100}"
    ))
    error_file_handler.setLevel(logging.ERROR)
    
    # Remove default handlers
    app.logger.handlers.clear()
    
    # Add handlers to app logger
    app.logger.addHandler(file_handler)
    app.logger.addHandler(error_file_handler)
    app.logger.setLevel(logging.INFO)
    
    # Log startup
    app.logger.info(f"Application started")
    

app = Flask(__name__)

# Configure Talisman security headers
# Talisman(app, force_https=False, content_security_policy={
#     'style-src': "'self' 'unsafe-inline' https://fonts.googleapis.com https://maxcdn.bootstrapcdn.com https://cdnjs.cloudflare.com https://cdn.datatables.net https://use.fontawesome.com https://ka-f.fontawesome.com",
#     'script-src': "'self' 'unsafe-inline' https://code.jquery.com https://cdnjs.cloudflare.com https://cdn.datatables.net https://maxcdn.bootstrapcdn.com",
#     'img-src': "'self' data: https://raw.githubusercontent.com https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://use.fontawesome.com https://ka-f.fontawesome.com"
# })

# Load configuration and setup logging
load_config(app)
setup_logging(app)

# Request logging middleware
@app.before_request
def log_request_info():
    app.logger.info(f'Request: {request.method} {request.url}\nHeaders: {dict(request.headers)}\nBody: {request.get_data()}')

@app.after_request
def log_response_info(response):
    app.logger.info(f'Response: {response.status}\nHeaders: {dict(response.headers)}')
    return response

# Register routes
register_routes(app)

@app.template_filter('remove_extension')
def remove_extension(value):
    return splitext(value)[0]

@app.route('/favicon.ico')
def favicon():
    return '<link rel="shortcut icon" href="https://raw.githubusercontent.com/Aksel911/R2-HTML-DB/refs/heads/main/static/favicon/favicon.ico" />'

# Enhanced error handlers with detailed logging
@app.errorhandler(404)
def not_found_error(error):
    app.logger.error(f"404 Error: {error}\nPath: {request.path}\nIP: {request.remote_addr}\n{traceback.format_exc()}")
    return render_template('errors/404.html', error=error), 404

@app.errorhandler(500)
def internal_error(error):
    app.logger.error(f"500 Error: {error}\nPath: {request.path}\nIP: {request.remote_addr}\n{traceback.format_exc()}")
    return render_template('errors/500.html', error=error), 500

@app.errorhandler(400)
def bad_request_error(error):
    app.logger.error(f"400 Error: {error}\nPath: {request.path}\nIP: {request.remote_addr}\n{traceback.format_exc()}")
    return render_template('errors/400.html', error=error), 400

@app.errorhandler(403)
def forbidden_error(error):
    app.logger.error(f"403 Error: {error}\nPath: {request.path}\nIP: {request.remote_addr}\n{traceback.format_exc()}")
    return render_template('errors/403.html', error=error), 403

@app.errorhandler(405)
def method_not_allowed(error):
    app.logger.error(f"405 Error: {error}\nPath: {request.path}\nIP: {request.remote_addr}\n{traceback.format_exc()}")
    return render_template('errors/405.html', error=error), 405


@app.route('/')
def home():
    return render_template('main_page.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=app.config['PORT'], debug=True)