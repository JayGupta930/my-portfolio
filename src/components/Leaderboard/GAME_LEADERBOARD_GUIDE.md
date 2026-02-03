# Game Leaderboard Integration Guide

## ✅ Complete! Ab har game ka apna leaderboard hai

### Setup Summary:

1. **Global Leaderboard** (`Leaderboard.jsx`) - Sabhi games ke top scores dikhata hai
2. **Individual Game Leaderboard** (`GameLeaderboard.jsx`) - Har game ke andar uska specific leaderboard

---

## 🎮 How to Add Leaderboard to ANY Game

### Step 1: Import the Component

Apni game file ke top par add karein:

```jsx
import GameLeaderboard from '../Leaderboard/GameLeaderboard';
```

### Step 2: Add to Your Game's JSX

Game component ke return statement mein, jahan chahiye wahan add karein:

```jsx
<GameLeaderboard
  gameId="your-game-id"           // Unique ID for your game
  gameName="Your Game Name"        // Display name
  emoji="🎮"                       // Game emoji
  gradient="from-blue-600 to-cyan-600"  // Tailwind gradient colors
  storageKey="your-game-high-score"     // localStorage key where you save score
/>
```

---

## 📝 Example: Snake Game (Already Integrated! ✅)

```jsx
import React from 'react';
import GameLeaderboard from '../Leaderboard/GameLeaderboard';

const SnakeGame = () => {
  // ... your game code ...
  
  return (
    <div>
      {/* Game UI */}
      
      {/* Leaderboard - Added! */}
      <GameLeaderboard
        gameId="snake"
        gameName="Snake"
        emoji="🐍"
        gradient="from-green-600 to-emerald-600"
        storageKey="snake-high-score"
      />
    </div>
  );
};
```

---

## 🎯 Integration Examples for All Your Games

### 2048 Game
```jsx
<GameLeaderboard
  gameId="2048"
  gameName="2048"
  emoji="🔢"
  gradient="from-purple-600 to-pink-600"
  storageKey="2048-best"
/>
```

### Tic Tac Toe
```jsx
<GameLeaderboard
  gameId="tictactoe"
  gameName="Tic Tac Toe"
  emoji="⭕"
  gradient="from-blue-600 to-cyan-600"
  storageKey="tictactoe-score"
/>
```

### Minesweeper
```jsx
<GameLeaderboard
  gameId="minesweeper"
  gameName="Minesweeper"
  emoji="💣"
  gradient="from-red-600 to-orange-600"
  storageKey="minesweeper-best"
/>
```

### Flappy Bird
```jsx
<GameLeaderboard
  gameId="flappy"
  gameName="Flappy Bird"
  emoji="🐦"
  gradient="from-sky-600 to-cyan-600"
  storageKey="flappy-high-score"
/>
```

### Memory Game
```jsx
<GameLeaderboard
  gameId="memory"
  gameName="Memory Match"
  emoji="🎯"
  gradient="from-pink-600 to-rose-600"
  storageKey="memory-best"
/>
```

### Simon Says
```jsx
<GameLeaderboard
  gameId="simon"
  gameName="Simon Says"
  emoji="🎵"
  gradient="from-cyan-600 to-teal-600"
  storageKey="simon-best"
/>
```

### Wordle
```jsx
<GameLeaderboard
  gameId="wordle"
  gameName="Wordle"
  emoji="📝"
  gradient="from-yellow-600 to-amber-600"
  storageKey="wordle-wins"
/>
```

### Speed Typing
```jsx
<GameLeaderboard
  gameId="typing"
  gameName="Speed Typing"
  emoji="⌨️"
  gradient="from-violet-600 to-purple-600"
  storageKey="typing-best"
/>
```

### Color Guess
```jsx
<GameLeaderboard
  gameId="color"
  gameName="Color Guess"
  emoji="🎨"
  gradient="from-fuchsia-600 to-pink-600"
  storageKey="color-best"
/>
```

### Reaction Time
```jsx
<GameLeaderboard
  gameId="reaction"
  gameName="Reaction Time"
  emoji="⚡"
  gradient="from-amber-600 to-yellow-600"
  storageKey="reaction-best"
/>
```

### Number Guess
```jsx
<GameLeaderboard
  gameId="number"
  gameName="Number Guess"
  emoji="🔢"
  gradient="from-indigo-600 to-blue-600"
  storageKey="number-best"
/>
```

### Rock Paper Scissors
```jsx
<GameLeaderboard
  gameId="rps"
  gameName="Rock Paper Scissors"
  emoji="✊"
  gradient="from-rose-600 to-red-600"
  storageKey="rps-wins"
/>
```

### Whack-a-Mole
```jsx
<GameLeaderboard
  gameId="whack"
  gameName="Whack-a-Mole"
  emoji="🔨"
  gradient="from-orange-600 to-amber-600"
  storageKey="whack-high-score"
/>
```

### Math Quiz
```jsx
<GameLeaderboard
  gameId="math"
  gameName="Math Quiz"
  emoji="🧮"
  gradient="from-blue-600 to-indigo-600"
  storageKey="math-best"
/>
```

### Pattern Lock
```jsx
<GameLeaderboard
  gameId="pattern"
  gameName="Pattern Lock"
  emoji="🔐"
  gradient="from-purple-600 to-violet-600"
  storageKey="pattern-best"
/>
```

### Bubble Pop
```jsx
<GameLeaderboard
  gameId="bubble"
  gameName="Bubble Pop"
  emoji="🫧"
  gradient="from-cyan-600 to-blue-600"
  storageKey="bubble-high-score"
/>
```

### Quiz Trivia
```jsx
<GameLeaderboard
  gameId="trivia"
  gameName="Quiz Trivia"
  emoji="🧠"
  gradient="from-emerald-600 to-teal-600"
  storageKey="trivia-best"
/>
```

### Hangman
```jsx
<GameLeaderboard
  gameId="hangman"
  gameName="Hangman"
  emoji="🎯"
  gradient="from-slate-600 to-gray-600"
  storageKey="hangman-wins"
/>
```

### Dice Roll
```jsx
<GameLeaderboard
  gameId="dice"
  gameName="Dice Roll"
  emoji="🎲"
  gradient="from-red-600 to-rose-600"
  storageKey="dice-wins"
/>
```

### Word Scramble
```jsx
<GameLeaderboard
  gameId="scramble"
  gameName="Word Scramble"
  emoji="🔤"
  gradient="from-teal-600 to-green-600"
  storageKey="scramble-best"
/>
```

### Tap Speed
```jsx
<GameLeaderboard
  gameId="tap"
  gameName="Tap Speed"
  emoji="👆"
  gradient="from-orange-600 to-red-600"
  storageKey="tap-best"
/>
```

### Emoji Match
```jsx
<GameLeaderboard
  gameId="emoji"
  gameName="Emoji Match"
  emoji="😊"
  gradient="from-pink-600 to-purple-600"
  storageKey="emoji-best"
/>
```

### High Card
```jsx
<GameLeaderboard
  gameId="card"
  gameName="High Card"
  emoji="🃏"
  gradient="from-violet-600 to-indigo-600"
  storageKey="card-wins"
/>
```

### Target Shoot
```jsx
<GameLeaderboard
  gameId="target"
  gameName="Target Shoot"
  emoji="🎯"
  gradient="from-red-600 to-orange-600"
  storageKey="target-high-score"
/>
```

### Coin Flip
```jsx
<GameLeaderboard
  gameId="coin"
  gameName="Coin Flip"
  emoji="🪙"
  gradient="from-yellow-600 to-amber-600"
  storageKey="coin-streak"
/>
```

---

## 🎨 Features

- ✅ **Toggle Button** - Click to show/hide leaderboard
- ✅ **Current Rank Display** - Shows your rank in the button
- ✅ **Top Players** - Shows all players ranked by score
- ✅ **Highlight Your Score** - Your score is highlighted in purple
- ✅ **Top 3 Badges** - Gold, Silver, Bronze for top 3
- ✅ **Beautiful UI** - Gradient backgrounds matching game theme
- ✅ **Responsive** - Works on mobile and desktop
- ✅ **Collapsible** - Saves space when collapsed

---

## 🔧 Backend Integration (Future)

Currently using localStorage with mock data. When you add backend:

1. Update `GameLeaderboard.jsx` line ~52:
```jsx
// Replace this:
const currentScore = localStorage.getItem(storageKey);

// With API call:
fetch(`/api/leaderboard/${gameId}`)
  .then(res => res.json())
  .then(data => setScores(data.scores))
```

2. Score submission happens automatically when game updates localStorage
3. Add API endpoint in your backend matching the structure

---

## 📱 Usage Tips

1. **Position**: Add leaderboard after game controls but before footer
2. **Embedded Mode**: Use conditional rendering if game has embedded mode:
   ```jsx
   {!embedded && <GameLeaderboard ... />}
   ```
3. **Styling**: Leaderboard automatically matches your game's gradient theme

---

## ✨ What You Have Now:

1. ✅ **Global Leaderboard** at `/leaderboard` route
   - Shows ALL games
   - Filter by category
   - See all player scores
   
2. ✅ **Individual Game Leaderboards** 
   - Inside each game
   - Only that game's scores
   - Collapsible panel
   - Shows your rank

---

## 🚀 Next Steps:

1. Copy-paste the code from examples above to add leaderboard to each game
2. Make sure `storageKey` matches where you save the score
3. Test by playing the game and clicking the leaderboard button
4. When ready, connect to your backend API

Perfect! Aapka leaderboard system completely ready hai! 🎉
