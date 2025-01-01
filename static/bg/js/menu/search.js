// Search functionality

// Keyboard navigation
function initializeKeyboardNavigation() {
    $(document).keydown(function(e) {
        const isMonsterPage = $('#monsterSearch').length > 0;
        const searchId = isMonsterPage ? '#monsterSearch' : '#itemSearch';
        
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
    // Надежная проверка типа страницы
    const isMonsterPage = window.location.pathname.includes('/monster');
    const searchInput = document.getElementById(isMonsterPage ? 'monsterSearch' : 'itemSearch');
    const suggestionsContainer = document.getElementById('searchSuggestions');
    const clearButton = document.getElementById('clearSearch');

    console.log('Search initialization:', {
        isMonsterPage,
        searchInput: !!searchInput,
        suggestionsContainer: !!suggestionsContainer,
        clearButton: !!clearButton
    });

    if (!searchInput || !suggestionsContainer || !clearButton) {
        console.error('Required search elements not found');
        return;
    }

    // Проверяем наличие данных
    if (!app?.stateManager?.getState('cachedData')) {
        console.error('No cached data available');
        return;
    }

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
            const suggestions = findSuggestions(searchTerm, isMonsterPage);
            displaySuggestions(suggestions, searchTerm, isMonsterPage);
            app.applyFilters(1);
        }, 300);
    });

    clearButton.addEventListener('click', () => {
        searchInput.value = '';
        suggestionsContainer.style.display = 'none';
        app.applyFilters(1);
    });
}

// Единая функция для поиска предложений
function findSuggestions(searchTerm, isMonsterPage) {
    const cachedData = app?.stateManager?.getState('cachedData');
    
    // Отладка состояния кэша
    console.log('Cache state:', {
        stateManager: !!app?.stateManager,
        cachedData: cachedData ? Object.keys(cachedData) : null,
        monsters: cachedData?.monsters?.length || 0,
        items: cachedData?.items?.length || 0,
        isMonsterPage
    });

    if (!cachedData) {
        console.warn('No cached data available');
        return [];
    }

    const items = isMonsterPage ? cachedData.monsters : cachedData.items;
    
    if (!items) {
        console.warn(`No ${isMonsterPage ? 'monsters' : 'items'} data available`);
        return [];
    }

    const results = items
        .filter(item => {
            const id = isMonsterPage ? item.MID : item.IID;
            const name = isMonsterPage ? item.MName : item.IName;
            const matchesId = id.toString().toLowerCase().includes(searchTerm);
            const matchesName = name.toLowerCase().includes(searchTerm);
            return matchesId || matchesName;
        })
        .slice(0, 8);

    // Отладка результатов
    console.log('Search results:', {
        searchTerm,
        resultsCount: results.length,
        firstResult: results[0],
        isMonsterPage
    });

    return results;
}

// Модифицируем displaySuggestions для отладки
function displaySuggestions(suggestions, searchTerm, isMonsterPage) {
    const suggestionsContainer = document.getElementById('searchSuggestions');
    if (!suggestionsContainer) {
        console.error('Suggestions container not found');
        return;
    }
    
    console.log('Display Debug:', {
        suggestionsCount: suggestions.length,
        searchTerm,
        isMonsterPage,
        containerExists: !!suggestionsContainer
    });

    if (!suggestions.length) {
        suggestionsContainer.innerHTML = '<div class="no-results">Нет результатов</div>';
        suggestionsContainer.style.display = 'contents';
        return;
    }

    const resources = app?.stateManager?.getState('cachedData')?.resources || {};
    
    const suggestionsHtml = suggestions.map((item, index) => {
        const id = isMonsterPage ? item.MID : item.IID;
        const name = isMonsterPage ? item.MName : item.IName;
        const itemName = highlightMatch(name, searchTerm);
        const itemId = highlightMatch(id.toString(), searchTerm);
        const imageUrl = resources[id] || CONSTANTS.FALLBACK_IMAGE;
        const type = isMonsterPage ? 'monster' : 'item';
        
        return `
            <a href="/${type}/${id}" 
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


