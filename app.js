/* ============================================================
   Wiom PayG Prototype — App Logic
   Flow: Blocker Intro → Video → Quiz → Success

   Uses a `flowType` variable set by the HTML page:
     "partner" → uses partner config
     "rohit"   → uses rohit config
   ============================================================ */

// flowType is set by the HTML page before this script loads
var FLOW = window.flowType || 'partner';
var STORAGE_KEY = FLOW === 'rohit' ? 'wiom_rohit_config' : 'wiom_partner_config';
var PASSED_KEY = FLOW === 'rohit' ? 'wiom_rohit_passed' : 'wiom_partner_passed';

// === Load config (admin overrides from localStorage, or defaults) ===
var activeConfig = null;
try {
  var raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    var parsed = JSON.parse(raw);
    if (parsed && parsed.intro && Array.isArray(parsed.quiz) && parsed.quiz.length > 0 && parsed.success) {
      activeConfig = parsed;
    }
  }
} catch (e) { /* ignore */ }

// Fallback to defaults
if (!activeConfig) {
  activeConfig = FLOW === 'rohit'
    ? JSON.parse(JSON.stringify(defaultRohitConfig))
    : JSON.parse(JSON.stringify(defaultPartnerConfig));
}

var activeQuizData = activeConfig.quiz;

// === Apply config to DOM ===
document.getElementById('intro-title').innerHTML = activeConfig.intro.title;
document.getElementById('intro-body').innerHTML = activeConfig.intro.body;
document.getElementById('btn-start').textContent = activeConfig.intro.cta;

document.getElementById('video-title').textContent = activeConfig.video.title || 'वीडियो देखें';

document.getElementById('success-title').innerHTML = activeConfig.success.title;
document.getElementById('success-subtitle').innerHTML = activeConfig.success.subtitle;
document.getElementById('success-payout').innerHTML = activeConfig.success.payout;
document.getElementById('success-note').innerHTML = activeConfig.success.note;
document.getElementById('btn-close-modal').textContent = activeConfig.success.cta;

// === Video setup ===
var videoUrl = activeConfig.video.url || '';
var videoWrapper = document.getElementById('video-wrapper');
var videoPlaceholder = document.getElementById('video-placeholder');

if (videoUrl) {
  videoWrapper.style.display = 'block';
  videoPlaceholder.style.display = 'none';
  var videoEl = document.getElementById('video-player');
  videoEl.src = videoUrl;
} else {
  videoWrapper.style.display = 'none';
  videoPlaceholder.style.display = 'flex';
}

// === State ===
var currentQuestion = 0;
var quizPassed = localStorage.getItem(PASSED_KEY) === 'true';
var answered = false;

// === DOM refs ===
var modalOverlay = document.getElementById('modal-overlay');
var steps = {
  intro: document.getElementById('step-intro'),
  video: document.getElementById('step-video'),
  quiz:  document.getElementById('step-quiz'),
  success: document.getElementById('step-success')
};
var progressFill = document.getElementById('progress-fill');
var questionCounter = document.getElementById('question-counter');
var questionText = document.getElementById('question-text');
var optionsContainer = document.getElementById('options-container');
var feedbackBox = document.getElementById('feedback-box');
var actionBox = document.getElementById('action-box');
var restartToast = document.getElementById('restart-toast');

// === Step switching ===
function showStep(stepName) {
  Object.keys(steps).forEach(function(key) {
    steps[key].classList.remove('active');
  });
  steps[stepName].classList.add('active');
}

// === Init ===
if (!quizPassed) {
  modalOverlay.classList.add('active');
  showStep('intro');
}

// === Start button → go to video ===
document.getElementById('btn-start').addEventListener('click', function() {
  showStep('video');
});

// === Video → Quiz ===
document.getElementById('btn-start-quiz').addEventListener('click', function() {
  currentQuestion = 0;
  answered = false;
  showStep('quiz');
  renderQuestion();
});

// === Quiz rendering ===
function renderQuestion() {
  answered = false;
  var q = activeQuizData[currentQuestion];
  var total = activeQuizData.length;

  questionCounter.textContent = (currentQuestion + 1) + '/' + total;
  progressFill.style.width = (((currentQuestion + 1) / total) * 100) + '%';
  questionText.textContent = q.question;

  feedbackBox.className = 'quiz-feedback';
  feedbackBox.style.display = 'none';
  actionBox.className = 'quiz-action';
  actionBox.style.display = 'none';

  var letters = ['A', 'B', 'C', 'D'];
  optionsContainer.innerHTML = q.options.map(function(opt, i) {
    return '<div class="option-card" data-index="' + i + '" onclick="selectOption(' + i + ')">' +
      '<div class="option-letter">' + letters[i] + '</div>' +
      '<div class="option-text">' + opt + '</div>' +
    '</div>';
  }).join('');

  steps.quiz.querySelector('.quiz-content').scrollTop = 0;
}

function selectOption(index) {
  if (answered) return;
  answered = true;

  var q = activeQuizData[currentQuestion];
  var cards = optionsContainer.querySelectorAll('.option-card');
  var isCorrect = index === q.correct;

  cards.forEach(function(c) { c.classList.add('disabled'); });

  if (isCorrect) {
    cards[index].classList.add('correct');
  } else {
    cards[index].classList.add('wrong');
  }

  feedbackBox.className = 'quiz-feedback ' + (isCorrect ? 'correct' : 'wrong') + ' show';
  feedbackBox.innerHTML = isCorrect
    ? '<span class="feedback-icon">&#10003;</span> सही जवाब! ' + q.explanation
    : '<span class="feedback-icon">&#10007;</span> गलत जवाब। ' + q.explanation;
  feedbackBox.style.display = 'block';

  actionBox.style.display = 'block';
  actionBox.className = 'quiz-action show';

  if (isCorrect) {
    if (currentQuestion < activeQuizData.length - 1) {
      actionBox.innerHTML = '<button class="btn-next" onclick="nextQuestion()">अगला सवाल &rarr;</button>';
    } else {
      actionBox.innerHTML = '<button class="btn-next" onclick="quizComplete()">पूरा हुआ &#10003;</button>';
    }
  } else {
    actionBox.innerHTML = '<button class="btn-restart" onclick="restartQuiz()">फिर से शुरू करें</button>';
  }
}

function nextQuestion() {
  currentQuestion++;
  renderQuestion();
}

function restartQuiz() {
  currentQuestion = 0;
  renderQuestion();

  restartToast.classList.add('show');
  setTimeout(function() { restartToast.classList.remove('show'); }, 2500);
}

function quizComplete() {
  quizPassed = true;
  localStorage.setItem(PASSED_KEY, 'true');
  showStep('success');
}

// === Close modal from success screen ===
document.getElementById('btn-close-modal').addEventListener('click', function() {
  modalOverlay.classList.remove('active');
});
