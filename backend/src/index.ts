import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import botRoutes from './routes/bot';
import gameRoutes from './routes/game';
import { createServer } from 'http';
import { Server } from 'socket.io';

dotenv.config();

const app = express();
const httpServer = createServer(app);

// CORS ayarları
const allowedOrigins = [
  'http://localhost:3000',
  'http://192.168.1.33:3000'
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS policy violation'));
    }
  },
  credentials: true
}));

app.use(express.json());

// Routes
app.use('/api/bots', botRoutes);
app.use('/api/games', gameRoutes);

// Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    credentials: true
  }
});

io.on('connection', (socket) => {
  console.log('Client bağlandı');

  socket.on('disconnect', () => {
    console.log('Client ayrıldı');
  });
});

// MongoDB bağlantısı
mongoose.connect(process.env.MONGODB_URI!)
  .then(() => {
    console.log('MongoDB bağlantısı başarılı');
  })
  .catch((err) => {
    console.error('MongoDB bağlantı hatası:', err);
  });

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor`);
}); 