import { Request, Response } from 'express';
import BotModel from '../models/Bot';
import { APIValidator } from '../services/api-validator';

export const createBot = async (req: Request, res: Response) => {
  try {
    const { name, apiConfig } = req.body;

    // API anahtarını doğrula
    const apiValidator = new APIValidator();
    const isValid = await apiValidator.validateApiKey(apiConfig.modelType, apiConfig.apiKey);

    if (!isValid) {
      res.status(400).json({ message: 'Invalid API key' });
      return;
    }

    const bot = await BotModel.create({
      name,
      apiConfig,
      wins: 0,
      losses: 0,
      draws: 0,
      elo: 1500
    });

    res.status(201).json(bot);
  } catch (error) {
    console.error('Error creating bot:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getBot = async (req: Request, res: Response) => {
  try {
    const { botId } = req.params;

    const bot = await BotModel.findById(botId);
    if (!bot) {
      res.status(404).json({ message: 'Bot not found' });
      return;
    }

    res.status(200).json(bot);
  } catch (error) {
    console.error('Error fetching bot:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateBot = async (req: Request, res: Response) => {
  try {
    const { botId } = req.params;
    const { name, apiConfig } = req.body;

    // API anahtarını doğrula
    if (apiConfig?.apiKey) {
      const apiValidator = new APIValidator();
      const isValid = await apiValidator.validateApiKey(apiConfig.modelType, apiConfig.apiKey);

      if (!isValid) {
        res.status(400).json({ message: 'Invalid API key' });
        return;
      }
    }

    const bot = await BotModel.findByIdAndUpdate(
      botId,
      { name, apiConfig },
      { new: true }
    );

    if (!bot) {
      res.status(404).json({ message: 'Bot not found' });
      return;
    }

    res.status(200).json(bot);
  } catch (error) {
    console.error('Error updating bot:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteBot = async (req: Request, res: Response) => {
  try {
    const { botId } = req.params;

    const bot = await BotModel.findByIdAndDelete(botId);
    if (!bot) {
      res.status(404).json({ message: 'Bot not found' });
      return;
    }

    res.status(200).json({ message: 'Bot deleted successfully' });
  } catch (error) {
    console.error('Error deleting bot:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}; 