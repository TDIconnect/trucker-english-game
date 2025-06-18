
let questions = [];
let current = 0;
let score = 0;
let mode = 'practice';

async function startMode(m) {
  mode = m;
  document.getElementById('menu').style.display = 'none';
  questions = await fetch('questions.json').then(res => res.json());
  if (mode === 'test') {
    questions = questions.sort(() => 0.5 - Math.random()).slice(0, 50);
  } else {
    questions = questions.sort(() => 0.5 - Math.random());
  }
  document.getElementById('game').style.display = 'block';
  renderQuestion();
}

function renderQuestion() {
  const q = questions[current];
  document.getElementById('question').innerText = q.question;
  const optionsDiv = document.getElementById('options');
  optionsDiv.innerHTML = '';
  q.options.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.innerText = opt;
    btn.onclick = () => checkAnswer(idx);
    optionsDiv.appendChild(btn);
  });
  document.getElementById('explanation').innerText = '';
  document.getElementById('nextBtn').style.display = 'none';
}

function checkAnswer(index) {
  const q = questions[current];
  const correct = q.answer;
  const expl = q.explanation || '';
  if (index === correct) {
    score++;
    document.getElementById('explanation').innerText = '✅ Correct! ' + expl;
  } else {
    document.getElementById('explanation').innerText = '❌ Incorrect. ' + expl;
  }
  Array.from(document.getElementById('options').children).forEach((btn, idx) => {
    btn.disabled = true;
    btn.style.background = idx === correct ? '#c8e6c9' : (idx === index ? '#ffcdd2' : '#eee');
  });
  document.getElementById('nextBtn').style.display = 'inline-block';
}

function nextQuestion() {
  current++;
  if (current >= questions.length || (mode === 'blitz' && score >= 20)) {
    document.getElementById('game').style.display = 'none';
    document.getElementById('summary').style.display = 'block';
    document.getElementById('score').innerText = `You scored ${score} out of ${questions.length}`;

  if (mode === 'test' || mode === 'category') {
    saveTestHistory(score, questions.length);
  }

  } else {
    renderQuestion();
  }
}


// Dark mode toggle
function toggleDarkMode() {
  document.body.classList.toggle("dark");
}

// Insert dark mode button
const themeBtn = document.createElement("button");
themeBtn.innerText = "🌓 Toggle Dark Mode";
themeBtn.className = "button";
themeBtn.style.position = "fixed";
themeBtn.style.top = "10px";
themeBtn.style.right = "10px";
themeBtn.onclick = toggleDarkMode;
document.body.appendChild(themeBtn);

// Play sound effects
const correctSound = new Audio("https://www.soundjay.com/buttons/sounds/button-3.mp3");
const wrongSound = new Audio("https://www.soundjay.com/buttons/sounds/button-10.mp3");

// Truck progress bar update
function updateTruckProgress() {
  const truck = document.getElementById("truck");
  if (!truck) return;
  const progress = (current + 1) / questions.length;
  truck.style.left = `${progress * 100}%`;
}


// Extract all categories from questions
let categories = [];
function getCategories() {
  const set = new Set();
  questions.forEach(q => {
    if (q.category) set.add(q.category);
  });
  categories = Array.from(set).sort();
}

// Show category selection menu
function showCategoryMenu() {
  document.getElementById('menu').style.display = 'none';
  const catDiv = document.createElement('div');
  catDiv.id = "category-menu";
  catDiv.innerHTML = "<h2>Choose a Category</h2>";
  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'button';
    btn.innerText = cat;
    btn.onclick = () => startCategory(cat);
    catDiv.appendChild(btn);
  });
  document.body.appendChild(catDiv);
}

function startCategory(category) {
  document.getElementById('category-menu').remove();
  mode = 'category';
  filtered = questions.filter(q => q.category === category);
  filtered = filtered.sort(() => 0.5 - Math.random());
  questions = filtered;
  current = 0;
  score = 0;
  document.getElementById('game').style.display = 'block';
  renderQuestion();
}

function startCategoryMode() {
  fetch('questions.json')
    .then(res => res.json())
    .then(data => {
      questions = data;
      getCategories();
      showCategoryMenu();
    });
}


// Insert a back button
function createBackButton(targetId = 'menu') {
  const backBtn = document.createElement('button');
  backBtn.innerText = "🔙 Back";
  backBtn.className = "button";
  backBtn.style.marginTop = "1em";
  backBtn.onclick = () => {
    document.getElementById('game').style.display = 'none';
    document.getElementById('summary').style.display = 'none';
    if (document.getElementById('category-menu')) {
      document.getElementById('category-menu').remove();
    }
    document.getElementById(targetId).style.display = 'block';
  };
  return backBtn;
}

// Add to game and category UI
function appendBackToGame() {
  const backBtn = createBackButton();
  document.getElementById('game').appendChild(backBtn);
}

function showCategoryMenu() {
  document.getElementById('menu').style.display = 'none';
  const catDiv = document.createElement('div');
  catDiv.id = "category-menu";
  catDiv.innerHTML = "<h2>Choose a Category</h2>";
  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'button';
    btn.innerText = cat;
    btn.onclick = () => startCategory(cat);
    catDiv.appendChild(btn);
  });
  const backBtn = createBackButton();
  catDiv.appendChild(backBtn);
  document.body.appendChild(catDiv);
}


// Fix category mode launch
function startCategoryMode() {
  fetch('questions.json')
    .then(res => res.json())
    .then(data => {
      questions = data;
      getCategories();
      showCategoryMenu();
    });
}

// Dark mode toggle button (reduced size + class)
function toggleDarkMode() {
  document.body.classList.toggle("dark");
}

// Add button (reduced size, better placement)
function createDarkModeButton() {
  const btn = document.createElement("button");
  btn.innerText = "🌓";
  btn.className = "button";
  btn.title = "Toggle Dark Mode";
  btn.style.position = "fixed";
  btn.style.top = "10px";
  btn.style.right = "10px";
  btn.style.padding = "0.4em 0.6em";
  btn.style.fontSize = "1.2rem";
  btn.style.borderRadius = "6px";
  btn.style.zIndex = "1000";
  btn.onclick = toggleDarkMode;
  document.body.appendChild(btn);
}

document.addEventListener("DOMContentLoaded", () => {
  createDarkModeButton();
});


function showCategoryMenu() {
  document.getElementById('menu').style.display = 'none';
  const catDiv = document.createElement('div');
  catDiv.id = "category-menu";
  catDiv.innerHTML = "<h2>Select a Category</h2>";
  catDiv.style.display = "flex";
  catDiv.style.flexDirection = "column";
  catDiv.style.alignItems = "center";
  catDiv.style.gap = "0.8rem";
  catDiv.style.marginTop = "1rem";

  const emojiMap = {
    "General English": "📘",
    "Trucking Vocabulary": "🚚",
    "Communication": "📞",
    "Compliance & Safety": "🛡️",
    "Paperwork & Permits": "📄",
    "Driving Conditions": "🌨️",
    "Customer Service": "🤝",
    "Emergency Response": "🚨"
  };

  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'button';
    btn.innerText = `${emojiMap[cat] || '📁'} ${cat}`;
    btn.onclick = () => startCategory(cat);
    catDiv.appendChild(btn);
  });

  const backBtn = createBackButton();
  catDiv.appendChild(backBtn);

  document.body.appendChild(catDiv);
}


// Streak Tracker
function updateStreak() {
  const today = new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'
  const lastDate = localStorage.getItem('lastPracticeDate');
  let streak = parseInt(localStorage.getItem('streak') || '0');

  if (lastDate === today) return; // already recorded today

  if (lastDate) {
    const prev = new Date(lastDate);
    const now = new Date(today);
    const diff = (now - prev) / (1000 * 60 * 60 * 24);
    if (diff === 1) {
      streak += 1;
    } else {
      streak = 1;
    }
  } else {
    streak = 1;
  }

  localStorage.setItem('lastPracticeDate', today);
  localStorage.setItem('streak', streak);
}

function showStreakBanner() {
  const streak = parseInt(localStorage.getItem('streak') || '0');
  const div = document.createElement('div');
  div.innerText = `🔥 Daily Practice Streak: ${streak}`;
  div.style.position = 'fixed';
  div.style.bottom = '10px';
  div.style.right = '10px';
  div.style.padding = '0.6em 1em';
  div.style.background = '#b80000';
  div.style.color = 'white';
  div.style.borderRadius = '8px';
  div.style.zIndex = 1000;
  div.style.fontWeight = 'bold';
  document.body.appendChild(div);
}

// Call it once game starts
function startMode(m) {
  mode = m;
  document.getElementById('menu').style.display = 'none';
  fetch('questions.json')
    .then(res => res.json())
    .then(data => {
      questions = data;
      if (mode === 'test') {
        questions = questions.sort(() => 0.5 - Math.random()).slice(0, 50);
      } else {
        questions = questions.sort(() => 0.5 - Math.random());
      }
      current = 0;
      score = 0;
      document.getElementById('game').style.display = 'block';
      updateStreak();
      showStreakBanner();
      renderQuestion();
    });
}


// Prompt for username and store locally
function getUserName() {
  let name = localStorage.getItem("username");
  if (!name) {
    name = prompt("Enter your name or CB handle:");
    if (name) localStorage.setItem("username", name);
    else name = "Anonymous";
  }
  return name;
}

// Save Blitz score to leaderboard
function saveBlitzScore(score) {
  const name = getUserName();
  const date = new Date().toISOString().slice(0, 10);
  const entry = { name, score, date };
  let leaderboard = JSON.parse(localStorage.getItem("leaderboard") || "[]");
  leaderboard.push(entry);
  leaderboard.sort((a, b) => b.score - a.score);
  leaderboard = leaderboard.slice(0, 5);
  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
}

// Show leaderboard on main menu
function showLeaderboard() {
  const div = document.createElement("div");
  div.id = "leaderboard";
  div.innerHTML = "<h2>🏆 Top Blitz Scores</h2>";
  div.style.margin = "1em auto";
  div.style.maxWidth = "600px";
  const scores = JSON.parse(localStorage.getItem("leaderboard") || "[]");
  if (scores.length === 0) {
    div.innerHTML += "<p>No scores yet. Play Blitz mode!</p>";
  } else {
    const list = document.createElement("ol");
    scores.forEach(entry => {
      const li = document.createElement("li");
      li.innerText = `${entry.name} – ${entry.score} – ${entry.date}`;
      list.appendChild(li);
    });
    div.appendChild(list);
  }
  const backBtn = createBackButton();
  div.appendChild(backBtn);
  document.body.appendChild(div);
}

// Inject leaderboard hook into summary
const originalSummary = showSummary;
showSummary = function () {
  originalSummary();
  if (mode === 'blitz') {
    saveBlitzScore(score);
  }
}


// Extend leaderboard with reset button
function showLeaderboard() {
  const div = document.createElement("div");
  div.id = "leaderboard";
  div.innerHTML = "<h2>🏆 Top Blitz Scores</h2>";
  div.style.margin = "1em auto";
  div.style.maxWidth = "600px";
  const scores = JSON.parse(localStorage.getItem("leaderboard") || "[]");
  if (scores.length === 0) {
    div.innerHTML += "<p>No scores yet. Play Blitz mode!</p>";
  } else {
    const list = document.createElement("ol");
    scores.forEach(entry => {
      const li = document.createElement("li");
      li.innerText = `${entry.name} – ${entry.score} – ${entry.date}`;
      list.appendChild(li);
    });
    div.appendChild(list);
  }

  const resetBtn = document.createElement("button");
  resetBtn.innerText = "🗑️ Clear Leaderboard";
  resetBtn.className = "button";
  resetBtn.onclick = () => {
    if (confirm("Are you sure you want to clear all scores?")) {
      localStorage.removeItem("leaderboard");
      showLeaderboard();
    }
  };
  div.appendChild(resetBtn);

  const backBtn = createBackButton();
  div.appendChild(backBtn);
  document.body.appendChild(div);
}


// Save test score to history
function saveTestHistory(score, total) {
  const name = getUserName();
  const date = new Date().toISOString().slice(0, 10);
  const category = mode === 'category' ? questions[0]?.category || 'Mixed' : 'Mixed';
  const entry = { name, score, total, category, date };
  let history = JSON.parse(localStorage.getItem("testHistory") || "[]");
  history.push(entry);
  history = history.slice(-10);
  localStorage.setItem("testHistory", JSON.stringify(history));
}

// Show test history from menu
function showTestHistory() {
  const div = document.createElement("div");
  div.id = "test-history";
  div.innerHTML = "<h2>📋 Test History</h2>";
  div.style.margin = "1em auto";
  div.style.maxWidth = "600px";
  const history = JSON.parse(localStorage.getItem("testHistory") || "[]");
  if (history.length === 0) {
    div.innerHTML += "<p>No tests taken yet.</p>";
  } else {
    const list = document.createElement("ol");
    history.reverse().forEach(entry => {
      const li = document.createElement("li");
      li.innerText = `${entry.name} – ${entry.score}/${entry.total} – ${entry.category} – ${entry.date}`;
      list.appendChild(li);
    });
    div.appendChild(list);
  }

  const resetBtn = document.createElement("button");
  resetBtn.innerText = "🗑️ Clear History";
  resetBtn.className = "button";
  resetBtn.onclick = () => {
    if (confirm("Clear all test history?")) {
      localStorage.removeItem("testHistory");
      showTestHistory();
    }
  };
  div.appendChild(resetBtn);

  const backBtn = createBackButton();
  div.appendChild(backBtn);
  document.body.appendChild(div);
}


// Daily Challenge Mode
function startDailyChallenge() {
  const today = new Date().toISOString().slice(0, 10);
  if (localStorage.getItem('dailyDone') === today) {
    alert("✅ You already completed today's challenge!");
    return;
  }

  fetch('questions.json')
    .then(res => res.json())
    .then(data => {
      questions = data.sort(() => 0.5 - Math.random()).slice(0, 5);
      mode = 'daily';
      current = 0;
      score = 0;
      missedQuestions = [];
      document.getElementById('menu').style.display = 'none';
      document.getElementById('game').style.display = 'block';
      renderQuestion();
    });
}

// Modify showSummary for daily challenge
const previousShowSummary = showSummary;
showSummary = function () {
  previousShowSummary();
  const today = new Date().toISOString().slice(0, 10);
  if (mode === 'daily') {
    localStorage.setItem('dailyDone', today);
    updateStreak();
  }
}


function showCustomQuizBuilder() {
  document.getElementById('menu').style.display = 'none';

  const builder = document.createElement("div");
  builder.id = "quiz-builder";
  builder.style.maxWidth = "500px";
  builder.style.margin = "2em auto";
  builder.style.padding = "1em";
  builder.style.border = "2px solid #ccc";
  builder.style.borderRadius = "10px";
  builder.style.background = "#f0f0f0";
  builder.style.textAlign = "center";

  builder.innerHTML = "<h2>🎛️ Build Custom Quiz</h2>";

  const label1 = document.createElement("label");
  label1.innerText = "Select number of questions:";
  builder.appendChild(label1);

  const numSelect = document.createElement("select");
  [5, 10, 25, 50, 100].forEach(n => {
    const opt = document.createElement("option");
    opt.value = n;
    opt.innerText = n;
    numSelect.appendChild(opt);
  });
  builder.appendChild(numSelect);

  builder.appendChild(document.createElement("br"));
  builder.appendChild(document.createElement("br"));

  const label2 = document.createElement("label");
  label2.innerText = "Choose category (optional):";
  builder.appendChild(label2);

  const catSelect = document.createElement("select");
  const defaultOpt = document.createElement("option");
  defaultOpt.value = "";
  defaultOpt.innerText = "All Categories";
  catSelect.appendChild(defaultOpt);

  const uniqueCats = [...new Set(questions.map(q => q.category))];
  uniqueCats.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.innerText = cat;
    catSelect.appendChild(opt);
  });
  builder.appendChild(catSelect);

  builder.appendChild(document.createElement("br"));
  builder.appendChild(document.createElement("br"));

  const startBtn = document.createElement("button");
  startBtn.innerText = "Start Quiz";
  startBtn.className = "button";
  startBtn.onclick = () => {
    const count = parseInt(numSelect.value);
    const selectedCat = catSelect.value;
    const filtered = selectedCat
      ? questions.filter(q => q.category === selectedCat)
      : [...questions];
    mode = "custom";
    score = 0;
    current = 0;
    questions = filtered.sort(() => 0.5 - Math.random()).slice(0, count);
    builder.remove();
    document.getElementById('game').style.display = 'block';
    renderQuestion();
  };

  builder.appendChild(startBtn);
  const backBtn = createBackButton();
  builder.appendChild(backBtn);

  document.body.appendChild(builder);
}
