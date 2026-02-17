import React, { useState, useEffect, useMemo } from 'react';
import { Trophy, Medal, Award, Crown, Star, User, X, ChevronDown, ChevronUp } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://portfolio-backend-bfkl.onrender.com';

/**
 * GameLeaderboard Component
 * 
 * This component shows the leaderboard for a specific game.
 * Can be embedded directly in individual game components.
 * 
 * Usage:
 * import GameLeaderboard from '../Leaderboard/GameLeaderboard';
 * 
 * <GameLeaderboard 
 *   gameId="snake" 
 *   gameName="Snake" 
 *   emoji="🐍"
 *   gradient="from-green-600 to-emerald-600"
 *   storageKey="snake-high-score"
 * />
 */

const GameLeaderboard = ({ 
  gameId, 
  gameName, 
  emoji, 
  gradient = 'from-purple-600 to-pink-600',
  storageKey
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [scores, setScores] = useState([]);
  const [currentUserId, setCurrentUserId] = useState('guest_user');
  const [lastPlayedScore, setLastPlayedScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load current user from localStorage
  useEffect(() => {
    let userId = localStorage.getItem('userId');
    let username = localStorage.getItem('username');
    
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('userId', userId);
    }
    
    if (!username) {
      username = `Player${Math.floor(Math.random() * 9999)}`;
      localStorage.setItem('username', username);
    }
    
    setCurrentUserId(userId);
  }, []);

  // Load scores for this specific game
  useEffect(() => {
    if (!isOpen) return;
    
    // Load last played score info
    const lastPlayedKey = storageKey.replace('-best', '-last-played').replace('-high-score', '-last-played');
    const lastPlayedData = localStorage.getItem(lastPlayedKey);
    if (lastPlayedData) {
      try {
        const parsed = JSON.parse(lastPlayedData);
        setLastPlayedScore(parsed);
      } catch (e) {
        console.error('Error parsing last played data:', e);
      }
    }
    
    // Fetch scores from API
    const fetchScores = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await axios.get(`${API_BASE_URL}/api/scores/game/${gameId}`);
        
        if (response.data && response.data.data && Array.isArray(response.data.data)) {
          // Transform the API response to match the component format
          const formattedScores = response.data.data.map(entry => ({
            userId: entry.userId || entry.user_id || 'unknown',
            username: entry.username || entry.playerName || `Player${Math.floor(Math.random() * 9999)}`,
            score: entry.score || 0,
            playedAt: entry.playedAt || entry.timestamp || new Date().toISOString()
          }));
          
          // Sort by score descending
          formattedScores.sort((a, b) => b.score - a.score);
          
          setScores(formattedScores);
        } else {
          setScores([]);
        }
      } catch (err) {
        // Handle 404 or connection errors gracefully - silently fall back to localStorage
        const is404 = err.response?.status === 404;
        const isConnectionError = err.code === 'ERR_NETWORK' || !err.response;
        
        if (!is404 && !isConnectionError) {
          console.error('Error fetching leaderboard:', err);
          setError('Failed to load leaderboard');
        }
        
        // Fallback to localStorage if API fails
        const currentScore = localStorage.getItem(storageKey);
        const userId = localStorage.getItem('userId') || 'guest_user';
        const username = localStorage.getItem('username') || 'Guest';
        
        if (currentScore) {
          const userScores = [
            {
              userId: userId,
              username: username,
              score: parseInt(currentScore) || 0,
              playedAt: new Date().toISOString()
            }
          ];
          
          setScores(userScores);
        } else {
          setScores([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchScores();
  }, [isOpen, gameId, storageKey]);

  // Get rank icon
  const getRankIcon = (index) => {
    switch (index) {
      case 0:
        return <Crown className="w-5 h-5 text-yellow-400" />;
      case 1:
        return <Medal className="w-5 h-5 text-gray-300" />;
      case 2:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return <Star className="w-4 h-4 text-purple-400" />;
    }
  };

  // Find current user's rank
  const currentUserRank = useMemo(() => {
    const index = scores.findIndex(s => s.userId === currentUserId);
    return index !== -1 ? index + 1 : null;
  }, [scores, currentUserId]);

  return (
    <div className="w-full">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r ${gradient} hover:opacity-90 backdrop-blur-md border border-white/20 rounded-xl text-white transition-all shadow-lg`}
      >
        <div className="flex items-center gap-3">
          <Trophy className="w-5 h-5" />
          <span className="font-bold text-lg">
            {gameName} Leaderboard
          </span>
          {currentUserRank && (
            <span className="text-sm bg-white/20 px-2 py-1 rounded-full">
              Rank #{currentUserRank}
            </span>
          )}
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5" />
        ) : (
          <ChevronDown className="w-5 h-5" />
        )}
      </button>

      {/* Leaderboard Panel */}
      {isOpen && (
        <div className="mt-3 bg-black/40 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className={`px-4 py-3 bg-gradient-to-r ${gradient} flex items-center justify-between`}>
            <div className="flex items-center gap-2">
              <span className="text-3xl">{emoji}</span>
              <div>
                <h3 className="text-white font-bold text-lg">{gameName}</h3>
                <p className="text-white/80 text-xs">All Scores</p>
              </div>
            </div>
            <Trophy className="w-6 h-6 text-yellow-300" />
          </div>

          {/* Last Played Score Indicator */}
          {lastPlayedScore && (
            <div className="px-4 py-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                  <span className="text-cyan-300 text-sm font-semibold">Last Played</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-white/60 text-xs">
                    {new Date(lastPlayedScore.playedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span className="text-white font-bold text-xl">{lastPlayedScore.score.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          {/* Scores List */}
          {loading ? (
            <div className="px-4 py-8 text-center">
              <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-white/60">Loading leaderboard...</p>
            </div>
          ) : error ? (
            <div className="px-4 py-8 text-center">
              <Trophy className="w-12 h-12 text-red-400/60 mx-auto mb-3" />
              <p className="text-red-400/80 font-semibold mb-1">{error}</p>
              <p className="text-white/40 text-sm">Showing local scores if available</p>
            </div>
          ) : scores.length > 0 ? (
            <div className="divide-y divide-white/10 max-h-96 overflow-y-auto">
              {scores.map((player, index) => {
                const isCurrentUser = player.userId === currentUserId;
                const isLastPlayed = lastPlayedScore && 
                  player.score === lastPlayedScore.score && 
                  player.userId === lastPlayedScore.userId;
                return (
                  <div
                    key={`${player.userId}-${index}`}
                    className={`px-4 py-3 flex items-center justify-between transition-colors ${
                      isLastPlayed
                        ? 'bg-cyan-500/10 border-l-4 border-cyan-500'
                        : isCurrentUser 
                        ? 'bg-purple-500/20 border-l-4 border-purple-500' 
                        : 'hover:bg-white/5'
                    }`}
                  >
                    {/* Rank & Player */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {/* Rank */}
                      <div className="flex items-center gap-2 w-12">
                        {getRankIcon(index)}
                        <span className="text-white/80 font-bold text-sm">#{index + 1}</span>
                      </div>

                      {/* Avatar */}
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isCurrentUser 
                          ? 'bg-gradient-to-br from-purple-500 to-pink-500' 
                          : index === 0
                          ? 'bg-gradient-to-br from-yellow-500 to-amber-500'
                          : index === 1
                          ? 'bg-gradient-to-br from-gray-400 to-gray-500'
                          : index === 2
                          ? 'bg-gradient-to-br from-amber-600 to-orange-600'
                          : 'bg-gradient-to-br from-gray-600 to-gray-700'
                      }`}>
                        <User className="w-5 h-5 text-white" />
                      </div>

                      {/* Username */}
                      <div className="min-w-0 flex-1">
                        <p className={`font-bold truncate ${
                          isLastPlayed ? 'text-cyan-300' : isCurrentUser ? 'text-purple-300' : 'text-white'
                        }`}>
                          {player.username}
                        </p>
                        {isLastPlayed && (
                          <p className="text-xs text-cyan-400">Last Played</p>
                        )}
                        {isCurrentUser && !isLastPlayed && (
                          <p className="text-xs text-purple-400">You</p>
                        )}
                      </div>
                    </div>

                    {/* Score */}
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <p className="text-xl md:text-2xl font-bold text-white">
                          {player.score.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="px-4 py-8 text-center">
              <Trophy className="w-12 h-12 text-white/20 mx-auto mb-3" />
              <p className="text-white/60">No scores yet</p>
              <p className="text-white/40 text-sm">Play the game to see the leaderboard!</p>
            </div>
          )}

          {/* Footer */}
          <div className={`px-4 py-3 bg-gradient-to-r ${gradient} bg-opacity-20 border-t border-white/10`}>
            <p className="text-white/60 text-xs text-center">
              {currentUserRank ? (
                `You're ranked #${currentUserRank} out of ${scores.length} players`
              ) : (
                'Play to get on the leaderboard!'
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameLeaderboard;
