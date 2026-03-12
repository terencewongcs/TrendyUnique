const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProduct
} = require('../controllers/product');

// Public routes — no auth required
router.get('/', getAllProducts);
router.get('/:id', getProduct);

module.exports = router;
