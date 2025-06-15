
let questions = [];
let filteredQuestions = [];
let currentQuestion = 0;
let score = 0;
let testMode = false;
let blitzMode = false;
let testSet = [];
let timerInterval;
let blitzInterval;
let startTime;
let blitzTime = 60; // seconds

const correctSound = new Audio("https://www.soundjay.com/buttons/sounds/button-3.mp3");
const wrongSound = new Audio("https://www.soundjay.com/buttons/sounds/button-10.mp3");

async function loadQuestions() {
  const res = await fetch("questions.json");
  questions = await res.json();
}

function shuffle(array) {
  return array.sort(() => 0.5 - Math.random());
}

function moveTruck() {
  const truck = document.getElementById("truck");
  const percent = ((currentQuestion + 1) / (testMode ? 50 : filteredQuestions.length)) * 100;
  truck.style.left = `calc(${percent}% - 20px)`;
}

function selectCategory(category) {
  filteredQuestions = shuffle(questions.filter(q => q.category === category));
  testMode = false;
  blitzMode = false;
  score = 0;
  currentQuestion = 0;
  document.getElementById("category-buttons").style.display = "none";
  renderQuestion();
}

function startAllPractice() {
  filteredQuestions = shuffle([...questions]);
  testMode = false;
  blitzMode = false;
  score = 0;
  currentQuestion = 0;
  document.getElementById("mode-buttons").style.display = "none";
  renderQuestion();
}

function showCategories() {
  const categories = [...new Set(questions.map(q => q.category))];
  const container = document.getElementById("category-buttons");
  container.innerHTML = "<h3>Select a category:</h3>";
  categories.forEach(cat => {
    const btn = document.createElement("button");
    btn.innerText = cat;
    btn.onclick = () => selectCategory(cat);
    container.appendChild(btn);
  });
  container.style.display = "block";
}

function startTest() {
  testMode = true;
  blitzMode = false;
  score = 0;
  currentQuestion = 0;
  testSet = shuffle([...questions]).slice(0, 50);
  document.getElementById("mode-buttons").style.display = "none";
  startTime = Date.now();
  timerInterval = setInterval(updateTimer, 1000);
  renderQuestion();
}

function startPractice() {
  testMode = false;
  blitzMode = false;
  score = 0;
  currentQuestion = 0;
  document.getElementById("mode-buttons").style.display = "none";
  showCategories();
}

function startBlitz() {
  blitzMode = true;
  testMode = false;
  score = 0;
  currentQuestion = 0;
  filteredQuestions = shuffle([...questions]);
  document.getElementById("mode-buttons").style.display = "none";
  document.getElementById("blitz-timer").style.display = "block";
  blitzTime = 60;
  document.getElementById("blitz-timer").innerText = `🔥 Time left: ${blitzTime}s`;
  blitzInterval = setInterval(updateBlitzTimer, 1000);
  renderQuestion();
}

function updateTimer() {
  const now = Date.now();
  const seconds = Math.floor((now - startTime) / 1000);
  document.getElementById("timer").innerText = `⏱ Time: ${seconds}s`;
}

function updateBlitzTimer() {
  blitzTime--;
  document.getElementById("blitz-timer").innerText = `🔥 Time left: ${blitzTime}s`;
  if (blitzTime <= 0) {
    clearInterval(blitzInterval);
    showFinalScore();
  }
}

function renderQuestion() {
  const q = testMode ? testSet[currentQuestion] : filteredQuestions[currentQuestion];
  document.getElementById("question").innerText = `🚦 Question ${currentQuestion + 1}: ` + q.question;
  document.getElementById("progress").innerText = `📍 Progress: ${currentQuestion + 1} / ${testMode ? 50 : filteredQuestions.length}`;
  q.options.forEach((opt, i) => {
    const btn = document.getElementById("opt" + i);
    btn.innerText = opt;
    btn.disabled = false;
    btn.style.backgroundColor = "";
    btn.style.display = "block";
    btn.onclick = () => checkAnswer(i);
  });
  document.getElementById("explanation").innerText = "";
}

function checkAnswer(selected) {
  const q = testMode ? testSet[currentQuestion] : filteredQuestions[currentQuestion];
  const isCorrect = selected === q.answer;
  if (isCorrect) {
    score++;
    correctSound.play();
    moveTruck();
  } else {
    wrongSound.play();
  }

  q.options.forEach((_, i) => {
    const btn = document.getElementById("opt" + i);
    btn.disabled = true;
    btn.style.backgroundColor = i === q.answer ? "#c8e6c9" : (i === selected ? "#ffcdd2" : "#e0e0e0");
  });

  document.getElementById("explanation").innerText =
    (isCorrect ? "✅ Correct! " : "❌ Incorrect. ") + q.explanation + `\n\n⭐ Score: ${score}`;

  const more = testMode ? currentQuestion < 49 : currentQuestion < filteredQuestions.length - 1;

  if (blitzMode) {
    setTimeout(() => {
      currentQuestion++;
      if (currentQuestion < filteredQuestions.length) {
        renderQuestion();
      } else {
        clearInterval(blitzInterval);
        showFinalScore();
      }
    }, 400);
  } else {
    document.getElementById("next").style.display = more ? "inline" : "none";
    document.getElementById("finish").style.display = !more ? "inline" : "none";
  }
}

function nextQuestion() {
  currentQuestion++;
  renderQuestion();
  document.getElementById("next").style.display = "none";
  document.getElementById("finish").style.display = "none";
}

function showFinalScore() {
  clearInterval(timerInterval);
  clearInterval(blitzInterval);
  const timeSpent = Math.floor((Date.now() - startTime) / 1000);
  document.getElementById("question").innerText = "🎉 Challenge Complete!";
  document.getElementById("progress").innerText = "🏁 Done.";
  document.getElementById("blitz-timer").style.display = "none";
  document.getElementById("timer").innerText = `⏱ Total Time: ${timeSpent}s`;
  document.getElementById("explanation").innerText = `⭐ Final Score: ${score} / ${testMode ? 50 : filteredQuestions.length}`;
  for (let i = 0; i < 4; i++) {
    document.getElementById("opt" + i).style.display = "none";
  }
  document.getElementById("next").style.display = "none";
  document.getElementById("finish").style.display = "none";
}

document.addEventListener("DOMContentLoaded", async () => {
  await loadQuestions();
});


let missedQuestions = [];
let isReviewing = false;

function saveScoreHistory(score, total, mode, timeTaken) {
  const history = JSON.parse(localStorage.getItem("scoreHistory") || "[]");
  const newEntry = {
    date: new Date().toLocaleString(),
    score: score,
    total: total,
    mode: mode,
    time: timeTaken + "s"
  };
  history.unshift(newEntry);
  if (history.length > 5) history.pop();
  localStorage.setItem("scoreHistory", JSON.stringify(history));
}

function showScoreHistory() {
  const history = JSON.parse(localStorage.getItem("scoreHistory") || "[]");
  let html = "<h3>📊 Recent Scores</h3>";
  if (history.length === 0) {
    html += "<p>No previous scores yet.</p>";
  } else {
    html += "<ul>";
    history.forEach(h => {
      html += `<li>${h.date}: ${h.score}/${h.total} (${h.mode}) — ⏱ ${h.time}</li>`;
    });
    html += "</ul>";
  }
  const div = document.createElement("div");
  div.innerHTML = html;
  document.body.appendChild(div);
}

function showFinalScore() {
  clearInterval(timerInterval);
  clearInterval(blitzInterval);
  const timeSpent = Math.floor((Date.now() - startTime) / 1000);
  document.getElementById("question").innerText = "🎉 Challenge Complete!";
  document.getElementById("progress").innerText = "🏁 Done.";
  document.getElementById("blitz-timer").style.display = "none";
  document.getElementById("timer").innerText = `⏱ Total Time: ${timeSpent}s`;
  document.getElementById("explanation").innerText = `⭐ Final Score: ${score} / ${testMode ? 50 : filteredQuestions.length}`;

  missedQuestions = [];
  const fullSet = testMode ? testSet : filteredQuestions;
  fullSet.forEach((q, idx) => {
    if (q.userAnswer !== undefined && q.userAnswer !== q.answer) {
      missedQuestions.push(q);
    }
  });

  saveScoreHistory(score, fullSet.length, testMode ? "Test" : blitzMode ? "Blitz" : "Practice", timeSpent);

  for (let i = 0; i < 4; i++) {
    document.getElementById("opt" + i).style.display = "none";
  }
  document.getElementById("next").style.display = "none";
  document.getElementById("finish").style.display = "none";

  if (missedQuestions.length > 0) {
    const reviewBtn = document.createElement("button");
    reviewBtn.textContent = "🔁 Review Missed Questions";
    reviewBtn.onclick = () => {
      isReviewing = true;
      filteredQuestions = missedQuestions;
      currentQuestion = 0;
      document.querySelector("button").remove(); // remove the button
      renderQuestion();
    };
    document.body.appendChild(reviewBtn);
  }

  const historyBtn = document.createElement("button");
  historyBtn.textContent = "📊 View Score History";
  historyBtn.onclick = showScoreHistory;
  document.body.appendChild(historyBtn);
}
