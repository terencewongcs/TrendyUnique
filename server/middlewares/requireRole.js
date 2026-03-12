const requireRole = (role) => (req, res, next) => {
  if (!req.user || req.user === 'anonymous') {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  if (req.user.role !== role) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  next();
};

module.exports = requireRole;
