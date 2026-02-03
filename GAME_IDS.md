# Game IDs Reference

This document lists all unique game IDs used in the portfolio. These IDs are centrally managed in `src/config/gamesConfig.js`.

## All Game IDs

| Game Name | Game ID | Storage Key | Has Leaderboard |
|-----------|---------|-------------|-----------------|
| 2048 | `2048` | `2048-best` | ✅ |
| Tic Tac Toe | `tictactoe` | `tictactoe-stats` | ❌ |
| Memory Match | `memory` | `memory-best-time` | ✅ |
| Snake | `snake` | `snake-high-score` | ✅ |
| Minesweeper | `minesweeper` | `minesweeper-best` | ✅ |
| Simon Says | `simon` | `simon-high-score` | ✅ |
| Wordle | `wordle` | `wordle-stats` | ❌ |
| Flappy Bird | `flappy` | `flappy-high-score` | ✅ |
| Speed Typing | `typing` | `typing-best-wpm` | ✅ |
| Color Guess | `color` | `color-high-score` | ✅ |
| Reaction Time | `reaction` | `reaction-best-time` | ✅ |
| Number Guess | `number` | `number-best-guesses` | ✅ |
| Rock Paper Scissors | `rps` | `rps-win-streak` | ✅ |
| Whack-a-Mole | `whack` | `whack-high-score` | ✅ |
| Math Quiz | `math` | `math-high-score` | ✅ |
| Pattern Lock | `pattern` | `pattern-high-level` | ✅ |
| Bubble Pop | `bubble` | `bubble-high-score` | ✅ |
| Quiz Trivia | `trivia` | `trivia-high-score` | ✅ |
| Hangman | `hangman` | `hangman-wins` | ✅ |
| Dice Roll | `dice` | `dice-win-streak` | ✅ |
| Word Scramble | `scramble` | `scramble-high-score` | ✅ |
| Tap Speed | `tap` | `tap-high-score` | ✅ |
| Emoji Match | `emoji` | `emoji-high-score` | ✅ |
| High Card | `card` | `card-win-streak` | ✅ |
| Target Shoot | `target` | `target-high-score` | ✅ |
| Coin Flip | `coin` | `coin-win-streak` | ✅ |

## Usage

### In JavaScript/React Components

```javascript
import { GAME_IDS, getGameConfig } from './config/gamesConfig';

// Use the constant
const gameId = GAME_IDS.SNAKE;

// Get full game config
const config = getGameConfig('snake');
console.log(config);
// {
//   id: 'snake',
//   name: 'Snake',
//   emoji: '🐍',
//   gradient: 'from-green-600 to-emerald-600',
//   storageKey: 'snake-high-score',
//   hasLeaderboard: true,
//   description: 'Eat food and grow longer'
// }
```

### In Game Components

When integrating the GameLeaderboard component in your game:

```jsx
import GameLeaderboard from '../Leaderboard/GameLeaderboard';
import { GAME_IDS, getGameConfig } from '../../config/gamesConfig';

const MyGame = ({ embedded = false }) => {
  const gameConfig = getGameConfig(GAME_IDS.SNAKE);
  
  return (
    <div>
      {/* Your game UI */}
      
      {/* Leaderboard - Only show when not embedded */}
      {!embedded && (
        <GameLeaderboard
          gameId={gameConfig.id}
          gameName={gameConfig.name}
          emoji={gameConfig.emoji}
          gradient={gameConfig.gradient}
          storageKey={gameConfig.storageKey}
        />
      )}
    </div>
  );
};
```

## Benefits of Centralized Game IDs

1. **Consistency**: All game IDs are defined in one place
2. **Type Safety**: Import constants instead of using strings
3. **Easy Refactoring**: Change IDs in one place
4. **Documentation**: Single source of truth for all games
5. **Leaderboard Integration**: Consistent IDs for scoring system
6. **API Integration**: Ready for backend integration

## Adding a New Game

When adding a new game:

1. Add the game ID to `GAME_IDS` in `src/config/gamesConfig.js`
2. Add the complete configuration to `GAMES_CONFIG`
3. Import the game component in `src/pages/GamesPage.jsx`
4. Add to the `componentMap` in GamesPage.jsx
5. Update this document

## Notes

- All IDs are lowercase and URL-friendly
- IDs should be unique and descriptive
- Storage keys are used for localStorage persistence
- Leaderboard integration depends on `hasLeaderboard` flag
