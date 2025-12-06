import React, { useState, useEffect, useCallback } from 'react';
import { RotateCcw, ArrowUp, ArrowDown } from 'lucide-react';

const NumberGuess = ({ embedded = false }) => {
  const [targetNumber, setTargetNumber] = useState(0);
  const [guess, setGuess] = useState('');
  const [attempts, setAttempts] = useState([]);
  const [gameWon, setGameWon] = useState(false);
  const [range, setRange] = useState({ min: 1, max: 100 });
  const [gamesWon, setGamesWon] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);

  useEffect(() => {
    const savedWins = localStorage.getItem('numguess-wins');
    const savedAttempts = localStorage.getItem('numguess-attempts');
    if (savedWins) setGamesWon(parseInt(savedWins));
    if (savedAttempts) setTotalAttempts(parseInt(savedAttempts));
  }, []);

  const startNewGame = useCallback(() => {
    const newTarget = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
    setTargetNumber(newTarget);
    setGuess('');
    setAttempts([]);
    setGameWon(false);
  }, [range]);

  useEffect(() => {
    startNewGame();
  }, []);

  const handleGuess = () => {
    const numGuess = parseInt(guess);
    if (isNaN(numGuess) || numGuess < range.min || numGuess > range.max) return;

    const newAttempt = {
      number: numGuess,
      hint: numGuess === targetNumber ? 'correct' : numGuess < targetNumber ? 'higher' : 'lower'
    };

    setAttempts(prev => [...prev, newAttempt]);
    setGuess('');

    if (numGuess === targetNumber) {
      setGameWon(true);
      const newWins = gamesWon + 1;
      const newTotal = totalAttempts + attempts.length + 1;
      setGamesWon(newWins);
      setTotalAttempts(newTotal);
      localStorage.setItem('numguess-wins', newWins.toString());
      localStorage.setItem('numguess-attempts', newTotal.toString());
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleGuess();
    }
  };

  const averageAttempts = gamesWon > 0 ? (totalAttempts / gamesWon).toFixed(1) : 0;

  const containerClass = embedded
    ? 'w-full h-full flex flex-col p-2'
    : 'min-h-screen bg-black flex items-center justify-center p-4';

  return (
    <div className={containerClass}>
      <div className="flex flex-col w-full h-full gap-2 text-white">
        {/* Header */}
        <div className="text-center">
          <h1 className={embedded ? 'text-xl font-bold text-white mb-0.5' : 'text-4xl font-bold text-white mb-2'}>
            🔢 Number Guess
          </h1>
          <p className={embedded ? 'text-cyan-300 text-[10px]' : 'text-cyan-300 text-sm'}>
            Guess the number between {range.min}-{range.max}
          </p>
        </div>

        {/* Stats */}
        <div className={embedded ? 'bg-white/10 backdrop-blur-md rounded-xl px-2.5 py-1.5 border border-white/10' : 'bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20'}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={embedded ? 'text-[11px]' : ''}>
                <span className="text-white/60">Wins: </span>
                <span className="font-bold text-green-400">{gamesWon}</span>
              </div>
              <div className={embedded ? 'text-[11px]' : ''}>
                <span className="text-white/60">Avg: </span>
                <span className="font-bold text-yellow-400">{averageAttempts}</span>
              </div>
              <div className={embedded ? 'text-[11px]' : ''}>
                <span className="text-white/60">Tries: </span>
                <span className="font-bold">{attempts.length}</span>
              </div>
            </div>
            <button onClick={startNewGame} className="p-2 hover:bg-white/10 rounded-lg">
              <RotateCcw className={embedded ? 'w-3.5 h-3.5 text-white' : 'w-5 h-5 text-white'} />
            </button>
          </div>
        </div>

        {/* Input Area */}
        {!gameWon && (
          <div className="flex gap-2 justify-center">
            <input
              type="number"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              onKeyPress={handleKeyPress}
              min={range.min}
              max={range.max}
              className={`
                bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-center
                focus:outline-none focus:border-cyan-400 transition-colors
                ${embedded ? 'w-24 text-sm' : 'w-32 text-lg'}
              `}
              placeholder="?"
            />
            <button
              onClick={handleGuess}
              className={`
                bg-cyan-500 hover:bg-cyan-600 rounded-xl font-bold transition-colors
                ${embedded ? 'px-3 py-2 text-sm' : 'px-6 py-2'}
              `}
            >
              Guess
            </button>
          </div>
        )}

        {/* Attempts History */}
        <div className={`flex-1 overflow-auto min-h-0 ${embedded ? 'max-h-[200px]' : ''}`}>
          <div className="flex flex-col gap-1">
            {attempts.slice().reverse().map((attempt, index) => (
              <div
                key={attempts.length - index - 1}
                className={`
                  flex items-center justify-between px-3 py-2 rounded-lg
                  ${attempt.hint === 'correct' 
                    ? 'bg-green-500/30 border border-green-400' 
                    : 'bg-white/5 border border-white/10'
                  }
                `}
              >
                <span className={`font-bold ${embedded ? 'text-sm' : 'text-lg'}`}>
                  {attempt.number}
                </span>
                <span className={`flex items-center gap-1 ${embedded ? 'text-xs' : 'text-sm'}`}>
                  {attempt.hint === 'correct' ? (
                    <span className="text-green-400">🎉 Correct!</span>
                  ) : attempt.hint === 'higher' ? (
                    <span className="text-yellow-400 flex items-center gap-1">
                      <ArrowUp className="w-4 h-4" /> Higher
                    </span>
                  ) : (
                    <span className="text-blue-400 flex items-center gap-1">
                      <ArrowDown className="w-4 h-4" /> Lower
                    </span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Win Overlay */}
        {gameWon && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur flex items-center justify-center z-20 rounded-3xl">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 text-center">
              <h2 className="text-2xl font-bold text-white mb-3">🎉 You Won!</h2>
              <p className="text-white/80 mb-2">
                The number was <span className="font-bold text-cyan-400">{targetNumber}</span>
              </p>
              <p className="text-white/60 text-sm mb-4">
                Solved in {attempts.length} {attempts.length === 1 ? 'try' : 'tries'}
              </p>
              <button
                onClick={startNewGame}
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

export default NumberGuess;
