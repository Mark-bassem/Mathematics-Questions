function generateMathQuestions(count, difficulty) {
  const questions = [];
  let min, max;

  if (difficulty === "easy") {
    min = 5;
    max = 50;
  } else if (difficulty === "medium") {
    min = 20;
    max = 200;
  } else {
    min = 50;
    max = 500;
  }

  for (let i = 0; i < count; i++) {
    const a = Math.floor(Math.random() * (max - min + 1)) + min;
    const b = Math.floor(Math.random() * (max - min + 1)) + min;
    const c = Math.floor(Math.random() * (max - min + 1)) + min;
    const d = Math.floor(Math.random() * (max - min + 1)) + min;

    const ops = ["+", "-", "×", "÷"];
    const op1 = ops[Math.floor(Math.random() * ops.length)];
    const op2 = ops[Math.floor(Math.random() * ops.length)];
    const op3 = ops[Math.floor(Math.random() * ops.length)];

    const question = `(${a} ${op1} ${b}) ${op2} ${c} ${op3} ${d}`;
    let expression = question.replace(/×/g, "*").replace(/÷/g, "/");
    let answer = eval(expression);
    answer = Math.round(answer * 100) / 100;

    const options = new Set([answer.toString()]);
    while (options.size < 4) {
      let fake = answer + Math.floor(Math.random() * 21) - 10;
      fake = Math.round(fake * 100) / 100;
      if (fake !== answer) options.add(fake.toString());
    }

    const optionsArray = Array.from(options);
    for (let j = optionsArray.length - 1; j > 0; j--) {
      const k = Math.floor(Math.random() * (j + 1));
      [optionsArray[j], optionsArray[k]] = [optionsArray[k], optionsArray[j]];
    }

    questions.push({
      q: question,
      options: optionsArray,
      answer: answer.toString(),
    });
  }
  return questions;
}

let Questions = [];
let currentIndex = 0;
let score = 0;
let attempts = 0;
let timer = null;
let TOTAL_TIME = 60;
let timeLeft = TOTAL_TIME;
let selectedCount = 15;
let selectedDifficulty = "hard";
let selectedTime = 60;

const correctSound = document.getElementById("correct-sound");
const wrongSound = document.getElementById("wrong-sound");
const bgMusic = document.getElementById("bg-music");
let musicPlaying = false;

function toggleMusic() {
  if (!bgMusic) return;
  if (musicPlaying) {
    bgMusic.pause();
    document.getElementById("music-toggle").textContent = "Play the sound";
  } else {
    bgMusic.play().catch(() => {});
    document.getElementById("music-toggle").textContent = "Stop the sound";
  }
  musicPlaying = !musicPlaying;
}

function showStartScreen() {
  const container = document.getElementById("quiz-container");
  container.innerHTML = `
    <div class="start-card">
      <h2>🎯 Math Challenge</h2>

      <label>Number of Questions:</label>
      <select id="questionCount">
        <option value="10">10</option>
        <option value="15" selected>15</option>
        <option value="20">20</option>
      </select>

      <label>Difficulty:</label>
      <select id="difficulty">
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard" selected>Hard</option>
      </select>

      <label>Time Limit:</label>
      <select id="timeLimit">
        <option value="30">30 seconds</option>
        <option value="60" selected>1 minute</option>
        <option value="120">2 minutes</option>
      </select>

      <button class="start-btn" onclick="initQuiz()">Start Quiz 🚀</button>
    </div>
  `;
}

function initQuiz() {
  selectedCount = parseInt(document.getElementById("questionCount").value);
  selectedDifficulty = document.getElementById("difficulty").value;
  selectedTime = parseInt(document.getElementById("timeLimit").value);
  TOTAL_TIME = selectedTime;
  startQuiz();
}

function startQuiz() {
  currentIndex = 0;
  score = 0;
  attempts = 0;
  timeLeft = TOTAL_TIME;
  if (timer) clearInterval(timer);

  Questions = generateMathQuestions(selectedCount, selectedDifficulty);

  if (bgMusic) {
    bgMusic.play().catch(() => {});
    musicPlaying = true;
  }

  loadQuestion();
  startTimer();
}

function restartQuizSameSettings() {
  startQuiz();
}

function startTimer() {
  updateTimerUI();
  timer = setInterval(() => {
    timeLeft--;
    updateTimerUI();
    updateTimeProgressBar();
    if (timeLeft <= 0) {
      clearInterval(timer);
      endQuiz();
    }
  }, 1000);
}

function updateTimerUI() {
  const timerDisplay = document.getElementById("timer");
  if (timerDisplay) timerDisplay.textContent = `⏳ ${timeLeft}s`;
}

function updateTimeProgressBar() {
  const bar = document.getElementById("progress-bar");
  if (!bar) return;
  const elapsed = TOTAL_TIME - timeLeft;
  const percent = Math.min(100, (elapsed / TOTAL_TIME) * 100);
  bar.style.width = percent + "%";
}

function loadQuestion() {
  const container = document.getElementById("quiz-container");
  if (!container) return;

  if (currentIndex >= Questions.length) {
    currentIndex = 0;
  }

  const questionData = Questions[currentIndex];

  container.innerHTML = `
    <button id="music-toggle" onclick="toggleMusic()">Stop the music</button>
    <button class="restart-btn" onclick="restartQuizSameSettings()" style="margin-left:10px;">Restart 🔄</button>

    <div id="top-row" style="display:flex; gap:10px; align-items:center; flex-wrap:wrap; margin-top:10px;">
      <div id="timer" style="font-size:18px;">⏳ ${timeLeft}s</div>
      <div id="scorebox" style="font-size:16px;">✅ Score: ${score} | 📝 Attempts: ${attempts}</div>
    </div>
    <div class="progress-bar-container">
      <div class="progress-bar" id="progress-bar" style="width:0%;"></div>
    </div>
    <h2 id="question" class="question-animate" style="margin-top:10px;">${questionData.q}</h2>
    <div id="options"></div>
  `;

  updateTimeProgressBar();

  const optionsContainer = document.getElementById("options");
  let delay = 0;
  questionData.options.forEach((option) => {
    const btn = document.createElement("button");
    btn.textContent = option;
    btn.className = "option-btn";
    btn.onclick = () => checkAnswer(btn, option);
    optionsContainer.appendChild(btn);
    setTimeout(() => btn.classList.add("option-animate"), delay);
    delay += 120;
  });
}

function checkAnswer(button, selectedOption) {
  const correctAnswer = Questions[currentIndex].answer;
  const allButtons = document.querySelectorAll(".option-btn");

  attempts++;

  if (selectedOption === correctAnswer) {
    button.classList.add("correct");
    try {
      correctSound && correctSound.play();
    } catch {}
    score++;
  } else {
    button.classList.add("wrong", "shake");
    try {
      wrongSound && wrongSound.play();
    } catch {}
    allButtons.forEach((b) => {
      if (b.textContent === correctAnswer) b.classList.add("correct");
    });
  }

  allButtons.forEach((b) => (b.disabled = true));

  setTimeout(() => {
    if (timeLeft <= 0) return endQuiz();
    currentIndex++;
    loadQuestion();
  }, 500);
}

function endQuiz() {
  if (timer) clearInterval(timer);

  const container = document.getElementById("quiz-container");
  if (!container) return;

  const accuracy = attempts ? Math.round((score / attempts) * 100) : 0;

  // تحديد عدد النجوم حسب الدقة
  let stars = "";
  const fullStars = Math.floor(accuracy / 20); // كل 20% = نجمة
  for (let i = 0; i < fullStars; i++) stars += "⭐";
  for (let i = fullStars; i < 5; i++) stars += "☆";

  const key = "quizScores";
  const prev = JSON.parse(localStorage.getItem(key) || "[]");
  const record = {
    score,
    attempts,
    accuracy,
    date: new Date().toLocaleString(),
    duration: TOTAL_TIME,
    difficulty: selectedDifficulty,
  };
  prev.push(record);
  localStorage.setItem(key, JSON.stringify(prev));

  let tableRows = prev
    .slice()
    .reverse()
    .map(
      (s) =>
        `<tr>
            <td>${s.date}</td>
            <td>${s.difficulty}</td>
            <td>${s.score}</td>
            <td>${s.attempts}</td>
            <td>${s.accuracy}%</td>
            <td>${s.duration}s</td>
        </tr>`
    )
    .join("");

  container.innerHTML = `
        <div class="result-container">
            <h2>⏱ Time's up! 🎉</h2>
            <p>✅ Score: <b>${score}</b> &nbsp;|&nbsp; 📝 Attempts: <b>${attempts}</b> &nbsp;|&nbsp; 🎯 Accuracy: <b>${accuracy}%</b></p>
            <div class="stars">${stars}</div>
            <button class="start-btn" onclick="restartQuizSameSettings()">Restart 🔄</button>
            <button class="start-btn" onclick="showStartScreen()">Back to Menu 🔙</button>

            <h3>📜 Previous Scores:</h3>
            <table class="score-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Difficulty</th>
                        <th>Score</th>
                        <th>Attempts</th>
                        <th>Accuracy</th>
                        <th>Time</th>
                    </tr>
                </thead>
                <tbody>
                    ${tableRows}
                </tbody>
            </table>
        </div>
    `;
}

showStartScreen();