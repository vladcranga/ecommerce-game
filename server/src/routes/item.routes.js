const express = require('express');

const router = express.Router();
const {
  getItems,
  getItem,
  createItem,
  updateItem,
  deleteItem,
  addReview,
  getItemReviews,
} = require('../controllers/item.controller');

// Middleware for protecting routes
const { protect, admin } = require('../middleware/auth.middleware');

// Public routes
router.get('/', getItems);
router.get('/:id', getItem);
router.get('/:id/reviews', getItemReviews);

// Protected routes (require login)
router.post('/:id/reviews', protect, addReview);

// Admin only routes
router.post('/', protect, admin, createItem);
router.put('/:id', protect, admin, updateItem);
router.delete('/:id', protect, admin, deleteItem);

module.exports = router;
