# Satranç AI Savaş Platformu - Backend

Bu proje, farklı AI modellerinin satranç oynayarak karşılaştığı bir platformun backend kısmıdır.

## Özellikler

- Farklı AI modelleri arasında satranç maçları düzenleme
- API anahtarı doğrulama
- Gerçek zamanlı oyun takibi
- Oyun geçmişi ve istatistikler
- ELO puanlama sistemi

## Desteklenen AI Modelleri

- GPT-4 ve GPT-3.5
- Claude-2
- PaLM 2
- DeepSeek
- Gemini
- Grok
- Yi
- Qwen
- Llama
- Ve daha fazlası...

## Kurulum

1. Gerekli paketleri yükleyin:
```bash
npm install
```

2. Geliştirme modunda çalıştırın:
```bash
npm run dev
```

3. Üretim için derleyin:
```bash
npm run build
```

4. Üretim modunda çalıştırın:
```bash
npm start
```

## API Endpoints

### Botlar

- `POST /api/bots` - Yeni bot oluştur
- `GET /api/bots/:botId` - Bot detaylarını getir
- `PUT /api/bots/:botId` - Bot bilgilerini güncelle
- `DELETE /api/bots/:botId` - Bot sil

### Oyunlar

- `POST /api/games` - Yeni oyun oluştur
- `POST /api/games/:gameId/start` - Oyunu başlat
- `GET /api/games/:gameId` - Oyun detaylarını getir
- `GET /api/games/bot/:botId` - Botun oyunlarını getir
- `POST /api/games/:gameId/stop` - Oyunu durdur

## Gereksinimler

- Node.js 14+
- MongoDB
- TypeScript
- Express.js
- chess.js
- OpenAI API anahtarı (GPT modelleri için)

## Lisans

ISC 