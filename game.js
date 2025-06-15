
// Trucker English Challenge - Simple HTML/JS Game Prototype
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

function renderQuestion() {
  const q = questions[currentQuestion];
  document.getElementById("question").innerText = q.question;
  q.options.forEach((opt, i) => {
    const btn = document.getElementById("opt" + i);
    btn.innerText = opt;
    btn.onclick = () => checkAnswer(i);
  });
  document.getElementById("explanation").innerText = "";
}

function checkAnswer(selected) {
  const q = questions[currentQuestion];
  const isCorrect = selected === q.answer;
  document.getElementById("explanation").innerText =
    (isCorrect ? "✅ Correct! " : "❌ Incorrect. ") + q.explanation;
  if (currentQuestion < questions.length - 1) {
    document.getElementById("next").style.display = "inline";
  } else {
    document.getElementById("next").style.display = "none";
  }
}

function nextQuestion() {
  currentQuestion++;
  renderQuestion();
  document.getElementById("next").style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
  renderQuestion();
});
