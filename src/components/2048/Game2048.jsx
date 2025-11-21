import React, { useState, useEffect, useCallback } from 'react';

const Game2048 = ({ embedded = false }) => {
  const [grid, setGrid] = useState([]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [tiles, setTiles] = useState([]);

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
      }

      // Check game over
      if (isGameOver(newGrid)) {
        setGameOver(true);
      }
    }
  }, [grid, score, gameOver, won, bestScore]);

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
  }, [move]);

  // Touch controls
  useEffect(() => {
    let touchStartX = 0;
    let touchStartY = 0;

    const handleTouchStart = (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e) => {
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
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [move]);

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
    ? 'relative flex flex-col bg-black/50 border border-white/10 rounded-2xl p-2 sm:p-2.5 gap-1.5 h-full'
    : 'w-full max-w-lg';
  const headerClass = embedded ? 'text-center mb-1' : 'text-center mb-6';
  const titleClass = embedded ? 'text-xl font-bold text-white mb-0.5' : 'text-6xl font-bold text-gray-800 mb-2';
  const subtitleClass = embedded ? 'text-[10px] text-white/70' : 'text-gray-600';
  const scoreboardClass = embedded
    ? 'flex items-center justify-between mb-1.5 text-white'
    : 'flex justify-between items-center mb-4';
  const scoreGroupClass = embedded ? 'flex gap-1.5' : 'flex gap-3';
  const scoreBoxClass = embedded
    ? 'bg-white/10 backdrop-blur px-2 py-1 rounded-lg shadow-sm text-white text-left'
    : 'bg-orange-400 text-white px-6 py-3 rounded-lg shadow-md text-left';
  const bestBoxClass = embedded
    ? 'bg-white/10 backdrop-blur px-2 py-1 rounded-lg shadow-sm text-white text-left'
    : 'bg-orange-500 text-white px-6 py-3 rounded-lg shadow-md text-left';
  const scoreLabelClass = embedded
    ? 'text-[8px] font-semibold uppercase tracking-[0.2em] text-white/70'
    : 'text-xs font-semibold uppercase';
  const scoreValueClass = embedded ? 'text-sm font-bold mt-0.5' : 'text-2xl font-bold';
  const newGameButtonClass = embedded
    ? 'bg-orange-500 text-white px-2.5 py-1 rounded-lg font-semibold hover:bg-orange-600 transition-colors text-[10px]'
    : 'bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors shadow-md';
  const gridWrapperClass = embedded
    ? 'relative flex-1 flex items-center justify-center overflow-hidden min-h-0 p-2'
    : 'relative bg-gradient-to-br from-amber-800 to-orange-800 rounded-2xl p-4 shadow-2xl';
  const backgroundGridClass = embedded ? 'grid grid-cols-4 gap-2 w-full max-w-[280px]' : 'grid grid-cols-4 gap-4';
  const backgroundCellClass = embedded
    ? 'bg-white/10 rounded-md aspect-square shadow-inner'
    : 'bg-amber-900 bg-opacity-40 rounded-xl aspect-square shadow-inner';
  const tilesLayerClass = embedded
    ? 'absolute inset-0 grid grid-cols-4 grid-rows-4 gap-2 pointer-events-none'
    : 'absolute inset-4 grid grid-cols-4 grid-rows-4 gap-4 pointer-events-none';
  const instructionsClass = embedded
    ? 'text-center mt-2 text-white/70 text-xs'
    : 'text-center mt-4 text-gray-600 text-sm';
  const overlayContainerClass = embedded
    ? 'absolute inset-0 bg-black/80 backdrop-blur flex items-center justify-center z-20'
    : 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
  const overlayPanelClass = embedded
    ? 'bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-4 text-center max-w-xs text-white'
    : 'bg-white rounded-2xl p-8 shadow-2xl text-center max-w-sm mx-4';
  const overlayTitleClass = embedded ? 'text-2xl font-bold mb-3 text-white' : 'text-4xl font-bold mb-4';
  const overlayScoreClass = embedded ? 'text-lg mb-2 text-white' : 'text-2xl text-gray-700 mb-2';
  const overlayBestClass = embedded ? 'text-sm mb-4 text-white/80' : 'text-lg text-gray-600 mb-6';
  const overlayButtonClass = embedded
    ? 'bg-orange-500 text-white px-5 py-2 rounded-lg font-semibold hover:bg-orange-600 transition-colors text-sm'
    : 'bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors';

  return (
    <div className={containerClass}>
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
            className={newGameButtonClass}
          >
            New Game
          </button>
        </div>

        {/* Game Grid */}
        <div className={gridWrapperClass}>
          {/* Background Grid */}
          <div className="relative w-full max-w-[280px] mx-auto">
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
                  ? embedded ? '1.1rem' : '1.75rem'
                  : tile.value >= 128
                    ? embedded ? '1.3rem' : '2rem'
                    : embedded ? '1.5rem' : '2.5rem';

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
        {(gameOver || won) && (
          <div className={overlayContainerClass}>
            <div className={overlayPanelClass}>
              <h2 className={overlayTitleClass}>
                {won ? '🎉 You Won!' : 'Game Over!'}
              </h2>
              <p className={overlayScoreClass}>Score: {score}</p>
              <p className={overlayBestClass}>Best: {bestScore}</p>
              <button
                onClick={initializeGame}
                className={overlayButtonClass}
              >
                Try Again
              </button>
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