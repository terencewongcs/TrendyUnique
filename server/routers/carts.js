const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const {
  getAllProductsFromCart,
  addOneProductToCart,
  updateOneProductInCart,
  deleteOneProductInCart
} = require('../controllers/cart');

router.get('/', authMiddleware, getAllProductsFromCart);

router.post('/:productId', authMiddleware, addOneProductToCart);

router.patch('/:productId', authMiddleware, updateOneProductInCart);

router.delete('/:productId', authMiddleware, deleteOneProductInCart);

module.exports = router;
