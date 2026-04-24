import React, { useState, useEffect, useMemo } from 'react';
import { Trophy, Medal, Award, TrendingUp, BarChart3, Sparkles, Crown, Star, Filter, ArrowUpDown, User, Users, Pencil, Check } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://portfolio-backend-bfkl.onrender.com';

const Leaderboard = () => {
  const [scores, setScores] = useState([]);
  const [sortBy, setSortBy] = useState('score');
  const [filterCategory, setFilterCategory] = useState('all');
  const [viewMode, setViewMode] = useState('all');
  const [currentUserId, setCurrentUserId] = useState('guest_user');
  const [currentUsername, setCurrentUsername] = useState('Player');
  const [lastPlayedGames, setLastPlayedGames] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editingUsername, setEditingUsername] = useState('');

  const gameConfigs = [
    { id: '2048', name: '2048', emoji: '🔢', storageKey: '2048-best', category: 'puzzle', gradient: 'from-purple-600 to-pink-600' },
    { id: 'snake', name: 'Snake', emoji: '🐍', storageKey: 'snake-high-score', category: 'classic', gradient: 'from-green-600 to-emerald-600' },
    { id: 'tictactoe', name: 'Tic Tac Toe', emoji: '⭕', storageKey: 'tictactoe-score', category: 'classic', gradient: 'from-blue-600 to-cyan-600' },
    { id: 'memory', name: 'Memory Match', emoji: '🎯', storageKey: 'memory-best', category: 'puzzle', gradient: 'from-pink-600 to-rose-600' },
    { id: 'minesweeper', name: 'Minesweeper', emoji: '💣', storageKey: 'minesweeper-best', category: 'puzzle', gradient: 'from-red-600 to-orange-600' },
    { id: 'simon', name: 'Simon Says', emoji: '🎵', storageKey: 'simon-best', category: 'puzzle', gradient: 'from-cyan-600 to-teal-600' },
    { id: 'wordle', name: 'Wordle', emoji: '📝', storageKey: 'wordle-wins', category: 'puzzle', gradient: 'from-yellow-600 to-amber-600' },
    { id: 'flappy', name: 'Flappy Bird', emoji: '🐦', storageKey: 'flappy-high-score', category: 'reaction', gradient: 'from-sky-600 to-cyan-600' },
    { id: 'typing', name: 'Speed Typing', emoji: '⌨️', storageKey: 'typing-best', category: 'reaction', gradient: 'from-violet-600 to-purple-600' },
    { id: 'color', name: 'Color Guess', emoji: '🎨', storageKey: 'color-best', category: 'puzzle', gradient: 'from-fuchsia-600 to-pink-600' },
    { id: 'reaction', name: 'Reaction Time', emoji: '⚡', storageKey: 'reaction-best', category: 'reaction', gradient: 'from-amber-600 to-yellow-600' },
    { id: 'number', name: 'Number Guess', emoji: '🔢', storageKey: 'number-best', category: 'luck', gradient: 'from-indigo-600 to-blue-600' },
    { id: 'rps', name: 'Rock Paper Scissors', emoji: '✊', storageKey: 'rps-wins', category: 'luck', gradient: 'from-rose-600 to-red-600' },
    { id: 'whack', name: 'Whack-a-Mole', emoji: '🔨', storageKey: 'whack-high-score', category: 'reaction', gradient: 'from-orange-600 to-amber-600' },
    { id: 'math', name: 'Math Quiz', emoji: '🧮', storageKey: 'math-best', category: 'puzzle', gradient: 'from-blue-600 to-indigo-600' },
    { id: 'pattern', name: 'Pattern Lock', emoji: '🔐', storageKey: 'pattern-best', category: 'puzzle', gradient: 'from-purple-600 to-violet-600' },
    { id: 'bubble', name: 'Bubble Pop', emoji: '🫧', storageKey: 'bubble-high-score', category: 'reaction', gradient: 'from-cyan-600 to-blue-600' },
    { id: 'trivia', name: 'Quiz Trivia', emoji: '🧠', storageKey: 'trivia-best', category: 'puzzle', gradient: 'from-emerald-600 to-teal-600' },
    { id: 'hangman', name: 'Hangman', emoji: '🎯', storageKey: 'hangman-wins', category: 'puzzle', gradient: 'from-slate-600 to-gray-600' },
    { id: 'dice', name: 'Dice Roll', emoji: '🎲', storageKey: 'dice-wins', category: 'luck', gradient: 'from-red-600 to-rose-600' },
    { id: 'scramble', name: 'Word Scramble', emoji: '🔤', storageKey: 'scramble-best', category: 'puzzle', gradient: 'from-teal-600 to-green-600' },
    { id: 'tap', name: 'Tap Speed', emoji: '👆', storageKey: 'tap-best', category: 'reaction', gradient: 'from-orange-600 to-red-600' },
    { id: 'emoji', name: 'Emoji Match', emoji: '😊', storageKey: 'emoji-best', category: 'reaction', gradient: 'from-pink-600 to-purple-600' },
    { id: 'card', name: 'High Card', emoji: '🃏', storageKey: 'card-wins', category: 'luck', gradient: 'from-violet-600 to-indigo-600' },
    { id: 'target', name: 'Target Shoot', emoji: '🎯', storageKey: 'target-high-score', category: 'reaction', gradient: 'from-red-600 to-orange-600' },
    { id: 'coin', name: 'Coin Flip', emoji: '🪙', storageKey: 'coin-streak', category: 'luck', gradient: 'from-yellow-600 to-amber-600' },
  ];

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

  // Function to fetch all scores
  const fetchAllScores = async () => {
    const allScores = [];
    
    // Try multiple endpoint patterns to fetch all scores
    try {
      // Try fetching all scores at once
      const response = await axios.get(`${API_BASE_URL}/api/scores`);
      console.log('Fetched all scores:', response.data);
      
      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        // Map all scores to the format we need
        response.data.data.forEach(entry => {
          const game = gameConfigs.find(g => g.id === entry.gameId);
          if (game) {
            allScores.push({
              ...game,
              score: entry.score || 0,
              userId: entry.userId || entry.user_id || 'unknown',
              username: entry.username || entry.playerName || `Player${Math.floor(Math.random() * 9999)}`,
              hasPlayed: true,
              playedAt: entry.playedAt || entry.timestamp || new Date().toISOString(),
              lastPlayed: null
            });
          }
        });
      }
    } catch (err) {
      console.log('Error fetching all scores, trying individual games:', err.message);
      
      // Fallback: Fetch scores for each game individually
      for (const game of gameConfigs) {
        try {
          const response = await axios.get(`${API_BASE_URL}/api/scores/game/${game.id}`);
          console.log(`Fetched scores for ${game.name}:`, response.data);
          
          if (response.data && response.data.data && Array.isArray(response.data.data)) {
            response.data.data.forEach(entry => {
              allScores.push({
                ...game,
                score: entry.score || 0,
                userId: entry.userId || entry.user_id || 'unknown',
                username: entry.username || entry.playerName || `Player${Math.floor(Math.random() * 9999)}`,
                hasPlayed: true,
                playedAt: entry.playedAt || entry.timestamp || new Date().toISOString(),
                lastPlayed: null
              });
            });
          }
        } catch (err) {
          console.log(`No scores found for ${game.name}`);
        }
      }
    }
    
    console.log('Total scores loaded:', allScores.length);
    
    // Also get current user's last played games from localStorage
    const userId = localStorage.getItem('userId') || 'guest_user';
    const recentPlayed = [];
    
    gameConfigs.forEach(game => {
      const lastPlayedKey = game.storageKey.replace('-best', '-last-played').replace('-high-score', '-last-played');
      const lastPlayedData = localStorage.getItem(lastPlayedKey);
      if (lastPlayedData) {
        try {
          const lastPlayed = JSON.parse(lastPlayedData);
          recentPlayed.push({ gameId: game.id, ...lastPlayed });
        } catch (e) {
          console.error('Error parsing last played data:', e);
        }
      }
    });
    
    // Sort recent played by time
    recentPlayed.sort((a, b) => new Date(b.playedAt) - new Date(a.playedAt));
    
    setLastPlayedGames(recentPlayed.slice(0, 5));
    setScores(allScores);
  };

  useEffect(() => {
    fetchAllScores();
  }, []);

  const stats = useMemo(() => {
    const totalGames = scores.length;
    const totalScore = scores.reduce((sum, game) => sum + game.score, 0);
    const highestScore = scores.length > 0 ? Math.max(...scores.map(g => g.score)) : 0;
    const topGame = scores.find(g => g.score === highestScore);

    return {
      totalGames,
      totalScore,
      highestScore,
      topGame,
      avgScore: totalGames > 0 ? Math.round(totalScore / totalGames) : 0
    };
  }, [scores]);

  const filteredAndSortedScores = useMemo(() => {
    let filtered = scores;
    
    if (viewMode === 'myScores') {
      filtered = filtered.filter(game => game.userId === currentUserId);
    }
    
    if (filterCategory !== 'all') {
      filtered = filtered.filter(game => game.category === filterCategory);
    }

    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'score':
          return b.score - a.score;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return sorted;
  }, [scores, sortBy, filterCategory, viewMode, currentUserId]);

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

  const getCategoryColor = (category) => {
    const colors = {
      classic: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      puzzle: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      reaction: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      luck: 'bg-green-500/20 text-green-400 border-green-500/30'
    };
    return colors[category] || colors.classic;
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
      console.log('Updating username to:', editingUsername.trim(), 'for userId:', userId);

      // Update in database via API
      const response = await axios.put(`${API_BASE_URL}/api/users/${userId}`, {
        username: editingUsername.trim()
      });

      console.log('Backend response:', response.data);

      // Update localStorage only after successful API call
      localStorage.setItem('username', editingUsername.trim());

      // Update current username state
      setCurrentUsername(editingUsername.trim());

      // Wait a moment for database to fully update
      await new Promise(resolve => setTimeout(resolve, 500));

      // Refetch all scores to get updated usernames from backend
      console.log('Refetching scores from backend...');
      await fetchAllScores();

      // Clear editing state
      setEditingUserId(null);
      setEditingUsername('');

      // Show success message
      console.log('Username updated successfully!');
      alert(`Username updated to "${editingUsername.trim()}" successfully! ${response.data.updatedScores || 0} scores updated.`);
      
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

  return (
    <div className="min-h-screen bg-[#050414] py-6 md:py-8 px-3 md:px-4" style={{paddingTop: 'max(1.5rem, env(safe-area-inset-top))', position: 'relative', zIndex: 1, minHeight: '100vh'}}>
      <div className="max-w-7xl mx-auto" style={{position: 'relative', width: '100%'}}>
        <div className="text-center mb-8 md:mb-12 px-2">
          <div className="flex items-center mt-20 md:mt-24 justify-center gap-2 md:gap-3 mb-3 md:mb-4">
            <Trophy className="w-8 h-8 md:w-10 md:h-10 text-yellow-400" style={{color: '#FBBF24', display: 'block'}} />
            <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold text-white" style={{color: '#FFFFFF', display: 'block'}}>Leaderboard</h1>
            <Trophy className="w-8 h-8 md:w-10 md:h-10 text-yellow-400" style={{color: '#FBBF24', display: 'block'}} />
          </div>
          <p className="text-white/60 text-base md:text-lg" style={{color: 'rgba(255, 255, 255, 0.6)', display: 'block'}}>Track your best scores across all games</p>
        </div>

        {/* User Profile Card - Edit Username */}
        <div className="mb-6 md:mb-8 bg-gradient-to-r from-purple-900/30 to-pink-900/30 backdrop-blur-md border border-purple-500/30 rounded-xl md:rounded-2xl p-4 md:p-6" style={{backgroundColor: 'rgba(88, 28, 135, 0.3)', borderColor: 'rgba(168, 85, 247, 0.3)', display: 'block', width: '100%'}}>
          <div className="flex items-center justify-between gap-3" style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <div className="flex items-center gap-3 flex-1 min-w-0" style={{display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1}}>
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0" style={{width: '3rem', height: '3rem', minWidth: '3rem', minHeight: '3rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(to bottom right, #A855F7, #EC4899)'}}>
                <User className="w-6 h-6 md:w-7 md:h-7 text-white" style={{width: '1.5rem', height: '1.5rem', color: '#FFFFFF'}} />
              </div>
              <div className="min-w-0 flex-1" style={{minWidth: 0, flex: 1, display: 'block'}}>
                <p className="text-white/60 text-xs md:text-sm mb-1" style={{color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.75rem', display: 'block', marginBottom: '0.25rem'}}>Your Username</p>
                {editingUserId === currentUserId ? (
                  <div className="flex items-center gap-2" style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                    <input
                      type="text"
                      value={editingUsername}
                      onChange={(e) => setEditingUsername(e.target.value)}
                      onKeyDown={(e) => handleKeyPress(e, currentUserId)}
                      autoFocus
                      className="bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-base md:text-lg font-bold text-white focus:outline-none focus:ring-2 focus:ring-purple-500 flex-1"
                      placeholder="Enter your username"
                      style={{
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        color: '#FFFFFF',
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                        padding: '0.5rem 0.75rem',
                        borderRadius: '0.5rem',
                        flex: 1,
                        maxWidth: '300px'
                      }}
                    />
                    <button
                      onClick={() => handleSaveUsername(currentUserId)}
                      className="p-2 md:p-2.5 bg-green-500 hover:bg-green-600 rounded-lg transition-colors flex items-center justify-center"
                      style={{padding: '0.5rem', borderRadius: '0.5rem', backgroundColor: '#22C55E'}}
                      title="Save"
                    >
                      <Check className="w-5 h-5 md:w-6 md:h-6 text-white" style={{width: '1.25rem', height: '1.25rem', color: '#FFFFFF'}} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2" style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                    <h3 className="text-white text-lg md:text-xl font-bold truncate" style={{color: '#FFFFFF', fontSize: '1.125rem', fontWeight: 'bold', display: 'block'}}>
                      {currentUsername || 'Player'}
                    </h3>
                  </div>
                )}
              </div>
            </div>
            {editingUserId !== currentUserId && (
              <button
                onClick={() => {
                  setEditingUserId(currentUserId);
                  setEditingUsername(currentUsername);
                }}
                className="p-2.5 md:p-3 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/50 rounded-lg transition-colors flex items-center gap-2 flex-shrink-0"
                style={{padding: '0.625rem', borderRadius: '0.5rem', backgroundColor: 'rgba(168, 85, 247, 0.2)', borderColor: 'rgba(168, 85, 247, 0.5)', display: 'flex', alignItems: 'center', gap: '0.5rem'}}
                title="Edit username"
              >
                <Pencil className="w-4 h-4 md:w-5 md:h-5 text-purple-300" style={{width: '1rem', height: '1rem', color: '#D8B4FE'}} />
                <span className="hidden md:inline text-purple-300 font-semibold text-sm" style={{color: '#D8B4FE', fontWeight: '600'}}>Edit</span>
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8" style={{display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', width: '100%'}}>
          <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-md border border-white/10 rounded-xl md:rounded-2xl p-3 md:p-6 text-center min-h-[100px]" style={{backgroundColor: 'rgba(88, 28, 135, 0.3)', borderColor: 'rgba(255, 255, 255, 0.1)', display: 'block'}}>
            <div className="flex items-center justify-center gap-1 md:gap-2 mb-1 md:mb-2">
              <BarChart3 className="w-4 h-4 md:w-5 md:h-5 text-purple-400" style={{color: '#C084FC', display: 'block'}} />
              <span className="text-white/60 text-xs md:text-sm font-semibold uppercase tracking-wider" style={{color: 'rgba(255, 255, 255, 0.6)', display: 'inline-block'}}>Games</span>
            </div>
            <p className="text-2xl md:text-4xl font-bold text-white" style={{color: '#FFFFFF', display: 'block'}}>{stats.totalGames}</p>
          </div>

          <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 backdrop-blur-md border border-white/10 rounded-xl md:rounded-2xl p-3 md:p-6 text-center min-h-[100px]" style={{backgroundColor: 'rgba(30, 58, 138, 0.3)', borderColor: 'rgba(255, 255, 255, 0.1)', display: 'block'}}>
            <div className="flex items-center justify-center gap-1 md:gap-2 mb-1 md:mb-2">
              <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-cyan-400" style={{color: '#22D3EE', display: 'block'}} />
              <span className="text-white/60 text-xs md:text-sm font-semibold uppercase tracking-wider" style={{color: 'rgba(255, 255, 255, 0.6)', display: 'inline-block'}}>Points</span>
            </div>
            <p className="text-2xl md:text-4xl font-bold text-white" style={{color: '#FFFFFF', display: 'block'}}>{stats.totalScore.toLocaleString()}</p>
          </div>

          <div className="bg-gradient-to-br from-orange-900/30 to-amber-900/30 backdrop-blur-md border border-white/10 rounded-xl md:rounded-2xl p-3 md:p-6 text-center min-h-[100px]" style={{backgroundColor: 'rgba(124, 45, 18, 0.3)', borderColor: 'rgba(255, 255, 255, 0.1)', display: 'block'}}>
            <div className="flex items-center justify-center gap-1 md:gap-2 mb-1 md:mb-2">
              <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-amber-400" style={{color: '#FBBF24', display: 'block'}} />
              <span className="text-white/60 text-xs md:text-sm font-semibold uppercase tracking-wider" style={{color: 'rgba(255, 255, 255, 0.6)', display: 'inline-block'}}>Average</span>
            </div>
            <p className="text-2xl md:text-4xl font-bold text-white" style={{color: '#FFFFFF', display: 'block'}}>{stats.avgScore}</p>
          </div>

          <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 backdrop-blur-md border border-white/10 rounded-xl md:rounded-2xl p-3 md:p-6 text-center col-span-2 md:col-span-1 min-h-[100px]" style={{backgroundColor: 'rgba(20, 83, 45, 0.3)', borderColor: 'rgba(255, 255, 255, 0.1)', display: 'block', gridColumn: 'span 2'}}>
            <div className="flex items-center justify-center gap-1 md:gap-2 mb-1 md:mb-2">
              <Crown className="w-4 h-4 md:w-5 md:h-5 text-yellow-400" style={{color: '#FBBF24', display: 'block'}} />
              <span className="text-white/60 text-xs md:text-sm font-semibold uppercase tracking-wider" style={{color: 'rgba(255, 255, 255, 0.6)', display: 'inline-block'}}>Top Game</span>
            </div>
            <p className="text-xl md:text-2xl font-bold text-white flex items-center justify-center gap-2" style={{color: '#FFFFFF', display: 'flex'}}>
              {stats.topGame ? (
                <>
                  <span style={{display: 'inline-block'}}>{stats.topGame.emoji}</span>
                  <span className="text-base md:text-xl truncate max-w-[150px]" style={{color: '#FFFFFF', display: 'inline-block'}}>{stats.topGame.name}</span>
                </>
              ) : (
                <span className="text-sm md:text-lg text-white/40" style={{color: 'rgba(255, 255, 255, 0.4)', display: 'inline-block'}}>Play a game!</span>
              )}
            </p>
          </div>
        </div>

        {/* Recent Activity Section */}
        {lastPlayedGames.length > 0 && (
          <div className="mb-6 md:mb-8 bg-gradient-to-r from-cyan-900/20 to-blue-900/20 backdrop-blur-md border border-cyan-500/20 rounded-xl md:rounded-2xl p-4 md:p-6" style={{backgroundColor: 'rgba(22, 78, 99, 0.2)', borderColor: 'rgba(6, 182, 212, 0.2)', display: 'block', width: '100%'}}>
            <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4" style={{display: 'flex', alignItems: 'center'}}>
              <div className="w-2 h-2 md:w-3 md:h-3 bg-cyan-400 rounded-full animate-pulse" style={{width: '0.5rem', height: '0.5rem', backgroundColor: '#22D3EE', borderRadius: '9999px', display: 'block'}}></div>
              <h2 className="text-xl md:text-2xl font-bold text-white" style={{color: '#FFFFFF', display: 'block'}}>Recent Activity</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4" style={{display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem', width: '100%'}}>
              {lastPlayedGames.slice(0, 3).map((game) => {
                const gameConfig = gameConfigs.find(g => g.id === game.gameId);
                if (!gameConfig) return null;
                
                return (
                  <div 
                    key={game.gameId} 
                    className="bg-black/30 backdrop-blur border border-white/10 rounded-lg md:rounded-xl p-3 md:p-4 hover:border-cyan-500/30 transition-all"
                    style={{backgroundColor: 'rgba(0, 0, 0, 0.3)', borderColor: 'rgba(255, 255, 255, 0.1)', display: 'block', width: '100%'}}
                  >
                    <div className="flex items-center justify-between mb-2" style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
                      <div className="flex items-center gap-2" style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                        <span className="text-xl md:text-2xl" style={{display: 'inline-block', fontSize: '1.25rem'}}>{gameConfig.emoji}</span>
                        <span className="text-white font-semibold text-sm md:text-base truncate" style={{color: '#FFFFFF', display: 'inline-block'}}>{gameConfig.name}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between" style={{display: 'flex', justifyContent: 'space-between'}}>
                      <div>
                        <p className="text-white/60 text-xs" style={{color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.75rem', display: 'block'}}>Score</p>
                        <p className="text-white text-lg md:text-xl font-bold" style={{color: '#FFFFFF', display: 'block'}}>{game.score.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white/60 text-xs" style={{color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.75rem', display: 'block'}}>Time</p>
                        <p className="text-cyan-300 text-xs md:text-sm" style={{color: '#67E8F9', display: 'block'}}>
                          {new Date(game.playedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex justify-center mb-6 relative z-10" style={{position: 'relative', zIndex: 10, display: 'flex', justifyContent: 'center', width: '100%'}}>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-1 inline-flex" style={{backgroundColor: 'rgba(255, 255, 255, 0.1)', borderColor: 'rgba(255, 255, 255, 0.2)', display: 'inline-flex'}}>
            <button
              onClick={() => setViewMode('all')}
              className={`flex items-center gap-2 px-3 md:px-4 py-3 rounded-lg transition-all duration-300 touch-manipulation cursor-pointer ${
                viewMode === 'all' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' : 'text-white/60 hover:text-white active:bg-white/10'
              }`}
              style={{ minHeight: '44px', touchAction: 'manipulation', display: 'flex', alignItems: 'center', gap: '0.5rem', color: viewMode === 'all' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.6)', backgroundColor: viewMode === 'all' ? '#A855F7' : 'transparent' }}
            >
              <Users className="w-4 h-4" style={{display: 'block'}} />
              <span className="font-medium text-sm md:text-base" style={{display: 'inline-block'}}>All Players</span>
            </button>
            <button
              onClick={() => setViewMode('myScores')}
              className={`flex items-center gap-2 px-3 md:px-4 py-3 rounded-lg transition-all duration-300 touch-manipulation cursor-pointer ${
                viewMode === 'myScores' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' : 'text-white/60 hover:text-white active:bg-white/10'
              }`}
              style={{ minHeight: '44px', touchAction: 'manipulation', display: 'flex', alignItems: 'center', gap: '0.5rem', color: viewMode === 'myScores' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.6)', backgroundColor: viewMode === 'myScores' ? '#A855F7' : 'transparent' }}
            >
              <User className="w-4 h-4" style={{display: 'block'}} />
              <span className="font-medium text-sm md:text-base" style={{display: 'inline-block'}}>My Scores</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 mb-6 relative z-10" style={{position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%', '@media (min-width: 640px)': {flexDirection: 'row'}}}>
          <div className="flex items-center gap-2 flex-1 sm:flex-initial" style={{display: 'flex', alignItems: 'center', gap: '0.5rem', flex: '1', width: '100%'}}>
            <Filter className="w-5 h-5 text-white/60 flex-shrink-0" style={{color: 'rgba(255, 255, 255, 0.6)', display: 'block', flexShrink: 0}} />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-3 md:px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 flex-1 sm:flex-initial cursor-pointer"
              style={{ minHeight: '44px', fontSize: '16px', touchAction: 'manipulation', backgroundColor: 'rgba(255, 255, 255, 0.15)', color: '#FFFFFF', borderColor: 'rgba(255, 255, 255, 0.2)', display: 'block', flex: 1, width: '100%' }}
            >
              <option value="all" style={{backgroundColor: '#1a1a2e', color: '#FFFFFF'}}>All Games</option>
              <option value="classic" style={{backgroundColor: '#1a1a2e', color: '#FFFFFF'}}>Classic</option>
              <option value="puzzle" style={{backgroundColor: '#1a1a2e', color: '#FFFFFF'}}>Puzzle</option>
              <option value="reaction" style={{backgroundColor: '#1a1a2e', color: '#FFFFFF'}}>Reaction</option>
              <option value="luck" style={{backgroundColor: '#1a1a2e', color: '#FFFFFF'}}>Luck</option>
            </select>
          </div>

          <div className="flex items-center gap-2 flex-1 sm:flex-initial" style={{display: 'flex', alignItems: 'center', gap: '0.5rem', flex: '1', width: '100%'}}>
            <ArrowUpDown className="w-5 h-5 text-white/60 flex-shrink-0" style={{color: 'rgba(255, 255, 255, 0.6)', display: 'block', flexShrink: 0}} />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-3 md:px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 flex-1 sm:flex-initial cursor-pointer"
              style={{ minHeight: '44px', fontSize: '16px', touchAction: 'manipulation', backgroundColor: 'rgba(255, 255, 255, 0.15)', color: '#FFFFFF', borderColor: 'rgba(255, 255, 255, 0.2)', display: 'block', flex: 1, width: '100%' }}
            >
              <option value="score" style={{backgroundColor: '#1a1a2e', color: '#FFFFFF'}}>Sort by Score</option>
              <option value="name" style={{backgroundColor: '#1a1a2e', color: '#FFFFFF'}}>Sort by Name</option>
            </select>
          </div>
        </div>

        {filteredAndSortedScores.length > 0 ? (
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl md:rounded-2xl overflow-hidden" style={{backgroundColor: 'rgba(255, 255, 255, 0.05)', borderColor: 'rgba(255, 255, 255, 0.1)', display: 'block', width: '100%', marginBottom: '1.5rem'}}>
            <div className="hidden md:grid md:grid-cols-12 gap-4 bg-white/10 px-6 py-4 border-b border-white/10">
              <div className="col-span-1 text-white/60 text-sm font-semibold uppercase tracking-wider">Rank</div>
              <div className="col-span-4 text-white/60 text-sm font-semibold uppercase tracking-wider">Game</div>
              <div className="col-span-2 text-white/60 text-sm font-semibold uppercase tracking-wider">Player</div>
              <div className="col-span-2 text-white/60 text-sm font-semibold uppercase tracking-wider">Category</div>
              <div className="col-span-3 text-right text-white/60 text-sm font-semibold uppercase tracking-wider">Best Score</div>
            </div>

            <div className="divide-y divide-white/5">
              {filteredAndSortedScores.map((game, index) => {
                const isCurrentUser = game.userId === currentUserId;
                const isLastPlayed = game.lastPlayed && 
                  lastPlayedGames.some(lp => lp.gameId === game.id && 
                    Math.abs(new Date(lp.playedAt) - new Date(game.lastPlayed.playedAt)) < 1000);
                return (
                <div
                  key={`${game.id}-${game.userId}`}
                  className={`grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-3 md:px-6 py-3 md:py-4 transition-colors group relative touch-manipulation cursor-default ${
                    isLastPlayed 
                      ? 'bg-cyan-500/10 hover:bg-cyan-500/15 border-l-4 border-cyan-500'
                      : isCurrentUser 
                        ? 'bg-purple-500/10 hover:bg-purple-500/15 border-l-4 border-purple-500' 
                        : 'hover:bg-white/5'
                  }`}
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  <div className="hidden md:flex md:col-span-1 items-center">
                    <div className="flex items-center gap-2">
                      {getRankIcon(index)}
                      <span className="text-white/80 font-semibold">#{index + 1}</span>
                    </div>
                  </div>

                  <div className="md:col-span-4 flex items-center gap-3">
                    <div className="md:hidden flex items-center gap-2">
                      {getRankIcon(index)}
                      <span className="text-white/80 font-semibold text-sm">#{index + 1}</span>
                    </div>
                    
                    <div className="relative group/icon">
                      <div className={`absolute -inset-1 bg-gradient-to-r ${game.gradient} rounded-lg md:rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity`}></div>
                      <div className="relative bg-black/50 backdrop-blur-sm border border-white/10 rounded-lg md:rounded-xl p-1.5 md:p-2 flex items-center justify-center">
                        <span className="text-xl md:text-2xl">{game.emoji}</span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-white font-semibold text-base md:text-lg truncate">{game.name}</h3>
                        {/* Mobile Edit Button - Show next to game name */}
                        {isCurrentUser && (
                          <button
                            onClick={() => handleEditUsername(game.userId, game.username)}
                            className="md:hidden p-1.5 hover:bg-white/20 rounded transition-colors opacity-70 hover:opacity-100 flex-shrink-0"
                            style={{padding: '0.375rem', borderRadius: '0.25rem', opacity: 0.7}}
                            title="Edit username"
                          >
                            <Pencil className="w-3.5 h-3.5 text-purple-300" style={{width: '0.875rem', height: '0.875rem', color: '#D8B4FE'}} />
                          </button>
                        )}
                      </div>
                      <div className="md:hidden flex items-center gap-2 mt-1 flex-wrap">
                        {/* Mobile Username Display */}
                        {editingUserId === game.userId ? (
                          <div className="flex items-center gap-1.5 w-full">
                            <input
                              type="text"
                              value={editingUsername}
                              onChange={(e) => setEditingUsername(e.target.value)}
                              onKeyDown={(e) => handleKeyPress(e, game.userId)}
                              onBlur={() => handleSaveUsername(game.userId)}
                              autoFocus
                              className="bg-white/20 border border-white/30 rounded px-2 py-1 text-xs font-medium text-white focus:outline-none focus:ring-2 focus:ring-purple-500 flex-1"
                              style={{
                                fontSize: '0.75rem',
                                fontWeight: '500',
                                color: '#FFFFFF',
                                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                borderColor: 'rgba(255, 255, 255, 0.3)',
                                padding: '0.25rem 0.5rem',
                                borderRadius: '0.25rem',
                                minWidth: '120px'
                              }}
                            />
                            <button
                              onClick={() => handleSaveUsername(game.userId)}
                              className="p-1 hover:bg-white/20 rounded transition-colors"
                              style={{padding: '0.25rem', borderRadius: '0.25rem'}}
                            >
                              <Check className="w-3.5 h-3.5 text-green-400" style={{width: '0.875rem', height: '0.875rem', color: '#4ADE80'}} />
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-purple-300 font-medium">
                            {game.username}
                          </span>
                        )}
                        <span className={`inline-block text-xs px-2 py-0.5 rounded-full border ${getCategoryColor(game.category)}`}>
                          {game.category}
                        </span>
                        {isLastPlayed && (
                          <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-cyan-500/30 text-cyan-300 border border-cyan-500/50 flex items-center gap-1">
                            <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse"></div>
                            Last Played
                          </span>
                        )}
                        {isCurrentUser && !isLastPlayed && (
                          <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-purple-500/30 text-purple-300 border border-purple-500/50">
                            You
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-2 hidden md:flex items-center gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isCurrentUser ? 'bg-gradient-to-br from-purple-500 to-pink-500' : 'bg-gradient-to-br from-gray-600 to-gray-700'
                      }`}>
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        {editingUserId === game.userId ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={editingUsername}
                              onChange={(e) => setEditingUsername(e.target.value)}
                              onKeyDown={(e) => handleKeyPress(e, game.userId)}
                              onBlur={() => handleSaveUsername(game.userId)}
                              autoFocus
                              className="bg-white/20 border border-white/30 rounded px-2 py-1 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                              style={{
                                fontSize: '0.875rem',
                                fontWeight: '500',
                                color: '#FFFFFF',
                                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                borderColor: 'rgba(255, 255, 255, 0.3)',
                                padding: '0.25rem 0.5rem',
                                borderRadius: '0.25rem',
                                maxWidth: '120px'
                              }}
                            />
                            <button
                              onClick={() => handleSaveUsername(game.userId)}
                              className="p-1 hover:bg-white/20 rounded transition-colors"
                              style={{padding: '0.25rem', borderRadius: '0.25rem'}}
                            >
                              <Check className="w-4 h-4 text-green-400" style={{width: '1rem', height: '1rem', color: '#4ADE80'}} />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <div className="min-w-0">
                              <p className={`font-medium truncate ${isCurrentUser ? 'text-purple-300' : 'text-white/80'}`}>
                                {game.username || 'Player'}
                              </p>
                              {isCurrentUser && (
                                <p className="text-xs text-purple-400">You</p>
                              )}
                            </div>
                            {isCurrentUser && (
                              <button
                                onClick={() => handleEditUsername(game.userId, game.username)}
                                className="p-1 hover:bg-white/20 rounded transition-colors opacity-70 hover:opacity-100"
                                style={{padding: '0.25rem', borderRadius: '0.25rem', opacity: 0.7}}
                                title="Edit username"
                              >
                                <Pencil className="w-3.5 h-3.5 text-purple-300" style={{width: '0.875rem', height: '0.875rem', color: '#D8B4FE'}} />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="hidden md:flex md:col-span-2 items-center">
                    <span className={`text-sm px-3 py-1 rounded-full border ${getCategoryColor(game.category)}`}>
                      {game.category}
                    </span>
                  </div>

                  <div className="md:col-span-3 flex items-center justify-between md:justify-end">
                    <span className="md:hidden text-white/60 text-sm">Score:</span>
                    <div className="flex items-center gap-2">
                      <div className={`hidden md:block absolute -inset-y-2 right-0 w-32 bg-gradient-to-l ${game.gradient} opacity-0 group-hover:opacity-10 blur-xl transition-opacity`}></div>
                      <span className="relative text-xl md:text-2xl lg:text-3xl font-bold text-white">
                        {game.score.toLocaleString()}
                      </span>
                      {index < 3 && (
                        <div className={`hidden md:flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r ${game.gradient} animate-pulse`}>
                          <Sparkles className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {isLastPlayed && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 hidden md:block">
                      <div className="bg-cyan-500/20 backdrop-blur-sm border border-cyan-500/50 rounded-full px-3 py-1 flex items-center gap-1.5">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                        <span className="text-xs font-semibold text-cyan-300">LAST PLAYED</span>
                      </div>
                    </div>
                  )}
                  {isCurrentUser && !isLastPlayed && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 hidden md:block">
                      <div className="bg-purple-500/20 backdrop-blur-sm border border-purple-500/50 rounded-full px-3 py-1">
                        <span className="text-xs font-semibold text-purple-300">YOU</span>
                      </div>
                    </div>
                  )}
                </div>
              )})}
            </div>
          </div>
        ) : (
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl md:rounded-2xl p-8 md:p-12 text-center">
            <div className="flex flex-col items-center gap-3 md:gap-4">
              <Trophy className="w-12 h-12 md:w-16 md:h-16 text-white/20" />
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2">No Scores Yet</h3>
                <p className="text-white/60 text-sm md:text-base">
                  {filterCategory === 'all' ? "Start playing games to see your scores here!" : `No games played in the ${filterCategory} category yet.`}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 md:mt-8 text-center space-y-2">
          <p className="text-white/40 text-xs md:text-sm px-4">
            {viewMode === 'all' ? 'Showing scores from all players • Your scores are highlighted in purple' : 'Showing only your personal best scores'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
