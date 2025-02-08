const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

// Register a new user
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user with default values
    const user = await User.create({
      username,
      email,
      password,
      points: 0,
      level: 1,
      inventory: [],
      equippedItems: {
        weapon: null,
        helmet: null,
        chestpiece: null,
        boots: null,
        potion: null,
      },
      stats: {
        damage: 10,
        defense: 5,
        speed: 10,
        health: 100,
      },
    });

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    return res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        points: user.points,
        level: user.level,
        inventory: user.inventory,
        equippedItems: user.equippedItems,
        stats: user.stats,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user and populate inventory items
    const user = await User.findOne({ email })
      .populate({
        path: 'inventory.item',
        model: 'Item',
      })
      .populate({
        path: 'equippedItems.weapon',
        model: 'Item',
      })
      .populate({
        path: 'equippedItems.helmet',
        model: 'Item',
      })
      .populate({
        path: 'equippedItems.chestpiece',
        model: 'Item',
      })
      .populate({
        path: 'equippedItems.boots',
        model: 'Item',
      })
      .populate({
        path: 'equippedItems.potion',
        model: 'Item',
      });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    return res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        points: user.points,
        level: user.level,
        inventory: user.inventory,
        equippedItems: user.equippedItems,
        stats: user.stats,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user data
exports.getUser = async (req, res) => {
  try {
    // User is already populated by the auth middleware
    const { user } = req;

    return res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      points: user.points,
      level: user.level,
      inventory: user.inventory,
      equippedItems: user.equippedItems,
      stats: user.stats,
    });
  } catch (error) {
    console.error('Error in getUser:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add coins to user
exports.addCoins = async (req, res) => {
  try {
    const { amount } = req.body;

    // Validate amount
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    // Update user's coins
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $inc: { points: amount } },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({
      message: `Added ${amount} coins successfully`,
      points: user.points,
    });
  } catch (error) {
    console.error('Error adding coins:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};
