import React, { useState, useEffect, useCallback, useRef } from 'react';
import { RotateCcw, Timer } from 'lucide-react';

const WORDS = [
  'react', 'javascript', 'coding', 'developer', 'function', 'variable', 'component',
  'programming', 'algorithm', 'database', 'frontend', 'backend', 'fullstack', 'server',
  'client', 'browser', 'terminal', 'keyboard', 'software', 'hardware', 'network',
  'internet', 'website', 'application', 'framework', 'library', 'module', 'package'
];

const GAME_DURATION = 30;

const TypingGame = ({ embedded = false }) => {
  const [words, setWords] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [correctWords, setCorrectWords] = useState(0);
  const [wrongWords, setWrongWords] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem('typing-high-score');
    if (saved) setHighScore(parseInt(saved));
  }, []);

  const generateWords = useCallback(() => {
    const shuffled = [...WORDS].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 20);
  }, []);

  const startGame = useCallback(() => {
    setWords(generateWords());
    setCurrentInput('');
    setCurrentWordIndex(0);
    setCorrectWords(0);
    setWrongWords(0);
    setTimeLeft(GAME_DURATION);
    setGameStarted(true);
    setGameOver(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [generateWords]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameOver(true);
          setGameStarted(false);
          if (correctWords > highScore) {
            setHighScore(correctWords);
            localStorage.setItem('typing-high-score', correctWords.toString());
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, gameOver, correctWords, highScore]);

  const handleInputChange = (e) => {
    const value = e.target.value;

    if (value.endsWith(' ')) {
      const typedWord = value.trim();
      if (typedWord === words[currentWordIndex]) {
        setCorrectWords(prev => prev + 1);
      } else {
        setWrongWords(prev => prev + 1);
      }
      setCurrentWordIndex(prev => {
        if (prev >= words.length - 1) {
          setWords(prev => [...prev, ...generateWords()]);
        }
        return prev + 1;
      });
      setCurrentInput('');
    } else {
      setCurrentInput(value);
    }
  };

  const wpm = gameOver ? Math.round((correctWords / GAME_DURATION) * 60) : Math.round((correctWords / (GAME_DURATION - timeLeft || 1)) * 60);
  const accuracy = correctWords + wrongWords > 0 ? Math.round((correctWords / (correctWords + wrongWords)) * 100) : 100;

  const containerClass = embedded
    ? 'w-full h-full flex flex-col p-2'
    : 'min-h-screen bg-black flex items-center justify-center p-4';

  return (
    <div className={containerClass}>
      <div className="flex flex-col w-full h-full gap-2 text-white">
        {/* Header */}
        <div className="text-center">
          <h1 className={embedded ? 'text-xl font-bold text-white mb-0.5' : 'text-4xl font-bold text-white mb-2'}>
            ⌨️ Speed Typing
          </h1>
        </div>

        {/* Stats */}
        <div className={embedded ? 'bg-white/10 backdrop-blur-md rounded-xl px-2.5 py-1.5 border border-white/10' : 'bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20'}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`flex items-center gap-1 ${embedded ? 'text-[11px]' : ''}`}>
                <Timer className={embedded ? 'w-3 h-3 text-yellow-400' : 'w-4 h-4 text-yellow-400'} />
                <span className="font-bold text-yellow-400">{timeLeft}s</span>
              </div>
              <div className={embedded ? 'text-[11px]' : ''}>
                <span className="text-white/60">WPM: </span>
                <span className="font-bold text-green-400">{wpm}</span>
              </div>
              <div className={embedded ? 'text-[11px]' : ''}>
                <span className="text-white/60">Acc: </span>
                <span className="font-bold text-blue-400">{accuracy}%</span>
              </div>
            </div>
            <button onClick={startGame} className="p-2 hover:bg-white/10 rounded-lg">
              <RotateCcw className={embedded ? 'w-3.5 h-3.5 text-white' : 'w-5 h-5 text-white'} />
            </button>
          </div>
        </div>

        {/* Game Area */}
        <div className="flex-1 flex flex-col items-center justify-center gap-4 min-h-0">
          {!gameStarted && !gameOver ? (
            <button
              onClick={startGame}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-bold hover:opacity-90 transition-opacity"
            >
              Start Typing Test
            </button>
          ) : (
            <>
              {/* Words Display */}
              <div className={`bg-white/5 rounded-xl p-4 ${embedded ? 'max-w-[260px]' : 'max-w-md'} w-full`}>
                <div className={`flex flex-wrap gap-2 ${embedded ? 'text-sm' : 'text-lg'}`}>
                  {words.slice(currentWordIndex, currentWordIndex + 8).map((word, index) => (
                    <span
                      key={currentWordIndex + index}
                      className={`
                        px-2 py-1 rounded
                        ${index === 0 
                          ? 'bg-purple-500/30 border border-purple-400' 
                          : 'text-white/60'
                        }
                      `}
                    >
                      {index === 0 ? (
                        word.split('').map((char, charIndex) => (
                          <span
                            key={charIndex}
                            className={
                              charIndex < currentInput.length
                                ? currentInput[charIndex] === char
                                  ? 'text-green-400'
                                  : 'text-red-400'
                                : ''
                            }
                          >
                            {char}
                          </span>
                        ))
                      ) : (
                        word
                      )}
                    </span>
                  ))}
                </div>
              </div>

              {/* Input */}
              <input
                ref={inputRef}
                type="text"
                value={currentInput}
                onChange={handleInputChange}
                disabled={gameOver}
                className={`
                  bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-center
                  focus:outline-none focus:border-purple-400 transition-colors
                  ${embedded ? 'max-w-[200px] text-sm' : 'max-w-xs text-lg'}
                  ${gameOver ? 'opacity-50' : ''}
                `}
                placeholder="Type here..."
                autoComplete="off"
              />

              {/* Score */}
              <div className={`flex gap-4 ${embedded ? 'text-xs' : 'text-sm'}`}>
                <span className="text-green-400">✓ {correctWords}</span>
                <span className="text-red-400">✗ {wrongWords}</span>
              </div>
            </>
          )}
        </div>

        {/* Game Over Overlay */}
        {gameOver && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur flex items-center justify-center z-20 rounded-3xl">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 text-center">
              <h2 className="text-2xl font-bold text-white mb-3">⌨️ Time's Up!</h2>
              <div className="space-y-2 mb-4">
                <p className="text-white/80">WPM: <span className="font-bold text-green-400">{wpm}</span></p>
                <p className="text-white/80">Accuracy: <span className="font-bold text-blue-400">{accuracy}%</span></p>
                <p className="text-white/80">Words: <span className="font-bold">{correctWords}</span></p>
                <p className="text-white/60 text-sm">Best: {highScore} words</p>
              </div>
              <button
                onClick={startGame}
                className="bg-purple-500 text-white px-5 py-2 rounded-lg font-semibold hover:bg-purple-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TypingGame;
