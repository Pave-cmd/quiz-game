import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import authRoutes from './routes/auth';
import leaderboardRoutes from './routes/leaderboard';
import statsRoutes from './routes/stats';

dotenv.config();

const app = express();

// Rozšířená CORS konfigurace pro GitHub Codespaces
app.use(cors({
  origin: function(origin, callback) {
    // Povolíme všechny GitHub Codespaces domény a lokální vývoj
    const allowedOrigins = [
      'http://localhost:5180',
      'http://localhost:3000',
      'https://opulent-space-happiness-4jg69x7vv4wxh7wqj-5180.app.github.dev'
    ];
    
    // Povolit konkrétní origin nebo development (null origin)
    const isAllowed = !origin || allowedOrigins.some(allowed => origin.includes(allowed));
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      // Povolit všechny github.dev domény
      if (origin && (origin.includes('github.dev') || origin.includes('preview.app.github.dev'))) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});

// CORS preflight options - explicitně povolit
app.options('*', cors());

// Přidat základní routu pro kontrolu, zda server běží
app.get('/', (req, res) => {
  res.json({ message: 'Quiz API server is running' });
});

// Přidat základní routu pro API pro kontrolu, zda API běží
app.get('/api', (req, res) => {
  res.json({ message: 'Quiz API is running' });
});

// Routes s prefixem /api
app.use('/api/auth', authRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

// Explicitní fallback pro přesměrování na frontend
app.get('*', (req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    res.status(404).json({ message: 'API endpoint not found' });
  } else {
    // Pro non-API requesty na vývojovém serveru
    res.redirect('http://localhost:5180');
  }
});

const PORT = parseInt(process.env.PORT || '3001', 10);

mongoose.connect(process.env.MONGODB_URI as string)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`API accessible at http://localhost:${PORT}/api`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });