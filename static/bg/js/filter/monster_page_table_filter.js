// ! Constants and configurations
const CONSTANTS = {
    DEBOUNCE_DELAY: 300,
    DEFAULT_PER_PAGE: 25,
    FALLBACK_IMAGE: 'https://raw.githubusercontent.com/Aksel911/R2-HTML-DB/main/static/no_monster/no_monster_image.png',
    PAGINATION_RADIUS: 2,
    ERROR_DISPLAY_TIME: 5000,
    PAGINATION_RADIUS: 2,
	FALLBACK_IMAGE: 'https://raw.githubusercontent.com/Aksel911/R2-HTML-DB/main/static/no_monster/no_monster_image.png',
	TABLE_FADE_DURATION: 300,
	BUTTON_ANIMATION_DURATION: 200,
	ANIMATION_CLASSES: {
		FADE_ENTER: 'table-fade-enter',
		FADE_ENTER_ACTIVE: 'table-fade-enter-active'
	},
	PER_PAGE_OPTIONS: [10, 25, 50, 75, 100, 150, 200, 500, 1000]
};



const MONSTER_CLASS_DESCRIPTIONS = {
    1: 'A класс',
    2: 'B класс',
    3: 'C класс',
    4: 'D класс',
    5: 'E класс',
    6: 'F класс',
    7: 'G класс',
    8: 'H класс',
    9: 'I класс',
    10: 'J класс',
    11: 'K класс',
    12: 'L класс',
    13: 'M класс',
    14: 'N класс',
    15: 'O класс',
    16: 'P класс',
    17: 'Q класс',
    18: 'R класс',
    19: 'S класс',
    20: 'T класс',
    21: 'U класс',
    22: 'V класс',
    23: 'NPC',
    24: 'W класс',
    25: 'X класс',
    26: 'Особый Монстр',
    27: 'Событие',
    28: 'Именной',
    29: 'Босс',
    31: 'S',
    32: 'Налетчики',
    33: 'Эпик Мобы (дем)',
    34: 'Эпик Боссы (дем)',
    35: 'Статуя',
    36: 'Последователи (ХТЖ Боссы)',
    37: 'Разъяренные Боссы',
    38: 'Падшие Боссы'
};

const MONSTER_TYPE_MAPPINGS = {
    '/monster_regular': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
    '/monster_boss': [29, 38, 37, 36, 34],
    '/monster_raidboss': [26],
    '/monster_imennoy': [28],
    '/monster_npc': [23],
    '/monster_event': [27]
};

const RACE_TYPES = {
    1: 'Нежить',
    2: 'Дракон',
    3: 'Животное',
    4: 'Насекомое',
    5: 'Машина',
    6: 'Человек',
    7: 'Эльф',
    8: 'Прочие',
    9: 'Демон',
    10: 'Ангел',
    11: 'Дьявол',
    12: 'Оборотень',
    13: 'Все, кроме человека'
};

const ADVANCED_FILTERS = [{
        id: 'MHIT',
        label: 'Точность',
        icon: '🎯'
    },
    {
        id: 'MMinD',
        label: 'Мин. урон',
        icon: '⚔️'
    },
    {
        id: 'MMaxD',
        label: 'Макс. урон',
        icon: '⚔️'
    },
    {
        id: 'MHP',
        label: 'HP',
        icon: '❤️'
    },
    {
        id: 'MMP',
        label: 'MP',
        icon: '💧'
    },
    {
        id: 'MAttackRateOrg',
        label: 'Скорость атаки',
        icon: '⚡'
    },
    {
        id: 'MMoveRateOrg',
        label: 'Скорость передвижения',
        icon: '🏃'
    },
    {
        id: 'MMoveRange',
        label: 'Радиус преследования',
        icon: '📏'
    },
    {
        id: 'mSightRange',
        label: 'Радиус обзора',
        icon: '👁️'
    },
    {
        id: 'mAttackRange',
        label: 'Дальность атаки',
        icon: '🎯'
    },
    {
        id: 'mSkillRange',
        label: 'Дальность навыков',
        icon: '✨'
    },
    {
        id: 'mScale',
        label: 'Размер модели',
        icon: '📐'
    },
    {
        id: 'mHPRegen',
        label: 'Реген HP',
        icon: '♥️'
    },
    {
        id: 'mMPRegen',
        label: 'Реген MP',
        icon: '💫'
    },
    {
        id: 'mVolitionOfHonor',
        label: 'Очки чести',
        icon: '🏆'
    }
];


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

// ! State Management
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

// ! Data Service
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

// ! Filter Logic
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

                // Map input IDs to correct field names
                switch (input.id) {
                    case 'levelMin':
                        filters['mLevelMin'] = value;
                        break;
                    case 'levelMax':
                        filters['mLevelMax'] = value;
                        break;
                    case 'expMin':
                        filters['MExpMin'] = value;
                        break;
                    case 'expMax':
                        filters['MExpMax'] = value;
                        break;
                    case 'tickMin':
                        filters['mTickMin'] = value;
                        break;
                    case 'tickMax':
                        filters['mTickMax'] = value;
                        break;
                    default:
                        filters[input.id] = value;
                }
            }
        });

        // Debug log
        //console.log('Collected filters:', filters);
        return filters;
    }


    static filterData(monsters, filters) {
        return monsters.filter(monster =>
            this._applyAllFilters(monster, filters));
    }

    static _applyAllFilters(monster, filters) {
        return Object.entries(filters).every(([key, value]) => {
            if (!value || value === '') return true;

            // Let server handle tick filtering
            if (key === 'mTickMin' || key === 'mTickMax') return true;

            if (key.endsWith('Min') || key.endsWith('Max')) {
                return this._applyRangeFilter(monster, key, value);
            }
            return this._applyBasicFilter(monster, key, value);
        });
    }

    static _applyRangeFilter(monster, key, value) {
        // Map filter keys to monster properties
        let baseKey = key.replace(/(Min|Max)$/, '');
        const isMin = key.endsWith('Min');
        let monsterValue;

        switch (baseKey) {
            case 'mLevel':
                monsterValue = monster.mLevel;
                break;
            case 'MExp':
                monsterValue = monster.MExp;
                break;
            default:
                monsterValue = monster[baseKey];
        }

        monsterValue = Number(monsterValue) || 0;
        const filterValue = Number(value);

        if (isNaN(filterValue)) return true;
        return isMin ? monsterValue >= filterValue : monsterValue <= filterValue;
    }

    static _applyBasicFilter(monster, key, value) {
        switch (key) {
            case 'classFilter':
                return monster.MClass === Number(value);
            case 'raceFilter':
                return monster.MRaceType === Number(value);
            case 'attackTypeFilter':
                return monster.mAttackType === Number(value);
            case 'eventMonsterFilter':
                return Boolean(monster.mIsEvent);
            case 'testMonsterFilter':
                return Boolean(monster.mIsTest);
            case 'testMonsterFilter':
                return Boolean(monster.mIsTest);
            case 'showHpFilter':
                return Boolean(monster.mIsShowHp);
            case 'showAgressiveFilter':
                return Boolean(monster.mIsResistTransF);
            case 'showAgressiveVoplotFilter':
                return Boolean(monster.mDetectTransP);
            case 'showAgressiveInvisFilter':
                return Boolean(monster.mDetectTransF);
            default:
                return true;
        }
    }
}

// ! UI Management
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
        this.initializeFilters();
        this.setupEventListeners();
    }

    initializeFilters() {
        // Инициализация фильтра типа монстров (расы)
        const raceFilter = document.getElementById('raceFilter');
        if (raceFilter) {
            raceFilter.innerHTML = '<option value="">Все типы</option>' + 
                Object.entries(RACE_TYPES)
                    .map(([value, label]) => 
                        `<option value="${value}">${label}</option>`)
                    .join('');
        }
    
        // Получаем разрешенные классы для текущей страницы
        const allowedTypes = MONSTER_TYPE_MAPPINGS[window.location.pathname] || [];
    
        // Инициализация фильтра классов монстров
        const classFilter = document.getElementById('classFilter');
        if (classFilter) {
            classFilter.innerHTML = '<option value="">Все классы</option>' + 
                Object.entries(MONSTER_CLASS_DESCRIPTIONS)
                    .filter(([value]) => allowedTypes.includes(Number(value))) // Фильтруем только разрешенные классы
                    .map(([value, label]) => 
                        `<option value="${value}">${label}</option>`)
                    .join('');
        }
    
        // Инициализация продвинутых фильтров
        this.initializeAdvancedFilters();
        
        // Инициализация выбора количества элементов на странице
        this.initializePerPageSelect();
    }

    initializePerPageSelect() {
        const perPageSelect = document.getElementById('perPageSelect');
        if (!perPageSelect) return;

        perPageSelect.innerHTML = CONSTANTS.PER_PAGE_OPTIONS
            .map(n => `<option value="${n}">${n} на странице</option>`)
            .join('');

        perPageSelect.value = this.stateManager.getState('perPage');
    }

    initializeAdvancedFilters() {
        const container = document.querySelector('.advanced-filters-grid');
        if (!container) return;
    
        container.innerHTML = ADVANCED_FILTERS
            .map(filter => `
                <div class="filter-card" data-filter="${filter.id}">
                    <div class="filter-card-header">
                        <span class="filter-icon">${filter.icon}</span>
                        <span class="filter-label">${filter.label}</span>
                    </div>
                    <div class="filter-inputs">
                        <div class="input-group">
                            <input type="number" 
                                class="form-control" 
                                id="${filter.id}Min" 
                                placeholder="Мин" 
                                step="any">
                            <div class="input-group-text">-</div>
                            <input type="number" 
                                class="form-control" 
                                id="${filter.id}Max" 
                                placeholder="Макс" 
                                step="any">
                        </div>
                    </div>
                </div>
            `)
            .join('');
    }

    createFilterCard(filter) {
        return `
                <div class="filter-card" data-filter="${filter.id}">
                    <div class="filter-card-header">
                        <span class="filter-icon">${filter.icon}</span>
                        <span class="filter-label">${filter.label}</span>
                    </div>
                    <div class="filter-inputs">
                        <div class="input-group">
                            <input type="number" 
                                class="form-control" 
                                id="${filter.id}Min" 
                                placeholder="Мин" 
                                step="any">
                            <div class="input-group-text">-</div>
                            <input type="number" 
                                class="form-control" 
                                id="${filter.id}Max" 
                                placeholder="Макс" 
                                step="any">
                        </div>
                    </div>
                </div>
            `;
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

    _animateTableUpdate(tableBody, updateFn) {
        tableBody.classList.add(CONSTANTS.ANIMATION_CLASSES.FADE_ENTER);

        requestAnimationFrame(() => {
            updateFn();

            tableBody.classList.remove(CONSTANTS.ANIMATION_CLASSES.FADE_ENTER);
            tableBody.classList.add(CONSTANTS.ANIMATION_CLASSES.FADE_ENTER_ACTIVE);

            setTimeout(() => {
                tableBody.classList.remove(
                    CONSTANTS.ANIMATION_CLASSES.FADE_ENTER_ACTIVE
                );
            }, CONSTANTS.TABLE_FADE_DURATION);
        });
    }


    _getAllowedTypes() {
        return MONSTER_TYPE_MAPPINGS[window.location.pathname] || [];
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

    // !
    renderMonsters(monsters) {
        const tableWrapper = document.querySelector('.table-wrapper');
        if (!tableWrapper) return;
    
        this._animateTableUpdate(tableWrapper, () => {
            const oldTable = tableWrapper.querySelector('table');
            if (oldTable) {
                oldTable.remove();
            }
    
            const gridHtml = monsters.map((monster, index) => `
            <div class="atropos" data-index="${index}">
                <a href="/monster/${monster.MID}" class="card-link">
                    <div class="atropos-scale">
                        <div class="atropos-rotate">
                            <div class="atropos-inner" data-monster-type="${monster.MClass}">
                                <div class="item-card-id" data-atropos-offset="5">
                                    #${monster.MID}
                                </div>
                        
                                <div class="monster-image" data-atropos-offset="8" data-monster-type="${monster.MClass}">
                                    <img src="${this._getMonsterImage(monster)}"
                                        alt="${monster.MName}"
                                        loading="lazy"
                                        class="monster-image"
                                        onerror="this.src='${CONSTANTS.FALLBACK_IMAGE}';">
                                </div>
                                
                                <div class="monster-card-title" data-atropos-offset="6">
                                    <span class="monster-name-link">${monster.MName}</span>
                                </div>
        
                                <div class="stat-badges" data-atropos-offset="4">
                                    ${this._generateMonsterStatBadges(monster)}
                                </div>
                            </div>
                            <div class="atropos-shadow"></div>
                        </div>
                    </div>
                </a>
            </div>
        `).join('');
        
    
            tableWrapper.innerHTML = `<div class="monsters-grid">${gridHtml}</div>`;
    
            requestAnimationFrame(() => {
                this._initializeAtroposCards();
            });
        });
    }

    //!
    _generateMonsterStatBadges(monster) {
        const badges = [];

        if (monster.mLevel) {
            badges.push(`
                <div class="stat-badge" data-atropos-offset="3">
                    <i class="fa-solid fa-star"></i>
                    <span>Ур. ${monster.mLevel}</span>
                </div>
            `);
        }

        if (monster.MHP) {
            badges.push(`
                <div class="stat-badge" data-atropos-offset="3">
                    <i class="fa-solid fa-heart"></i>
                    <span>HP: ${monster.MHP.toLocaleString()}</span>
                </div>
            `);
        }

        if (monster.MMP) {
            badges.push(`
                <div class="stat-badge" data-atropos-offset="3">
                    <i class="fa-solid fa-droplet"></i>
                    <span>MP: ${monster.MMP.toLocaleString()}</span>
                </div>
            `);
        }

        if (monster.MExp) {
            badges.push(`
                <div class="stat-badge" data-atropos-offset="3">
                    <i class="fa-solid fa-trophy"></i>
                    <span>Опыт: ${monster.MExp.toLocaleString()}</span>
                </div>
            `);
        }

        if (monster.MMinD && monster.MMaxD) {
            badges.push(`
                <div class="stat-badge" data-atropos-offset="3">
                    <i class="fa-solid fa-gavel"></i>
                    <span>Урон: ${monster.MMinD}-${monster.MMaxD}</span>
                </div>
            `);
        }

        if (monster.MMoveRateOrg) {
            badges.push(`
                <div class="stat-badge" data-atropos-offset="3">
                    <i class="fa-solid fa-person-running"></i>
                    <span>Скорость: ${monster.MMoveRateOrg}</span>
                </div>
            `);
        }

        return badges.join('');
    }

    // !
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


    _getMonsterImage(monster) {
        const cachedData = this.stateManager.getState('cachedData');
        return cachedData?.resources[monster.MID] || CONSTANTS.FALLBACK_IMAGE;
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
            totalCount.textContent = `Найдено монстров: ${count}`;
        }
    }

    updateURL(params) {
        const url = new URL(window.location.href);
        url.search = new URLSearchParams(params).toString();
        history.pushState({}, '', url);
    }

    toggleLoadingState(isLoading) {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (!loadingOverlay) return;

        if (isLoading) {
            loadingOverlay.classList.add('show');
        } else {
            setTimeout(() => {
                loadingOverlay.classList.remove('show');
            }, CONSTANTS.LOADING_FADE_DELAY);
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

}

// ! Main Application Class
class MonsterFilterApp {
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
    }

    async applyFilters(page = 1) {
        const cachedData = this.stateManager.getState('cachedData');
        if (!cachedData) return;

        const filters = FilterManager.collectFilters();
        const filteredData = FilterManager.filterData(cachedData.monsters, filters);
        const perPage = this.stateManager.getState('perPage');
        const paginatedData = this._paginateData(filteredData, page, perPage);

        this.stateManager.setState('currentPage', page);
        this.uiManager.updateTotalCount(filteredData.length);
        this.uiManager.renderMonsters(paginatedData);
        this.uiManager.createPagination(filteredData.length, page, perPage);
        this.uiManager.updateURL(filters);
    }

    _getPerPage() {
        return Number(document.getElementById('perPageSelect')?.value) ||
            CONSTANTS.DEFAULT_PER_PAGE;
    }

    _paginateData(data, page, perPage) {
        const start = (page - 1) * perPage;
        return data.slice(start, start + perPage);
    }
}


// ! Filter Manager with search support
FilterManager.filterData = function(data, filters) {
    const isMonsterPage = $('.monster-image').length > 0;
    const searchId = isMonsterPage ? '#monsterSearch' : '#itemSearch';
    const searchTerm = document.querySelector(searchId)?.value.trim().toLowerCase();

    // Apply search filter before other filters
    let filteredData = data;
    if (searchTerm) {
        filteredData = data.filter(item => {
            const id = isMonsterPage ? item.MID : item.IID;
            const name = isMonsterPage ? item.MName : item.IName;
            const matchesId = id.toString().toLowerCase().includes(searchTerm);
            const matchesName = name.toLowerCase().includes(searchTerm);
            return matchesId || matchesName;
        });
    }

    // Apply remaining filters
    return filteredData.filter(item => 
        FilterManager._applyAllFilters(item, filters));
};




// ! Initialize application
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new MonsterFilterApp();
    app.initialize();
});