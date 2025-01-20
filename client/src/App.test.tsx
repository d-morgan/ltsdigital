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
});
