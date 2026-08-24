import os
from flask import Flask, g, redirect, render_template, request, send_from_directory
from routes import register_routes
from config.settings import load_config
from os.path import splitext, exists, join
from os import makedirs
import logging
from logging.handlers import TimedRotatingFileHandler
from time import perf_counter
from config.color_logging import *


def check_version():
    """Read version from .ver file and set it to app.config"""
    try:
        with open(".ver", "r", encoding='utf-8') as ver_file:
            for line in ver_file:
                if line.startswith("VERSION="):
                    app.config['VERSION'] = line.split("=", 1)[1].strip()
                    break
            else:
                app.config['VERSION'] = 'v0.0'
                print("Warning: VERSION= not found in .ver file!")
    except FileNotFoundError:
        print("Warning: File .ver not found!")
        app.config['VERSION'] = 'not found!'
    except Exception as e:
        print(f"Error reading .ver file: {e}")
        app.config['VERSION'] = 'error!'

# Setup logging configuration
def setup_logging(app):
    # Create logs directory if it doesn't exist
    log_dir = 'logs'
    if not exists(log_dir):
        makedirs(log_dir)

    # Общий лог: одна компактная строка на событие, ротация раз в сутки, 14 дней истории
    file_handler = TimedRotatingFileHandler(
        f'{log_dir}/app.log',
        when='midnight',
        interval=1,
        backupCount=14,
        encoding='utf-8',
        utc=False
    )
    file_handler.suffix = '%Y-%m-%d'
    file_handler.setFormatter(logging.Formatter(
        '%(asctime)s %(levelname)s [%(module)s] %(message)s'
    ))
    file_handler.setLevel(logging.INFO)

    # Отдельный лог ошибок (с трейсбеком, если он есть), та же ротация
    error_file_handler = TimedRotatingFileHandler(
        f'{log_dir}/error.log',
        when='midnight',
        interval=1,
        backupCount=14,
        encoding='utf-8',
        utc=False
    )
    error_file_handler.suffix = '%Y-%m-%d'
    error_file_handler.setFormatter(logging.Formatter(
        '%(asctime)s %(levelname)s [%(module)s] %(pathname)s:%(lineno)d %(funcName)s: %(message)s'
    ))
    error_file_handler.setLevel(logging.ERROR)

    # Дублируем в stdout — чтобы строки были видны в `docker logs`
    stream_handler = logging.StreamHandler()
    stream_handler.setFormatter(logging.Formatter(
        '%(asctime)s %(levelname)s [%(module)s] %(message)s'
    ))
    stream_handler.setLevel(logging.INFO)

    # Remove default handlers
    app.logger.handlers.clear()

    # Add handlers to app logger
    app.logger.addHandler(file_handler)
    app.logger.addHandler(error_file_handler)
    app.logger.addHandler(stream_handler)
    app.logger.setLevel(logging.INFO)
    
    # Log startup
    check_version()
    app.logger.info(f"Application started: {app.config['VERSION']}")
    

app = Flask(__name__)

# Load configuration and setup logging
load_config(app)
setup_logging(app)


# Setup analytics (Firebase + Umami)
@app.context_processor
def inject_analytics_config():
    return {
        'enable_analytics': app.config['ENABLE_FIREBASE_ANALYTICS'],
        'firebase_config': app.config['FIREBASE_CONFIG'],
        'enable_umami': app.config['ENABLE_UMAMI_ANALYTICS'],
        'umami_config': app.config['UMAMI_CONFIG'],
        'site_url': app.config['SITE_URL']
    }


def client_ip():
    """Реальный IP клиента (за Caddy/reverse-proxy)"""
    forwarded = request.headers.get('X-Forwarded-For', '')
    if forwarded:
        return forwarded.split(',')[0].strip()
    return request.remote_addr or '-'


# Request logging middleware: только засекаем время, тело и заголовки не трогаем
@app.before_request
def start_request_timer():
    g._started_at = perf_counter()


@app.after_request
def mark_service_endpoints_noindex(response):
    # Служебные JSON/фрагменты не должны попадать в поисковый индекс,
    # даже если на них где-то появится прямая ссылка
    if request.path.startswith(('/api/', '/ajax/', '/render_template/')):
        response.headers['X-Robots-Tag'] = 'noindex'
    return response


@app.after_request
def log_request_summary(response):
    started_at = g.pop('_started_at', None)
    duration_ms = (perf_counter() - started_at) * 1000 if started_at else 0.0
    # Одна компактная строка на запрос
    app.logger.info(
        f'{request.method} {request.path} {response.status_code} '
        f'{duration_ms:.1f}ms {client_ip()}'
    )
    return response

# Register routes
register_routes(app)

@app.template_filter('remove_extension')
def remove_extension(value):
    return splitext(value)[0]

FAVICON_DIR = join(app.root_path, 'static', 'favicon')
FAVICON_FALLBACK_URL = (
    'https://raw.githubusercontent.com/Aksel911/R2-HTML-DB/'
    'refs/heads/main/static/favicon/favicon.ico'
)


@app.route('/favicon.ico')
def favicon():
    # Отдаём саму иконку; если файла нет в образе — редиректим на GitHub
    if exists(join(FAVICON_DIR, 'favicon.ico')):
        return send_from_directory(
            FAVICON_DIR, 'favicon.ico', mimetype='image/vnd.microsoft.icon'
        )
    return redirect(FAVICON_FALLBACK_URL, code=302)

# Error handlers: 4xx пишем кратко (warning), полный traceback — только в 500
@app.errorhandler(404)
def not_found_error(error):
    app.logger.warning(f"404 {request.path} IP: {client_ip()}")
    return render_template('errors/404.html', error=error), 404

@app.errorhandler(500)
def internal_error(error):
    app.logger.error(
        f"500 {request.path} IP: {client_ip()} — {error}", exc_info=True
    )
    return render_template('errors/500.html', error=error), 500

@app.errorhandler(400)
def bad_request_error(error):
    app.logger.warning(f"400 {request.path} IP: {client_ip()} — {error}")
    return render_template('errors/400.html', error=error), 400

@app.errorhandler(403)
def forbidden_error(error):
    app.logger.warning(f"403 {request.path} IP: {client_ip()}")
    return render_template('errors/403.html', error=error), 403

@app.errorhandler(405)
def method_not_allowed(error):
    app.logger.warning(f"405 {request.method} {request.path} IP: {client_ip()}")
    return render_template('errors/405.html', error=error), 405


@app.route('/')
def home():
    return render_template('main_page.html')


if __name__ == '__main__':
    check_version()
    app.logger.info(f"{Colors.GREEN}R2-HTML-DB-WIKI{Colors.RESET}{Colors.YELLOW} Started successfully!{Colors.RESET}{Colors.GRAY} Version: {Colors.RESET}{Colors.GREEN}{app.config['VERSION']}{Colors.RESET}")
    
    # debug только по явному флагу окружения: Werkzeug-дебаггер на проде = RCE
    debug = os.getenv('FLASK_DEBUG', 'false').strip().lower() in ('1', 'true', 'yes', 'on')
    app.run(host='0.0.0.0', port=int(app.config['PORT']), debug=debug)
