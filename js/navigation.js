/**
 * navigation.js
 * Handles navigation menu functionality:
 *   - Hamburger menu toggle (mobile)
 *   - Header background on scroll
 *
 * Should be loaded early enough for DOM elements to exist on page load.
 */

(function () {
    'use strict';

    // -------------------------------------------------------
    // DOM REFERENCES
    // -------------------------------------------------------
    const dom = {
        header: null,
        hamburger: null,
        navMenu: null
    };

    // -------------------------------------------------------
    // INIT
    // -------------------------------------------------------
    document.addEventListener('DOMContentLoaded', function () {
        cacheDom();
        bindEvents();
        setupScrollBehavior();
    });

    function cacheDom() {
        dom.header = document.getElementById('siteHeader');
        dom.hamburger = document.getElementById('hamburgerBtn');
        dom.navMenu = document.getElementById('navMenu');
    }

    function bindEvents() {
        if (dom.hamburger && dom.navMenu) {
            dom.hamburger.addEventListener('click', toggleMenu);
        }
    }

    // -------------------------------------------------------
    // HAMBURGER MENU TOGGLE
    // -------------------------------------------------------
    function toggleMenu() {
        if (!dom.hamburger || !dom.navMenu) return;

        const isExpanded = dom.hamburger.getAttribute('aria-expanded') === 'true';
        const newState = !isExpanded;

        dom.hamburger.setAttribute('aria-expanded', String(newState));
        dom.navMenu.classList.toggle('nav-open', newState);

        // Close menu when clicking outside
        if (newState) {
            document.addEventListener('click', handleOutsideClick);
        } else {
            document.removeEventListener('click', handleOutsideClick);
        }
    }

    function handleOutsideClick(event) {
        if (!dom.hamburger || !dom.navMenu) return;

        const clickedInside = dom.hamburger.contains(event.target) ||
                              dom.navMenu.contains(event.target);

        if (!clickedInside && dom.navMenu.classList.contains('nav-open')) {
            dom.hamburger.setAttribute('aria-expanded', 'false');
            dom.navMenu.classList.remove('nav-open');
            document.removeEventListener('click', handleOutsideClick);
        }
    }

    // -------------------------------------------------------
    // HEADER SCROLL BEHAVIOR
    // Changes background on scroll (for sticky header effect)
    // -------------------------------------------------------
    function setupScrollBehavior() {
        if (!dom.header) return;

        let ticking = false;

        function onScroll() {
            if (!ticking) {
                window.requestAnimationFrame(function () {
                    handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        }

        function handleScroll() {
            const scrolled = window.scrollY > 50;

            if (scrolled) {
                dom.header.classList.add('header-scrolled');
            } else {
                dom.header.classList.remove('header-scrolled');
            }
        }

        window.addEventListener('scroll', onScroll, { passive: true });
        handleScroll(); // Initial check on page load
    }

    // -------------------------------------------------------
    // ACTIVE NAV LINK HIGHLIGHTING
    // Highlights current page link in nav
    // -------------------------------------------------------
    function highlightActiveLink() {
        if (!dom.navMenu) return;

        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const links = dom.navMenu.querySelectorAll('.nav-link');

        links.forEach(function (link) {
            const href = link.getAttribute('href');
            if (href === currentPage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // Run after DOM ready
    document.addEventListener('DOMContentLoaded', highlightActiveLink);

})();