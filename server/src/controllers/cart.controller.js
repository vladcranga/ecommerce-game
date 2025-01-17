const asyncHandler = require('express-async-handler');
const User = require('../models/user.model');
const Item = require('../models/item.model');

// @desc    Add item to cart
// @route   POST /api/cart/add/:itemId
// @access  Private
const addToCart = asyncHandler(async (req, res) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  const user = await User.findById(userId).populate('cart.item');
  const item = await Item.findById(itemId);

  if (!item) {
    res.status(404);
    throw new Error('Item not found');
  }

  if (item.stock <= 0) {
    res.status(400);
    throw new Error('Item is out of stock');
  }

  // Check if user has enough coins
  if (user.points < item.price) {
    res.status(400);
    throw new Error('Insufficient coins to add item to cart');
  }

  // Check if item is already in cart
  const isInCart = user.cart.some(cartItem => cartItem.item._id.toString() === itemId);
  if (isInCart) {
    res.status(400);
    throw new Error('Item is already in cart');
  }

  // Decrease stock
  item.stock -= 1;
  await item.save();

  // Add to cart
  user.cart.push({ item: itemId });
  await user.save();

  // Populate cart items before sending response
  await user.populate('cart.item');

  res.status(200).json({
    items: user.cart,
    itemStock: item.stock
  });
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:itemId
// @access  Private
const removeFromCart = asyncHandler(async (req, res) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  const user = await User.findById(userId);
  const item = await Item.findById(itemId);

  if (!item) {
    res.status(404);
    throw new Error('Item not found');
  }

  // Remove from cart
  user.cart = user.cart.filter(cartItem => cartItem.item.toString() !== itemId);
  await user.save();

  // Increase stock
  item.stock += 1;
  await item.save();

  // Populate cart items before sending response
  await user.populate('cart.item');

  res.status(200).json({
    items: user.cart,
    itemStock: item.stock
  });
});

// @desc    Purchase items in cart
// @route   POST /api/cart/purchase
// @access  Private
const purchaseCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Get user with populated cart items
  const user = await User.findById(userId).populate({
    path: 'cart.item',
    model: 'Item',
    select: '_id name description imageUrl rarity attributes type price category level stock'
  });

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (user.cart.length === 0) {
    res.status(400);
    throw new Error('Cart is empty');
  }

  // Calculate total cost
  const totalCost = user.cart.reduce((total, cartItem) => {
    if (!cartItem.item || !cartItem.item.price) {
      throw new Error('Invalid item in cart');
    }
    return total + cartItem.item.price;
  }, 0);

  // Check if user has enough points
  if (user.points < totalCost) {
    res.status(400);
    throw new Error('Insufficient funds');
  }

  try {
    // Add items to inventory with full item data
    const now = new Date();
    const newInventoryItems = user.cart.map(cartItem => {
      // Verify item is fully populated
      if (!cartItem.item || !cartItem.item._id) {
        throw new Error('Invalid item data during purchase');
      }

      return {
        item: cartItem.item,  // Store the full item object, not just the ID
        quantity: 1,
        acquiredAt: now
      };
    });

    // Update user in a single operation
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $push: { inventory: { $each: newInventoryItems } },
        $inc: { points: -totalCost },
        $set: { cart: [] }
      },
      { 
        new: true,
        runValidators: true
      }
    ).populate({
      path: 'inventory.item',
      model: 'Item',
      select: '_id name description imageUrl rarity attributes type price category level stock'
    });

    if (!updatedUser) {
      throw new Error('Failed to update user');
    }

    // Double-check population
    const verifiedUser = await User.findById(userId)
      .populate({
        path: 'inventory.item',
        model: 'Item',
        select: '_id name description imageUrl rarity attributes type price category level stock'
      })
      .lean();  // Use lean() for better performance

    if (!verifiedUser) {
      throw new Error('Failed to verify user update');
    }

    // Verify inventory items are properly populated
    const verifiedInventory = verifiedUser.inventory.map(invItem => {
      if (!invItem.item || typeof invItem.item === 'string') {
        console.warn('Unpopulated inventory item detected:', invItem);
        return null;
      }
      return invItem;
    }).filter(Boolean);

    res.status(200).json({
      message: 'Purchase successful',
      user: {
        points: verifiedUser.points,
        inventory: verifiedInventory,
        cart: verifiedUser.cart
      }
    });
  } catch (error) {
    console.error('Purchase error:', error);
    res.status(500).json({
      message: 'Failed to complete purchase',
      error: error.message
    });
  }
});

// @desc    Get cart items
// @route   GET /api/cart
// @access  Private
const getCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId).populate('cart.item');

  res.status(200).json({
    items: user.cart
  });
});

module.exports = {
  addToCart,
  removeFromCart,
  purchaseCart,
  getCart
};
