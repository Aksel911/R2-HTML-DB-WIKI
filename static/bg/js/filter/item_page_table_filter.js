// * Constants and Configuration
const CONSTANTS = {
	DEBOUNCE_DELAY: 300,
	DEFAULT_PER_PAGE: 25,
	LOADING_FADE_DELAY: 500,
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

const TYPE_MAPPINGS = {
	'/weapon': [1, 18, 20],
	'/armor': [3],
	'/gloves': [7],
	'/boots': [6],
	'/helmet': [8],
	'/shield': [2],
	'/arrows': [19],
	'/cloak': [17],
	'/materials': [10, 16],
	'/ring': [4],
	'/belt': [9],
	'/necklace': [5],
	'/earrings': [42],
	'/books': [12],
	'/potions': [10],
	'/etc': [14, 16, 13, 11],
	'/sphere': [22, 23, 24, 25, 26, 27, 28, 29],
	'/quest': [15, 16]
};

const TYPE_DESCRIPTIONS = {
	1: 'Оружие Ближнего Боя',
	2: 'Щит, Браслет',
	3: 'Доспех',
	4: 'Кольцо',
	5: 'Ожерелье',
	6: 'Ботинки',
	7: 'Перчатки',
	8: 'Шлем',
	9: 'Ремень',
	10: 'Зелья',
	11: 'SpecificProcItem/Shop Item',
	12: 'Книга',
	13: 'Жезл, Фейерверк, Петарда',
	14: 'Предмет со Skill',
	15: 'Сундук',
	16: 'Пустышка, Печати, Квестовый',
	17: 'Плащ',
	18: 'Оружие Дальнего Боя',
	19: 'Патроны, стрелы, камни',
	20: 'Алебарда/Копье',
	22: 'Сфера Мастера',
	23: 'Сфера Души',
	24: 'Сфера Защиты',
	25: 'Сфера Разрушения',
	26: 'Сфера Жизни',
	27: 'Сфера 1 Слот',
	28: 'Сфера 2 Слот',
	29: 'Сфера 3 Слот',
	42: 'Серьги'
};

const CLASS_DESCRIPTIONS = {
	0: 'Нет класса',
	1: 'Рыцарь',
	2: 'Рейнджер',
	4: 'Маг',
	5: 'Рыцарь, Маг',
	7: 'Рыцарь, Рейнджер, Маг',
	8: 'Ассасин',
	15: 'Рыцарь, Рейнджер, Маг, Ассасин',
	16: 'Призыватель',
	18: 'Рейнджер, Призыватель',
	19: 'Рыцарь, Рейнджер, Призыватель',
	20: 'Маг, Призыватель',
	22: 'Рейнджер, Маг, Призыватель',
	23: 'Рыцарь, Рейнджер, Маг, Призыватель'
};

const ADVANCED_FILTERS = [{
		id: 'IDHIT',
		label: 'Точность в ближнем бою',
		icon: '🎯'
	},
	{
		id: 'IDDD',
		label: 'Урон в ближнем бою',
		icon: '⚔️'
	},
	{
		id: 'IRHIT',
		label: 'Точность в дальнем бою',
		icon: '🏹'
	},
	{
		id: 'IRDD',
		label: 'Урон в дальнем бою',
		icon: '🎯'
	},
	{
		id: 'IMHIT',
		label: 'Магическая точность',
		icon: '✨'
	},
	{
		id: 'IMDD',
		label: 'Магический урон',
		icon: '🔮'
	},
	{
		id: 'IHPPlus',
		label: 'Доп. HP',
		icon: '❤️'
	},
	{
		id: 'IMPPlus',
		label: 'Доп. MP',
		icon: '💧'
	},
	{
		id: 'ISTR',
		label: 'Сила',
		icon: '💪'
	},
	{
		id: 'IDEX',
		label: 'Ловкость',
		icon: '🏃'
	},
	{
		id: 'IINT',
		label: 'Интеллект',
		icon: '🧠'
	},
	{
		id: 'IHPRegen',
		label: 'Реген HP',
		icon: '♥️'
	},
	{
		id: 'IMPRegen',
		label: 'Реген MP',
		icon: '💫'
	},
	{
		id: 'IAttackRate',
		label: 'Скорость атаки',
		icon: '⚡'
	},
	{
		id: 'IMoveRate',
		label: 'Скорость передвижения',
		icon: '🏃'
	},
	{
		id: 'ICritical',
		label: 'Шанс крита',
		icon: '🎯'
	}
];

// ! Utilities
// ? Базовый класс для реализации событийной модели
class EventEmitter {
	constructor() {
		this.events = {};
	}

	// Подписка на событие
	on(event, callback) {
		if (!this.events[event]) {
			this.events[event] = [];
		}
		this.events[event].push(callback);
		return () => this.off(event, callback);
	}

	// Отписка от события
	off(event, callback) {
		if (!this.events[event]) return;
		this.events[event] = this.events[event].filter(cb => cb !== callback);
	}

	// Вызов обработчиков события
	emit(event, data) {
		if (!this.events[event]) return;
		this.events[event].forEach(callback => callback(data));
	}
}

// ! State Management
// ? Менеджер состояния приложения
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

	// Установка значения состояния с оповещением подписчиков
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

	// Получение значения состояния
	getState(key) {
		return this._state[key];
	}

	// Сброс состояния к начальным значениям, кроме кэшированных данных
	resetState() {
		Object.keys(this._state).forEach(key => {
			if (key !== 'cachedData') {
				this.setState(key, null);
			}
		});
	}
}

// ! Data Service
// ? Сервис для работы с данными
class ItemDataService {
	constructor(stateManager) {
		this.stateManager = stateManager;
	}

	// Загрузка данных с возможностью принудительного обновления
	async fetchData(forceReload = false) {
		if (this.stateManager.getState('cachedData') && !forceReload) {
			return this.stateManager.getState('cachedData');
		}

		this.stateManager.setState('isLoading', true);

		try {
			const data = await this._fetchAllPages();
			this.stateManager.setState('cachedData', data);
			return data;
		} catch (error) {
			this.stateManager.setState('error', error.message);
			return null;
		} finally {
			this.stateManager.setState('isLoading', false);
		}
	}

	// Загрузка всех страниц данных
	async _fetchAllPages() {
		const firstPageResponse = await this._fetchPage(1);
		let allItems = [...firstPageResponse.items];

		const totalPages = firstPageResponse.pages;
		const remainingPages = Array.from({
				length: totalPages - 1
			},
			(_, i) => i + 2
		);

		const pageResponses = await Promise.all(
			remainingPages.map(page => this._fetchPage(page))
		);

		pageResponses.forEach(response => {
			if (response.items) {
				allItems = allItems.concat(response.items);
			}
		});

		return {
			...firstPageResponse,
			items: allItems
		};
	}

	// Загрузка одной страницы данных
	async _fetchPage(page) {
		const response = await fetch(
			`${window.location.pathname}?all=1&page=${page}`, {
				headers: {
					'X-Requested-With': 'XMLHttpRequest'
				}
			}
		);

		if (!response.ok) {
			throw new Error('Network response was not ok');
		}

		const data = await response.json();
		if (data.error) {
			throw new Error(data.error);
		}

		return data;
	}
}

// ! Filter Logic
// ? Менеджер фильтрации предметов
class ItemFilterManager {
	// Сбор всех активных фильтров со страницы
	static collectFilters() {
		const filters = {};
		document.querySelectorAll('.form-control, .custom-control-input').forEach(input => {
			if (input.id === 'perPageSelect' || input.id === 'itemSearch') return;

			const value = input.type === 'checkbox' ? input.checked : input.value;

			if (value !== '') {
				filters[input.id] = value;
			}
		});

		//console.log('Collected filters:', filters);
		return filters;
	}

	// Фильтрация списка предметов по всем фильтрам
	static filterData(items, filters) {
		// Проверяем структуру первого предмета
		// if (items.length > 0) {
		//     console.log('First item structure:', items[0]);
		// }
		// Сначала применяем поиск
		const searchTerm = document.getElementById('itemSearch')?.value.trim().toLowerCase();
		let filteredData = items;

		if (searchTerm) {
			filteredData = items.filter(item => {
				const matchesId = item.IID.toString().toLowerCase().includes(searchTerm);
				const matchesName = item.IName.toLowerCase().includes(searchTerm);
				return matchesId || matchesName;
			});
		}

		// Затем применяем остальные фильтры
		return filteredData.filter(item => this._applyAllFilters(item, filters));
	}

	// Применение всех фильтров к одному предмету
	static _applyAllFilters(item, filters) {
		return Object.entries(filters).every(([key, value]) => {
			// Фильтр стакаемости
			if (key === 'stackableFilter') {
				if (!value) return true;
				return value === '1' ? item.IMaxStack > 0 : item.IMaxStack <= 0;
			}

			// Остальные фильтры...
			if (key === 'typeFilter') {
				return item.IType === Number(value);
			}

			if (key === 'typeClassFilter') {
				const filterClass = Number(value);
				if (!value || filterClass === 0 || filterClass === 255) return true;
				const classNumber = item.IUseClass ?
					Number(item.IUseClass.split('/').pop().replace('.png', '')) :
					0;
				return classNumber === filterClass;
			}

			if (key === 'questNoFilter') {
				if (!value) return true;
				return item.IQuestNo === Number(value);
			}

			if (key.endsWith('Min') || key.endsWith('Max')) {
				return this._applyRangeFilter(item, key, value);
			}

			if (this._isBooleanFilter(key)) {
				return this._applyBooleanFilter(item, key);
			}

			return true;
		});
	}

	// Применение фильтра диапазона значений
	static _applyRangeFilter(item, key, value) {
		const baseKey = key.replace(/(Min|Max)$/, '');
		const isMin = key.endsWith('Min');
		const itemValue = this._getItemValue(item, baseKey);
		const filterValue = Number(value);

		return isMin ?
			itemValue >= filterValue :
			itemValue <= filterValue;
	}

	// Проверка является ли фильтр булевым
	static _isBooleanFilter(key) {
		return [
			'eventItemFilter',
			'testItemFilter',
			'indictFilter',
			'chargeFilter',
			'partyDropFilter'
		].includes(key);
	}

	// Применение булевого фильтра
	static _applyBooleanFilter(item, key) {
		const mappings = {
			eventItemFilter: 'IIsEvent',
			testItemFilter: 'IIsTest',
			indictFilter: 'IIsIndict',
			chargeFilter: 'IIsCharge',
			partyDropFilter: 'IIsPartyDrop'
		};

		return item[mappings[key]] === true;
	}

	// Получение значения свойства предмета для фильтрации
	static _getItemValue(item, baseKey) {
		const mappings = {
			level: 'ILevel',
			weight: 'IWeight',
			validityDays: 'ITermOfValidity',
			validityMinutes: 'ITermOfValidityMi'
		};

		return item[mappings[baseKey] || baseKey] || 0;
	}
}




// ! UI Management
// ? Класс управления пользовательским интерфейсом
class ItemUIManager {
	constructor(stateManager) {
		this.stateManager = stateManager;
		this.setupStateSubscriptions();
		this.initializeAtropos();
		this.setupThemeChangeListener();
	}

	// Инициализация библиотеки Atropos для 3D-эффектов карточек
	initializeAtropos() {
		const script = document.createElement('script');
		script.src = 'https://unpkg.com/atropos@2.0.2/atropos.js';
		script.onload = () => {
			//console.log('Atropos loaded successfully');
			this.atroposLoaded = true;
		};
		document.head.appendChild(script);

		const link = document.createElement('link');
		link.rel = 'stylesheet';
		link.href = 'https://unpkg.com/atropos@2.0.2/atropos.css';
		document.head.appendChild(link);
	}

	// Переинициализация карточек при изменении темы
	reinitializeCards() {
		// Сначала уничтожаем все существующие экземпляры
		document.querySelectorAll('.atropos').forEach(el => {
			if (el.atroposInstance) {
				el.atroposInstance.destroy();
			}
		});

		// Затем реинициализируем карточки
		requestAnimationFrame(() => {
			this._initializeAtroposCards();
		});
	}

	// Настройка слушателя изменения темы
	setupThemeChangeListener() {
		const themeToggle = document.querySelector('.theme-toggle');
		if (themeToggle) {
			themeToggle.addEventListener('click', () => {
				// Даем небольшую задержку, чтобы тема успела переключиться
				setTimeout(() => {
					this.reinitializeCards();
				}, 50);
			});
		}
	}

	// Настройка подписок на изменения состояния
	setupStateSubscriptions() {
		this.stateManager.on('stateChange', ({
			key,
			value
		}) => {
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

	// Настройка всех анимаций
	setupAnimations() {
		this.setupTableAnimations();
		this.setupPaginationAnimations();
	}

	// ! Настройка анимаций таблицы СТИЛЬ CSS
	setupTableAnimations() {
		const style = document.createElement('style');
		style.textContent = `
                .table-fade-enter {
                    opacity: 0;
                    transform: translateY(-10px);
                }
                .table-fade-enter-active {
                    opacity: 1;
                    transform: translateY(0);
                    transition: opacity 300ms ease-in-out, transform 300ms ease-out;
                }
                .pagination-fade {
                    transition: opacity 200ms ease-in-out;
                }
                .pagination-button-active {
                    transform: scale(0.95);
                    transition: transform 200ms ease-out;
                }
            `;
		document.head.appendChild(style);
	}

	// Настройка анимаций пагинации
	setupPaginationAnimations() {
		document.addEventListener('click', e => {
			if (e.target.matches('.pagination-container button')) {
				e.target.classList.add('pagination-button-active');
				setTimeout(() => {
					e.target.classList.remove('pagination-button-active');
				}, CONSTANTS.BUTTON_ANIMATION_DURATION);
			}
		});
	}

	// Инициализация пользовательского интерфейса
	initializeUI() {
		this.initializeFilters();
		this.setupEventListeners();
	}

	// Инициализация всех фильтров
	initializeFilters() {
		this.initializeTypeFilter(); // Инициализация типа предметов
		this.initializeClassFilter(); // Инициализация класс предметов
		this.initializeAdvancedFilters();
		this.initializePerPageSelect();
	}

	// Инициализация фильтра типов предметов
	initializeTypeFilter() {
		const typeFilter = document.getElementById('typeFilter');
		if (!typeFilter) return;

		const allowedTypes = this._getAllowedTypes();

		typeFilter.innerHTML = this._createTypeFilterOptions(allowedTypes);
	}
	// Получение разрешенных типов для текущей страницы
	_getAllowedTypes() {
		return TYPE_MAPPINGS[window.location.pathname] ||
			Object.keys(TYPE_DESCRIPTIONS);
	}
	// ! Создание HTML-опций для фильтра типов
	_createTypeFilterOptions(types) {
		const options = ['<option value="">Все</option>'];

		types.forEach(type => {
			options.push(`
                    <option value="${type}">
                        ${TYPE_DESCRIPTIONS[type] || `Тип ${type}`}
                    </option>
                `);
		});

		return options.join('');
	}


	// Инициализация фильтра классов предметов
	initializeClassFilter() {
		const classFilter = document.getElementById('typeClassFilter');
		if (!classFilter) return;

		classFilter.innerHTML = this._createClassFilterOptions();
	}
	// ! Создание HTML карточки фильтра
	_createClassFilterOptions() {
		const options = ['<option value="255">Все классы</option>'];

		Object.entries(CLASS_DESCRIPTIONS).forEach(([value, label]) => {
			options.push(`
                <option value="${value}">
                    ${label}
                </option>
            `);
		});

		return options.join('');
	}


	// Инициализация дополнительных фильтров
	initializeAdvancedFilters() {
		const container = document.querySelector('.advanced-filters-grid');
		if (!container) return;

		container.innerHTML = ADVANCED_FILTERS
			.map(this._createFilterCard)
			.join('');
	}

	// ! Создание HTML для доп фильтров
	_createFilterCard(filter) {
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





	
	// Инициализация кнопок перехода по страницам таблицы
	initializePerPageSelect() {
		const perPageSelect = document.getElementById('perPageSelect');
		if (!perPageSelect) return;

		perPageSelect.innerHTML = CONSTANTS.PER_PAGE_OPTIONS
			.map(n => `<option value="${n}">${n} на странице</option>`)
			.join('');

		perPageSelect.value = this.stateManager.getState('perPage').toString();
	}

	// Настройка обработчиков событий
	setupEventListeners() {
		this._setupFilterContainerListener();
		this._setupResetButton();
		this._setupPerPageSelect();
	}

	// Настройка слушателя контейнера фильтров
	_setupFilterContainerListener() {
		const container = document.querySelector('.filters-container');
		if (!container) return;

		container.addEventListener('input', event => {
			if (this._isFilterInput(event.target)) {
				this._handleFilterInput();
			}
		});
	}

	// Проверка является ли элемент фильтром
	_isFilterInput(element) {
		return element.classList.contains('form-control') ||
			element.classList.contains('custom-control-input');
	}

	// Обработка ввода в фильтр с задержкой
	_handleFilterInput() {
		clearTimeout(this.stateManager.getState('debounceTimer'));

		const timer = setTimeout(
			() => this._triggerFiltersUpdate(),
			CONSTANTS.DEBOUNCE_DELAY
		);

		this.stateManager.setState('debounceTimer', timer);
	}

	// Настройка кнопки сброса фильтров
	_setupResetButton() {
		const resetButton = document.getElementById('resetFilters');
		if (!resetButton) return;

		resetButton.addEventListener('click', () => {
			this._resetAllFilters();
			this._triggerFiltersUpdate();
		});
	}

	// Настройка взаимодействий с карточками
	_setupCardInteractions() {
		document.querySelectorAll('.item-card').forEach(card => {
			card.addEventListener('mouseenter', () => {
				card.classList.add('is-hovered');
			});

			card.addEventListener('mouseleave', () => {
				card.classList.remove('is-hovered');
			});
		});
	}

	// Сброс всех фильтров в начальное состояние
	_resetAllFilters() {
		document.querySelectorAll('.form-control, .custom-control-input')
			.forEach(input => {
				if (input.id === 'perPageSelect') return;

				if (input.type === 'checkbox') {
					input.checked = false;
				} else {
					input.value = '';
				}
			});
	}

	// Настройка селектора количества элементов на странице
	_setupPerPageSelect() {
		const perPageSelect = document.getElementById('perPageSelect');
		if (!perPageSelect) return;

		perPageSelect.addEventListener('change', () => {
			this.stateManager.setState('currentPage', 1);
			this.stateManager.setState('perPage',
				Number(perPageSelect.value));
			this._triggerFiltersUpdate();
		});
	}

	// Вызов события обновления фильтров
	_triggerFiltersUpdate() {
		document.dispatchEvent(new CustomEvent('filtersUpdated'));
	}

	// ! Отрисовка HTML элементов с анимацией
	renderItems(items, resources) {
		const tableWrapper = document.querySelector('.table-wrapper');
		if (!tableWrapper) return;

		this._animateTableUpdate(tableWrapper, () => {
			const oldTable = tableWrapper.querySelector('table');
			if (oldTable) {
				oldTable.remove();
			}

			const gridHtml = items.map((item, index) => {
				// Безопасное извлечение значения класса из пути к изображению
				const classValue = item.IUseClass ?
					item.IUseClass.split('/').pop()?.replace('.png', '') || '0' : '0';

				return `
                    <div class="atropos" data-index="${index}">
                        <a href="/item/${item.IID}" class="card-link">
                            <div class="atropos-scale">
                                <div class="atropos-rotate">
                                    <div class="atropos-inner" data-class="${classValue}">
                                        <div class="item-card-id" data-atropos-offset="5">
                                            #${item.IID}
                                        </div>
                            
                                        <div class="item-card-image" data-atropos-offset="8" data-class="${classValue}">
                                            <img src="${resources[item.IID] || CONSTANTS.FALLBACK_IMAGE}"
                                                alt="${item.IName}"
                                                loading="lazy"
                                                onerror="this.src='${CONSTANTS.FALLBACK_IMAGE}';">
                                        </div>
                                        
                                        <div class="item-card-title" data-atropos-offset="8">
                                            <span><img src="${item.IUseClass}" alt="Image description"></span>
                                        </div>
                
                                        <div class="item-card-title" data-atropos-offset="6">
                                            <span class="item-link">${item.IName}</span>
                                        </div>
                
                                        <div class="stat-badges" data-atropos-offset="4">
                                            ${this._generateStatBadges(item)}
                                        </div>
                
                                        <div class="item-card-description" data-atropos-offset="2">
                                            ${item.IDesc || 'Нет описания'}
                                        </div>
                                    </div>
                                    <div class="atropos-shadow"></div>
                                </div>
                            </div>
                        </a>
                    </div>
                `;
			}).join('');

			tableWrapper.innerHTML = `<div class="items-grid">${gridHtml}</div>`;

			requestAnimationFrame(() => {
				this._initializeAtroposCards();
			});
		});
	}



	// Инициализация 3D-карточек с помощью Atropos
	_initializeAtroposCards() {
		if (!window.Atropos) {
			console.warn('Waiting for Atropos...');
			setTimeout(() => this._initializeAtroposCards(), 100);
			return;
		}

		document.querySelectorAll('.atropos').forEach((el, index) => {
			if (el.atroposInstance) {
				el.atroposInstance.destroy();
			}

			// Установка индекса для анимации
			el.style.setProperty('--index', index);

			// Улучшенная обработка эффекта свечения
			const handleMouseMove = (e) => {
				const rect = el.getBoundingClientRect();
				const x = ((e.clientX - rect.left) / rect.width) * 100;
				const y = ((e.clientY - rect.top) / rect.height) * 100;
				el.style.setProperty('--x', `${x}%`);
				el.style.setProperty('--y', `${y}%`);
			};

			el.addEventListener('mousemove', handleMouseMove);

			// Улучшенная обработка кликабельности
			const title = el.querySelector('.item-card-title');
			const link = title?.querySelector('a');

			if (title && link) {
				// Расширяем область клика
				title.style.cursor = 'pointer';

				// Обработка наведения
				title.addEventListener('mouseenter', (e) => {
					e.stopPropagation();
					link.style.color = '#3182ce';
					const beforeElement = window.getComputedStyle(link, '::before');
					if (beforeElement) {
						link.classList.add('hover-active');
					}
				});

				title.addEventListener('mouseleave', (e) => {
					e.stopPropagation();
					link.style.color = '';
					link.classList.remove('hover-active');
				});

				// Обработка клика
				title.addEventListener('click', (e) => {
					e.stopPropagation();
					link.click();
				});
			}

			const atroposInstance = Atropos({
				el: el,
				activeOffset: 20,
				shadowScale: 1.05,
				rotate: true,
				rotateXMax: 8,
				rotateYMax: 8,
				duration: 400, // Уменьшил длительность анимации для большей отзывчивости
				shadow: true,
				shadowOffset: 50,
				highlight: false,
				// Добавляем дебаунс для оптимизации производительности
				debounceDuration: 10,
				// Используем requestAnimationFrame для плавности
				onLeave() {
					requestAnimationFrame(() => {
						el.classList.remove('atropos-active');
						el.style.cursor = 'default';

						// Плавно скрываем подсветку
						const overlay = el.querySelector('.highlight-overlay');
						if (overlay) {
							overlay.style.opacity = '0';
						}

						// Сброс стилей
						el.style.removeProperty('--x');
						el.style.removeProperty('--y');
					});
				}
			});

			el.atroposInstance = atroposInstance;
		});


	}

	// Очистка экземпляров Atropos
	destroy() {
		document.querySelectorAll('.atropos').forEach(el => {
			if (el.atroposInstance) {
				el.atroposInstance.destroy();
			}
		});
	}
	// Анимация обновления таблицы
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

	// ! Генерация HTML бейджей со статистикой предмета для карточки предмета
	_generateStatBadges(item) {
		const badges = [];

		const hasValue = value => value && value !== "0" && value !== 0;

		// Базовые характеристики
		if (hasValue(item.ILevel)) {
			badges.push(`
                <div class="stat-badge" data-atropos-offset="3">
                    <i class="fa-solid fa-star"></i>
                    <span>Ур: ${item.ILevel}</span>
                </div>
            `);
		}

		if (hasValue(item.IWeight)) {
			badges.push(`
                <div class="stat-badge" data-atropos-offset="3">
                    <i class="fa-solid fa-scale-balanced"></i>
                    <span>Вес: ${item.IWeight}</span>
                </div>
            `);
		}

		// Параметры ближнего боя
		if (hasValue(item.IDHIT)) {
			badges.push(`
                <div class="stat-badge" data-atropos-offset="3">
                    <i class="fa-solid fa-hand-fist"></i>
                    <span>Урон: ${item.IDHIT}</span>
                </div>
            `);
		}

		if (hasValue(item.IDDD)) {
			badges.push(`
                <div class="stat-badge" data-atropos-offset="3">
                    <i class="fa-solid fa-bullseye"></i>
                    <span>Точность: ${item.IDDD}</span>
                </div>
            `);
		}

		// Параметры дальнего боя
		if (hasValue(item.IRHIT)) {
			badges.push(`
                <div class="stat-badge" data-atropos-offset="3">
                    <i class="fa-solid fa-bullseye"></i>
                    <span>Дальн. точность: ${item.IRHIT}</span>
                </div>
            `);
		}

		if (hasValue(item.IRDD)) {
			badges.push(`
                <div class="stat-badge" data-atropos-offset="3">
                    <i class="fa-solid fa-crosshairs"></i>
                    <span>Дальн. урон: ${item.IRDD}</span>
                </div>
            `);
		}

		// Магические параметры
		if (hasValue(item.IMHIT)) {
			badges.push(`
                <div class="stat-badge" data-atropos-offset="3">
                    <i class="fa-solid fa-wand-sparkles"></i>
                    <span>Маг. точность: ${item.IMHIT}</span>
                </div>
            `);
		}

		if (hasValue(item.IMDD)) {
			badges.push(`
                <div class="stat-badge" data-atropos-offset="3">
                    <i class="fa-solid fa-hat-wizard"></i>
                    <span>Маг. урон: ${item.IMDD}</span>
                </div>
            `);
		}

		// Характеристики персонажа
		if (hasValue(item.ISTR)) {
			badges.push(`
                <div class="stat-badge" data-atropos-offset="3">
                    <i class="fa-solid fa-dumbbell"></i>
                    <span>Сила: ${item.ISTR}</span>
                </div>
            `);
		}

		if (hasValue(item.IDEX)) {
			badges.push(`
                <div class="stat-badge" data-atropos-offset="3">
                    <i class="fa-solid fa-person-running"></i>
                    <span>Ловкость: ${item.IDEX}</span>
                </div>
            `);
		}

		if (hasValue(item.IINT)) {
			badges.push(`
                <div class="stat-badge" data-atropos-offset="3">
                    <i class="fa-solid fa-brain"></i>
                    <span>Интеллект: ${item.IINT}</span>
                </div>
            `);
		}

		// HP/MP параметры
		if (hasValue(item.IHPPlus)) {
			badges.push(`
                <div class="stat-badge" data-atropos-offset="3">
                    <i class="fa-solid fa-heart"></i>
                    <span>HP: ${item.IHPPlus}</span>
                </div>
            `);
		}

		if (hasValue(item.IMPPlus)) {
			badges.push(`
                <div class="stat-badge" data-atropos-offset="3">
                    <i class="fa-solid fa-gem"></i>
                    <span>MP: ${item.IMPPlus}</span>
                </div>
            `);
		}

		// Регенерация
		if (hasValue(item.IHPRegen)) {
			badges.push(`
                <div class="stat-badge" data-atropos-offset="3">
                    <i class="fa-solid fa-heart-pulse"></i>
                    <span>Реген HP: ${item.IHPRegen}</span>
                </div>
            `);
		}

		if (hasValue(item.IMPRegen)) {
			badges.push(`
                <div class="stat-badge" data-atropos-offset="3">
                    <i class="fa-solid fa-rotate"></i>
                    <span>Реген MP: ${item.IMPRegen}</span>
                </div>
            `);
		}

		// Скорость и крит
		if (hasValue(item.IAttackRate)) {
			badges.push(`
                <div class="stat-badge" data-atropos-offset="3">
                    <i class="fa-solid fa-bolt"></i>
                    <span>Скор. атаки: ${item.IAttackRate}</span>
                </div>
            `);
		}

		if (hasValue(item.IMoveRate)) {
			badges.push(`
                <div class="stat-badge" data-atropos-offset="3">
                    <i class="fa-solid fa-person-walking"></i>
                    <span>Скор. движения: ${item.IMoveRate}</span>
                </div>
            `);
		}

		if (hasValue(item.ICritical)) {
			badges.push(`
                <div class="stat-badge" data-atropos-offset="3">
                    <i class="fa-solid fa-crutch"></i>
                    <span>Крит: ${item.ICritical}</span>
                </div>
            `);
		}

		// Поглощение урона
		if (hasValue(item.IDPV)) {
			badges.push(`
                <div class="stat-badge" data-atropos-offset="3">
                    <i class="fa-solid fa-shield"></i>
                    <span>Погл. ближ: ${item.IDPV}</span>
                </div>
            `);
		}

		if (hasValue(item.IMPV)) {
			badges.push(`
                <div class="stat-badge" data-atropos-offset="3">
                    <i class="fa-solid fa-poo-storm"></i>
                    <span>Погл. маг: ${item.IMPV}</span>
                </div>
            `);
		}

		if (hasValue(item.IRPV)) {
			badges.push(`
                <div class="stat-badge" data-atropos-offset="3">
                    <i class="fa-solid fa-soap"></i>
                    <span>Погл. дальн: ${item.IRPV}</span>
                </div>
            `);
		}

		// Уклонение
		if (hasValue(item.IDDV)) {
			badges.push(`
                <div class="stat-badge" data-atropos-offset="3">
                    <i class="fa-brands fa-padlet"></i>
                    <span>Укл. ближ: ${item.IDDV}</span>
                </div>
            `);
		}

		if (hasValue(item.IMDV)) {
			badges.push(`
                <div class="stat-badge" data-atropos-offset="3">
                    <i class="fa-solid fa-wind"></i>
                    <span>Укл. маг: ${item.IMDV}</span>
                </div>
            `);
		}

		if (hasValue(item.IRDV)) {
			badges.push(`
                <div class="stat-badge" data-atropos-offset="3">
                    <i class="fa-brands fa-pied-piper-alt"></i>
                    <span>Укл. дальн: ${item.IRDV}</span>
                </div>
            `);
		}

		return badges.join('');
	}


	// ! Генерация HTML заголовков таблицы
	_generateTableHeaders() {
		return `
                    <th>🖼️</th>
                    <th>Название</th>
                    <th>Описание</th>
                    <th>Вес</th>
                    <th>Класс</th>
            `;
	}

	// Генерация строки таблицы для предмета
	_generateItemRow(item, resources) {
		return `
                <tr>
                    <td>
                        <div class="hover-text-wrapper">
                            <a href="/item/${item.IID}">
                                <img src="${resources[item.IID] || CONSTANTS.FALLBACK_IMAGE}"
                                    alt="${item.IName}"
                                    title="${item.IName}"
                                    width="48"
                                    height="48"
                                    loading="lazy"
                                    class="item-image"
                                    onerror="this.src='${CONSTANTS.FALLBACK_IMAGE}';">
                            </a>
                            <div class="hover-text">[${item.IID}] ${item.IName}</div>
                        </div>
                    </td>
                    <td>
                        <div class="item-name">
                            <a href="/item/${item.IID}">${item.IName}</a>
                        </div>
                    </td>
                    <td class="item-desc">${item.IDesc || 'Нет описания'}</td>
                    <td>${item.IWeight || 'N/A'}</td>
                    <td><img src="${item.IUseClass || 'N/A'}" alt="${item.IName}"></td>
                </tr>
            `;
	}

	// Создание пагинации
	createPagination(total, currentPage, perPage) {
		const paginationContainer = document.querySelector('.pagination-container');
		if (!paginationContainer) return;

		const totalPages = Math.ceil(total / perPage);

		paginationContainer.style.opacity = '0';
		paginationContainer.innerHTML = this._generatePaginationHTML(
			totalPages, currentPage
		);

		requestAnimationFrame(() => {
			paginationContainer.style.opacity = '1';
		});
	}

	// ! Генерация HTML для пагинации
	_generatePaginationHTML(totalPages, currentPage) {
		const buttons = [];

		// Previous button
		buttons.push(this._createPaginationButton(
			'Предыдущая',
			currentPage - 1,
			currentPage === 1
		));

		// Page numbers
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

		// Next button
		buttons.push(this._createPaginationButton(
			'Следующая',
			currentPage + 1,
			currentPage === totalPages
		));

		return buttons.join('');
	}

	// Показывает первую, последнюю и страницы вокруг текущей
	_shouldShowPageNumber(pageNum, currentPage, totalPages) {
		return pageNum === 1 ||
			pageNum === totalPages ||
			(pageNum >= currentPage - CONSTANTS.PAGINATION_RADIUS &&
				pageNum <= currentPage + CONSTANTS.PAGINATION_RADIUS);
	}

	// ! Создает HTML кнопки для пагинации с соответствующими классами и обработчиками
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

	// Обновляет отображаемое количество найденных предметов
	updateTotalCount(count) {
		const totalCount = document.getElementById('totalCount');
		if (totalCount) {
			totalCount.textContent = `Найдено предметов: ${count}`;
		}
	}

	// Обновляет URL страницы с параметрами текущих фильтров
	updateURL(params) {
		const url = new URL(window.location.href);
		url.search = new URLSearchParams(params).toString();
		history.pushState({}, '', url);
	}

	// Управляет отображением индикатора загрузки
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

	// Отображает сообщение об ошибке с автоматическим скрытием
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
// ? Основной класс приложения для фильтрации предметов
class ItemFilterApp {
	constructor() {
		this.stateManager = new StateManager();
		this.dataService = new ItemDataService(this.stateManager);
		this.uiManager = new ItemUIManager(this.stateManager);
	}

	// Инициализация приложения
	async initialize() {
		await this.dataService.fetchData();
		this.uiManager.initializeUI();
		this.setupEventListeners();
		this.applyFilters(1);
		initializeSearch();
	}

	// Настройка слушателей событий
	setupEventListeners() {
		document.addEventListener('filtersUpdated', () => {
			this.applyFilters(1);
		});
	}

	// Применение фильтров и обновление UI
	async applyFilters(page = 1) {
		const cachedData = this.stateManager.getState('cachedData');
		if (!cachedData) return;

		const filters = ItemFilterManager.collectFilters();
		const filteredData = ItemFilterManager.filterData(cachedData.items, filters);

		const perPage = this.stateManager.getState('perPage');
		const paginatedData = this._paginateData(filteredData, page, perPage);

		this.stateManager.setState('currentPage', page);
		this.uiManager.updateTotalCount(filteredData.length);
		this.uiManager.renderItems(paginatedData, cachedData.resources);
		this.uiManager.createPagination(filteredData.length, page, perPage);
		this.uiManager.updateURL(filters);
	}

	// Пагинация отфильтрованных данных
	_paginateData(data, page, perPage) {
		const start = (page - 1) * perPage;
		return data.slice(start, start + perPage);
	}
}

// ! Initialize application
// ? Инициализация приложения после загрузки DOM
let app;
document.addEventListener('DOMContentLoaded', () => {
	app = new ItemFilterApp();
	app.initialize();
});