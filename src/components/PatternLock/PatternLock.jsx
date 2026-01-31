import React, { useState, useEffect, useCallback, useRef } from 'react';
import { RotateCcw, Play } from 'lucide-react';

const PatternLock = ({ embedded = false }) => {
  const [pattern, setPattern] = useState([]);
  const [userPattern, setUserPattern] = useState([]);
  const [isShowingPattern, setIsShowingPattern] = useState(false);
  const [isUserTurn, setIsUserTurn] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [activeCell, setActiveCell] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const timeoutRef = useRef([]);

  useEffect(() => {
    const saved = localStorage.getItem('pattern-high-score');
    if (saved) setHighScore(parseInt(saved));
  }, []);

  useEffect(() => {
    return () => {
      timeoutRef.current.forEach(t => clearTimeout(t));
    };
  }, []);

  const clearTimeouts = () => {
    timeoutRef.current.forEach(t => clearTimeout(t));
    timeoutRef.current = [];
  };

  const addToPattern = useCallback(() => {
    const newCell = Math.floor(Math.random() * 9);
    return newCell;
  }, []);

  const showPattern = useCallback((patternToShow) => {
    setIsShowingPattern(true);
    setIsUserTurn(false);
    setUserPattern([]);
    setFeedback(null);

    patternToShow.forEach((cell, index) => {
      const showTimeout = setTimeout(() => {
        setActiveCell(cell);
      }, index * 600);
      
      const hideTimeout = setTimeout(() => {
        setActiveCell(null);
      }, index * 600 + 400);
      
      timeoutRef.current.push(showTimeout, hideTimeout);
    });

    const endTimeout = setTimeout(() => {
      setIsShowingPattern(false);
      setIsUserTurn(true);
    }, patternToShow.length * 600 + 200);
    
    timeoutRef.current.push(endTimeout);
  }, []);

  const startGame = useCallback(() => {
    clearTimeouts();
    setScore(0);
    setLevel(1);
    setGameOver(false);
    setGameStarted(true);
    setUserPattern([]);
    setFeedback(null);
    
    const initialPattern = [addToPattern()];
    setPattern(initialPattern);
    
    setTimeout(() => {
      showPattern(initialPattern);
    }, 500);
  }, [addToPattern, showPattern]);

  const nextLevel = useCallback(() => {
    setLevel(prev => prev + 1);
    setUserPattern([]);
    
    setPattern(prev => {
      const newPattern = [...prev, addToPattern()];
      setTimeout(() => {
        showPattern(newPattern);
      }, 1000);
      return newPattern;
    });
  }, [addToPattern, showPattern]);

  const handleCellClick = useCallback((index) => {
    if (!isUserTurn || isShowingPattern || gameOver) return;
    
    setActiveCell(index);
    setTimeout(() => setActiveCell(null), 200);
    
    const newUserPattern = [...userPattern, index];
    setUserPattern(newUserPattern);
    
    // Check if the pattern matches so far
    const currentIndex = newUserPattern.length - 1;
    
    if (pattern[currentIndex] !== index) {
      // Wrong!
      setFeedback({ correct: false, message: 'Wrong pattern!' });
      setGameOver(true);
      setIsUserTurn(false);
      
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem('pattern-high-score', score.toString());
      }
      return;
    }
    
    // Check if pattern is complete
    if (newUserPattern.length === pattern.length) {
      const points = level * 10;
      setScore(prev => prev + points);
      setFeedback({ correct: true, message: `+${points} points!` });
      setIsUserTurn(false);
      
      setTimeout(() => {
        nextLevel();
      }, 1000);
    }
  }, [isUserTurn, isShowingPattern, gameOver, userPattern, pattern, level, score, highScore, nextLevel]);

  const containerClass = embedded
    ? 'w-full h-full flex flex-col p-2'
    : 'min-h-screen bg-black flex items-center justify-center p-4';

  return (
    <div className={containerClass}>
      <div className="flex flex-col w-full h-full gap-2 text-white">
        {/* Header */}
        <div className="text-center flex items-center justify-between">
          <h1 className={embedded ? 'text-lg font-bold text-white' : 'text-4xl font-bold text-white'}>
            🔐 Pattern Lock
          </h1>
          <button onClick={startGame} className="p-2 hover:bg-white/10 rounded-lg">
            <RotateCcw className={embedded ? 'w-3.5 h-3.5 text-white' : 'w-5 h-5 text-white'} />
          </button>
        </div>

        {/* Stats */}
        {gameStarted && (
          <div className={embedded ? 'bg-white/10 backdrop-blur-md rounded-xl px-2.5 py-1.5 border border-white/10' : 'bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20'}>
            <div className="flex items-center justify-center gap-4">
              <div className={embedded ? 'text-[11px]' : ''}>
                <span className="text-white/60">Score: </span>
                <span className="font-bold text-green-400">{score}</span>
              </div>
              <div className={embedded ? 'text-[11px]' : ''}>
                <span className="text-white/60">Level: </span>
                <span className="font-bold text-purple-400">{level}</span>
              </div>
              <div className={embedded ? 'text-[11px]' : ''}>
                <span className="text-white/60">Best: </span>
                <span className="font-bold text-yellow-400">{highScore}</span>
              </div>
            </div>
          </div>
        )}

        {/* Status */}
        {gameStarted && !gameOver && (
          <div className={`text-center ${embedded ? 'text-xs' : 'text-sm'}`}>
            {isShowingPattern ? (
              <span className="text-yellow-400 animate-pulse">👀 Watch the pattern...</span>
            ) : isUserTurn ? (
              <span className="text-green-400">👆 Your turn! Repeat the pattern</span>
            ) : null}
          </div>
        )}

        {/* Game Area */}
        <div className="flex-1 flex items-center justify-center min-h-0">
          {!gameStarted ? (
            <button
              onClick={startGame}
              className={`
                flex flex-col items-center gap-3 px-8 py-6 rounded-2xl
                bg-gradient-to-br from-purple-500 to-pink-600
                hover:from-purple-400 hover:to-pink-500
                transition-all duration-200 hover:scale-105 active:scale-95
              `}
            >
              <Play className={embedded ? 'w-8 h-8' : 'w-12 h-12'} />
              <span className={embedded ? 'text-lg font-bold' : 'text-2xl font-bold'}>Start Game</span>
            </button>
          ) : gameOver ? (
            <div className="text-center">
              <h2 className={`font-bold text-white mb-4 ${embedded ? 'text-xl' : 'text-3xl'}`}>
                🔐 Game Over!
              </h2>
              <p className={`text-white/80 mb-2 ${embedded ? 'text-sm' : 'text-lg'}`}>
                You reached Level <span className="text-purple-400 font-bold">{level}</span>
              </p>
              <p className={`text-white/80 mb-2 ${embedded ? 'text-sm' : 'text-lg'}`}>
                Final Score: <span className="text-green-400 font-bold">{score}</span>
              </p>
              {score >= highScore && score > 0 && (
                <p className="text-yellow-400 mb-4">🏆 New High Score!</p>
              )}
              <button
                onClick={startGame}
                className="px-6 py-3 bg-purple-500 rounded-xl font-bold hover:bg-purple-400 transition-colors"
              >
                Play Again
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              {/* Pattern Grid */}
              <div className={`grid grid-cols-3 gap-2 sm:gap-3 ${embedded ? 'max-w-[200px]' : 'max-w-[280px]'} w-full`}>
                {Array(9).fill(null).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleCellClick(index)}
                    disabled={!isUserTurn || isShowingPattern}
                    className={`
                      aspect-square rounded-xl transition-all duration-200
                      flex items-center justify-center
                      ${activeCell === index 
                        ? 'bg-gradient-to-br from-purple-400 to-pink-500 scale-110 shadow-lg shadow-purple-500/50' 
                        : 'bg-white/10 hover:bg-white/20'
                      }
                      ${isUserTurn && !isShowingPattern ? 'cursor-pointer active:scale-95' : 'cursor-default'}
                      border-2 border-white/20
                    `}
                  >
                    <div className={`
                      rounded-full bg-white/30
                      ${embedded ? 'w-4 h-4' : 'w-6 h-6'}
                      ${activeCell === index ? 'bg-white' : ''}
                    `} />
                  </button>
                ))}
              </div>

              {/* Progress indicator */}
              {isUserTurn && (
                <div className="flex gap-1">
                  {pattern.map((_, index) => (
                    <div
                      key={index}
                      className={`
                        rounded-full
                        ${embedded ? 'w-2 h-2' : 'w-3 h-3'}
                        ${index < userPattern.length 
                          ? 'bg-green-400' 
                          : 'bg-white/20'
                        }
                      `}
                    />
                  ))}
                </div>
              )}

              {/* Feedback */}
              {feedback && (
                <div className={`
                  font-bold animate-bounce
                  ${feedback.correct ? 'text-green-400' : 'text-red-400'}
                  ${embedded ? 'text-sm' : 'text-lg'}
                `}>
                  {feedback.message}
                </div>
              )}
            </div>
          )}
        </div>

        <div className={embedded ? 'text-center text-white/50 text-[8px]' : 'text-center text-white/50 text-xs'}>
          <p>Remember and repeat the pattern!</p>
        </div>
      </div>
    </div>
  );
};

export default PatternLock;
