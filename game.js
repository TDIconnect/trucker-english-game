
// Trucker English Challenge - Enhanced with Sound, Progress & Score
const questions = [
  {
    question: "Choose the correct sentence:",
    options: [
      "He drive a truck.",
      "He drives a truck.",
      "He driving a truck.",
      "He is drive a truck."
    ],
    answer: 1,
    explanation: "'Drives' is the correct form for third person singular."
  },
  {
    question: "What does BOL stand for?",
    options: [
      "Basic Order List",
      "Bill of Lading",
      "Boxed Out Load",
      "Base Operator Line"
    ],
    answer: 1,
    explanation: "BOL stands for Bill of Lading."
  },
  {
    question: "What is the opposite of 'arrive'?",
    options: [
      "drive",
      "leave",
      "depart",
      "wait"
    ],
    answer: 2,
    explanation: "'Depart' is the opposite of 'arrive'."
  }
];

let currentQuestion = 0;
let score = 0;

const correctSound = new Audio("https://www.soundjay.com/buttons/sounds/button-3.mp3");
const wrongSound = new Audio("https://www.soundjay.com/buttons/sounds/button-10.mp3");

function renderQuestion() {
  const q = questions[currentQuestion];
  document.getElementById("question").innerText = `🚦 Question ${currentQuestion + 1}: ` + q.question;
  document.getElementById("progress").innerText = `📍 Progress: ${currentQuestion + 1} / ${questions.length}`;
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
  const q = questions[currentQuestion];
  const isCorrect = selected === q.answer;
  if (isCorrect) {
    score++;
    correctSound.play();
  } else {
    wrongSound.play();
  }

  q.options.forEach((_, i) => {
    const btn = document.getElementById("opt" + i);
    btn.disabled = true;
    btn.style.backgroundColor = i === q.answer ? "#c8e6c9" : (i === selected ? "#ffcdd2" : "#e0e0e0");
  });

  document.getElementById("explanation").innerText =
    (isCorrect ? "✅ Correct! " : "❌ Incorrect. ") + q.explanation + `\n\n⭐ Score: ${score} / ${questions.length}`;

  document.getElementById("next").style.display =
    currentQuestion < questions.length - 1 ? "inline" : "none";
  document.getElementById("finish").style.display =
    currentQuestion === questions.length - 1 ? "inline" : "none";
}

function nextQuestion() {
  currentQuestion++;
  renderQuestion();
  document.getElementById("next").style.display = "none";
  document.getElementById("finish").style.display = "none";
}

function showFinalScore() {
  document.getElementById("question").innerText = "🎉 You finished the Trucker English Challenge!";
  document.getElementById("progress").innerText = "🏁 All questions completed.";
  document.getElementById("explanation").innerText = `🏁 Final Score: ${score} / ${questions.length}`;
  for (let i = 0; i < 4; i++) {
    const btn = document.getElementById("opt" + i);
    btn.style.display = "none";
  }
  document.getElementById("next").style.display = "none";
  document.getElementById("finish").style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
  const prog = document.createElement("div");
  prog.id = "progress";
  prog.style.marginBottom = "10px";
  document.body.insertBefore(prog, document.getElementById("question"));
  renderQuestion();
});
