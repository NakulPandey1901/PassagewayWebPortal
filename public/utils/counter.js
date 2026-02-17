// Counter Animation for Homepage Statistics
function animateCounters() {
    const counters = document.querySelectorAll('.counter');
    const speed = 200; // Animation speed (lower = faster)

    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const increment = target / speed;

        const updateCount = () => {
            const count = +counter.innerText;

            if (count < target) {
                counter.innerText = Math.ceil(count + increment);
                setTimeout(updateCount, 10);
            } else {
                counter.innerText = target;
            }
        };

        updateCount();
    });
}

// Run counter animation when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Check if counters exist on the page
    if (document.querySelectorAll('.counter').length > 0) {
        animateCounters();
    }
});
