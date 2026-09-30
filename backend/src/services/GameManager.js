const GameEngine = require('../models/GameEngine');
const { v4: uuidv4 } = require('uuid');

class GameManagerService {
  constructor() {
    if (!GameManagerService.instance) {
      this.games = new Map();
      GameManagerService.instance = this;
    }
    return GameManagerService.instance;
  }

  createGame(hostId, settings = {}) {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let gameId = '';
    for (let i = 0; i < 6; i++) {
      gameId += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const game = new GameEngine(gameId, settings);
    game.initGame(hostId, settings);
    this.games.set(gameId, game);
    return gameId;
  }

  getGame(gameId) {
    if (!gameId) return null;
    const key = gameId.toUpperCase();
    let game = this.games.get(key) || this.games.get(gameId);
    if (!game) {
      // Auto-recover so server restarts during live sessions never break ongoing rooms
      game = new GameEngine(key);
      game.initGame('host_auto');
      this.games.set(key, game);
    }
    return game;
  }

  deleteGame(gameId) {
    return this.games.delete(gameId);
  }

  listActiveGames() {
    return Array.from(this.games.keys());
  }
}

const instance = new GameManagerService();
module.exports = instance;
