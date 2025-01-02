import { Chess } from 'chess.js';
import { ChessEngine } from './chess-engine';
import { IBot } from '../types';
import GameModel from '../models/Game';

export class GameManager {
  private game: Chess;
  private engineA: ChessEngine;
  private engineB: ChessEngine;
  private gameId: string;
  private isGameOver: boolean = false;
  private moveTimeout: NodeJS.Timeout | null = null;

  constructor(gameId: string, botA: IBot, botB: IBot) {
    this.gameId = gameId;
    this.game = new Chess();
    this.engineA = new ChessEngine(botA.apiConfig.modelType, botA.apiConfig.apiKey);
    this.engineB = new ChessEngine(botB.apiConfig.modelType, botB.apiConfig.apiKey);
  }

  public async init(): Promise<void> {
    await this.engineA.init();
    await this.engineB.init();
  }

  public async start(): Promise<void> {
    this.isGameOver = false;
    this.scheduleMoveExecution();
  }

  private async scheduleMoveExecution(): Promise<void> {
    if (this.isGameOver) {
      return;
    }

    this.moveTimeout = setTimeout(async () => {
      try {
        const currentEngine = this.game.turn() === 'w' ? this.engineA : this.engineB;
        const move = await currentEngine.getNextMove(this.game.fen());

        // Hamleyi yap
        this.game.move({
          from: move.from,
          to: move.to,
          promotion: move.promotion || 'q' // Terfi belirtilmemişse vezir olarak terfi et
        });

        // Hamleyi veritabanına kaydet
        await this.saveMove(move);

        // Oyun durumunu kontrol et
        if (this.game.isGameOver()) {
          this.isGameOver = true;
          await this.endGame();
        } else {
          // Sonraki hamle için zamanlayıcı kur
          this.scheduleMoveExecution();
        }
      } catch (error) {
        console.error('Error executing move:', error);
        this.isGameOver = true;
        await this.endGame();
      }
    }, 1000); // Her hamle için 1 saniye bekle
  }

  private async saveMove(move: { from: string; to: string; promotion?: string }): Promise<void> {
    try {
      await GameModel.findByIdAndUpdate(
        this.gameId,
        {
          $push: { moves: `${move.from}-${move.to}${move.promotion ? `-${move.promotion}` : ''}` }
        }
      );
    } catch (error) {
      console.error('Error saving move:', error);
      throw error;
    }
  }

  private async endGame(): Promise<void> {
    try {
      if (this.moveTimeout) {
        clearTimeout(this.moveTimeout);
      }

      await GameModel.findByIdAndUpdate(
        this.gameId,
        {
          status: 'completed'
        }
      );
    } catch (error) {
      console.error('Error ending game:', error);
      throw error;
    }
  }

  public cleanup(): void {
    if (this.moveTimeout) {
      clearTimeout(this.moveTimeout);
    }
    this.engineA.cleanup();
    this.engineB.cleanup();
  }
} 