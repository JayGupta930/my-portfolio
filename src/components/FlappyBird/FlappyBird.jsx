import React, { useState, useEffect, useCallback, useRef } from 'react';
import { RotateCcw, Play } from 'lucide-react';

const GRAVITY = 0.5;
const JUMP_FORCE = -8;
const PIPE_WIDTH = 50;
const PIPE_GAP = 120;
const PIPE_SPEED = 3;
const BIRD_SIZE = 30;

const FlappyBird = ({ embedded = false }) => {
  const [birdY, setBirdY] = useState(150);
  const [birdVelocity, setBirdVelocity] = useState(0);
  const [pipes, setPipes] = useState([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const gameLoopRef = useRef(null);
  const gameAreaRef = useRef(null);

  const GAME_HEIGHT = embedded ? 400 : 500;
  const GAME_WIDTH = embedded ? 280 : 400;

  useEffect(() => {
    const saved = localStorage.getItem('flappy-high-score');
    if (saved) setHighScore(parseInt(saved));
  }, []);

  const resetGame = useCallback(() => {
    setBirdY(GAME_HEIGHT / 2);
    setBirdVelocity(0);
    setPipes([]);
    setScore(0);
    setGameOver(false);
    setGameStarted(false);
  }, [GAME_HEIGHT]);

  const startGame = useCallback(() => {
    resetGame();
    setGameStarted(true);
    setPipes([{ x: GAME_WIDTH + 50, gapY: Math.random() * (GAME_HEIGHT - PIPE_GAP - 100) + 50 }]);
  }, [resetGame, GAME_WIDTH, GAME_HEIGHT]);

  const jump = useCallback(() => {
    if (gameOver) {
      startGame();
      return;
    }
    if (!gameStarted) {
      startGame();
      return;
    }
    setBirdVelocity(JUMP_FORCE);
  }, [gameOver, gameStarted, startGame]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const gameLoop = () => {
      setBirdY(prev => {
        const newY = prev + birdVelocity;
        if (newY < 0 || newY > GAME_HEIGHT - BIRD_SIZE) {
          setGameOver(true);
          return prev;
        }
        return newY;
      });

      setBirdVelocity(prev => prev + GRAVITY);

      setPipes(prevPipes => {
        let newPipes = prevPipes.map(pipe => ({ ...pipe, x: pipe.x - PIPE_SPEED }));
        
        // Add new pipe
        if (newPipes.length === 0 || newPipes[newPipes.length - 1].x < GAME_WIDTH - 150) {
          newPipes.push({
            x: GAME_WIDTH,
            gapY: Math.random() * (GAME_HEIGHT - PIPE_GAP - 100) + 50
          });
        }

        // Remove off-screen pipes and score
        newPipes = newPipes.filter(pipe => {
          if (pipe.x + PIPE_WIDTH < 0) {
            return false;
          }
          if (pipe.x + PIPE_WIDTH < 50 && !pipe.scored) {
            pipe.scored = true;
            setScore(prev => {
              const newScore = prev + 1;
              if (newScore > highScore) {
                setHighScore(newScore);
                localStorage.setItem('flappy-high-score', newScore.toString());
              }
              return newScore;
            });
          }
          return true;
        });

        // Collision detection
        for (const pipe of newPipes) {
          const birdLeft = 50;
          const birdRight = 50 + BIRD_SIZE;
          const birdTop = birdY;
          const birdBottom = birdY + BIRD_SIZE;

          const pipeLeft = pipe.x;
          const pipeRight = pipe.x + PIPE_WIDTH;

          if (birdRight > pipeLeft && birdLeft < pipeRight) {
            if (birdTop < pipe.gapY || birdBottom > pipe.gapY + PIPE_GAP) {
              setGameOver(true);
            }
          }
        }

        return newPipes;
      });
    };

    gameLoopRef.current = setInterval(gameLoop, 1000 / 60);
    return () => clearInterval(gameLoopRef.current);
  }, [gameStarted, gameOver, birdVelocity, birdY, highScore, GAME_HEIGHT, GAME_WIDTH]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        jump();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [jump]);

  const containerClass = embedded
    ? 'w-full h-full flex flex-col p-2'
    : 'min-h-screen bg-black flex items-center justify-center p-4';

  return (
    <div className={containerClass}>
      <div className="flex flex-col w-full h-full gap-2 text-white">
        {/* Header */}
        <div className="text-center">
          <h1 className={embedded ? 'text-xl font-bold text-white mb-0.5' : 'text-4xl font-bold text-white mb-2'}>
            🐦 Flappy Bird
          </h1>
        </div>

        {/* Stats */}
        <div className={embedded ? 'bg-white/10 backdrop-blur-md rounded-xl px-2.5 py-1.5 border border-white/10' : 'bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20'}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={embedded ? 'text-[11px] text-white' : 'text-white'}>
                <span className="text-white/60">Score: </span>
                <span className="font-bold text-yellow-400">{score}</span>
              </div>
              <div className={embedded ? 'text-[11px] text-white' : 'text-white'}>
                <span className="text-white/60">Best: </span>
                <span className="font-bold text-green-400">{highScore}</span>
              </div>
            </div>
            <button onClick={resetGame} className="p-2 hover:bg-white/10 rounded-lg">
              <RotateCcw className={embedded ? 'w-3.5 h-3.5 text-white' : 'w-5 h-5 text-white'} />
            </button>
          </div>
        </div>

        {/* Game Area */}
        <div 
          ref={gameAreaRef}
          className="flex-1 flex items-center justify-center min-h-0"
          onClick={jump}
        >
          <div 
            className="relative bg-gradient-to-b from-cyan-400 to-cyan-600 rounded-xl overflow-hidden cursor-pointer"
            style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
          >
            {/* Bird */}
            <div
              className="absolute w-8 h-8 bg-yellow-400 rounded-full shadow-lg transition-transform"
              style={{ 
                left: 50, 
                top: birdY,
                transform: `rotate(${Math.min(birdVelocity * 3, 45)}deg)`
              }}
            >
              <div className="absolute right-1 top-2 w-2 h-2 bg-white rounded-full">
                <div className="absolute right-0 top-0.5 w-1 h-1 bg-black rounded-full" />
              </div>
              <div className="absolute right-0 top-3 w-3 h-1 bg-orange-500 rounded-r" />
            </div>

            {/* Pipes */}
            {pipes.map((pipe, index) => (
              <React.Fragment key={index}>
                {/* Top pipe */}
                <div
                  className="absolute bg-green-500 border-2 border-green-700"
                  style={{
                    left: pipe.x,
                    top: 0,
                    width: PIPE_WIDTH,
                    height: pipe.gapY
                  }}
                >
                  <div className="absolute bottom-0 left-[-4px] right-[-4px] h-6 bg-green-500 border-2 border-green-700 rounded-b" />
                </div>
                {/* Bottom pipe */}
                <div
                  className="absolute bg-green-500 border-2 border-green-700"
                  style={{
                    left: pipe.x,
                    top: pipe.gapY + PIPE_GAP,
                    width: PIPE_WIDTH,
                    height: GAME_HEIGHT - pipe.gapY - PIPE_GAP
                  }}
                >
                  <div className="absolute top-0 left-[-4px] right-[-4px] h-6 bg-green-500 border-2 border-green-700 rounded-t" />
                </div>
              </React.Fragment>
            ))}

            {/* Ground */}
            <div className="absolute bottom-0 left-0 right-0 h-4 bg-amber-600" />

            {/* Start/Game Over Overlay */}
            {(!gameStarted || gameOver) && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-white text-xl font-bold mb-2">
                    {gameOver ? 'Game Over!' : 'Tap to Start'}
                  </p>
                  {gameOver && <p className="text-white/80">Score: {score}</p>}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className={embedded ? 'text-center text-white/50 text-[8px]' : 'text-center text-white/50 text-xs'}>
          <p>Tap or press Space to fly</p>
        </div>
      </div>
    </div>
  );
};

export default FlappyBird;
