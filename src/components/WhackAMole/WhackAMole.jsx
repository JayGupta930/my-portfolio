import React, { useState, useEffect, useRef, useCallback } from 'react';
import { RotateCcw, Play } from 'lucide-react';

const WhackAMole = ({ embedded = false }) => {
  const [moles, setMoles] = useState(Array(9).fill(false));
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameActive, setGameActive] = useState(false);
  const [lastHit, setLastHit] = useState(null);
  const [difficulty, setDifficulty] = useState(800);
  const moleTimerRef = useRef(null);
  const gameTimerRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem('whack-high-score');
    if (saved) setHighScore(parseInt(saved));
  }, []);

  useEffect(() => {
    return () => {
      if (moleTimerRef.current) clearInterval(moleTimerRef.current);
      if (gameTimerRef.current) clearInterval(gameTimerRef.current);
    };
  }, []);

  const showRandomMole = useCallback(() => {
    const moleIndex = Math.floor(Math.random() * 9);
    setMoles(prev => {
      const newMoles = [...prev];
      newMoles.fill(false);
      newMoles[moleIndex] = true;
      return newMoles;
    });

    setTimeout(() => {
      setMoles(prev => {
        const newMoles = [...prev];
        newMoles[moleIndex] = false;
        return newMoles;
      });
    }, difficulty - 100);
  }, [difficulty]);

  const startGame = useCallback(() => {
    setScore(0);
    setTimeLeft(30);
    setGameActive(true);
    setMoles(Array(9).fill(false));
    setDifficulty(800);

    moleTimerRef.current = setInterval(() => {
      showRandomMole();
    }, 800);

    gameTimerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        // Increase difficulty as time passes
        if (prev === 20) {
          setDifficulty(600);
          clearInterval(moleTimerRef.current);
          moleTimerRef.current = setInterval(showRandomMole, 600);
        } else if (prev === 10) {
          setDifficulty(400);
          clearInterval(moleTimerRef.current);
          moleTimerRef.current = setInterval(showRandomMole, 400);
        }
        return prev - 1;
      });
    }, 1000);
  }, [showRandomMole]);

  const endGame = useCallback(() => {
    setGameActive(false);
    if (moleTimerRef.current) clearInterval(moleTimerRef.current);
    if (gameTimerRef.current) clearInterval(gameTimerRef.current);
    setMoles(Array(9).fill(false));
    
    setScore(prev => {
      if (prev > highScore) {
        setHighScore(prev);
        localStorage.setItem('whack-high-score', prev.toString());
      }
      return prev;
    });
  }, [highScore]);

  const whackMole = (index) => {
    if (!gameActive || !moles[index]) return;
    
    setMoles(prev => {
      const newMoles = [...prev];
      newMoles[index] = false;
      return newMoles;
    });
    
    setScore(prev => prev + 10);
    setLastHit(index);
    setTimeout(() => setLastHit(null), 200);
  };

  const containerClass = embedded
    ? 'w-full h-full flex flex-col p-2'
    : 'min-h-screen bg-black flex items-center justify-center p-4';

  return (
    <div className={containerClass}>
      <div className="flex flex-col w-full h-full gap-2 text-white">
        {/* Header */}
        <div className="text-center flex items-center justify-between">
          <h1 className={embedded ? 'text-lg font-bold text-white' : 'text-4xl font-bold text-white'}>
            🔨 Whack-a-Mole
          </h1>
          <button onClick={startGame} className="p-2 hover:bg-white/10 rounded-lg">
            <RotateCcw className={embedded ? 'w-3.5 h-3.5 text-white' : 'w-5 h-5 text-white'} />
          </button>
        </div>

        {/* Stats */}
        <div className={embedded ? 'bg-white/10 backdrop-blur-md rounded-xl px-2.5 py-1.5 border border-white/10' : 'bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20'}>
          <div className="flex items-center justify-center gap-4">
            <div className={embedded ? 'text-[11px]' : ''}>
              <span className="text-white/60">Score: </span>
              <span className="font-bold text-green-400">{score}</span>
            </div>
            <div className={embedded ? 'text-[11px]' : ''}>
              <span className="text-white/60">Time: </span>
              <span className={`font-bold ${timeLeft <= 10 ? 'text-red-400' : 'text-yellow-400'}`}>{timeLeft}s</span>
            </div>
            <div className={embedded ? 'text-[11px]' : ''}>
              <span className="text-white/60">Best: </span>
              <span className="font-bold text-purple-400">{highScore}</span>
            </div>
          </div>
        </div>

        {/* Game Board */}
        <div className="flex-1 flex items-center justify-center min-h-0">
          {!gameActive && timeLeft === 30 ? (
            <button
              onClick={startGame}
              className={`
                flex flex-col items-center gap-3 px-8 py-6 rounded-2xl
                bg-gradient-to-br from-green-500 to-emerald-600
                hover:from-green-400 hover:to-emerald-500
                transition-all duration-200 hover:scale-105 active:scale-95
              `}
            >
              <Play className={embedded ? 'w-8 h-8' : 'w-12 h-12'} />
              <span className={embedded ? 'text-lg font-bold' : 'text-2xl font-bold'}>Start Game</span>
            </button>
          ) : !gameActive && timeLeft === 0 ? (
            <div className="text-center">
              <h2 className={`font-bold text-white mb-4 ${embedded ? 'text-xl' : 'text-3xl'}`}>
                🎉 Game Over!
              </h2>
              <p className={`text-white/80 mb-2 ${embedded ? 'text-sm' : 'text-lg'}`}>
                Final Score: <span className="text-green-400 font-bold">{score}</span>
              </p>
              {score >= highScore && score > 0 && (
                <p className="text-yellow-400 mb-4">🏆 New High Score!</p>
              )}
              <button
                onClick={startGame}
                className="px-6 py-3 bg-green-500 rounded-xl font-bold hover:bg-green-400 transition-colors"
              >
                Play Again
              </button>
            </div>
          ) : (
            <div className={`grid grid-cols-3 gap-2 sm:gap-3 ${embedded ? 'max-w-[240px]' : 'max-w-sm'} w-full`}>
              {moles.map((isUp, index) => (
                <button
                  key={index}
                  onClick={() => whackMole(index)}
                  className={`
                    aspect-square rounded-xl transition-all duration-100
                    flex items-center justify-center
                    ${embedded ? 'text-3xl' : 'text-5xl'}
                    ${isUp 
                      ? 'bg-gradient-to-br from-amber-500 to-orange-600 scale-110 shadow-lg shadow-orange-500/50' 
                      : 'bg-gradient-to-br from-amber-900/50 to-orange-900/50'
                    }
                    ${lastHit === index ? 'ring-4 ring-green-400 scale-95' : ''}
                    border-2 border-white/10
                    active:scale-90
                  `}
                >
                  {isUp ? '🐹' : '🕳️'}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className={embedded ? 'text-center text-white/50 text-[8px]' : 'text-center text-white/50 text-xs'}>
          <p>Tap the moles as fast as you can!</p>
        </div>
      </div>
    </div>
  );
};

export default WhackAMole;
