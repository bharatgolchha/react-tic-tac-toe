import React, { useState, useEffect, useRef } from 'react';
import confetti from 'https://esm.sh/canvas-confetti@1';

// Dynamic Web Audio API synthesizer for retro/modern sci-fi sound effects
const playSound = (type, isMuted) => {
  if (isMuted) return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'x') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1); // A5
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } else if (type === 'o') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(349.23, ctx.currentTime); // F4
      osc.frequency.exponentialRampToValueAtTime(261.63, ctx.currentTime + 0.15); // C4
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } else if (type === 'win') {
      const now = ctx.currentTime;
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25]; // C E G C E
      notes.forEach((freq, idx) => {
        const oscNode = ctx.createOscillator();
        const gainNode = ctx.createGain();
        oscNode.type = 'sine';
        oscNode.frequency.setValueAtTime(freq, now + idx * 0.07);
        oscNode.connect(gainNode);
        gainNode.connect(ctx.destination);
        gainNode.gain.setValueAtTime(0.08, now + idx * 0.07);
        gainNode.gain.exponentialRampToValueAtTime(0.005, now + idx * 0.07 + 0.25);
        oscNode.start(now + idx * 0.07);
        oscNode.stop(now + idx * 0.07 + 0.3);
      });
    } else if (type === 'draw') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(120, ctx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } else if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.04);
      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    }
  } catch (e) {
    console.warn("Audio Context blocked or not supported by browser security settings.", e);
  }
};

// Evaluate the board to find a winner or draw
const checkWinner = (squares) => {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: lines[i] };
    }
  }
  if (squares.every(Boolean)) {
    return { winner: 'Draw', line: null };
  }
  return null;
};

// Minimax algorithm to power the smart/unbeatable AI
const minimax = (squares, depth, isMaximizing) => {
  const result = checkWinner(squares);
  if (result) {
    if (result.winner === 'O') return 10 - depth; // AI is O
    if (result.winner === 'X') return depth - 10; // Human is X
    return 0; // Draw
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (!squares[i]) {
        squares[i] = 'O';
        let score = minimax(squares, depth + 1, false);
        squares[i] = null;
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 9; i++) {
      if (!squares[i]) {
        squares[i] = 'X';
        let score = minimax(squares, depth + 1, true);
        squares[i] = null;
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
};

// AI Engine wrapper handling Easy, Medium, and Unbeatable settings
const getBestMove = (squares, difficulty) => {
  const emptyIndices = squares.map((val, idx) => val === null ? idx : null).filter(val => val !== null);

  if (difficulty === 'easy') {
    const randIdx = Math.floor(Math.random() * emptyIndices.length);
    return emptyIndices[randIdx];
  }

  if (difficulty === 'medium') {
    if (Math.random() > 0.5) {
      const randIdx = Math.floor(Math.random() * emptyIndices.length);
      return emptyIndices[randIdx];
    }
  }

  // Unbeatable (Full Minimax recursion depth check)
  let bestScore = -Infinity;
  let bestMove = -1;
  for (let i = 0; i < 9; i++) {
    if (!squares[i]) {
      squares[i] = 'O';
      let score = minimax(squares, 0, false);
      squares[i] = null;
      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }
  return bestMove;
};

// SVG components to render dynamic and sleek glowing game figures
const XIcon = ({ className = "w-12 h-12" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const OIcon = ({ className = "w-12 h-12" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
  </svg>
);

export default function App() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [gameMode, setGameMode] = useState('ai'); // 'ai' or 'pvp'
  const [difficulty, setDifficulty] = useState('unbeatable'); // 'easy', 'medium', 'unbeatable'
  const [isMuted, setIsMuted] = useState(false);
  const [scores, setScores] = useState({ x: 0, o: 0, draws: 0 });
  const [winnerData, setWinnerData] = useState(null); // { winner, line }

  // Handle AI Move
  useEffect(() => {
    if (gameMode === 'ai' && !isXNext && !winnerData) {
      const timer = setTimeout(() => {
        const aiMove = getBestMove(board, difficulty);
        if (aiMove !== null && aiMove !== -1) {
          handleSquareClick(aiMove, true);
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isXNext, board, gameMode, difficulty, winnerData]);

  const handleSquareClick = (index, isAiMove = false) => {
    if (board[index] || winnerData) return;
    if (gameMode === 'ai' && !isXNext && !isAiMove) return; // Prevent human click during AI's turn

    const currentTurn = isXNext ? 'X' : 'O';
    const newBoard = [...board];
    newBoard[index] = currentTurn;
    setBoard(newBoard);
    playSound(currentTurn.toLowerCase(), isMuted);

    const result = checkWinner(newBoard);
    if (result) {
      setWinnerData(result);
      if (result.winner === 'Draw') {
        setScores(prev => ({ ...prev, draws: prev.draws + 1 }));
        playSound('draw', isMuted);
      } else {
        setScores(prev => ({
          ...prev,
          [result.winner.toLowerCase()]: prev[result.winner.toLowerCase()] + 1
        }));
        playSound('win', isMuted);
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 }
        });
      }
    } else {
      setIsXNext(!isXNext);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinnerData(null);
    playSound('click', isMuted);
  };

  const resetScores = () => {
    setScores({ x: 0, o: 0, draws: 0 });
    resetGame();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4 font-sans select-none selection:bg-cyan-500/30">
      {/* Background neon glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      <header className="mb-6 text-center">
        <h1 className="text-4xl md:text-5xl font-black tracking-wider bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(34,211,238,0.2)]">
          TIC TAC TOE
        </h1>
        <p className="text-slate-400 text-sm mt-2 tracking-widest uppercase">High-Tech AI Synthesized Edition</p>
      </header>

      {/* Control Panel */}
      <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 p-4 rounded-2xl flex flex-wrap gap-4 items-center justify-between w-full max-w-md mb-6 shadow-xl shadow-cyan-950/20">
        <div className="flex gap-2">
          <button
            onClick={() => { setGameMode('ai'); resetGame(); }}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition duration-200 border ${
              gameMode === 'ai'
                ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40 shadow-[0_0_10px_rgba(6,182,212,0.15)]'
                : 'text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
            }`}
          >
            VS AI
          </button>
          <button
            onClick={() => { setGameMode('pvp'); resetGame(); }}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition duration-200 border ${
              gameMode === 'pvp'
                ? 'bg-purple-500/20 text-purple-400 border-purple-500/40 shadow-[0_0_10px_rgba(168,85,247,0.15)]'
                : 'text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
            }`}
          >
            PVP
          </button>
        </div>

        <div className="flex items-center gap-3">
          {gameMode === 'ai' && (
            <select
              value={difficulty}
              onChange={(e) => { setDifficulty(e.target.value); resetGame(); }}
              className="bg-slate-950 border border-slate-800 text-xs font-bold text-slate-300 rounded-xl px-3 py-2 outline-none focus:border-cyan-500 cursor-pointer"
            >
              <option value="easy">EASY</option>
              <option value="medium">MEDIUM</option>
              <option value="unbeatable">UNBEATABLE</option>
            </select>
          )}

          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 border border-slate-800 hover:border-slate-700 rounded-xl text-slate-400 hover:text-white transition"
            title={isMuted ? 'Unmute Sounds' : 'Mute Sounds'}
          >
            {isMuted ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6L4.5 9H1.5v6h3l4.5 3.75V5.25z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Scoreboard */}
      <div className="grid grid-cols-3 gap-3 w-full max-w-md mb-6 text-center">
        <div className="bg-slate-900/40 border border-slate-800 p-3 rounded-2xl">
          <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Player X</div>
          <div className="text-2xl font-black text-cyan-400">{scores.x}</div>
        </div>
        <div className="bg-slate-900/40 border border-slate-800 p-3 rounded-2xl">
          <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Draws</div>
          <div className="text-2xl font-black text-slate-300">{scores.draws}</div>
        </div>
        <div className="bg-slate-900/40 border border-slate-800 p-3 rounded-2xl">
          <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">{gameMode === 'ai' ? 'AI (O)' : 'Player O'}</div>
          <div className="text-2xl font-black text-purple-400">{scores.o}</div>
        </div>
      </div>

      {/* Game Board */}
      <div className="relative bg-slate-900/80 border border-slate-800 p-6 rounded-3xl shadow-2xl shadow-cyan-950/20 mb-6 w-full max-w-md aspect-square flex flex-col justify-between">
        {/* Status text */}
        <div className="text-center mb-4 min-h-[24px]">
          {winnerData ? (
            winnerData.winner === 'Draw' ? (
              <span className="text-slate-300 font-black tracking-wide">IT'S A DRAW!</span>
            ) : (
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent font-black tracking-wide">
                WINNER: {winnerData.winner}!
              </span>
            )
          ) : (
            <span className="text-slate-400 font-medium">
              {isXNext ? (
                <span className="text-cyan-400 font-bold">X's Turn</span>
              ) : (
                <span className="text-purple-400 font-bold">{gameMode === 'ai' ? "AI is thinking..." : "O's Turn"}</span>
              )}
            </span>
          )}
        </div>

        {/* 3x3 Grid */}
        <div className="grid grid-cols-3 gap-4 h-full">
          {board.map((square, index) => {
            const isWinningSquare = winnerData?.line?.includes(index);
            return (
              <button
                key={index}
                onClick={() => handleSquareClick(index)}
                className={`aspect-square flex items-center justify-center rounded-2xl transition-all duration-300 border outline-none ${
                  square ? 'cursor-default' : 'hover:bg-slate-800/50 hover:border-slate-700'
                } ${
                  isWinningSquare
                    ? 'bg-emerald-500/10 border-emerald-500/80 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)] animate-pulse'
                    : square === 'X'
                    ? 'border-cyan-500/20 text-cyan-400 hover:border-cyan-500/30'
                    : square === 'O'
                    ? 'border-purple-500/20 text-purple-400 hover:border-purple-500/30'
                    : 'bg-slate-950/40 border-slate-850'
                }`}
              >
                {square === 'X' && <XIcon className="w-10 h-10 md:w-12 md:h-12 drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]" />}
                {square === 'O' && <OIcon className="w-10 h-10 md:w-12 md:h-12 drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Primary Actions */}
      <div className="flex gap-4 w-full max-w-md">
        <button
          onClick={resetGame}
          className="flex-1 bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 font-extrabold text-sm uppercase tracking-wider py-3.5 px-6 rounded-2xl shadow-lg shadow-cyan-500/20 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 text-white"
        >
          {winnerData ? 'Play Again' : 'Reset Round'}
        </button>
        <button
          onClick={resetScores}
          className="px-6 py-3.5 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition rounded-2xl text-xs font-bold uppercase tracking-wider"
        >
          Reset Stats
        </button>
      </div>

      <footer className="mt-8 text-xs text-slate-600">
        Design & Synth Code crafted with 🩵
      </footer>
    </div>
  );
}
