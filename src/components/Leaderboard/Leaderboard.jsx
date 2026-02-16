import React, { useState, useEffect, useMemo } from 'react';
import { Trophy, Medal, Award, TrendingUp, BarChart3, Sparkles, Crown, Star, Filter, ArrowUpDown, User, Users } from 'lucide-react';

const Leaderboard = () => {
  const [scores, setScores] = useState([]);
  const [sortBy, setSortBy] = useState('score');
  const [filterCategory, setFilterCategory] = useState('all');
  const [viewMode, setViewMode] = useState('all');
  const [currentUserId, setCurrentUserId] = useState('guest_user');
  const [lastPlayedGames, setLastPlayedGames] = useState([]);

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
  }, []);

  useEffect(() => {
    const currentUserScores = gameConfigs.map(game => {
      const score = localStorage.getItem(game.storageKey);
      const userId = localStorage.getItem('userId') || 'guest_user';
      const username = localStorage.getItem('username') || 'Guest';
      
      // Check for last played score
      const lastPlayedKey = game.storageKey.replace('-best', '-last-played').replace('-high-score', '-last-played');
      const lastPlayedData = localStorage.getItem(lastPlayedKey);
      let lastPlayed = null;
      if (lastPlayedData) {
        try {
          lastPlayed = JSON.parse(lastPlayedData);
        } catch (e) {
          console.error('Error parsing last played data:', e);
        }
      }
      
      return {
        ...game,
        score: score ? parseInt(score) || 0 : 0,
        userId: userId,
        username: username,
        hasPlayed: score !== null,
        playedAt: score ? new Date().toISOString() : null,
        lastPlayed: lastPlayed
      };
    }).filter(game => game.hasPlayed);
    
    // Track last played games
    const recentPlayed = currentUserScores
      .filter(game => game.lastPlayed)
      .sort((a, b) => new Date(b.lastPlayed.playedAt) - new Date(a.lastPlayed.playedAt))
      .slice(0, 5)
      .map(game => ({ gameId: game.id, ...game.lastPlayed }));
    
    setLastPlayedGames(recentPlayed);
    setScores(currentUserScores);
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

  return (
    <div className="min-h-screen bg-[#050414] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center mt-20 justify-center gap-3 mb-4">
            <Trophy className="w-10 h-10 text-yellow-400" />
            <h1 className="text-4xl md:text-6xl font-bold text-white">Leaderboard</h1>
            <Trophy className="w-10 h-10 text-yellow-400" />
          </div>
          <p className="text-white/60 text-lg">Track your best scores across all games</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-md border border-white/10 rounded-2xl p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <BarChart3 className="w-5 h-5 text-purple-400" />
              <span className="text-white/60 text-sm font-semibold uppercase tracking-wider">Games Played</span>
            </div>
            <p className="text-4xl font-bold text-white">{stats.totalGames}</p>
          </div>

          <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 backdrop-blur-md border border-white/10 rounded-2xl p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              <span className="text-white/60 text-sm font-semibold uppercase tracking-wider">Total Points</span>
            </div>
            <p className="text-4xl font-bold text-white">{stats.totalScore.toLocaleString()}</p>
          </div>

          <div className="bg-gradient-to-br from-orange-900/30 to-amber-900/30 backdrop-blur-md border border-white/10 rounded-2xl p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span className="text-white/60 text-sm font-semibold uppercase tracking-wider">Average Score</span>
            </div>
            <p className="text-4xl font-bold text-white">{stats.avgScore}</p>
          </div>

          <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 backdrop-blur-md border border-white/10 rounded-2xl p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Crown className="w-5 h-5 text-yellow-400" />
              <span className="text-white/60 text-sm font-semibold uppercase tracking-wider">Top Game</span>
            </div>
            <p className="text-2xl font-bold text-white flex items-center justify-center gap-2">
              {stats.topGame ? (
                <>
                  <span>{stats.topGame.emoji}</span>
                  <span className="text-xl">{stats.topGame.name}</span>
                </>
              ) : (
                <span className="text-lg text-white/40">Play a game!</span>
              )}
            </p>
          </div>
        </div>

        {/* Recent Activity Section */}
        {lastPlayedGames.length > 0 && (
          <div className="mb-8 bg-gradient-to-r from-cyan-900/20 to-blue-900/20 backdrop-blur-md border border-cyan-500/20 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
              <h2 className="text-2xl font-bold text-white">Recent Activity</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {lastPlayedGames.slice(0, 3).map((game) => {
                const gameConfig = gameConfigs.find(g => g.id === game.gameId);
                if (!gameConfig) return null;
                
                return (
                  <div 
                    key={game.gameId} 
                    className="bg-black/30 backdrop-blur border border-white/10 rounded-xl p-4 hover:border-cyan-500/30 transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{gameConfig.emoji}</span>
                        <span className="text-white font-semibold">{gameConfig.name}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/60 text-xs">Score</p>
                        <p className="text-white text-xl font-bold">{game.score.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white/60 text-xs">Time</p>
                        <p className="text-cyan-300 text-sm">
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

        <div className="flex justify-center mb-6">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-1 inline-flex">
            <button
              onClick={() => setViewMode('all')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                viewMode === 'all' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' : 'text-white/60 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              <span className="font-medium">All Players</span>
            </button>
            <button
              onClick={() => setViewMode('myScores')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                viewMode === 'myScores' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' : 'text-white/60 hover:text-white'
              }`}
            >
              <User className="w-4 h-4" />
              <span className="font-medium">My Scores</span>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-white/60" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Games</option>
              <option value="classic">Classic</option>
              <option value="puzzle">Puzzle</option>
              <option value="reaction">Reaction</option>
              <option value="luck">Luck</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-5 h-5 text-white/60" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="score">Sort by Score</option>
              <option value="name">Sort by Name</option>
            </select>
          </div>
        </div>

        {filteredAndSortedScores.length > 0 ? (
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden">
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
                  className={`grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-4 md:px-6 py-4 transition-colors group relative ${
                    isLastPlayed 
                      ? 'bg-cyan-500/10 hover:bg-cyan-500/15 border-l-4 border-cyan-500'
                      : isCurrentUser 
                        ? 'bg-purple-500/10 hover:bg-purple-500/15 border-l-4 border-purple-500' 
                        : 'hover:bg-white/5'
                  }`}
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
                      <div className={`absolute -inset-1 bg-gradient-to-r ${game.gradient} rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity`}></div>
                      <div className="relative bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl p-2 flex items-center justify-center">
                        <span className="text-2xl">{game.emoji}</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg">{game.name}</h3>
                      <div className="md:hidden flex items-center gap-2 mt-1">
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

                  <div className="md:col-span-2 flex items-center gap-2">
                    <div className="hidden md:flex items-center gap-2 min-w-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isCurrentUser ? 'bg-gradient-to-br from-purple-500 to-pink-500' : 'bg-gradient-to-br from-gray-600 to-gray-700'
                      }`}>
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div className="min-w-0">
                        <p className={`font-medium truncate ${isCurrentUser ? 'text-purple-300' : 'text-white/80'}`}>
                          {game.username || 'Player'}
                        </p>
                        {isCurrentUser && (
                          <p className="text-xs text-purple-400">You</p>
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
                    <span className="md:hidden text-white/60 text-sm">Best Score:</span>
                    <div className="flex items-center gap-2">
                      <div className={`hidden md:block absolute -inset-y-2 right-0 w-32 bg-gradient-to-l ${game.gradient} opacity-0 group-hover:opacity-10 blur-xl transition-opacity`}></div>
                      <span className="relative text-2xl md:text-3xl font-bold text-white">
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
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <Trophy className="w-16 h-16 text-white/20" />
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">No Scores Yet</h3>
                <p className="text-white/60">
                  {filterCategory === 'all' ? "Start playing games to see your scores here!" : `No games played in the ${filterCategory} category yet.`}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 text-center space-y-2">
          <p className="text-white/40 text-sm">
            {viewMode === 'all' ? 'Showing scores from all players • Your scores are highlighted in purple' : 'Showing only your personal best scores'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
