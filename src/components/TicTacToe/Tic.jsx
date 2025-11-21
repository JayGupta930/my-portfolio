import React, { useState, useEffect } from 'react';
import { RotateCcw } from 'lucide-react';

// Minimax Algorithm - Optimized for Tic Tac Toe
const minimax = (board, depth, isMaximizing, alpha = -Infinity, beta = Infinity) => {
  const winner = checkWinner(board);
  
  if (winner === 'O') return 10 - depth;
  if (winner === 'X') return depth - 10;
  if (isBoardFull(board)) return 0;
  
  if (isMaximizing) {
    let maxEval = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = 'O';
        const evaluation = minimax(board, depth + 1, false, alpha, beta);
        board[i] = null;
        maxEval = Math.max(maxEval, evaluation);
        alpha = Math.max(alpha, evaluation);
        if (beta <= alpha) break;
      }
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = 'X';
        const evaluation = minimax(board, depth + 1, true, alpha, beta);
        board[i] = null;
        minEval = Math.min(minEval, evaluation);
        beta = Math.min(beta, evaluation);
        if (beta <= alpha) break;
      }
    }
    return minEval;
  }
};

const getBestMove = (board) => {
  let bestMove = -1;
  let bestValue = -Infinity;
  
  for (let i = 0; i < 9; i++) {
    if (board[i] === null) {
      board[i] = 'O';
      const moveValue = minimax(board, 0, false);
      board[i] = null;
      
      if (moveValue > bestValue) {
        bestValue = moveValue;
        bestMove = i;
      }
    }
  }
  
  return bestMove;
};

const checkWinner = (board) => {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  
  for (let line of lines) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
};

const getWinningLine = (board) => {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  
  for (let line of lines) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return line;
    }
  }
  return null;
};

const isBoardFull = (board) => {
  return board.every(cell => cell !== null);
};

const TicTacToe = ({ embedded = false }) => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isThinking, setIsThinking] = useState(false);
  const [gameStatus, setGameStatus] = useState('Your Turn');
  const [winningLine, setWinningLine] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const winner = checkWinner(board);
    const line = getWinningLine(board);
    
    if (winner) {
      setWinningLine(line);
      setGameOver(true);
      setGameStatus(winner === 'X' ? 'You Won! 🎉' : 'You Lost! 💻');
    } else if (isBoardFull(board)) {
      setGameOver(true);
      setGameStatus('Draw! 🤝');
    }
  }, [board]);

  const handleCellClick = (index) => {
    if (board[index] || gameOver || isThinking) return;
    
    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);
    
    const winner = checkWinner(newBoard);
    if (winner || isBoardFull(newBoard)) return;
    
    setIsThinking(true);
    setGameStatus('Computer Thinking...');
    
    setTimeout(() => {
      const bestMove = getBestMove(newBoard);
      newBoard[bestMove] = 'O';
      setBoard(newBoard);
      setIsThinking(false);
      setGameStatus('Your Turn');
    }, 500);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsThinking(false);
    setGameStatus('Your Turn');
    setWinningLine(null);
    setGameOver(false);
  };

  const containerClass = embedded
    ? 'w-full h-full flex items-center justify-center p-2'
    : 'min-h-screen bg-black flex items-center justify-center p-4';
  const wrapperClass = embedded
    ? 'flex flex-col w-full h-full gap-2 text-white'
    : 'max-w-md w-full flex flex-col gap-6';
  const headerClass = 'text-center';
  const titleClass = embedded
    ? 'text-xl font-bold text-white tracking-tight mb-0.5'
    : 'text-4xl md:text-5xl font-bold text-white tracking-tight mb-2';
  const subtitleClass = embedded
    ? 'text-purple-300 text-[10px]'
    : 'text-purple-300 text-sm md:text-base';
  const statusCardClass = embedded
    ? 'bg-white/10 backdrop-blur-md rounded-xl px-2.5 py-1.5 border border-white/10'
    : 'bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20';
  const statusInfoClass = embedded ? 'flex items-center gap-1.5' : 'flex items-center gap-3';
  const statusDotClass = embedded ? 'w-1.5 h-1.5 rounded-full' : 'w-3 h-3 rounded-full';
  const statusTextClass = embedded ? 'text-[11px] font-medium text-white' : 'text-white font-medium';
  const resetIconClass = embedded ? 'w-3.5 h-3.5 text-white' : 'w-5 h-5 text-white';
  const boardWrapperClass = embedded
    ? 'flex-1 flex items-center justify-center min-h-0 mt-4'
    : 'bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl';
  const gridClass = embedded ? 'grid grid-cols-3 gap-1.5 w-full max-w-[280px] mx-auto' : 'grid grid-cols-3 gap-3';
  const cellBaseClass = embedded
    ? 'aspect-square rounded-md text-xl font-bold transition-all duration-200 flex items-center justify-center border border-white/10 shadow-lg'
    : 'aspect-square rounded-xl text-5xl font-bold transition-all duration-200 flex items-center justify-center border-2 shadow-lg';
  const activeCellClass = embedded
    ? 'bg-white/5 hover:bg-white/10 hover:scale-[1.02] cursor-pointer active:scale-95'
    : 'bg-white/5 hover:bg-white/20 hover:scale-105 cursor-pointer active:scale-95';
  const disabledCellClass = 'bg-white/5 cursor-not-allowed';
  const xMarkClass = embedded ? 'text-blue-300' : 'text-blue-400';
  const oMarkClass = embedded ? 'text-pink-300' : 'text-pink-400';
  const legendClass = embedded
    ? 'flex justify-center gap-2.5 text-[9px] mt-6'
    : 'flex justify-center gap-6 text-sm';
  const legendLabelClass = embedded ? 'text-[10px] text-white/70' : 'text-white/70';
  const legendXClass = embedded ? 'text-2xl font-bold text-blue-300' : 'text-5xl font-bold text-blue-400';
  const legendOClass = embedded ? 'text-2xl font-bold text-pink-300' : 'text-5xl font-bold text-pink-400';
  const footerClass = embedded
    ? 'text-center text-white/50 text-[8px] leading-tight'
    : 'text-center text-white/50 text-xs';

  return (
    <div className={containerClass}>
      <div className={wrapperClass}>
        {/* Header */}
        <div className={headerClass}>
          <h1 className={titleClass}>Tic Tac Toe</h1>
          <p className={subtitleClass}>Challenge the Unbeatable AI</p>
        </div>

        {/* Status Bar */}
        <div className={statusCardClass}>
          <div className="flex items-center justify-between">
            <div className={statusInfoClass}>
              <div className={`${statusDotClass} ${isThinking ? 'bg-yellow-400 animate-pulse' : gameOver ? 'bg-red-400' : 'bg-green-400'}`} />
              <span className={statusTextClass}>{gameStatus}</span>
            </div>
            <button
              onClick={resetGame}
              className="p-2 hover:bg-white/10 rounded-lg transition-all duration-200 active:scale-95"
              aria-label="Reset Game"
            >
              <RotateCcw className={resetIconClass} />
            </button>
          </div>
        </div>

        {/* Game Board */}
        <div className={boardWrapperClass}>
          <div className={gridClass}>
            {board.map((cell, index) => {
              const isWinningCell = winningLine?.includes(index);
              const isDisabled = cell !== null || gameOver || isThinking;
              const markClass = cell === 'X' ? xMarkClass : cell === 'O' ? oMarkClass : 'text-transparent';
              const availabilityClass = !isDisabled ? activeCellClass : disabledCellClass;
              const highlightClass = isWinningCell ? 'bg-green-500/30 animate-pulse' : '';
              const borderClass = isWinningCell ? 'border-green-400' : 'border-white/10';

              return (
                <button
                  key={index}
                  onClick={() => handleCellClick(index)}
                  disabled={isDisabled}
                  className={`${cellBaseClass} ${availabilityClass} ${highlightClass} ${borderClass} ${markClass}`}
                >
                  {cell && (
                    <span className="animate-in fade-in zoom-in duration-200">
                      {cell}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        {/* <div className={legendClass}>
          <div className="flex items-center gap-2">
            <span className={legendXClass}>X</span>
            <span className={legendLabelClass}>You</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={legendOClass}>O</span>
            <span className={legendLabelClass}>Computer</span>
          </div>
        </div> */}

        {/* Footer */}
        <div className={footerClass}>
          <p>Powered by Minimax Algorithm • Unbeatable AI</p>
        </div>
      </div>
    </div>
  );
};

export default TicTacToe;