const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const {
  addToCart,
  removeFromCart,
  purchaseCart,
  getCart
} = require('../controllers/cart.controller');

router.get('/', protect, getCart);
router.post('/add/:itemId', protect, addToCart);
router.delete('/remove/:itemId', protect, removeFromCart);
router.post('/purchase', protect, purchaseCart);

module.exports = router;
