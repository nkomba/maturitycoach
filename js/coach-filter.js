/* ══════════════════════════════════════════
   COACH-FILTER.JS — Team page filtering
   Loads coaches.json, renders cards, handles
   specialty filtering
   ══════════════════════════════════════════ */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    console.log('[Coach Filter] Starting...');

    var state = {
      coaches: [],
      activeSpecialty: 'all'
    };

    var resultsContainer = document.getElementById('coachResults');
    var matchCount = document.getElementById('matchCount');
    var noMatch = document.getElementById('noMatch');

    if (!resultsContainer) {
      console.log('[Coach Filter] No #coachResults element — skipping.');
      return;
    }

    // ── Load coach data ──
    fetch('data/coaches.json')
      .then(function (res) { return res.json(); })
      .then(function (data) {
        state.coaches = data.coaches;
        renderCoaches();
      })
      .catch(function (err) {
        console.error('[Coach Filter] Failed to load coaches.json:', err);
        resultsContainer.innerHTML = '<p style="text-align:center; color:var(--text-muted);">Unable to load coaches. Please refresh.</p>';
      });

    // ── Filter chips ──
    var chips = document.querySelectorAll('.filter-chip');
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        chips.forEach(function (c) { c.classList.remove('active'); });
        chip.classList.add('active');
        state.activeSpecialty = chip.dataset.specialty;
        renderCoaches();
      });
    });

    // ── Render ──
    function renderCoaches() {
      var filtered = state.activeSpecialty === 'all'
        ? state.coaches
        : state.coaches.filter(function (c) {
            return c.specializations.indexOf(state.activeSpecialty) !== -1;
          });

      if (matchCount) matchCount.textContent = filtered.length;
      if (noMatch) noMatch.style.display = filtered.length === 0 ? 'block' : 'none';
      resultsContainer.innerHTML = '';

      filtered.forEach(function (coach, index) {
        var card = document.createElement('article');
        card.className = 'coach-card fade-up' + (coach.featured ? ' featured' : '');

        var availClass = 'availability-' + coach.availability;
        var specTags = coach.specializations.map(formatSpec).map(function (s) {
          return '<span class="spec-tag">' + s + '</span>';
        }).join('');

        card.innerHTML =
          '<div class="card-availability ' + availClass + '">' + coach.availability + '</div>' +
          '<div class="coach-image"><img src="' + coach.photo + '" alt="' + coach.name + '" loading="lazy" /></div>' +
          '<div class="coach-body">' +
            '<h3 class="coach-name">' + coach.name + '</h3>' +
            '<div class="coach-role">' + coach.title + '</div>' +
            '<div class="coach-credentials">' + coach.credentials + '</div>' +
            '<p class="coach-bio">' + coach.shortBio + '</p>' +
            '<div class="spec-tags">' + specTags + '</div>' +
            '<a href="' + coach.profilePage + '" class="btn btn-outline">View Full Profile</a>' +
          '</div>';

        resultsContainer.appendChild(card);
      });

      // Re-run fade-in observer for new cards
      if (window.IntersectionObserver) {
        var obs = new IntersectionObserver(function (entries) {
          entries.forEach(function (e) {
            if (e.isIntersecting) {
              e.target.classList.add('visible');
              obs.unobserve(e.target);
            }
          });
        }, { threshold: 0.12 });
        resultsContainer.querySelectorAll('.fade-up').forEach(function (el) { obs.observe(el); });
      }

      console.log('[Coach Filter] Rendered ' + filtered.length + ' coaches');
    }

    function formatSpec(key) {
      var map = {
        'executive-mastery': 'Executive Mastery',
        'ai-era-leadership': 'AI-Era Leadership',
        'systems-psychodynamics': 'Systems Psychodynamics',
        'agile-transformation': 'Agile Transformation',
        'devsecops': 'DevSecOps',
        'organizational-culture': 'Organizational Culture',
        'leadership-transformation': 'Leadership Transformation',
        'team-coaching': 'Team Coaching',
        'governance-compliance': 'Governance & Compliance'
      };
      return map[key] || key;
    }

    console.log('[Coach Filter] Ready');
  });
})();