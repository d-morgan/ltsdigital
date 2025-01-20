import { Router } from 'express';
import {
  startGame,
  makeMove,
  getGameStatus,
  getBoardState,
} from '../controllers/gameController';

const router = Router();

router.post('/start', startGame);
router.post('/move', makeMove);
router.get('/status/:gameId', getGameStatus);
router.get('/board/:gameId', getBoardState);

export default router;
