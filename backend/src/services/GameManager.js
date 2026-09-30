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
    return this.games.get(gameId.toUpperCase()) || this.games.get(gameId);
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
