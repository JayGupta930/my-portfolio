import React, { useState, useEffect, useCallback, useRef } from 'react';
import { RotateCcw, Play } from 'lucide-react';

const BubblePop = ({ embedded = false }) => {
  const [bubbles, setBubbles] = useState([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameActive, setGameActive] = useState(false);
  const [combo, setCombo] = useState(0);
  const [poppedEffect, setPoppedEffect] = useState(null);
  const gameAreaRef = useRef(null);
  const gameTimerRef = useRef(null);
  const bubbleTimerRef = useRef(null);
  const bubbleIdRef = useRef(0);

  useEffect(() => {
    const saved = localStorage.getItem('bubble-high-score');
    if (saved) setHighScore(parseInt(saved));
  }, []);

  useEffect(() => {
    return () => {
      if (gameTimerRef.current) clearInterval(gameTimerRef.current);
      if (bubbleTimerRef.current) clearInterval(bubbleTimerRef.current);
    };
  }, []);

  const colors = [
    'from-red-400 to-red-600',
    'from-blue-400 to-blue-600',
    'from-green-400 to-green-600',
    'from-yellow-400 to-yellow-600',
    'from-purple-400 to-purple-600',
    'from-pink-400 to-pink-600',
    'from-cyan-400 to-cyan-600',
    'from-orange-400 to-orange-600',
  ];

  const createBubble = useCallback(() => {
    const size = Math.random() * 30 + 25;
    const x = Math.random() * 80 + 10;
    const speed = Math.random() * 3 + 2;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const isSpecial = Math.random() < 0.15;
    
    bubbleIdRef.current += 1;
    
    return {
      id: bubbleIdRef.current,
      x,
      y: 110,
      size,
      speed,
      color: isSpecial ? 'from-yellow-300 to-amber-500' : color,
      isSpecial,
      points: isSpecial ? 50 : Math.round((60 - size) / 5) * 5 + 10,
    };
  }, []);

  const startGame = useCallback(() => {
    setScore(0);
    setTimeLeft(30);
    setGameActive(true);
    setBubbles([]);
    setCombo(0);
    bubbleIdRef.current = 0;

    // Spawn bubbles
    bubbleTimerRef.current = setInterval(() => {
      setBubbles(prev => {
        // Remove bubbles that have floated off screen
        const filtered = prev.filter(b => b.y > -10);
        
        // Add new bubble
        if (filtered.length < 8) {
          return [...filtered, createBubble()];
        }
        return filtered;
      });
    }, 500);

    // Move bubbles
    const moveInterval = setInterval(() => {
      setBubbles(prev => prev.map(b => ({
        ...b,
        y: b.y - b.speed,
        x: b.x + (Math.sin(Date.now() / 500 + b.id) * 0.3)
      })));
    }, 50);

    // Game timer
    gameTimerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(moveInterval);
  }, [createBubble]);

  const endGame = useCallback(() => {
    setGameActive(false);
    if (gameTimerRef.current) clearInterval(gameTimerRef.current);
    if (bubbleTimerRef.current) clearInterval(bubbleTimerRef.current);
    setBubbles([]);
    
    setScore(prev => {
      if (prev > highScore) {
        setHighScore(prev);
        localStorage.setItem('bubble-high-score', prev.toString());
      }
      return prev;
    });
  }, [highScore]);

  const popBubble = useCallback((bubble, e) => {
    e.stopPropagation();
    if (!gameActive) return;
    
    const points = bubble.points + (combo * 5);
    setScore(prev => prev + points);
    setCombo(prev => prev + 1);
    
    setPoppedEffect({
      x: bubble.x,
      y: bubble.y,
      points,
      isSpecial: bubble.isSpecial
    });
    
    setTimeout(() => setPoppedEffect(null), 500);
    
    setBubbles(prev => prev.filter(b => b.id !== bubble.id));

    // Reset combo after 2 seconds of no pops
    setTimeout(() => {
      setCombo(0);
    }, 2000);
  }, [gameActive, combo]);

  const containerClass = embedded
    ? 'w-full h-full flex flex-col p-2'
    : 'min-h-screen bg-black flex items-center justify-center p-4';

  return (
    <div className={containerClass}>
      <div className="flex flex-col w-full h-full gap-2 text-white">
        {/* Header */}
        <div className="text-center flex items-center justify-between">
          <h1 className={embedded ? 'text-lg font-bold text-white' : 'text-4xl font-bold text-white'}>
            🫧 Bubble Pop
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
            {combo > 1 && (
              <div className={embedded ? 'text-[11px]' : ''}>
                <span className="font-bold text-orange-400">x{combo} Combo!</span>
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
          className="flex-1 relative overflow-hidden rounded-2xl bg-gradient-to-b from-blue-900/30 to-purple-900/30 border border-white/10 min-h-0"
        >
          {!gameActive && timeLeft === 30 ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={startGame}
                className={`
                  flex flex-col items-center gap-3 px-8 py-6 rounded-2xl
                  bg-gradient-to-br from-cyan-500 to-blue-600
                  hover:from-cyan-400 hover:to-blue-500
                  transition-all duration-200 hover:scale-105 active:scale-95
                `}
              >
                <Play className={embedded ? 'w-8 h-8' : 'w-12 h-12'} />
                <span className={embedded ? 'text-lg font-bold' : 'text-2xl font-bold'}>Start Game</span>
              </button>
            </div>
          ) : !gameActive && timeLeft === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
              <div className="text-center p-6">
                <h2 className={`font-bold text-white mb-4 ${embedded ? 'text-xl' : 'text-3xl'}`}>
                  🫧 Game Over!
                </h2>
                <p className={`text-white/80 mb-2 ${embedded ? 'text-sm' : 'text-lg'}`}>
                  Final Score: <span className="text-green-400 font-bold">{score}</span>
                </p>
                {score >= highScore && score > 0 && (
                  <p className="text-yellow-400 mb-4">🏆 New High Score!</p>
                )}
                <button
                  onClick={startGame}
                  className="px-6 py-3 bg-cyan-500 rounded-xl font-bold hover:bg-cyan-400 transition-colors"
                >
                  Play Again
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Bubbles */}
              {bubbles.map((bubble) => (
                <button
                  key={bubble.id}
                  onClick={(e) => popBubble(bubble, e)}
                  style={{
                    left: `${bubble.x}%`,
                    top: `${bubble.y}%`,
                    width: `${bubble.size}px`,
                    height: `${bubble.size}px`,
                  }}
                  className={`
                    absolute -translate-x-1/2 -translate-y-1/2
                    rounded-full bg-gradient-to-br ${bubble.color}
                    shadow-lg cursor-pointer
                    transition-transform duration-100
                    hover:scale-110 active:scale-90
                    ${bubble.isSpecial ? 'animate-pulse ring-2 ring-yellow-300' : ''}
                  `}
                >
                  <div className="absolute top-1 left-1 w-2 h-2 rounded-full bg-white/60" />
                  {bubble.isSpecial && (
                    <span className="absolute inset-0 flex items-center justify-center text-xs">⭐</span>
                  )}
                </button>
              ))}

              {/* Pop Effect */}
              {poppedEffect && (
                <div
                  style={{
                    left: `${poppedEffect.x}%`,
                    top: `${poppedEffect.y}%`,
                  }}
                  className={`
                    absolute -translate-x-1/2 -translate-y-1/2
                    font-bold pointer-events-none animate-bounce
                    ${poppedEffect.isSpecial ? 'text-yellow-400 text-lg' : 'text-green-400 text-sm'}
                  `}
                >
                  +{poppedEffect.points}
                </div>
              )}
            </>
          )}
        </div>

        <div className={embedded ? 'text-center text-white/50 text-[8px]' : 'text-center text-white/50 text-xs'}>
          <p>Pop bubbles for points! ⭐ = bonus</p>
        </div>
      </div>
    </div>
  );
};

export default BubblePop;
