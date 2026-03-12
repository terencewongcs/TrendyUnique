const express = require('express');
const router = express.Router();
const {
  register,
  login,
  updatePassword,
} = require('../controllers/auth');
const authMiddleware = require('../middlewares/auth');

router.post('/register', register);
router.post('/login', login);
router.put('/updatePassword', authMiddleware, updatePassword);

module.exports = router;
