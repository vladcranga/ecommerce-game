import asyncHandler from 'express-async-handler';
import User from '../models/user.model.js';
import Item from '../models/item.model.js';

// @desc    Equip an item
// @route   POST /api/users/equip/:itemId
// @access  Private
export const equipItem = asyncHandler(async (req, res) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  const user = await User.findById(userId);
  const item = await Item.findById(itemId);

  if (!user || !item) {
    res.status(404);
    throw new Error('User or item not found');
  }

  // Check if item exists in user's inventory
  const inventoryItem = user.inventory.find((invItem) => invItem.item.toString() === itemId);

  if (!inventoryItem) {
    res.status(400);
    throw new Error('Item not in inventory');
  }

  // Check if item slot is valid
  const validSlots = ['weapon', 'helmet', 'chestpiece', 'boots', 'potion'];
  if (!validSlots.includes(item.category)) {
    res.status(400);
    throw new Error('Invalid item category');
  }

  // Unequip current item in that slot if exists
  const currentEquipped = user.equippedItems[item.category];
  if (currentEquipped) {
    user.equippedItems[item.category] = null;
  }

  // Equip new item
  user.equippedItems[item.category] = itemId;

  // Update user stats based on item attributes
  if (item.attributes) {
    Object.entries(item.attributes).forEach(([stat, value]) => {
      if (user.stats[stat] !== undefined) {
        user.stats[stat] += value;
      }
    });
  }

  await user.save();

  res.json({
    message: 'Item equipped successfully',
    equippedItems: user.equippedItems,
    stats: user.stats,
  });
});

// @desc    Unequip an item
// @route   POST /api/users/unequip/:slot
// @access  Private
export const unequipItem = asyncHandler(async (req, res) => {
  const { slot } = req.params;
  const userId = req.user._id;

  const user = await User.findById(userId);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Validate slot
  const validSlots = ['weapon', 'helmet', 'chestpiece', 'boots', 'potion'];
  if (!validSlots.includes(slot)) {
    res.status(400);
    throw new Error('Invalid slot');
  }

  // Get currently equipped item
  const equippedItemId = user.equippedItems[slot];
  if (!equippedItemId) {
    res.status(400);
    throw new Error('No item equipped in this slot');
  }

  // Find item to get its stats
  const item = await Item.findById(equippedItemId);
  if (!item) {
    res.status(404);
    throw new Error('Equipped item not found');
  }

  // Remove item stats from user
  if (item.attributes) {
    Object.entries(item.attributes).forEach(([stat, value]) => {
      if (user.stats[stat] !== undefined) {
        user.stats[stat] -= value;
      }
    });
  }

  // Unequip item
  user.equippedItems[slot] = null;
  await user.save();

  res.json({
    message: 'Item unequipped successfully',
    equippedItems: user.equippedItems,
    stats: user.stats,
  });
});
