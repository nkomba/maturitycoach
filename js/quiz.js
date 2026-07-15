/* ══════════════════════════════════════════
   QUIZ.JS — Leadership Maturity Self-Assessment
   ══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', function () {

  // ── Elements ──
  const quizStart = document.getElementById('quizStart');
  const quizQuestions = document.getElementById('quizQuestions');
  const quizResults = document.getElementById('quizResults');
  const beginBtn = document.getElementById('quizBeginBtn');
  const retakeBtn = document.getElementById('quizRetake');
  const backBtn = document.getElementById('quizBackBtn');
  const nextBtn = document.getElementById('quizNextBtn');
  const questionText = document.getElementById('quizQuestionText');
  const optionsContainer = document.getElementById('quizOptions');
  const stepIndicator = document.getElementById('quizStepIndicator');
  const progressFill = document.getElementById('quizProgressFill');

  // Exit if quiz elements don't exist
  if (!quizStart || !beginBtn) return;

  // ── Quiz Questions ──
  const questions = [
    {
      text: "When facing a complex organizational challenge, I typically:",
      options: [
        { text: "Rely on instinct and past experience", score: 1 },
        { text: "Gather data and analyze before deciding", score: 2 },
        { text: "Engage stakeholders collaboratively while analyzing", score: 3 },
        { text: "Frame it as a systemic issue and design an intervention", score: 4 }
      ]
    },
    {
      text: "My team's performance metrics are:",
      options: [
        { text: "Rarely reviewed or inconsistently tracked", score: 1 },
        { text: "Tracked but not tied to strategic goals", score: 2 },
        { text: "Aligned to OKRs and reviewed regularly", score: 3 },
        { text: "Embedded in a continuous improvement culture", score: 4 }
      ]
    },
    {
      text: "When I encounter resistance to change, I:",
      options: [
        { text: "Push harder or escalate", score: 1 },
        { text: "Present more data to convince", score: 2 },
        { text: "Listen actively and co-create the path forward", score: 3 },
        { text: "Recognize it as a signal of deeper system dynamics", score: 4 }
      ]
    },
    {
      text: "My approach to governance and compliance is:",
      options: [
        { text: "Reactive — address issues when they arise", score: 1 },
        { text: "Checklist-driven — meet minimum requirements", score: 2 },
        { text: "Integrated into planning from the start", score: 3 },
        { text: "Seen as an enabler of agility, not a constraint", score: 4 }
      ]
    },
    {
      text: "How I develop other leaders on my team:",
      options: [
        { text: "I focus primarily on my own development", score: 1 },
        { text: "I mentor informally when asked", score: 2 },
        { text: "I coach deliberately with structured frameworks", score: 3 },
        { text: "I build a coaching culture across the organization", score: 4 }
      ]
    },
    {
      text: "My relationship with emerging technologies (like AI):",
      options: [
        { text: "Skeptical — prefer proven methods", score: 1 },
        { text: "Aware but delegating to specialists", score: 2 },
        { text: "Strategically exploring use cases", score: 3 },
        { text: "Actively governing adoption with ethical frameworks", score: 4 }
      ]
    }
  ];

  // ── State ──
  let currentQuestion = 0;
  let answers = [];
  let selectedOption = null;

  // ── Score Bands ──
  const scoreBands = [
    {
      min: 6, max: 11,
      label: "Emerging Leader",
      description: "You're building foundational leadership capabilities. Your focus is likely on developing core competencies and establishing consistent practices. This is an exciting stage — the right coaching can accelerate your trajectory significantly.",
      recommendation: "The Executive Clarity program — a focused 3-month engagement to sharpen your leadership foundations, establish your personal development plan, and create momentum."
    },
    {
      min: 12, max: 17,
      label: "Developing Leader",
      description: "You demonstrate solid leadership practices with growing sophistication. You're likely balancing tactical execution with strategic thinking. The next step is deepening your systemic awareness and expanding your influence.",
      recommendation: "The Leadership Accelerator — a 6-month engagement combining 360° feedback, team coaching, and the Governed Agility framework to elevate your leadership posture."
    },
    {
      min: 18, max: 24,
      label: "Mature Leader",
      description: "You operate with high leadership maturity — collaborative, systems-thinking, and purpose-driven. Your challenge now is scaling your impact across teams and embedding these practices organizationally.",
      recommendation: "The Transformation Partnership — a 12-month engagement focused on organizational maturity, executive team coaching, and strategic advisory for sustained transformation."
    }
  ];

  // ── Render Question ──
  function renderQuestion() {
    const q = questions[currentQuestion];
    selectedOption = answers[currentQuestion] !== undefined ? answers[currentQuestion] : null;

    stepIndicator.textContent = 'Question ' + (currentQuestion + 1) + ' of ' + questions.length;
    questionText.textContent = q.text;

    // Update progress bar
    const progress = ((currentQuestion) / questions.length) * 100;
    progressFill.style.width = progress + '%';

    // Clear options
    optionsContainer.innerHTML = '';

    // Render options
    q.options.forEach(function (opt, index) {
      var btn = document.createElement('button');
      btn.className = 'quiz-option';
      if (selectedOption === index) btn.classList.add('selected');

      var radio = document.createElement('span');
      radio.className = 'quiz-option-radio';

      var label = document.createElement('span');
      label.textContent = opt.text;

      btn.appendChild(radio);
      btn.appendChild(label);

      btn.addEventListener('click', function () {
        selectedOption = index;
        // Update visual state
        var allOptions = optionsContainer.querySelectorAll('.quiz-option');
        allOptions.forEach(function (o) { o.classList.remove('selected'); });
        btn.classList.add('selected');
        // Enable next button
        nextBtn.disabled = false;
      });

      optionsContainer.appendChild(btn);
    });

    // Button states
    backBtn.disabled = currentQuestion === 0;
    nextBtn.disabled = selectedOption === null;
    nextBtn.textContent = currentQuestion === questions.length - 1 ? 'See Results →' : 'Next →';

    // Show/hide screens
    quizStart.style.display = 'none';
    quizQuestions.style.display = 'block';
    quizResults.style.display = 'none';
  }

  // ── Calculate Results ──
  function showResults() {
    // Calculate total score
    var total = 0;
    answers.forEach(function (answerIndex, qIndex) {
      total += questions[qIndex].options[answerIndex].score;
    });

    var maxScore = questions.length * 4; // 4 is max per question
    var percentage = Math.round((total / maxScore) * 100);

    // Find score band
    var band = scoreBands.find(function (b) {
      return total >= b.min && total <= b.max;
    });

    if (!band) band = scoreBands[scoreBands.length - 1];

    // Update progress bar to full
    progressFill.style.width = '100%';

    // Populate results
    var scoreNumber = document.getElementById('quizScoreNumber');
    var resultLabel = document.getElementById('quizResultLabel');
    var resultDesc = document.getElementById('quizResultDescription');
    var recText = document.getElementById('quizRecommendationText');

    scoreNumber.textContent = percentage + '%';
    resultLabel.textContent = band.label;
    resultDesc.textContent = band.description;
    recText.textContent = band.recommendation;

    // Animate score ring
    var ring = document.getElementById('quizScoreRing');
    var degrees = (percentage / 100) * 360;
    ring.style.background = 'conic-gradient(var(--gold) ' + degrees + 'deg, rgba(255,255,255,0.10) ' + degrees + 'deg)';

    // Show results screen
    quizQuestions.style.display = 'none';
    quizResults.style.display = 'block';
  }

  // ── Event Listeners ──

  // Begin button
  beginBtn.addEventListener('click', function () {
    currentQuestion = 0;
    answers = [];
    selectedOption = null;
    renderQuestion();
  });

  // Next button
  nextBtn.addEventListener('click', function () {
    if (selectedOption === null) return;

    answers[currentQuestion] = selectedOption;

    if (currentQuestion < questions.length - 1) {
      currentQuestion++;
      renderQuestion();
    } else {
      showResults();
    }
  });

  // Back button
  backBtn.addEventListener('click', function () {
    if (currentQuestion > 0) {
      currentQuestion--;
      renderQuestion();
    }
  });

  // Retake button
  if (retakeBtn) {
    retakeBtn.addEventListener('click', function () {
      currentQuestion = 0;
      answers = [];
      selectedOption = null;
      quizResults.style.display = 'none';
      quizStart.style.display = 'block';
      progressFill.style.width = '0%';
    });
  }

});