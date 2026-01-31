import React, { useState, useEffect, useCallback, useRef } from 'react';
import { RotateCcw, Play, Clock } from 'lucide-react';

const triviaQuestions = [
  { question: "What planet is known as the Red Planet?", options: ["Venus", "Mars", "Jupiter", "Saturn"], answer: 1 },
  { question: "How many continents are there on Earth?", options: ["5", "6", "7", "8"], answer: 2 },
  { question: "What is the largest mammal in the world?", options: ["Elephant", "Blue Whale", "Giraffe", "Polar Bear"], answer: 1 },
  { question: "In which year did World War II end?", options: ["1943", "1944", "1945", "1946"], answer: 2 },
  { question: "What is the capital of Japan?", options: ["Seoul", "Beijing", "Tokyo", "Bangkok"], answer: 2 },
  { question: "How many sides does a hexagon have?", options: ["5", "6", "7", "8"], answer: 1 },
  { question: "What is the hardest natural substance?", options: ["Gold", "Iron", "Diamond", "Platinum"], answer: 2 },
  { question: "Which gas do plants absorb from the air?", options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"], answer: 2 },
  { question: "What is the smallest country in the world?", options: ["Monaco", "Vatican City", "San Marino", "Liechtenstein"], answer: 1 },
  { question: "How many colors are in a rainbow?", options: ["5", "6", "7", "8"], answer: 2 },
  { question: "What is the largest ocean on Earth?", options: ["Atlantic", "Indian", "Arctic", "Pacific"], answer: 3 },
  { question: "Which planet has the most moons?", options: ["Jupiter", "Saturn", "Uranus", "Neptune"], answer: 1 },
  { question: "What is the boiling point of water in Celsius?", options: ["90°C", "95°C", "100°C", "105°C"], answer: 2 },
  { question: "Who painted the Mona Lisa?", options: ["Van Gogh", "Da Vinci", "Picasso", "Michelangelo"], answer: 1 },
  { question: "What is the capital of Australia?", options: ["Sydney", "Melbourne", "Canberra", "Perth"], answer: 2 },
  { question: "How many bones are in the human body?", options: ["186", "206", "226", "246"], answer: 1 },
  { question: "What is the largest land animal?", options: ["Rhino", "Hippo", "Elephant", "Giraffe"], answer: 2 },
  { question: "Which element has the symbol 'O'?", options: ["Gold", "Oxygen", "Osmium", "Oganesson"], answer: 1 },
  { question: "What year did the Titanic sink?", options: ["1910", "1911", "1912", "1913"], answer: 2 },
  { question: "How many players are on a soccer team?", options: ["9", "10", "11", "12"], answer: 2 },
  { question: "What is the speed of light in km/s?", options: ["200,000", "250,000", "300,000", "350,000"], answer: 2 },
  { question: "Which country has the most population?", options: ["India", "USA", "China", "Indonesia"], answer: 0 },
  { question: "What is the main ingredient in guacamole?", options: ["Tomato", "Avocado", "Onion", "Pepper"], answer: 1 },
  { question: "How many hours are in a week?", options: ["148", "158", "168", "178"], answer: 2 },
  { question: "What is the capital of France?", options: ["London", "Berlin", "Madrid", "Paris"], answer: 3 },
];

const QuizTrivia = ({ embedded = false }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(15);
  const [gameActive, setGameActive] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [streak, setStreak] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem('trivia-high-score');
    if (saved) setHighScore(parseInt(saved));
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const shuffleQuestions = useCallback(() => {
    const shuffled = [...triviaQuestions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 10);
  }, []);

  const startGame = useCallback(() => {
    setQuestions(shuffleQuestions());
    setCurrentQuestion(0);
    setScore(0);
    setLives(3);
    setTimeLeft(15);
    setGameActive(true);
    setGameOver(false);
    setSelectedAnswer(null);
    setShowResult(false);
    setStreak(0);

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleTimeout();
          return 15;
        }
        return prev - 1;
      });
    }, 1000);
  }, [shuffleQuestions]);

  const handleTimeout = () => {
    setShowResult(true);
    setSelectedAnswer(-1);
    setStreak(0);
    setLives(prev => {
      const newLives = prev - 1;
      if (newLives <= 0) {
        setTimeout(() => endGame(), 1500);
      } else {
        setTimeout(() => nextQuestion(), 1500);
      }
      return newLives;
    });
  };

  const endGame = useCallback(() => {
    setGameActive(false);
    setGameOver(true);
    if (timerRef.current) clearInterval(timerRef.current);
    
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('trivia-high-score', score.toString());
    }
  }, [score, highScore]);

  const nextQuestion = useCallback(() => {
    if (currentQuestion >= questions.length - 1) {
      endGame();
      return;
    }
    
    setCurrentQuestion(prev => prev + 1);
    setSelectedAnswer(null);
    setShowResult(false);
    setTimeLeft(15);
  }, [currentQuestion, questions.length, endGame]);

  const handleAnswer = (answerIndex) => {
    if (showResult || !gameActive) return;
    
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    const isCorrect = answerIndex === questions[currentQuestion].answer;
    
    if (isCorrect) {
      const timeBonus = timeLeft * 2;
      const streakBonus = streak * 5;
      const points = 100 + timeBonus + streakBonus;
      setScore(prev => prev + points);
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
      setLives(prev => {
        const newLives = prev - 1;
        if (newLives <= 0) {
          setTimeout(() => endGame(), 1500);
        }
        return newLives;
      });
    }
    
    if (lives > (isCorrect ? 0 : 1)) {
      setTimeout(() => nextQuestion(), 1500);
    }
  };

  const containerClass = embedded
    ? 'w-full h-full flex flex-col p-2'
    : 'min-h-screen bg-black flex items-center justify-center p-4';

  const currentQ = questions[currentQuestion];

  return (
    <div className={containerClass}>
      <div className="flex flex-col w-full h-full gap-2 text-white">
        {/* Header */}
        <div className="text-center flex items-center justify-between">
          <h1 className={embedded ? 'text-lg font-bold text-white' : 'text-4xl font-bold text-white'}>
            🧠 Quiz Trivia
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
                <span className="text-white/60">Q: </span>
                <span className="font-bold text-purple-400">{currentQuestion + 1}/{questions.length}</span>
              </div>
              <div className={embedded ? 'text-[11px]' : ''}>
                <span className={`font-bold flex items-center gap-1 ${timeLeft <= 5 ? 'text-red-400' : 'text-yellow-400'}`}>
                  <Clock className="w-3 h-3" /> {timeLeft}s
                </span>
              </div>
              <div className={embedded ? 'text-[11px]' : ''}>
                <span className="text-red-400">{'❤️'.repeat(lives)}</span>
              </div>
              {streak > 1 && (
                <div className={embedded ? 'text-[11px]' : ''}>
                  <span className="font-bold text-orange-400">{streak}🔥</span>
                </div>
              )}
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
                bg-gradient-to-br from-indigo-500 to-purple-600
                hover:from-indigo-400 hover:to-purple-500
                transition-all duration-200 hover:scale-105 active:scale-95
              `}
            >
              <Play className={embedded ? 'w-8 h-8' : 'w-12 h-12'} />
              <span className={embedded ? 'text-lg font-bold' : 'text-2xl font-bold'}>Start Quiz</span>
              <span className={`text-white/60 ${embedded ? 'text-[10px]' : 'text-xs'}`}>10 Questions</span>
            </button>
          ) : gameOver ? (
            <div className="text-center">
              <h2 className={`font-bold text-white mb-4 ${embedded ? 'text-xl' : 'text-3xl'}`}>
                🧠 Quiz Complete!
              </h2>
              <p className={`text-white/80 mb-2 ${embedded ? 'text-sm' : 'text-lg'}`}>
                Final Score: <span className="text-green-400 font-bold">{score}</span>
              </p>
              <p className={`text-white/60 mb-4 ${embedded ? 'text-xs' : 'text-sm'}`}>
                Questions Answered: {currentQuestion + 1}/{questions.length}
              </p>
              {score >= highScore && score > 0 && (
                <p className="text-yellow-400 mb-4">🏆 New High Score!</p>
              )}
              <button
                onClick={startGame}
                className="px-6 py-3 bg-indigo-500 rounded-xl font-bold hover:bg-indigo-400 transition-colors"
              >
                Play Again
              </button>
            </div>
          ) : currentQ ? (
            <div className="flex flex-col gap-3 sm:gap-4 w-full max-w-md px-2">
              {/* Question */}
              <div className={`
                bg-gradient-to-br from-indigo-500/30 to-purple-500/30
                border-2 border-white/20 rounded-2xl p-3 sm:p-5 text-center
              `}>
                <p className={`font-medium text-white ${embedded ? 'text-sm leading-tight' : 'text-lg'}`}>
                  {currentQ.question}
                </p>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 gap-2">
                {currentQ.options.map((option, index) => {
                  let buttonStyle = 'bg-white/10 hover:bg-white/20 border-white/20';
                  
                  if (showResult) {
                    if (index === currentQ.answer) {
                      buttonStyle = 'bg-green-500/50 border-green-400';
                    } else if (index === selectedAnswer && selectedAnswer !== currentQ.answer) {
                      buttonStyle = 'bg-red-500/50 border-red-400';
                    } else {
                      buttonStyle = 'bg-white/5 border-white/10 opacity-50';
                    }
                  }
                  
                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswer(index)}
                      disabled={showResult}
                      className={`
                        py-2 sm:py-3 px-4 rounded-xl font-medium text-left
                        border-2 transition-all duration-200
                        ${buttonStyle}
                        ${!showResult ? 'active:scale-98 hover:scale-[1.02]' : ''}
                        ${embedded ? 'text-xs' : 'text-sm'}
                      `}
                    >
                      <span className="text-white/60 mr-2">{String.fromCharCode(65 + index)}.</span>
                      {option}
                    </button>
                  );
                })}
              </div>

              {/* Result Feedback */}
              {showResult && (
                <div className={`
                  text-center font-bold animate-bounce
                  ${selectedAnswer === currentQ.answer ? 'text-green-400' : 'text-red-400'}
                  ${embedded ? 'text-sm' : 'text-lg'}
                `}>
                  {selectedAnswer === currentQ.answer ? '✓ Correct!' : selectedAnswer === -1 ? '⏰ Time\'s up!' : '✗ Wrong!'}
                </div>
              )}
            </div>
          ) : null}
        </div>

        <div className={embedded ? 'text-center text-white/50 text-[8px]' : 'text-center text-white/50 text-xs'}>
          <p>Test your knowledge with trivia questions!</p>
        </div>
      </div>
    </div>
  );
};

export default QuizTrivia;
