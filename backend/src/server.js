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

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
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
