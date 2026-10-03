/* Kamuli Hill Infant School — site scripts (no dependencies) */
(function () {
    'use strict';

    // School WhatsApp number in international format (used by the contact form)
    var WHATSAPP_NUMBER = '256758916432';

    document.addEventListener('DOMContentLoaded', function () {
        initHeader();
        initMobileMenu();
        initGallery();
        initReveal();
        initContactForm();
        setYear();
    });

    /* Add a border/shadow to the sticky header once the page scrolls */
    function initHeader() {
        var header = document.querySelector('.site-header');
        if (!header) return;

        var update = function () {
            header.classList.toggle('is-scrolled', window.scrollY > 8);
        };
        update();
        window.addEventListener('scroll', update, { passive: true });
    }

    /* Full-screen mobile menu with proper aria state, Escape key and focus return */
    function initMobileMenu() {
        var openBtn = document.querySelector('[data-menu-open]');
        var closeBtn = document.querySelector('[data-menu-close]');
        var menu = document.getElementById('mobile-menu');
        if (!openBtn || !menu) return;

        function open() {
            menu.classList.add('is-open');
            menu.removeAttribute('inert');
            menu.setAttribute('aria-hidden', 'false');
            openBtn.setAttribute('aria-expanded', 'true');
            document.body.classList.add('menu-open');
            if (closeBtn) closeBtn.focus();
        }

        function close() {
            menu.classList.remove('is-open');
            menu.setAttribute('inert', '');
            menu.setAttribute('aria-hidden', 'true');
            openBtn.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('menu-open');
            openBtn.focus();
        }

        openBtn.addEventListener('click', open);
        if (closeBtn) closeBtn.addEventListener('click', close);

        menu.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                menu.classList.remove('is-open');
                document.body.classList.remove('menu-open');
                openBtn.setAttribute('aria-expanded', 'false');
            });
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && menu.classList.contains('is-open')) close();
        });

        // Close automatically if the window grows to desktop width
        window.matchMedia('(min-width: 1000px)').addEventListener('change', function (e) {
            if (e.matches && menu.classList.contains('is-open')) close();
        });
    }

    /* Gallery filters + lightbox */
    function initGallery() {
        var buttons = document.querySelectorAll('.filter-btn');
        var items = document.querySelectorAll('.gallery-item');

        buttons.forEach(function (button) {
            button.addEventListener('click', function () {
                var filter = button.getAttribute('data-filter');

                buttons.forEach(function (b) {
                    b.setAttribute('aria-pressed', b === button ? 'true' : 'false');
                });

                items.forEach(function (item) {
                    var match = filter === 'all' || item.getAttribute('data-category') === filter;
                    item.hidden = !match;
                });
            });
        });

        var dialog = document.getElementById('lightbox');
        if (!dialog || typeof dialog.showModal !== 'function') return;

        var img = dialog.querySelector('img');
        var caption = dialog.querySelector('[data-lightbox-caption]');
        var count = dialog.querySelector('[data-lightbox-count]');
        var prevBtn = dialog.querySelector('[data-lightbox-prev]');
        var nextBtn = dialog.querySelector('[data-lightbox-next]');
        var triggers = Array.prototype.slice.call(document.querySelectorAll('[data-lightbox]'));
        var current = 0;
        var lastTrigger = null;

        // Show photo number `index` (wraps around at either end)
        function show(index) {
            current = (index + triggers.length) % triggers.length;
            var trigger = triggers[current];
            var thumb = trigger.querySelector('img');
            img.src = thumb.currentSrc || thumb.src;
            img.alt = thumb.alt;
            caption.textContent = trigger.getAttribute('data-caption') || thumb.alt;
            if (count) count.textContent = (current + 1) + ' / ' + triggers.length;
        }

        triggers.forEach(function (trigger, index) {
            trigger.addEventListener('click', function () {
                lastTrigger = trigger;
                show(index);
                dialog.showModal();
            });
        });

        if (prevBtn) prevBtn.addEventListener('click', function () { show(current - 1); });
        if (nextBtn) nextBtn.addEventListener('click', function () { show(current + 1); });

        // Hide the arrows when there is only one photo on the page
        if (triggers.length < 2) {
            [prevBtn, nextBtn].forEach(function (b) { if (b) b.hidden = true; });
        }

        dialog.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowLeft') { e.preventDefault(); show(current - 1); }
            if (e.key === 'ArrowRight') { e.preventDefault(); show(current + 1); }
        });

        // Swipe left/right on phones
        var touchX = null;
        dialog.addEventListener('touchstart', function (e) {
            touchX = e.changedTouches[0].clientX;
        }, { passive: true });
        dialog.addEventListener('touchend', function (e) {
            if (touchX === null) return;
            var dx = e.changedTouches[0].clientX - touchX;
            if (Math.abs(dx) > 50) show(dx < 0 ? current + 1 : current - 1);
            touchX = null;
        }, { passive: true });

        dialog.querySelector('[data-lightbox-close]').addEventListener('click', function () {
            dialog.close();
        });

        // Click on the backdrop closes the dialog
        dialog.addEventListener('click', function (e) {
            if (e.target === dialog) dialog.close();
        });

        // Return focus to the photo that was opened
        dialog.addEventListener('close', function () {
            if (lastTrigger) lastTrigger.focus();
        });
    }

    /* Gentle fade-in for sections as they enter the viewport */
    function initReveal() {
        var els = document.querySelectorAll('.reveal');
        if (!('IntersectionObserver' in window)) {
            els.forEach(function (el) { el.classList.add('is-visible'); });
            return;
        }

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

        els.forEach(function (el) { observer.observe(el); });
    }

    /* The site has no server-side mail handler, so the enquiry form
       opens WhatsApp with the parent's details pre-filled. */
    function initContactForm() {
        var form = document.getElementById('enquiry-form');
        if (!form) return;

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            if (!form.reportValidity()) return;

            var data = new FormData(form);
            var lines = [
                'Hello Kamuli Hill Infant School,',
                '',
                'Parent name: ' + data.get('parent_name'),
                'Phone: ' + data.get('phone'),
                'Class of interest: ' + data.get('child_class')
            ];
            var message = (data.get('message') || '').toString().trim();
            if (message) lines.push('', message);

            var url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(lines.join('\n'));
            window.open(url, '_blank', 'noopener');
        });
    }

    function setYear() {
        document.querySelectorAll('[data-year]').forEach(function (el) {
            el.textContent = new Date().getFullYear();
        });
    }
})();
