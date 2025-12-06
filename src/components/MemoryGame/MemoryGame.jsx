import React, { useState, useEffect } from 'react';
import { RotateCcw } from 'lucide-react';

const EMOJIS = ['🎮', '🎯', '🎨', '🎭', '🎪', '🎢', '🎡', '🎠'];

const MemoryGame = ({ embedded = false }) => {
  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  const initializeGame = () => {
    const shuffledCards = [...EMOJIS, ...EMOJIS]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({ id: index, emoji, isFlipped: false }));
    setCards(shuffledCards);
    setFlippedIndices([]);
    setMatchedPairs([]);
    setMoves(0);
    setGameWon(false);
    setIsLocked(false);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    if (matchedPairs.length === EMOJIS.length) {
      setGameWon(true);
    }
  }, [matchedPairs]);

  const handleCardClick = (index) => {
    if (isLocked || flippedIndices.includes(index) || matchedPairs.includes(cards[index].emoji)) {
      return;
    }

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(prev => prev + 1);
      setIsLocked(true);

      const [first, second] = newFlipped;
      if (cards[first].emoji === cards[second].emoji) {
        setMatchedPairs(prev => [...prev, cards[first].emoji]);
        setFlippedIndices([]);
        setIsLocked(false);
      } else {
        setTimeout(() => {
          setFlippedIndices([]);
          setIsLocked(false);
        }, 1000);
      }
    }
  };

  const isCardFlipped = (index) => {
    return flippedIndices.includes(index) || matchedPairs.includes(cards[index]?.emoji);
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
            Memory Match
          </h1>
          <p className={embedded ? 'text-purple-300 text-[10px]' : 'text-purple-300 text-sm'}>
            Find all matching pairs!
          </p>
        </div>

        {/* Stats Bar */}
        <div className={embedded ? 'bg-white/10 backdrop-blur-md rounded-xl px-2.5 py-1.5 border border-white/10' : 'bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20'}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={embedded ? 'text-[11px] text-white' : 'text-white'}>
                <span className="text-white/60">Moves: </span>
                <span className="font-bold">{moves}</span>
              </div>
              <div className={embedded ? 'text-[11px] text-white' : 'text-white'}>
                <span className="text-white/60">Pairs: </span>
                <span className="font-bold">{matchedPairs.length}/{EMOJIS.length}</span>
              </div>
            </div>
            <button
              onClick={initializeGame}
              className="p-2 hover:bg-white/10 rounded-lg transition-all duration-200 active:scale-95"
              aria-label="Reset Game"
            >
              <RotateCcw className={embedded ? 'w-3.5 h-3.5 text-white' : 'w-5 h-5 text-white'} />
            </button>
          </div>
        </div>

        {/* Game Board */}
        <div className={embedded ? 'flex-1 flex items-center justify-center min-h-0' : 'bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20'}>
          <div className={embedded ? 'grid grid-cols-4 gap-2 w-full max-w-[280px]' : 'grid grid-cols-4 gap-3'}>
            {cards.map((card, index) => (
              <button
                key={card.id}
                onClick={() => handleCardClick(index)}
                className={`
                  aspect-square rounded-lg font-bold transition-all duration-300 flex items-center justify-center
                  ${embedded ? 'text-2xl' : 'text-4xl'}
                  ${isCardFlipped(index)
                    ? 'bg-gradient-to-br from-purple-500 to-pink-500 transform rotate-y-180'
                    : 'bg-white/10 hover:bg-white/20 cursor-pointer'
                  }
                  ${matchedPairs.includes(card.emoji) ? 'ring-2 ring-green-400' : ''}
                  border border-white/20 shadow-lg
                `}
                disabled={isLocked || matchedPairs.includes(card.emoji)}
              >
                {isCardFlipped(index) ? card.emoji : '?'}
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className={embedded ? 'text-center text-white/50 text-[8px]' : 'text-center text-white/50 text-xs'}>
          <p>Click cards to find matching pairs</p>
        </div>

        {/* Win Overlay */}
        {gameWon && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur flex items-center justify-center z-20 rounded-3xl">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 text-center">
              <h2 className="text-2xl font-bold text-white mb-3">🎉 You Won!</h2>
              <p className="text-white/80 mb-4">Completed in {moves} moves</p>
              <button
                onClick={initializeGame}
                className="bg-purple-500 text-white px-5 py-2 rounded-lg font-semibold hover:bg-purple-600 transition-colors"
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

export default MemoryGame;
