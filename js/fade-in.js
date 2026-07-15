/* ══════════════════════════════════════════
   FADE-IN.JS — Intersection Observer Animations
   ══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', function () {

  const fadeElements = document.querySelectorAll('.fade-up');

  if (!fadeElements.length) return;

  // ── Fallback: If Intersection Observer not supported ──
  if (!('IntersectionObserver' in window)) {
    fadeElements.forEach(function (el) {
      el.classList.add('visible');
    });
    return;
  }

  // ── Observer Configuration ──
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Animate once
      }
    });
  }, observerOptions);

  // ── Observe each fade-up element ──
  fadeElements.forEach(function (el) {
    observer.observe(el);
  });

});