# Leaderboard Backend Integration Guide

## Overview
The frontend is ready for multi-user leaderboard functionality. This guide will help you integrate your backend database.

## Current User Management

### User ID Storage
```javascript
// Current implementation (temporary)
localStorage.getItem('userId')
localStorage.getItem('username')

// Replace with your authentication system
// Example: Firebase, Auth0, JWT, etc.
```

## API Endpoints to Implement

### 1. Get All Leaderboard Scores
```javascript
GET /api/leaderboard
Optional Query Params:
  - gameId: string (filter by specific game)
  - category: string ('classic', 'puzzle', 'reaction', 'luck')
  - limit: number (pagination)
  - userId: string (get scores for specific user)

Response:
{
  "scores": [
    {
      "id": "score_123",
      "userId": "user_abc",
      "username": "Player123",
      "gameId": "snake",
      "gameName": "Snake",
      "emoji": "🐍",
      "category": "classic",
      "gradient": "from-green-600 to-emerald-600",
      "score": 150,
      "playedAt": "2026-02-01T10:30:00Z"
    },
    // ... more scores
  ],
  "total": 100
}
```

### 2. Submit New Score
```javascript
POST /api/leaderboard/submit
Headers:
  Authorization: Bearer <token>

Body:
{
  "gameId": "snake",
  "score": 150
}

Response:
{
  "success": true,
  "isNewHighScore": true,
  "rank": 5,
  "message": "New high score!"
}
```

### 3. Get User's Best Scores
```javascript
GET /api/leaderboard/user/:userId

Response:
{
  "userId": "user_abc",
  "username": "Player123",
  "scores": [...],
  "stats": {
    "totalGames": 15,
    "totalScore": 2500,
    "avgScore": 166,
    "topGame": {...}
  }
}
```

### 4. Get User Rank for Specific Game
```javascript
GET /api/leaderboard/rank/:gameId/:userId

Response:
{
  "gameId": "snake",
  "userId": "user_abc",
  "rank": 5,
  "totalPlayers": 100,
  "percentile": 95,
  "score": 150
}
```

## Database Schema Suggestion

### Users Table
```sql
CREATE TABLE users (
  id VARCHAR(255) PRIMARY KEY,
  username VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Scores Table
```sql
CREATE TABLE scores (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  game_id VARCHAR(50) NOT NULL,
  score INT NOT NULL,
  played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_game_score (game_id, score DESC),
  INDEX idx_user_game (user_id, game_id),
  UNIQUE KEY unique_user_game (user_id, game_id) -- Only keep best score per user per game
);
```

### Games Table (Optional)
```sql
CREATE TABLE games (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  emoji VARCHAR(10),
  category VARCHAR(50),
  gradient VARCHAR(100)
);
```

## Firebase Example (If using Firebase)

### Initialize Firebase
```javascript
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, orderBy, getDocs, setDoc, doc } from 'firebase/firestore';

const firebaseConfig = {
  // Your config
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
```

### Fetch All Scores
```javascript
const fetchLeaderboard = async (gameId = null) => {
  const scoresRef = collection(db, 'scores');
  let q = gameId 
    ? query(scoresRef, where('gameId', '==', gameId), orderBy('score', 'desc'))
    : query(scoresRef, orderBy('score', 'desc'));
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
```

### Submit Score
```javascript
const submitScore = async (userId, gameId, score) => {
  const scoreRef = doc(db, 'scores', `${userId}_${gameId}`);
  await setDoc(scoreRef, {
    userId,
    gameId,
    score,
    playedAt: new Date().toISOString()
  }, { merge: true }); // merge: true will update if exists
};
```

## Integration Steps in Leaderboard.jsx

### Step 1: Replace localStorage user with auth
```javascript
// Replace this:
const userId = localStorage.getItem('userId');

// With your auth system:
import { useAuth } from '../context/AuthContext';
const { user } = useAuth();
const userId = user.id;
```

### Step 2: Replace score loading
```javascript
// Replace this (line ~65):
useEffect(() => {
  const currentUserScores = gameConfigs.map(game => {
    const score = localStorage.getItem(game.storageKey);
    // ...
  });
  setScores(currentUserScores);
}, []);

// With API call:
useEffect(() => {
  const fetchScores = async () => {
    try {
      const response = await fetch('/api/leaderboard');
      const data = await response.json();
      setScores(data.scores);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
  };
  fetchScores();
}, []);
```

### Step 3: Update game components to submit scores
In each game component (e.g., SnakeGame.jsx), add score submission:

```javascript
const submitScore = async (score) => {
  try {
    await fetch('/api/leaderboard/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`
      },
      body: JSON.stringify({
        gameId: 'snake',
        score: score
      })
    });
  } catch (error) {
    console.error('Error submitting score:', error);
  }
};

// Call when game ends:
if (newScore > highScore) {
  submitScore(newScore);
}
```

## Environment Variables

Create `.env` file:
```env
VITE_API_URL=http://localhost:3000/api
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_PROJECT_ID=your_project_id
```

## Testing with Mock Data

Until your backend is ready, you can test with mock data:

```javascript
// Add to Leaderboard.jsx for testing
const generateMockScores = () => {
  const mockUsers = ['Player123', 'GamerPro', 'SnakeKing', 'Champion99', 'TopScorer'];
  const mockScores = [];
  
  gameConfigs.forEach(game => {
    mockUsers.forEach(username => {
      mockScores.push({
        ...game,
        userId: `user_${username}`,
        username: username,
        score: Math.floor(Math.random() * 1000),
        playedAt: new Date().toISOString()
      });
    });
  });
  
  return mockScores;
};

// Use in development:
if (process.env.NODE_ENV === 'development') {
  setScores(generateMockScores());
}
```

## Next Steps

1. ✅ Frontend is ready (current state)
2. ⏳ Set up authentication system
3. ⏳ Create database tables
4. ⏳ Build API endpoints
5. ⏳ Replace localStorage with API calls
6. ⏳ Update game components to submit scores
7. ⏳ Test with multiple users
8. ⏳ Deploy!

## Questions or Issues?

The frontend structure supports:
- ✅ Multiple users
- ✅ User identification (userId, username)
- ✅ Personal scores view vs All players view
- ✅ Current user highlighting
- ✅ Responsive design
- ✅ Real-time updates ready

Just connect your backend and you're good to go! 🚀
