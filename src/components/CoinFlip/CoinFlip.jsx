import React, { useState, useEffect } from 'react';
import { RotateCcw, Coins } from 'lucide-react';

const CoinFlip = ({ embedded = false }) => {
  const [result, setResult] = useState(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [score, setScore] = useState({ correct: 0, wrong: 0 });
  const [streak, setStreak] = useState(0);
  const [highStreak, setHighStreak] = useState(0);
  const [flipCount, setFlipCount] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('coin-high-streak');
    if (saved) setHighStreak(parseInt(saved));
  }, []);

  const flipCoin = (choice) => {
    if (isFlipping) return;
    
    setPrediction(choice);
    setIsFlipping(true);
    setResult(null);

    // Animate flipping
    let flipCount = 0;
    const interval = setInterval(() => {
      setResult(Math.random() < 0.5 ? 'heads' : 'tails');
      flipCount++;
      
      if (flipCount >= 10) {
        clearInterval(interval);
        
        const finalResult = Math.random() < 0.5 ? 'heads' : 'tails';
        setResult(finalResult);
        setFlipCount(prev => prev + 1);
        
        if (choice === finalResult) {
          setScore(prev => ({ ...prev, correct: prev.correct + 1 }));
          setStreak(prev => {
            const newStreak = prev + 1;
            if (newStreak > highStreak) {
              setHighStreak(newStreak);
              localStorage.setItem('coin-high-streak', newStreak.toString());
            }
            return newStreak;
          });
        } else {
          setScore(prev => ({ ...prev, wrong: prev.wrong + 1 }));
          setStreak(0);
        }
        
        setIsFlipping(false);
      }
    }, 100);
  };

  const resetGame = () => {
    setResult(null);
    setPrediction(null);
    setScore({ correct: 0, wrong: 0 });
    setStreak(0);
    setFlipCount(0);
  };

  const accuracy = flipCount > 0 ? Math.round((score.correct / flipCount) * 100) : 0;

  const containerClass = embedded
    ? 'w-full h-full flex flex-col p-2'
    : 'min-h-screen bg-black flex items-center justify-center p-4';

  return (
    <div className={containerClass}>
      <div className="flex flex-col w-full h-full gap-2 text-white">
        {/* Header */}
        <div className="text-center flex items-center justify-between">
          <h1 className={embedded ? 'text-lg font-bold text-white' : 'text-4xl font-bold text-white'}>
            🪙 Coin Flip
          </h1>
          <button onClick={resetGame} className="p-2 hover:bg-white/10 rounded-lg">
            <RotateCcw className={embedded ? 'w-3.5 h-3.5 text-white' : 'w-5 h-5 text-white'} />
          </button>
        </div>

        {/* Stats */}
        <div className={embedded ? 'bg-white/10 backdrop-blur-md rounded-xl px-2.5 py-1.5 border border-white/10' : 'bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20'}>
          <div className="flex items-center justify-center gap-4">
            <div className={embedded ? 'text-[11px]' : ''}>
              <span className="text-green-400 font-bold">{score.correct}</span>
              <span className="text-white/60"> / </span>
              <span className="text-red-400 font-bold">{score.wrong}</span>
            </div>
            <div className={embedded ? 'text-[11px]' : ''}>
              <span className="text-white/60">Accuracy: </span>
              <span className="font-bold text-cyan-400">{accuracy}%</span>
            </div>
            <div className={embedded ? 'text-[11px]' : ''}>
              <span className="text-white/60">Streak: </span>
              <span className="font-bold text-orange-400">{streak}🔥</span>
            </div>
            <div className={embedded ? 'text-[11px]' : ''}>
              <span className="text-white/60">Best: </span>
              <span className="font-bold text-purple-400">{highStreak}</span>
            </div>
          </div>
        </div>

        {/* Game Area */}
        <div className="flex-1 flex flex-col items-center justify-center min-h-0 gap-6">
          {/* Coin */}
          <div className={`
            relative flex items-center justify-center rounded-full
            bg-gradient-to-br from-yellow-400 via-yellow-500 to-amber-600
            shadow-xl
            ${embedded ? 'w-28 h-28' : 'w-40 h-40'}
            ${isFlipping ? 'animate-spin' : ''}
            transition-all duration-300
          `}>
            <div className="absolute inset-2 rounded-full bg-gradient-to-br from-yellow-300 to-amber-500 border-4 border-yellow-600/50" />
            <span className={`relative font-bold text-yellow-900 ${embedded ? 'text-2xl' : 'text-4xl'}`}>
              {result === 'heads' ? '👑' : result === 'tails' ? '🦅' : '?'}
            </span>
          </div>

          {/* Result */}
          {result && !isFlipping && (
            <div className="text-center">
              <p className={`font-bold ${embedded ? 'text-xl' : 'text-3xl'} capitalize
                ${prediction === result ? 'text-green-400' : 'text-red-400'}
              `}>
                {result}!
              </p>
              <p className={`${embedded ? 'text-sm' : 'text-lg'} mt-1
                ${prediction === result ? 'text-green-400' : 'text-red-400'}
              `}>
                {prediction === result ? '🎉 Correct!' : '❌ Wrong!'}
              </p>
            </div>
          )}

          {/* Prediction Text */}
          {!result && !isFlipping && (
            <p className={`text-white/60 ${embedded ? 'text-sm' : 'text-lg'}`}>
              Make your prediction!
            </p>
          )}

          {/* Choice Buttons */}
          <div className="flex gap-4">
            <button
              onClick={() => flipCoin('heads')}
              disabled={isFlipping}
              className={`
                flex flex-col items-center gap-1 rounded-xl
                bg-gradient-to-br from-amber-500 to-yellow-600
                hover:from-amber-400 hover:to-yellow-500
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-200 hover:scale-105 active:scale-95
                ${embedded ? 'px-4 py-3' : 'px-6 py-4'}
              `}
            >
              <span className={embedded ? 'text-xl' : 'text-3xl'}>👑</span>
              <span className={`font-bold ${embedded ? 'text-xs' : 'text-sm'}`}>Heads</span>
            </button>

            <button
              onClick={() => flipCoin('tails')}
              disabled={isFlipping}
              className={`
                flex flex-col items-center gap-1 rounded-xl
                bg-gradient-to-br from-amber-500 to-yellow-600
                hover:from-amber-400 hover:to-yellow-500
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-200 hover:scale-105 active:scale-95
                ${embedded ? 'px-4 py-3' : 'px-6 py-4'}
              `}
            >
              <span className={embedded ? 'text-xl' : 'text-3xl'}>🦅</span>
              <span className={`font-bold ${embedded ? 'text-xs' : 'text-sm'}`}>Tails</span>
            </button>
          </div>
        </div>

        <div className={embedded ? 'text-center text-white/50 text-[8px]' : 'text-center text-white/50 text-xs'}>
          <p>Predict heads or tails!</p>
        </div>
      </div>
    </div>
  );
};

export default CoinFlip;
