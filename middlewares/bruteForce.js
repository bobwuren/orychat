const attempts = new Map();

const bruteForceProtection = (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  const key = `${ip}_${(req.body && req.body.email) ? req.body.email : 'unknown'}`;
  const current = attempts.get(key) || {count: 0, lastAttempt: Date.now()};

  // Reset après 1 heure
  if (Date.now() - current.lastAttempt > 3600000) {
    current.count = 0;
  }

  if (current.count >= 10) {
    console.warn("🔒 Compte temporairement bloqué pour sécurité:", key);
    return res.status(429).json({
      error: 'Compte temporairement bloqué pour sécurité'
    });
  }

  // Middleware pour incrémenter en cas d'échec
  const originalJson = res.json;
  res.json = function (data) {
    if (res.statusCode === 401 || res.statusCode === 400) {
      current.count++;
      current.lastAttempt = Date.now();
      attempts.set(key, current);
    } else if (res.statusCode === 200) {
      // Succès, reset le compteur
      attempts.delete(key);
    }
    originalJson.call(this, data);
  };

  next();
};

module.exports = bruteForceProtection;