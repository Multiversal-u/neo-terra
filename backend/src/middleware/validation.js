function validateGameCreation(req, res, next) {
  const { hostId } = req.body;
  if (!hostId) {
    return res.status(400).json({ error: 'hostId is required' });
  }
  next();
}

function validateJoin(req, res, next) {
  const { playerId, companyName } = req.body;
  if (!playerId || !companyName) {
    return res.status(400).json({ error: 'playerId and companyName are required' });
  }
  next();
}

module.exports = { validateGameCreation, validateJoin };
