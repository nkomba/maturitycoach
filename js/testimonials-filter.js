/**
 * Testimonials Filter Functionality
 * Sophia Coaching | sophiacoaching.org
 * Enables sector-based filtering of testimonial cards
 */

(function() {
  'use strict';
  
  document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const sectorGroups = document.querySelectorAll('.sector-group');
    
    if (filterButtons.length === 0 || sectorGroups.length === 0) {
      // No filtering needed - exit gracefully
      return;
    }
    
    // Initialize: Show all sectors by default
    showAllSectors();
    
    // Attach click handlers to filter buttons
    filterButtons.forEach(button => {
      button.addEventListener('click', function() {
        const selectedSector = this.getAttribute('data-sector');
        
        // Update active state
        filterButtons.forEach(btn => {
          btn.classList.remove('active');
          btn.setAttribute('aria-selected', 'false');
        });
        this.classList.add('active');
        this.setAttribute('aria-selected', 'true');
        
        // Filter content
        if (selectedSector === 'all') {
          showAllSectors();
        } else {
          showSector(selectedSector);
        }
      });
    });
    
    function showAllSectors() {
      sectorGroups.forEach(group => {
        group.style.display = 'block';
        group.setAttribute('data-visible', 'true');
      });
    }
    
    function showSector(sector) {
      sectorGroups.forEach(group => {
        if (group.getAttribute('data-sector') === sector) {
          group.style.display = 'block';
          group.setAttribute('data-visible', 'true');
        } else {
          group.style.display = 'none';
          group.removeAttribute('data-visible');
        }
      });
    }
    
  });
})();