import React, { useState, useEffect, useCallback, useRef } from 'react';
import { RotateCcw, Play, Trophy } from 'lucide-react';

const suits = ['♠', '♥', '♦', '♣'];
const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

const CardMatch = ({ embedded = false }) => {
  const [playerCard, setPlayerCard] = useState(null);
  const [computerCard, setComputerCard] = useState(null);
  const [isDealing, setIsDealing] = useState(false);
  const [result, setResult] = useState(null);
  const [score, setScore] = useState({ player: 0, computer: 0 });
  const [round, setRound] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [highWins, setHighWins] = useState(0);
  const maxRounds = 10;

  useEffect(() => {
    const saved = localStorage.getItem('card-high-wins');
    if (saved) setHighWins(parseInt(saved));
  }, []);

  const getRandomCard = () => {
    const suit = suits[Math.floor(Math.random() * suits.length)];
    const value = values[Math.floor(Math.random() * values.length)];
    const numericValue = value === 'A' ? 14 : 
                         value === 'K' ? 13 : 
                         value === 'Q' ? 12 : 
                         value === 'J' ? 11 : 
                         parseInt(value);
    return { suit, value, numericValue };
  };

  const dealCards = () => {
    if (isDealing || gameOver) return;
    
    setIsDealing(true);
    setResult(null);
    setPlayerCard(null);
    setComputerCard(null);

    // Animate dealing
    setTimeout(() => {
      const pCard = getRandomCard();
      setPlayerCard(pCard);
      
      setTimeout(() => {
        const cCard = getRandomCard();
        setComputerCard(cCard);
        
        // Determine winner
        setTimeout(() => {
          if (pCard.numericValue > cCard.numericValue) {
            setResult('win');
            setScore(prev => ({ ...prev, player: prev.player + 1 }));
          } else if (pCard.numericValue < cCard.numericValue) {
            setResult('lose');
            setScore(prev => ({ ...prev, computer: prev.computer + 1 }));
          } else {
            setResult('tie');
          }
          
          setRound(prev => {
            const newRound = prev + 1;
            if (newRound >= maxRounds) {
              setTimeout(() => {
                setGameOver(true);
                // Update high score
                if (score.player + (pCard.numericValue > cCard.numericValue ? 1 : 0) > highWins) {
                  const finalPlayerScore = score.player + (pCard.numericValue > cCard.numericValue ? 1 : 0);
                  setHighWins(finalPlayerScore);
                  localStorage.setItem('card-high-wins', finalPlayerScore.toString());
                }
              }, 500);
            }
            return newRound;
          });
          
          setIsDealing(false);
        }, 300);
      }, 300);
    }, 200);
  };

  const resetGame = () => {
    setPlayerCard(null);
    setComputerCard(null);
    setResult(null);
    setScore({ player: 0, computer: 0 });
    setRound(0);
    setGameOver(false);
  };

  const Card = ({ card, label, isWinner }) => (
    <div className="text-center">
      <p className={`text-white/60 mb-2 ${embedded ? 'text-[10px]' : 'text-xs'}`}>{label}</p>
      <div className={`
        relative flex flex-col items-center justify-center rounded-xl
        bg-white transition-all duration-300
        ${embedded ? 'w-16 h-24' : 'w-24 h-36'}
        ${isWinner ? 'ring-4 ring-green-400 scale-105' : ''}
        ${card ? 'shadow-xl' : 'bg-gradient-to-br from-purple-600 to-pink-600'}
      `}>
        {card ? (
          <>
            <span className={`
              font-bold
              ${embedded ? 'text-xl' : 'text-3xl'}
              ${card.suit === '♥' || card.suit === '♦' ? 'text-red-500' : 'text-gray-800'}
            `}>
              {card.value}
            </span>
            <span className={`
              ${embedded ? 'text-lg' : 'text-2xl'}
              ${card.suit === '♥' || card.suit === '♦' ? 'text-red-500' : 'text-gray-800'}
            `}>
              {card.suit}
            </span>
          </>
        ) : (
          <span className={`text-white font-bold ${embedded ? 'text-2xl' : 'text-4xl'}`}>?</span>
        )}
      </div>
    </div>
  );

  const containerClass = embedded
    ? 'w-full h-full flex flex-col p-2'
    : 'min-h-screen bg-black flex items-center justify-center p-4';

  return (
    <div className={containerClass}>
      <div className="flex flex-col w-full h-full gap-2 text-white">
        {/* Header */}
        <div className="text-center flex items-center justify-between">
          <h1 className={embedded ? 'text-lg font-bold text-white' : 'text-4xl font-bold text-white'}>
            🃏 High Card
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
              <span className="text-white/60">Round: </span>
              <span className="font-bold text-purple-400">{round}/{maxRounds}</span>
            </div>
            <div className={embedded ? 'text-[11px]' : ''}>
              <span className="text-white/60">Best: </span>
              <span className="font-bold text-yellow-400">{highWins}</span>
            </div>
          </div>
        </div>

        {/* Game Area */}
        <div className="flex-1 flex items-center justify-center min-h-0">
          {gameOver ? (
            <div className="text-center">
              <Trophy className={`mx-auto mb-4 ${score.player > score.computer ? 'text-yellow-400' : 'text-gray-400'} ${embedded ? 'w-12 h-12' : 'w-16 h-16'}`} />
              <h2 className={`font-bold text-white mb-4 ${embedded ? 'text-xl' : 'text-3xl'}`}>
                {score.player > score.computer ? '🎉 You Won!' : 
                 score.player < score.computer ? '💻 Computer Won!' : '🤝 Tie Game!'}
              </h2>
              <p className={`text-white/80 mb-4 ${embedded ? 'text-sm' : 'text-lg'}`}>
                Final Score: <span className="text-green-400">{score.player}</span> - <span className="text-red-400">{score.computer}</span>
              </p>
              {score.player > highWins && (
                <p className="text-yellow-400 mb-4">🏆 New Record!</p>
              )}
              <button
                onClick={resetGame}
                className="px-6 py-3 bg-purple-500 rounded-xl font-bold hover:bg-purple-400 transition-colors"
              >
                Play Again
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-6">
              {/* Cards Display */}
              <div className="flex items-center justify-center gap-6 sm:gap-10">
                <Card 
                  card={playerCard} 
                  label="You" 
                  isWinner={result === 'win'} 
                />
                
                <span className={`font-bold text-white/40 ${embedded ? 'text-lg' : 'text-2xl'}`}>VS</span>
                
                <Card 
                  card={computerCard} 
                  label="Computer" 
                  isWinner={result === 'lose'} 
                />
              </div>

              {/* Result */}
              {result && (
                <div className={`font-bold animate-bounce ${embedded ? 'text-lg' : 'text-2xl'}
                  ${result === 'win' ? 'text-green-400' : result === 'lose' ? 'text-red-400' : 'text-yellow-400'}
                `}>
                  {result === 'win' ? '🎉 You Win This Round!' : 
                   result === 'lose' ? '💻 Computer Wins!' : '🤝 It\'s a Tie!'}
                </div>
              )}

              {/* Deal Button */}
              <button
                onClick={dealCards}
                disabled={isDealing}
                className={`
                  flex items-center gap-2 px-6 py-3 rounded-xl font-bold
                  bg-gradient-to-r from-purple-500 to-pink-500
                  hover:from-purple-400 hover:to-pink-400
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-all duration-200 hover:scale-105 active:scale-95
                  ${embedded ? 'text-sm' : 'text-lg'}
                `}
              >
                {isDealing ? 'Dealing...' : 'Deal Cards'}
              </button>
            </div>
          )}
        </div>

        <div className={embedded ? 'text-center text-white/50 text-[8px]' : 'text-center text-white/50 text-xs'}>
          <p>Higher card wins the round!</p>
        </div>
      </div>
    </div>
  );
};

export default CardMatch;
