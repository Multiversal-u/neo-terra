function registerGameSockets(io, gameManager) {
  io.on('connection', (socket) => {
    console.log(`[Socket] Connected: ${socket.id}`);

    socket.on('joinGame', ({ gameId, playerId }) => {
      socket.join(`game_${gameId}`);
      socket.join(`player_${playerId}`);
      
      const game = gameManager.getGame(gameId);
      if (game) {
        socket.emit('gameState', game.getPublicGameState());
        io.to(`game_${gameId}`).emit('playerJoined', { playerId });
      } else {
        socket.emit('error', 'Game not found');
      }
    });

    socket.on('submitDecision', ({ gameId, playerId, decision }) => {
      const game = gameManager.getGame(gameId);
      if (!game) return socket.emit('error', 'Game not found');
      
      try {
        const results = game.submitDecision(playerId, decision);
        if (results) {
          // All decided, round results computed
          io.to(`game_${gameId}`).emit('roundEnd', {
            world: results.updatedWorld,
            events: results.triggeredEvents
          });
          results.newsItems.forEach(news => io.to(`game_${gameId}`).emit('newsUpdate', news));
          
          // Send private states
          for (const company of game.companies.values()) {
            io.to(`player_${company.id}`).emit('companyUpdate', company);
          }
        }
      } catch (err) {
        socket.emit('error', err.message);
      }
    });

    socket.on('requestState', ({ gameId, playerId }) => {
      const game = gameManager.getGame(gameId);
      if (game) {
        socket.emit('gameState', game.getPublicGameState());
        if (playerId) {
          const comp = game.getCompanyState(playerId);
          if (comp) socket.emit('companyUpdate', comp);
        }
      }
    });

    socket.on('adminJoin', ({ gameId }) => {
      socket.join(`admin_${gameId}`);
      console.log(`Admin joined room admin_${gameId}`);
    });

    socket.on('adminNextRound', ({ gameId }) => {
      const game = gameManager.getGame(gameId);
      if (!game) return socket.emit('error', 'Game not found');
      
      const round = game.startRound();
      if (round) {
        io.to(`game_${gameId}`).emit('roundStart', round);
      } else {
        io.to(`game_${gameId}`).emit('gameEnd', game.endGame());
      }
    });

    socket.on('adminPause', ({ gameId }) => {
      const game = gameManager.getGame(gameId);
      if (game) {
        game.state = game.state === 'paused' ? 'playing' : 'paused';
        io.to(`game_${gameId}`).emit('gameState', game.getPublicGameState());
      }
    });

    socket.on('disconnect', () => {
      console.log(`[Socket] Disconnected: ${socket.id}`);
    });
  });
}

module.exports = { registerGameSockets };
