import { useState, useEffect } from 'react';
import Board from './Board';
import './App.css';

function App() {
  const [gameId, setGameId] = useState<string | null>(null);
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O' | null>('X');
  const [winner, setWinner] = useState<string | null>(null);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const startNewGame = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/start', {
        method: 'POST',
      });
      const data = await res.json();
      setGameId(data.gameId);
      setBoard(Array(9).fill(null));
      setCurrentPlayer('X');
      setWinner(null);
      setIsFinished(false);
    } catch (err) {
      console.error('Error starting new game:', err);
    }
  };

  const handleMove = async (index: number) => {
    if (!gameId || isFinished || board[index] !== null) {
      return;
    }
    try {
      const res = await fetch('http://localhost:3001/api/move', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameId, position: index }),
      });
      const data = await res.json();

      if (data.error) {
        console.error(data.error);
        return;
      }

      setBoard(data.board);
      setCurrentPlayer(data.currentPlayer);

      if (data.winner) {
        setWinner(data.winner);
        setIsFinished(true);
      } else if (data.board.every((cell: string | null) => cell !== null)) {
        // If all cells are filled and no winner, it's a draw
        setIsFinished(true);
      }
    } catch (err) {
      console.error('Error making move:', err);
    }
  };

  return (
    <div className="App">
      <h1>Noughts and Crosses</h1>
      <button onClick={startNewGame}>Start New Game</button>
      <Board squares={board} onSquareClick={handleMove} />
      {winner && <p>Winner: {winner}</p>}
      {!isFinished && gameId && <p>Current Player: {currentPlayer}</p>}
      {!gameId && <p>Please start a new game.</p>}
      {gameId && <p>Game ID: {gameId}</p>}
    </div>
  );
}

export default App;
