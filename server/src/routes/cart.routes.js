import express from 'express';

const router = express.Router();
import { protect } from '../middleware/auth.middleware.js';
import {
  addToCart,
  removeFromCart,
  purchaseCart,
  getCart,
} from '../controllers/cart.controller.js';

router.get('/', protect, getCart);
router.post('/add/:itemId', protect, addToCart);
router.delete('/remove/:itemId', protect, removeFromCart);
router.post('/purchase', protect, purchaseCart);

export default router;
