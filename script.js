// Sticky Navbar Logic
window.addEventListener('scroll', function () {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 10) {
        navbar.classList.add('glass-nav');
        navbar.classList.add('shadow-soft');
    } else {
        navbar.classList.remove('glass-nav');
        navbar.classList.remove('shadow-soft');
    }
});

// Mobile Menu Logic (Full Screen Overlay)
document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('mobile-menu-btn');
    const closeBtn = document.getElementById('close-menu-btn');
    const menu = document.getElementById('mobile-menu');

    function toggleMenu() {
        if (!menu) return;
        menu.classList.toggle('hidden');
        menu.classList.toggle('flex'); // Switch to flex when visible
        document.body.classList.toggle('overflow-hidden'); // Lock scroll
    }

    if (btn) btn.addEventListener('click', toggleMenu);
    if (closeBtn) closeBtn.addEventListener('click', toggleMenu);

    // Close menu when a link is clicked
    if (menu) {
        const links = menu.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', toggleMenu);
        });
    }

    // Gallery Tabs Logic
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                filterButtons.forEach(btn => {
                    // Reset to default white state
                    btn.classList.remove('bg-primary', 'text-white', 'shadow-lg', 'shadow-primary/30', 'scale-105', 'border-transparent');
                    btn.classList.add('bg-white', 'text-dark', 'border-2', 'border-gray-200');
                });

                // Add active class to clicked button
                // Force remove the default classes first
                button.classList.remove('bg-white', 'text-dark', 'border-2', 'border-gray-200');
                // Add the active primary classes
                button.classList.add('bg-primary', 'text-white', 'shadow-lg', 'shadow-primary/30', 'scale-105', 'border-transparent');

                const filter = button.getAttribute('data-filter');

                // Filter items
                galleryItems.forEach(item => {
                    const category = item.getAttribute('data-category');
                    if (filter === 'all' || category === filter) {
                        item.classList.remove('hidden');
                        item.style.animation = 'none';
                        item.offsetHeight; /* trigger reflow */
                        item.style.animation = null;
                        item.classList.add('animate-fade-in-up');
                    } else {
                        item.classList.add('hidden');
                        item.classList.remove('animate-fade-in-up');
                    }
                });
            });
        });
    }
});

// Animation on Scroll
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

console.log('Kamuli Hill Scripts Loaded');
