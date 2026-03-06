/* ============================================================
   Wiom Admin — PayG Content Manager
   Manages two flows: Partner/Admin and Rohit.
   Each flow has: video, intro, quiz, success config.
   Stored in localStorage under separate keys.
   ============================================================ */

var KEYS = {
  partner: 'wiom_partner_config',
  rohit: 'wiom_rohit_config'
};

var PASSED_KEYS = {
  partner: 'wiom_partner_passed',
  rohit: 'wiom_rohit_passed'
};

var DEFAULTS = {
  partner: defaultPartnerConfig,
  rohit: defaultRohitConfig
};

// In-memory video blob URLs (not persistable in localStorage)
var videoBlobUrls = {
  partner: null,
  rohit: null
};

// === Load config ===
function loadConfig(flow) {
  try {
    var stored = localStorage.getItem(KEYS[flow]);
    if (stored) {
      var parsed = JSON.parse(stored);
      if (parsed && parsed.intro && Array.isArray(parsed.quiz) && parsed.quiz.length > 0 && parsed.success) {
        return parsed;
      }
    }
  } catch (e) { /* fall through */ }
  var fresh = JSON.parse(JSON.stringify(DEFAULTS[flow]));
  localStorage.setItem(KEYS[flow], JSON.stringify(fresh));
  return fresh;
}

var configs = {
  partner: loadConfig('partner'),
  rohit: loadConfig('rohit')
};

// === Tab switching ===
function switchTab(flow) {
  document.querySelectorAll('.tab-btn').forEach(function(btn) {
    btn.classList.remove('active');
  });
  document.querySelectorAll('.tab-content').forEach(function(tab) {
    tab.classList.remove('active');
  });

  if (flow === 'rohit') {
    document.querySelectorAll('.tab-btn')[1].classList.add('active');
    document.getElementById('tab-rohit').classList.add('active');
  } else {
    document.querySelectorAll('.tab-btn')[0].classList.add('active');
    document.getElementById('tab-partner').classList.add('active');
  }
}

// === Toast ===
function showToast(msg) {
  var toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(function() { toast.classList.remove('show'); }, 2500);
}

// === Populate form ===
function populateForm(flow) {
  var cfg = configs[flow];

  document.getElementById(flow + '-intro-title').value = cfg.intro.title;
  document.getElementById(flow + '-intro-body').value = cfg.intro.body;
  document.getElementById(flow + '-intro-cta').value = cfg.intro.cta;

  document.getElementById(flow + '-video-title').value = cfg.video ? cfg.video.title : '';

  // If video URL is set, show preview
  if (cfg.video && cfg.video.url) {
    showVideoPreview(flow, cfg.video.url, cfg.video.url);
  }

  document.getElementById(flow + '-success-title').value = cfg.success.title;
  document.getElementById(flow + '-success-subtitle').value = cfg.success.subtitle;
  document.getElementById(flow + '-success-payout').value = cfg.success.payout;
  document.getElementById(flow + '-success-note').value = cfg.success.note;
  document.getElementById(flow + '-success-cta').value = cfg.success.cta;

  renderQuizList(flow);
}

// === Quiz rendering ===
function renderQuizList(flow) {
  var list = document.getElementById(flow + '-quiz-list');
  var questions = configs[flow].quiz;
  list.innerHTML = '';

  questions.forEach(function(q, i) {
    var card = document.createElement('div');
    card.className = 'question-card';
    card.innerHTML =
      '<div class="question-card-header" onclick="toggleCard(\'' + flow + '\',' + i + ')">' +
        '<span class="question-card-num">Q' + (i + 1) + '</span>' +
        '<span class="question-card-preview">' + escapeHtml(q.question) + '</span>' +
        '<div class="question-card-actions">' +
          (i > 0 ? '<button class="btn-icon" onclick="event.stopPropagation(); moveQuestion(\'' + flow + '\',' + i + ',-1)" title="Move up">&uarr;</button>' : '') +
          (i < questions.length - 1 ? '<button class="btn-icon" onclick="event.stopPropagation(); moveQuestion(\'' + flow + '\',' + i + ',1)" title="Move down">&darr;</button>' : '') +
          '<button class="btn-icon delete" onclick="event.stopPropagation(); deleteQuestion(\'' + flow + '\',' + i + ')" title="Delete">&times;</button>' +
        '</div>' +
      '</div>' +
      '<div class="question-card-body">' +
        '<div class="form-group">' +
          '<label>Question</label>' +
          '<textarea class="form-textarea" rows="2" data-flow="' + flow + '" data-field="question" data-index="' + i + '">' + escapeHtml(q.question) + '</textarea>' +
        '</div>' +
        '<div class="options-grid">' +
          q.options.map(function(opt, oi) {
            return '<div class="option-field">' +
              '<label>Option ' + String.fromCharCode(65 + oi) + '</label>' +
              '<input type="text" class="form-input" data-flow="' + flow + '" data-field="option" data-index="' + i + '" data-option="' + oi + '" value="' + escapeAttr(opt) + '">' +
            '</div>';
          }).join('') +
        '</div>' +
        '<div class="correct-answer-row">' +
          '<label>Correct Answer:</label>' +
          '<select class="form-select" data-flow="' + flow + '" data-field="correct" data-index="' + i + '">' +
            '<option value="0"' + (q.correct === 0 ? ' selected' : '') + '>A</option>' +
            '<option value="1"' + (q.correct === 1 ? ' selected' : '') + '>B</option>' +
            '<option value="2"' + (q.correct === 2 ? ' selected' : '') + '>C</option>' +
            '<option value="3"' + (q.correct === 3 ? ' selected' : '') + '>D</option>' +
          '</select>' +
        '</div>' +
        '<div class="form-group">' +
          '<label>Explanation</label>' +
          '<textarea class="form-textarea" rows="2" data-flow="' + flow + '" data-field="explanation" data-index="' + i + '">' + escapeHtml(q.explanation) + '</textarea>' +
        '</div>' +
      '</div>';
    list.appendChild(card);
  });
}

function escapeHtml(str) {
  var div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function escapeAttr(str) {
  return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// === Card toggle ===
function toggleCard(flow, index) {
  var cards = document.getElementById(flow + '-quiz-list').querySelectorAll('.question-card');
  cards[index].classList.toggle('open');
}

// === Read form into config ===
function readFormIntoConfig(flow) {
  var cfg = configs[flow];

  cfg.intro = {
    title: document.getElementById(flow + '-intro-title').value,
    body: document.getElementById(flow + '-intro-body').value,
    cta: document.getElementById(flow + '-intro-cta').value
  };

  cfg.video = cfg.video || {};
  cfg.video.title = document.getElementById(flow + '-video-title').value;

  cfg.success = {
    title: document.getElementById(flow + '-success-title').value,
    subtitle: document.getElementById(flow + '-success-subtitle').value,
    payout: document.getElementById(flow + '-success-payout').value,
    note: document.getElementById(flow + '-success-note').value,
    cta: document.getElementById(flow + '-success-cta').value
  };

  // Read quiz from DOM
  var questions = cfg.quiz || [];
  document.querySelectorAll('[data-flow="' + flow + '"][data-field="question"]').forEach(function(el) {
    var i = parseInt(el.dataset.index);
    if (questions[i]) questions[i].question = el.value;
  });
  document.querySelectorAll('[data-flow="' + flow + '"][data-field="option"]').forEach(function(el) {
    var i = parseInt(el.dataset.index);
    var oi = parseInt(el.dataset.option);
    if (questions[i]) questions[i].options[oi] = el.value;
  });
  document.querySelectorAll('[data-flow="' + flow + '"][data-field="correct"]').forEach(function(el) {
    var i = parseInt(el.dataset.index);
    if (questions[i]) questions[i].correct = parseInt(el.value);
  });
  document.querySelectorAll('[data-flow="' + flow + '"][data-field="explanation"]').forEach(function(el) {
    var i = parseInt(el.dataset.index);
    if (questions[i]) questions[i].explanation = el.value;
  });

  cfg.quiz = questions;
}

// === Question operations ===
function moveQuestion(flow, index, direction) {
  readFormIntoConfig(flow);
  var q = configs[flow].quiz;
  var target = index + direction;
  if (target < 0 || target >= q.length) return;
  var temp = q[index];
  q[index] = q[target];
  q[target] = temp;
  renderQuizList(flow);
}

function deleteQuestion(flow, index) {
  if (configs[flow].quiz.length <= 1) {
    showToast('Must have at least one question');
    return;
  }
  readFormIntoConfig(flow);
  configs[flow].quiz.splice(index, 1);
  renderQuizList(flow);
}

function addQuestion(flow) {
  readFormIntoConfig(flow);
  configs[flow].quiz.push({
    question: "",
    options: ["", "", "", ""],
    correct: 0,
    explanation: ""
  });
  renderQuizList(flow);
  var cards = document.getElementById(flow + '-quiz-list').querySelectorAll('.question-card');
  cards[cards.length - 1].classList.add('open');
}

// === Video handling ===
function handleVideoFile(flow, input) {
  if (!input.files || !input.files[0]) return;
  var file = input.files[0];

  // Revoke old blob URL if exists
  if (videoBlobUrls[flow]) {
    URL.revokeObjectURL(videoBlobUrls[flow]);
  }

  var blobUrl = URL.createObjectURL(file);
  videoBlobUrls[flow] = blobUrl;

  configs[flow].video = configs[flow].video || {};
  configs[flow].video.url = blobUrl;

  showVideoPreview(flow, blobUrl, file.name);
  showToast('Video loaded: ' + file.name);
}

function setVideoUrl(flow) {
  var urlInput = document.getElementById(flow + '-video-url');
  var url = urlInput.value.trim();
  if (!url) {
    showToast('Please enter a video URL');
    return;
  }

  configs[flow].video = configs[flow].video || {};
  configs[flow].video.url = url;

  showVideoPreview(flow, url, url);
  showToast('Video URL set');
}

function showVideoPreview(flow, src, label) {
  var uploadArea = document.getElementById(flow + '-video-upload');
  var preview = document.getElementById(flow + '-video-preview');
  var info = document.getElementById(flow + '-video-info');
  var filename = document.getElementById(flow + '-video-filename');

  uploadArea.classList.add('has-video');
  preview.style.display = 'block';
  preview.querySelector('video').src = src;
  info.style.display = 'block';

  // Truncate long labels
  var displayLabel = label.length > 60 ? label.substring(0, 57) + '...' : label;
  filename.textContent = displayLabel;
}

function removeVideo(flow) {
  if (videoBlobUrls[flow]) {
    URL.revokeObjectURL(videoBlobUrls[flow]);
    videoBlobUrls[flow] = null;
  }

  configs[flow].video = configs[flow].video || {};
  configs[flow].video.url = '';

  var uploadArea = document.getElementById(flow + '-video-upload');
  var preview = document.getElementById(flow + '-video-preview');
  var info = document.getElementById(flow + '-video-info');

  uploadArea.classList.remove('has-video');
  preview.style.display = 'none';
  preview.querySelector('video').src = '';
  info.style.display = 'none';

  document.getElementById(flow + '-video-url').value = '';

  showToast('Video removed');
}

// === Drag and drop for video ===
function setupDragDrop(flow) {
  var area = document.getElementById(flow + '-video-upload');

  area.addEventListener('dragover', function(e) {
    e.preventDefault();
    area.classList.add('dragover');
  });

  area.addEventListener('dragleave', function(e) {
    e.preventDefault();
    area.classList.remove('dragover');
  });

  area.addEventListener('drop', function(e) {
    e.preventDefault();
    area.classList.remove('dragover');

    var files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith('video/')) {
      // Simulate file input
      var fakeInput = { files: [files[0]] };
      handleVideoFile(flow, fakeInput);
    } else {
      showToast('Please drop a video file (MP4, WebM)');
    }
  });
}

// === Save ===
function saveConfig(flow) {
  readFormIntoConfig(flow);
  localStorage.setItem(KEYS[flow], JSON.stringify(configs[flow]));
  showToast(flow === 'rohit' ? 'Rohit config saved!' : 'Partner config saved!');
}

// === Reset ===
function resetConfig(flow) {
  if (!confirm('Reset all ' + (flow === 'rohit' ? 'Rohit' : 'Partner') + ' content to defaults? This will clear saved changes.')) return;
  localStorage.removeItem(KEYS[flow]);
  configs[flow] = JSON.parse(JSON.stringify(DEFAULTS[flow]));
  removeVideo(flow);
  populateForm(flow);
  showToast('Reset to defaults');
}

// === Preview ===
function previewFlow(flow) {
  // Save first
  readFormIntoConfig(flow);
  localStorage.setItem(KEYS[flow], JSON.stringify(configs[flow]));
  // Clear passed state so modal shows
  localStorage.removeItem(PASSED_KEYS[flow]);
  var page = flow === 'rohit' ? 'rohit.html' : 'partner.html';
  window.open(page, '_blank');
}

// === Init ===
populateForm('partner');
populateForm('rohit');
setupDragDrop('partner');
setupDragDrop('rohit');
