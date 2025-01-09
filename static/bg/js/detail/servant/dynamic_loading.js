document.addEventListener('DOMContentLoaded', function() {
    const servantId = document.body.dataset.servantId;

    // Конфигурация секций для загрузки
    const sections = [
        {
            endpoint: 'base-craft',
            containers: [
                { id: 'base-craft-container', template: 'servant_core/detail/servant_page_craft_detail.html' }
            ]
        }
    ];

    // Единая функция загрузки данных
    async function loadSection(section) {
        try {
            console.log(`Starting to load section ${section.endpoint}`); // Отладка

            if (!section.containers.some(container => 
                section.shouldLoad ? section.shouldLoad(container.id) : 
                document.getElementById(container.id))) return;

            // Pre-fetch templates in parallel with data
            const [dataResponse, ...templateResponses] = await Promise.all([
                fetch(`/api/servant/${servantId}/${section.endpoint}`),
                ...section.containers.map(container => 
                    fetch(`/${container.template}`, {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({}) // Empty payload for pre-fetch
                    })
                )
            ]);
            
            console.log(`Got response for ${section.endpoint}`); // Отладка
            const data = await dataResponse.json();
            console.log(`Data for ${section.endpoint}:`, data); // Отладка

            // Process containers in parallel
            await Promise.all(section.containers.map(async (container, i) => {
                const element = document.getElementById(container.id);
                if (!element) {
                    console.log(`Container ${container.id} not found`); // Отладка
                    return;
                }
                    
                const templateResponse = await fetch(`/${container.template}`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(data)
                });
                
                if (templateResponse.ok) {
                    const html = await templateResponse.text();
                    console.log(`Template response for ${container.id}:`, html.slice(0, 100)); // Отладка
                    if (html.trim()) {
                        element.innerHTML = html;
                        element.classList.remove('loading');
                        // Initialize any special components if needed
                        if (window.initializeSpoilers) {
                            window.initializeSpoilers(element);
                        }
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