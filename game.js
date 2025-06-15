
let questions = [];
let filteredQuestions = [];
let currentQuestion = 0;
let score = 0;
let testMode = false;
let testSet = [];
let timerInterval;
let startTime;

async function loadQuestions() {
  const res = await fetch("questions.json");
  questions = await res.json();
}

function selectCategory(category) {
  filteredQuestions = questions.filter(q => q.category === category);
  testMode = false;
  score = 0;
  currentQuestion = 0;
  document.getElementById("category-buttons").style.display = "none";
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
  score = 0;
  currentQuestion = 0;
  testSet = questions.sort(() => 0.5 - Math.random()).slice(0, 50);
  document.getElementById("mode-buttons").style.display = "none";
  startTime = Date.now();
  timerInterval = setInterval(updateTimer, 1000);
  renderQuestion();
}

function startPractice() {
  testMode = false;
  score = 0;
  currentQuestion = 0;
  document.getElementById("mode-buttons").style.display = "none";
  showCategories();
}

function updateTimer() {
  const now = Date.now();
  const seconds = Math.floor((now - startTime) / 1000);
  document.getElementById("timer").innerText = `⏱ Time: ${seconds}s`;
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
  if (isCorrect) score++;
  q.options.forEach((_, i) => {
    const btn = document.getElementById("opt" + i);
    btn.disabled = true;
    btn.style.backgroundColor = i === q.answer ? "#c8e6c9" : (i === selected ? "#ffcdd2" : "#e0e0e0");
  });
  document.getElementById("explanation").innerText =
    (isCorrect ? "✅ Correct! " : "❌ Incorrect. ") + q.explanation + `\n\n⭐ Score: ${score}`;
  const more = testMode ? currentQuestion < 49 : currentQuestion < filteredQuestions.length - 1;
  document.getElementById("next").style.display = more ? "inline" : "none";
  document.getElementById("finish").style.display = !more ? "inline" : "none";
}

function nextQuestion() {
  currentQuestion++;
  renderQuestion();
  document.getElementById("next").style.display = "none";
  document.getElementById("finish").style.display = "none";
}

function showFinalScore() {
  clearInterval(timerInterval);
  const timeSpent = Math.floor((Date.now() - startTime) / 1000);
  document.getElementById("question").innerText = "🎉 Challenge Complete!";
  document.getElementById("progress").innerText = "🏁 Done.";
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
