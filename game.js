
let questions = [];
let currentQuestion = 0;
let score = 0;
let testMode = false;
let testSet = [];

async function loadQuestions() {
  const res = await fetch("questions.json");
  questions = await res.json();
}

function startTest() {
  testMode = true;
  score = 0;
  currentQuestion = 0;
  testSet = questions.sort(() => 0.5 - Math.random()).slice(0, 50);
  document.getElementById("mode-buttons").style.display = "none";
  renderQuestion();
}

function startPractice() {
  testMode = false;
  score = 0;
  currentQuestion = 0;
  document.getElementById("mode-buttons").style.display = "none";
  renderQuestion();
}

function renderQuestion() {
  const q = testMode ? testSet[currentQuestion] : questions[currentQuestion];
  document.getElementById("question").innerText = `🚦 Question ${currentQuestion + 1}: ` + q.question;
  document.getElementById("progress").innerText = `📍 Progress: ${currentQuestion + 1} / ${testMode ? 50 : questions.length}`;
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
  const q = testMode ? testSet[currentQuestion] : questions[currentQuestion];
  const isCorrect = selected === q.answer;
  if (isCorrect) score++;
  q.options.forEach((_, i) => {
    const btn = document.getElementById("opt" + i);
    btn.disabled = true;
    btn.style.backgroundColor = i === q.answer ? "#c8e6c9" : (i === selected ? "#ffcdd2" : "#e0e0e0");
  });
  document.getElementById("explanation").innerText =
    (isCorrect ? "✅ Correct! " : "❌ Incorrect. ") + q.explanation + `\n\n⭐ Score: ${score}`;
  if (testMode && currentQuestion < 49) {
    document.getElementById("next").style.display = "inline";
  } else if (!testMode && currentQuestion < questions.length - 1) {
    document.getElementById("next").style.display = "inline";
  } else {
    document.getElementById("finish").style.display = "inline";
  }
}

function nextQuestion() {
  currentQuestion++;
  renderQuestion();
  document.getElementById("next").style.display = "none";
  document.getElementById("finish").style.display = "none";
}

function showFinalScore() {
  document.getElementById("question").innerText = "🎉 You completed the challenge!";
  document.getElementById("progress").innerText = "🏁 All questions completed.";
  document.getElementById("explanation").innerText = `🏁 Final Score: ${score} / ${testMode ? 50 : questions.length}`;
  for (let i = 0; i < 4; i++) {
    const btn = document.getElementById("opt" + i);
    btn.style.display = "none";
  }
  document.getElementById("next").style.display = "none";
  document.getElementById("finish").style.display = "none";
}

document.addEventListener("DOMContentLoaded", async () => {
  await loadQuestions();
});
