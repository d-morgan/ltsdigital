import request from 'supertest';
import fs from 'fs';
import path from 'path';
import app from '../src/app';

const GAMES_FILE_PATH = path.join(__dirname, '../data/apis.json');

beforeEach(() => {
  fs.writeFileSync(GAMES_FILE_PATH, '{}');
});

describe('Game API', () => {
  it('should start a new game', async () => {
    const res = await request(app).post('/api/start').send();

    expect(res.status).toBe(200);
    expect(res.body.gameId).toBeDefined();
  });

  it('should make a valid move', async () => {
    // Start a new game
    let res = await request(app).post('/api/start').send();
    const gameId = res.body.gameId;

    // Make a move at position 0
    res = await request(app).post('/api/move').send({ gameId, position: 0 });

    expect(res.status).toBe(200);
    expect(res.body.board[0]).toBe('X');
    expect(res.body.currentPlayer).toBe('O');
  });

  it('should reject a move if the position is already taken', async () => {
    // Start a new game
    let res = await request(app).post('/api/start').send();
    const gameId = res.body.gameId;

    // Make a move at position 0
    await request(app).post('/api/move').send({ gameId, position: 0 });

    // Try to move on the same position
    res = await request(app).post('/api/move').send({ gameId, position: 0 });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Cell already taken');
  });

  it('should return 404 if game not found', async () => {
    const res = await request(app)
      .post('/api/move')
      .send({ gameId: 'unknown-id', position: 0 });

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Game not found');
  });

  it('should detect a winner', async () => {
    // Start a new game
    let res = await request(app).post('/api/start').send();
    const gameId = res.body.gameId;

    // X moves
    await request(app).post('/api/move').send({ gameId, position: 0 }); // X
    await request(app).post('/api/move').send({ gameId, position: 1 }); // O
    await request(app).post('/api/move').send({ gameId, position: 3 }); // X
    await request(app).post('/api/move').send({ gameId, position: 4 }); // O
    res = await request(app).post('/api/move').send({ gameId, position: 6 }); // X

    expect(res.status).toBe(200);
    expect(res.body.winner).toBe('X');
    expect(res.body.isFinished).toBe(true);
  });

  it('should return 400 if the game is already finished', async () => {
    // Start a new game
    let res = await request(app).post('/api/start').send();
    const gameId = res.body.gameId;

    // Make some moves to force a winner quickly
    await request(app).post('/api/move').send({ gameId, position: 0 }); // X
    await request(app).post('/api/move').send({ gameId, position: 1 }); // O
    await request(app).post('/api/move').send({ gameId, position: 3 }); // X
    await request(app).post('/api/move').send({ gameId, position: 4 }); // O
    res = await request(app).post('/api/move').send({ gameId, position: 6 }); // X => winner

    // Now the game is finished
    expect(res.body.isFinished).toBe(true);

    // Attempt another move
    const nextMove = await request(app)
      .post('/api/move')
      .send({ gameId, position: 8 });
    expect(nextMove.status).toBe(400);
    expect(nextMove.body.error).toBe('Game has already finished');
  });

  it('should detect a draw after 9 moves', async () => {
    // Start a new game
    let res = await request(app).post('/api/start').send();
    const gameId = res.body.gameId;

    const moves = [0, 1, 2, 4, 3, 5, 7, 6, 8];
    // X moves on even indices, O moves on odd

    for (let i = 0; i < moves.length; i++) {
      res = await request(app)
        .post('/api/move')
        .send({ gameId, position: moves[i] });
    }

    // After 9 moves we expect isFinished = true and winner = null
    expect(res.status).toBe(200);
    expect(res.body.isFinished).toBe(true);
    expect(res.body.winner).toBe(null);
  });

  describe('getGameStatus', () => {
    it('should return 404 if game not found', async () => {
      const res = await request(app).get('/api/status/unknown-id').send();
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Game not found');
    });

    it('should return the current game status', async () => {
      // Start a new game
      let res = await request(app).post('/api/start').send();
      const gameId = res.body.gameId;

      // Make one move
      await request(app).post('/api/move').send({ gameId, position: 0 });

      // Check status
      const statusRes = await request(app).get(`/api/status/${gameId}`).send();
      expect(statusRes.status).toBe(200);
      expect(statusRes.body.board[0]).toBe('X');
      expect(statusRes.body.currentPlayer).toBe('O');
      expect(statusRes.body.winner).toBeNull();
      expect(statusRes.body.isFinished).toBe(false);
    });
  });

  describe('getBoardState', () => {
    it('should return 404 if game not found', async () => {
      const res = await request(app).get('/api/board/unknown-id').send();
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Game not found');
    });

    it('should return the current board state', async () => {
      // Start a new game
      let res = await request(app).post('/api/start').send();
      const gameId = res.body.gameId;

      // Make two moves
      await request(app).post('/api/move').send({ gameId, position: 0 }); // X
      await request(app).post('/api/move').send({ gameId, position: 4 }); // O

      // Check board state
      const boardRes = await request(app).get(`/api/board/${gameId}`).send();
      expect(boardRes.status).toBe(200);
      // We expect board: e.g. ['X', null, null, null, 'O', null, null, null, null]
      expect(boardRes.body.board[0]).toBe('X');
      expect(boardRes.body.board[4]).toBe('O');
      expect(boardRes.body.board[1]).toBeNull();
    });
  });
});
