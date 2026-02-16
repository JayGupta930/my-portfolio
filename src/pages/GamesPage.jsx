import React, { useState, Suspense, lazy, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signInAnonymously, signOut } from "firebase/auth";
import { ArrowLeft, HelpCircle, X, Play, Trophy } from "lucide-react";
import GameLeaderboard from "../components/Leaderboard/GameLeaderboard";
import { GAMES_CONFIG } from "../config/gamesConfig";

// Lazy load all game components - they'll only be downloaded when selected
const Game2048 = lazy(() => import("../components/2048/Game2048"));
const TicTacToe = lazy(() => import("../components/TicTacToe/Tic"));
const MemoryGame = lazy(() => import("../components/MemoryGame/MemoryGame"));
const SnakeGame = lazy(() => import("../components/SnakeGame/SnakeGame"));
const Minesweeper = lazy(() => import("../components/Minesweeper/Minesweeper"));
const SimonSays = lazy(() => import("../components/SimonSays/SimonSays"));
const WordleGame = lazy(() => import("../components/WordleGame/WordleGame"));
const FlappyBird = lazy(() => import("../components/FlappyBird/FlappyBird"));
const TypingGame = lazy(() => import("../components/TypingGame/TypingGame"));
const ColorGuess = lazy(() => import("../components/ColorGuess/ColorGuess"));
const ReactionTime = lazy(() => import("../components/ReactionTime/ReactionTime"));
const NumberGuess = lazy(() => import("../components/NumberGuess/NumberGuess"));
const RockPaperScissors = lazy(() => import("../components/RockPaperScissors/RockPaperScissors"));
const WhackAMole = lazy(() => import("../components/WhackAMole/WhackAMole"));
const MathQuiz = lazy(() => import("../components/MathQuiz/MathQuiz"));
const PatternLock = lazy(() => import("../components/PatternLock/PatternLock"));
const QuizTrivia = lazy(() => import("../components/QuizTrivia/QuizTrivia"));
const Hangman = lazy(() => import("../components/Hangman/Hangman"));
const DiceRoll = lazy(() => import("../components/DiceRoll/DiceRoll"));
const WordScramble = lazy(() => import("../components/WordScramble/WordScramble"));
const TapSpeed = lazy(() => import("../components/TapSpeed/TapSpeed"));
const EmojiMatch = lazy(() => import("../components/EmojiMatch/EmojiMatch"));
const CardMatch = lazy(() => import("../components/CardMatch/CardMatch"));
const TargetShoot = lazy(() => import("../components/TargetShoot/TargetShoot"));
const CoinFlip = lazy(() => import("../components/CoinFlip/CoinFlip"));

// Loading spinner for when games are loading
const GameLoader = () => (
  <div className="flex items-center justify-center min-h-[300px]">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
      <p className="text-white/60 text-sm">Loading game...</p>
    </div>
  </div>
);

const gameGuides = [
  {
    emoji: "🔢",
    name: "2048",
    controls: "Arrow Keys / Swipe",
    howToPlay: "Slide tiles in any direction. When two tiles with the same number touch, they merge into one! Keep merging to reach 2048.",
    tips: "Focus on keeping your highest tile in a corner. Build a chain of descending values along an edge."
  },
  {
    emoji: "⭕",
    name: "Tic Tac Toe",
    controls: "Mouse Click",
    howToPlay: "You play as X, AI plays as O. Click on any empty cell to place your mark. Get 3 in a row to win!",
    tips: "The AI uses the Minimax algorithm - it's unbeatable! Try to force a draw by starting in the center or corners."
  },
  {
    emoji: "🎯",
    name: "Memory Match",
    controls: "Mouse Click",
    howToPlay: "Click cards to flip them over. Find matching pairs of emojis. Match all pairs to win!",
    tips: "Try to remember the position of cards you've seen. Start from one area and work systematically."
  },
  {
    emoji: "🐍",
    name: "Snake",
    controls: "Arrow Keys / Buttons",
    howToPlay: "Control the snake to eat the red food. Each food makes you longer. Don't hit yourself!",
    tips: "Plan your path ahead. Keep space for maneuvering as you grow longer. The snake wraps around edges."
  },
  {
    emoji: "💣",
    name: "Minesweeper",
    controls: "Left Click (reveal) / Right Click (flag)",
    howToPlay: "Reveal all cells without hitting a mine. Numbers show how many mines are adjacent. Flag suspected mines.",
    tips: "First click is always safe. Use the numbers to deduce mine locations. Flag before revealing uncertain cells."
  },
  {
    emoji: "🎵",
    name: "Simon Says",
    controls: "Mouse Click",
    howToPlay: "Watch the color sequence flash, then repeat it by clicking the colors in the same order. Each round adds one more color!",
    tips: "Say the colors out loud as you watch. Create a mental story linking the colors together."
  },
  {
    emoji: "📝",
    name: "Wordle",
    controls: "Keyboard / On-screen Keys",
    howToPlay: "Guess the 5-letter word in 6 tries. Green = correct letter & position. Yellow = correct letter, wrong position. Gray = not in word.",
    tips: "Start with words containing common vowels (E, A) and consonants (R, S, T). Use your guesses to eliminate letters."
  },
  {
    emoji: "🐦",
    name: "Flappy Bird",
    controls: "Space / Click / Tap",
    howToPlay: "Tap to make the bird flap and fly upward. Navigate through the gaps between pipes. Don't hit the pipes or ground!",
    tips: "Tap gently and frequently rather than holding. Time your taps to maintain a steady altitude."
  },
  {
    emoji: "⌨️",
    name: "Speed Typing",
    controls: "Keyboard",
    howToPlay: "Type the displayed words as fast as you can. Press space after each word. You have 30 seconds!",
    tips: "Focus on accuracy over speed at first. Build muscle memory for common words. Keep your eyes on the screen."
  },
  {
    emoji: "🎨",
    name: "Color Guess",
    controls: "Mouse Click",
    howToPlay: "Look at the RGB value and find the matching color among 6 options. Build streaks for bonus points!",
    tips: "Learn RGB basics: high R = red, high G = green, high B = blue. Similar values = grayish colors."
  },
  {
    emoji: "⚡",
    name: "Reaction Time",
    controls: "Mouse Click",
    howToPlay: "Wait for the red screen to turn green, then click as fast as possible. Don't click too early!",
    tips: "Stay relaxed but focused. Position your finger/cursor ready to click. Don't try to predict - react!"
  },
  {
    emoji: "🔢",
    name: "Number Guess",
    controls: "Keyboard / Click",
    howToPlay: "Guess a number between 1-100. After each guess, you'll get a hint if the target is higher or lower.",
    tips: "Use binary search strategy - always guess the middle of the remaining range. You can solve in 7 guesses max!"
  },
  {
    emoji: "✊",
    name: "Rock Paper Scissors",
    controls: "Mouse Click / Tap",
    howToPlay: "Choose rock, paper, or scissors. Rock beats scissors, scissors beats paper, paper beats rock!",
    tips: "Try to spot patterns in the computer's choices. Build up win streaks for bragging rights!"
  },
  {
    emoji: "🔨",
    name: "Whack-a-Mole",
    controls: "Mouse Click / Tap",
    howToPlay: "Tap the moles as they pop up from their holes. Score points for each mole you hit!",
    tips: "Keep your eyes on the whole grid. The game speeds up over time - stay focused!"
  },
  {
    emoji: "🧮",
    name: "Math Quiz",
    controls: "Keyboard / Tap",
    howToPlay: "Solve math problems before time runs out. Answer correctly to build streaks and score more points!",
    tips: "Speed matters! The faster you answer, the more bonus points you get. Don't lose all your lives!"
  },
  {
    emoji: "🔐",
    name: "Pattern Lock",
    controls: "Mouse Click / Tap",
    howToPlay: "Watch the pattern light up, then repeat it by clicking the same cells in order. Each level adds one more step!",
    tips: "Focus on the sequence and try to memorize it visually. Don't rush - accuracy is key!"
  },
  {
    emoji: "",
    name: "Quiz Trivia",
    controls: "Mouse Click / Tap",
    howToPlay: "Answer trivia questions before time runs out. Choose from 4 options - only one is correct!",
    tips: "Answer quickly for time bonus points. Build answer streaks for extra points!"
  },
  {
    emoji: "🎯",
    name: "Hangman",
    controls: "Mouse Click / Tap",
    howToPlay: "Guess letters to reveal the hidden word. Each wrong guess adds a body part to the hangman!",
    tips: "Start with common vowels (A, E, I, O, U) and consonants (R, S, T, L, N). Look for word patterns!"
  },
  {
    emoji: "🎲",
    name: "Dice Roll",
    controls: "Mouse Click / Tap",
    howToPlay: "Roll two dice and try to beat the computer's roll. Higher total wins!",
    tips: "It's pure luck! Just enjoy the thrill of the roll and try to build win streaks!"
  },
  {
    emoji: "🔤",
    name: "Word Scramble",
    controls: "Keyboard / Tap",
    howToPlay: "Unscramble the letters to form the correct word. Use hints if you're stuck!",
    tips: "Look for common letter patterns. Use the hint sparingly - it costs points!"
  },
  {
    emoji: "👆",
    name: "Tap Speed",
    controls: "Mouse Click / Tap",
    howToPlay: "Tap as fast as you can for 10 seconds! See how many taps you can get!",
    tips: "Use multiple fingers if on mobile. Stay relaxed and tap with rhythm!"
  },
  {
    emoji: "😊",
    name: "Emoji Match",
    controls: "Mouse Click / Tap",
    howToPlay: "Find the matching emoji from the grid as fast as you can!",
    tips: "Scan the grid quickly. The grid gets bigger as you score more - stay focused!"
  },
  {
    emoji: "🃏",
    name: "High Card",
    controls: "Mouse Click / Tap",
    howToPlay: "Deal cards and try to beat the computer with a higher card value!",
    tips: "It's a game of luck! Aces are highest (14), face cards are J=11, Q=12, K=13."
  },
  {
    emoji: "🎯",
    name: "Target Shoot",
    controls: "Mouse Click / Tap",
    howToPlay: "Click on targets as they appear! Smaller targets give more points!",
    tips: "Aim for golden star targets for bonus points. Build combos by not missing!"
  },
  {
    emoji: "🪙",
    name: "Coin Flip",
    controls: "Mouse Click / Tap",
    howToPlay: "Predict heads or tails before the coin lands!",
    tips: "It's 50/50 luck! Try to build prediction streaks for bragging rights!"
  }
];

// Map components to game configs
const componentMap = {
  '2048': Game2048,
  'tictactoe': TicTacToe,
  'memory': MemoryGame,
  'snake': SnakeGame,
  'minesweeper': Minesweeper,
  'simon': SimonSays,
  'wordle': WordleGame,
  'flappy': FlappyBird,
  'typing': TypingGame,
  'color': ColorGuess,
  'reaction': ReactionTime,
  'number': NumberGuess,
  'rps': RockPaperScissors,
  'whack': WhackAMole,
  'math': MathQuiz,
  'pattern': PatternLock,
  'trivia': QuizTrivia,
  'hangman': Hangman,
  'dice': DiceRoll,
  'scramble': WordScramble,
  'tap': TapSpeed,
  'emoji': EmojiMatch,
  'card': CardMatch,
  'target': TargetShoot,
  'coin': CoinFlip,
};

// Build gamesList from centralized config
const gamesList = GAMES_CONFIG.map(game => ({
  ...game,
  component: componentMap[game.id]
}));

const GamesPage = () => {
  const navigate = useNavigate();
  const [showGuide, setShowGuide] = useState(false);
  const [activeGame, setActiveGame] = useState(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const ActiveGameComponent = activeGame ? gamesList.find(g => g.id === activeGame)?.component : null;
  const activeGameInfo = activeGame ? gamesList.find(g => g.id === activeGame) : null;

  // Reset leaderboard when game changes
  useEffect(() => {
    const signInUser = async () => {
      try {
        await signInAnonymously(auth);
        console.log("Signed in anonymously");
      } catch (err) {
        console.error("Error signing in anonymously:", err);
      }
    };
    
    signInUser();
    setShowLeaderboard(false);
  }, [activeGame]);

  return (
    <div className="min-h-screen bg-[#050414] py-4 sm:py-8 px-2 sm:px-4">
      {/* Navigation Bar - Separate Row */}
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4 mb-4 sm:mb-8 mt-12 sm:mt-16 px-2">
        {/* Back Button */}
        <button
          onClick={() => {
            if (activeGame) {
              setActiveGame(null);
              setShowLeaderboard(false);
            } else {
              navigate(-1);
            }
          }}
          className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-xs md:text-sm font-medium">{activeGame ? "Back to Games" : "Back"}</span>
        </button>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Leaderboard Button */}
          <button
            onClick={() => activeGame ? setShowLeaderboard(!showLeaderboard) : navigate('/leaderboard')}
            className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 backdrop-blur-md border border-white/20 text-white hover:opacity-90 transition-all duration-300 shadow-lg shadow-orange-500/25"
          >
            <Trophy className="w-4 h-4" />
            <span className="hidden sm:inline text-xs md:text-sm font-medium">Leaderboard</span>
          </button>

          {/* Guide Button */}
          <button
            onClick={() => setShowGuide(true)}
            className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 backdrop-blur-md border border-white/20 text-white hover:opacity-90 transition-all duration-300 shadow-lg shadow-purple-500/25"
          >
            <HelpCircle className="w-4 h-4" />
            <span className="hidden sm:inline text-xs md:text-sm font-medium">How to Play</span>
          </button>
        </div>
      </div>

      {/* Guide Modal */}
      {showGuide && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl max-h-[85vh] sm:max-h-[80vh] bg-gradient-to-br from-[#0a0520] to-[#150a30] border border-white/20 rounded-2xl sm:rounded-3xl overflow-hidden">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between p-3 sm:p-6 bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-md border-b border-white/10">
              <h2 className="text-lg sm:text-2xl font-bold text-white flex items-center gap-2 sm:gap-3">
                <span className="text-xl sm:text-3xl">📖</span> Game Guide
              </h2>
              <button
                onClick={() => setShowGuide(false)}
                className="p-1.5 sm:p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-3 sm:p-6 overflow-y-auto max-h-[calc(85vh-60px)] sm:max-h-[calc(80vh-80px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {gameGuides.map((game, index) => (
                  <div
                    key={index}
                    className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-5 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                      <span className="text-2xl sm:text-3xl">{game.emoji}</span>
                      <h3 className="text-base sm:text-xl font-bold text-white">{game.name}</h3>
                    </div>
                    
                    <div className="space-y-1.5 sm:space-y-2">
                      <div>
                        <span className="text-[10px] sm:text-xs font-semibold text-purple-400 uppercase tracking-wider">Controls</span>
                        <p className="text-white/80 text-xs sm:text-sm">{game.controls}</p>
                      </div>
                      
                      <div>
                        <span className="text-[10px] sm:text-xs font-semibold text-cyan-400 uppercase tracking-wider">How to Play</span>
                        <p className="text-white/70 text-xs sm:text-sm">{game.howToPlay}</p>
                      </div>
                      
                      <div>
                        <span className="text-[10px] sm:text-xs font-semibold text-yellow-400 uppercase tracking-wider">Pro Tips</span>
                        <p className="text-white/60 text-xs sm:text-sm italic">{game.tips}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active Game View */}
      {activeGame && ActiveGameComponent && (
        <div className="px-2 sm:px-4">
          <div className={`mx-auto ${showLeaderboard ? 'max-w-7xl' : 'max-w-4xl'}`}>
            {/* Game Header */}
            <div className="text-center mb-3 sm:mb-6">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2">
                {activeGameInfo?.emoji} {activeGameInfo?.name}
              </h1>
            </div>

            {/* Game and Leaderboard Container */}
            <div className={`flex ${showLeaderboard ? 'gap-4' : ''} items-start`}>
              {/* Game Container */}
              <div className={`relative group ${showLeaderboard ? 'flex-1' : 'w-full'}`}>
                <div className={`absolute -inset-1 bg-gradient-to-r ${activeGameInfo?.gradient} rounded-2xl sm:rounded-3xl blur opacity-30`}></div>
                <div className="relative bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl p-3 sm:p-4 md:p-6 h-[calc(100vh-180px)] sm:h-[calc(100vh-200px)] md:h-[650px] min-h-[400px] max-h-[700px] overflow-hidden">
                  <Suspense fallback={<GameLoader />}>
                    <ActiveGameComponent embedded={true} />
                  </Suspense>
                </div>
              </div>

              {/* Game-Specific Leaderboard - Right Side */}
              {showLeaderboard && activeGameInfo && (
                <div className="w-80 flex-shrink-0 hidden lg:block">
                  <GameLeaderboard 
                    gameId={activeGameInfo.id}
                    gameName={activeGameInfo.name}
                    emoji={activeGameInfo.emoji}
                    gradient={activeGameInfo.gradient}
                    storageKey={activeGameInfo.storageKey}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Game Selection View */}
      {!activeGame && (
        <>
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8 px-2">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-2 sm:mb-4">
              🎮 Game Zone
            </h1>
            <p className="text-white/60 text-sm sm:text-lg">
              Select a game to play! <span className="text-purple-400 cursor-pointer hover:underline" onClick={() => setShowGuide(true)}>Need help?</span>
            </p>
          </div>

          {/* Games Selection Grid */}
          <div className="max-w-6xl mx-auto grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-4 px-2">
            {gamesList.map((game) => (
              <button
                key={game.id}
                onClick={() => setActiveGame(game.id)}
                className="relative group cursor-pointer"
              >
                <div className={`absolute -inset-0.5 sm:-inset-1 bg-gradient-to-r ${game.gradient} rounded-xl sm:rounded-2xl blur opacity-25 group-hover:opacity-60 transition duration-300`}></div>
                <div className="relative bg-black/50 backdrop-blur-xl border border-white/10 rounded-xl sm:rounded-2xl p-2 sm:p-4 h-full flex flex-col items-center justify-center gap-1.5 sm:gap-3 hover:bg-white/5 transition-all duration-300 group-hover:scale-[1.02] min-h-[80px] sm:min-h-[120px]">
                  <span className="text-2xl sm:text-4xl md:text-5xl">{game.emoji}</span>
                  <span className="text-white font-medium text-[10px] sm:text-sm text-center leading-tight">{game.name}</span>
                  <div className={`absolute bottom-1 right-1 sm:bottom-2 sm:right-2 w-5 h-5 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r ${game.gradient} flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                    <Play className="w-2.5 h-2.5 sm:w-4 sm:h-4 text-white fill-white" />
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Footer Note */}
          <div className="max-w-7xl mx-auto mt-8 sm:mt-12 text-center px-2">
            <p className="text-white/40 text-xs sm:text-sm">
              Click on any game to start playing • Click <span className="text-purple-400">"How to Play"</span> for instructions
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default GamesPage;
