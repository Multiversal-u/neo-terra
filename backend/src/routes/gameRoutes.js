const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

router.post('/create', (req, res) => {
  const { hostId, settings } = req.body;
  const gameManager = req.app.locals.gameManager;
  
  try {
    const gameId = gameManager.createGame(hostId || uuidv4(), settings || {});
    res.json({ success: true, gameId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:gameId', (req, res) => {
  const gameManager = req.app.locals.gameManager;
  const game = gameManager.getGame(req.params.gameId);
  if (!game) return res.status(404).json({ error: 'Game not found' });
  
  res.json({ success: true, state: game.getPublicGameState() });
});

router.post('/:gameId/join', (req, res) => {
  const { playerId, companyName } = req.body;
  const gameManager = req.app.locals.gameManager;
  const game = gameManager.getGame(req.params.gameId);
  if (!game) return res.status(404).json({ error: 'Game not found' });
  
  try {
    const company = game.addCompany(playerId, companyName);
    res.json({ success: true, company });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/:gameId/company/:playerId', (req, res) => {
  const gameManager = req.app.locals.gameManager;
  const game = gameManager.getGame(req.params.gameId);
  if (!game) return res.status(404).json({ error: 'Game not found' });
  
  const company = game.getCompanyState(req.params.playerId);
  if (!company) return res.status(404).json({ error: 'Company not found in this game' });
  
  res.json({ success: true, company });
});

router.post('/:gameId/start', (req, res) => {
  const gameManager = req.app.locals.gameManager;
  const game = gameManager.getGame(req.params.gameId);
  if (!game) return res.status(404).json({ error: 'Game not found' });
  
  try {
    game.startGame();
    res.json({ success: true, state: game.getPublicGameState() });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/:gameId/decision', (req, res) => {
  const { playerId, decision } = req.body;
  const gameManager = req.app.locals.gameManager;
  const game = gameManager.getGame(req.params.gameId);
  if (!game) return res.status(404).json({ error: 'Game not found' });

  try {
    const result = game.submitDecision(playerId, decision);
    res.json({ success: true, result });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/:gameId/emergencyDecision', (req, res) => {
  const { playerId, optionId } = req.body;
  const gameManager = req.app.locals.gameManager;
  const game = gameManager.getGame(req.params.gameId);
  if (!game) return res.status(404).json({ error: 'Game not found' });

  try {
    const result = game.submitEmergencyDecision(playerId, optionId);
    res.json({ success: true, result });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/:gameId/qr', (req, res) => {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const joinUrl = `${frontendUrl}/?code=${req.params.gameId}`;
  res.json({ success: true, joinUrl });
});

module.exports = router;
