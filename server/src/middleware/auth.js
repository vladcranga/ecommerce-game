import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      const [, authToken] = req.headers.authorization.split(' ');
      token = authToken;
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized - No token' });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from database and populate inventory items
      const user = await User.findById(decoded.id)
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
        })
        .select('-password'); // Exclude password from the response

      if (!user) {
        return res.status(401).json({ message: 'Not authorized - User not found' });
      }

      // Add user to request object
      req.user = user;
      return next();
    } catch (error) {
      console.error('Token verification error:', error);
      return res.status(401).json({ message: 'Not authorized - Invalid token' });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ message: 'Server error in auth middleware' });
  }
};
