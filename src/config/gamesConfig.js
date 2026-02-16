/**
 * Centralized Game Configuration
 * 
 * This file contains all game IDs and metadata to ensure consistency
 * across the application. Import this file whenever you need game IDs
 * or game metadata.
 * 
 * Usage:
 * import { GAME_IDS, GAMES_CONFIG } from '../config/gamesConfig';
 */

// Unique Game IDs - Use these constants for consistency
export const GAME_IDS = {
  GAME_2048: '2048',
  TIC_TAC_TOE: 'tictactoe',
  MEMORY_MATCH: 'memory',
  SNAKE: 'snake',
  MINESWEEPER: 'minesweeper',
  SIMON_SAYS: 'simon',
  WORDLE: 'wordle',
  FLAPPY_BIRD: 'flappy',
  SPEED_TYPING: 'typing',
  COLOR_GUESS: 'color',
  REACTION_TIME: 'reaction',
  NUMBER_GUESS: 'number',
  ROCK_PAPER_SCISSORS: 'rps',
  WHACK_A_MOLE: 'whack',
  MATH_QUIZ: 'math',
  PATTERN_LOCK: 'pattern',
  QUIZ_TRIVIA: 'trivia',
  HANGMAN: 'hangman',
  DICE_ROLL: 'dice',
  WORD_SCRAMBLE: 'scramble',
  TAP_SPEED: 'tap',
  EMOJI_MATCH: 'emoji',
  CARD_MATCH: 'card',
  TARGET_SHOOT: 'target',
  COIN_FLIP: 'coin',
};

// Complete Game Configuration with all metadata
export const GAMES_CONFIG = [
  {
    id: GAME_IDS.GAME_2048,
    name: '2048',
    emoji: '🔢',
    gradient: 'from-purple-600 to-pink-600',
    storageKey: '2048-best',
    hasLeaderboard: true,
    description: 'Slide tiles to reach 2048'
  },
  {
    id: GAME_IDS.TIC_TAC_TOE,
    name: 'Tic Tac Toe',
    emoji: '⭕',
    gradient: 'from-blue-600 to-cyan-600',
    storageKey: 'tictactoe-stats',
    hasLeaderboard: false,
    description: 'Classic X and O game'
  },
  {
    id: GAME_IDS.MEMORY_MATCH,
    name: 'Memory Match',
    emoji: '🎯',
    gradient: 'from-pink-600 to-rose-600',
    storageKey: 'memory-best-time',
    hasLeaderboard: true,
    description: 'Find matching pairs'
  },
  {
    id: GAME_IDS.SNAKE,
    name: 'Snake',
    emoji: '🐍',
    gradient: 'from-green-600 to-emerald-600',
    storageKey: 'snake-high-score',
    hasLeaderboard: true,
    description: 'Eat food and grow longer'
  },
  {
    id: GAME_IDS.MINESWEEPER,
    name: 'Minesweeper',
    emoji: '💣',
    gradient: 'from-red-600 to-orange-600',
    storageKey: 'minesweeper-best',
    hasLeaderboard: true,
    description: 'Clear the field without hitting mines'
  },
  {
    id: GAME_IDS.SIMON_SAYS,
    name: 'Simon Says',
    emoji: '🎵',
    gradient: 'from-cyan-600 to-teal-600',
    storageKey: 'simon-high-score',
    hasLeaderboard: true,
    description: 'Remember and repeat the pattern'
  },
  {
    id: GAME_IDS.WORDLE,
    name: 'Wordle',
    emoji: '📝',
    gradient: 'from-yellow-600 to-amber-600',
    storageKey: 'wordle-stats',
    hasLeaderboard: false,
    description: 'Guess the 5-letter word'
  },
  {
    id: GAME_IDS.FLAPPY_BIRD,
    name: 'Flappy Bird',
    emoji: '🐦',
    gradient: 'from-sky-600 to-cyan-600',
    storageKey: 'flappy-high-score',
    hasLeaderboard: true,
    description: 'Navigate through pipes'
  },
  {
    id: GAME_IDS.SPEED_TYPING,
    name: 'Speed Typing',
    emoji: '⌨️',
    gradient: 'from-violet-600 to-purple-600',
    storageKey: 'typing-best-wpm',
    hasLeaderboard: true,
    description: 'Type as fast as you can'
  },
  {
    id: GAME_IDS.COLOR_GUESS,
    name: 'Color Guess',
    emoji: '🎨',
    gradient: 'from-fuchsia-600 to-pink-600',
    storageKey: 'color-high-score',
    hasLeaderboard: true,
    description: 'Match RGB values to colors'
  },
  {
    id: GAME_IDS.REACTION_TIME,
    name: 'Reaction Time',
    emoji: '⚡',
    gradient: 'from-amber-600 to-yellow-600',
    storageKey: 'reaction-best-time',
    hasLeaderboard: true,
    description: 'Test your reflexes'
  },
  {
    id: GAME_IDS.NUMBER_GUESS,
    name: 'Number Guess',
    emoji: '🔢',
    gradient: 'from-indigo-600 to-blue-600',
    storageKey: 'number-best-guesses',
    hasLeaderboard: true,
    description: 'Guess the secret number'
  },
  {
    id: GAME_IDS.ROCK_PAPER_SCISSORS,
    name: 'Rock Paper Scissors',
    emoji: '✊',
    gradient: 'from-rose-600 to-red-600',
    storageKey: 'rps-win-streak',
    hasLeaderboard: true,
    description: 'Beat the computer'
  },
  {
    id: GAME_IDS.WHACK_A_MOLE,
    name: 'Whack-a-Mole',
    emoji: '🔨',
    gradient: 'from-orange-600 to-amber-600',
    storageKey: 'whack-high-score',
    hasLeaderboard: true,
    description: 'Whack moles for points'
  },
  {
    id: GAME_IDS.MATH_QUIZ,
    name: 'Math Quiz',
    emoji: '🧮',
    gradient: 'from-blue-600 to-indigo-600',
    storageKey: 'math-high-score',
    hasLeaderboard: true,
    description: 'Solve math problems quickly'
  },
  {
    id: GAME_IDS.PATTERN_LOCK,
    name: 'Pattern Lock',
    emoji: '🔐',
    gradient: 'from-purple-600 to-violet-600',
    storageKey: 'pattern-high-level',
    hasLeaderboard: true,
    description: 'Remember the pattern'
  },
  {
    id: GAME_IDS.QUIZ_TRIVIA,
    name: 'Quiz Trivia',
    emoji: '🧠',
    gradient: 'from-emerald-600 to-teal-600',
    storageKey: 'trivia-high-score',
    hasLeaderboard: true,
    description: 'Answer trivia questions'
  },
  {
    id: GAME_IDS.HANGMAN,
    name: 'Hangman',
    emoji: '🎯',
    gradient: 'from-slate-600 to-gray-600',
    storageKey: 'hangman-wins',
    hasLeaderboard: true,
    description: 'Guess the word letter by letter'
  },
  {
    id: GAME_IDS.DICE_ROLL,
    name: 'Dice Roll',
    emoji: '🎲',
    gradient: 'from-red-600 to-rose-600',
    storageKey: 'dice-win-streak',
    hasLeaderboard: true,
    description: 'Beat the computer roll'
  },
  {
    id: GAME_IDS.WORD_SCRAMBLE,
    name: 'Word Scramble',
    emoji: '🔤',
    gradient: 'from-teal-600 to-green-600',
    storageKey: 'scramble-high-score',
    hasLeaderboard: true,
    description: 'Unscramble the letters'
  },
  {
    id: GAME_IDS.TAP_SPEED,
    name: 'Tap Speed',
    emoji: '👆',
    gradient: 'from-orange-600 to-red-600',
    storageKey: 'tap-high-score',
    hasLeaderboard: true,
    description: 'Tap as fast as you can'
  },
  {
    id: GAME_IDS.EMOJI_MATCH,
    name: 'Emoji Match',
    emoji: '😊',
    gradient: 'from-pink-600 to-purple-600',
    storageKey: 'emoji-high-score',
    hasLeaderboard: true,
    description: 'Find the matching emoji'
  },
  {
    id: GAME_IDS.CARD_MATCH,
    name: 'High Card',
    emoji: '🃏',
    gradient: 'from-violet-600 to-indigo-600',
    storageKey: 'card-win-streak',
    hasLeaderboard: true,
    description: 'Beat the dealer'
  },
  {
    id: GAME_IDS.TARGET_SHOOT,
    name: 'Target Shoot',
    emoji: '🎯',
    gradient: 'from-red-600 to-orange-600',
    storageKey: 'target-high-score',
    hasLeaderboard: true,
    description: 'Hit moving targets'
  },
  {
    id: GAME_IDS.COIN_FLIP,
    name: 'Coin Flip',
    emoji: '🪙',
    gradient: 'from-yellow-600 to-amber-600',
    storageKey: 'coin-win-streak',
    hasLeaderboard: true,
    description: 'Predict the coin flip'
  },
];

// Helper function to get game config by ID
export const getGameConfig = (gameId) => {
  return GAMES_CONFIG.find(game => game.id === gameId);
};

// Helper function to get all game IDs as an array
export const getAllGameIds = () => {
  return GAMES_CONFIG.map(game => game.id);
};

// Export default for convenience
export default {
  GAME_IDS,
  GAMES_CONFIG,
  getGameConfig,
  getAllGameIds,
};
