import React, { useState, useEffect, useCallback } from 'react';
import { RotateCcw, Flag, Bomb } from 'lucide-react';

const GRID_SIZE = 8;
const MINES_COUNT = 10;

const Minesweeper = ({ embedded = false }) => {
  const [grid, setGrid] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [flagsCount, setFlagsCount] = useState(0);
  const [revealedCount, setRevealedCount] = useState(0);
  const [firstClick, setFirstClick] = useState(true);

  const initializeGrid = useCallback((safeX = -1, safeY = -1) => {
    // Create empty grid
    const newGrid = Array(GRID_SIZE).fill(null).map((_, row) =>
      Array(GRID_SIZE).fill(null).map((_, col) => ({
        x: col,
        y: row,
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        neighborMines: 0
      }))
    );

    // Place mines (avoiding safe zone if first click)
    let minesPlaced = 0;
    while (minesPlaced < MINES_COUNT) {
      const x = Math.floor(Math.random() * GRID_SIZE);
      const y = Math.floor(Math.random() * GRID_SIZE);
      
      // Don't place mine on safe zone (3x3 around first click)
      const isSafeZone = Math.abs(x - safeX) <= 1 && Math.abs(y - safeY) <= 1;
      
      if (!newGrid[y][x].isMine && !isSafeZone) {
        newGrid[y][x].isMine = true;
        minesPlaced++;
      }
    }

    // Calculate neighbor mines
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        if (!newGrid[y][x].isMine) {
          let count = 0;
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              const ny = y + dy;
              const nx = x + dx;
              if (ny >= 0 && ny < GRID_SIZE && nx >= 0 && nx < GRID_SIZE && newGrid[ny][nx].isMine) {
                count++;
              }
            }
          }
          newGrid[y][x].neighborMines = count;
        }
      }
    }

    return newGrid;
  }, []);

  const resetGame = useCallback(() => {
    setGrid(initializeGrid());
    setGameOver(false);
    setGameWon(false);
    setFlagsCount(0);
    setRevealedCount(0);
    setFirstClick(true);
  }, [initializeGrid]);

  useEffect(() => {
    resetGame();
  }, [resetGame]);

  const revealCell = useCallback((x, y, currentGrid) => {
    if (x < 0 || x >= GRID_SIZE || y < 0 || y >= GRID_SIZE) return currentGrid;
    if (currentGrid[y][x].isRevealed || currentGrid[y][x].isFlagged) return currentGrid;

    const newGrid = currentGrid.map(row => row.map(cell => ({ ...cell })));
    newGrid[y][x].isRevealed = true;

    if (newGrid[y][x].neighborMines === 0 && !newGrid[y][x].isMine) {
      // Reveal neighbors
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx !== 0 || dy !== 0) {
            const result = revealCell(x + dx, y + dy, newGrid);
            for (let row = 0; row < GRID_SIZE; row++) {
              for (let col = 0; col < GRID_SIZE; col++) {
                newGrid[row][col] = result[row][col];
              }
            }
          }
        }
      }
    }

    return newGrid;
  }, []);

  const handleCellClick = (x, y) => {
    if (gameOver || gameWon || grid[y][x].isFlagged) return;

    let currentGrid = grid;

    // First click - regenerate grid to ensure safe start
    if (firstClick) {
      currentGrid = initializeGrid(x, y);
      setFirstClick(false);
    }

    if (currentGrid[y][x].isMine) {
      // Reveal all mines
      const newGrid = currentGrid.map(row =>
        row.map(cell => ({
          ...cell,
          isRevealed: cell.isMine ? true : cell.isRevealed
        }))
      );
      setGrid(newGrid);
      setGameOver(true);
      return;
    }

    const newGrid = revealCell(x, y, currentGrid);
    setGrid(newGrid);

    // Count revealed cells
    const revealed = newGrid.flat().filter(cell => cell.isRevealed).length;
    setRevealedCount(revealed);

    // Check win condition
    if (revealed === GRID_SIZE * GRID_SIZE - MINES_COUNT) {
      setGameWon(true);
    }
  };

  const handleRightClick = (e, x, y) => {
    e.preventDefault();
    if (gameOver || gameWon || grid[y][x].isRevealed) return;

    const newGrid = grid.map(row => row.map(cell => ({ ...cell })));
    newGrid[y][x].isFlagged = !newGrid[y][x].isFlagged;
    setGrid(newGrid);
    setFlagsCount(prev => newGrid[y][x].isFlagged ? prev + 1 : prev - 1);
  };

  const getNumberColor = (num) => {
    const colors = {
      1: 'text-blue-400',
      2: 'text-green-400',
      3: 'text-red-400',
      4: 'text-purple-400',
      5: 'text-orange-400',
      6: 'text-cyan-400',
      7: 'text-pink-400',
      8: 'text-yellow-400'
    };
    return colors[num] || 'text-white';
  };

  const containerClass = embedded
    ? 'w-full h-full flex flex-col p-2'
    : 'min-h-screen bg-black flex items-center justify-center p-4';

  const wrapperClass = embedded
    ? 'flex flex-col w-full h-full gap-2 text-white'
    : 'max-w-md w-full flex flex-col gap-6';

  return (
    <div className={containerClass}>
      <div className={wrapperClass}>
        {/* Header */}
        <div className="text-center">
          <h1 className={embedded ? 'text-xl font-bold text-white mb-0.5' : 'text-4xl font-bold text-white mb-2'}>
            💣 Minesweeper
          </h1>
          <p className={embedded ? 'text-red-300 text-[10px]' : 'text-red-300 text-sm'}>
            Avoid the mines!
          </p>
        </div>

        {/* Stats Bar */}
        <div className={embedded ? 'bg-white/10 backdrop-blur-md rounded-xl px-2.5 py-1.5 border border-white/10' : 'bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20'}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={embedded ? 'text-[11px] text-white flex items-center gap-1' : 'text-white flex items-center gap-2'}>
                <Bomb className={embedded ? 'w-3 h-3 text-red-400' : 'w-4 h-4 text-red-400'} />
                <span className="font-bold">{MINES_COUNT}</span>
              </div>
              <div className={embedded ? 'text-[11px] text-white flex items-center gap-1' : 'text-white flex items-center gap-2'}>
                <Flag className={embedded ? 'w-3 h-3 text-yellow-400' : 'w-4 h-4 text-yellow-400'} />
                <span className="font-bold">{flagsCount}</span>
              </div>
            </div>
            <button
              onClick={resetGame}
              className="p-2 hover:bg-white/10 rounded-lg transition-all duration-200 active:scale-95"
            >
              <RotateCcw className={embedded ? 'w-3.5 h-3.5 text-white' : 'w-5 h-5 text-white'} />
            </button>
          </div>
        </div>

        {/* Game Board */}
        <div className={embedded ? 'flex-1 flex items-center justify-center min-h-0 w-full overflow-hidden py-2' : 'bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20'}>
          <div 
            className={embedded ? "inline-grid gap-[3px]" : "grid gap-1"}
            style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}
          >
            {grid.flat().map((cell, index) => (
              <button
                key={index}
                onClick={() => handleCellClick(cell.x, cell.y)}
                onContextMenu={(e) => handleRightClick(e, cell.x, cell.y)}
                className={`
                  ${embedded ? 'w-[28px] h-[28px] text-[10px]' : 'w-9 h-9 text-sm'} 
                  rounded-md font-bold transition-all duration-150 flex items-center justify-center
                  ${cell.isRevealed
                    ? cell.isMine
                      ? 'bg-red-500'
                      : 'bg-white/20'
                    : 'bg-white/10 hover:bg-white/20 cursor-pointer'
                  }
                  border border-white/10
                `}
                disabled={gameOver || gameWon}
              >
                {cell.isRevealed ? (
                  cell.isMine ? (
                    <span className={embedded ? "text-[10px]" : "text-sm"}>💣</span>
                  ) : cell.neighborMines > 0 ? (
                    <span className={getNumberColor(cell.neighborMines)}>{cell.neighborMines}</span>
                  ) : null
                ) : cell.isFlagged ? (
                  <span className={embedded ? "text-[10px]" : "text-sm"}>🚩</span>
                ) : null}
              </button>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className={embedded ? 'text-center text-white/50 text-[8px]' : 'text-center text-white/50 text-xs'}>
          <p>Left click to reveal • Right click to flag</p>
        </div>

        {/* Game Over/Win Overlay */}
        {(gameOver || gameWon) && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur flex items-center justify-center z-20 rounded-3xl">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 text-center">
              <h2 className="text-2xl font-bold text-white mb-3">
                {gameWon ? '🎉 You Won!' : '💥 Game Over!'}
              </h2>
              <p className="text-white/80 mb-4">
                {gameWon ? 'You found all the safe cells!' : 'You hit a mine!'}
              </p>
              <button
                onClick={resetGame}
                className="bg-red-500 text-white px-5 py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors"
              >
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Minesweeper;
