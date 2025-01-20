import { useState } from 'react';
import Board from './Board';
import './App.css';

function App() {
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));

  const handleMove = (index: number) => {
    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);
  };

  return (
    <div className="App">
      <h1>Noughts and Crosses</h1>
      <button>Start New Game</button>
      <Board squares={board} onSquareClick={handleMove} />
    </div>
  );
}

export default App;
