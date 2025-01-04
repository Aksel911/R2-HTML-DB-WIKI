// Theme toggle functionality
const toggleButton = document.getElementById('theme-toggle');

// Adding sound effect on click
const soundEffect = new Audio('https://github.com/Aksel911/R2-Textures/raw/refs/heads/main/%5BFIX%5D%20FIXES/%5BFIX%5D%20%D0%A1%D1%82%D0%B0%D1%80%D1%8B%D0%B9%20%D1%8D%D1%84%D1%84%D0%B5%D0%BA%D1%82%20%D0%B7%D0%B0%D1%82%D0%BE%D1%87%D0%BA%D0%B8/sound/gui_click.wav');

toggleButton.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark-theme');
    document.body.classList.toggle('dark-theme');
    localStorage.setItem(
        'theme',
        document.documentElement.classList.contains('dark-theme') ? 'dark' : 'light'
    );

    // Play sound effect
    soundEffect.play();

    // Toggle bounce effect for fun
    toggleButton.classList.toggle('bouncing');
    setTimeout(() => toggleButton.classList.remove('bouncing'), 1000);
});

// Restore theme on page load
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark-theme');
    document.body.classList.add('dark-theme');
}

// Image Zoom Functionality
function initializeImageZoom() {
    $('.monster-image, .skill-image').each(function() {
        var $img = $(this);
        $img.off('mouseenter mouseleave');

        $img.hover(
            function() {
                $(this).css({
                    'transform': 'scale(2)',
                    'z-index': '1000',
                    'transition': 'transform 0.3s ease'
                });
            },
            function() {
                $(this).css({
                    'transform': 'scale(1)',
                    'z-index': '1',
                    'transition': 'transform 0.3s ease'
                });
            }
        );
    });
}

// DataTables Initialization
$(document).ready(function() {
    const tableId = $('#skill-table').length ? '#skill-table' : '#items-table';
    const itemType = tableId === '#skill-table' ? 'скилы' : 'монстры';
    
    window.table = $(tableId).DataTable({
        "paging": true,
        "lengthChange": true,
        "searching": true,
        "ordering": true,
        "info": true,
        "autoWidth": false,
        "pageLength": 25,
        "deferRender": true,
        "order": [[ 0, "asc" ]],
        "columnDefs": [{
            "targets": 0,
            "orderable": true,
            "type": "num",
            "render": function(data, type, row) {
                if (type === 'sort') {
                    const selector = tableId === '#skill-table' ? '.skill-wrapper' : '.hover-text-wrapper';
                    var sortId = $(data).find(selector).data('sort-id');
                    return sortId || 0;
                }
                return data;
            }
        }],
        "dom": '<"top"lf>rt<"bottom"ip>',
        "processing": true,
        "language": {
            "processing": '<div class="loading-spinner"></div>',
            "search": "_INPUT_",
            "searchPlaceholder": "Быстрый фильтр...",
            "lengthMenu": `Показать _MENU_ ${itemType}`,
            "info": `${itemType} с _START_ по _END_ из _TOTAL_`,
            "infoEmpty": `Нет ${itemType}`,
            "zeroRecords": `${itemType} не найдены`,
            "paginate": {
                "first": "Первая",
                "last": "Последняя",
                "next": "Следующая",
                "previous": "Предыдущая"
            }
        },
        "drawCallback": function(settings) {
            initializeImageZoom();
            $(`${tableId} tbody tr`).each(function(index) {
                $(this).css('animation-delay', (index * 0.05) + 's');
            });
        },
        "initComplete": function(settings, json) {
            $('.dataTables_filter').hide();
            initializeKeyboardNavigation();
            cacheMonsterData();
        }
    });
});

// Search Functionality
$(document).ready(function() {
    var searchTimeout;

    $('#search-input').on('input', function() {
        var $input = $(this);
        var searchText = $input.val().trim();

        clearTimeout(searchTimeout);
        $('.loading-spinner').fadeIn();

        searchTimeout = setTimeout(function() {
            window.table.search(searchText).draw();
            updateSearchSuggestions(searchText);
            $('.loading-spinner').fadeOut();
        }, 300);
    });

    function updateSearchSuggestions(searchText) {
        var $results = $('#search-results');
        $results.empty();

        if (searchText.length < 2) {
            $results.hide();
            return;
        }

        var matches = window.monsterCache
            .filter(function(monster) {
                return monster.name.toLowerCase().includes(searchText.toLowerCase());
            })
            .slice(0, 5);

        if (matches.length > 0) {
            matches.forEach(function(match) {
                var baseUrl = $('#skill-table').length ? '/skill/' : '/monster/';
                var $link = $('<a>')
                    .addClass('dropdown-item')
                    .attr('href', baseUrl + match.id)
                    .text(match.name)
                    .click(function(e) {
                        e.preventDefault();
                        $('#search-input').val(match.name);
                        window.table.search(match.name).draw();
                        $results.hide();
                    });
                $results.append($link);
            });
            $results.show();
        } else {
            $results.hide();
        }
    }

    $(document).click(function(e) {
        if (!$(e.target).closest('.search-container').length) {
            $('#search-results').hide();
        }
    });
});

// Data Caching
function cacheMonsterData() {
    window.monsterCache = [];
    const tableId = $('#skill-table').length ? '#skill-table' : '#items-table';
    $(`${tableId} tbody tr`).each(function() {
        var $row = $(this);
        var $nameCell = $row.find('td:eq(1) a');
        window.monsterCache.push({
            id: $nameCell.attr('href').split('/').pop(),
            name: $nameCell.text(),
            class: $row.find('td:eq(2)').text(),
            element: $row
        });
    });
}

// Keyboard Navigation
function initializeKeyboardNavigation() {
    $(document).keydown(function(e) {
        if (e.ctrlKey && e.keyCode === 70) {
            e.preventDefault();
            $('#search-input').focus();
        }

        if (e.keyCode === 27) {
            $('#search-input').val('').trigger('input');
            $('#search-results').hide();
        }

        if (!$('#search-input').is(':focus')) {
            if (e.keyCode === 37) {
                window.table.page('previous').draw('page');
            } else if (e.keyCode === 39) {
                window.table.page('next').draw('page');
            }
        }
    });
}

// Export Functionality
$(document).ready(function() {
    $('#export-csv').click(function() {
        $('.loading-spinner').fadeIn();

        setTimeout(function() {
            var csvContent = "data:text/csv;charset=utf-8,\uFEFF";
            const tableId = $('#skill-table').length ? '#skill-table' : '#items-table';

            var headers = [];
            $(`${tableId} thead th`).each(function() {
                headers.push('"' + $(this).text() + '"');
            });
            csvContent += headers.join(",") + "\n";

            $(`${tableId} tbody tr`).each(function() {
                var row = [];
                $(this).find('td').each(function(index) {
                    if (index === 0) {
                        row.push('""');
                    } else {
                        row.push('"' + $(this).text() + '"');
                    }
                });
                csvContent += row.join(",") + "\n";
            });

            var encodedUri = encodeURI(csvContent);
            var link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "export_" + new Date().toISOString().slice(0,10) + ".csv");
            document.body.appendChild(link);

            link.click();
            document.body.removeChild(link);
            $('.loading-spinner').fadeOut();
        }, 100);
    });
});

// Dropdown Menu
$(document).ready(function() {
    let timeout;
    const DELAY = 300;

    $('.nav-item.dropdown').hover(
        function() {
            clearTimeout(timeout);
            const $dropdown = $(this);
            $('.nav-item.dropdown').not($dropdown).find('.dropdown-menu').hide();
            $dropdown.find('.dropdown-menu').show();
        },
        function() {
            const $dropdown = $(this);
            timeout = setTimeout(function() {
                if (!$dropdown.find('.dropdown-menu:hover').length) {
                    $dropdown.find('.dropdown-menu').hide();
                }
            }, DELAY);
        }
    );

    $('.dropdown-menu').hover(
        function() {
            clearTimeout(timeout);
        },
        function() {
            const $menu = $(this);
            timeout = setTimeout(function() {
                $menu.hide();
            }, DELAY);
        }
    );

    $('.dropdown-item').click(function(e) {
        const href = $(this).attr('href');
        if (href) {
            window.location.href = href;
        }
    });
});


// Tooltip Initialization
$(document).ready(function() {
    $('[data-toggle="tooltip"]').tooltip();
});

// Spoiler Configuration
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.skill-section').forEach(section => {
        const title = section.querySelector('.section-title');
        const content = section.querySelector('.skill-content');
        
        if (title && content) {
            // Create wrapper for content
            const contentWrapper = document.createElement('div');
            contentWrapper.className = 'skill-content-wrapper';
            content.parentNode.insertBefore(contentWrapper, content);
            contentWrapper.appendChild(content);
            
            // Create header structure
            const header = document.createElement('div');
            header.className = 'skill-header';
            
            const titleWrapper = document.createElement('div');
            titleWrapper.className = 'skill-title-wrapper';
            
            const toggle = document.createElement('div');
            toggle.className = 'skill-toggle';
            
            // Move the title into the new structure
            title.parentNode.removeChild(title);
            titleWrapper.appendChild(title);
            header.appendChild(titleWrapper);
            header.appendChild(toggle);
            
            // Insert the header before the content wrapper
            contentWrapper.parentNode.insertBefore(header, contentWrapper);
            
            // Set initial height
            contentWrapper.style.height = content.offsetHeight + 'px';
            
            // Add click handler
            header.addEventListener('click', function() {
                const isCollapsed = section.classList.contains('collapsed');
                
                if (isCollapsed) {
                    contentWrapper.style.height = content.offsetHeight + 'px';
                    section.classList.remove('collapsed');
                } else {
                    contentWrapper.style.height = content.offsetHeight + 'px';
                    contentWrapper.offsetHeight; // Force reflow
                    section.classList.add('collapsed');
                }
            });
            
            // Add resize observer to handle content changes
            const resizeObserver = new ResizeObserver(entries => {
                if (!section.classList.contains('collapsed')) {
                    contentWrapper.style.height = content.offsetHeight + 'px';
                }
            });
            
            resizeObserver.observe(content);
        }
    });
});








