/**
 * tracking.js - Lightweight assessment analytics
 * Uses localStorage — no external dependencies, privacy-respecting
 * Access dashboard at: maturity.coach/tracking.html
 */

(function() {
    'use strict';

    var TRACKING_KEY = 'maturity_assessment_tracking';

    function getData() {
        var data = localStorage.getItem(TRACKING_KEY);
        return data ? JSON.parse(data) : {
            teaser: { started: 0, completed: 0, lastUpdated: null },
            full: { started: 0, completed: 0, lastUpdated: null },
            sessions: [] // Optional: store individual session timestamps
        };
    }

    function saveData(data) {
        data.lastUpdated = new Date().toISOString();
        localStorage.setItem(TRACKING_KEY, JSON.stringify(data));
    }

    // ── TRACKING EVENTS ──

    function trackAssessmentStart(type) {
        var data = getData();
        data[type].started += 1;
        data.lastUpdated = new Date().toISOString();
        saveData(data);
        console.log('[Tracking] Assessment start recorded:', type);
    }

    function trackAssessmentComplete(type, score, email) {
        var data = getData();
        data[type].completed += 1;
        data.lastUpdated = new Date().toISOString();
        
        data.sessions.push({
            type: type,
            score: score,
            email: email || null,
            timestamp: new Date().toISOString(),
            date: new Date().toLocaleDateString()
        });
        
        saveData(data);
        console.log('[Tracking] Assessment complete recorded:', type, 'Score:', score, 'Email:', email || '(none)');
    }

    function getMetrics(type) {
        var data = getData();
        var metrics = data[type];
        var rate = metrics.started > 0 
            ? ((metrics.completed / metrics.started) * 100).toFixed(1) 
            : 0;
        return {
            started: metrics.started,
            completed: metrics.completed,
            rate: rate + '%'
        };
    }

    function resetAllData() {
        if (confirm('Are you sure you want to clear all tracking data?')) {
            localStorage.removeItem(TRACKING_KEY);
            console.log('[Tracking] All data cleared');
            location.reload();
        }
    }

    // ── EXPOSE TO WINDOW FOR DEBUGGING/DASHBOARD ──

    window.AssessmentTracking = {
        start: trackAssessmentStart,
        complete: trackAssessmentComplete,
        metrics: getMetrics,
        allData: getData,
        reset: resetAllData
    };

})();