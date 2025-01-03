// ! Constants and configurations
const CONSTANTS = {
    DEBOUNCE_DELAY: 300,
    DEFAULT_PER_PAGE: 25,
    FALLBACK_IMAGE: 'https://raw.githubusercontent.com/Aksel911/R2-HTML-DB/main/static/no_monster/no_monster_image.png',
    PAGINATION_RADIUS: 2,
    ERROR_DISPLAY_TIME: 5000,
    TABLE_FADE_DURATION: 300,
    BUTTON_ANIMATION_DURATION: 200,
    ANIMATION_CLASSES: {
        FADE_ENTER: 'table-fade-enter',
        FADE_ENTER_ACTIVE: 'table-fade-enter-active'
    },
    PER_PAGE_OPTIONS: [10, 25, 50, 75, 100, 150, 200, 500, 1000]
};

// ! Base Class for Event Handling
class EventEmitter {
    constructor() {
        this.events = {};
    }

    on(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
        return () => this.off(event, callback);
    }

    off(event, callback) {
        if (!this.events[event]) return;
        this.events[event] = this.events[event].filter(cb => cb !== callback);
    }

    emit(event, data) {
        if (!this.events[event]) return;
        this.events[event].forEach(callback => callback(data));
    }
}

// State Management
class StateManager extends EventEmitter {
    constructor() {
        super();
        this._state = {
            currentPage: 1,
            cachedData: null,
            debounceTimer: null,
            isLoading: false,
            error: null,
            filters: {},
            perPage: CONSTANTS.DEFAULT_PER_PAGE
        };
    }

    setState(key, value) {
        const oldValue = this._state[key];
        this._state[key] = value;

        if (oldValue !== value) {
            this.emit('stateChange', {
                key,
                value,
                oldValue
            });
        }
    }

    getState(key) {
        return this._state[key];
    }
}

// Data Service
class DataService {
    constructor(stateManager) {
        this.stateManager = stateManager;
    }

    async fetchData(forceReload = false) {
        const cachedData = this.stateManager.getState('cachedData');
        if (cachedData && !forceReload) {
            return cachedData;
        }

        this.stateManager.setState('isLoading', true);

        try {
            const response = await fetch(`${window.location.pathname}?all=1`, {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (data.error) {
                throw new Error(data.error);
            }

            this.stateManager.setState('cachedData', data);
            return data;

        } catch (error) {
            this.stateManager.setState('error', error.message);
            return null;
        } finally {
            this.stateManager.setState('isLoading', false);
        }
    }
}

// Filter Logic
class FilterManager {
    static collectFilters() {
        const filters = {};

        document.querySelectorAll('.form-control, .custom-control-input').forEach(input => {
            if (input.id === 'perPageSelect') return;

            let value = input.type === 'checkbox' ? input.checked : input.value.trim();

            if (value !== '' && value !== false) {
                if (input.type === 'checkbox' && value === true) {
                    value = '1';
                }

                switch (input.id) {
                    case 'priceMin':
                        filters['PriceMin'] = value;
                        break;
                    case 'priceMax':
                        filters['PriceMax'] = value;
                        break;
                    default:
                        filters[input.id] = value;
                }
            }
        });

        return filters;
    }

    static filterData(merchants, filters) {
        return merchants.filter(merchant =>
            this._applyAllFilters(merchant, filters));
    }

    static _applyAllFilters(merchant, filters) {
        return Object.entries(filters).every(([key, value]) => {
            if (!value || value === '') return true;

            if (key.endsWith('Min') || key.endsWith('Max')) {
                return this._applyRangeFilter(merchant, key, value);
            }
            return this._applyBasicFilter(merchant, key, value);
        });
    }

    static _applyRangeFilter(merchant, key, value) {
        const baseKey = key.replace(/(Min|Max)$/, '');
        const isMin = key.endsWith('Min');
        let merchantValue = Number(merchant[baseKey]) || 0;

        const filterValue = Number(value);
        if (isNaN(filterValue)) return true;

        return isMin ? merchantValue >= filterValue : merchantValue <= filterValue;
    }

    static _applyBasicFilter(merchant, key, value) {
        switch (key) {
            case 'paymentTypeFilter':
                return merchant.PaymentType === Number(value);
            case 'eventMerchantFilter':
                return Boolean(merchant.mIsEvent);
            default:
                return true;
        }
    }
}

// UI Management
class UIManager {
    constructor(stateManager) {
        this.stateManager = stateManager;
        this.setupStateSubscriptions();
        this.initializeAtropos();
        this.setupThemeChangeListener();
    }

    initializeAtropos() {
        if (!window.Atropos) {
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/atropos@2.0.2/atropos.js';
            script.onload = () => {
                this.atroposLoaded = true;
                this.reinitializeCards();
            };
            document.head.appendChild(script);

            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://unpkg.com/atropos@2.0.2/atropos.css';
            document.head.appendChild(link);
        } else {
            this.atroposLoaded = true;
        }
    }

    setupStateSubscriptions() {
        this.stateManager.on('stateChange', ({key, value}) => {
            switch (key) {
                case 'isLoading':
                    this.toggleLoadingState(value);
                    break;
                case 'error':
                    if (value) this.showError(value);
                    break;
            }
        });
    }

    setupThemeChangeListener() {
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                setTimeout(() => {
                    this.reinitializeCards();
                }, 50);
            });
        }
    }

    initializeUI() {
        this.initializePerPageSelect();
        this.setupEventListeners();
    }

    initializePerPageSelect() {
        const perPageSelect = document.getElementById('perPageSelect');
        if (!perPageSelect) return;

        perPageSelect.innerHTML = CONSTANTS.PER_PAGE_OPTIONS
            .map(n => `<option value="${n}">${n} на странице</option>`)
            .join('');

        perPageSelect.value = this.stateManager.getState('perPage');
    }

    setupEventListeners() {
        const filtersContainer = document.querySelector('.filters-container');
        if (filtersContainer) {
            filtersContainer.addEventListener('input', this._handleFilterInput.bind(this));
        }

        const resetButton = document.getElementById('resetFilters');
        if (resetButton) {
            resetButton.addEventListener('click', this._handleResetFilters.bind(this));
        }

        const perPageSelect = document.getElementById('perPageSelect');
        if (perPageSelect) {
            perPageSelect.addEventListener('change', () => {
                this.stateManager.setState('currentPage', 1);
                this.stateManager.setState('perPage', Number(perPageSelect.value));
                this._triggerFiltersUpdate();
            });
        }
    }

    _handleFilterInput() {
        clearTimeout(this.stateManager.getState('debounceTimer'));

        const timer = setTimeout(
            () => this._triggerFiltersUpdate(),
            CONSTANTS.DEBOUNCE_DELAY
        );

        this.stateManager.setState('debounceTimer', timer);
    }

    _handleResetFilters() {
        document.querySelectorAll('.form-control, .custom-control-input')
            .forEach(input => {
                if (input.type === 'checkbox') {
                    input.checked = false;
                } else if (input.id !== 'perPageSelect') {
                    input.value = '';
                }
            });

        this._triggerFiltersUpdate();
    }

    _triggerFiltersUpdate() {
        document.dispatchEvent(new CustomEvent('filtersUpdated'));
    }

    renderMerchants(merchants) {
        const merchantsGrid = document.querySelector('.merchants-grid');
        if (!merchantsGrid) return;
    
        this._animateTableUpdate(merchantsGrid, () => {
            merchantsGrid.innerHTML = merchants.map((merchant, index) => `
                <div class="atropos" data-index="${index}">
                    <div class="merchant-card-id" data-atropos-offset="5" onclick="window.location.href='/merchant/${merchant.ListID}'">
                        <span class="merchant-id-link">#${merchant.ListID}</span>
                    </div>
                    <a href="/monster/${merchant.MID}" class="card-link">
                        <div class="atropos-scale">
                            <div class="atropos-rotate">
                                <div class="atropos-inner" data-merchant-type="${merchant.PaymentType}">
                                    <div class="merchant-image" data-atropos-offset="8" data-merchant-type="${merchant.PaymentType}">
                                        <img src="${this._getMerchantImage(merchant)}"
                                            alt="${merchant.MName}"
                                            loading="lazy"
                                            class="merchant-image"
                                            onerror="this.src='${CONSTANTS.FALLBACK_IMAGE}';">
                                    </div>
                                   
                                    <div class="merchant-card-title" data-atropos-offset="6">
                                        <span class="merchant-name-link">${merchant.MName}</span>
                                    </div>
    
                                    <div class="stat-badges" data-atropos-offset="4">
                                        <div class="stat-badge" data-atropos-offset="3">
                                            <i class="fas fa-coins"></i>
                                            <span>Тип оплаты: ${this._getPaymentTypeName(merchant.PaymentType)}</span>
                                        </div>
                                        <div class="stat-badge" data-atropos-offset="3">
                                            <i class="fas fa-shopping-basket"></i>
                                            <span>Товаров: ${merchant.ItemCount}</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="atropos-shadow"></div>
                            </div>
                        </div>
                    </a>
                </div>
            `).join('');
    
            this._initializeAtroposCards();
        });
    }

    _getPaymentTypeName(paymentType) {
        console.log(paymentType);
        const paymentTypes = {
            0: 'Серебро',
            1: 'Очки чести',
            2: 'Очки хаоса',
            3: 'Серебро хаоса'
        };
        return paymentTypes[paymentType] || 'Неизвестно';
    }

    _getMerchantImage(merchant) {
        const cachedData = this.stateManager.getState('cachedData');
        return cachedData?.resources[merchant.ListID] || CONSTANTS.FALLBACK_IMAGE;
    }

    _animateTableUpdate(container, updateFn) {
        container.classList.add(CONSTANTS.ANIMATION_CLASSES.FADE_ENTER);

        requestAnimationFrame(() => {
            updateFn();

            container.classList.remove(CONSTANTS.ANIMATION_CLASSES.FADE_ENTER);
            container.classList.add(CONSTANTS.ANIMATION_CLASSES.FADE_ENTER_ACTIVE);

            setTimeout(() => {
                container.classList.remove(
                    CONSTANTS.ANIMATION_CLASSES.FADE_ENTER_ACTIVE
                );
            }, CONSTANTS.TABLE_FADE_DURATION);
        });
    }

    _initializeAtroposCards() {
        if (!window.Atropos) {
            setTimeout(() => this._initializeAtroposCards(), 100);
            return;
        }

        document.querySelectorAll('.atropos').forEach((el, index) => {
            if (el.atroposInstance) {
                el.atroposInstance.destroy();
            }

            el.style.setProperty('--index', index);

            const atroposInstance = Atropos({
                el: el,
                activeOffset: 20,
                shadowScale: 1.05,
                rotateXMax: 8,
                rotateYMax: 8,
                duration: 400,
                shadow: true,
                shadowOffset: 50,
                highlight: false,
                debounceDuration: 10
            });

            el.atroposInstance = atroposInstance;
        });
    }

    createPagination(total, currentPage, perPage) {
        const paginationContainer = document.querySelector('.pagination-container');
        if (!paginationContainer) return;

        const totalPages = Math.ceil(total / perPage);
        paginationContainer.innerHTML = this._generatePaginationHTML(totalPages, currentPage);
    }

    _generatePaginationHTML(totalPages, currentPage) {
        const buttons = [];

        buttons.push(this._createPaginationButton(
            'Предыдущая',
            currentPage - 1,
            currentPage === 1
        ));

        for (let i = 1; i <= totalPages; i++) {
            if (this._shouldShowPageNumber(i, currentPage, totalPages)) {
                buttons.push(this._createPaginationButton(
                    i.toString(),
                    i,
                    false,
                    i === currentPage
                ));
            } else if (i === currentPage - 3 || i === currentPage + 3) {
                buttons.push('<span class="pagination-ellipsis">...</span>');
            }
        }

        buttons.push(this._createPaginationButton(
            'Следующая',
            currentPage + 1,
            currentPage === totalPages
        ));

        return buttons.join('');
    }

    _shouldShowPageNumber(pageNum, currentPage, totalPages) {
        return pageNum === 1 ||
            pageNum === totalPages ||
            (pageNum >= currentPage - 2 && pageNum <= currentPage + 2);
    }

    _createPaginationButton(text, pageNum, isDisabled, isActive = false) {
        const className = isActive ? 'btn-primary' : 'btn-secondary';
        const disabled = isDisabled ? 'disabled' : '';
        return `
            <button class="btn ${className} ${disabled}"
                    onclick="app.applyFilters(${pageNum})"
                    ${disabled}>
                ${text}
            </button>
        `;
    }

    updateTotalCount(count) {
        const totalCount = document.getElementById('totalCount');
        if (totalCount) {
            totalCount.textContent = `Найдено торговцев: ${count}`;
        }
    }

    updateURL(params) {
        const url = new URL(window.location.href);
        url.search = new URLSearchParams(params).toString();
        history.pushState({}, '', url);
    }
    // updateURL() {
    //     history.pushState(url);
    // }

    toggleLoadingState(isLoading) {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (!loadingOverlay) return;

        if (isLoading) {
            loadingOverlay.classList.add('show');
        } else {
            setTimeout(() => {
                loadingOverlay.classList.remove('show');
            }, 300);
        }
    }

    showError(message) {
        const errorMessage = document.getElementById('errorMessage');
        if (!errorMessage) return;

        errorMessage.textContent = `Произошла ошибка: ${message}`;
        errorMessage.classList.add('show');

        setTimeout(() => {
            errorMessage.classList.remove('show');
        }, CONSTANTS.ERROR_DISPLAY_TIME);
    }

    reinitializeCards() {
        document.querySelectorAll('.atropos').forEach(el => {
            if (el.atroposInstance) {
                el.atroposInstance.destroy();
            }
        });

        requestAnimationFrame(() => {
            this._initializeAtroposCards();
        });
    }
}

// Main Application Class
class MerchantFilterApp {
    constructor() {
        this.stateManager = new StateManager();
        this.dataService = new DataService(this.stateManager);
        this.uiManager = new UIManager(this.stateManager);
    }

    async initialize() {
        await this.dataService.fetchData();
        this.uiManager.initializeUI();
        this.setupEventListeners();
        this.applyFilters(1);
        initializeSearch();
    }

    setupEventListeners() {
        document.addEventListener('filtersUpdated', () => {
            this.applyFilters(1);
        });

        // Search functionality
        const searchInput = document.getElementById('merchantSearch');
        if (searchInput) {
            searchInput.addEventListener('input', () => {
                clearTimeout(this._searchTimer);
                this._searchTimer = setTimeout(() => {
                    this.applyFilters(1);
                }, CONSTANTS.DEBOUNCE_DELAY);
            });
        }

        // Clear search
        const clearSearchBtn = document.getElementById('clearSearch');
        if (clearSearchBtn) {
            clearSearchBtn.addEventListener('click', () => {
                const searchInput = document.getElementById('merchantSearch');
                if (searchInput) {
                    searchInput.value = '';
                    this.applyFilters(1);
                }
            });
        }
    }

    async applyFilters(page = 1) {
        const cachedData = this.stateManager.getState('cachedData');

        console.log('Total merchants:', cachedData.merchants.length);

        if (!cachedData) return;

        const filters = FilterManager.collectFilters();
        const searchTerm = document.getElementById('merchantSearch')?.value.toLowerCase();

        // Apply search filter first
        let filteredData = cachedData.merchants;
        if (searchTerm) {
            filteredData = filteredData.filter(merchant => {
                const searchableFields = [
                    merchant.ListID.toString(),
                    merchant.MID.toLowerCase(),
                    merchant.MName?.toLowerCase()
                ];
                return searchableFields.some(field => field.includes(searchTerm));
            });
        }

        // Apply other filters
        filteredData = FilterManager.filterData(filteredData, filters);

        const perPage = this.stateManager.getState('perPage');
        const paginatedData = this._paginateData(filteredData, page, perPage);

        this.stateManager.setState('currentPage', page);
        this.uiManager.updateTotalCount(filteredData.length);
        this.uiManager.renderMerchants(paginatedData);
        this.uiManager.createPagination(filteredData.length, page, perPage);
        this.uiManager.updateURL({ ...filters });
        //this.uiManager.updateURL();
    }

    _paginateData(data, page, perPage) {
        const start = (page - 1) * perPage;
        return data.slice(start, start + perPage);
    }
}



// Initialize application
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new MerchantFilterApp();
    app.initialize();
});