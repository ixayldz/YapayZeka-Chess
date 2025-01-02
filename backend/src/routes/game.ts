import express from 'express';
import { createGame, startGame, getGame, getGamesByBot, stopGame } from '../controllers/game';

const router = express.Router();

router.post('/', createGame);
router.post('/:gameId/start', startGame);
router.get('/:gameId', getGame);
router.get('/bot/:botId', getGamesByBot);
router.post('/:gameId/stop', stopGame);

export default router; 