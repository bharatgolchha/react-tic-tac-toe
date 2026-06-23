# 🎮 High-Tech Tic-Tac-Toe Game (React)

A beautiful, responsive, and feature-rich **Tic-Tac-Toe** game built using **React**, **Tailwind CSS**, and **Canvas Confetti**. It features high-tech/neon-synth UI styling, Web Audio API-synthesized retro sound effects, a smart/unbeatable AI opponent powered by the Minimax algorithm, and local Player-vs-Player (PVP) mode.

---

## ✨ Features

- 🤖 **Smart AI Opponent:** Powered by the **Minimax algorithm**, offering three difficulty modes: **Easy**, **Medium**, and **Unbeatable** (perfect play).
- 👥 **Local PVP:** Play against a friend locally on the same screen.
- 🎵 **Synthesized Sound Effects:** Real-time audio generation using the browser's **Web Audio API** (retro-inspired blips, win chimes, and draw tones) with mute/unmute control.
- 🎉 **Victory Celebration:** Particle explosions using `canvas-confetti` when a player wins.
- 📊 **Real-time Scoreboard:** Live tracking of Player X wins, Player O wins, and Draws.
- 🎨 **Sleek Cyberpunk/Neon UI:** Smooth transitions, glassmorphic card designs, glowing effects, and responsive layout.

---

## 🛠️ Tech Stack

- **Framework:** React 18
- **Styling:** Tailwind CSS
- **Audio:** Web Audio API (Browser Native)
- **Effects:** [Canvas Confetti](https://github.com/catdad/canvas-confetti)
- **Icons:** SVG-based vector drawings

---

## 🚀 Getting Started

Follow these steps to launch and run the project locally.

### 1. Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (v16+ recommended).

### 2. Setup the Project
Create a standard React project using your favorite build tool (e.g., [Vite](https://vite.dev/)).

```bash
# Create a new Vite React app
npm create vite@latest react-tic-tac-toe -- --template react

# Move into the project directory
cd react-tic-tac-toe

# Install dependencies
npm install
npm install canvas-confetti
```

### 3. Replace the Code
- Copy the contents of `App.jsx` from this repository and replace the code in `src/App.jsx`.
- Ensure Tailwind CSS is configured in your project. If you are using Vite, follow the standard [Tailwind CSS installation guide for Vite](https://tailwindcss.com/docs/guides/vite).

### 4. Run the Development Server
```bash
npm run dev
```
Open the provided local URL (typically `http://localhost:5173`) in your browser to play the game!

---

## 🧠 Under the Hood

### Minimax AI
The unbeatable AI uses the **Minimax Algorithm**—a decision-making algorithm used in game theory to find the optimal move. It recursively evaluates all possible game outcomes to choose the path that maximizes the AI's chances of winning while minimizing the player's.

### Web Audio API Synthesizer
Instead of loading external `.mp3` or `.wav` files, the game utilizes the browser's native `AudioContext` to construct custom synthesis pipelines. It uses `sine`, `triangle`, and `sawtooth` oscillators with custom frequency and gain envelope transitions to produce lightweight, lag-free audio.

---

## 🩵 Enjoy the Game!
Feel free to fork, customize, or contribute to this project. Happy gaming!
