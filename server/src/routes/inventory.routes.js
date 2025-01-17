const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { equipItem, unequipItem } = require('../controllers/inventory.controller');

router.post('/equip/:itemId', protect, equipItem);
router.post('/unequip/:slot', protect, unequipItem);

module.exports = router;
