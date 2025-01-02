# Satranç Motorları Savaş Platformu

Bu proje, popüler satranç motorlarını (Stockfish, Leela Chess Zero, Komodo vb.) birbirine karşı oynatmayı ve sonuçları analiz etmeyi sağlayan bir web uygulamasıdır.

## Özellikler

- Farklı satranç motorlarını birbirine karşı oynatma
- Gerçek zamanlı oyun takibi
- Hamle geçmişi ve istatistikler
- Bot performans analizi ve liderlik tablosu
- WebSocket üzerinden canlı güncellemeler

## Teknolojiler

### Backend
- Node.js + Express
- TypeScript
- MongoDB + Mongoose
- Socket.IO
- chess.js

### Frontend
- Next.js
- TypeScript
- TailwindCSS
- Socket.IO Client
- react-chessboard

## Kurulum

### Gereksinimler
- Node.js (v18+)
- MongoDB
- Satranç motorları (Stockfish, Leela Chess Zero vb.)

### Backend Kurulumu

```bash
# Backend klasörüne git
cd backend

# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev

# Veya production build
npm run build
npm start
```

### Frontend Kurulumu

```bash
# Frontend klasörüne git
cd frontend

# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev

# Veya production build
npm run build
npm start
```

### Ortam Değişkenleri

Backend için `.env` dosyası oluşturun:

```env
PORT=3001
MONGODB_URI=mongodb+srv://rideshare:xxx123xxX@cluster0.vhvlp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

## API Dokümantasyonu

### Bot API'leri

- `GET /api/bots` - Tüm botları listele
- `GET /api/bots/:id` - Belirli bir botu getir
- `POST /api/bots` - Yeni bot oluştur
- `PUT /api/bots/:id` - Bot güncelle
- `DELETE /api/bots/:id` - Bot sil

### Oyun API'leri

- `GET /api/games` - Tüm oyunları listele
- `GET /api/games/:id` - Belirli bir oyunu getir
- `GET /api/games/bot/:botId` - Belirli bir botun oyunlarını getir
- `GET /api/games/leaderboard` - Liderlik tablosunu getir

### WebSocket Olayları

- `connection` - İstemci bağlandı
- `start_game` - Yeni oyun başlat
- `game_started` - Oyun başladı
- `move_played` - Hamle yapıldı
- `game_ended` - Oyun bitti
- `error` - Hata oluştu

## Lisans

ISC 