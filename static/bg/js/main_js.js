// Проверка темы до загрузки DOM
(function() {
    if (localStorage.getItem('theme') === 'dark') {
        document.documentElement.classList.add('dark-theme');
        document.body.classList.add('dark-theme');
    }
})();

// Utility function для поиска
function highlightMatch(text, searchTerm) {
    if (!searchTerm) return text;
    const escapedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedSearchTerm})`, 'gi');
    return text.replace(regex, '<span class="highlight">$1</span>');
}

// Инициализация всей функциональности когда документ готов
$(document).ready(function() {
    // Инициализация компонентов
    initializeKeyboardNavigation();
    initializeDropdownMenu();
    initializeTooltips();
    initializeSearch();
    initializeSpoilers();
    
    // Инициализация зума изображений только на странице монстров
    if ($('.monster-image').length) {
        initializeImageZoom();
    }
});

// Функциональность зума изображений
function initializeImageZoom() {
    $('.monster-image').each(function() {
        const $img = $(this);
        
        // Удаляем старые обработчики перед добавлением новых
        $img.off('mouseenter mouseleave');

        // Добавляем новые обработчики
        $img.hover(
            function() {
                $(this).css({
                    'transform': 'scale(2)',
                    'z-index': '1000',
                    'transition': 'transform 0.3s ease'
                });
            },
            function() {
                $(this).css({
                    'transform': 'scale(1)',
                    'z-index': '1',
                    'transition': 'transform 0.3s ease'
                });
            }
        );
    });
}

// Инициализация тултипов
function initializeTooltips() {
    $('[data-toggle="tooltip"]').tooltip();
}

// Функциональность спойлеров
function initializeSpoilers() {
    document.querySelectorAll('.skill-section').forEach(section => {
        const title = section.querySelector('.section-title');
        const content = section.querySelector('.skill-content');
        
        if (title && content) {
            // Создаем обертку для контента
            const contentWrapper = document.createElement('div');
            contentWrapper.className = 'skill-content-wrapper';
            content.parentNode.insertBefore(contentWrapper, content);
            contentWrapper.appendChild(content);
            
            // Создаем структуру заголовка
            const header = document.createElement('div');
            header.className = 'skill-header';
            
            const titleWrapper = document.createElement('div');
            titleWrapper.className = 'skill-title-wrapper';
            
            const toggle = document.createElement('div');
            toggle.className = 'skill-toggle';
            
            // Перемещаем заголовок в новую структуру
            title.parentNode.removeChild(title);
            titleWrapper.appendChild(title);
            header.appendChild(titleWrapper);
            header.appendChild(toggle);
            
            // Вставляем заголовок перед оберткой контента
            contentWrapper.parentNode.insertBefore(header, contentWrapper);
            
            // Устанавливаем начальную высоту
            contentWrapper.style.height = content.offsetHeight + 'px';
            
            // Добавляем обработчик клика
            header.addEventListener('click', function() {
                const isCollapsed = section.classList.contains('collapsed');
                
                if (isCollapsed) {
                    contentWrapper.style.height = content.offsetHeight + 'px';
                    section.classList.remove('collapsed');
                } else {
                    contentWrapper.style.height = content.offsetHeight + 'px';
                    contentWrapper.offsetHeight; // Форсируем reflow
                    section.classList.add('collapsed');
                }
            });
            
            // Добавляем наблюдатель за изменением размера
            const resizeObserver = new ResizeObserver(entries => {
                if (!section.classList.contains('collapsed')) {
                    contentWrapper.style.height = content.offsetHeight + 'px';
                }
            });
            
            resizeObserver.observe(content);
        }
    });
}

// Функциональность переключения темы
function initializeThemeToggle() {
    const toggleButton = document.getElementById('theme-toggle');
    if (!toggleButton) return;

    // Добавляем звуковой эффект при клике
    const soundEffect = new Audio('https://www.soundjay.com/buttons/sounds/button-30.mp3');

    toggleButton.addEventListener('click', () => {
        // Переключаем тему
        document.documentElement.classList.toggle('dark-theme');
        document.body.classList.toggle('dark-theme');
        
        // Сохраняем состояние
        localStorage.setItem(
            'theme',
            document.documentElement.classList.contains('dark-theme') ? 'dark' : 'light'
        );

        // Воспроизводим звук
        soundEffect.play().catch(() => {}); // Игнорируем ошибки воспроизведения

        // Добавляем эффект подпрыгивания
        toggleButton.classList.toggle('bouncing');
        setTimeout(() => toggleButton.classList.remove('bouncing'), 1000);
    });
}

// Инициализируем переключатель темы при загрузке DOM
document.addEventListener('DOMContentLoaded', initializeThemeToggle);