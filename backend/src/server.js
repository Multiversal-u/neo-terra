require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const gameRoutes = require('./routes/gameRoutes');
const adminRoutes = require('./routes/adminRoutes');
const GameManager = require('./services/GameManager');
const { registerGameSockets } = require('./sockets/gameSocket');

const app = express();
const server = http.createServer(app);

// CORS configuration: Allow configured FRONTEND_URL, localhost, and any vercel preview deployment
const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests or any vercel.app / localhost
    if (!origin || origin.includes('localhost') || origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    if (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL) {
      return callback(null, true);
    }
    return callback(null, true); // Permissive for university exposition
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
};

const io = new Server(server, {
  cors: corsOptions
});

// Middleware
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());

// Root health check route
app.get('/', (req, res) => {
  res.json({
    status: 'NEO-TERRA Backend Online',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// High-capacity rate limiter for multiplayer classroom sessions
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100000, // 100,000 requests allowed for active 30-50 player sessions
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});
app.use(limiter);

// Make GameManager available to routes
app.locals.gameManager = GameManager;

// Routes
app.use('/api/game', gameRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/players', (req, res) => res.json({ status: 'Player routes pending' })); // Placeholder as requested routing is mainly game and admin

// Socket.io handlers
registerGameSockets(io, GameManager);

const PORT = process.env.PORT || 3001;

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`[NEO-TERRA] Backend server running on port ${PORT}`);
  });
}

module.exports = { app, server, io };
