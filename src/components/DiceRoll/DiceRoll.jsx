import React, { useState, useEffect } from 'react';
import { RotateCcw, Dices } from 'lucide-react';

const DiceRoll = ({ embedded = false }) => {
  const [playerDice, setPlayerDice] = useState([1, 1]);
  const [computerDice, setComputerDice] = useState([1, 1]);
  const [isRolling, setIsRolling] = useState(false);
  const [result, setResult] = useState(null);
  const [score, setScore] = useState({ player: 0, computer: 0 });
  const [highScore, setHighScore] = useState(0);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('dice-high-score');
    if (saved) setHighScore(parseInt(saved));
  }, []);

  const rollDice = () => {
    if (isRolling) return;
    
    setIsRolling(true);
    setResult(null);
    
    // Animate dice rolling
    let rollCount = 0;
    const rollInterval = setInterval(() => {
      setPlayerDice([
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1
      ]);
      setComputerDice([
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1
      ]);
      rollCount++;
      
      if (rollCount >= 10) {
        clearInterval(rollInterval);
        
        // Final roll
        const finalPlayer = [
          Math.floor(Math.random() * 6) + 1,
          Math.floor(Math.random() * 6) + 1
        ];
        const finalComputer = [
          Math.floor(Math.random() * 6) + 1,
          Math.floor(Math.random() * 6) + 1
        ];
        
        setPlayerDice(finalPlayer);
        setComputerDice(finalComputer);
        
        const playerTotal = finalPlayer[0] + finalPlayer[1];
        const computerTotal = finalComputer[0] + finalComputer[1];
        
        if (playerTotal > computerTotal) {
          setResult('win');
          setScore(prev => ({ ...prev, player: prev.player + 1 }));
          setStreak(prev => {
            const newStreak = prev + 1;
            if (newStreak > highScore) {
              setHighScore(newStreak);
              localStorage.setItem('dice-high-score', newStreak.toString());
            }
            return newStreak;
          });
        } else if (playerTotal < computerTotal) {
          setResult('lose');
          setScore(prev => ({ ...prev, computer: prev.computer + 1 }));
          setStreak(0);
        } else {
          setResult('tie');
        }
        
        setIsRolling(false);
      }
    }, 80);
  };

  const resetGame = () => {
    setPlayerDice([1, 1]);
    setComputerDice([1, 1]);
    setResult(null);
    setScore({ player: 0, computer: 0 });
    setStreak(0);
  };

  const DiceFace = ({ value, size = 'normal' }) => {
    const dotPositions = {
      1: [[1, 1]],
      2: [[0, 0], [2, 2]],
      3: [[0, 0], [1, 1], [2, 2]],
      4: [[0, 0], [0, 2], [2, 0], [2, 2]],
      5: [[0, 0], [0, 2], [1, 1], [2, 0], [2, 2]],
      6: [[0, 0], [0, 1], [0, 2], [2, 0], [2, 1], [2, 2]]
    };
    
    const dots = dotPositions[value] || [];
    const sizeClass = size === 'small' ? 'w-10 h-10' : embedded ? 'w-12 h-12' : 'w-16 h-16';
    const dotSize = size === 'small' ? 'w-1.5 h-1.5' : embedded ? 'w-2 h-2' : 'w-2.5 h-2.5';
    
    return (
      <div className={`${sizeClass} bg-white rounded-lg p-1.5 grid grid-cols-3 grid-rows-3 gap-0.5`}>
        {[0, 1, 2].map(row => 
          [0, 1, 2].map(col => (
            <div key={`${row}-${col}`} className="flex items-center justify-center">
              {dots.some(([r, c]) => r === row && c === col) && (
                <div className={`${dotSize} bg-gray-800 rounded-full`} />
              )}
            </div>
          ))
        )}
      </div>
    );
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
            🎲 Dice Roll
          </h1>
          <button onClick={resetGame} className="p-2 hover:bg-white/10 rounded-lg">
            <RotateCcw className={embedded ? 'w-3.5 h-3.5 text-white' : 'w-5 h-5 text-white'} />
          </button>
        </div>

        {/* Stats */}
        <div className={embedded ? 'bg-white/10 backdrop-blur-md rounded-xl px-2.5 py-1.5 border border-white/10' : 'bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20'}>
          <div className="flex items-center justify-center gap-4">
            <div className={embedded ? 'text-[11px]' : ''}>
              <span className="text-green-400 font-bold">{score.player}</span>
              <span className="text-white/60"> - </span>
              <span className="text-red-400 font-bold">{score.computer}</span>
            </div>
            <div className={embedded ? 'text-[11px]' : ''}>
              <span className="text-white/60">Streak: </span>
              <span className="font-bold text-orange-400">{streak}🔥</span>
            </div>
            <div className={embedded ? 'text-[11px]' : ''}>
              <span className="text-white/60">Best: </span>
              <span className="font-bold text-purple-400">{highScore}</span>
            </div>
          </div>
        </div>

        {/* Game Area */}
        <div className="flex-1 flex flex-col items-center justify-center min-h-0 gap-4">
          {/* Players Section */}
          <div className="flex items-center justify-center gap-6 sm:gap-10 w-full">
            {/* Player */}
            <div className="text-center">
              <p className={`text-white/60 mb-2 ${embedded ? 'text-[10px]' : 'text-xs'}`}>You</p>
              <div className={`
                flex gap-2 p-3 rounded-xl border-2 transition-all duration-300
                ${result === 'win' ? 'border-green-400 bg-green-400/20' : 
                  result === 'lose' ? 'border-red-400/50 bg-red-400/10' : 
                  'border-white/20 bg-white/5'}
                ${isRolling ? 'animate-bounce' : ''}
              `}>
                <DiceFace value={playerDice[0]} />
                <DiceFace value={playerDice[1]} />
              </div>
              <p className={`mt-2 font-bold ${embedded ? 'text-sm' : 'text-lg'} ${result === 'win' ? 'text-green-400' : 'text-white'}`}>
                {playerDice[0] + playerDice[1]}
              </p>
            </div>

            <span className={`font-bold text-white/40 ${embedded ? 'text-lg' : 'text-2xl'}`}>VS</span>

            {/* Computer */}
            <div className="text-center">
              <p className={`text-white/60 mb-2 ${embedded ? 'text-[10px]' : 'text-xs'}`}>Computer</p>
              <div className={`
                flex gap-2 p-3 rounded-xl border-2 transition-all duration-300
                ${result === 'lose' ? 'border-red-400 bg-red-400/20' : 
                  result === 'win' ? 'border-green-400/50 bg-green-400/10' : 
                  'border-white/20 bg-white/5'}
                ${isRolling ? 'animate-bounce' : ''}
              `}>
                <DiceFace value={computerDice[0]} />
                <DiceFace value={computerDice[1]} />
              </div>
              <p className={`mt-2 font-bold ${embedded ? 'text-sm' : 'text-lg'} ${result === 'lose' ? 'text-red-400' : 'text-white'}`}>
                {computerDice[0] + computerDice[1]}
              </p>
            </div>
          </div>

          {/* Result */}
          {result && (
            <div className={`font-bold animate-bounce ${embedded ? 'text-lg' : 'text-2xl'}
              ${result === 'win' ? 'text-green-400' : result === 'lose' ? 'text-red-400' : 'text-yellow-400'}
            `}>
              {result === 'win' ? '🎉 You Win!' : result === 'lose' ? '💻 Computer Wins!' : '🤝 It\'s a Tie!'}
            </div>
          )}

          {/* Roll Button */}
          <button
            onClick={rollDice}
            disabled={isRolling}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-xl font-bold
              bg-gradient-to-r from-purple-500 to-pink-500
              hover:from-purple-400 hover:to-pink-400
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200 hover:scale-105 active:scale-95
              ${embedded ? 'text-sm' : 'text-lg'}
            `}
          >
            <Dices className={embedded ? 'w-4 h-4' : 'w-6 h-6'} />
            {isRolling ? 'Rolling...' : 'Roll Dice'}
          </button>
        </div>

        <div className={embedded ? 'text-center text-white/50 text-[8px]' : 'text-center text-white/50 text-xs'}>
          <p>Roll the dice and beat the computer!</p>
        </div>
      </div>
    </div>
  );
};

export default DiceRoll;
