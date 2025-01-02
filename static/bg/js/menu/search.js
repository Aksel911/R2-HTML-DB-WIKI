// Search functionality

// Keyboard navigation
function initializeKeyboardNavigation() {
    $(document).keydown(function (e) {
        const searchId = getSearchId();

        // Ctrl+F to focus search
        if (e.ctrlKey && e.keyCode === 70) {
            e.preventDefault();
            $(searchId).focus();
        }
        // Escape to clear search
        if (e.keyCode === 27) {
            $(searchId).val('').trigger('input');
            $('#searchSuggestions').hide();
        }
        // Left/Right arrows for pagination when not in search
        if (!$(searchId).is(':focus')) {
            if (e.keyCode === 37) { // Left arrow
                window.table.page('previous').draw('page');
            } else if (e.keyCode === 39) { // Right arrow
                window.table.page('next').draw('page');
            }
        }
    });
}

function initializeSearch() {
    const searchInput = document.getElementById(getSearchId().replace('#', ''));
    const suggestionsContainer = document.getElementById('searchSuggestions');
    const clearButton = document.getElementById('clearSearch');

    let searchDebounceTimer;

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.trim().toLowerCase();
        clearTimeout(searchDebounceTimer);

        if (searchTerm === '') {
            suggestionsContainer.style.display = 'none';
            app.applyFilters(1);
            return;
        }

        searchDebounceTimer = setTimeout(() => {
            const suggestions = findSuggestions(searchTerm);
            displaySuggestions(suggestions, searchTerm);
            app.applyFilters(1);
        }, 300);
    });

    clearButton.addEventListener('click', () => {
        searchInput.value = '';
        suggestionsContainer.style.display = 'none';
        app.applyFilters(1);
    });
}

// Determine current search input
function getSearchId() {
    if (window.location.pathname.includes('/monster')) return '#monsterSearch';
    if (window.location.pathname.includes('/merchant')) return '#merchantSearch';
    return '#itemSearch';
}

// Unified function for finding suggestions
function findSuggestions(searchTerm) {
    const isMonsterPage = window.location.pathname.includes('/monster');
    const isMerchantPage = window.location.pathname.includes('/merchants');
    const cachedData = app?.stateManager?.getState('cachedData');
    const items = isMonsterPage
        ? cachedData.monsters
        : isMerchantPage
        ? cachedData.merchants
        : cachedData.items;

    if (!items) {
        console.warn(`No data available for the current page`);
        return [];
    }

    const results = items
        .filter(item => {
            // Для торговцев используем ListID и MName
            if (isMerchantPage) {
                const matchesId = item.ListID.toString().toLowerCase().includes(searchTerm);
                const matchesName = item.MName.toLowerCase().includes(searchTerm);
                return matchesId || matchesName;
            }
            // Для монстров и предметов оставляем как есть
            const id = isMonsterPage ? item.MID : item.IID;
            const name = isMonsterPage ? item.MName : item.IName;
            const matchesId = id.toString().toLowerCase().includes(searchTerm);
            const matchesName = name.toLowerCase().includes(searchTerm);
            return matchesId || matchesName;
        })
        .slice(0, 8);
    return results;
}

// Updated displaySuggestions
function displaySuggestions(suggestions, searchTerm) {
    const suggestionsContainer = document.getElementById('searchSuggestions');

    if (!suggestions.length) {
        suggestionsContainer.innerHTML = '<div class="no-results">Нет результатов</div>';
        suggestionsContainer.style.display = 'contents';
        return;
    }

    const isMonsterPage = window.location.pathname.includes('/monster');
    const isMerchantPage = window.location.pathname.includes('/merchants');
    const resources = app?.stateManager?.getState('cachedData')?.resources || {};

    const suggestionsHtml = suggestions.map((item, index) => {
        // Определяем ID, имя и тип страницы
        let id, linkId, name, type;
        if (isMerchantPage) {
            id = item.ListID;        // для отображения в поиске
            linkId = item.MID;       // для ссылки
            name = item.MName;
            type = 'monster';
        } else if (isMonsterPage) {
            id = item.MID;
            linkId = item.MID;
            name = item.MName;
            type = 'monster';
        } else {
            id = item.IID;
            linkId = item.IID;
            name = item.IName;
            type = 'item';
        }

        const itemName = highlightMatch(name, searchTerm);
        const itemId = highlightMatch(id.toString(), searchTerm);
        const imageUrl = resources[id] || CONSTANTS.FALLBACK_IMAGE;

        return `
            <a href="/${type}/${linkId}" 
               class="search-suggestion" 
               data-id="${id}"
               style="--index: ${index}">
                <img src="${imageUrl}" 
                     alt="${name}" 
                     onerror="this.src='${CONSTANTS.FALLBACK_IMAGE}';">
                <span>[${itemId}] ${itemName}</span>
            </a>
        `;
    }).join('');

    suggestionsContainer.innerHTML = suggestionsHtml;
    suggestionsContainer.style.display = 'contents';
}
