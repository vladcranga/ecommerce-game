const express = require('express');

const router = express.Router();
const { register, login, getUser, addCoins } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', protect, getUser);
router.post('/add-coins', protect, addCoins);

module.exports = router;
