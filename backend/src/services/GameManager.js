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
    const gameId = uuidv4();
    const game = new GameEngine(gameId, settings);
    game.initGame(hostId, settings);
    this.games.set(gameId, game);
    return gameId;
  }

  getGame(gameId) {
    return this.games.get(gameId);
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
