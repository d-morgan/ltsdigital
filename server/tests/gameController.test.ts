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
    expect(res.body.currentPlayer).toBe('O'); // Should switch to O
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

    expect(res.body.winner).toBe('X');
    expect(res.body.isFinished).toBe(true);
  });
});
