import fs from 'fs';
import path from 'path';
import { GameState } from '../models/game';

const GAMES_FILE_PATH = path.join(__dirname, '../../data/games.json');

/**
 * Load all games from the JSON file.
 */
export function loadGames(): Record<string, GameState> {
  try {
    const data = fs.readFileSync(GAMES_FILE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading games file. Returning empty object.', err);
    return {};
  }
}

/**
 * Save all games to the JSON file.
 */
export function saveGames(games: Record<string, GameState>): void {
  try {
    fs.writeFileSync(GAMES_FILE_PATH, JSON.stringify(games, null, 2));
  } catch (err) {
    console.error('Error writing games file.', err);
  }
}
