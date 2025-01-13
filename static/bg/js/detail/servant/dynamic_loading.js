document.addEventListener('DOMContentLoaded', function () {
    const servantId = document.body.dataset.servantId;

    // Конфигурация секций для загрузки
    const sections = [
        {
            endpoint: 'base-craft',
            containers: [
                { id: 'base-craft-container', template: 'servant_core/detail/servant_page_craft_detail.html' }
            ]
        },
        {
            endpoint: 'gathering',
            containers: [
                { id: 'gathering-container', template: 'servant_core/detail/servant_page_gathering_detail.html' }
            ]
        },
        {
            endpoint: 'skill-tree',
            containers: [
                { id: 'skill-tree-container', template: 'servant_core/detail/servant_page_skilltree_detail.html' }
            ]
        }
    ];

    // Единая функция загрузки данных
    async function loadSection(section) {
        try {
            // Проверка: загружать только если контейнер существует
            if (
                !section.containers.some(container =>
                    section.shouldLoad ? section.shouldLoad(container.id) :
                    document.getElementById(container.id)
                )
            ) {
                return;
            }

            // Запрос данных и шаблонов
            const dataResponse = await fetch(`/api/servant/${servantId}/${section.endpoint}`);
            if (!dataResponse.ok) {
                // Если данные не найдены, скрываем соответствующие контейнеры
                section.containers.forEach(container => {
                    const element = document.getElementById(container.id);
                    if (element) element.style.display = 'none';
                });
                return; // Завершаем обработку этой секции
            }

            const data = await dataResponse.json();

            // Обработка контейнеров
            await Promise.all(
                section.containers.map(async container => {
                    const element = document.getElementById(container.id);
                    if (!element) return;

                    const templateResponse = await fetch(`/${container.template}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data)
                    });

                    if (templateResponse.ok) {
                        const html = await templateResponse.text();
                        if (html.trim()) {
                            element.innerHTML = html;
                            element.classList.remove('loading');
                            if (window.initializeSpoilers) {
                                window.initializeSpoilers(element);
                            }
                        } else {
                            element.style.display = 'none';
                        }
                    }
                })
            );
        } catch (error) {
            console.warn(`Skipping section ${section.endpoint} due to an error.`); // Мягкое предупреждение
            section.containers.forEach(container => {
                const element = document.getElementById(container.id);
                if (element) element.style.display = 'none';
            });
        }
    }

    // Загружаем все секции параллельно
    Promise.all(sections.map(section => loadSection(section)));
});
