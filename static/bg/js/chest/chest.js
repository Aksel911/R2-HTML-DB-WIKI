let currentItems = [];
let currentMonsterName = '';

function toggleItems(button, event) {
    event.preventDefault();
    event.stopPropagation();

    const header = button.closest('.chest-header');
    const itemsList = header.nextElementSibling;
    const card = header.closest('.chest-card');
    
    if (button.classList.contains('active')) {
        button.classList.remove('active');
        itemsList.classList.remove('active');
        return;
    }

    // Close other open items
    document.querySelectorAll('.toggle-button.active').forEach(btn => {
        if (btn !== button) {
            btn.classList.remove('active');
            btn.closest('.chest-card').querySelector('.items-list').classList.remove('active');
        }
    });

    button.classList.add('active');
    itemsList.classList.add('active');
    
    initializeRarityClasses(itemsList);
    initializeImageZoom();
}

function initializeRarityClasses(container) {
    container.querySelectorAll('.item-row').forEach(row => {
        const fill = row.querySelector('.chance-fill');
        const chance = parseInt(fill.dataset.chance);
        const badge = row.querySelector('.rarity-badge');
        const container = row.querySelector('.chance-container');
        
        let rarityClass, rarityText;
        
        // Calculate the display width percentage (scaled from 0-10000 to 0-100)
        const displayWidth = (chance / 100).toFixed(2);
        fill.style.width = `${displayWidth}%`;
        
        if (chance === 10000) {
            rarityClass = 'rarity-guaranteed';
            rarityText = 'Гарантированный';
        } else if (chance >= 9000) {
            rarityClass = 'rarity-common';
            rarityText = 'Обычный';
        } else if (chance >= 8000) {
            rarityClass = 'rarity-uncommon';
            rarityText = 'Необычный';
        } else if (chance >= 7000) {
            rarityClass = 'rarity-rare';
            rarityText = 'Редкий';
        } else if (chance >= 6000) {
            rarityClass = 'rarity-epic';
            rarityText = 'Эпический';
        } else if (chance >= 5000) {
            rarityClass = 'rarity-mythical';
            rarityText = 'Мифический';
        } else if (chance >= 4000) {
            rarityClass = 'rarity-legendary';
            rarityText = 'Легендарный';
        } else if (chance >= 3000) {
            rarityClass = 'rarity-ultra-legendary';
            rarityText = 'Ультра-легендарный';
        } else if (chance >= 2000) {
            rarityClass = 'rarity-low';
            rarityText = 'Низкий';
        } else if (chance >= 1000) {
            rarityClass = 'rarity-very-low';
            rarityText = 'Очень низкий';
        } else {
            rarityClass = 'rarity-almost-impossible';
            rarityText = 'Невозможный';
        }

        container.className = 'chance-container ' + rarityClass;
        badge.textContent = rarityText;
        badge.className = 'rarity-badge ' + rarityClass;
    });
}

function openEditor(mid) {
    const modal = document.getElementById('chestEditor');
    
    // Сначала показываем модальное окно
    modal.style.display = 'block';
    // Запускаем анимацию через небольшую задержку
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
    
    fetch(`/api/chest-loot/${mid}`)
        .then(response => response.json())
        .then(data => {
            currentItems = data.items.map(item => ({
                ...item,
                status: item.status !== undefined ? Number(item.status) : 1
            }));
            totalChance = data.totalChance;

            if (currentItems && currentItems.length > 0) {
                const firstItem = currentItems[0];
                currentMonsterName = firstItem.MName;
                currentMonsterPic = firstItem.MID_pic;
            } else {
                currentMonsterName = 'Неизвестно';
                currentMonsterPic = 'https://raw.githubusercontent.com/Aksel911/R2-HTML-DB/main/static/no_monster/no_monster_image.png';
            }

            const currentMIDElement = document.getElementById('currentMID');
            currentMIDElement.innerHTML = `
                <h1><img src="${currentMonsterPic}" 
                        class="monster-pic" 
                        alt="${currentMonsterName}" 
                        onerror="this.onerror=null; this.src='https://raw.githubusercontent.com/Aksel911/R2-HTML-DB/main/static/no_monster/no_monster_image.png';" /></h1>
                [${mid}] <a href="/monster/${mid}" class="item-name">${currentMonsterName}</a>
                <div id="totalChance" class="totalChance">Главный шанс: ${totalChance}</div>
            `;
            
            renderItems();
        })
        .catch(error => console.error('Ошибка загрузки данных:', error));
    
    if (document.body.classList.contains('dark-theme')) {
        modal.classList.add('dark-theme');
    }
}

function renderItems() {
    const itemsList = document.getElementById('itemsList');

    itemsList.innerHTML = currentItems.map((item, index) => {
        const status = item.status !== undefined ? Number(item.status) : 1;
        const displayChance = item.totalChance || 0;
        
        return `
        <div class="item-edit-row" data-index="${index}" data-status="${status}">
            <img src="${item.itemPic || ''}"
                 class="item-pic"
                 alt="${item.itemName || ''}"
                 onerror="this.onerror=null; this.src='https://raw.githubusercontent.com/Aksel911/R2-HTML-DB/main/static/no_monster/no_monster_image.png';">
            <input type="text" class="item-id" value="${item.itemId || ''}" required>
            <input type="text" class="item-name" value="${item.itemName || ''}" required>
            <input type="number" class="item-count" value="${item.count || 1}" min="1" required>
            <input type="number" class="item-chance" value="${displayChance}" min="0" max="10000" required>
            <select class="item-status" onchange="updateRowStatus(this)">
                <option value="0" ${status === 0 ? 'selected' : ''}>Проклятый</option>
                <option value="1" ${status === 1 ? 'selected' : ''}>Обычный</option>
                <option value="2" ${status === 2 ? 'selected' : ''}>Благословенный</option>
            </select>
            <button type="button" class="remove-item" onclick="removeItem(${index})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `}).join('');
}

function closeEditor() {
    const modal = document.getElementById('chestEditor');
    
    // Запускаем анимацию исчезновения
    modal.classList.remove('show');
    
    // Ждем окончания анимации перед полным скрытием
    setTimeout(() => {
        modal.style.display = 'none';
        currentItems = [];
        document.getElementById('itemsList').innerHTML = '';
        modal.classList.remove('dark-theme');
    }, 300); // Время должно совпадать с длительностью CSS-анимации
}

async function addNewItem() {
    const newItemId = document.getElementById('newItemId').value.trim();
    const newItemName = document.getElementById('newItemName').value.trim();
    const newItemCount = document.getElementById('newItemCount').value;
    const newItemChance = document.getElementById('newItemChance').value.trim();
    const newItemStatus = document.getElementById('newItemStatus');
    
    let errors = [];
    
    if (!newItemId) {
        errors.push("ID предмета");
    }
    
    if (!newItemCount) {
        errors.push("Количество");
    } else if (parseInt(newItemCount) < 1) {
        alert('Количество должно быть больше 0');
        return;
    }
    
    if (!newItemChance) {
        errors.push("Шанс выпадения");
    } else if (isNaN(newItemChance) || parseFloat(newItemChance) < 0 || parseFloat(newItemChance) > 10000) {
        alert('Шанс должен быть числом от 0 до 10000');
        return;
    }
    
    if (errors.length > 0) {
        alert(`Пожалуйста, заполните следующие поля для добавления нового предмета:\n${errors.join("\n")}`);
        return;
    }

    try {
        const response = await fetch(`/api/item-info/${newItemId}`);
        const itemInfo = await response.json();

        const newItem = {
            itemId: newItemId,
            itemName: newItemName || itemInfo.itemName,
            itemPic: itemInfo.itemPic,
            count: parseInt(newItemCount),
            totalChance: parseFloat(newItemChance), // Changed from dropChance to totalChance
            status: Number(newItemStatus.value)
        };
        
        currentItems.push(newItem);
        renderItems();
        
        // Clear input fields after successful addition
        document.getElementById('newItemId').value = '';
        document.getElementById('newItemName').value = '';
        document.getElementById('newItemCount').value = '1';
        document.getElementById('newItemChance').value = '';
        newItemStatus.value = '1';
    } catch (error) {
        console.error('Error fetching item info:', error);
        alert('Ошибка при получении информации о предмете');
    }
}

function updateRowStatus(selectElement) {
    const row = selectElement.closest('.item-edit-row');
    const index = parseInt(row.dataset.index);
    const newStatus = Number(selectElement.value);
    
    currentItems[index].status = newStatus;
    row.dataset.status = newStatus;
}

function removeItem(index) {
    if (confirm('Вы уверены, что хотите удалить этот предмет?')) {
        currentItems.splice(index, 1);
        renderItems();
    }
}

async function saveChestLoot(event) {
    event.preventDefault();
    
    const midText = document.getElementById('currentMID').textContent;
    const mid = parseInt(midText.match(/\[(\d+)\]/)[1]);
    const totalChance = document.getElementById('totalChance').textContent;

    // Only get items from itemsList, excluding the item-edit-row
    const itemRows = document.querySelectorAll('#itemsList .item-edit-row');
    
    if (itemRows.length === 0) {
        alert('Добавьте хотя бы один предмет в список');
        return;
    }

    const updatedItems = Array.from(itemRows).map(row => {
        const inputs = row.querySelectorAll('input');
        const select = row.querySelector('select');
        
        const count = parseInt(inputs[2].value);
        const dropChance = parseFloat(inputs[3].value);

        if (count < 1) throw new Error(`Количество должно быть больше 0`);
        if (dropChance < 0 || dropChance > 100) throw new Error(`Шанс должен быть от 0 до 100`);
        
        return {
            itemId: inputs[0].value.trim(),
            itemName: inputs[1].value.trim(),
            count: count,
            dropChance: dropChance,
            status: Number(select.value)
        };
    });

    try {
        const response = await fetch('/api/save-chest-loot', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                mid: mid,
                items: updatedItems,
                totalChance: totalChance
            }),
        });
        
        if (response.ok) {
            alert('Изменения сохранены успешно!');
            closeEditor(); // Используем анимированное закрытие
            setTimeout(() => {
                location.reload();
            }, 300);
            return;
        }
        
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка сохранения');
        
    } catch (error) {
        console.error('Save error:', error);
        if (error.message) {
            alert(`Произошла ошибка: ${error.message}`);
        } else {
            alert('Произошла неизвестная ошибка при сохранении');
        }
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('chestEditor');
    if (event.target === modal) {
        closeEditor();
    }
}


// function initializeImageZoom() {

// }