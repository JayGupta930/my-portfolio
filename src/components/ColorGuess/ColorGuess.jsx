import React, { useState, useEffect, useCallback } from 'react';
import { RotateCcw } from 'lucide-react';

const ColorGuess = ({ embedded = false }) => {
  const [targetColor, setTargetColor] = useState('');
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('color-high-score');
    if (saved) setHighScore(parseInt(saved));
  }, []);

  const generateRandomColor = useCallback(() => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
  }, []);

  const generateRound = useCallback(() => {
    const correct = generateRandomColor();
    const wrongOptions = Array(5).fill(null).map(() => generateRandomColor());
    const allOptions = [correct, ...wrongOptions].sort(() => Math.random() - 0.5);
    
    setTargetColor(correct);
    setOptions(allOptions);
    setFeedback(null);
  }, [generateRandomColor]);

  const startGame = useCallback(() => {
    setScore(0);
    setStreak(0);
    setLives(3);
    setGameOver(false);
    generateRound();
  }, [generateRound]);

  useEffect(() => {
    startGame();
  }, []);

  const handleGuess = (color) => {
    if (feedback || gameOver) return;

    if (color === targetColor) {
      const points = 10 + streak * 2;
      setScore(prev => {
        const newScore = prev + points;
        if (newScore > highScore) {
          setHighScore(newScore);
          localStorage.setItem('color-high-score', newScore.toString());
        }
        return newScore;
      });
      setStreak(prev => prev + 1);
      setFeedback({ correct: true, message: `+${points} points!` });
    } else {
      setStreak(0);
      setLives(prev => {
        if (prev <= 1) {
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
      setFeedback({ correct: false, message: 'Wrong!' });
    }

    if (!gameOver) {
      setTimeout(() => {
        generateRound();
      }, 1000);
    }
  };

  const containerClass = embedded
    ? 'w-full h-full flex flex-col p-2'
    : 'min-h-screen bg-black flex items-center justify-center p-4';

  return (
    <div className={containerClass}>
      <div className="flex flex-col w-full h-full gap-2 text-white">
        {/* Header */}
        <div className="text-center">
          <h1 className={embedded ? 'text-xl font-bold text-white mb-0.5' : 'text-4xl font-bold text-white mb-2'}>
            🎨 Color Guess
          </h1>
        </div>

        {/* Stats */}
        <div className={embedded ? 'bg-white/10 backdrop-blur-md rounded-xl px-2.5 py-1.5 border border-white/10' : 'bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20'}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={embedded ? 'text-[11px]' : ''}>
                <span className="text-white/60">Score: </span>
                <span className="font-bold text-green-400">{score}</span>
              </div>
              <div className={embedded ? 'text-[11px]' : ''}>
                <span className="text-white/60">Streak: </span>
                <span className="font-bold text-yellow-400">{streak}🔥</span>
              </div>
              <div className={embedded ? 'text-[11px]' : ''}>
                <span className="text-red-400">{'❤️'.repeat(lives)}</span>
              </div>
            </div>
            <button onClick={startGame} className="p-2 hover:bg-white/10 rounded-lg">
              <RotateCcw className={embedded ? 'w-3.5 h-3.5 text-white' : 'w-5 h-5 text-white'} />
            </button>
          </div>
        </div>

        {/* Target Color Display */}
        <div className="text-center">
          <p className={embedded ? 'text-[10px] text-white/60 mb-1' : 'text-sm text-white/60 mb-2'}>
            Find this color:
          </p>
          <div 
            className={`mx-auto rounded-lg font-mono font-bold bg-white/10 border border-white/20 flex items-center justify-center ${embedded ? 'text-xs px-2 py-1' : 'text-lg px-4 py-2'}`}
          >
            {targetColor}
          </div>
        </div>

        {/* Color Options */}
        <div className="flex-1 flex items-center justify-center min-h-0">
          <div className={`grid grid-cols-3 gap-2 ${embedded ? 'max-w-[240px]' : 'max-w-sm'} w-full`}>
            {options.map((color, index) => (
              <button
                key={index}
                onClick={() => handleGuess(color)}
                disabled={!!feedback || gameOver}
                className={`
                  aspect-square rounded-xl transition-all duration-200 border-2
                  ${feedback && color === targetColor 
                    ? 'border-green-400 ring-4 ring-green-400/50 scale-105' 
                    : feedback && color !== targetColor
                      ? 'opacity-50 border-transparent'
                      : 'border-white/20 hover:scale-105 hover:border-white/40'
                  }
                `}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        {/* Feedback */}
        {feedback && (
          <div className={`text-center ${feedback.correct ? 'text-green-400' : 'text-red-400'} font-bold ${embedded ? 'text-sm' : 'text-lg'}`}>
            {feedback.message}
          </div>
        )}

        <div className={embedded ? 'text-center text-white/50 text-[8px]' : 'text-center text-white/50 text-xs'}>
          <p>Match the RGB value to the color</p>
        </div>

        {/* Game Over Overlay */}
        {gameOver && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur flex items-center justify-center z-20 rounded-3xl">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 text-center">
              <h2 className="text-2xl font-bold text-white mb-3">🎨 Game Over!</h2>
              <p className="text-white/80 mb-2">Final Score: <span className="font-bold text-green-400">{score}</span></p>
              <p className="text-white/60 text-sm mb-4">Best: {highScore}</p>
              <button
                onClick={startGame}
                className="bg-pink-500 text-white px-5 py-2 rounded-lg font-semibold hover:bg-pink-600 transition-colors"
              >
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ColorGuess;
