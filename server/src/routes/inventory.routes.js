import express from 'express';

const router = express.Router();
import { protect } from '../middleware/auth.middleware.js';
import { equipItem, unequipItem } from '../controllers/inventory.controller.js';

router.post('/equip/:itemId', protect, equipItem);
router.post('/unequip/:slot', protect, unequipItem);

export default router;
