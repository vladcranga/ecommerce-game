import express from 'express';

const router = express.Router();
import {
  getItems,
  getItem,
  createItem,
  updateItem,
  deleteItem,
  addReview,
  getItemReviews,
  editReview,
  deleteReview,
} from '../controllers/item.controller.js';

// Middleware for protecting routes
import { protect, admin } from '../middleware/auth.middleware.js';

// Public routes
router.get('/', getItems);
router.get('/:id', getItem);
router.get('/:id/reviews', getItemReviews);

// Protected routes (require login)
router.post('/:id/reviews', protect, addReview);
router.put('/:id/reviews', protect, editReview);
router.delete('/:id/reviews', protect, deleteReview);

// Admin only routes
router.post('/', protect, admin, createItem);
router.put('/:id', protect, admin, updateItem);
router.delete('/:id', protect, admin, deleteItem);

export default router;
