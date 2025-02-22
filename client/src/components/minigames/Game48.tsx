import { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { addCoins } from '../../store/slices/authSlice';
import { toast } from 'react-toastify';
import { AppDispatch } from '../../store';

const Game48 = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [board, setBoard] = useState<number[][]>([
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  // Initialize board
  const initBoard = useCallback(() => {
    const newBoard = Array(4)
      .fill(0)
      .map(() => Array(4).fill(0));
    addNumber(newBoard);
    addNumber(newBoard);
    setBoard(newBoard);
    setScore(0);
    setGameOver(false);
    setWon(false);
  }, []);

  useEffect(() => {
    initBoard();
  }, [initBoard]);

  // Add a new number (2 or 4) to a random empty cell
  const addNumber = (currentBoard: number[][]) => {
    const emptyCells = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (currentBoard[i][j] === 0) {
          emptyCells.push({ i, j });
        }
      }
    }
    if (emptyCells.length > 0) {
      const { i, j } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      currentBoard[i][j] = Math.random() < 0.9 ? 2 : 4;
    }
  };

  // Check if all tiles are 64 (true win condition)
  const checkForWin = (currentBoard: number[][]) => {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (currentBoard[i][j] !== 64) {
          return false;
        }
      }
    }
    return true;
  };

  // Handle winning and game over rewards
  const handleGameEnd = useCallback(
    async (isWin: boolean) => {
      if (gameOver) return; // Prevent multiple rewards
      setGameOver(true);

      let coinsEarned = 0;
      let bonusCoins = 0;

      // Base reward for winning (all tiles are 64)
      if (isWin) {
        coinsEarned = 50;
        setWon(true);
      }

      // Bonus coins based on score milestones (awarded whether you win or lose)
      if (score >= 1000) bonusCoins = 20;
      else if (score >= 750) bonusCoins = 15;
      else if (score >= 500) bonusCoins = 10;
      else if (score >= 250) bonusCoins = 5;

      const totalCoins = coinsEarned + bonusCoins;

      if (totalCoins > 0) {
        try {
          await dispatch(addCoins(totalCoins)).unwrap();
          const message = [];
          if (isWin) message.push(`50 coins for winning`);
          if (bonusCoins > 0) message.push(`${bonusCoins} bonus coins for score`);

          toast.success(
            isWin
              ? `Congratulations! You won! Earned ${totalCoins} coins! (${message.join(' + ')})`
              : `Game Over! You earned ${bonusCoins} bonus coins for your high score!`,
          );
        } catch {
          toast.error('Failed to add coins');
        }
      } else if (isWin) {
        toast.success('Congratulations! You won and earned 50 coins!');
      } else {
        toast.info('Game Over! Try again to earn coins!');
      }
    },
    [gameOver, score, dispatch, setGameOver, setWon],
  );

  // Check if game is over
  const checkGameOver = useCallback(
    (currentBoard: number[][]) => {
      // Check for empty cells
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          if (currentBoard[i][j] === 0) return false;
        }
      }

      // Check for possible merges horizontally and vertically
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          const currentValue = currentBoard[i][j];
          // Skip checking merges if it would exceed 64
          if (currentValue > 32) continue;

          // Check right
          if (j < 3 && currentBoard[i][j] === currentBoard[i][j + 1]) return false;
          // Check down
          if (i < 3 && currentBoard[i][j] === currentBoard[i + 1][j]) return false;
        }
      }

      // If we get here, no moves are possible
      // Check if it's a win (all tiles are 64)
      const isWin = checkForWin(currentBoard);
      handleGameEnd(isWin);
      return true;
    },
    [handleGameEnd],
  );

  // Move and merge tiles
  const move = useCallback(
    (direction: 'up' | 'down' | 'left' | 'right') => {
      if (gameOver) return;

      const newBoard = board.map((row) => [...row]);
      let moved = false;
      let merged = false;

      const moveRow = (row: number[]) => {
        // Remove zeros
        const filtered = row.filter((cell) => cell !== 0);

        // Merge adjacent equal numbers
        for (let i = 0; i < filtered.length - 1; i++) {
          if (filtered[i] === filtered[i + 1] && filtered[i] <= 32) {
            // Only merge if result won't exceed 64
            filtered[i] *= 2;
            filtered.splice(i + 1, 1);
            setScore((prev) => prev + filtered[i]);
            merged = true;
          }
        }

        // Add zeros back
        while (filtered.length < 4) filtered.push(0);
        return filtered;
      };

      // Process each row/column based on direction
      if (direction === 'left' || direction === 'right') {
        for (let i = 0; i < 4; i++) {
          const row = direction === 'left' ? [...newBoard[i]] : [...newBoard[i]].reverse();
          const processed = moveRow(row);
          const finalRow = direction === 'left' ? processed : processed.reverse();

          if (JSON.stringify(newBoard[i]) !== JSON.stringify(finalRow)) {
            moved = true;
          }
          newBoard[i] = finalRow;
        }
      } else {
        for (let j = 0; j < 4; j++) {
          const column = [];
          for (let i = 0; i < 4; i++) {
            column.push(newBoard[i][j]);
          }
          const processed =
            direction === 'up' ? moveRow(column) : moveRow([...column].reverse()).reverse();

          for (let i = 0; i < 4; i++) {
            if (newBoard[i][j] !== processed[i]) {
              moved = true;
            }
            newBoard[i][j] = processed[i];
          }
        }
      }

      if (moved || merged) {
        addNumber(newBoard);
        setBoard(newBoard);
        if (checkGameOver(newBoard)) {
          setGameOver(true);
        }
      }
    },
    [board, gameOver, checkGameOver],
  );

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default arrow key behavior (scrolling)
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
      }

      switch (e.key) {
        case 'ArrowUp':
          move('up');
          break;
        case 'ArrowDown':
          move('down');
          break;
        case 'ArrowLeft':
          move('left');
          break;
        case 'ArrowRight':
          move('right');
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [move]);

  const getCellColor = (value: number) => {
    const colors: { [key: number]: string } = {
      0: 'bg-gray-700',
      2: 'bg-blue-500',
      4: 'bg-green-500',
      8: 'bg-yellow-500',
      16: 'bg-orange-500',
      32: 'bg-red-500',
      64: 'bg-purple-500',
    };
    return colors[value] || 'bg-purple-600';
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 flex justify-between w-full max-w-md">
        <div className="text-white">Score: {score}</div>
        <button
          onClick={initBoard}
          className="px-4 py-2 bg-game-accent hover:bg-game-accent-dark text-white rounded"
        >
          New Game
        </button>
      </div>

      <div className="bg-gray-700 p-4 rounded-lg">
        {board.map((row, i) => (
          <div key={i} className="flex">
            {row.map((cell, j) => (
              <div
                key={`${i}-${j}`}
                className={`w-16 h-16 m-1 flex items-center justify-center text-white font-bold text-xl rounded ${getCellColor(
                  cell,
                )}`}
              >
                {cell !== 0 && cell}
              </div>
            ))}
          </div>
        ))}
      </div>

      {gameOver && (
        <div className="mt-4 text-white text-center">
          <h2 className="text-xl font-bold mb-2">{won ? 'Congratulations!' : 'Game Over!'}</h2>
          <p className="mb-2">Final Score: {score}</p>
          {score >= 250 && !won && (
            <p className="text-game-accent mb-2">Great score! You earned bonus coins!</p>
          )}
          <button
            onClick={initBoard}
            className="mt-2 px-4 py-2 bg-game-accent hover:bg-game-accent-dark text-white rounded"
          >
            Play Again
          </button>
        </div>
      )}

      <div className="mt-4 text-gray-300 text-center">
        <p>Use arrow keys to move tiles</p>
        <p>Combine equal numbers up to 64!</p>
        <p className="text-game-accent">Rewards:</p>
        <ul className="text-sm">
          <li>Win (all tiles 64): 50 coins</li>
          <li>Score 1000+: +20 coins</li>
          <li>Score 750+: +15 coins</li>
          <li>Score 500+: +10 coins</li>
          <li>Score 250+: +5 coins</li>
        </ul>
      </div>
    </div>
  );
};

export default Game48;
