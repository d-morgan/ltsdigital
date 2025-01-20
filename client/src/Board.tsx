import React from 'react';
import './Board.css';

interface BoardProps {
  squares: (string | null)[];
  onSquareClick: (index: number) => void;
}

const Board: React.FC<BoardProps> = ({ squares, onSquareClick }) => {
  return (
    <div className="board">
      {squares.map((square, index) => (
        <div
        key={index}
        className="square"
        data-testid={`square-${index}`}
        onClick={() => onSquareClick(index)}
        >
          {square}
        </div>
      ))}
    </div>
  );
};

export default Board;
