import { useState } from 'react';
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
      <div className="container">
        <h1>Noughts and Crosses</h1>
        <button className="start-button" onClick={startNewGame}>
          Start New Game
        </button>

        <Board squares={board} onSquareClick={handleMove} />

        <div className="status-area">
          {winner && <p className="status-message winner">Winner: {winner}</p>}
          {!isFinished && gameId && (
            <p className="status-message current-player">
              Current Player: {currentPlayer}
            </p>
          )}
          {!gameId && (
            <p className="status-message">Please start a new game.</p>
          )}
          {gameId && (
            <p className="status-message game-id">Game ID: {gameId}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
