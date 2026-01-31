import React, { useState, useEffect, useCallback } from 'react';
import { RotateCcw } from 'lucide-react';

const words = [
  'JAVASCRIPT', 'PYTHON', 'REACT', 'ANGULAR', 'NODEJS',
  'DEVELOPER', 'PROGRAMMING', 'COMPUTER', 'ALGORITHM', 'DATABASE',
  'FRONTEND', 'BACKEND', 'MOBILE', 'WEBSITE', 'APPLICATION',
  'SOFTWARE', 'HARDWARE', 'NETWORK', 'SECURITY', 'CLOUD',
  'DESIGN', 'INTERFACE', 'COMPONENT', 'FUNCTION', 'VARIABLE',
  'PORTFOLIO', 'CREATIVE', 'DIGITAL', 'TECHNOLOGY', 'INNOVATION'
];

const Hangman = ({ embedded = false }) => {
  const [word, setWord] = useState('');
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [gameStatus, setGameStatus] = useState('playing');
  const [wins, setWins] = useState(0);
  const [losses, setLosses] = useState(0);
  const maxWrongGuesses = 6;

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  const startGame = useCallback(() => {
    const randomWord = words[Math.floor(Math.random() * words.length)];
    setWord(randomWord);
    setGuessedLetters([]);
    setWrongGuesses(0);
    setGameStatus('playing');
  }, []);

  useEffect(() => {
    startGame();
  }, [startGame]);

  useEffect(() => {
    if (!word) return;
    
    const wordLetters = word.split('');
    const allGuessed = wordLetters.every(letter => guessedLetters.includes(letter));
    
    if (allGuessed && word) {
      setGameStatus('won');
      setWins(prev => prev + 1);
    } else if (wrongGuesses >= maxWrongGuesses) {
      setGameStatus('lost');
      setLosses(prev => prev + 1);
    }
  }, [guessedLetters, wrongGuesses, word]);

  const guessLetter = (letter) => {
    if (gameStatus !== 'playing' || guessedLetters.includes(letter)) return;
    
    setGuessedLetters(prev => [...prev, letter]);
    
    if (!word.includes(letter)) {
      setWrongGuesses(prev => prev + 1);
    }
  };

  const displayWord = word.split('').map((letter, index) => (
    <span
      key={index}
      className={`
        inline-flex items-center justify-center border-b-2 border-white/40
        ${embedded ? 'w-5 h-6 text-sm mx-0.5' : 'w-8 h-10 text-xl mx-1'}
        font-bold text-white
      `}
    >
      {guessedLetters.includes(letter) || gameStatus === 'lost' ? letter : ''}
    </span>
  ));

  const hangmanParts = [
    <circle key="head" cx="50" cy="25" r="10" stroke="white" strokeWidth="2" fill="none" />,
    <line key="body" x1="50" y1="35" x2="50" y2="60" stroke="white" strokeWidth="2" />,
    <line key="leftArm" x1="50" y1="40" x2="35" y2="50" stroke="white" strokeWidth="2" />,
    <line key="rightArm" x1="50" y1="40" x2="65" y2="50" stroke="white" strokeWidth="2" />,
    <line key="leftLeg" x1="50" y1="60" x2="35" y2="80" stroke="white" strokeWidth="2" />,
    <line key="rightLeg" x1="50" y1="60" x2="65" y2="80" stroke="white" strokeWidth="2" />,
  ];

  const containerClass = embedded
    ? 'w-full h-full flex flex-col p-2'
    : 'min-h-screen bg-black flex items-center justify-center p-4';

  return (
    <div className={containerClass}>
      <div className="flex flex-col w-full h-full gap-2 text-white">
        {/* Header */}
        <div className="text-center flex items-center justify-between">
          <h1 className={embedded ? 'text-lg font-bold text-white' : 'text-4xl font-bold text-white'}>
            🎯 Hangman
          </h1>
          <button onClick={startGame} className="p-2 hover:bg-white/10 rounded-lg">
            <RotateCcw className={embedded ? 'w-3.5 h-3.5 text-white' : 'w-5 h-5 text-white'} />
          </button>
        </div>

        {/* Stats */}
        <div className={embedded ? 'bg-white/10 backdrop-blur-md rounded-xl px-2.5 py-1.5 border border-white/10' : 'bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20'}>
          <div className="flex items-center justify-center gap-4">
            <div className={embedded ? 'text-[11px]' : ''}>
              <span className="text-white/60">Wins: </span>
              <span className="font-bold text-green-400">{wins}</span>
            </div>
            <div className={embedded ? 'text-[11px]' : ''}>
              <span className="text-white/60">Losses: </span>
              <span className="font-bold text-red-400">{losses}</span>
            </div>
            <div className={embedded ? 'text-[11px]' : ''}>
              <span className="text-white/60">Left: </span>
              <span className={`font-bold ${maxWrongGuesses - wrongGuesses <= 2 ? 'text-red-400' : 'text-yellow-400'}`}>
                {maxWrongGuesses - wrongGuesses}
              </span>
            </div>
          </div>
        </div>

        {/* Game Area */}
        <div className="flex-1 flex flex-col items-center justify-center min-h-0 gap-3">
          {/* Hangman Drawing */}
          <svg 
            viewBox="0 0 100 100" 
            className={embedded ? 'w-20 h-20' : 'w-32 h-32'}
          >
            {/* Gallows */}
            <line x1="10" y1="95" x2="90" y2="95" stroke="white" strokeWidth="2" />
            <line x1="30" y1="95" x2="30" y2="5" stroke="white" strokeWidth="2" />
            <line x1="30" y1="5" x2="50" y2="5" stroke="white" strokeWidth="2" />
            <line x1="50" y1="5" x2="50" y2="15" stroke="white" strokeWidth="2" />
            {/* Body parts based on wrong guesses */}
            {hangmanParts.slice(0, wrongGuesses)}
          </svg>

          {/* Word Display */}
          <div className="flex flex-wrap justify-center">
            {displayWord}
          </div>

          {/* Game Over Message */}
          {gameStatus !== 'playing' && (
            <div className={`text-center ${gameStatus === 'won' ? 'text-green-400' : 'text-red-400'} ${embedded ? 'text-sm' : 'text-lg'} font-bold`}>
              {gameStatus === 'won' ? '🎉 You Won!' : `💀 Game Over! The word was: ${word}`}
            </div>
          )}

          {/* Keyboard */}
          <div className={`grid grid-cols-9 gap-1 ${embedded ? 'max-w-[260px]' : 'max-w-md'} w-full px-1`}>
            {alphabet.map((letter) => {
              const isGuessed = guessedLetters.includes(letter);
              const isCorrect = isGuessed && word.includes(letter);
              const isWrong = isGuessed && !word.includes(letter);
              
              return (
                <button
                  key={letter}
                  onClick={() => guessLetter(letter)}
                  disabled={isGuessed || gameStatus !== 'playing'}
                  className={`
                    aspect-square rounded-lg font-bold transition-all duration-200
                    ${embedded ? 'text-xs' : 'text-sm'}
                    ${isCorrect ? 'bg-green-500/50 text-green-300' : ''}
                    ${isWrong ? 'bg-red-500/50 text-red-300' : ''}
                    ${!isGuessed ? 'bg-white/10 hover:bg-white/20 text-white' : ''}
                    ${isGuessed ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}
                    border border-white/10
                  `}
                >
                  {letter}
                </button>
              );
            })}
          </div>
        </div>

        <div className={embedded ? 'text-center text-white/50 text-[8px]' : 'text-center text-white/50 text-xs'}>
          <p>Guess letters to reveal the word!</p>
        </div>
      </div>
    </div>
  );
};

export default Hangman;
