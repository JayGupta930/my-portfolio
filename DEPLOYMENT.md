# 🚀 Deployment Guide

## Environment Configuration

This application uses environment variables to configure the backend API connection. This is crucial for the leaderboard and score tracking features to work properly.

### For Local Development

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. The default local configuration is:
   ```env
   VITE_API_URL=http://localhost:3000
   ```

3. Make sure your backend server is running on port 3000 locally.

### For Production Deployment

When deploying to production (Vercel, Netlify, Firebase, etc.), you **MUST** set the `VITE_API_URL` environment variable to point to your deployed backend API.

#### Vercel

1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add: `VITE_API_URL` = `https://your-backend-api.com`
4. Redeploy your application

#### Netlify

1. Go to Site settings > Build & deploy > Environment
2. Add:
   - Key: `VITE_API_URL`
   - Value: `https://your-backend-api.com`
3. Trigger a new deploy

#### Firebase Hosting

1. Set environment variables using Firebase config:
   ```bash
   firebase functions:config:set api.url="https://your-backend-api.com"
   ```

2. Or use `.env.production`:
   ```env
   VITE_API_URL=https://your-backend-api.com
   ```

#### Other Platforms

For other hosting platforms, set the environment variable `VITE_API_URL` to your backend API URL in the platform's environment configuration.

## 🔧 Backend Requirements

The frontend expects the following backend endpoints:

### POST /api/scores
Submit a new score for a game.

**Request:**
```json
{
  "userId": "user_123",
  "username": "Player123",
  "gameId": "2048",
  "gameName": "2048",
  "score": 1500,
  "playedAt": "2026-02-16T10:30:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Score submitted successfully"
}
```

### GET /game/:gameId
Get leaderboard for a specific game.

**Response:**
```json
{
  "leaderboard": [
    {
      "userId": "user_123",
      "username": "Player123",
      "score": 1500,
      "playedAt": "2026-02-16T10:30:00Z"
    }
  ]
}
```

## ⚠️ Common Issues

### Issue: Scores not saving in production
**Cause:** `VITE_API_URL` is not set or pointing to localhost

**Solution:** 
1. Set `VITE_API_URL` in your hosting platform's environment variables
2. Point it to your deployed backend API
3. Redeploy the application

### Issue: CORS errors
**Cause:** Backend not configured to accept requests from your frontend domain

**Solution:**
Configure CORS on your backend to allow requests from your frontend domain:
```javascript
// Example for Express.js
const cors = require('cors');
app.use(cors({
  origin: 'https://your-frontend-domain.com'
}));
```

### Issue: Environment variables not updating
**Cause:** Vite caches environment variables at build time

**Solution:**
1. Clear the build cache
2. Rebuild the application
3. Redeploy

## 📝 Notes

- Environment variables in Vite must be prefixed with `VITE_` to be exposed to the client
- Never commit `.env` files to version control (they're in `.gitignore`)
- Always use `.env.example` to document required variables
- Environment variables are embedded at build time in Vite

## 🔗 Related Documentation

- [Leaderboard API Integration Guide](src/components/Leaderboard/API_INTEGRATION_GUIDE.md)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
