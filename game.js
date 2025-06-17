
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
