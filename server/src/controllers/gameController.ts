import { Request, Response } from 'express';
import { GameState, games } from '../models/game';
import { checkWin } from '../utils/checkWin';

export const startGame = (req: Request, res: Response) => {
  const newGame: GameState = {
    id: generateGameId(),
    board: Array(9).fill(null),
    currentPlayer: 'X',
    winner: null,
    movesCount: 0,
    isFinished: false,
  };

  games[newGame.id] = newGame;

  res.status(200).json({ gameId: newGame.id });
};

export const makeMove = (req: Request, res: Response): any => {
  const { gameId, position } = req.body;

  const game = games[gameId];
  if (!game) {
    return res.status(404).json({ error: 'Game not found' });
  }

  if (game.isFinished) {
    return res.status(400).json({ error: 'Game has already finished' });
  }

  if (game.board[position] !== null) {
    return res.status(400).json({ error: 'Cell already taken' });
  }

  // Set the cell
  game.board[position] = game.currentPlayer;
  game.movesCount++;

  // Check for a winner
  if (checkWin(game.board, game.currentPlayer)) {
    game.winner = game.currentPlayer;
    game.isFinished = true;
  } else if (game.movesCount === 9) {
    // It's a draw
    game.isFinished = true;
  } else {
    // Switch player
    game.currentPlayer = game.currentPlayer === 'X' ? 'O' : 'X';
  }

  res.status(200).json({
    board: game.board,
    currentPlayer: game.currentPlayer,
    winner: game.winner,
  });
};

export const getGameStatus = (req: Request, res: Response): any => {
  const { gameId } = req.params;

  const game = games[gameId];
  if (!game) {
    return res.status(404).json({ error: 'Game not found' });
  }

  res.status(200).json({
    board: game.board,
    currentPlayer: game.currentPlayer,
    winner: game.winner,
    isFinished: game.isFinished,
  });
};

export const getBoardState = (req: Request, res: Response): any => {
  const { gameId } = req.params;

  const game = games[gameId];
  if (!game) {
    return res.status(404).json({ error: 'Game not found' });
  }

  res.status(200).json({ board: game.board });
};

function generateGameId(): string {
  return Math.random().toString(36).substring(2, 9);
}
