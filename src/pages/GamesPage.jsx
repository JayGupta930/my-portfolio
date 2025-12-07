import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Game2048 from "../components/2048/Game2048";
import TicTacToe from "../components/TicTacToe/Tic";
import MemoryGame from "../components/MemoryGame/MemoryGame";
import SnakeGame from "../components/SnakeGame/SnakeGame";
import Minesweeper from "../components/Minesweeper/Minesweeper";
import SimonSays from "../components/SimonSays/SimonSays";
import WordleGame from "../components/WordleGame/WordleGame";
import FlappyBird from "../components/FlappyBird/FlappyBird";
import TypingGame from "../components/TypingGame/TypingGame";
import ColorGuess from "../components/ColorGuess/ColorGuess";
import ReactionTime from "../components/ReactionTime/ReactionTime";
import NumberGuess from "../components/NumberGuess/NumberGuess";
import { ArrowLeft, HelpCircle, X, Play } from "lucide-react";

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
  }
];

const gamesList = [
  { id: "2048", name: "2048", emoji: "🔢", gradient: "from-purple-600 to-pink-600", component: Game2048 },
  { id: "tictactoe", name: "Tic Tac Toe", emoji: "⭕", gradient: "from-blue-600 to-cyan-600", component: TicTacToe },
  { id: "memory", name: "Memory Match", emoji: "🎯", gradient: "from-pink-600 to-rose-600", component: MemoryGame },
  { id: "snake", name: "Snake", emoji: "🐍", gradient: "from-green-600 to-emerald-600", component: SnakeGame },
  { id: "minesweeper", name: "Minesweeper", emoji: "💣", gradient: "from-red-600 to-orange-600", component: Minesweeper },
  { id: "simon", name: "Simon Says", emoji: "🎵", gradient: "from-cyan-600 to-teal-600", component: SimonSays },
  { id: "wordle", name: "Wordle", emoji: "📝", gradient: "from-yellow-600 to-amber-600", component: WordleGame },
  { id: "flappy", name: "Flappy Bird", emoji: "🐦", gradient: "from-sky-600 to-cyan-600", component: FlappyBird },
  { id: "typing", name: "Speed Typing", emoji: "⌨️", gradient: "from-violet-600 to-purple-600", component: TypingGame },
  { id: "color", name: "Color Guess", emoji: "🎨", gradient: "from-fuchsia-600 to-pink-600", component: ColorGuess },
  { id: "reaction", name: "Reaction Time", emoji: "⚡", gradient: "from-amber-600 to-yellow-600", component: ReactionTime },
  { id: "number", name: "Number Guess", emoji: "🔢", gradient: "from-indigo-600 to-blue-600", component: NumberGuess },
];

const GamesPage = () => {
  const navigate = useNavigate();
  const [showGuide, setShowGuide] = useState(false);
  const [activeGame, setActiveGame] = useState(null);

  const ActiveGameComponent = activeGame ? gamesList.find(g => g.id === activeGame)?.component : null;
  const activeGameInfo = activeGame ? gamesList.find(g => g.id === activeGame) : null;

  return (
    <div className="min-h-screen bg-[#050414] py-8 px-4">
      {/* Navigation Bar - Separate Row */}
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 mb-8 mt-16">
        {/* Back Button */}
        <button
          onClick={() => activeGame ? setActiveGame(null) : navigate(-1)}
          className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-xs md:text-sm font-medium">{activeGame ? "Back to Games" : "Back"}</span>
        </button>

        {/* Guide Button */}
        <button
          onClick={() => setShowGuide(true)}
          className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 backdrop-blur-md border border-white/20 text-white hover:opacity-90 transition-all duration-300 shadow-lg shadow-purple-500/25"
        >
          <HelpCircle className="w-4 h-4" />
          <span className="text-xs md:text-sm font-medium">How to Play</span>
        </button>
      </div>

      {/* Guide Modal */}
      {showGuide && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl max-h-[80vh] bg-gradient-to-br from-[#0a0520] to-[#150a30] border border-white/20 rounded-3xl overflow-hidden">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-md border-b border-white/10">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <span className="text-3xl">📖</span> Game Guide
              </h2>
              <button
                onClick={() => setShowGuide(false)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {gameGuides.map((game, index) => (
                  <div
                    key={index}
                    className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-3xl">{game.emoji}</span>
                      <h3 className="text-xl font-bold text-white">{game.name}</h3>
                    </div>
                    
                    <div className="space-y-2">
                      <div>
                        <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">Controls</span>
                        <p className="text-white/80 text-sm">{game.controls}</p>
                      </div>
                      
                      <div>
                        <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">How to Play</span>
                        <p className="text-white/70 text-sm">{game.howToPlay}</p>
                      </div>
                      
                      <div>
                        <span className="text-xs font-semibold text-yellow-400 uppercase tracking-wider">Pro Tips</span>
                        <p className="text-white/60 text-sm italic">{game.tips}</p>
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
        <div>
          <div className="max-w-4xl mx-auto">
            {/* Game Header */}
            <div className="text-center mb-6">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                {activeGameInfo?.emoji} {activeGameInfo?.name}
              </h1>
            </div>

            {/* Game Container */}
            <div className="relative group">
              <div className={`absolute -inset-1 bg-gradient-to-r ${activeGameInfo?.gradient} rounded-3xl blur opacity-30`}></div>
              <div className="relative bg-black/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 h-[650px] overflow-hidden">
                <ActiveGameComponent embedded={true} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Game Selection View */}
      {!activeGame && (
        <>
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              🎮 Game Zone
            </h1>
            <p className="text-white/60 text-lg">
              Select a game to play! <span className="text-purple-400 cursor-pointer hover:underline" onClick={() => setShowGuide(true)}>Need help?</span>
            </p>
          </div>

          {/* Games Selection Grid */}
          <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {gamesList.map((game) => (
              <button
                key={game.id}
                onClick={() => setActiveGame(game.id)}
                className="relative group cursor-pointer"
              >
                <div className={`absolute -inset-1 bg-gradient-to-r ${game.gradient} rounded-2xl blur opacity-25 group-hover:opacity-60 transition duration-300`}></div>
                <div className="relative bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl p-4 h-full flex flex-col items-center justify-center gap-3 hover:bg-white/5 transition-all duration-300 group-hover:scale-[1.02]">
                  <span className="text-4xl md:text-5xl">{game.emoji}</span>
                  <span className="text-white font-medium text-sm text-center">{game.name}</span>
                  <div className={`absolute bottom-2 right-2 w-8 h-8 rounded-full bg-gradient-to-r ${game.gradient} flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                    <Play className="w-4 h-4 text-white fill-white" />
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Footer Note */}
          <div className="max-w-7xl mx-auto mt-12 text-center">
            <p className="text-white/40 text-sm">
              Click on any game to start playing • Click <span className="text-purple-400">"How to Play"</span> for instructions
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default GamesPage;
