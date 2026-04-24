import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { RotateCcw, Shuffle, Play } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { GAME_IDS, getGameConfig } from '../../config/gamesConfig';
import GameLeaderboard from '../Leaderboard/GameLeaderboard';

const API_URL = `${import.meta.env.VITE_API_URL || 'https://portfolio-backend-bfkl.onrender.com'}/api/scores`;
const GAME_CONFIG = getGameConfig(GAME_IDS.WORD_SCRAMBLE);

const wordList = [
  { word: 'APPLE', hint: 'A fruit 🍎' },
  { word: 'BEACH', hint: 'Sandy shore 🏖️' },
  { word: 'CLOUD', hint: 'In the sky ☁️' },
  { word: 'DANCE', hint: 'Move to music 💃' },
  { word: 'EARTH', hint: 'Our planet 🌍' },
  { word: 'FLAME', hint: 'Fire produces this 🔥' },
  { word: 'GRAPE', hint: 'Wine fruit 🍇' },
  { word: 'HOUSE', hint: 'Where you live 🏠' },
  { word: 'IMAGE', hint: 'A picture 🖼️' },
  { word: 'JUICE', hint: 'Drink from fruit 🧃' },
  { word: 'KNIFE', hint: 'Cutting tool 🔪' },
  { word: 'LEMON', hint: 'Sour fruit 🍋' },
  { word: 'MUSIC', hint: 'Sounds and rhythm 🎵' },
  { word: 'NIGHT', hint: 'After sunset 🌙' },
  { word: 'OCEAN', hint: 'Large body of water 🌊' },
  { word: 'PIANO', hint: 'Musical instrument 🎹' },
  { word: 'QUEEN', hint: 'Female ruler 👑' },
  { word: 'ROBOT', hint: 'Mechanical being 🤖' },
  { word: 'STORM', hint: 'Bad weather ⛈️' },
  { word: 'TIGER', hint: 'Striped big cat 🐯' },
  { word: 'WATCH', hint: 'Tells time ⌚' },
  { word: 'ZEBRA', hint: 'Black and white animal 🦓' },
  { word: 'BRAIN', hint: 'Think with this 🧠' },
  { word: 'HEART', hint: 'Pumps blood ❤️' },
  { word: 'SMILE', hint: 'Happy expression 😊' },
];

const WordScramble = ({ embedded = false }) => {
  const [currentWord, setCurrentWord] = useState(null);
  const [scrambledWord, setScrambledWord] = useState('');
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameActive, setGameActive] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [wordsCompleted, setWordsCompleted] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const timerRef = useRef(null);
  const inputRef = useRef(null);

  const { user } = useAuth();

  const submitScore = useCallback(async (finalScore) => {
    if (finalScore <= 0) return;
    try {
      const userId = user?.uid || localStorage.getItem('userId') || `guest_${Date.now()}`;
      const username = user?.displayName || localStorage.getItem('username') || `Player${Math.floor(Math.random() * 9999)}`;
      if (!user) {
        if (!localStorage.getItem('userId')) localStorage.setItem('userId', userId);
        if (!localStorage.getItem('username')) localStorage.setItem('username', username);
      }
      localStorage.setItem(`${GAME_CONFIG.id}-last-played`, JSON.stringify({
        score: finalScore, userId, username,
        playedAt: new Date().toISOString(),
        gameId: GAME_CONFIG.id, gameName: GAME_CONFIG.name
      }));
      await axios.post(API_URL, {
        userId, username,
        gameId: GAME_CONFIG.id, gameName: GAME_CONFIG.name,
        score: finalScore, playedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error submitting score:', error);
    }
  }, [user]);

  useEffect(() => {
    if (!gameActive && timeLeft === 0 && score > 0) {
      submitScore(score);
    }
  }, [gameActive, timeLeft]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const saved = localStorage.getItem('scramble-high-score');
    if (saved) setHighScore(parseInt(saved));
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const scrambleWord = (word) => {
    const arr = word.split('');
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    const scrambled = arr.join('');
    // Make sure scrambled word is different from original
    if (scrambled === word) return scrambleWord(word);
    return scrambled;
  };

  const getNewWord = useCallback(() => {
    const randomWord = wordList[Math.floor(Math.random() * wordList.length)];
    setCurrentWord(randomWord);
    setScrambledWord(scrambleWord(randomWord.word));
    setUserInput('');
    setShowHint(false);
    setFeedback(null);
    inputRef.current?.focus();
  }, []);

  const startGame = useCallback(() => {
    setScore(0);
    setTimeLeft(60);
    setGameActive(true);
    setWordsCompleted(0);
    getNewWord();

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [getNewWord]);

  const endGame = useCallback(() => {
    setGameActive(false);
    if (timerRef.current) clearInterval(timerRef.current);
    
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('scramble-high-score', score.toString());
    }
  }, [score, highScore]);

  const checkAnswer = () => {
    if (!currentWord || !userInput.trim()) return;
    
    if (userInput.toUpperCase() === currentWord.word) {
      const timeBonus = Math.floor(timeLeft / 10) * 5;
      const hintPenalty = showHint ? 0 : 10;
      const points = 20 + timeBonus + hintPenalty;
      
      setScore(prev => prev + points);
      setWordsCompleted(prev => prev + 1);
      setFeedback({ correct: true, message: `+${points} points!` });
      
      setTimeout(() => {
        getNewWord();
      }, 800);
    } else {
      setFeedback({ correct: false, message: 'Try again!' });
      setUserInput('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      checkAnswer();
    }
  };

  const skipWord = () => {
    setScore(prev => Math.max(0, prev - 5));
    getNewWord();
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
            🔤 Word Scramble
          </h1>
          <button onClick={startGame} className="p-2 hover:bg-white/10 rounded-lg">
            <RotateCcw className={embedded ? 'w-3.5 h-3.5 text-white' : 'w-5 h-5 text-white'} />
          </button>
        </div>

        {/* Stats */}
        {gameActive && (
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
                <span className="text-white/60">Words: </span>
                <span className="font-bold text-purple-400">{wordsCompleted}</span>
              </div>
            </div>
          </div>
        )}

        {/* Game Area */}
        <div className="flex-1 flex items-center justify-center min-h-0">
          {!gameActive && timeLeft === 60 ? (
            <button
              onClick={startGame}
              className={`
                flex flex-col items-center gap-3 px-8 py-6 rounded-2xl
                bg-gradient-to-br from-green-500 to-teal-600
                hover:from-green-400 hover:to-teal-500
                transition-all duration-200 hover:scale-105 active:scale-95
              `}
            >
              <Play className={embedded ? 'w-8 h-8' : 'w-12 h-12'} />
              <span className={embedded ? 'text-lg font-bold' : 'text-2xl font-bold'}>Start Game</span>
            </button>
          ) : !gameActive && timeLeft === 0 ? (
            <div className="text-center">
              <h2 className={`font-bold text-white mb-4 ${embedded ? 'text-xl' : 'text-3xl'}`}>
                🔤 Time's Up!
              </h2>
              <p className={`text-white/80 mb-2 ${embedded ? 'text-sm' : 'text-lg'}`}>
                Final Score: <span className="text-green-400 font-bold">{score}</span>
              </p>
              <p className={`text-white/60 mb-4 ${embedded ? 'text-xs' : 'text-sm'}`}>
                Words Solved: {wordsCompleted} | High Score: {highScore}
              </p>
              {score >= highScore && score > 0 && (
                <p className="text-yellow-400 mb-4">🏆 New High Score!</p>
              )}
              <button
                onClick={startGame}
                className="px-6 py-3 bg-green-500 rounded-xl font-bold hover:bg-green-400 transition-colors"
              >
                Play Again
              </button>
            </div>
          ) : currentWord ? (
            <div className="flex flex-col items-center gap-4 w-full max-w-sm px-2">
              {/* Scrambled Word */}
              <div className="flex gap-1 sm:gap-2 flex-wrap justify-center">
                {scrambledWord.split('').map((letter, index) => (
                  <div
                    key={index}
                    className={`
                      flex items-center justify-center rounded-lg
                      // bg-gradient-to-br from-purple-500 to-pink-500
                      font-bold text-white
                      ${embedded ? 'w-8 h-10 text-lg' : 'w-12 h-14 text-2xl'}
                    `}
                  >
                    {letter}
                  </div>
                ))}
              </div>

              {/* Hint */}
              {showHint && (
                <p className={`text-yellow-400 ${embedded ? 'text-xs' : 'text-sm'}`}>
                  Hint: {currentWord.hint}
                </p>
              )}

              {/* Input */}
              <input
                ref={inputRef}
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value.toUpperCase())}
                onKeyPress={handleKeyPress}
                placeholder="Type your answer"
                maxLength={currentWord.word.length}
                className={`
                  w-full bg-white/10 border-2 border-white/20 rounded-xl
                  text-center font-bold text-white placeholder-white/40 uppercase
                  focus:outline-none focus:border-green-400
                  ${embedded ? 'p-2 text-lg' : 'p-3 text-xl'}
                `}
              />

              {/* Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={checkAnswer}
                  className={`
                    px-4 py-2 rounded-xl font-bold
                    bg-gradient-to-r from-green-500 to-emerald-500
                    hover:from-green-400 hover:to-emerald-400
                    transition-all duration-200
                    ${embedded ? 'text-xs' : 'text-sm'}
                  `}
                >
                  Submit
                </button>
                <button
                  onClick={() => setShowHint(true)}
                  disabled={showHint}
                  className={`
                    px-4 py-2 rounded-xl font-bold
                    bg-yellow-500/80 hover:bg-yellow-400
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition-all duration-200
                    ${embedded ? 'text-xs' : 'text-sm'}
                  `}
                >
                  Hint
                </button>
                <button
                  onClick={skipWord}
                  className={`
                    px-4 py-2 rounded-xl font-bold
                    bg-white/20 hover:bg-white/30
                    transition-all duration-200
                    ${embedded ? 'text-xs' : 'text-sm'}
                  `}
                >
                  <Shuffle className="w-4 h-4" />
                </button>
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
          ) : null}
        </div>

        <div className={embedded ? 'text-center text-white/50 text-[8px]' : 'text-center text-white/50 text-xs'}>
          <p>Unscramble the letters to form a word!</p>
        </div>

        {/* Game Leaderboard */}
        {!embedded && GAME_CONFIG && (
          <GameLeaderboard
            gameId={GAME_CONFIG.id}
            gameName={GAME_CONFIG.name}
            emoji={GAME_CONFIG.emoji}
            gradient={GAME_CONFIG.gradient}
            storageKey={GAME_CONFIG.storageKey}
          />
        )}
      </div>
    </div>
  );
};

export default WordScramble;
