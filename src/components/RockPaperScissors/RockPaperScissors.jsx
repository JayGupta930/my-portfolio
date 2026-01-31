import React, { useState, useEffect } from 'react';
import { RotateCcw } from 'lucide-react';

const choices = [
  { name: 'rock', emoji: '🪨', beats: 'scissors' },
  { name: 'paper', emoji: '📄', beats: 'rock' },
  { name: 'scissors', emoji: '✂️', beats: 'paper' }
];

const RockPaperScissors = ({ embedded = false }) => {
  const [playerChoice, setPlayerChoice] = useState(null);
  const [computerChoice, setComputerChoice] = useState(null);
  const [result, setResult] = useState(null);
  const [score, setScore] = useState({ player: 0, computer: 0, ties: 0 });
  const [isAnimating, setIsAnimating] = useState(false);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('rps-best-streak');
    if (saved) setBestStreak(parseInt(saved));
  }, []);

  const determineWinner = (player, computer) => {
    if (player === computer) return 'tie';
    const playerData = choices.find(c => c.name === player);
    return playerData.beats === computer ? 'win' : 'lose';
  };

  const handleChoice = (choice) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setPlayerChoice(null);
    setComputerChoice(null);
    setResult(null);

    // Animate choices
    let count = 0;
    const interval = setInterval(() => {
      const randomChoice = choices[Math.floor(Math.random() * 3)].name;
      setComputerChoice(randomChoice);
      count++;
      if (count >= 6) {
        clearInterval(interval);
        
        const finalComputer = choices[Math.floor(Math.random() * 3)].name;
        setPlayerChoice(choice);
        setComputerChoice(finalComputer);
        
        const winner = determineWinner(choice, finalComputer);
        setResult(winner);
        
        if (winner === 'win') {
          setScore(prev => ({ ...prev, player: prev.player + 1 }));
          setStreak(prev => {
            const newStreak = prev + 1;
            if (newStreak > bestStreak) {
              setBestStreak(newStreak);
              localStorage.setItem('rps-best-streak', newStreak.toString());
            }
            return newStreak;
          });
        } else if (winner === 'lose') {
          setScore(prev => ({ ...prev, computer: prev.computer + 1 }));
          setStreak(0);
        } else {
          setScore(prev => ({ ...prev, ties: prev.ties + 1 }));
        }
        
        setIsAnimating(false);
      }
    }, 100);
  };

  const resetGame = () => {
    setPlayerChoice(null);
    setComputerChoice(null);
    setResult(null);
    setScore({ player: 0, computer: 0, ties: 0 });
    setStreak(0);
  };

  const getResultMessage = () => {
    if (!result) return '';
    switch (result) {
      case 'win': return '🎉 You Win!';
      case 'lose': return '💻 Computer Wins!';
      case 'tie': return '🤝 It\'s a Tie!';
      default: return '';
    }
  };

  const getResultColor = () => {
    if (!result) return '';
    switch (result) {
      case 'win': return 'text-green-400';
      case 'lose': return 'text-red-400';
      case 'tie': return 'text-yellow-400';
      default: return '';
    }
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
            ✊ Rock Paper Scissors
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
              <span className="text-white/60"> - </span>
              <span className="text-yellow-400 font-bold">{score.ties}</span>
            </div>
            <div className={embedded ? 'text-[11px]' : ''}>
              <span className="text-white/60">Streak: </span>
              <span className="font-bold text-orange-400">{streak}🔥</span>
            </div>
            <div className={embedded ? 'text-[11px]' : ''}>
              <span className="text-white/60">Best: </span>
              <span className="font-bold text-purple-400">{bestStreak}</span>
            </div>
          </div>
        </div>

        {/* Battle Area */}
        <div className="flex-1 flex flex-col items-center justify-center min-h-0 gap-4">
          {/* Display Area */}
          <div className="flex items-center justify-center gap-6 sm:gap-10">
            {/* Player */}
            <div className="text-center">
              <p className={`text-white/60 mb-2 ${embedded ? 'text-[10px]' : 'text-xs'}`}>You</p>
              <div className={`
                flex items-center justify-center rounded-xl border-2
                ${embedded ? 'w-16 h-16 text-3xl' : 'w-24 h-24 text-5xl'}
                ${result === 'win' ? 'border-green-400 bg-green-400/20' : 
                  result === 'lose' ? 'border-red-400/50 bg-red-400/10' : 
                  'border-white/20 bg-white/5'}
                transition-all duration-300
              `}>
                {playerChoice ? choices.find(c => c.name === playerChoice)?.emoji : '❓'}
              </div>
            </div>

            <span className={`font-bold text-white/40 ${embedded ? 'text-lg' : 'text-2xl'}`}>VS</span>

            {/* Computer */}
            <div className="text-center">
              <p className={`text-white/60 mb-2 ${embedded ? 'text-[10px]' : 'text-xs'}`}>Computer</p>
              <div className={`
                flex items-center justify-center rounded-xl border-2
                ${embedded ? 'w-16 h-16 text-3xl' : 'w-24 h-24 text-5xl'}
                ${result === 'lose' ? 'border-red-400 bg-red-400/20' : 
                  result === 'win' ? 'border-green-400/50 bg-green-400/10' : 
                  'border-white/20 bg-white/5'}
                transition-all duration-300
                ${isAnimating ? 'animate-pulse' : ''}
              `}>
                {computerChoice ? choices.find(c => c.name === computerChoice)?.emoji : '❓'}
              </div>
            </div>
          </div>

          {/* Result */}
          {result && (
            <div className={`font-bold ${getResultColor()} ${embedded ? 'text-lg' : 'text-2xl'} animate-bounce`}>
              {getResultMessage()}
            </div>
          )}

          {/* Choice Buttons */}
          <div className="flex gap-3 sm:gap-4">
            {choices.map((choice) => (
              <button
                key={choice.name}
                onClick={() => handleChoice(choice.name)}
                disabled={isAnimating}
                className={`
                  flex items-center justify-center rounded-xl border-2 border-white/20
                  bg-gradient-to-br from-purple-500/30 to-pink-500/30
                  hover:from-purple-500/50 hover:to-pink-500/50
                  hover:scale-110 active:scale-95
                  transition-all duration-200
                  disabled:opacity-50 disabled:cursor-not-allowed
                  ${embedded ? 'w-14 h-14 text-2xl' : 'w-20 h-20 text-4xl'}
                `}
              >
                {choice.emoji}
              </button>
            ))}
          </div>
        </div>

        <div className={embedded ? 'text-center text-white/50 text-[8px]' : 'text-center text-white/50 text-xs'}>
          <p>Choose rock, paper, or scissors to play!</p>
        </div>
      </div>
    </div>
  );
};

export default RockPaperScissors;
