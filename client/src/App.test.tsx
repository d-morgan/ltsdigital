import { describe, test, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

describe('App component', () => {
  // Reset all mocks before each test
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  test('renders the heading and shows message to start a new game', () => {
    render(<App />);
    expect(screen.getByText('Noughts and Crosses')).toBeInTheDocument();
    expect(screen.getByText('Please start a new game.')).toBeInTheDocument();

    const button = screen.getByRole('button', { name: /start new game/i });
    expect(button).toBeInTheDocument();
  });

  test('clicking "Start New Game" calls the /api/start endpoint and sets a gameId', async () => {
    // Mock fetch for /api/start
    const mockGameId = 'test-game-id';
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ gameId: mockGameId }),
    } as Response);

    render(<App />);
    const startBtn = screen.getByRole('button', { name: /start new game/i });
    fireEvent.click(startBtn);

    // Wait for the gameId text to appear
    await waitFor(() => {
      expect(screen.getByText(`Game ID: ${mockGameId}`)).toBeInTheDocument();
    });

    // Also check that "Please start a new game." is no longer displayed
    expect(screen.queryByText('Please start a new game.')).toBeNull();

    // Ensure fetch was called correctly
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:3001/api/start',
      expect.objectContaining({
        method: 'POST',
      })
    );
  });

  test('should attempt a move when clicking on a square', async () => {
    // Start new game fetch mock
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        // for /api/start
        ok: true,
        json: async () => ({ gameId: 'test-game-id' }),
      } as Response)
      .mockResolvedValueOnce({
        // for /api/move
        ok: true,
        json: async () => ({
          board: ['X', null, null, null, null, null, null, null, null],
          currentPlayer: 'O',
          winner: null,
          isFinished: false,
        }),
      } as Response);

    render(<App />);

    // Start the game
    fireEvent.click(screen.getByRole('button', { name: /start new game/i }));

    // Wait for gameId to show up
    await screen.findByText('Game ID: test-game-id');

    // Click square 0
    const square0 = screen.getByTestId('square-0');
    fireEvent.click(square0);

    // Wait for fetch /api/move to complete
    await waitFor(() => {
      // After the move, it should have placed 'X' in square 0
      expect(square0).toHaveTextContent('X');
    });

    // Confirm the second fetch was called
    expect(global.fetch).toHaveBeenCalledTimes(2);

    // And it called /api/move with correct body
    expect(global.fetch).toHaveBeenLastCalledWith(
      'http://localhost:3001/api/move',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameId: 'test-game-id', position: 0 }),
      })
    );
  });

  test('should not call /api/move if no gameId yet', async () => {
    global.fetch = vi.fn();
    render(<App />);

    // There's no game ID at this point
    const square0 = screen.getByTestId('square-0');
    fireEvent.click(square0);

    // Should not have called fetch
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test('handles fetch error gracefully (start game)', async () => {
    // Force an error
    global.fetch = vi.fn().mockRejectedValue(new Error('Network failure'));

    render(<App />);
    const startBtn = screen.getByRole('button', { name: /start new game/i });
    fireEvent.click(startBtn);

    // We expect an error in console
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Wait for error to be logged
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error starting new game:',
        expect.any(Error)
      );
    });

    consoleSpy.mockRestore();
  });

  test('displays winner when data.winner is returned', async () => {
    // 1st call: start game
    // 2nd call: making move => returns winner
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ gameId: 'test-game-id' }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          board: ['X', null, null, null, null, null, null, null, null],
          currentPlayer: 'O',
          winner: 'X',
          isFinished: true,
        }),
      } as Response);

    render(<App />);

    // Start New Game
    fireEvent.click(screen.getByRole('button', { name: /start new game/i }));

    // Wait for gameId
    await screen.findByText('Game ID: test-game-id');

    // Click square 0 => triggers the second fetch
    fireEvent.click(screen.getByTestId('square-0'));

    // Wait for winner text
    await waitFor(() => {
      expect(screen.getByText('Winner: X')).toBeInTheDocument();
    });

    // "Current Player" shouldn't be displayed if the game is finished
    expect(screen.queryByText('Current Player:')).toBeNull();
  });

  test('declares a draw if board is full and no winner', async () => {
    // 1st call: start
    // 2nd call: move => returns a full board with no winner
    const mockFullBoard = ['X', 'O', 'X', 'O', 'X', 'O', 'O', 'X', 'O'];

    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ gameId: 'test-game-id' }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          board: mockFullBoard,
          currentPlayer: 'O',
          winner: null,
          isFinished: false,
        }),
      } as Response);

    render(<App />);

    // Start New Game
    fireEvent.click(screen.getByRole('button', { name: /start new game/i }));
    await screen.findByText('Game ID: test-game-id');

    // Click a square => triggers second fetch
    fireEvent.click(screen.getByTestId('square-0'));

    // Wait for the effect
    await waitFor(() => {
      expect(screen.queryByText('Current Player:')).toBeNull();
    });
  });

  test('logs an error if the response includes data.error', async () => {
    // 1st: start
    // 2nd: move => returns { error: 'Some server error' }
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ gameId: 'test-game-id' }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          error: 'Some server error',
        }),
      } as Response);

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /start new game/i }));
    await screen.findByText('Game ID: test-game-id');

    // Attempt move
    fireEvent.click(screen.getByTestId('square-0'));

    // Wait for the console error to be triggered
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Some server error');
    });
    consoleSpy.mockRestore();
  });
});
