// Interactive US Map JavaScript - Button-based city markers
document.addEventListener('DOMContentLoaded', function() {
    // Get all city marker buttons
    const cityButtons = document.querySelectorAll('.city-marker-btn');
    
    // Add click handlers for city marker buttons
    cityButtons.forEach(button => {
        const link = button.getAttribute('data-link');
        const name = button.getAttribute('data-name');
        
        // Click to navigate
        button.addEventListener('click', function() {
            if (link) {
                window.location.href = link;
            }
        });
        
        // Optional: Add title attribute for tooltip on hover
        if (name) {
            button.setAttribute('title', name);
        }
    });
});

