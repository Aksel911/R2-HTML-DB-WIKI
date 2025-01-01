// Dropdown menu functionality
function initializeDropdownMenu() {
    let timeout;
    const DELAY = 300;

    $('.nav-item.dropdown').hover(
        function() {
            clearTimeout(timeout);
            const $dropdown = $(this);
            $('.nav-item.dropdown').not($dropdown).find('.dropdown-menu').hide();
            $dropdown.find('.dropdown-menu').show();
        },
        function() {
            const $dropdown = $(this);
            timeout = setTimeout(function() {
                if (!$dropdown.find('.dropdown-menu:hover').length) {
                    $dropdown.find('.dropdown-menu').hide();
                }
            }, DELAY);
        }
    );

    $('.dropdown-menu').hover(
        function() { clearTimeout(timeout); },
        function() {
            const $menu = $(this);
            timeout = setTimeout(function() {
                $menu.hide();
            }, DELAY);
        }
    );

    $('.dropdown-item').click(function(e) {
        const href = $(this).attr('href');
        if (href) {
            window.location.href = href;
        }
    });
}


document.addEventListener('DOMContentLoaded', function() {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    const dropdownToggles = document.querySelectorAll('.nav-link.dropdown-toggle');

    // Открытие/закрытие бургер-меню
    navbarToggler.addEventListener('click', function(e) {
        e.stopPropagation();
        navbarCollapse.classList.toggle('show');
    });

    // Обработка выпадающих меню
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const parentItem = this.closest('.nav-item');
            const currentMenu = parentItem.querySelector('.dropdown-menu');
            
            // Если меню уже открыто - закрываем его
            if (currentMenu.classList.contains('show')) {
                parentItem.classList.remove('show');
                currentMenu.classList.remove('show');
                return;
            }

            // Закрываем все другие открытые меню
            dropdownToggles.forEach(otherToggle => {
                const otherItem = otherToggle.closest('.nav-item');
                const otherMenu = otherItem.querySelector('.dropdown-menu');
                otherItem.classList.remove('show');
                otherMenu.classList.remove('show');
            });

            // Открываем текущее меню
            parentItem.classList.add('show');
            currentMenu.classList.add('show');
        });
    });

    // Закрытие при клике вне меню
    document.addEventListener('click', function(e) {
        if (!navbarCollapse.contains(e.target) && !navbarToggler.contains(e.target)) {
            navbarCollapse.classList.remove('show');
            dropdownToggles.forEach(toggle => {
                const parentItem = toggle.closest('.nav-item');
                const menu = parentItem.querySelector('.dropdown-menu');
                parentItem.classList.remove('show');
                menu.classList.remove('show');
            });
        }
    });
});