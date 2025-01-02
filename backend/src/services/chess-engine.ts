import { Chess } from 'chess.js';
import OpenAI from 'openai';
import { IMove } from '../types';

export class ChessEngine {
  private game: Chess;
  private modelType: string;
  private openai: OpenAI | null = null;
  private apiKey: string;

  constructor(modelType: string, apiKey: string) {
    this.modelType = modelType;
    this.apiKey = apiKey;
    this.game = new Chess();
  }

  public async init(): Promise<void> {
    if (this.modelType.includes('gpt')) {
      this.openai = new OpenAI({
        apiKey: this.apiKey
      });
    }
  }

  public async getNextMove(position: string): Promise<IMove> {
    try {
      this.game.load(position);

      // Oyun durumunu analiz et
      const legalMoves = this.game.moves({ verbose: true });
      if (legalMoves.length === 0) {
        throw new Error('Yasal hamle kalmadı');
      }

      let selectedMove;

      // OpenAI modelleri için
      if (this.modelType.includes('gpt') && this.openai) {
        const systemPrompt = `Sen bir satranç motorusun. FEN notasyonunda verilen pozisyonda en iyi hamleyi seçmelisin.
          Hamle seçerken şunlara dikkat et:
          1. Materyal avantajı
          2. Merkez kontrolü
          3. Taş aktivitesi
          4. Kral güvenliği
          
          Yanıtını şu formatta ver:
          {
            "selectedMoveIndex": seçtiğin_hamlenin_indeksi,
            "explanation": "Neden bu hamleyi seçtiğinin kısa açıklaması"
          }`;

        const response = await this.openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            {
              role: 'user',
              content: `Mevcut pozisyon (FEN): ${position}
                Yasal hamleler: ${JSON.stringify(legalMoves, null, 2)}
                
                Lütfen en iyi hamleyi seç ve nedenini açıkla.`
            }
          ],
          temperature: 0.3,
          max_tokens: 500
        });

        try {
          const content = response.choices[0]?.message?.content;
          if (content) {
            const moveChoice = JSON.parse(content);
            if (typeof moveChoice.selectedMoveIndex === 'number' && 
                moveChoice.selectedMoveIndex >= 0 && 
                moveChoice.selectedMoveIndex < legalMoves.length) {
              selectedMove = legalMoves[moveChoice.selectedMoveIndex];
              console.log(`AI Açıklaması: ${moveChoice.explanation}`);
            }
          }
        } catch (error) {
          console.error('AI yanıtı işlenemedi:', error);
        }
      }

      // Diğer AI modelleri için benzer implementasyonlar eklenecek
      // else if (this.modelType.includes('claude')) { ... }
      // else if (this.modelType.includes('gemini')) { ... }

      // Eğer AI'dan hamle alınamadıysa veya başka bir model kullanılıyorsa
      // en iyi hamleyi seçmeye çalış
      if (!selectedMove) {
        // Basit bir değerlendirme fonksiyonu
        selectedMove = this.evaluateAndSelectBestMove(legalMoves);
      }

      return {
        from: selectedMove.from,
        to: selectedMove.to,
        promotion: selectedMove.promotion
      };
    } catch (error) {
      console.error('Hamle hesaplanırken hata:', error);
      throw error;
    }
  }

  private evaluateAndSelectBestMove(legalMoves: any[]): any {
    // Basit bir değerlendirme sistemi
    const pieceValues = {
      p: 1,   // piyon
      n: 3,   // at
      b: 3,   // fil
      r: 5,   // kale
      q: 9,   // vezir
      k: 0    // şah (değerlendirmede kullanılmaz)
    };

    let bestMove = legalMoves[0];
    let bestScore = -Infinity;

    for (const move of legalMoves) {
      let score = 0;

      // Hamleyi geçici olarak uygula
      const tempGame = new Chess(this.game.fen());
      tempGame.move(move);

      // Materyal değerlendirmesi
      const position = tempGame.board();
      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          const piece = position[row][col];
          if (piece) {
            const value = pieceValues[piece.type as keyof typeof pieceValues] || 0;
            score += piece.color === tempGame.turn() ? value : -value;
          }
        }
      }

      // Merkez kontrolü için bonus
      if (['e4', 'e5', 'd4', 'd5'].includes(move.to)) {
        score += 0.5;
      }

      // Şah çekme bonusu
      if (tempGame.isCheck()) {
        score += 0.3;
      }

      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }

    return bestMove;
  }

  public cleanup(): void {
    // Temizlik işlemleri
  }
} 