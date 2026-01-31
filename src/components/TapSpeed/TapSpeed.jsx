import React, { useState, useEffect, useRef, useCallback } from 'react';
import { RotateCcw, Play, Zap } from 'lucide-react';

const TapSpeed = ({ embedded = false }) => {
  const [taps, setTaps] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [gameActive, setGameActive] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [cps, setCps] = useState(0);
  const [bestCps, setBestCps] = useState(0);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    const savedHighScore = localStorage.getItem('tap-high-score');
    const savedBestCps = localStorage.getItem('tap-best-cps');
    if (savedHighScore) setHighScore(parseInt(savedHighScore));
    if (savedBestCps) setBestCps(parseFloat(savedBestCps));
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Calculate CPS in real-time
  useEffect(() => {
    if (gameActive && startTimeRef.current) {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      if (elapsed > 0) {
        setCps((taps / elapsed).toFixed(1));
      }
    }
  }, [taps, gameActive]);

  const startGame = useCallback(() => {
    setTaps(0);
    setTimeLeft(10);
    setGameActive(true);
    setGameOver(false);
    setCps(0);
    startTimeRef.current = Date.now();

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const endGame = useCallback(() => {
    setGameActive(false);
    setGameOver(true);
    if (timerRef.current) clearInterval(timerRef.current);
    
    setTaps(prev => {
      if (prev > highScore) {
        setHighScore(prev);
        localStorage.setItem('tap-high-score', prev.toString());
      }
      
      const finalCps = prev / 10;
      if (finalCps > bestCps) {
        setBestCps(finalCps);
        localStorage.setItem('tap-best-cps', finalCps.toString());
      }
      
      return prev;
    });
  }, [highScore, bestCps]);

  const handleTap = () => {
    if (!gameActive) return;
    setTaps(prev => prev + 1);
  };

  const getRating = () => {
    if (taps >= 100) return { text: 'SUPERHUMAN! 🦸', color: 'text-purple-400' };
    if (taps >= 80) return { text: 'INCREDIBLE! 🔥', color: 'text-red-400' };
    if (taps >= 60) return { text: 'AMAZING! ⚡', color: 'text-yellow-400' };
    if (taps >= 40) return { text: 'GREAT! 👍', color: 'text-green-400' };
    if (taps >= 20) return { text: 'GOOD! 👌', color: 'text-blue-400' };
    return { text: 'KEEP PRACTICING! 💪', color: 'text-white/60' };
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
            👆 Tap Speed
          </h1>
          <button onClick={startGame} className="p-2 hover:bg-white/10 rounded-lg">
            <RotateCcw className={embedded ? 'w-3.5 h-3.5 text-white' : 'w-5 h-5 text-white'} />
          </button>
        </div>

        {/* Stats */}
        <div className={embedded ? 'bg-white/10 backdrop-blur-md rounded-xl px-2.5 py-1.5 border border-white/10' : 'bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20'}>
          <div className="flex items-center justify-center gap-4">
            <div className={embedded ? 'text-[11px]' : ''}>
              <span className="text-white/60">Taps: </span>
              <span className="font-bold text-green-400">{taps}</span>
            </div>
            {gameActive && (
              <div className={embedded ? 'text-[11px]' : ''}>
                <span className="text-white/60">CPS: </span>
                <span className="font-bold text-cyan-400">{cps}</span>
              </div>
            )}
            <div className={embedded ? 'text-[11px]' : ''}>
              <span className="text-white/60">Time: </span>
              <span className={`font-bold ${timeLeft <= 3 ? 'text-red-400' : 'text-yellow-400'}`}>{timeLeft}s</span>
            </div>
            <div className={embedded ? 'text-[11px]' : ''}>
              <span className="text-white/60">Best: </span>
              <span className="font-bold text-purple-400">{highScore}</span>
            </div>
          </div>
        </div>

        {/* Game Area */}
        <div className="flex-1 flex items-center justify-center min-h-0">
          {!gameActive && !gameOver ? (
            <button
              onClick={startGame}
              className={`
                flex flex-col items-center gap-3 px-8 py-6 rounded-2xl
                bg-gradient-to-br from-orange-500 to-red-600
                hover:from-orange-400 hover:to-red-500
                transition-all duration-200 hover:scale-105 active:scale-95
              `}
            >
              <Play className={embedded ? 'w-8 h-8' : 'w-12 h-12'} />
              <span className={embedded ? 'text-lg font-bold' : 'text-2xl font-bold'}>Start Test</span>
              <span className={`text-white/60 ${embedded ? 'text-[10px]' : 'text-xs'}`}>10 Seconds</span>
            </button>
          ) : gameOver ? (
            <div className="text-center">
              <h2 className={`font-bold text-white mb-2 ${embedded ? 'text-xl' : 'text-3xl'}`}>
                👆 Results
              </h2>
              <p className={`font-bold mb-4 ${getRating().color} ${embedded ? 'text-lg' : 'text-2xl'}`}>
                {getRating().text}
              </p>
              <div className={`space-y-2 mb-4 ${embedded ? 'text-sm' : 'text-lg'}`}>
                <p className="text-white/80">
                  Total Taps: <span className="text-green-400 font-bold">{taps}</span>
                </p>
                <p className="text-white/80">
                  Taps Per Second: <span className="text-cyan-400 font-bold">{(taps / 10).toFixed(1)}</span>
                </p>
              </div>
              {taps >= highScore && taps > 0 && (
                <p className="text-yellow-400 mb-4">🏆 New High Score!</p>
              )}
              <button
                onClick={startGame}
                className="px-6 py-3 bg-orange-500 rounded-xl font-bold hover:bg-orange-400 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : (
            <button
              onClick={handleTap}
              className={`
                flex flex-col items-center justify-center rounded-full
                bg-gradient-to-br from-orange-500 to-red-600
                transition-all duration-100 
                hover:from-orange-400 hover:to-red-500
                active:scale-95 active:from-orange-600 active:to-red-700
                shadow-lg shadow-orange-500/50
                ${embedded ? 'w-40 h-40' : 'w-56 h-56'}
              `}
            >
              <Zap className={`${embedded ? 'w-12 h-12' : 'w-20 h-20'} ${taps > 0 ? 'animate-pulse' : ''}`} />
              <span className={`font-bold mt-2 ${embedded ? 'text-2xl' : 'text-4xl'}`}>TAP!</span>
            </button>
          )}
        </div>

        {/* Progress Bar */}
        {gameActive && (
          <div className="w-full bg-white/10 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${(timeLeft / 10) * 100}%` }}
            />
          </div>
        )}

        <div className={embedded ? 'text-center text-white/50 text-[8px]' : 'text-center text-white/50 text-xs'}>
          <p>Tap as fast as you can in 10 seconds!</p>
        </div>
      </div>
    </div>
  );
};

export default TapSpeed;
