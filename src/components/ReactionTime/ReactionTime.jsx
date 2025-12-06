import React, { useState, useEffect, useCallback, useRef } from 'react';
import { RotateCcw, Zap } from 'lucide-react';

const ReactionTime = ({ embedded = false }) => {
  const [gameState, setGameState] = useState('waiting'); // waiting, ready, click, result, tooEarly
  const [reactionTime, setReactionTime] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [bestTime, setBestTime] = useState(null);
  const startTimeRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem('reaction-best-time');
    if (saved) setBestTime(parseInt(saved));
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const startRound = useCallback(() => {
    setGameState('ready');
    setReactionTime(null);
    
    const delay = Math.random() * 3000 + 2000; // 2-5 seconds
    timeoutRef.current = setTimeout(() => {
      setGameState('click');
      startTimeRef.current = Date.now();
    }, delay);
  }, []);

  const handleClick = useCallback(() => {
    if (gameState === 'waiting') {
      startRound();
    } else if (gameState === 'ready') {
      // Clicked too early
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setGameState('tooEarly');
    } else if (gameState === 'click') {
      const endTime = Date.now();
      const time = endTime - startTimeRef.current;
      setReactionTime(time);
      setAttempts(prev => {
        const newAttempts = [...prev, time].slice(-5);
        return newAttempts;
      });
      
      if (!bestTime || time < bestTime) {
        setBestTime(time);
        localStorage.setItem('reaction-best-time', time.toString());
      }
      
      setGameState('result');
    } else if (gameState === 'result' || gameState === 'tooEarly') {
      startRound();
    }
  }, [gameState, startRound, bestTime]);

  const resetGame = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setGameState('waiting');
    setReactionTime(null);
    setAttempts([]);
  }, []);

  const averageTime = attempts.length > 0 
    ? Math.round(attempts.reduce((a, b) => a + b, 0) / attempts.length)
    : null;

  const getBackgroundColor = () => {
    switch (gameState) {
      case 'ready': return 'bg-red-500';
      case 'click': return 'bg-green-500';
      case 'tooEarly': return 'bg-orange-500';
      default: return 'bg-blue-500';
    }
  };

  const getMessage = () => {
    switch (gameState) {
      case 'waiting': return { title: 'Click to Start', subtitle: 'Test your reaction speed!' };
      case 'ready': return { title: 'Wait...', subtitle: 'Click when the screen turns green' };
      case 'click': return { title: 'CLICK NOW!', subtitle: '' };
      case 'tooEarly': return { title: 'Too Early!', subtitle: 'Click to try again' };
      case 'result': return { 
        title: `${reactionTime} ms`, 
        subtitle: reactionTime < 200 ? 'Amazing! 🔥' : reactionTime < 300 ? 'Great! 👍' : reactionTime < 400 ? 'Good 👌' : 'Keep practicing!'
      };
      default: return { title: '', subtitle: '' };
    }
  };

  const { title, subtitle } = getMessage();

  const containerClass = embedded
    ? 'w-full h-full flex flex-col p-2'
    : 'min-h-screen bg-black flex items-center justify-center p-4';

  return (
    <div className={containerClass}>
      <div className="flex flex-col w-full h-full gap-2 text-white">
        {/* Header */}
        <div className="text-center flex items-center justify-between">
          <h1 className={embedded ? 'text-lg font-bold text-white' : 'text-4xl font-bold text-white'}>
            ⚡ Reaction Time
          </h1>
          <button onClick={resetGame} className="p-2 hover:bg-white/10 rounded-lg">
            <RotateCcw className={embedded ? 'w-3.5 h-3.5 text-white' : 'w-5 h-5 text-white'} />
          </button>
        </div>

        {/* Stats */}
        {(bestTime || averageTime) && (
          <div className={embedded ? 'bg-white/10 backdrop-blur-md rounded-xl px-2.5 py-1.5 border border-white/10' : 'bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20'}>
            <div className="flex items-center justify-center gap-4">
              {bestTime && (
                <div className={embedded ? 'text-[11px]' : ''}>
                  <span className="text-white/60">Best: </span>
                  <span className="font-bold text-green-400">{bestTime}ms</span>
                </div>
              )}
              {averageTime && (
                <div className={embedded ? 'text-[11px]' : ''}>
                  <span className="text-white/60">Avg: </span>
                  <span className="font-bold text-blue-400">{averageTime}ms</span>
                </div>
              )}
              <div className={embedded ? 'text-[11px]' : ''}>
                <span className="text-white/60">Tries: </span>
                <span className="font-bold">{attempts.length}</span>
              </div>
            </div>
          </div>
        )}

        {/* Game Area */}
        <div 
          className="flex-1 flex items-center justify-center min-h-0 cursor-pointer"
          onClick={handleClick}
        >
          <div 
            className={`
              w-full max-w-[260px] aspect-square rounded-2xl flex flex-col items-center justify-center
              transition-colors duration-200 ${getBackgroundColor()}
            `}
          >
            {gameState === 'click' ? (
              <Zap className={embedded ? 'w-16 h-16 text-white animate-pulse' : 'w-24 h-24 text-white animate-pulse'} />
            ) : null}
            <h2 className={`font-bold text-white text-center ${embedded ? 'text-xl' : 'text-3xl'}`}>
              {title}
            </h2>
            {subtitle && (
              <p className={`text-white/80 text-center mt-2 ${embedded ? 'text-xs' : 'text-sm'}`}>
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Recent Attempts */}
        {attempts.length > 0 && (
          <div className={`flex justify-center gap-2 ${embedded ? 'text-[10px]' : 'text-xs'}`}>
            {attempts.map((time, index) => (
              <span 
                key={index} 
                className={`px-2 py-1 rounded ${time === bestTime ? 'bg-green-500/30 text-green-400' : 'bg-white/10'}`}
              >
                {time}ms
              </span>
            ))}
          </div>
        )}

        <div className={embedded ? 'text-center text-white/50 text-[8px]' : 'text-center text-white/50 text-xs'}>
          <p>Click as fast as you can when it turns green</p>
        </div>
      </div>
    </div>
  );
};

export default ReactionTime;
