import React from 'react';
import './Board.css';

interface BoardProps {
  squares: (string | null)[];
  onSquareClick: (index: number) => void;
}

const Board: React.FC<BoardProps> = ({ squares, onSquareClick }) => {
  return (
    <div className="board">
      {squares.map((square, index) => {
        const style = {
          color:
            square === 'X' ? '#e74c3c' : square === 'O' ? '#3498db' : '#333',
        };

        return (
          <div
            key={index}
            className="square"
            data-testid={`square-${index}`}
            onClick={() => onSquareClick(index)}
            style={style}
          >
            {square}
          </div>
        );
      })}
    </div>
  );
};

export default Board;
