import { Server as SocketServer } from 'socket.io';
import { Server as HttpServer } from 'http';
import { GameManager } from './game-manager';

export class SocketService {
  private io: SocketServer;
  private gameManager: GameManager;

  constructor(server: HttpServer) {
    this.io = new SocketServer(server, {
      cors: {
        origin: [
          'http://localhost:3000',
          'http://192.168.1.33:3000'
        ],
        methods: ['GET', 'POST']
      }
    });

    this.gameManager = new GameManager();
    this.initializeHandlers();
  }

  private initializeHandlers(): void {
    this.io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);

      // Oyun başlatma
      socket.on('start_game', async (data: { gameId: string }) => {
        try {
          const game = await this.gameManager.startGame(data.gameId);
          
          if (!game._id) {
            throw new Error('Game ID not found');
          }

          const gameId = game._id.toString();
          socket.join(gameId);
          
          this.io.to(gameId).emit('game_started', game);
          
          // İlk hamleyi başlat
          this.playNextMove(gameId);
        } catch (error) {
          socket.emit('error', {
            message: error instanceof Error ? error.message : 'Unknown error starting game'
          });
        }
      });

      // Oyunu durdurma
      socket.on('stop_game', async (data: { gameId: string }) => {
        try {
          await this.gameManager.stopGame(data.gameId);
          this.io.to(data.gameId).emit('game_stopped');
        } catch (error) {
          socket.emit('error', {
            message: error instanceof Error ? error.message : 'Unknown error stopping game'
          });
        }
      });

      // Oyun odasına katılma
      socket.on('join_game', (data: { gameId: string }) => {
        socket.join(data.gameId);
        socket.emit('joined_game');
      });

      // Bağlantı koptuğunda
      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });
  }

  private async playNextMove(gameId: string): Promise<void> {
    try {
      const move = await this.gameManager.playNextMove(gameId);
      
      if (move) {
        // Hamleyi yayınla
        this.io.to(gameId).emit('move', move);

        // Oyun bitti mi kontrol et
        const game = await this.gameManager.getGame(gameId);
        if (game?.status === 'completed') {
          this.io.to(gameId).emit('game_over', { result: game.result });
        } else {
          // Sonraki hamle için tekrar çağır
          setTimeout(() => this.playNextMove(gameId), 1000);
        }
      }
    } catch (error) {
      this.io.to(gameId).emit('error', {
        message: error instanceof Error ? error.message : 'Unknown error playing move'
      });
    }
  }
} 