const express = require('express');
const router = express.Router();

router.get('/:gameId/dashboard', (req, res) => {
  const gameManager = req.app.locals.gameManager;
  const game = gameManager.getGame(req.params.gameId);
  if (!game) return res.status(404).json({ error: 'Game not found' });
  
  res.json({ success: true, data: game }); // Admin gets full access
});

router.post('/:gameId/calculateRound', (req, res) => {
  const gameManager = req.app.locals.gameManager;
  const game = gameManager.getGame(req.params.gameId);
  if (!game) return res.status(404).json({ error: 'Game not found' });

  try {
    const results = game.calculateRoundResults();
    res.json({ success: true, results, state: game.getPublicGameState() });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/:gameId/endGame', (req, res) => {
  const gameManager = req.app.locals.gameManager;
  const game = gameManager.getGame(req.params.gameId);
  if (!game) return res.status(404).json({ error: 'Game not found' });

  try {
    const results = game.endGame();
    res.json({ success: true, finished: true, results, state: game.getPublicGameState() });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/:gameId/nextRound', (req, res) => {
  const gameManager = req.app.locals.gameManager;
  const game = gameManager.getGame(req.params.gameId);
  if (!game) return res.status(404).json({ error: 'Game not found' });
  
  try {
    const roundData = game.startRound();
    if (!roundData || roundData.state === 'finished' || game.state === 'finished') {
      const results = roundData?.state === 'finished' ? roundData : game.endGame();
      return res.json({ success: true, finished: true, results, state: game.getPublicGameState() });
    }
    res.json({ success: true, round: roundData, state: game.getPublicGameState() });
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

router.post('/:gameId/emergency', (req, res) => {
  const { emergencyId } = req.body;
  const gameManager = req.app.locals.gameManager;
  const game = gameManager.getGame(req.params.gameId);
  if (!game) return res.status(404).json({ error: 'Game not found' });

  try {
    const emergency = game.triggerEmergency(emergencyId);
    res.json({ success: true, emergency });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/:gameId/resolveEmergency', (req, res) => {
  const gameManager = req.app.locals.gameManager;
  const game = gameManager.getGame(req.params.gameId);
  if (!game) return res.status(404).json({ error: 'Game not found' });

  try {
    const summary = game.resolveEmergency();
    res.json({ success: true, summary });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
