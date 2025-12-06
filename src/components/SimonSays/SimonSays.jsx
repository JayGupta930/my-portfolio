import React, { useState, useEffect, useCallback, useRef } from 'react';
import { RotateCcw, Play } from 'lucide-react';

const COLORS = ['red', 'blue', 'green', 'yellow'];

const SimonSays = ({ embedded = false }) => {
  const [sequence, setSequence] = useState([]);
  const [playerSequence, setPlayerSequence] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShowingSequence, setIsShowingSequence] = useState(false);
  const [activeColor, setActiveColor] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const audioContextRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem('simon-high-score');
    if (saved) setHighScore(parseInt(saved));
  }, []);

  const playSound = useCallback((color) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    const frequencies = {
      red: 329.63,    // E4
      blue: 261.63,   // C4
      green: 392.00,  // G4
      yellow: 523.25  // C5
    };

    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);
    
    oscillator.frequency.value = frequencies[color];
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContextRef.current.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.3);
    
    oscillator.start(audioContextRef.current.currentTime);
    oscillator.stop(audioContextRef.current.currentTime + 0.3);
  }, []);

  const showSequence = useCallback(async (seq) => {
    setIsShowingSequence(true);
    setPlayerSequence([]);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    for (let i = 0; i < seq.length; i++) {
      const color = seq[i];
      setActiveColor(color);
      playSound(color);
      await new Promise(resolve => setTimeout(resolve, 600));
      setActiveColor(null);
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    setIsShowingSequence(false);
    setIsPlaying(true);
  }, [playSound]);

  const startGame = useCallback(() => {
    const firstColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    setSequence([firstColor]);
    setPlayerSequence([]);
    setGameOver(false);
    setScore(0);
    setGameStarted(true);
    setIsPlaying(false);
    showSequence([firstColor]);
  }, [showSequence]);

  const handleColorClick = useCallback((color) => {
    if (!isPlaying || isShowingSequence || gameOver) return;

    playSound(color);
    setActiveColor(color);
    setTimeout(() => setActiveColor(null), 200);

    const newPlayerSequence = [...playerSequence, color];
    setPlayerSequence(newPlayerSequence);

    // Check if wrong
    if (color !== sequence[newPlayerSequence.length - 1]) {
      setGameOver(true);
      setIsPlaying(false);
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem('simon-high-score', score.toString());
      }
      return;
    }

    // Check if completed sequence
    if (newPlayerSequence.length === sequence.length) {
      const newScore = score + 1;
      setScore(newScore);
      setIsPlaying(false);
      
      // Add new color to sequence
      const nextColor = COLORS[Math.floor(Math.random() * COLORS.length)];
      const newSequence = [...sequence, nextColor];
      setSequence(newSequence);
      
      setTimeout(() => {
        showSequence(newSequence);
      }, 1000);
    }
  }, [isPlaying, isShowingSequence, gameOver, playerSequence, sequence, score, highScore, playSound, showSequence]);

  const getColorClass = (color) => {
    const isActive = activeColor === color;
    const base = {
      red: isActive ? 'bg-red-400 shadow-lg shadow-red-400/50' : 'bg-red-600 hover:bg-red-500',
      blue: isActive ? 'bg-blue-400 shadow-lg shadow-blue-400/50' : 'bg-blue-600 hover:bg-blue-500',
      green: isActive ? 'bg-green-400 shadow-lg shadow-green-400/50' : 'bg-green-600 hover:bg-green-500',
      yellow: isActive ? 'bg-yellow-300 shadow-lg shadow-yellow-300/50' : 'bg-yellow-500 hover:bg-yellow-400'
    };
    return base[color];
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
            🎵 Simon Says
          </h1>
          <p className={embedded ? 'text-cyan-300 text-[10px]' : 'text-cyan-300 text-sm'}>
            Repeat the pattern!
          </p>
        </div>

        {/* Stats Bar */}
        <div className={embedded ? 'bg-white/10 backdrop-blur-md rounded-xl px-2.5 py-1.5 border border-white/10' : 'bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20'}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={embedded ? 'text-[11px] text-white' : 'text-white'}>
                <span className="text-white/60">Level: </span>
                <span className="font-bold text-cyan-400">{score}</span>
              </div>
              <div className={embedded ? 'text-[11px] text-white' : 'text-white'}>
                <span className="text-white/60">Best: </span>
                <span className="font-bold text-yellow-400">{highScore}</span>
              </div>
            </div>
            <button
              onClick={startGame}
              className="p-2 hover:bg-white/10 rounded-lg transition-all duration-200 active:scale-95"
            >
              {gameStarted ? (
                <RotateCcw className={embedded ? 'w-3.5 h-3.5 text-white' : 'w-5 h-5 text-white'} />
              ) : (
                <Play className={embedded ? 'w-3.5 h-3.5 text-green-400' : 'w-5 h-5 text-green-400'} />
              )}
            </button>
          </div>
        </div>

        {/* Status */}
        <div className="text-center">
          <span className={`${embedded ? 'text-xs' : 'text-sm'} ${isShowingSequence ? 'text-yellow-400' : isPlaying ? 'text-green-400' : 'text-white/60'}`}>
            {!gameStarted 
              ? 'Press Play to start' 
              : gameOver 
                ? 'Game Over!' 
                : isShowingSequence 
                  ? 'Watch the pattern...' 
                  : `Your turn (${playerSequence.length}/${sequence.length})`
            }
          </span>
        </div>

        {/* Game Board */}
        <div className={embedded ? 'flex-1 flex items-center justify-center min-h-0' : 'flex justify-center'}>
          <div className={`grid grid-cols-2 gap-3 ${embedded ? 'w-[200px]' : 'w-64'}`}>
            {COLORS.map((color) => (
              <button
                key={color}
                onClick={() => handleColorClick(color)}
                disabled={!isPlaying || isShowingSequence}
                className={`
                  aspect-square rounded-2xl transition-all duration-150
                  ${getColorClass(color)}
                  ${!isPlaying || isShowingSequence ? 'cursor-not-allowed opacity-70' : 'cursor-pointer active:scale-95'}
                  border-4 border-white/20
                `}
              />
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className={embedded ? 'text-center text-white/50 text-[8px]' : 'text-center text-white/50 text-xs'}>
          <p>Watch the colors, then repeat the sequence</p>
        </div>

        {/* Game Over Overlay */}
        {gameOver && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur flex items-center justify-center z-20 rounded-3xl">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 text-center">
              <h2 className="text-2xl font-bold text-white mb-3">🎵 Game Over!</h2>
              <p className="text-white/80 mb-2">You reached level {score}</p>
              <p className="text-white/60 text-sm mb-4">Best: {highScore}</p>
              <button
                onClick={startGame}
                className="bg-cyan-500 text-white px-5 py-2 rounded-lg font-semibold hover:bg-cyan-600 transition-colors"
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

export default SimonSays;
