# Mathematics Questions (Math Quiz)

A small, polished **vanilla HTML/CSS/JavaScript** math quiz game. Players answer randomly generated arithmetic expressions under a countdown timer and can review previous results.

## Features

- **Start menu configuration**
  - Choose number of questions: **10 / 15 / 20**
  - Choose difficulty: **Easy / Medium / Hard**
  - Choose time limit: **30s / 60s / 120s**
- **Multiple-choice questions** (4 options each)
- **Timer-based gameplay** (quiz ends when time runs out)
- **Instant feedback**
  - Correct / wrong sound effects
  - Visual highlight of correct answers after a wrong selection
- **Score summary**
  - Score, attempts, and **accuracy %**
  - Star rating based on accuracy
- **Persistent history**
  - Previous attempts are saved in **`localStorage`** (`quizScores`) and displayed in a table after each run
- **Background music** (looping) with a toggle button

## Live demo / Running locally

Because this is a static web app, you can run it by either:

### Option A (quickest)
- Open `index.html` in your browser.

### Option B (recommended)
- Use a simple local server (to avoid any browser restrictions around local file access).
- Example with VS Code:
  - Install the “**Live Server**” extension
  - Click **Go Live**

## How scoring works

- **Score** increases by **+1** for every correct answer.
- **Attempts** increments on every question.
- **Accuracy %** = `round((score / attempts) * 100)`
- **Stars** are computed as:
  - `fullStars = Math.floor(accuracy / 20)`
  - Up to **5** total stars (gold stars for fullStars, the rest are outlined stars).

## Project structure

- `index.html` – application shell and assets wiring
- `index.css` – all styling/animations
- `index.js` – quiz generation, timer, scoring, and history rendering
- Assets:
  - `icon.png`
  - `Mathematics.webp` (background)
  - `correct.mp3` / `wrong.mp3` (sound effects)
  - `relax.mp3` (background music)

## Notes

- The quiz expressions are evaluated in the browser code.
- The app is **client-side only** (no backend).
- Previous scores are stored only on the current browser/device via `localStorage`.

## License

Add your preferred license here (e.g., MIT).
