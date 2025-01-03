document.addEventListener('DOMContentLoaded', function() {
    const monsterId = document.body.dataset.monsterId;

    // Конфигурация секций для загрузки
    const sections = [
        {
            endpoint: 'drops',
            containers: [
                { id: 'drops-container', template: 'monster_page_detail_item_drop.html' }
            ]
        },
        {
            endpoint: 'merchant-items',
            containers: [
                { id: 'merchant-items-container', template: 'monster_page_detail_item_sell.html' }
            ],
            shouldLoad: (containerId) => document.getElementById(containerId) !== null
        },
        {
            endpoint: 'abnormal-resist',
            containers: [
                { id: 'abnormal-resist-container', template: 'monster_page_detail_abnormal_resist.html' }
            ],
            shouldLoad: (containerId) => document.getElementById(containerId) !== null
        },
        {
            endpoint: 'attributes',
            containers: [
                { id: 'attributes-container', template: 'DT_MonsterAttributeAdd.html' }
            ]
        },
        {
            endpoint: 'protect-slain',
            containers: [
                { id: 'protect-slain-container', template: 'DT_MonsterProtect.html' }
            ]
        },
        {
            endpoint: 'ai',
            containers: [
                { id: 'ai-container', template: 'TblAi.html' },
                { id: 'aiex-container', template: 'TblAiEx.html' }
            ],
            shouldLoad: (containerId) => document.getElementById(containerId) !== null
        }
    ];

    // Единая функция загрузки данных
    async function loadSection(section) {
        try {
            // Проверяем, нужно ли загружать секцию
            const shouldLoad = section.containers.some(container => {
                if (section.shouldLoad) {
                    return section.shouldLoad(container.id);
                }
                return document.getElementById(container.id) !== null;
            });

            if (!shouldLoad) return;

            // Получаем данные
            const response = await fetch(`/api/monster/${monsterId}/${section.endpoint}`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();

            // Обновляем все контейнеры для данной секции
            for (const container of section.containers) {
                const element = document.getElementById(container.id);
                if (!element) continue;

                const templateResponse = await fetch(`/render_template/${container.template}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                if (templateResponse.ok) {
                    const html = await templateResponse.text();
                    // Проверяем, что вернулся не пустой HTML
                    if (html.trim()) {
                        element.innerHTML = html;
                        element.classList.remove('loading');
                        // Инициализируем спойлеры в новом контенте
                        initializeSpoilers(element);
                    } else {
                        // Если вернулся пустой HTML, скрываем контейнер
                        element.style.display = 'none';
                    }
                }
            }
        } catch (error) {
            console.error(`Error loading ${section.endpoint}:`, error);
            // В случае ошибки скрываем контейнеры секции
            section.containers.forEach(container => {
                const element = document.getElementById(container.id);
                if (element) element.style.display = 'none';
            });
        }
    }

    // Загружаем все секции
    sections.forEach(loadSection);
});