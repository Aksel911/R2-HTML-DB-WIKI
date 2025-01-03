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
                { id: 'attributes-add-container', template: 'DT_MonsterAttributeAdd.html' },
                { id: 'attributes-resist-container', template: 'DT_MonsterAttributeResist.html' }
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
    // Pre-fetch templates in parallel with data
    async function loadSection(section) {
        try {
            if (!section.containers.some(container => 
                section.shouldLoad ? section.shouldLoad(container.id) : 
                document.getElementById(container.id))) return;

            const [dataResponse, ...templateResponses] = await Promise.all([
                fetch(`/api/monster/${monsterId}/${section.endpoint}`),
                ...section.containers.map(container => 
                    fetch(`/render_template/${container.template}`, {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({}) // Empty payload for pre-fetch
                    })
                )
            ]);

            const data = await dataResponse.json();

            // Process containers in parallel
            await Promise.all(section.containers.map(async (container, i) => {
                const element = document.getElementById(container.id);
                if (!element) return;

                const templateResponse = await fetch(`/render_template/${container.template}`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(data)
                });
                
                if (templateResponse.ok) {
                    const html = await templateResponse.text();
                    if (html.trim()) {
                        element.innerHTML = html;
                        element.classList.remove('loading');
                        initializeSpoilers(element);
                    } else {
                        element.style.display = 'none';
                    }
                }
            }));
        } catch (error) {
            console.error(`Error loading ${section.endpoint}:`, error);
            section.containers.forEach(container => {
                const element = document.getElementById(container.id);
                if (element) element.style.display = 'none';
            });
        }
    }

    // Загружаем все секции параллельно
    Promise.all(sections.map(section => loadSection(section)));
});