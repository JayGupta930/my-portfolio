import React, { useState, useEffect, useCallback, useRef } from 'react';
import { RotateCcw, Play, Pause } from 'lucide-react';

const GRID_SIZE = 15;
const INITIAL_SPEED = 150;

const SnakeGame = ({ embedded = false }) => {
  const [snake, setSnake] = useState([{ x: 7, y: 7 }]);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState({ x: 1, y: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const gameLoopRef = useRef(null);
  const directionRef = useRef(direction);

  useEffect(() => {
    const saved = localStorage.getItem('snake-high-score');
    if (saved) setHighScore(parseInt(saved));
  }, []);

  const generateFood = useCallback((currentSnake) => {
    let newFood;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
    } while (currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }, []);

  const resetGame = useCallback(() => {
    const initialSnake = [{ x: 7, y: 7 }];
    setSnake(initialSnake);
    setFood(generateFood(initialSnake));
    setDirection({ x: 1, y: 0 });
    directionRef.current = { x: 1, y: 0 };
    setGameOver(false);
    setScore(0);
    setSpeed(INITIAL_SPEED);
    setIsPaused(true);
  }, [generateFood]);

  const moveSnake = useCallback(() => {
    if (gameOver || isPaused) return;

    setSnake(prevSnake => {
      const currentDirection = directionRef.current;
      const head = prevSnake[0];
      const newHead = {
        x: (head.x + currentDirection.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + currentDirection.y + GRID_SIZE) % GRID_SIZE
      };

      // Check self collision
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        setIsPaused(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(prev => {
          const newScore = prev + 10;
          if (newScore > highScore) {
            setHighScore(newScore);
            localStorage.setItem('snake-high-score', newScore.toString());
          }
          return newScore;
        });
        setFood(generateFood(newSnake));
        setSpeed(prev => Math.max(50, prev - 5));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [food, gameOver, isPaused, generateFood, highScore]);

  useEffect(() => {
    if (!isPaused && !gameOver) {
      gameLoopRef.current = setInterval(moveSnake, speed);
    }
    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [moveSnake, speed, isPaused, gameOver]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ') {
        if (gameOver) {
          resetGame();
        } else {
          setIsPaused(prev => !prev);
        }
        return;
      }

      if (isPaused || gameOver) return;

      const currentDir = directionRef.current;
      let newDirection = currentDir;

      switch (e.key) {
        case 'ArrowUp':
          if (currentDir.y !== 1) newDirection = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
          if (currentDir.y !== -1) newDirection = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
          if (currentDir.x !== 1) newDirection = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
          if (currentDir.x !== -1) newDirection = { x: 1, y: 0 };
          break;
        default:
          break;
      }

      directionRef.current = newDirection;
      setDirection(newDirection);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPaused, gameOver, resetGame]);

  const handleDirectionButton = (newDir) => {
    if (isPaused || gameOver) return;
    const currentDir = directionRef.current;
    
    if (newDir.y === -1 && currentDir.y !== 1) {
      directionRef.current = newDir;
      setDirection(newDir);
    } else if (newDir.y === 1 && currentDir.y !== -1) {
      directionRef.current = newDir;
      setDirection(newDir);
    } else if (newDir.x === -1 && currentDir.x !== 1) {
      directionRef.current = newDir;
      setDirection(newDir);
    } else if (newDir.x === 1 && currentDir.x !== -1) {
      directionRef.current = newDir;
      setDirection(newDir);
    }
  };

  const containerClass = embedded
    ? 'w-full h-full flex flex-col p-2'
    : 'min-h-screen bg-black flex items-center justify-center p-4';

  const wrapperClass = embedded
    ? 'flex flex-col w-full h-full gap-2 text-white'
    : 'max-w-md w-full flex flex-col gap-6';

  return (
    <div className={containerClass}>
      <div className={wrapperClass}>
        {/* Header */}
        <div className="text-center">
          <h1 className={embedded ? 'text-xl font-bold text-white mb-0.5' : 'text-4xl font-bold text-white mb-2'}>
            🐍 Snake
          </h1>
          <p className={embedded ? 'text-green-300 text-[10px]' : 'text-green-300 text-sm'}>
            Eat food to grow longer!
          </p>
        </div>

        {/* Stats Bar */}
        <div className={embedded ? 'bg-white/10 backdrop-blur-md rounded-xl px-2.5 py-1.5 border border-white/10' : 'bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20'}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={embedded ? 'text-[11px] text-white' : 'text-white'}>
                <span className="text-white/60">Score: </span>
                <span className="font-bold text-green-400">{score}</span>
              </div>
              <div className={embedded ? 'text-[11px] text-white' : 'text-white'}>
                <span className="text-white/60">Best: </span>
                <span className="font-bold text-yellow-400">{highScore}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => gameOver ? resetGame() : setIsPaused(prev => !prev)}
                className="p-2 hover:bg-white/10 rounded-lg transition-all duration-200 active:scale-95"
              >
                {isPaused ? (
                  <Play className={embedded ? 'w-3.5 h-3.5 text-green-400' : 'w-5 h-5 text-green-400'} />
                ) : (
                  <Pause className={embedded ? 'w-3.5 h-3.5 text-yellow-400' : 'w-5 h-5 text-yellow-400'} />
                )}
              </button>
              <button
                onClick={resetGame}
                className="p-2 hover:bg-white/10 rounded-lg transition-all duration-200 active:scale-95"
              >
                <RotateCcw className={embedded ? 'w-3.5 h-3.5 text-white' : 'w-5 h-5 text-white'} />
              </button>
            </div>
          </div>
        </div>

        {/* Game Board */}
        <div className={embedded ? 'flex-1 flex items-center justify-center min-h-0' : 'bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20'}>
          <div 
            className="grid gap-[1px] bg-white/5 rounded-lg p-1"
            style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}
          >
            {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
              const x = index % GRID_SIZE;
              const y = Math.floor(index / GRID_SIZE);
              const isSnakeHead = snake[0]?.x === x && snake[0]?.y === y;
              const isSnakeBody = snake.slice(1).some(segment => segment.x === x && segment.y === y);
              const isFood = food.x === x && food.y === y;

              return (
                <div
                  key={index}
                  className={`
                    ${embedded ? 'w-[14px] h-[14px]' : 'w-5 h-5'} 
                    rounded-sm transition-all duration-100
                    ${isSnakeHead ? 'bg-green-400 shadow-lg shadow-green-400/50' : ''}
                    ${isSnakeBody ? 'bg-green-500' : ''}
                    ${isFood ? 'bg-red-500 shadow-lg shadow-red-500/50 animate-pulse' : ''}
                    ${!isSnakeHead && !isSnakeBody && !isFood ? 'bg-white/5' : ''}
                  `}
                />
              );
            })}
          </div>
        </div>

        {/* Mobile Controls */}
        <div className={embedded ? 'flex justify-center gap-1' : 'flex justify-center gap-2'}>
          <div className="grid grid-cols-3 gap-1">
            <div></div>
            <button
              onClick={() => handleDirectionButton({ x: 0, y: -1 })}
              className={`${embedded ? 'w-8 h-8 text-sm' : 'w-12 h-12'} bg-white/10 rounded-lg hover:bg-white/20 flex items-center justify-center`}
            >
              ↑
            </button>
            <div></div>
            <button
              onClick={() => handleDirectionButton({ x: -1, y: 0 })}
              className={`${embedded ? 'w-8 h-8 text-sm' : 'w-12 h-12'} bg-white/10 rounded-lg hover:bg-white/20 flex items-center justify-center`}
            >
              ←
            </button>
            <button
              onClick={() => handleDirectionButton({ x: 0, y: 1 })}
              className={`${embedded ? 'w-8 h-8 text-sm' : 'w-12 h-12'} bg-white/10 rounded-lg hover:bg-white/20 flex items-center justify-center`}
            >
              ↓
            </button>
            <button
              onClick={() => handleDirectionButton({ x: 1, y: 0 })}
              className={`${embedded ? 'w-8 h-8 text-sm' : 'w-12 h-12'} bg-white/10 rounded-lg hover:bg-white/20 flex items-center justify-center`}
            >
              →
            </button>
          </div>
        </div>

        {/* Game Over / Paused Overlay */}
        {(gameOver || (isPaused && !gameOver)) && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur flex items-center justify-center z-20 rounded-3xl">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 text-center">
              <h2 className="text-2xl font-bold text-white mb-3">
                {gameOver ? '💀 Game Over!' : '⏸️ Paused'}
              </h2>
              {gameOver && (
                <p className="text-white/80 mb-2">Score: {score}</p>
              )}
              <p className="text-white/60 text-sm mb-4">
                {gameOver ? 'Press Space or click to restart' : 'Press Space or click to resume'}
              </p>
              <button
                onClick={gameOver ? resetGame : () => setIsPaused(false)}
                className="bg-green-500 text-white px-5 py-2 rounded-lg font-semibold hover:bg-green-600 transition-colors"
              >
                {gameOver ? 'Play Again' : 'Resume'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SnakeGame;
