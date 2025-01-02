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
    // Инициализация компонентов с проверкой существования каждой функции
    if (typeof initializeKeyboardNavigation === 'function') {
        initializeKeyboardNavigation();
    }
    
    if (typeof initializeDropdownMenu === 'function') {
        initializeDropdownMenu();
    }
    
    if (typeof initializeTooltips === 'function') {
        initializeTooltips();
    }
    
    if (typeof initializeSpoilers === 'function') {
        initializeSpoilers();
    }

    if (typeof initializeSearch === 'function') {
        initializeSearch();
    }

});



// Инициализация тултипов
function initializeTooltips() {
    $('[data-toggle="tooltip"]').tooltip();
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






