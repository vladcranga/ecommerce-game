import express from 'express';

const router = express.Router();
import { register, login, getUser, addCoins } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.js';

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', protect, getUser);
router.post('/add-coins', protect, addCoins);

export default router;
