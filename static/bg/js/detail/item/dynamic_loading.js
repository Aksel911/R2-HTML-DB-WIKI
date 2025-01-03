// static/bg/js/detail/item/dynamic_loading.js

document.addEventListener('DOMContentLoaded', function() {
    const itemId = document.body.dataset.itemId;

    // Конфигурация секций для загрузки
    const sections = [
        // Руны и слоты (каждый независимо)
        {
            endpoint: 'bead-hole',
            containers: [
                { id: 'bead-hole-container', template: 'TblBeadHoleProb.html' }
            ]
        },
        {
            endpoint: 'bead-rune',
            containers: [
                { id: 'bead-container', template: 'DT_Bead.html' }
            ]
        },
        {
            endpoint: 'bead-module',
            containers: [
                { id: 'bead-module-container', template: 'DT_ItemBeadModule.html' }
            ]
        },
        // Крафт
        {
            endpoint: 'craft',
            containers: [
                { id: 'craft-container', template: 'item_page_detail_item_craft.html' }
            ]
        },
        {
            endpoint: 'craft-need',
            containers: [
                { id: 'craft-need-container', template: 'item_page_detail_need_craft.html' }
            ]
        },
        // Спецэффекты
        {
            endpoint: 'specific-proc',
            containers: [
                { id: 'specific-proc-container', template: 'TblSpecificProcItem.html' }
            ]
        },
        // Умения и эффекты
        {
            endpoint: 'skill-detail',
            containers: [
                { id: 'skill-container', template: 'item_page_detail_skill.html' }
            ]
        },
        {
            endpoint: 'abnormal',
            containers: [
                { id: 'abnormal-container', template: 'item_page_detail_abnormal.html' }
            ]
        },
        // Источники получения
        {
            endpoint: 'can-get',
            containers: [
                { id: 'can-get-container', template: 'item_page_detail_can_get_item_from.html' },
                { id: 'merchant-container', template: 'item_page_detail_can_buy_item_from.html' }
            ]
        },
        // Защиты и сопротивления
        {
            endpoint: 'abnormal-resist',
            containers: [
                { id: 'abnormal-resist-container', template: 'item_page_detail_abnormal_resist.html' }
            ]
        },
        {
            endpoint: 'transform',
            containers: [
                { id: 'transform-container', template: 'item_page_detail_transform_in.html' }
            ]
        },
        {
            endpoint: 'protect',
            containers: [
                { id: 'protect-container', template: 'DT_ItemProtect.html' }
            ]
        },
        {
            endpoint: 'penality',
            containers: [
                { id: 'penality-container', template: 'DT_ItemPanalty.html' }
            ]
        },
        {
            endpoint: 'slain',
            containers: [
                { id: 'slain-container', template: 'DT_ItemSlain.html' }
            ]
        },
        {
            endpoint: 'attribute-add',
            containers: [
                { id: 'attribute-add-container', template: 'DT_ItemAttributeAdd.html' }
            ]
        },
        {
            endpoint: 'attribute-resist',
            containers: [
                { id: 'attribute-resist-container', template: 'DT_ItemAttributeResist.html' }
            ]
        }
    ];

    // Функция для проверки валидности данных
    function isValidData(data) {
        if (!data || typeof data !== 'object') return false;
        
        // Проверяем все значения в объекте
        return Object.values(data).some(value => {
            if (value === null || value === undefined) return false;
            if (Array.isArray(value)) return value.length > 0;
            if (typeof value === 'object') return Object.keys(value).length > 0;
            return Boolean(value);
        });
    }

    // Единая функция загрузки данных
    async function loadSection(section) {
        try {
            const element = document.getElementById(section.containers[0].id);
            if (!element) return;

            const response = await fetch(`/api/item/${itemId}/${section.endpoint}`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const data = await response.json();
            if (!isValidData(data)) {
                section.containers.forEach(container => {
                    const el = document.getElementById(container.id);
                    if (el) el.style.display = 'none';
                });
                return;
            }

            for (const container of section.containers) {
                const el = document.getElementById(container.id);
                if (!el) continue;

                const templateResponse = await fetch(`/render_template/item/${container.template}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                if (templateResponse.ok) {
                    const html = await templateResponse.text();
                    if (html.trim()) {
                        el.innerHTML = html;
                        el.classList.remove('loading');
                        if (window.initializeSpoilers) {
                            window.initializeSpoilers(el);
                        }
                    } else {
                        el.style.display = 'none';
                    }
                }
            }
        } catch (error) {
            console.error(`Error loading ${section.endpoint}:`, error);
            section.containers.forEach(container => {
                const el = document.getElementById(container.id);
                if (el) el.style.display = 'none';
            });
        }
    }

    // Загружаем все секции параллельно
    Promise.all(sections.map(section => loadSection(section)));
});