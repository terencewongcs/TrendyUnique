const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  // Get token from header
  const token =
    req.header("x-auth-token") ||
    req.headers?.authorization?.match(/^Bearer (.+)/)[1];

  try {
    // check if token exists
    if (!token) {
      req.user = "anonymous";
    } else {
      // Verify token
      const decoded = await jwt.verify(token, process.env.SECRET_KEY);

      const user = {
        _id: decoded.user,
        role: decoded.role,
      };
      // Add user from payload
      req.user = user;
    }

    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = authMiddleware;
