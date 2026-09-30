const express = require('express');
const router = express.Router();

router.get('/:gameId/dashboard', (req, res) => {
  const gameManager = req.app.locals.gameManager;
  const game = gameManager.getGame(req.params.gameId);
  if (!game) return res.status(404).json({ error: 'Game not found' });
  
  res.json({ success: true, data: game }); // Admin gets full access
});

router.post('/:gameId/nextRound', (req, res) => {
  const gameManager = req.app.locals.gameManager;
  const game = gameManager.getGame(req.params.gameId);
  if (!game) return res.status(404).json({ error: 'Game not found' });
  
  try {
    const roundData = game.startRound();
    if (!roundData) {
      return res.json({ success: true, finished: true, results: game.endGame() });
    }
    res.json({ success: true, round: roundData });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/:gameId/pause', (req, res) => {
  const gameManager = req.app.locals.gameManager;
  const game = gameManager.getGame(req.params.gameId);
  if (!game) return res.status(404).json({ error: 'Game not found' });
  
  game.state = game.state === 'paused' ? 'playing' : 'paused';
  res.json({ success: true, state: game.state });
});

router.get('/:gameId/events', (req, res) => {
  const gameManager = req.app.locals.gameManager;
  const game = gameManager.getGame(req.params.gameId);
  if (!game) return res.status(404).json({ error: 'Game not found' });
  
  res.json({ success: true, events: game.events });
});

router.post('/:gameId/injectEvent', (req, res) => {
  const { event } = req.body;
  const gameManager = req.app.locals.gameManager;
  const game = gameManager.getGame(req.params.gameId);
  if (!game) return res.status(404).json({ error: 'Game not found' });
  
  game.events.push(event);
  res.json({ success: true, injected: true });
});

module.exports = router;
