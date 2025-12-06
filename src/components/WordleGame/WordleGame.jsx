import React, { useState, useEffect, useCallback } from 'react';
import { RotateCcw, Delete } from 'lucide-react';

const WORDS = [
  'REACT', 'WORLD', 'BRAIN', 'CLOUD', 'MUSIC', 'PLANT', 'DRINK', 'SMART',
  'SHINE', 'STORM', 'PEACE', 'DREAM', 'SPACE', 'LIGHT', 'RIVER', 'OCEAN',
  'TIGER', 'EAGLE', 'FLAME', 'BEACH', 'PIZZA', 'GHOST', 'MAGIC', 'POWER',
  'SWORD', 'ANGEL', 'CROWN', 'HEART', 'STONE', 'DANCE', 'HAPPY', 'LUCKY'
];

const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'DEL']
];

const MAX_ATTEMPTS = 6;

const WordleGame = ({ embedded = false }) => {
  const [targetWord, setTargetWord] = useState('');
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [letterStates, setLetterStates] = useState({});
  const [shake, setShake] = useState(false);

  const startNewGame = useCallback(() => {
    const randomWord = WORDS[Math.floor(Math.random() * WORDS.length)];
    setTargetWord(randomWord);
    setGuesses([]);
    setCurrentGuess('');
    setGameOver(false);
    setGameWon(false);
    setLetterStates({});
  }, []);

  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  const getLetterState = (letter, index, guess) => {
    if (targetWord[index] === letter) {
      return 'correct';
    } else if (targetWord.includes(letter)) {
      // Count occurrences in target
      const targetCount = targetWord.split('').filter(l => l === letter).length;
      // Count correct positions before this index
      const correctBefore = guess.slice(0, index).split('').filter((l, i) => l === letter && targetWord[i] === letter).length;
      // Count present positions before this index (excluding correct)
      const presentBefore = guess.slice(0, index).split('').filter((l, i) => l === letter && targetWord[i] !== letter && targetWord.includes(l)).length;
      
      if (correctBefore + presentBefore < targetCount) {
        return 'present';
      }
      return 'absent';
    }
    return 'absent';
  };

  const submitGuess = useCallback(() => {
    if (currentGuess.length !== 5) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    const newGuess = currentGuess.toUpperCase();
    const newGuesses = [...guesses, newGuess];
    setGuesses(newGuesses);

    // Update letter states
    const newLetterStates = { ...letterStates };
    for (let i = 0; i < 5; i++) {
      const letter = newGuess[i];
      const state = getLetterState(letter, i, newGuess);
      
      // Only update if new state is "better"
      if (state === 'correct') {
        newLetterStates[letter] = 'correct';
      } else if (state === 'present' && newLetterStates[letter] !== 'correct') {
        newLetterStates[letter] = 'present';
      } else if (!newLetterStates[letter]) {
        newLetterStates[letter] = 'absent';
      }
    }
    setLetterStates(newLetterStates);

    // Check win/lose
    if (newGuess === targetWord) {
      setGameWon(true);
      setGameOver(true);
    } else if (newGuesses.length >= MAX_ATTEMPTS) {
      setGameOver(true);
    }

    setCurrentGuess('');
  }, [currentGuess, guesses, letterStates, targetWord]);

  const handleKey = useCallback((key) => {
    if (gameOver) return;

    if (key === 'ENTER') {
      submitGuess();
    } else if (key === 'DEL' || key === 'BACKSPACE') {
      setCurrentGuess(prev => prev.slice(0, -1));
    } else if (key.length === 1 && /^[A-Z]$/i.test(key) && currentGuess.length < 5) {
      setCurrentGuess(prev => prev + key.toUpperCase());
    }
  }, [currentGuess, gameOver, submitGuess]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        handleKey('ENTER');
      } else if (e.key === 'Backspace') {
        handleKey('DEL');
      } else if (e.key.length === 1 && /^[a-zA-Z]$/.test(e.key)) {
        handleKey(e.key.toUpperCase());
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKey]);

  const getTileClass = (letter, index, rowIndex) => {
    if (rowIndex >= guesses.length) {
      return 'bg-white/10 border-white/20';
    }
    
    const guess = guesses[rowIndex];
    const state = getLetterState(letter, index, guess);
    
    if (state === 'correct') return 'bg-green-500 border-green-500';
    if (state === 'present') return 'bg-yellow-500 border-yellow-500';
    return 'bg-white/20 border-white/30';
  };

  const getKeyClass = (key) => {
    const state = letterStates[key];
    if (state === 'correct') return 'bg-green-500 text-white';
    if (state === 'present') return 'bg-yellow-500 text-white';
    if (state === 'absent') return 'bg-white/20 text-white/50';
    return 'bg-white/10 text-white hover:bg-white/20';
  };

  const containerClass = embedded
    ? 'w-full h-full flex flex-col p-2'
    : 'min-h-screen bg-black flex items-center justify-center p-4';

  const wrapperClass = embedded
    ? 'flex flex-col w-full h-full gap-1 text-white'
    : 'max-w-md w-full flex flex-col gap-6';

  return (
    <div className={containerClass}>
      <div className={wrapperClass}>
        {/* Header */}
        <div className="text-center flex items-center justify-between">
          <div className="flex-1">
            <h1 className={embedded ? 'text-lg font-bold text-white' : 'text-4xl font-bold text-white mb-2'}>
              📝 Wordle
            </h1>
          </div>
          <button
            onClick={startNewGame}
            className="p-2 hover:bg-white/10 rounded-lg transition-all duration-200 active:scale-95"
          >
            <RotateCcw className={embedded ? 'w-3.5 h-3.5 text-white' : 'w-5 h-5 text-white'} />
          </button>
        </div>

        {/* Game Board */}
        <div className={`flex-1 flex flex-col items-center justify-center ${embedded ? 'gap-1' : 'gap-2'}`}>
          {Array.from({ length: MAX_ATTEMPTS }).map((_, rowIndex) => {
            const guess = guesses[rowIndex] || (rowIndex === guesses.length ? currentGuess : '');
            const isCurrentRow = rowIndex === guesses.length;
            
            return (
              <div 
                key={rowIndex} 
                className={`flex gap-1 ${isCurrentRow && shake ? 'animate-shake' : ''}`}
              >
                {Array.from({ length: 5 }).map((_, colIndex) => {
                  const letter = guess[colIndex] || '';
                  const isSubmitted = rowIndex < guesses.length;
                  
                  return (
                    <div
                      key={colIndex}
                      className={`
                        ${embedded ? 'w-10 h-10 text-lg' : 'w-14 h-14 text-2xl'}
                        flex items-center justify-center font-bold rounded-lg border-2
                        transition-all duration-300
                        ${isSubmitted ? getTileClass(letter, colIndex, rowIndex) : 'bg-white/10 border-white/20'}
                        ${letter && !isSubmitted ? 'border-white/40 scale-105' : ''}
                      `}
                    >
                      {letter}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Keyboard */}
        <div className={`flex flex-col items-center ${embedded ? 'gap-1' : 'gap-2'}`}>
          {KEYBOARD_ROWS.map((row, rowIndex) => (
            <div key={rowIndex} className="flex gap-1">
              {row.map((key) => (
                <button
                  key={key}
                  onClick={() => handleKey(key)}
                  className={`
                    ${embedded 
                      ? key.length > 1 ? 'px-2 h-8 text-[9px]' : 'w-6 h-8 text-xs'
                      : key.length > 1 ? 'px-4 h-12 text-sm' : 'w-9 h-12 text-lg'
                    }
                    rounded-md font-semibold transition-all duration-150 active:scale-95
                    ${getKeyClass(key)}
                  `}
                >
                  {key === 'DEL' ? (
                    <Delete className={embedded ? 'w-3 h-3' : 'w-4 h-4'} />
                  ) : key}
                </button>
              ))}
            </div>
          ))}
        </div>

        {/* Game Over Overlay */}
        {gameOver && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur flex items-center justify-center z-20 rounded-3xl">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 text-center">
              <h2 className="text-2xl font-bold text-white mb-3">
                {gameWon ? '🎉 Great Job!' : '😔 Game Over'}
              </h2>
              <p className="text-white/80 mb-2">
                The word was: <span className="font-bold text-green-400">{targetWord}</span>
              </p>
              {gameWon && (
                <p className="text-white/60 text-sm mb-4">
                  Solved in {guesses.length} {guesses.length === 1 ? 'try' : 'tries'}
                </p>
              )}
              <button
                onClick={startNewGame}
                className="bg-green-500 text-white px-5 py-2 rounded-lg font-semibold hover:bg-green-600 transition-colors"
              >
                New Word
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default WordleGame;
