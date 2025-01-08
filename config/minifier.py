from flask import Flask, render_template_string
from bs4 import BeautifulSoup
import re
import csscompressor
import rjsmin

class TemplateMinifier:
    def __init__(self, app=None):
        self.app = app
        if app is not None:
            self.init_app(app)

    def init_app(self, app):
        """Инициализация минификатора с Flask приложением"""
        app.jinja_env.globals['include_minified'] = self.include_minified
        app.jinja_env.globals['minify_js'] = self.minify_javascript
        app.jinja_env.globals['minify_css'] = self.minify_css
        
        original_render_template = app.jinja_env.get_template
        
        def minified_render_template(*args, **kwargs):
            template = original_render_template(*args, **kwargs)
            original_render = template.render
            
            def render_and_minify(*args, **kwargs):
                content = original_render(*args, **kwargs)
                return self.minify_html(content)
                
            template.render = render_and_minify
            return template
            
        app.jinja_env.get_template = minified_render_template

    def include_minified(self, template_path):
        try:
            with self.app.open_resource(f'templates/{template_path}') as f:
                content = f.read().decode('utf-8')
            return self.minify_content(content, template_path)
        except Exception as e:
            self.app.logger.error(f"Error minifying included template {template_path}: {str(e)}")
            return ''

    def minify_content(self, content, filename):
        ext = filename.split('.')[-1].lower()
        
        if ext == 'js':
            return self.minify_javascript(content)
        elif ext == 'css':
            return self.minify_css(content)
        elif ext == 'html':
            return self.minify_html(content)
        return content

    def advanced_js_minify(self, content):
        """Продвинутая минификация JavaScript"""
        try:
            # Удаление комментариев
            content = re.sub(r'/\*[\s\S]*?\*/', '', content)
            content = re.sub(r'//.*?\n', '\n', content)
            
            # Минификация с помощью rjsmin
            content = rjsmin.jsmin(content)
            
            # Дополнительные оптимизации
            content = re.sub(r'([{,])\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:', r'\1\2:', content)
            content = re.sub(r'\s*([=+\-*/])\s*', r'\1', content)
            
            # Замена длинных имен переменных на короткие
            var_map = {}
            var_counter = 0
            
            def replace_var(match):
                nonlocal var_counter
                var_name = match.group(1)
                if var_name not in var_map:
                    var_map[var_name] = f'_{var_counter}'
                    var_counter += 1
                return var_map[var_name]
            
            content = re.sub(r'\b(var_[a-zA-Z0-9_$]+)\b', replace_var, content)
            
            return content
        except:
            return content

    def minify_html(self, content):
        if not content:
            return content
        
        # Сохраняем специальные блоки
        preserved = {}
        
        def preserve_block(match):
            placeholder = f"PRESERVED_{len(preserved)}"
            preserved[placeholder] = match.group(0)
            return placeholder

        # Сохраняем блоки pre, code, textarea, script и style
        content = re.sub(
            r'(<(pre|code|textarea|script|style)[^>]*>.*?</\2>)',
            preserve_block,
            content,
            flags=re.DOTALL
        )

        # Минификация HTML
        soup = BeautifulSoup(content, 'html.parser')
        
        # Минификация inline CSS
        for tag in soup.find_all(style=True):
            tag['style'] = self.minify_css(tag['style'])

        # Минификация inline JavaScript
        js_attrs = ['onclick', 'onload', 'onsubmit', 'onchange', 'oninput']
        for tag in soup.find_all(attrs={attr: True for attr in js_attrs}):
            for attr in js_attrs:
                if tag.has_attr(attr):
                    tag[attr] = self.minify_javascript(tag[attr])

        content = str(soup)
        
        # Базовая минификация HTML
        content = re.sub(r'\s+', ' ', content)
        content = re.sub(r'>\s+<', '><', content)
        content = re.sub(r'\s+/>', '/>', content)
        content = re.sub(r'<!--[\s\S]*?-->', '', content)  # Удаление комментариев
        
        # Восстанавливаем сохраненные блоки
        for placeholder, original in preserved.items():
            if placeholder in content:
                if re.match(r'<script[^>]*>', original):
                    original = re.sub(
                        r'<script([^>]*)>(.*?)</script>',
                        lambda m: f'<script{m.group(1)}>{self.advanced_js_minify(m.group(2))}</script>',
                        original,
                        flags=re.DOTALL
                    )
                elif re.match(r'<style[^>]*>', original):
                    original = re.sub(
                        r'<style([^>]*)>(.*?)</style>',
                        lambda m: f'<style{m.group(1)}>{self.minify_css(m.group(2))}</style>',
                        original,
                        flags=re.DOTALL
                    )
                content = content.replace(placeholder, original)
        
        return content.strip()

    def minify_javascript(self, content):
        """Минификация JavaScript"""
        try:
            return self.advanced_js_minify(content)
        except:
            return content

    def minify_css(self, content):
        """Минификация CSS"""
        try:
            # Базовая минификация
            content = re.sub(r'/\*[\s\S]*?\*/', '', content)  # Удаление комментариев
            content = re.sub(r'\s+', ' ', content)  # Удаление лишних пробелов
            content = re.sub(r';\s*}', '}', content)  # Удаление ; перед }
            content = re.sub(r'\s*([:;,{}])\s*', r'\1', content)  # Удаление пробелов вокруг специальных символов
            
            # Продвинутая минификация через csscompressor
            content = csscompressor.compress(content)
            
            return content.strip()
        except:
            return content

def register_template_minifier(app):
    minifier = TemplateMinifier(app)
    return minifier