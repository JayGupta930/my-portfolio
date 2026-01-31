import React, { useState, useEffect, useCallback, useRef } from 'react';
import { RotateCcw, Play, Target } from 'lucide-react';

const TargetShoot = ({ embedded = false }) => {
  const [targets, setTargets] = useState([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameActive, setGameActive] = useState(false);
  const [combo, setCombo] = useState(0);
  const [misses, setMisses] = useState(0);
  const [hitEffect, setHitEffect] = useState(null);
  const gameAreaRef = useRef(null);
  const targetIdRef = useRef(0);
  const gameTimerRef = useRef(null);
  const targetTimerRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem('target-high-score');
    if (saved) setHighScore(parseInt(saved));
  }, []);

  useEffect(() => {
    return () => {
      if (gameTimerRef.current) clearInterval(gameTimerRef.current);
      if (targetTimerRef.current) clearInterval(targetTimerRef.current);
    };
  }, []);

  const spawnTarget = useCallback(() => {
    targetIdRef.current += 1;
    const size = Math.random() * 30 + 20; // 20-50px
    const x = Math.random() * 80 + 5; // 5-85%
    const y = Math.random() * 70 + 5; // 5-75%
    const isGolden = Math.random() < 0.1;
    const lifetime = isGolden ? 1500 : 2500;
    
    const newTarget = {
      id: targetIdRef.current,
      x,
      y,
      size,
      isGolden,
      points: isGolden ? 50 : Math.round((50 - size) + 10),
      createdAt: Date.now(),
      lifetime
    };
    
    setTargets(prev => [...prev, newTarget]);
    
    // Remove target after lifetime
    setTimeout(() => {
      setTargets(prev => {
        const target = prev.find(t => t.id === newTarget.id);
        if (target) {
          setMisses(m => m + 1);
          setCombo(0);
        }
        return prev.filter(t => t.id !== newTarget.id);
      });
    }, lifetime);
  }, []);

  const startGame = useCallback(() => {
    setScore(0);
    setTimeLeft(30);
    setGameActive(true);
    setTargets([]);
    setCombo(0);
    setMisses(0);
    targetIdRef.current = 0;

    // Spawn targets
    targetTimerRef.current = setInterval(() => {
      spawnTarget();
    }, 800);

    // Game timer
    gameTimerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        // Speed up spawning over time
        if (prev === 20) {
          clearInterval(targetTimerRef.current);
          targetTimerRef.current = setInterval(spawnTarget, 600);
        } else if (prev === 10) {
          clearInterval(targetTimerRef.current);
          targetTimerRef.current = setInterval(spawnTarget, 400);
        }
        return prev - 1;
      });
    }, 1000);
  }, [spawnTarget]);

  const endGame = useCallback(() => {
    setGameActive(false);
    if (gameTimerRef.current) clearInterval(gameTimerRef.current);
    if (targetTimerRef.current) clearInterval(targetTimerRef.current);
    setTargets([]);
    
    setScore(prev => {
      if (prev > highScore) {
        setHighScore(prev);
        localStorage.setItem('target-high-score', prev.toString());
      }
      return prev;
    });
  }, [highScore]);

  const hitTarget = (target, e) => {
    e.stopPropagation();
    if (!gameActive) return;
    
    const comboBonus = combo * 2;
    const points = target.points + comboBonus;
    
    setScore(prev => prev + points);
    setCombo(prev => prev + 1);
    setTargets(prev => prev.filter(t => t.id !== target.id));
    
    setHitEffect({ x: target.x, y: target.y, points, isGolden: target.isGolden });
    setTimeout(() => setHitEffect(null), 400);
  };

  const handleMiss = (e) => {
    if (!gameActive) return;
    // Only count as miss if clicking empty area
    if (e.target === gameAreaRef.current) {
      setCombo(0);
    }
  };

  const accuracy = score > 0 ? Math.round((score / (score + misses * 10)) * 100) : 0;

  const containerClass = embedded
    ? 'w-full h-full flex flex-col p-2'
    : 'min-h-screen bg-black flex items-center justify-center p-4';

  return (
    <div className={containerClass}>
      <div className="flex flex-col w-full h-full gap-2 text-white">
        {/* Header */}
        <div className="text-center flex items-center justify-between">
          <h1 className={embedded ? 'text-lg font-bold text-white' : 'text-4xl font-bold text-white'}>
            🎯 Target Shoot
          </h1>
          <button onClick={startGame} className="p-2 hover:bg-white/10 rounded-lg">
            <RotateCcw className={embedded ? 'w-3.5 h-3.5 text-white' : 'w-5 h-5 text-white'} />
          </button>
        </div>

        {/* Stats */}
        <div className={embedded ? 'bg-white/10 backdrop-blur-md rounded-xl px-2.5 py-1.5 border border-white/10' : 'bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20'}>
          <div className="flex items-center justify-center gap-3 sm:gap-4">
            <div className={embedded ? 'text-[11px]' : ''}>
              <span className="text-white/60">Score: </span>
              <span className="font-bold text-green-400">{score}</span>
            </div>
            <div className={embedded ? 'text-[11px]' : ''}>
              <span className="text-white/60">Time: </span>
              <span className={`font-bold ${timeLeft <= 10 ? 'text-red-400' : 'text-yellow-400'}`}>{timeLeft}s</span>
            </div>
            {combo > 1 && (
              <div className={embedded ? 'text-[11px]' : ''}>
                <span className="font-bold text-orange-400">x{combo} 🔥</span>
              </div>
            )}
            <div className={embedded ? 'text-[11px]' : ''}>
              <span className="text-white/60">Best: </span>
              <span className="font-bold text-purple-400">{highScore}</span>
            </div>
          </div>
        </div>

        {/* Game Area */}
        <div 
          ref={gameAreaRef}
          onClick={handleMiss}
          className="flex-1 relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-800/50 to-slate-900/50 border border-white/10 min-h-0 cursor-crosshair"
        >
          {!gameActive && timeLeft === 30 ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={startGame}
                className={`
                  flex flex-col items-center gap-3 px-8 py-6 rounded-2xl
                  bg-gradient-to-br from-red-500 to-orange-600
                  hover:from-red-400 hover:to-orange-500
                  transition-all duration-200 hover:scale-105 active:scale-95
                `}
              >
                <Target className={embedded ? 'w-8 h-8' : 'w-12 h-12'} />
                <span className={embedded ? 'text-lg font-bold' : 'text-2xl font-bold'}>Start Game</span>
              </button>
            </div>
          ) : !gameActive && timeLeft === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
              <div className="text-center p-6">
                <h2 className={`font-bold text-white mb-4 ${embedded ? 'text-xl' : 'text-3xl'}`}>
                  🎯 Game Over!
                </h2>
                <p className={`text-white/80 mb-2 ${embedded ? 'text-sm' : 'text-lg'}`}>
                  Final Score: <span className="text-green-400 font-bold">{score}</span>
                </p>
                <p className={`text-white/60 mb-4 ${embedded ? 'text-xs' : 'text-sm'}`}>
                  Accuracy: {accuracy}%
                </p>
                {score >= highScore && score > 0 && (
                  <p className="text-yellow-400 mb-4">🏆 New High Score!</p>
                )}
                <button
                  onClick={startGame}
                  className="px-6 py-3 bg-red-500 rounded-xl font-bold hover:bg-red-400 transition-colors"
                >
                  Play Again
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Targets */}
              {targets.map((target) => (
                <button
                  key={target.id}
                  onClick={(e) => hitTarget(target, e)}
                  style={{
                    left: `${target.x}%`,
                    top: `${target.y}%`,
                    width: `${target.size}px`,
                    height: `${target.size}px`,
                  }}
                  className={`
                    absolute -translate-x-1/2 -translate-y-1/2
                    rounded-full transition-transform duration-100
                    hover:scale-110 active:scale-90
                    ${target.isGolden 
                      ? 'bg-gradient-to-br from-yellow-400 to-amber-500 animate-pulse ring-2 ring-yellow-300' 
                      : 'bg-gradient-to-br from-red-500 to-red-700'
                    }
                    shadow-lg
                  `}
                >
                  <div className="absolute inset-1 rounded-full bg-white/20" />
                  <div className="absolute inset-2 rounded-full bg-white/30" />
                  <div className="absolute inset-3 rounded-full bg-red-400/50" />
                  {target.isGolden && (
                    <span className="absolute inset-0 flex items-center justify-center text-xs">⭐</span>
                  )}
                </button>
              ))}

              {/* Hit Effect */}
              {hitEffect && (
                <div
                  style={{
                    left: `${hitEffect.x}%`,
                    top: `${hitEffect.y}%`,
                  }}
                  className={`
                    absolute -translate-x-1/2 -translate-y-1/2
                    font-bold pointer-events-none animate-ping
                    ${hitEffect.isGolden ? 'text-yellow-400 text-lg' : 'text-green-400 text-sm'}
                  `}
                >
                  +{hitEffect.points}
                </div>
              )}
            </>
          )}
        </div>

        <div className={embedded ? 'text-center text-white/50 text-[8px]' : 'text-center text-white/50 text-xs'}>
          <p>Click targets to score! ⭐ = bonus</p>
        </div>
      </div>
    </div>
  );
};

export default TargetShoot;
