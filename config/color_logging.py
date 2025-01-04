from flask import request
import logging
from datetime import datetime

class Colors:
    # Основные цвета для четкого разделения информации
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    BLUE = '\033[94m'
    CYAN = '\033[96m'
    MAGENTA = '\033[95m'
    GRAY = '\033[90m'
    RESET = '\033[0m'
    BOLD = '\033[1m'

class CompactRequestFormatter(logging.Formatter):
    def format(self, record):
        try:
            if not request:
                return ""
                
            timestamp = datetime.now().strftime('%H:%M:%S')
            
            if "Debugger PIN:" in str(record.msg):
                pin = str(record.msg).split(': ')[1]
                return f"{Colors.MAGENTA}[DEBUG] {Colors.CYAN}PIN: {pin}{Colors.RESET}"

            method = request.method
            path = request.path
            status = str(record.msg).split('"')[-1].strip()
            
            method_color = {
                'GET': Colors.BLUE,
                'POST': Colors.GREEN,
                'PUT': Colors.YELLOW,
                'DELETE': Colors.RED,
                'PATCH': Colors.MAGENTA
            }.get(method, Colors.GRAY)

            status_color = (Colors.GREEN if "200" in status else
                          Colors.CYAN if "304" in status else
                          Colors.YELLOW if "4" in status[0] else
                          Colors.RED if "5" in status[0] else Colors.RESET)

            return (
                f"{Colors.GRAY}[{Colors.CYAN}{timestamp}{Colors.GRAY}]{Colors.RESET} "
                f"{method_color}{Colors.BOLD}{method}{Colors.RESET} "
                f"{Colors.BLUE}{path}{Colors.RESET} "
                f"{status_color}{status}{Colors.RESET} "
            )
            
        except Exception as e:
            return f"{Colors.RED}Error: {str(e)}{Colors.RESET}"

def setup_colored_logging(app):

    handler = logging.StreamHandler()
    handler.setFormatter(CompactRequestFormatter())
    
    for logger in [app.logger, logging.getLogger('werkzeug')]:
        logger.handlers = []
        logger.addHandler(handler)
        logger.setLevel(logging.INFO)