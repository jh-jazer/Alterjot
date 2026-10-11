import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB, isConnectedToAtlas } from './config/db.js';
import novelRoutes from './routes/novelRoutes.js';
import chapterRoutes from './routes/chapterRoutes.js';
import sceneRoutes from './routes/sceneRoutes.js';
import codexRoutes from './routes/codexRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { memoryStore } from './store/memoryStore.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Hardening: Allow production frontend, Vercel preview deployments, and local dev
const allowedOrigins = [
  'https://alterjot.vercel.app',
  'http://localhost:5173',
  'http://localhost:5000',
  process.env.CLIENT_ORIGIN,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server requests, Vercel rewrites proxy, or curl (no origin header)
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith('.vercel.app') ||
        origin.startsWith('http://localhost:')
      ) {
        return callback(null, true);
      }
      return callback(new Error('CORS blocked: Request origin not allowed by Alterjot API'));
    },
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id'],
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health / Status endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    product: 'Alterjot Manuscript Studio',
    database: isConnectedToAtlas() ? 'MongoDB Atlas' : 'Hybrid Local Memory Store',
    isAtlas: isConnectedToAtlas(),
    timestamp: new Date().toISOString(),
  });
});

// Clear all data endpoint
app.post('/api/clear', (req, res) => {
  memoryStore.novels = [];
  memoryStore.chapters = [];
  memoryStore.scenes = [];
  memoryStore.codex = [];
  res.json({ success: true, message: 'All library data cleared' });
});

// Modular Routes as specified
app.use('/api/novels', novelRoutes);
app.use('/api/chapters', chapterRoutes);
app.use('/api/scenes', sceneRoutes);
app.use('/api/codex', codexRoutes);
app.use('/api/auth', authRoutes);

// Error Handling
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ success: false, error: err.message || 'Internal Server Error' });
});

// Boot Server
async function startServer() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`\n🚀 \x1b[35mAlterjot Server\x1b[0m is active at \x1b[36mhttp://localhost:${PORT}\x1b[0m`);
    console.log(`📡 Storage Mode: \x1b[33m${isConnectedToAtlas() ? 'MongoDB Atlas' : 'Hybrid Local Store'}\x1b[0m\n`);
  });
}

startServer();
