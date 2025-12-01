function updateContentVisibility(filter){
    const allContainers = document.querySelectorAll('.section-container');
    const allTabs = document.querySelectorAll('.filter-tab button');
    
    allContainers.forEach(container => {
        container.classList.add('hidden');
    });
    
    allTabs.forEach(tab => {
        tab.classList.remove('active');
        tab.setAttribute('aria-selected', 'false');
    });
    
    const selectedContainer = document.querySelector(`.section-container[data-filter="${filter}"]`);
    if (selectedContainer){
        selectedContainer.classList.remove("hidden");
        if (filter === "Events" && typeof initEventsMap === 'function') {
            setTimeout(() => {
                initEventsMap();
            }, 0);
        }
    }
    
    setUpPopUpHandlers();
    
    const clickedTab = Array.from(allTabs).find(tab => tab.textContent.trim() === filter);
    if (clickedTab) {
        clickedTab.classList.add('active');
        clickedTab.setAttribute('aria-selected', 'true');
    }
}

function setUpPopUpHandlers(){
    const containers = document.querySelectorAll('.content-container');
    containers.forEach(container => {
        // Make container keyboard accessible
        container.setAttribute('tabindex', '0');
        container.setAttribute('role', 'button');
        container.setAttribute('aria-label', 'View image in full size');
        
        // Store reference to triggering element for focus return
        let triggerElement = null;
        
        const openModal = function(e){
            const img = container.querySelector('img');
            if (!img) return;
            
            // Store the triggering element
            triggerElement = e.currentTarget || container;
            
            // Create unique IDs for ARIA
            const modalId = 'popup-modal-' + Date.now();
            const titleId = 'popup-title-' + Date.now();
            
            // Create backdrop overlay
            const backdrop = document.createElement('div');
            backdrop.className = 'pop-up-backdrop';
            backdrop.setAttribute('aria-hidden', 'true');
            
            const popUp = document.createElement('div');
            popUp.className = 'pop-up';
            popUp.setAttribute('role', 'dialog');
            popUp.setAttribute('aria-modal', 'true');
            popUp.setAttribute('aria-labelledby', titleId);
            popUp.setAttribute('id', modalId);
            popUp.setAttribute('tabindex', '-1');
            
            const itemName = container.querySelector('.item-name')?.textContent || 'Memory';
            
            popUp.innerHTML = `
                <div class="column-1-content">
                    <h1 id="${titleId}">${itemName}</h1>
                </div>
                <div class="column-2-content">
                    <img src="${img.src}" alt="${img.alt}">
                </div>
                <button class="close" aria-label="Close dialog">&times;</button>
            `;
            
            // Prevent body scroll
            document.body.classList.add('no-scroll');
            
            // Append backdrop first, then modal
            document.body.appendChild(backdrop);
            document.body.appendChild(popUp);
            
            // Focus management: move focus to modal
            popUp.focus();
            
            // Trap focus within modal
            const focusableElements = popUp.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            const firstFocusable = focusableElements[0];
            const lastFocusable = focusableElements[focusableElements.length - 1];
            
            // Close button handler
            const closeBtn = popUp.querySelector('.close');
            const closeModal = function() {
                // Add fade out animation
                popUp.style.animation = 'popUpFadeOut 0.2s ease forwards';
                backdrop.style.animation = 'fadeOut 0.2s ease forwards';
                
                setTimeout(() => {
                    popUp.remove();
                    backdrop.remove();
                    document.body.classList.remove('no-scroll');
                    // Return focus to triggering element
                    if (triggerElement) {
                        triggerElement.focus();
                    }
                }, 200);
            };
            
            // Close on backdrop click
            backdrop.onclick = function(e) {
                if (e.target === backdrop) {
                    closeModal();
                    document.removeEventListener('keydown', escapeHandler);
                }
            };
            
            closeBtn.onclick = closeModal;
            closeBtn.onkeydown = function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    closeModal();
                }
            };
            
            // Escape key handler
            const escapeHandler = function(e) {
                if (e.key === 'Escape') {
                    closeModal();
                    document.removeEventListener('keydown', escapeHandler);
                }
            };
            document.addEventListener('keydown', escapeHandler);
            
            // Click outside to close (on pop-up itself, not backdrop)
            popUp.onclick = function(e){
                if (e.target === popUp){
                    closeModal();
                    document.removeEventListener('keydown', escapeHandler);
                }
            };
            
            // Focus trap: when Tab is pressed on last element, go to first
            popUp.addEventListener('keydown', function(e) {
                if (e.key === 'Tab') {
                    if (e.shiftKey) {
                        // Shift + Tab
                        if (document.activeElement === firstFocusable) {
                            e.preventDefault();
                            lastFocusable.focus();
                        }
                    } else {
                        // Tab
                        if (document.activeElement === lastFocusable) {
                            e.preventDefault();
                            firstFocusable.focus();
                        }
                    }
                }
            });
        };
        
        // Click handler
        container.onclick = openModal;
        
        // Keyboard handler (Enter and Space keys)
        container.onkeydown = function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openModal(e);
            }
        };
    });
}

document.addEventListener('DOMContentLoaded', function(){
    const filterTabs = document.querySelectorAll('.filter-tab button');
    filterTabs.forEach(tab => {
        // Click handler
        tab.onclick = function(){
            const filter = this.textContent.trim();
            updateContentVisibility(filter);
        };
        
        // Keyboard handler (Enter and Space keys)
        tab.onkeydown = function(e){
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const filter = this.textContent.trim();
                updateContentVisibility(filter);
            }
        };
    });
    
    const firstTab = document.querySelector('.filter-tab button');
    if (firstTab) {
        updateContentVisibility(firstTab.textContent.trim());
    }
});

