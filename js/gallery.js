function updateContentVisibility(filter){
    const allContainers = document.querySelectorAll('.section-container');
    const allTabs = document.querySelectorAll('.filter-tab p');
    
    allContainers.forEach(container => {
        container.classList.add('hidden');
    });
    
    allTabs.forEach(tab => {
        tab.classList.remove('active');
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
    }
}

function setUpPopUpHandlers(){
    const containers = document.querySelectorAll('.content-container');
    containers.forEach(container => {
        container.onclick = function(){
            const img = container.querySelector('img');
            if (!img) return;
            
            const popUp = document.createElement('div');
            popUp.className = 'pop-up';
            popUp.innerHTML = `
                <div class="column-1-content">
                    <h1>${container.querySelector('.item-name')?.textContent || 'Memory'}</h1>
                </div>
                <div class="column-2-content">
                    <img src="${img.src}" alt="${img.alt}">
                </div>
                <div class="column-3-content">
                    <h2>${container.querySelector('.location-name')?.textContent || 'Location'}</h2>
                </div>
                <div class="close">&times;</div>
            `;
            
            document.body.appendChild(popUp);
            
            const closeBtn = popUp.querySelector('.close');
            closeBtn.onclick = function(){
                popUp.remove();
            };
            
            popUp.onclick = function(e){
                if (e.target === popUp){
                    popUp.remove();
                }
            };
        };
    });
}

document.addEventListener('DOMContentLoaded', function(){
    const filterTabs = document.querySelectorAll('.filter-tab p');
    filterTabs.forEach(tab => {
        tab.onclick = function(){
            const filter = this.textContent.trim();
            updateContentVisibility(filter);
        };
    });
    
    const firstTab = document.querySelector('.filter-tab p');
    if (firstTab) {
        updateContentVisibility(firstTab.textContent.trim());
    }
});

