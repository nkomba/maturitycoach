/* ══════════════════════════════════════════
   NAV.JS — Navigation, Scroll Effect, Hamburger
   ══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', function () {

  // ── Elements ──
  const nav = document.getElementById('mainNav');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : [];

  // ── Scroll Effect: Add .scrolled class after 20px ──
  window.addEventListener('scroll', function () {
    if (window.scrollY > 20) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });

  // Trigger on load in case page loads scrolled
  if (window.scrollY > 20) {
    nav.classList.add('scrolled');
  }

  // ── Hamburger Toggle ──
  function toggleMobileMenu() {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('open');
    document.body.classList.toggle('nav-open');
  }

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', toggleMobileMenu);
  }

  // ── Close mobile menu when a link is clicked ──
  mobileLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('open');
      document.body.classList.remove('nav-open');
    });
  });

  // ── Close mobile menu on Escape key ──
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('open')) {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('open');
      document.body.classList.remove('nav-open');
    }
  });

});