import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { GAME_IDS } from '../../config/gamesConfig';

const API_URL = 'http://localhost:3000/api/scores';

const Game2048 = ({ embedded = false }) => {
  const { user } = useAuth();
  const [grid, setGrid] = useState([]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [tiles, setTiles] = useState([]);
  const [isPlaying, setIsPlaying] = useState(!embedded); // Auto-play only in non-embedded mode

  // Submit score to MongoDB backend
  const submitScore = useCallback(async (finalScore) => {
    try {
      const userId = user?.uid || localStorage.getItem('userId') || `guest_${Date.now()}`;
      const username = user?.displayName || localStorage.getItem('username') || `Player${Math.floor(Math.random() * 9999)}`;

      // Persist guest identity for consistent tracking
      if (!user) {
        if (!localStorage.getItem('userId')) localStorage.setItem('userId', userId);
        if (!localStorage.getItem('username')) localStorage.setItem('username', username);
      }

      // Store last played score for leaderboard highlighting
      const lastPlayedData = {
        score: finalScore,
        userId,
        username,
        playedAt: new Date().toISOString(),
        gameId: GAME_IDS.GAME_2048,
        gameName: '2048'
      };
      localStorage.setItem('2048-last-played', JSON.stringify(lastPlayedData));

      const { data } = await axios.post(API_URL, {
        userId,
        username,
        gameId: GAME_IDS.GAME_2048,
        gameName: '2048',
        score: finalScore,
        playedAt: new Date().toISOString(),
      });

      if (data.success) {
        console.log('Score submitted successfully:', data.message || 'OK');
      } else {
        console.error('Score submission failed:', data.message);
      }
    } catch (error) {
      console.error('Error submitting score:', error);
    }
  }, [user]);

  // Initialize game
  const initializeGame = useCallback(() => {
    const newGrid = Array(4).fill(null).map(() => Array(4).fill(0));
    const newTiles = [];
    
    // Add two random tiles
    addRandomTile(newGrid, newTiles);
    addRandomTile(newGrid, newTiles);
    
    setGrid(newGrid);
    setTiles(newTiles);
    setScore(0);
    setGameOver(false);
    setWon(false);
  }, []);

  useEffect(() => {
    initializeGame();
    const saved = localStorage.getItem('2048-best');
    if (saved) setBestScore(parseInt(saved));
  }, [initializeGame]);

  // Add random tile
  const addRandomTile = (currentGrid, currentTiles) => {
    const emptyCells = [];
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (currentGrid[r][c] === 0) {
          emptyCells.push({ r, c });
        }
      }
    }
    
    if (emptyCells.length > 0) {
      const { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      const value = Math.random() < 0.9 ? 2 : 4;
      currentGrid[r][c] = value;
      currentTiles.push({
        id: Date.now() + Math.random(),
        value,
        row: r,
        col: c,
        isNew: true,
        merged: false
      });
    }
  };

  // Move tiles
  const move = useCallback((direction) => {
    if (gameOver || won) return;

    const newGrid = grid.map(row => [...row]);
    const newTiles = [];
    let moved = false;
    let newScore = score;
    const mergedPositions = new Set();

    const moveRow = (row, reverse = false) => {
      const filtered = row.filter(x => x !== 0);
      if (reverse) filtered.reverse();
      
      const merged = [];
      let i = 0;
      
      while (i < filtered.length) {
        if (i + 1 < filtered.length && filtered[i] === filtered[i + 1]) {
          merged.push(filtered[i] * 2);
          newScore += filtered[i] * 2;
          i += 2;
        } else {
          merged.push(filtered[i]);
          i++;
        }
      }
      
      while (merged.length < 4) {
        merged.push(0);
      }
      
      if (reverse) merged.reverse();
      return merged;
    };

    if (direction === 'left') {
      for (let r = 0; r < 4; r++) {
        const oldRow = [...newGrid[r]];
        newGrid[r] = moveRow(newGrid[r]);
        if (JSON.stringify(oldRow) !== JSON.stringify(newGrid[r])) moved = true;
      }
    } else if (direction === 'right') {
      for (let r = 0; r < 4; r++) {
        const oldRow = [...newGrid[r]];
        newGrid[r] = moveRow(newGrid[r], true);
        if (JSON.stringify(oldRow) !== JSON.stringify(newGrid[r])) moved = true;
      }
    } else if (direction === 'up') {
      for (let c = 0; c < 4; c++) {
        const column = [newGrid[0][c], newGrid[1][c], newGrid[2][c], newGrid[3][c]];
        const oldColumn = [...column];
        const movedColumn = moveRow(column);
        for (let r = 0; r < 4; r++) {
          newGrid[r][c] = movedColumn[r];
        }
        if (JSON.stringify(oldColumn) !== JSON.stringify(movedColumn)) moved = true;
      }
    } else if (direction === 'down') {
      for (let c = 0; c < 4; c++) {
        const column = [newGrid[0][c], newGrid[1][c], newGrid[2][c], newGrid[3][c]];
        const oldColumn = [...column];
        const movedColumn = moveRow(column, true);
        for (let r = 0; r < 4; r++) {
          newGrid[r][c] = movedColumn[r];
        }
        if (JSON.stringify(oldColumn) !== JSON.stringify(movedColumn)) moved = true;
      }
    }

    if (moved) {
      // Create tiles from new grid
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
          if (newGrid[r][c] !== 0) {
            newTiles.push({
              id: `${r}-${c}-${newGrid[r][c]}`,
              value: newGrid[r][c],
              row: r,
              col: c,
              isNew: false,
              merged: false
            });
          }
        }
      }

      addRandomTile(newGrid, newTiles);
      setGrid(newGrid);
      setTiles(newTiles);
      setScore(newScore);

      if (newScore > bestScore) {
        setBestScore(newScore);
        localStorage.setItem('2048-best', newScore.toString());
      }

      // Check for 2048
      if (newGrid.flat().includes(2048)) {
        setWon(true);
        submitScore(newScore);
      }

      // Check game over
      if (isGameOver(newGrid)) {
        setGameOver(true);
        submitScore(newScore);
      }
    }
  }, [grid, score, gameOver, won, bestScore, submitScore]);

  const isGameOver = (currentGrid) => {
    // Check for empty cells
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (currentGrid[r][c] === 0) return false;
      }
    }

    // Check for possible merges
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const current = currentGrid[r][c];
        if (c < 3 && current === currentGrid[r][c + 1]) return false;
        if (r < 3 && current === currentGrid[r + 1][c]) return false;
      }
    }

    return true;
  };

  // Keyboard controls
  useEffect(() => {
    if (!isPlaying) return; // Don't listen if not playing
    
    const handleKeyDown = (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        const direction = {
          'ArrowUp': 'up',
          'ArrowDown': 'down',
          'ArrowLeft': 'left',
          'ArrowRight': 'right'
        }[e.key];
        move(direction);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [move, isPlaying]);

  // Touch controls - only on game container
  const gameContainerRef = React.useRef(null);
  
  // Prevent page scroll when playing in embedded mode
  useEffect(() => {
    if (!embedded) return;
    
    if (isPlaying) {
      // Prevent body scroll when playing
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      // Restore scroll when not playing
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
    
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [isPlaying, embedded]);
  
  useEffect(() => {
    if (!isPlaying) return; // Don't listen if not playing
    
    let touchStartX = 0;
    let touchStartY = 0;
    let isTouchOnGame = false;

    const handleTouchStart = (e) => {
      // Skip if touching a button - let buttons work normally
      if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
        isTouchOnGame = false;
        return;
      }
      
      // Only respond to touches that start within the game container
      if (gameContainerRef.current && gameContainerRef.current.contains(e.target)) {
        isTouchOnGame = true;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        // Prevent page scroll when touching game
        if (embedded) {
          e.preventDefault();
        }
      } else {
        isTouchOnGame = false;
      }
    };

    const handleTouchMove = (e) => {
      // Prevent scroll while swiping on game
      if (isTouchOnGame && embedded) {
        e.preventDefault();
      }
    };

    const handleTouchEnd = (e) => {
      // Only process if the touch started on the game
      if (!isTouchOnGame) return;
      
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      
      const diffX = touchEndX - touchStartX;
      const diffY = touchEndY - touchStartY;
      
      if (Math.abs(diffX) > Math.abs(diffY)) {
        if (Math.abs(diffX) > 30) {
          move(diffX > 0 ? 'right' : 'left');
        }
      } else {
        if (Math.abs(diffY) > 30) {
          move(diffY > 0 ? 'down' : 'up');
        }
      }
      
      isTouchOnGame = false;
    };

    const container = gameContainerRef.current;
    if (container) {
      container.addEventListener('touchstart', handleTouchStart, { passive: false });
      container.addEventListener('touchmove', handleTouchMove, { passive: false });
      container.addEventListener('touchend', handleTouchEnd, { passive: true });
    }
    
    return () => {
      if (container) {
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchmove', handleTouchMove);
        container.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [move, isPlaying, embedded]);

  // Start game handler
  const handleStartGame = () => {
    setIsPlaying(true);
    initializeGame();
  };

  // Close game handler
  const handleCloseGame = () => {
    setIsPlaying(false);
  };

  const getTileColor = (value) => {
    const colors = {
      2: 'bg-gradient-to-br from-blue-100 to-blue-200 text-gray-800',
      4: 'bg-gradient-to-br from-blue-200 to-blue-300 text-gray-800',
      8: 'bg-gradient-to-br from-orange-400 to-orange-500 text-white',
      16: 'bg-gradient-to-br from-orange-500 to-orange-600 text-white',
      32: 'bg-gradient-to-br from-red-400 to-red-500 text-white',
      64: 'bg-gradient-to-br from-red-500 to-red-600 text-white',
      128: 'bg-gradient-to-br from-yellow-300 to-yellow-400 text-white',
      256: 'bg-gradient-to-br from-yellow-400 to-yellow-500 text-white',
      512: 'bg-gradient-to-br from-yellow-500 to-amber-500 text-white',
      1024: 'bg-gradient-to-br from-amber-400 to-amber-600 text-white',
      2048: 'bg-gradient-to-br from-purple-500 to-pink-500 text-white'
    };
    return colors[value] || 'bg-gradient-to-br from-gray-700 to-gray-900 text-white';
  };

  const containerClass = embedded
    ? 'relative w-full h-full flex flex-col bg-transparent overflow-hidden'
    : 'min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4';
  const panelClass = embedded
    ? 'relative flex flex-col bg-black/50 border border-white/10 rounded-2xl p-2 sm:p-2.5 gap-1 sm:gap-1.5 h-full'
    : 'w-full max-w-lg';
  const headerClass = embedded ? 'text-center mb-0.5 sm:mb-1' : 'text-center mb-6';
  const titleClass = embedded ? 'text-lg sm:text-xl font-bold text-white mb-0.5' : 'text-6xl font-bold text-gray-800 mb-2';
  const subtitleClass = embedded ? 'text-[9px] sm:text-[10px] text-white/70' : 'text-gray-600';
  const scoreboardClass = embedded
    ? 'flex items-center justify-between mb-1 sm:mb-1.5 text-white px-1'
    : 'flex justify-between items-center mb-4';
  const scoreGroupClass = embedded ? 'flex gap-1 sm:gap-1.5' : 'flex gap-3';
  const scoreBoxClass = embedded
    ? 'bg-white/10 backdrop-blur px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg shadow-sm text-white text-left'
    : 'bg-orange-400 text-white px-6 py-3 rounded-lg shadow-md text-left';
  const bestBoxClass = embedded
    ? 'bg-white/10 backdrop-blur px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg shadow-sm text-white text-left'
    : 'bg-orange-500 text-white px-6 py-3 rounded-lg shadow-md text-left';
  const scoreLabelClass = embedded
    ? 'text-[7px] sm:text-[8px] font-semibold uppercase tracking-[0.1em] sm:tracking-[0.2em] text-white/70'
    : 'text-xs font-semibold uppercase';
  const scoreValueClass = embedded ? 'text-xs sm:text-sm font-bold mt-0.5' : 'text-2xl font-bold';
  const newGameButtonClass = embedded
    ? 'bg-orange-500 text-white px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md sm:rounded-lg font-semibold hover:bg-orange-600 transition-colors text-[9px] sm:text-[10px]'
    : 'bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors shadow-md';
  const gridWrapperClass = embedded
    ? 'relative flex-1 flex items-center justify-center overflow-hidden min-h-0 p-1 sm:p-2'
    : 'relative bg-gradient-to-br from-amber-800 to-orange-800 rounded-2xl p-4 shadow-2xl';
  const backgroundGridClass = embedded ? 'grid grid-cols-4 gap-1 sm:gap-2 w-full max-w-[240px] sm:max-w-[280px]' : 'grid grid-cols-4 gap-4';
  const backgroundCellClass = embedded
    ? 'bg-white/10 rounded-md aspect-square shadow-inner'
    : 'bg-amber-900 bg-opacity-40 rounded-xl aspect-square shadow-inner';
  const tilesLayerClass = embedded
    ? 'absolute inset-0 grid grid-cols-4 grid-rows-4 gap-1 sm:gap-2 pointer-events-none'
    : 'absolute inset-4 grid grid-cols-4 grid-rows-4 gap-4 pointer-events-none';
  const instructionsClass = embedded
    ? 'text-center mt-2 text-white/70 text-xs'
    : 'text-center mt-4 text-gray-600 text-sm';
  const overlayContainerClass = embedded
    ? 'absolute inset-0 bg-black/80 backdrop-blur flex items-center justify-center z-20'
    : 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
  const overlayPanelClass = embedded
    ? 'bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center max-w-[280px] sm:max-w-xs text-white mx-2'
    : 'bg-white rounded-2xl p-8 shadow-2xl text-center max-w-sm mx-4';
  const overlayTitleClass = embedded ? 'text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-white' : 'text-4xl font-bold mb-4';
  const overlayScoreClass = embedded ? 'text-base sm:text-lg mb-1 sm:mb-2 text-white' : 'text-2xl text-gray-700 mb-2';
  const overlayBestClass = embedded ? 'text-xs sm:text-sm mb-3 sm:mb-4 text-white/80' : 'text-lg text-gray-600 mb-6';
  const overlayButtonClass = embedded
    ? 'bg-orange-500 text-white px-4 sm:px-5 py-1.5 sm:py-2 rounded-lg font-semibold hover:bg-orange-600 transition-colors text-xs sm:text-sm'
    : 'bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors';

  return (
    <div className={containerClass} ref={gameContainerRef}>
      {/* Play Button Overlay - only in embedded mode when not playing */}
      {embedded && !isPlaying && (
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center z-30 rounded-2xl">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-1 sm:mb-2">2048</h2>
          <p className="text-white/70 text-xs sm:text-sm mb-3 sm:mb-4">Join tiles to reach 2048!</p>
          <button
            onClick={handleStartGame}
            onTouchEnd={(e) => { e.stopPropagation(); handleStartGame(); }}
            className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg flex items-center gap-2 text-sm sm:text-base"
            style={{ touchAction: 'manipulation' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
              <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
            </svg>
            Play
          </button>
        </div>
      )}

      {/* Close Button - only in embedded mode when playing */}
      {embedded && isPlaying && (
        <button
          onClick={handleCloseGame}
          onTouchEnd={(e) => { e.stopPropagation(); handleCloseGame(); }}
          className="absolute top-2 right-2 z-40 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-1.5 rounded-lg transition-all border border-white/20"
          style={{ touchAction: 'manipulation' }}
          title="Close game"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
          </svg>
        </button>
      )}

      <div className={panelClass}>
        {/* Header */}
        <div className={headerClass}>
          <h1 className={titleClass}>2048</h1>
          <p className={subtitleClass}>Join tiles to reach 2048!</p>
        </div>

        {/* Score Board */}
        <div className={scoreboardClass}>
          <div className={scoreGroupClass}>
            <div className={scoreBoxClass}>
              <div className={scoreLabelClass}>Score</div>
              <div className={scoreValueClass}>{score}</div>
            </div>
            <div className={bestBoxClass}>
              <div className={scoreLabelClass}>Best</div>
              <div className={scoreValueClass}>{bestScore}</div>
            </div>
          </div>
          <button
            onClick={initializeGame}
            onTouchEnd={(e) => { e.stopPropagation(); initializeGame(); }}
            className={newGameButtonClass}
            style={{ touchAction: 'manipulation' }}
          >
            New Game
          </button>
        </div>

        {/* Game Grid */}
        <div className={gridWrapperClass}>
          {/* Background Grid */}
          <div className="relative w-full max-w-[240px] sm:max-w-[280px] mx-auto">
            <div className={backgroundGridClass}>
              {Array(16).fill(0).map((_, i) => (
                <div
                  key={i}
                  className={backgroundCellClass}
                />
              ))}
            </div>

            {/* Tiles */}
            <div className={tilesLayerClass}>
              {tiles.map((tile) => {
                const fontSize = tile.value >= 1024
                  ? embedded ? '0.9rem' : '1.75rem'
                  : tile.value >= 128
                    ? embedded ? '1.1rem' : '2rem'
                    : embedded ? '1.25rem' : '2.5rem';

                return (
                  <div
                    key={tile.id}
                    className={`w-full h-full flex items-center justify-center rounded-md font-bold transition-all duration-150 shadow-lg ${getTileColor(tile.value)} ${tile.isNew ? 'animate-pop' : ''}`}
                    style={{
                      gridColumnStart: tile.col + 1,
                      gridRowStart: tile.row + 1,
                      fontSize
                    }}
                  >
                    {tile.value}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mobile Instructions */}
        {!embedded && (
          <div className={instructionsClass}>
            <p className="hidden sm:block">Use arrow keys to move tiles</p>
            <p className="sm:hidden">Swipe to move tiles</p>
          </div>
        )}

        {/* Game Over Overlay */}
        {(gameOver || won) && isPlaying && (
          <div className={overlayContainerClass}>
            <div className={overlayPanelClass}>
              <h2 className={overlayTitleClass}>
                {won ? '🎉 You Won!' : 'Game Over!'}
              </h2>
              <p className={overlayScoreClass}>Score: {score}</p>
              <p className={overlayBestClass}>Best: {bestScore}</p>
              <div className="flex gap-2 justify-center">
                <button
                  onClick={initializeGame}
                  onTouchEnd={(e) => { e.stopPropagation(); initializeGame(); }}
                  className={overlayButtonClass}
                  style={{ touchAction: 'manipulation' }}
                >
                  Try Again
                </button>
                {embedded && (
                  <button
                    onClick={handleCloseGame}
                    onTouchEnd={(e) => { e.stopPropagation(); handleCloseGame(); }}
                    className={`${overlayButtonClass} !bg-white/20 hover:!bg-white/30`}
                    style={{ touchAction: 'manipulation' }}
                  >
                    Close
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes pop {
          0% {
            transform: scale(0);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }
        
        .animate-pop {
          animation: pop 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Game2048;