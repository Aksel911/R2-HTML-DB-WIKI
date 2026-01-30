// Модуль управления темой
var ThemeManager = {
    THEME_KEY: 'theme',
    DARK_THEME_CLASS: 'dark-theme',
    
    // Метод инициализации темы до загрузки DOM
    initThemeImmediately: function() {
        var savedTheme = localStorage.getItem(this.THEME_KEY);
        
        // Если тема темная, добавляем классы немедленно
        if (savedTheme === 'dark') {
            // Добавляем классы до загрузки документа
            document.documentElement.classList.add(this.DARK_THEME_CLASS);
            document.body.classList.add(this.DARK_THEME_CLASS);
            
            // Добавляем критические стили для предотвращения мигания
            var style = document.createElement('style');
            
            document.head.appendChild(style);
        }
    },

    // Метод переключения темы
    toggleTheme: function() {
        // Звуковой эффект
        var soundEffect = new Audio('https://github.com/Aksel911/R2-Textures/raw/refs/heads/main/%5BFIX%5D%20FIXES/%5BFIX%5D%20%D0%A1%D1%82%D0%B0%D1%80%D1%8B%D0%B9%20%D1%8D%D1%84%D1%84%D0%B5%D0%BA%D1%82%20%D0%B7%D0%B0%D1%82%D0%BE%D1%87%D0%BA%D0%B8/sound/gui_click.wav');

        // Проверяем текущее состояние темы
        var isDarkTheme = document.documentElement.classList.contains(this.DARK_THEME_CLASS);
        
        // Переключаем тему
        if (isDarkTheme) {
            document.documentElement.classList.remove(this.DARK_THEME_CLASS);
            document.body.classList.remove(this.DARK_THEME_CLASS);
            localStorage.setItem(this.THEME_KEY, 'light');
        } else {
            document.documentElement.classList.add(this.DARK_THEME_CLASS);
            document.body.classList.add(this.DARK_THEME_CLASS);
            localStorage.setItem(this.THEME_KEY, 'dark');
        }

        // Воспроизводим звук
        soundEffect.play().catch(function() {}); 

        // Добавляем эффект подпрыгивания кнопки
        var themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.classList.add('bouncing');
            setTimeout(function() {
                themeToggle.classList.remove('bouncing');
            }, 1000);
        }
    }
};

// Утилиты
var SearchUtils = {
    // Функция подсветки совпадений при поиске
    highlightMatch: function(text, searchTerm) {
        if (!searchTerm) return text;
        var escapedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        var regex = new RegExp('(' + escapedSearchTerm + ')', 'gi');
        return text.replace(regex, '<span class="highlight">$1</span>');
    }
};

// Менеджер инициализации компонентов
var ComponentInitializer = {
    // Список компонентов для инициализации с проверкой
    components: [
        'initializeKeyboardNavigation',
        'initializeDropdownMenu', 
        'initializeTooltips', 
        'initializeSpoilers', 
        'initializeSearch'
    ],

    // Метод инициализации всех компонентов
    initializeAll: function() {
        this.components.forEach(function(componentFunc) {
            if (typeof window[componentFunc] === 'function') {
                window[componentFunc]();
            }
        });
    }
};

// Общие утилиты для инициализации
var CommonUtils = {
    // Инициализация тултипов (если используется Bootstrap)
    initializeTooltips: function() {
        if ($ && $.fn.tooltip) {
            $('[data-toggle="tooltip"]').tooltip();
        }
    }
};

// Вызываем метод инициализации темы немедленно
ThemeManager.initThemeImmediately();

// Главный модуль инициализации
document.addEventListener('DOMContentLoaded', function() {
    // Настраиваем кнопку переключения темы
    var themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            ThemeManager.toggleTheme();
        });
    }

    // Инициализируем jQuery-компоненты
    $(document).ready(function() {
        // Инициализируем общие компоненты
        if (typeof ComponentInitializer !== 'undefined') {
            ComponentInitializer.initializeAll();
        }
        
        // Инициализируем тултипы
        if (typeof CommonUtils !== 'undefined') {
            CommonUtils.initializeTooltips();
        }
    });

    // JavaScript
    const paginationBottom = document.querySelector('.pagination-bottom');

    if (paginationBottom) {
        paginationBottom.addEventListener('click', function (e) {
            // Добавляем класс для отключения всех анимаций Atropos
            document.body.classList.add('no-atropos-transitions');

            setTimeout(() => {
                document.body.classList.remove('no-atropos-transitions');
            }, 300); // Задержка соответствует длительности анимации
        });
    }

});