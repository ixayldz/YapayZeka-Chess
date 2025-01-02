import express from 'express';
import { createBot, getBot, updateBot, deleteBot } from '../controllers/bot';

const router = express.Router();

router.post('/', createBot);
router.get('/:botId', getBot);
router.put('/:botId', updateBot);
router.delete('/:botId', deleteBot);

export default router; 