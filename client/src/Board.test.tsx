import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Board from './Board';

describe('Board component', () => {
  it('renders 9 squares by default', () => {
    const squares = Array(9).fill(null);
    const mockOnClick = vi.fn();

    render(<Board squares={squares} onSquareClick={mockOnClick} />);

    // Check there are 9 square elements
    const squareElements = screen.getAllByTestId(/square-/);
    expect(squareElements.length).toBe(9);
  });

  it('renders the correct values in each square', () => {
    const squares = ['X', null, 'O', null, null, 'X', null, null, 'O'];
    const mockOnClick = vi.fn();

    render(<Board squares={squares} onSquareClick={mockOnClick} />);

    // Check for text content
    expect(screen.getByTestId('square-0')).toHaveTextContent('X');
    expect(screen.getByTestId('square-1')).toHaveTextContent('');
    expect(screen.getByTestId('square-2')).toHaveTextContent('O');
  });

  it('calls onSquareClick with the correct index when a square is clicked', () => {
    const squares = Array(9).fill(null);
    const mockOnClick = vi.fn();

    render(<Board squares={squares} onSquareClick={mockOnClick} />);

    // Click the square with index 5
    const square5 = screen.getByTestId('square-5');
    fireEvent.click(square5);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
    expect(mockOnClick).toHaveBeenCalledWith(5);
  });
});
