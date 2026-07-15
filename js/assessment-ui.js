(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {
        console.log('[Assessment] Starting...');

        if (typeof ASSESSMENT_DATA === 'undefined') {
            console.error('[Assessment] ERROR: ASSESSMENT_DATA not loaded!');
            var startEl = document.getElementById('quizStartScreen');
            if (startEl) startEl.innerHTML = '<p style="color:#c64949; text-align:center;">Error: Assessment data not loaded. Please refresh.</p>';
            return;
        }

        const questions = ASSESSMENT_DATA.questions;
        let currentIndex = 0;
        const answers = {};
        let finalScore = 0;

        const els = {
            start: document.getElementById('quizStartScreen'),
            interface: document.getElementById('quizInterface'),
            emailGate: document.getElementById('emailGate'),
            results: document.getElementById('resultsScreen'),
            body: document.getElementById('quizBody'),
            begin: document.getElementById('beginAssessmentBtn'),
            prev: document.getElementById('prevBtn'),
            next: document.getElementById('nextBtn'),
            submit: document.getElementById('submitBtn'),
            progress: document.getElementById('progressFill'),
            step: document.getElementById('stepIndicator'),
            revealBtn: document.getElementById('revealResultsBtn'),
            userEmail: document.getElementById('userEmail'),
            emailError: document.getElementById('emailError')
        };

        if (!els.body) {
            console.error('[Assessment] CRITICAL: quizBody element missing!');
            return;
        }

        // Bind events
        if (els.begin) {
            els.begin.addEventListener('click', function(e) {
                if (e) e.preventDefault();
                beginQuiz();
            });
        }
        if (els.prev) els.prev.addEventListener('click', goPrev);
        if (els.next) els.next.addEventListener('click', goNext);
        if (els.submit) els.submit.addEventListener('click', submitQuiz);
        if (els.revealBtn) els.revealBtn.addEventListener('click', revealResults);

        // Allow Enter key on email field
        if (els.userEmail) {
            els.userEmail.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    revealResults();
                }
            });
        }

        function beginQuiz() {
            if (window.AssessmentTracking) {
                AssessmentTracking.start('full');
            }
            if (els.start) els.start.style.display = 'none';
            if (els.interface) els.interface.style.display = 'block';
            renderQuestion();
            updateProgress();
        }

        function renderQuestion() {
            const q = questions[currentIndex];
            els.body.innerHTML = '';

            const card = document.createElement('div');
            card.className = 'quiz-start-screen';

            const dim = document.createElement('span');
            dim.className = 'question-dimension';
            dim.textContent = q.dimension;
            card.appendChild(dim);

            const title = document.createElement('h2');
            title.className = 'quiz-question';
            title.textContent = q.text;
            card.appendChild(title);

            const opts = document.createElement('div');
            opts.className = 'quiz-options';

            q.options.forEach(opt => {
                const optDiv = document.createElement('div');
                optDiv.className = 'quiz-option';
                if (answers[q.id] === opt.value) optDiv.classList.add('selected');

                optDiv.innerHTML = '<span class="quiz-option-radio"></span><span>' + opt.text + '</span>';

                optDiv.addEventListener('click', function() {
                    answers[q.id] = opt.value;
                    renderQuestion();
                });

                opts.appendChild(optDiv);
            });

            card.appendChild(opts);
            els.body.appendChild(card);

            if (els.prev) els.prev.disabled = currentIndex === 0;
            if (els.next) els.next.style.display = currentIndex === questions.length - 1 ? 'none' : 'inline-block';
            if (els.submit) els.submit.style.display = currentIndex === questions.length - 1 ? 'inline-block' : 'none';
        }

        function updateProgress() {
            const pct = ((currentIndex + 1) / questions.length) * 100;
            if (els.progress) els.progress.style.width = pct + '%';
            if (els.step) els.step.textContent = 'Question ' + (currentIndex + 1) + ' of ' + questions.length;
        }

        function goNext() {
            if (!answers[questions[currentIndex].id]) {
                alert('Please select an answer first');
                return;
            }
            if (currentIndex < questions.length - 1) {
                currentIndex++;
                renderQuestion();
                updateProgress();
            }
        }

        function goPrev() {
            if (currentIndex > 0) {
                currentIndex--;
                renderQuestion();
                updateProgress();
            }
        }

        function submitQuiz() {
            const unanswered = questions.filter(q => answers[q.id] === undefined);
            if (unanswered.length > 0) {
                alert('Please answer all questions first');
                return;
            }

            // Calculate score
            let score = 0;
            questions.forEach(q => score += answers[q.id] || 0);
            finalScore = score;

            // Show email gate (NOT results yet)
            if (els.interface) els.interface.style.display = 'none';
            if (els.emailGate) els.emailGate.style.display = 'block';

            // Scroll to email gate
            if (els.emailGate) {
                els.emailGate.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }

            // Focus the email field
            if (els.userEmail) {
                setTimeout(function() {
                    els.userEmail.focus();
                }, 600);
            }
        }

        function validateEmail(email) {
            var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        }

        function revealResults() {
            var email = els.userEmail ? els.userEmail.value.trim() : '';

            if (!validateEmail(email)) {
                if (els.emailError) els.emailError.style.display = 'block';
                if (els.userEmail) {
                    els.userEmail.style.borderColor = '#c64949';
                    setTimeout(function() {
                        els.userEmail.style.borderColor = '';
                    }, 2000);
                }
                return;
            }

            // Hide error if showing
            if (els.emailError) els.emailError.style.display = 'none';

            // Store email in tracking
            if (window.AssessmentTracking) {
                AssessmentTracking.complete('full', finalScore, email);
            }

            // Also store email separately for easy export
            var leads = JSON.parse(localStorage.getItem('maturity_leads') || '[]');
            leads.push({
                email: email,
                type: 'full',
                score: finalScore,
                date: new Date().toISOString()
            });
            localStorage.setItem('maturity_leads', JSON.stringify(leads));

            // Hide email gate, show results
            if (els.emailGate) els.emailGate.style.display = 'none';
            if (els.results) els.results.style.display = 'block';

            if (els.results) {
                els.results.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }

            renderResults(finalScore);
        }

        function renderResults(score) {
            const bands = ASSESSMENT_DATA.meta.scoreBands;
            const band = bands.find(b => score >= b.min && score <= b.max) || bands[0];

            if (document.getElementById('overallScore')) document.getElementById('overallScore').textContent = score + '/60';
            if (document.getElementById('scoreBandLabel')) document.getElementById('scoreBandLabel').textContent = band.band;
            if (document.getElementById('scoreBandSummary')) document.getElementById('scoreBandSummary').textContent = band.summary;
            if (document.getElementById('recommendationText')) document.getElementById('recommendationText').textContent = band.recommendation;

            const breakdown = document.getElementById('dimensionBreakdown');
            if (breakdown) {
                breakdown.innerHTML = '<div class="breakdown-title">Dimension Breakdown</div>';
                questions.forEach(q => {
                    const s = answers[q.id] || 0;
                    const pct = (s / 4) * 100;
                    const label = ['Emerging','Developing','Practicing','Mastery'][s - 1] || 'Emerging';
                    breakdown.innerHTML +=
                        '<div class="dimension-row">' +
                            '<div class="dimension-info">' +
                                '<span class="dimension-name">' + q.dimension + '</span>' +
                                '<span class="dimension-label">' + label + '</span>' +
                            '</div>' +
                            '<div class="dimension-bar">' +
                                '<div class="dimension-bar-track">' +
                                    '<div class="dimension-bar-fill" style="width:' + pct + '%"></div>' +
                                '</div>' +
                                '<span class="dimension-score">' + s + '/4</span>' +
                            '</div>' +
                        '</div>';
                });
            }
        }

        console.log('[Assessment UI] Ready');
    });
})();