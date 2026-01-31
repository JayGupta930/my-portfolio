import React, { useState, useEffect, useCallback, useRef } from 'react';
import { RotateCcw, Play } from 'lucide-react';

const allEmojis = ['😀', '😎', '🥳', '😍', '🤩', '😇', '🤠', '🥸', '😈', '👻', '👽', '🤖', '🎃', '💀', '🦄', '🐶', '🐱', '🐼', '🐨', '🦊', '🦁', '🐯', '🐸', '🐵', '🌟', '⭐', '🌙', '☀️', '🌈', '❤️', '💜', '💙', '💚', '💛', '🧡', '🖤'];

const EmojiMatch = ({ embedded = false }) => {
  const [targetEmoji, setTargetEmoji] = useState('');
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameActive, setGameActive] = useState(false);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [difficulty, setDifficulty] = useState(6);
  const timerRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem('emoji-match-high-score');
    if (saved) setHighScore(parseInt(saved));
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const generateRound = useCallback((gridSize) => {
    const shuffled = [...allEmojis].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, gridSize);
    const target = selected[Math.floor(Math.random() * selected.length)];
    
    // Shuffle again for display
    const displayOptions = [...selected].sort(() => Math.random() - 0.5);
    
    setTargetEmoji(target);
    setOptions(displayOptions);
    setFeedback(null);
  }, []);

  const startGame = useCallback(() => {
    setScore(0);
    setTimeLeft(30);
    setGameActive(true);
    setStreak(0);
    setDifficulty(6);
    generateRound(6);

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [generateRound]);

  const endGame = useCallback(() => {
    setGameActive(false);
    if (timerRef.current) clearInterval(timerRef.current);
    
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('emoji-match-high-score', score.toString());
    }
  }, [score, highScore]);

  const handleChoice = (emoji) => {
    if (!gameActive || feedback) return;
    
    if (emoji === targetEmoji) {
      const points = 10 + streak * 2 + (30 - timeLeft) / 2;
      setScore(prev => Math.round(prev + points));
      setStreak(prev => prev + 1);
      setFeedback({ correct: true, message: `+${Math.round(points)}` });
      
      // Increase difficulty every 5 correct answers
      if ((streak + 1) % 5 === 0 && difficulty < 12) {
        setDifficulty(prev => Math.min(prev + 2, 12));
      }
      
      setTimeout(() => {
        generateRound(difficulty);
      }, 300);
    } else {
      setStreak(0);
      setFeedback({ correct: false, message: 'Wrong!' });
      
      setTimeout(() => {
        generateRound(difficulty);
      }, 500);
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
            😊 Emoji Match
          </h1>
          <button onClick={startGame} className="p-2 hover:bg-white/10 rounded-lg">
            <RotateCcw className={embedded ? 'w-3.5 h-3.5 text-white' : 'w-5 h-5 text-white'} />
          </button>
        </div>

        {/* Stats */}
        <div className={embedded ? 'bg-white/10 backdrop-blur-md rounded-xl px-2.5 py-1.5 border border-white/10' : 'bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20'}>
          <div className="flex items-center justify-center gap-4">
            <div className={embedded ? 'text-[11px]' : ''}>
              <span className="text-white/60">Score: </span>
              <span className="font-bold text-green-400">{score}</span>
            </div>
            <div className={embedded ? 'text-[11px]' : ''}>
              <span className="text-white/60">Time: </span>
              <span className={`font-bold ${timeLeft <= 10 ? 'text-red-400' : 'text-yellow-400'}`}>{timeLeft}s</span>
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
        <div className="flex-1 flex items-center justify-center min-h-0">
          {!gameActive && timeLeft === 30 ? (
            <button
              onClick={startGame}
              className={`
                flex flex-col items-center gap-3 px-8 py-6 rounded-2xl
                bg-gradient-to-br from-pink-500 to-purple-600
                hover:from-pink-400 hover:to-purple-500
                transition-all duration-200 hover:scale-105 active:scale-95
              `}
            >
              <Play className={embedded ? 'w-8 h-8' : 'w-12 h-12'} />
              <span className={embedded ? 'text-lg font-bold' : 'text-2xl font-bold'}>Start Game</span>
            </button>
          ) : !gameActive && timeLeft === 0 ? (
            <div className="text-center">
              <h2 className={`font-bold text-white mb-4 ${embedded ? 'text-xl' : 'text-3xl'}`}>
                😊 Time's Up!
              </h2>
              <p className={`text-white/80 mb-2 ${embedded ? 'text-sm' : 'text-lg'}`}>
                Final Score: <span className="text-green-400 font-bold">{score}</span>
              </p>
              {score >= highScore && score > 0 && (
                <p className="text-yellow-400 mb-4">🏆 New High Score!</p>
              )}
              <button
                onClick={startGame}
                className="px-6 py-3 bg-pink-500 rounded-xl font-bold hover:bg-pink-400 transition-colors"
              >
                Play Again
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 w-full max-w-sm">
              {/* Target Emoji */}
              <div className="text-center">
                <p className={`text-white/60 mb-2 ${embedded ? 'text-[10px]' : 'text-xs'}`}>
                  Find this emoji:
                </p>
                <div className={`
                  inline-flex items-center justify-center rounded-xl
                  bg-gradient-to-br from-purple-500/30 to-pink-500/30
                  border-2 border-white/20
                  ${embedded ? 'w-16 h-16 text-4xl' : 'w-20 h-20 text-5xl'}
                `}>
                  {targetEmoji}
                </div>
              </div>

              {/* Emoji Grid */}
              <div className={`
                grid gap-2 w-full
                ${difficulty <= 6 ? 'grid-cols-3' : difficulty <= 9 ? 'grid-cols-3' : 'grid-cols-4'}
              `}>
                {options.map((emoji, index) => (
                  <button
                    key={index}
                    onClick={() => handleChoice(emoji)}
                    className={`
                      aspect-square rounded-xl transition-all duration-200
                      bg-white/10 hover:bg-white/20 border border-white/20
                      active:scale-95 hover:scale-105
                      ${embedded ? 'text-2xl' : 'text-3xl'}
                      ${feedback && emoji === targetEmoji ? 'ring-2 ring-green-400 bg-green-500/30' : ''}
                    `}
                  >
                    {emoji}
                  </button>
                ))}
              </div>

              {/* Feedback */}
              {feedback && (
                <div className={`
                  font-bold animate-bounce
                  ${feedback.correct ? 'text-green-400' : 'text-red-400'}
                  ${embedded ? 'text-sm' : 'text-lg'}
                `}>
                  {feedback.message}
                </div>
              )}
            </div>
          )}
        </div>

        <div className={embedded ? 'text-center text-white/50 text-[8px]' : 'text-center text-white/50 text-xs'}>
          <p>Find the matching emoji as fast as you can!</p>
        </div>
      </div>
    </div>
  );
};

export default EmojiMatch;
