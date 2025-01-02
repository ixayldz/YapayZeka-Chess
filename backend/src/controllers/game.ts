import { Request, Response } from 'express';
import GameModel from '../models/Game';
import BotModel from '../models/Bot';
import { GameManager } from '../services/game-manager';
import { IBot } from '../types';

export const createGame = async (req: Request, res: Response): Promise<void> => {
  try {
    const { botA, botB } = req.body;

    // Botları kontrol et
    const [botAData, botBData] = await Promise.all([
      BotModel.findById(botA),
      BotModel.findById(botB)
    ]);

    if (!botAData || !botBData) {
      res.status(404).json({ message: 'Bot(s) not found' });
      return;
    }

    // Yeni oyun oluştur
    const game = await GameModel.create({
      botA,
      botB,
      status: 'pending',
      moves: []
    });

    res.status(201).json(game);
  } catch (error) {
    console.error('Error creating game:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const startGame = async (req: Request, res: Response): Promise<void> => {
  try {
    const { gameId } = req.params;

    // Oyunu bul ve botları yükle
    const game = await GameModel.findById(gameId)
      .populate<{ botA: IBot; botB: IBot }>('botA')
      .populate<{ botA: IBot; botB: IBot }>('botB');

    if (!game) {
      res.status(404).json({ message: 'Game not found' });
      return;
    }

    if (game.status !== 'pending') {
      res.status(400).json({ message: 'Game already started or completed' });
      return;
    }

    // Oyun yöneticisi oluştur ve başlat
    try {
      const gameManager = new GameManager(gameId, game.botA, game.botB);
      await gameManager.init();
      await gameManager.start();

      // Oyun durumunu güncelle
      game.status = 'active';
      await game.save();

      res.status(200).json({ message: 'Game started successfully' });
    } catch (error) {
      console.error('Error starting game:', error);
      res.status(500).json({ message: 'Error starting game' });
    }
  } catch (error) {
    console.error('Error in startGame:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getGame = async (req: Request, res: Response): Promise<void> => {
  try {
    const { gameId } = req.params;

    const game = await GameModel.findById(gameId)
      .populate<{ botA: IBot; botB: IBot }>('botA')
      .populate<{ botA: IBot; botB: IBot }>('botB');

    if (!game) {
      res.status(404).json({ message: 'Game not found' });
      return;
    }

    res.status(200).json(game);
  } catch (error) {
    console.error('Error fetching game:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getGamesByBot = async (req: Request, res: Response): Promise<void> => {
  try {
    const { botId } = req.params;

    const games = await GameModel.find({
      $or: [
        { botA: botId },
        { botB: botId }
      ]
    })
      .populate<{ botA: IBot; botB: IBot }>('botA')
      .populate<{ botA: IBot; botB: IBot }>('botB')
      .sort({ createdAt: -1 });

    res.status(200).json(games);
  } catch (error) {
    console.error('Error fetching games:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const stopGame = async (req: Request, res: Response): Promise<void> => {
  try {
    const { gameId } = req.params;

    const game = await GameModel.findById(gameId);
    if (!game) {
      res.status(404).json({ message: 'Game not found' });
      return;
    }

    game.status = 'completed';
    await game.save();

    res.status(200).json({ message: 'Game stopped successfully' });
  } catch (error) {
    console.error('Error stopping game:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}; 