import React, { useState, useEffect, useMemo } from 'react';
import { Trophy, Medal, Award, Crown, Star, User, X, ChevronDown, ChevronUp, Pencil, Check } from 'lucide-react';
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
  const [currentUsername, setCurrentUsername] = useState('Player');
  const [lastPlayedScore, setLastPlayedScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editingUsername, setEditingUsername] = useState('');

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
    setCurrentUsername(username);
  }, []);

  // Load scores for this specific game
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

  useEffect(() => {
    if (!isOpen) return;
    
    // Load last played score info
    const lastPlayedKey = `${gameId}-last-played`;
    const lastPlayedData = localStorage.getItem(lastPlayedKey);
    if (lastPlayedData) {
      try {
        const parsed = JSON.parse(lastPlayedData);
        setLastPlayedScore(parsed);
      } catch (e) {
        console.error('Error parsing last played data:', e);
      }
    }
    
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

  // Handle edit username
  const handleEditUsername = (userId, currentUsername) => {
    setEditingUserId(userId);
    setEditingUsername(currentUsername);
  };

  // Handle save username
  const handleSaveUsername = async (userId) => {
    if (!editingUsername.trim()) {
      alert('Username cannot be empty');
      return;
    }

    try {
      console.log('=== Frontend: Updating Username ===');
      console.log('Current userId:', userId);
      console.log('Current username (from localStorage):', localStorage.getItem('username'));
      console.log('New username:', editingUsername.trim());
      console.log('API URL:', `${API_BASE_URL}/api/users/${userId}`);

      // Update in database via API
      const response = await axios.put(`${API_BASE_URL}/api/users/${userId}`, {
        username: editingUsername.trim()
      });

      console.log('Backend response:', response.data);
      console.log('Scores matched:', response.data.matchedScores);
      console.log('Scores modified:', response.data.updatedScores);
      console.log('Total scores in DB:', response.data.totalScoresInDb);

      // Update localStorage only after successful API call
      localStorage.setItem('username', editingUsername.trim());

      // Update current username state
      setCurrentUsername(editingUsername.trim());

      // Wait a moment for database to fully update
      await new Promise(resolve => setTimeout(resolve, 500));

      // Refetch scores to get updated usernames from backend
      console.log('Refetching scores from backend...');
      await fetchScores();

      // Update last played score if it matches
      if (lastPlayedScore && lastPlayedScore.userId === userId) {
        setLastPlayedScore({ ...lastPlayedScore, username: editingUsername.trim() });
      }

      // Clear editing state
      setEditingUserId(null);
      setEditingUsername('');

      // Show success message with details
      console.log('Username updated successfully!');
      if (response.data.updatedScores === 0 && response.data.totalScoresInDb === 0) {
        alert(`Username updated to "${editingUsername.trim()}"!\n\nNote: You don't have any scores in this game yet. Play to see your new username on the leaderboard!`);
      } else if (response.data.updatedScores === 0 && response.data.totalScoresInDb > 0) {
        alert(`Username updated to "${editingUsername.trim()}"!\n\nWarning: ${response.data.totalScoresInDb} score(s) found but couldn't update. The userId might not match. Check console logs.`);
      } else {
        alert(`Username updated to "${editingUsername.trim()}" successfully!\n\nUpdated ${response.data.updatedScores} score(s) on the leaderboard.`);
      }
      console.log('=== Update Complete ===');
    } catch (err) {
      console.error('Error updating username:', err);
      
      // Check if username is already taken (409 Conflict)
      if (err.response && err.response.status === 409) {
        alert(err.response.data.message || 'Username is already taken. Please choose a different username.');
      } else {
        alert('Error updating username. Please try again.');
      }
      
      // Don't update anything if there's an error
      // Just reset editing state
      setEditingUserId(null);
      setEditingUsername('');
    }
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingUserId(null);
    setEditingUsername('');
  };

  // Handle key press in edit input
  const handleKeyPress = (e, userId) => {
    if (e.key === 'Enter') {
      handleSaveUsername(userId);
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  // Find current user's rank
  const currentUserRank = useMemo(() => {
    const index = scores.findIndex(s => s.userId === currentUserId);
    return index !== -1 ? index + 1 : null;
  }, [scores, currentUserId]);

  return (
    <div className="w-full" style={{width: '100%', display: 'block', visibility: 'visible', opacity: 1, position: 'relative', zIndex: 10, marginTop: '1rem', marginBottom: '1rem'}}>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-3 md:px-4 py-4 bg-gradient-to-r ${gradient} hover:opacity-90 active:opacity-80 backdrop-blur-md border border-white/20 rounded-xl text-white transition-all shadow-lg cursor-pointer touch-manipulation relative z-10`}
        style={{ minHeight: '56px', touchAction: 'manipulation', display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-between', color: '#FFFFFF', backgroundColor: '#A855F7', borderColor: 'rgba(255, 255, 255, 0.2)', position: 'relative', zIndex: 10, cursor: 'pointer', opacity: 1, visibility: 'visible' }}
      >
        <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0" style={{display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1}}>
          <Trophy className="w-5 h-5 flex-shrink-0" style={{color: '#FBBF24', display: 'block', flexShrink: 0}} />
          <span className="font-bold text-base md:text-lg truncate" style={{color: '#FFFFFF', display: 'inline-block', fontWeight: 'bold'}}>
            {gameName} Leaderboard
          </span>
          {currentUserRank && (
            <span className="text-xs md:text-sm bg-white/20 px-2 py-1 rounded-full whitespace-nowrap" style={{backgroundColor: 'rgba(255, 255, 255, 0.2)', color: '#FFFFFF', display: 'inline-block'}}>
              #{currentUserRank}
            </span>
          )}
        </div>
        <div className="flex-shrink-0 ml-2" style={{flexShrink: 0, marginLeft: '0.5rem'}}>
          {isOpen ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </div>
      </button>

      {/* Leaderboard Panel */}
      {isOpen && (
        <div className="mt-3 bg-black/40 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden animate-fadeIn relative z-10" style={{marginTop: '0.75rem', backgroundColor: 'rgba(0, 0, 0, 0.5)', borderColor: 'rgba(255, 255, 255, 0.1)', display: 'block', width: '100%', position: 'relative', zIndex: 10, visibility: 'visible', opacity: 1}}>
          {/* Header */}
          <div className={`px-3 md:px-4 py-3 bg-gradient-to-r ${gradient} flex items-center justify-between`} style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#A855F7', padding: '0.75rem'}}>
            <div className="flex items-center gap-2" style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
              <span className="text-xl md:text-3xl" style={{fontSize: '1.25rem', display: 'inline-block'}}>{emoji}</span>
              <div style={{display: 'block'}}>
                <h3 className="text-white font-bold text-sm md:text-lg" style={{color: '#FFFFFF', fontWeight: 'bold', display: 'block', fontSize: '0.875rem'}}>{gameName}</h3>
                <p className="text-white/80 text-xs" style={{color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.75rem', display: 'block'}}>All Scores</p>
              </div>
            </div>
            <Trophy className="w-5 h-5 md:w-6 md:h-6 text-yellow-300" style={{color: '#FCD34D', display: 'block'}} />
          </div>

          {/* User Profile - Edit Username */}
          <div className="px-3 md:px-4 py-3 bg-gradient-to-r from-purple-900/20 to-pink-900/20 border-b border-white/10" style={{backgroundColor: 'rgba(88, 28, 135, 0.2)', borderBottomColor: 'rgba(255, 255, 255, 0.1)', padding: '0.75rem', display: 'block'}}>
            <div className="flex items-center gap-2 md:gap-3" style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0" style={{width: '2.5rem', height: '2.5rem', minWidth: '2.5rem', minHeight: '2.5rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(to bottom right, #A855F7, #EC4899)'}}>
                <User className="w-5 h-5 md:w-6 md:h-6 text-white" style={{width: '1.25rem', height: '1.25rem', color: '#FFFFFF'}} />
              </div>
              <div className="min-w-0 flex-1" style={{minWidth: 0, flex: 1, display: 'block'}}>
                {editingUserId === currentUserId ? (
                  <div className="flex items-center gap-2" style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                    <input
                      type="text"
                      value={editingUsername}
                      onChange={(e) => setEditingUsername(e.target.value)}
                      onKeyDown={(e) => handleKeyPress(e, currentUserId)}
                      autoFocus
                      className="bg-white/20 border border-white/30 rounded px-2 py-1.5 text-sm md:text-base font-bold text-white focus:outline-none focus:ring-2 focus:ring-purple-500 flex-1"
                      placeholder="Enter your username"
                      style={{
                        fontSize: '0.875rem',
                        fontWeight: 'bold',
                        color: '#FFFFFF',
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                        padding: '0.375rem 0.5rem',
                        borderRadius: '0.25rem',
                        flex: 1
                      }}
                    />
                    <button
                      onClick={() => handleSaveUsername(currentUserId)}
                      className="p-1.5 bg-green-500 hover:bg-green-600 rounded transition-colors"
                      style={{padding: '0.375rem', borderRadius: '0.25rem', backgroundColor: '#22C55E'}}
                      title="Save"
                    >
                      <Check className="w-4 h-4 text-white" style={{width: '1rem', height: '1rem', color: '#FFFFFF'}} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between" style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                    <div>
                      <p className="text-white/60 text-xs" style={{color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.75rem', display: 'block'}}>Your Username</p>
                      <p className="text-white text-sm md:text-base font-bold" style={{color: '#FFFFFF', fontSize: '0.875rem', fontWeight: 'bold', display: 'block'}}>
                        {currentUsername}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setEditingUserId(currentUserId);
                        setEditingUsername(currentUsername);
                      }}
                      className="p-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/50 rounded transition-colors"
                      style={{padding: '0.5rem', borderRadius: '0.25rem', backgroundColor: 'rgba(168, 85, 247, 0.2)', borderColor: 'rgba(168, 85, 247, 0.5)'}}
                      title="Edit username"
                    >
                      <Pencil className="w-4 h-4 text-purple-300" style={{width: '1rem', height: '1rem', color: '#D8B4FE'}} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Last Played Score Indicator */}
          {lastPlayedScore && (
            <div className="px-3 md:px-4 py-2 md:py-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-b border-white/10" style={{backgroundColor: 'rgba(6, 182, 212, 0.2)', borderBottomColor: 'rgba(255, 255, 255, 0.1)', padding: '0.5rem 0.75rem', display: 'block'}}>
              <div className="flex items-center justify-between" style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                <div className="flex items-center gap-1.5 md:gap-2" style={{display: 'flex', alignItems: 'center', gap: '0.375rem'}}>
                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-cyan-400 rounded-full animate-pulse" style={{width: '0.375rem', height: '0.375rem', backgroundColor: '#22D3EE', borderRadius: '9999px', display: 'block'}}></div>
                  <span className="text-cyan-300 text-xs md:text-sm font-semibold" style={{color: '#67E8F9', fontSize: '0.75rem', fontWeight: '600', display: 'inline-block'}}>Last Played</span>
                </div>
                <div className="flex items-center gap-2 md:gap-3" style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                  <span className="text-white/60 text-xs" style={{color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.75rem', display: 'inline-block'}}>
                    {new Date(lastPlayedScore.playedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span className="text-white font-bold text-base md:text-xl" style={{color: '#FFFFFF', fontWeight: 'bold', display: 'inline-block'}}>{lastPlayedScore.score.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          {/* Scores List */}
          {loading ? (
            <div className="px-3 md:px-4 py-6 md:py-8 text-center" style={{padding: '1.5rem', textAlign: 'center', display: 'block'}}>
              <div className="w-10 h-10 md:w-12 md:h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-2 md:mb-3" style={{width: '2.5rem', height: '2.5rem', borderWidth: '4px', borderColor: 'rgba(255, 255, 255, 0.2)', borderTopColor: '#FFFFFF', borderRadius: '9999px', display: 'block', margin: '0 auto 0.5rem'}}></div>
              <p className="text-white/60 text-sm md:text-base" style={{color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.875rem', display: 'block'}}>Loading leaderboard...</p>
            </div>
          ) : error ? (
            <div className="px-3 md:px-4 py-6 md:py-8 text-center" style={{padding: '1.5rem', textAlign: 'center', display: 'block'}}>
              <Trophy className="w-10 h-10 md:w-12 md:h-12 text-red-400/60 mx-auto mb-2 md:mb-3" style={{width: '2.5rem', height: '2.5rem', color: 'rgba(248, 113, 113, 0.6)', display: 'block', margin: '0 auto 0.5rem'}} />
              <p className="text-red-400/80 font-semibold mb-1 text-sm md:text-base" style={{color: 'rgba(248, 113, 113, 0.8)', fontWeight: '600', display: 'block'}}>{error}</p>
              <p className="text-white/40 text-xs md:text-sm" style={{color: 'rgba(255, 255, 255, 0.4)', fontSize: '0.75rem', display: 'block'}}>Showing local scores if available</p>
            </div>
          ) : scores.length > 0 ? (
            <div className="divide-y divide-white/10 max-h-96 md:max-h-[500px] overflow-y-auto custom-scrollbar" style={{maxHeight: '500px', overflowY: 'auto', display: 'block', width: '100%', WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain'}}>
              {scores.map((player, index) => {
                const isCurrentUser = player.userId === currentUserId;
                const isLastPlayed = lastPlayedScore && 
                  player.score === lastPlayedScore.score && 
                  player.userId === lastPlayedScore.userId;
                return (
                  <div
                    key={`${player.userId}-${index}`}
                    className={`px-2 md:px-4 py-3 flex items-center justify-between transition-colors touch-manipulation ${
                      isLastPlayed
                        ? 'bg-cyan-500/10 border-l-4 border-cyan-500'
                        : isCurrentUser 
                        ? 'bg-purple-500/20 border-l-4 border-purple-500' 
                        : 'hover:bg-white/5'
                    }`}
                    style={{ WebkitTapHighlightColor: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 0.5rem', minHeight: '60px', backgroundColor: isLastPlayed ? 'rgba(6, 182, 212, 0.1)' : isCurrentUser ? 'rgba(168, 85, 247, 0.2)' : 'transparent', borderLeftWidth: isLastPlayed || isCurrentUser ? '4px' : '0', borderLeftColor: isLastPlayed ? '#06B6D4' : isCurrentUser ? '#A855F7' : 'transparent' }}
                  >
                    {/* Rank & Player */}
                    <div className="flex items-center gap-1.5 md:gap-3 flex-1 min-w-0" style={{display: 'flex', alignItems: 'center', gap: '0.375rem', flex: 1, minWidth: 0, overflow: 'hidden'}}>
                      {/* Rank */}
                      <div className="flex items-center gap-1 md:gap-2 w-12 md:w-12 flex-shrink-0" style={{display: 'flex', alignItems: 'center', gap: '0.25rem', width: '3rem', flexShrink: 0}}>
                        {getRankIcon(index)}
                        <span className="text-white/80 font-bold text-xs md:text-sm" style={{color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold', fontSize: '0.75rem', display: 'inline-block'}}>#{index + 1}</span>
                      </div>

                      {/* Avatar */}
                      <div className={`w-7 h-7 md:w-10 md:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isCurrentUser 
                          ? 'bg-gradient-to-br from-purple-500 to-pink-500' 
                          : index === 0
                          ? 'bg-gradient-to-br from-yellow-500 to-amber-500'
                          : index === 1
                          ? 'bg-gradient-to-br from-gray-400 to-gray-500'
                          : index === 2
                          ? 'bg-gradient-to-br from-amber-600 to-orange-600'
                          : 'bg-gradient-to-br from-gray-600 to-gray-700'
                      }`} style={{width: '1.75rem', height: '1.75rem', minWidth: '1.75rem', minHeight: '1.75rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, aspectRatio: '1/1'}}>
                        <User className="w-3.5 h-3.5 md:w-5 md:h-5 text-white" style={{width: '0.875rem', height: '0.875rem', color: '#FFFFFF', flexShrink: 0}} />
                      </div>

                      {/* Username */}
                      <div className="min-w-0 flex-1" style={{minWidth: 0, flex: 1, display: 'block'}}>
                        <div className="flex items-center gap-2">
                          {editingUserId === player.userId ? (
                            <>
                              <input
                                type="text"
                                value={editingUsername}
                                onChange={(e) => setEditingUsername(e.target.value)}
                                onKeyDown={(e) => handleKeyPress(e, player.userId)}
                                onBlur={() => handleSaveUsername(player.userId)}
                                autoFocus
                                className="bg-white/20 border border-white/30 rounded px-2 py-1 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                style={{
                                  fontSize: '0.875rem',
                                  fontWeight: 'bold',
                                  color: '#FFFFFF',
                                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                  borderColor: 'rgba(255, 255, 255, 0.3)',
                                  padding: '0.25rem 0.5rem',
                                  borderRadius: '0.25rem',
                                  maxWidth: '150px'
                                }}
                              />
                              <button
                                onClick={() => handleSaveUsername(player.userId)}
                                className="p-1 hover:bg-white/20 rounded transition-colors"
                                style={{padding: '0.25rem', borderRadius: '0.25rem'}}
                              >
                                <Check className="w-4 h-4 text-green-400" style={{width: '1rem', height: '1rem', color: '#4ADE80'}} />
                              </button>
                            </>
                          ) : (
                            <>
                              <p className={`font-bold text-sm md:text-base ${
                                isLastPlayed ? 'text-cyan-300' : isCurrentUser ? 'text-purple-300' : 'text-white'
                              }`} style={{fontWeight: 'bold', fontSize: '0.875rem', display: 'block', color: isLastPlayed ? '#67E8F9' : isCurrentUser ? '#D8B4FE' : '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                                {player.username}
                              </p>
                              {isCurrentUser && (
                                <button
                                  onClick={() => handleEditUsername(player.userId, player.username)}
                                  className="p-1 hover:bg-white/20 rounded transition-colors opacity-70 hover:opacity-100"
                                  style={{padding: '0.25rem', borderRadius: '0.25rem', opacity: 0.7}}
                                  title="Edit username"
                                >
                                  <Pencil className="w-3.5 h-3.5 text-purple-300" style={{width: '0.875rem', height: '0.875rem', color: '#D8B4FE'}} />
                                </button>
                              )}
                            </>
                          )}
                        </div>
                        {isLastPlayed && (
                          <p className="text-xs text-cyan-400" style={{fontSize: '0.75rem', color: '#22D3EE', display: 'block'}}>Last Played</p>
                        )}
                        {isCurrentUser && !isLastPlayed && (
                          <p className="text-xs text-purple-400" style={{fontSize: '0.75rem', color: '#C084FC', display: 'block'}}>You</p>
                        )}
                      </div>
                    </div>

                    {/* Score */}
                    <div className="flex items-center gap-1 md:gap-2 flex-shrink-0 ml-2" style={{display: 'flex', alignItems: 'center', gap: '0.25rem', flexShrink: 0, marginLeft: '0.5rem'}}>
                      <div className="text-right" style={{textAlign: 'right'}}>
                        <p className="text-base md:text-xl lg:text-2xl font-bold text-white" style={{fontSize: '1rem', fontWeight: 'bold', color: '#FFFFFF', display: 'block', whiteSpace: 'nowrap'}}>
                          {player.score.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="px-3 md:px-4 py-6 md:py-8 text-center" style={{padding: '1.5rem', textAlign: 'center', display: 'block'}}>
              <Trophy className="w-10 h-10 md:w-12 md:h-12 text-white/20 mx-auto mb-2 md:mb-3" style={{width: '2.5rem', height: '2.5rem', color: 'rgba(255, 255, 255, 0.2)', display: 'block', margin: '0 auto 0.5rem'}} />
              <p className="text-white/60 text-sm md:text-base" style={{color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.875rem', display: 'block'}}>No scores yet</p>
              <p className="text-white/40 text-xs md:text-sm" style={{color: 'rgba(255, 255, 255, 0.4)', fontSize: '0.75rem', display: 'block'}}>Play the game to see the leaderboard!</p>
            </div>
          )}

          {/* Footer */}
          <div className={`px-3 md:px-4 py-2.5 md:py-3 bg-gradient-to-r ${gradient} bg-opacity-20 border-t border-white/10`} style={{padding: '0.625rem 0.75rem', backgroundColor: 'rgba(168, 85, 247, 0.2)', borderTopColor: 'rgba(255, 255, 255, 0.1)', display: 'block'}}>
            <p className="text-white/60 text-xs text-center leading-relaxed" style={{color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.75rem', textAlign: 'center', display: 'block', lineHeight: '1.5'}}>
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
