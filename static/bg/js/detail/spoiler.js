// Функциональность спойлеров
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
