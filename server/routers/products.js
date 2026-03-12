const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const {
  getAllProducts,
  createProduct,
  updateProduct,
  getProduct
} = require('../controllers/product');

router.get('/', auth, getAllProducts);
router.get('/:id', getProduct);
router.post('/create', auth, createProduct);
router.patch('/:id', auth, updateProduct);

module.exports = router;
