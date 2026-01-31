import React, { useState, useEffect, useCallback, useRef } from 'react';
import { RotateCcw, Play } from 'lucide-react';

const MathQuiz = ({ embedded = false }) => {
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(10);
  const [gameActive, setGameActive] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [highScore, setHighScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [difficulty, setDifficulty] = useState(1);
  const timerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem('math-high-score');
    if (saved) setHighScore(parseInt(saved));
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const generateQuestion = useCallback((diff) => {
    const operations = ['+', '-', '×'];
    if (diff >= 3) operations.push('÷');
    
    const operation = operations[Math.floor(Math.random() * operations.length)];
    let num1, num2, correctAnswer;
    
    const maxNum = Math.min(10 + diff * 5, 50);
    
    switch (operation) {
      case '+':
        num1 = Math.floor(Math.random() * maxNum) + 1;
        num2 = Math.floor(Math.random() * maxNum) + 1;
        correctAnswer = num1 + num2;
        break;
      case '-':
        num1 = Math.floor(Math.random() * maxNum) + 10;
        num2 = Math.floor(Math.random() * Math.min(num1, maxNum));
        correctAnswer = num1 - num2;
        break;
      case '×':
        num1 = Math.floor(Math.random() * Math.min(12, maxNum / 2)) + 1;
        num2 = Math.floor(Math.random() * Math.min(12, maxNum / 2)) + 1;
        correctAnswer = num1 * num2;
        break;
      case '÷':
        num2 = Math.floor(Math.random() * 10) + 1;
        correctAnswer = Math.floor(Math.random() * 10) + 1;
        num1 = num2 * correctAnswer;
        break;
      default:
        num1 = 1;
        num2 = 1;
        correctAnswer = 2;
    }
    
    return {
      num1,
      num2,
      operation,
      correctAnswer,
      display: `${num1} ${operation} ${num2} = ?`
    };
  }, []);

  const startGame = useCallback(() => {
    setScore(0);
    setLives(3);
    setStreak(0);
    setDifficulty(1);
    setGameActive(true);
    setGameOver(false);
    setFeedback(null);
    setAnswer('');
    
    const newQuestion = generateQuestion(1);
    setQuestion(newQuestion);
    setTimeLeft(10);
    
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleTimeout();
          return 10;
        }
        return prev - 1;
      });
    }, 1000);
    
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [generateQuestion]);

  const handleTimeout = () => {
    setFeedback({ correct: false, message: 'Time\'s up!' });
    setStreak(0);
    setLives(prev => {
      const newLives = prev - 1;
      if (newLives <= 0) {
        endGame();
      }
      return newLives;
    });
    
    setTimeout(() => {
      if (!gameOver) {
        nextQuestion();
      }
    }, 1000);
  };

  const endGame = useCallback(() => {
    setGameActive(false);
    setGameOver(true);
    if (timerRef.current) clearInterval(timerRef.current);
    
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('math-high-score', score.toString());
    }
  }, [score, highScore]);

  const nextQuestion = useCallback(() => {
    const newQuestion = generateQuestion(difficulty);
    setQuestion(newQuestion);
    setAnswer('');
    setFeedback(null);
    setTimeLeft(Math.max(5, 10 - Math.floor(difficulty / 2)));
    inputRef.current?.focus();
  }, [generateQuestion, difficulty]);

  const submitAnswer = useCallback(() => {
    if (!question || !answer || feedback) return;
    
    const userAnswer = parseInt(answer);
    const isCorrect = userAnswer === question.correctAnswer;
    
    if (isCorrect) {
      const points = 10 + streak * 2 + (timeLeft * 2);
      setScore(prev => prev + points);
      setStreak(prev => prev + 1);
      setFeedback({ correct: true, message: `+${points} points!` });
      
      if (streak > 0 && streak % 5 === 4) {
        setDifficulty(prev => prev + 1);
      }
    } else {
      setStreak(0);
      setFeedback({ correct: false, message: `Answer: ${question.correctAnswer}` });
      setLives(prev => {
        const newLives = prev - 1;
        if (newLives <= 0) {
          setTimeout(() => endGame(), 1000);
        }
        return newLives;
      });
    }
    
    setTimeout(() => {
      if (!gameOver && lives > (isCorrect ? 0 : 1)) {
        nextQuestion();
      }
    }, 1000);
  }, [question, answer, feedback, streak, timeLeft, lives, gameOver, nextQuestion, endGame]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      submitAnswer();
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
            🧮 Math Quiz
          </h1>
          <button onClick={startGame} className="p-2 hover:bg-white/10 rounded-lg">
            <RotateCcw className={embedded ? 'w-3.5 h-3.5 text-white' : 'w-5 h-5 text-white'} />
          </button>
        </div>

        {/* Stats */}
        {gameActive && (
          <div className={embedded ? 'bg-white/10 backdrop-blur-md rounded-xl px-2.5 py-1.5 border border-white/10' : 'bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20'}>
            <div className="flex items-center justify-center gap-3 sm:gap-4">
              <div className={embedded ? 'text-[11px]' : ''}>
                <span className="text-white/60">Score: </span>
                <span className="font-bold text-green-400">{score}</span>
              </div>
              <div className={embedded ? 'text-[11px]' : ''}>
                <span className="text-white/60">Time: </span>
                <span className={`font-bold ${timeLeft <= 3 ? 'text-red-400' : 'text-yellow-400'}`}>{timeLeft}s</span>
              </div>
              <div className={embedded ? 'text-[11px]' : ''}>
                <span className="text-red-400">{'❤️'.repeat(lives)}</span>
              </div>
              <div className={embedded ? 'text-[11px]' : ''}>
                <span className="text-white/60">Streak: </span>
                <span className="font-bold text-orange-400">{streak}🔥</span>
              </div>
            </div>
          </div>
        )}

        {/* Game Area */}
        <div className="flex-1 flex items-center justify-center min-h-0">
          {!gameActive && !gameOver ? (
            <button
              onClick={startGame}
              className={`
                flex flex-col items-center gap-3 px-8 py-6 rounded-2xl
                bg-gradient-to-br from-blue-500 to-purple-600
                hover:from-blue-400 hover:to-purple-500
                transition-all duration-200 hover:scale-105 active:scale-95
              `}
            >
              <Play className={embedded ? 'w-8 h-8' : 'w-12 h-12'} />
              <span className={embedded ? 'text-lg font-bold' : 'text-2xl font-bold'}>Start Quiz</span>
            </button>
          ) : gameOver ? (
            <div className="text-center">
              <h2 className={`font-bold text-white mb-4 ${embedded ? 'text-xl' : 'text-3xl'}`}>
                🧮 Game Over!
              </h2>
              <p className={`text-white/80 mb-2 ${embedded ? 'text-sm' : 'text-lg'}`}>
                Final Score: <span className="text-green-400 font-bold">{score}</span>
              </p>
              <p className={`text-white/60 mb-4 ${embedded ? 'text-xs' : 'text-sm'}`}>
                High Score: {highScore}
              </p>
              {score >= highScore && score > 0 && (
                <p className="text-yellow-400 mb-4">🏆 New High Score!</p>
              )}
              <button
                onClick={startGame}
                className="px-6 py-3 bg-blue-500 rounded-xl font-bold hover:bg-blue-400 transition-colors"
              >
                Play Again
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 w-full max-w-xs">
              {/* Question */}
              <div className={`
                bg-gradient-to-br from-purple-500/30 to-blue-500/30
                border-2 border-white/20 rounded-2xl p-4 sm:p-6 w-full text-center
              `}>
                <p className={`font-bold text-white ${embedded ? 'text-2xl' : 'text-4xl'}`}>
                  {question?.display}
                </p>
              </div>

              {/* Input */}
              <input
                ref={inputRef}
                type="number"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Your answer"
                className={`
                  w-full bg-white/10 border-2 border-white/20 rounded-xl
                  text-center font-bold text-white placeholder-white/40
                  focus:outline-none focus:border-purple-400
                  ${embedded ? 'p-3 text-xl' : 'p-4 text-2xl'}
                `}
                disabled={!!feedback}
              />

              {/* Submit Button */}
              <button
                onClick={submitAnswer}
                disabled={!answer || !!feedback}
                className={`
                  w-full py-3 rounded-xl font-bold
                  bg-gradient-to-r from-purple-500 to-blue-500
                  hover:from-purple-400 hover:to-blue-400
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-all duration-200
                  ${embedded ? 'text-sm' : 'text-lg'}
                `}
              >
                Submit
              </button>

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
          <p>Solve math problems as fast as you can!</p>
        </div>
      </div>
    </div>
  );
};

export default MathQuiz;
