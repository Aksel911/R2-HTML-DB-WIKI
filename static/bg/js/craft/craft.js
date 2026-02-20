



// Функции загрузки
function toggleLoading(show) {
    const indicator = document.getElementById('loading-indicator');
    indicator.style.display = show ? 'block' : 'none';
    isLoading = show;
}

async function loadGroupItems(groupId, group2 = null) {
    if (isLoading) return;
    
    const container = document.getElementById(`group-${groupId}${group2 ? '-' + group2 : ''}-items`);
    if (!container) return;
    
    try {
        toggleLoading(true);
        
        const url = group2 
            ? `/api/craft_group/${groupId}?group2=${group2}`
            : `/api/craft_group/${groupId}`;
            
        const response = await fetch(url);
        const data = await response.json();
        
        if (!group2) {
            // Проверяем, есть ли подгруппы
            const hasSubgroups = data.items.length > 0 && data.items[0].hasOwnProperty('group2');
            
            if (hasSubgroups) {
                // Загружаем структуру подгрупп
                const subgroupsHtml = data.items
                    .map(item => {
                        // Формируем ключ для group2_names
                        const subgroupKey = `${groupId}${item.group2}`;
                        const subgroupName = group2_names[subgroupKey];
                        
                        if (!subgroupName) return '';
                        
                        return `
                            <div class="submenu-category">
                                <div class="submenu-header" onclick="toggleSubGroup(this)" data-group="${groupId}" data-subgroup="${item.group2}">
                                    <i class="fas fa-plus"></i>
                                    ${subgroupName}
                                </div>
                                <div class="submenu-items" style="display: none;" id="group-${groupId}-${item.group2}-items">
                                    <div class="group-loading">
                                        <i class="fas fa-spinner fa-spin"></i> Загрузка...
                                    </div>
                                </div>
                            </div>
                        `;
                    })
                    .filter(Boolean)
                    .join('');
                
                if (subgroupsHtml) {
                    container.innerHTML = subgroupsHtml;
                } else {
                    // Если нет подходящих подгрупп, загружаем все предметы
                    loadGroupItems(groupId, '0');
                }
            } else {
                // Если нет подгрупп, отображаем предметы
                container.innerHTML = generateItemsList(data.items);
            }
        } else {
            // Загружаем предметы конкретной подгруппы
            container.innerHTML = generateItemsList(data.items);
        }
        
        loadedGroups.add(group2 ? `${groupId}-${group2}` : groupId);
    } catch (error) {
        console.error('Error loading group items:', error);
        container.innerHTML = '<div class="error-message">Ошибка загрузки</div>';
    } finally {
        toggleLoading(false);
    }
}

function generateItemsList(items) {
    if (!Array.isArray(items) || items.length === 0) {
        return '<div class="empty-message">Нет предметов</div>';
    }
    
    return items
        .filter(item => item.result_name) // Проверяем наличие result_name
        .map(item => `
            <div class="craft-list-item" 
                 onclick="showCraftDetails('${item.rid}')"
                 data-search-text="${item.result_name.toLowerCase()}"
                 data-rid="${item.rid}">
                <img src="${item.result_pic}" 
                     alt="${item.result_name}" 
                     width="24" height="24" 
                     loading="lazy"
                     onerror="this.onerror=null; this.src='https://raw.githubusercontent.com/Aksel911/R2-HTML-DB/main/static/no_monster/no_monster_image.png';">
                ${item.result_name}${item.create_count > 1 ? ` (${item.create_count})` : ''}
            </div>
        `)
        .join('');
}


function toggleSubGroup(element) {
    const groupId = element.dataset.group;
    const subgroup = element.dataset.subgroup;
    const container = document.getElementById(`group-${groupId}-${subgroup}-items`);
    const icon = element.querySelector('i');
    
    if (container.style.display === 'none') {
        container.style.display = 'block';
        icon.classList.remove('fa-plus');
        icon.classList.add('fa-minus');
        
        if (!loadedGroups.has(`${groupId}-${subgroup}`)) {
            loadGroupItems(groupId, subgroup);
        }
    } else {
        container.style.display = 'none';
        icon.classList.remove('fa-minus');
        icon.classList.add('fa-plus');
    }
}


// Обработчик прокрутки
function handleScroll(groupId, container) {
    if (isLoading) return;
    
    const scrollPosition = container.scrollTop + container.clientHeight;
    const scrollHeight = container.scrollHeight;
    
    if (scrollHeight - scrollPosition <= 100) {
        loadGroupItems(groupId, (currentPage[groupId] || 1) + 1);
    }
}

// Функции крафта
async function showCraftDetails(craftId) {
    if (isLoading) return;
    
    // Подсветка выбранного предмета
    document.querySelectorAll('.craft-list-item').forEach(item => {
        item.classList.remove('selected');
    });
    document.querySelector(`[data-rid="${craftId}"]`)?.classList.add('selected');
    
    if (loadedCrafts.has(craftId)) {
        document.querySelectorAll('.craft-info').forEach(el => el.style.display = 'none');
        document.getElementById(`craft-${craftId}`).style.display = 'block';
        return;
    }
    
    try {
        toggleLoading(true);
        
        const response = await fetch(`/api/craft_details/${craftId}`);
        const craftData = await response.json();
        
        const container = document.getElementById('craft-details-container');
        const craftHtml = generateCraftHtml(craftData);
        
        document.querySelector('.initial-message')?.remove();
        
        if (!loadedCrafts.size) {
            container.innerHTML = craftHtml;
        } else {
            container.insertAdjacentHTML('beforeend', craftHtml);
        }
        
        loadedCrafts.add(craftId);
        
        // Показываем текущий крафт
        document.querySelectorAll('.craft-info').forEach(el => el.style.display = 'none');
        document.getElementById(`craft-${craftId}`).style.display = 'block';
        
    } catch (error) {
        console.error('Error loading craft details:', error);
        showNotification('Ошибка загрузки данных крафта', 'error');
    } finally {
        toggleLoading(false);
    }
}


// Функция показа уведомлений
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification-overlay ${type}`;
    
    const content = `
        <div class="notification-message">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-times-circle'}"></i>
            <div class="notification-content">
                <div>${message}</div>
            </div>
        </div>
    `;
    
    notification.innerHTML = content;
    document.body.appendChild(notification);
    
    // Показываем уведомление
    setTimeout(() => {
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }, 100);
}

// Генерация HTML для крафта
function generateCraftHtml(craftData) {
    return `
        <div class="craft-info" id="craft-${craftData.rid}">
            <div class="item-title">
                <a href="/item/${craftData.result_item_id}" class="item-link">
                    <i class="fas fa-link"></i>
                    ${craftData.result_name}
                </a>
            </div>
            <div class="craft-main">
                <div class="result-item">
                    <div class="item-preview">
                        <a href="/item/${craftData.result_item_id}">
                            <div class="item-frame">
                                <img src="${craftData.result_pic}" 
                                     alt="${craftData.result_name}" 
                                     class="item-icon"
                                     loading="lazy"
                                     onerror="this.onerror=null; this.src='https://raw.githubusercontent.com/Aksel911/R2-HTML-DB/main/static/no_monster/no_monster_image.png';">
                                ${craftData.create_count > 1 ? 
                                    `<div class="create-count">${craftData.create_count}</div>` : ''}
                            </div>
                        </a>
                    </div>
                </div>
                <div class="craft-info-text">
                    <div class="gold-text">
                        <i class="fas fa-coins"></i>
                        Изготовленное серебро: ${craftData.cost}
                    </div>
                    <div class="silver-text">
                        <i class="fas fa-wallet"></i>
                        В наличии: ${availableMoney.toLocaleString()}
                    </div>
                    ${craftData.success_rate === 100 ?
                        `<div class="success-text">
                            <i class="fas fa-check-circle"></i>
                            Изготовление предмета успешно на 100%
                        </div>` :
                        `<div class="failure-text">
                            <i class="fas fa-exclamation-triangle"></i>
                            [${craftData.success_rate}%] Возможна неудача во время создания предмета.
                        </div>`
                    }
                </div>
            </div>
            
            <div class="materials-container">
                <div class="materials-header">
                    <i class="fas fa-cube"></i>
                    Необходимые материалы
                </div>
                ${craftData.materials.map(material => `
                    <div class="material-slot">
                        <a href="/item/${material.item_id}" class="material-preview">
                            <div class="material-frame">
                                <img src="${material.pic}" 
                                     alt="${material.name}"
                                     loading="lazy"
                                     onerror="this.onerror=null; this.src='https://raw.githubusercontent.com/Aksel911/R2-HTML-DB/main/static/no_monster/no_monster_image.png';">
                            </div>
                        </a>
                        <div class="material-info">
                            <a href="/item/${material.item_id}" class="material-name">${material.name}</a>
                            <div class="material-quantity">${material.count} / ${material.count} / (0)</div>
                        </div>
                    </div>
                `).join('')}
                ${Array(4 - craftData.materials.length).fill().map(() => `
                    <div class="material-slot empty">
                        <div class="empty-slot-icon">
                            <i class="fas fa-slash"></i>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div class="craft-buttons">
                <button class="create-btn" onclick="craftItem(event)">
                    <i class="fas fa-hammer"></i>
                    Создание
                </button>
                <button class="close-btn" onclick="closeCraftWindow(event)">
                    <i class="fas fa-times"></i>
                    Закрыть
                </button>
            </div>
        </div>
    `;
}

// Функция крафта предмета
function craftItem(event) {
    if (isLoading) return;
    
    const button = event.target.closest('.create-btn');
    if (!button) return;
    
    const craftInfo = button.closest('.craft-info');
    const costElement = craftInfo.querySelector('.gold-text');
    const cost = parseInt(costElement.textContent.match(/\d+/)[0]);
    
    // Проверка наличия денег
    if (availableMoney < cost) {
        showNotification('Недостаточно денег для создания предмета!', 'error');
        return;
    }
    
    const successRateText = craftInfo.querySelector('.failure-text')?.textContent || 
                         craftInfo.querySelector('.success-text')?.textContent;
    const successRateMatch = successRateText.match(/\[(\d+)%\]/);
    
    let success = true;
    if (successRateMatch) {
        const successRate = parseFloat(successRateMatch[1]); // Используем parseFloat для обработки float
        success = (Math.random() * 100) <= successRate;
    }

    
    // Анимация нажатия кнопки
    button.style.transform = 'scale(0.95)';
    setTimeout(() => button.style.transform = '', 100);
    
    // Списываем деньги в любом случае
    availableMoney -= cost;
    updateAvailableMoney();
    
    // Данные предмета для уведомления
    const craftData = {
        result_pic: craftInfo.querySelector('.item-icon').src,
        result_name: craftInfo.querySelector('.item-title').textContent.trim()
    };
    
    if (success) {
        showCraftNotification(craftData, true);
        
        // Анимация успешного создания
        const itemPreview = craftInfo.querySelector('.item-frame');
        itemPreview.style.animation = 'itemGlow 1s ease';
        setTimeout(() => itemPreview.style.animation = '', 1000);
        
        createConfetti('success');
        playSound('success');
    } else {
        showCraftNotification(null, false);
        
        // Анимация неудачи
        craftInfo.classList.add('shake');
        setTimeout(() => craftInfo.classList.remove('shake'), 500);
        
        createConfetti('error');
        playSound('error');
    }
}

// Функция показа уведомления о крафте
function showCraftNotification(craftData, success) {
    const notification = document.createElement('div');
    notification.className = `notification-overlay ${success ? 'success' : 'error'}`;
    
    const content = success ? `
        <div class="notification-message">
            <i class="fas fa-check-circle"></i>
            <div class="notification-content">
                <div>Предмет успешно создан!</div>
                <div class="item-result">
                    <img src="${craftData.result_pic}" alt="${craftData.result_name}">
                    <span>Вы получили: ${craftData.result_name}</span>
                </div>
            </div>
        </div>
    ` : `
        <div class="notification-message">
            <i class="fas fa-times-circle"></i>
            <span>Не удалось создать предмет...</span>
        </div>
    `;
    
    notification.innerHTML = content;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }, 100);
}

// Обновление отображения денег
function updateAvailableMoney() {
    document.querySelectorAll('.silver-text').forEach(text => {
        text.innerHTML = `
            <i class="fas fa-wallet"></i>
            В наличии: ${availableMoney.toLocaleString()}
        `;
    });
}

// Воспроизведение звуков
function playSound(type) {
    const sounds = {
        success: 'https://github.com/Aksel911/R2-Textures/raw/refs/heads/main/%5BFIX%5D%20FIXES/%5BFIX%5D%20%D0%A1%D1%82%D0%B0%D1%80%D1%8B%D0%B9%20%D1%8D%D1%84%D1%84%D0%B5%D0%BA%D1%82%20%D0%B7%D0%B0%D1%82%D0%BE%D1%87%D0%BA%D0%B8/sound/10th_success.wav',
        error: 'https://github.com/Aksel911/R2-Textures/raw/refs/heads/main/%5BFIX%5D%20FIXES/%5BFIX%5D%20%D0%A1%D1%82%D0%B0%D1%80%D1%8B%D0%B9%20%D1%8D%D1%84%D1%84%D0%B5%D0%BA%D1%82%20%D0%B7%D0%B0%D1%82%D0%BE%D1%87%D0%BA%D0%B8/sound/FAIL_02.wav',
        theme: 'https://github.com/Aksel911/R2-Textures/raw/refs/heads/main/%5BFIX%5D%20FIXES/%5BFIX%5D%20%D0%A1%D1%82%D0%B0%D1%80%D1%8B%D0%B9%20%D1%8D%D1%84%D1%84%D0%B5%D0%BA%D1%82%20%D0%B7%D0%B0%D1%82%D0%BE%D1%87%D0%BA%D0%B8/sound/gui_click.wav'
    };
    
    const audio = new Audio(sounds[type]);
    audio.play().catch(error => console.log('Error playing sound:', error));
}

// Эффекты конфетти
function createConfetti(type) {
    const colors = type === 'success' 
        ? ['#ff6b6b', '#f06595', '#cc5de8', '#845ef7', '#5c7cfa', '#339af0', '#22b8cf', '#20c997', '#51cf66', '#94d82d', '#fcc419']
        : ['#ff0000', '#ff4444', '#ff8888'];
        
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '9999';
    document.body.appendChild(container);
    
    for (let i = 0; i < 150; i++) {
        const confetti = document.createElement('div');
        confetti.className = `confetti ${['square', 'circle'][Math.floor(Math.random() * 2)]}`;
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = `${Math.random() * 100}vw`;
        confetti.style.animationDuration = `${Math.random() * 2 + 2}s`;
        confetti.style.opacity = Math.random() * 0.4 + 0.6;
        container.appendChild(confetti);
    }
    
    setTimeout(() => {
        container.style.transition = 'opacity 1s ease-out';
        container.style.opacity = '0';
        setTimeout(() => container.remove(), 1000);
    }, 2000);
}

// Функции поиска
searchBtn.addEventListener('click', () => {
    if (searchInput.style.display === 'none') {
        searchInput.style.display = 'block';
        searchInput.focus();
        searchBtn.innerHTML = '<i class="fas fa-times"></i>';
    } else {
        searchInput.style.display = 'none';
        searchInput.value = '';
        searchBtn.innerHTML = '<i class="fas fa-search"></i>';
        performSearch('');
    }
});

searchInput.addEventListener('input', (e) => {
    if (searchTimeout) {
        clearTimeout(searchTimeout);
    }
    searchTimeout = setTimeout(() => performSearch(e.target.value), 300);
});


async function loadAllGroups() {
    for (const group of document.querySelectorAll('.menu-group')) {
        const groupId = group.querySelector('.menu-header').dataset.group;
        await loadGroupItems(groupId);

        for (const subgroup of group.querySelectorAll('.submenu-header')) {
            const subgroupId = subgroup.dataset.subgroup;
            await loadGroupItems(groupId, subgroupId);
        }
    }
}


function performSearch(query) {
    const searchText = query.toLowerCase();
    let found = false;

    document.querySelectorAll('.menu-group').forEach(group => {
        const groupId = group.querySelector('.menu-header').dataset.group;
        const submenu = group.querySelector('.submenu');
        let hasVisibleItems = false;

        // Получаем все предметы для этой группы из allCrafts
        const groupData = allCrafts[groupId];
        if (groupData) {
            // Перебираем все подгруппы
            Object.keys(groupData).forEach(subgroupId => {
                const items = groupData[subgroupId];
                const hasMatchingItems = items.some(item => item.result_name.toLowerCase().includes(searchText));

                if (hasMatchingItems) {
                    hasVisibleItems = true;
                    found = true;
                }

                // Показываем или скрываем подгруппу
                const subgroupContainer = submenu.querySelector(`#group-${groupId}-${subgroupId}-items`);
                if (subgroupContainer) {
                    subgroupContainer.style.display = hasMatchingItems ? 'block' : 'none';
                }
            });
        }

        // Управляем отображением группы
        submenu.style.display = hasVisibleItems ? 'block' : 'none';
        group.style.display = hasVisibleItems ? 'block' : 'none';
        const groupIcon = group.querySelector('.menu-header i');
        groupIcon.className = hasVisibleItems ? 'fas fa-minus' : 'fas fa-plus';
    });

    if (searchText && !found) {
        showNotification('Ничего не найдено', 'error');
    }
}

// Переключение групп
function toggleGroup(element) {
    const groupId = element.dataset.group;
    const submenu = document.getElementById(`group-${groupId}-items`);
    const icon = element.querySelector('i');
    
    if (submenu.style.display === 'none') {
        submenu.style.display = 'block';
        icon.classList.remove('fa-plus');
        icon.classList.add('fa-minus');
        
        if (!loadedGroups.has(groupId)) {
            loadGroupItems(groupId);
        }
    } else {
        submenu.style.display = 'none';
        icon.classList.remove('fa-minus');
        icon.classList.add('fa-plus');
    }
}

// Закрытие окна крафта
function closeCraftWindow(event) {
    const craftInfo = event.target.closest('.craft-info');
    if (craftInfo) {
        craftInfo.style.display = 'none';
        document.querySelector('.initial-message').style.display = 'block';
    }
}

// Переключение темы
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
    playSound('theme');
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    // Загружаем первую группу по умолчанию
    //const firstGroup = document.querySelector('.menu-header');
    //if (firstGroup) {
    //    toggleGroup(firstGroup);
    //}
    // Грузим все блоки
    loadAllGroups();
    
    // Обработчик темы
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Применяем сохраненную тему
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }
    
    // Обработка Escape для поиска
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && searchInput.style.display !== 'none') {
            searchBtn.click();
        }
    });
});