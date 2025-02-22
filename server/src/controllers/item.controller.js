import Item from '../models/item.model.js';

// Get all items with filtering
export const getItems = async (req, res) => {
  try {
    const { category, rarity, minLevel, maxPrice, search, populateQuest } = req.query;
    const query = {};

    // Apply filters if they exist
    if (category) query.category = category;
    if (rarity) query.rarity = rarity;
    if (minLevel) query.level = { $gte: parseInt(minLevel, 10) };
    if (maxPrice) query.price = { $lte: parseInt(maxPrice, 10) };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    let items = await Item.find(query)
      .populate('questRequirement', 'name description')
      .sort('-createdAt')
      .exec();

    if (populateQuest) {
      items = await Item.populate(items, 'questRequirement');
    }

    return res.json(items);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching items', error: error.message });
  }
};

// Get single item by ID
export const getItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate('questRequirement')
      .populate('reviews.user', 'username');

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    return res.json(item);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching item', error: error.message });
  }
};

// Create new item
export const createItem = async (req, res) => {
  try {
    const item = new Item(req.body);
    await item.save();
    return res.status(201).json(item);
  } catch (error) {
    return res.status(400).json({ message: 'Error creating item', error: error.message });
  }
};

// Update item
export const updateItem = async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true },
    );

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    return res.json(item);
  } catch (error) {
    return res.status(400).json({ message: 'Error updating item', error: error.message });
  }
};

// Delete item
export const deleteItem = async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    return res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting item', error: error.message });
  }
};

// Add review to item
export const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const userId = req.user.id; // This will come from auth middleware

    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Check if user has already reviewed
    const hasReviewed = item.reviews.some((review) => review.user.toString() === userId);

    if (hasReviewed) {
      return res.status(400).json({ message: 'You have already reviewed this item' });
    }

    const newReview = {
      user: userId,
      rating,
      comment,
    };

    item.reviews.push(newReview);
    await item.save();

    // Fetch the updated item
    const updatedItem = await Item.findById(req.params.id).populate('reviews.user', 'username');

    return res.json(updatedItem);
  } catch (error) {
    return res.status(400).json({ message: 'Error adding review', error: error.message });
  }
};

// Get item reviews
export const getItemReviews = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
      .select('reviews')
      .populate('reviews.user', 'username');

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    return res.json(item.reviews);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching reviews', error: error.message });
  }
};

// Edit review
export const editReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const userId = req.user.id;

    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    const review = item.reviews.find((review) => review.user.toString() === userId);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    review.rating = rating;
    review.comment = comment;

    await item.save();

    // Fetch the updated item
    const updatedItem = await Item.findById(req.params.id).populate('reviews.user', 'username');

    return res.json(updatedItem);
  } catch (error) {
    return res.status(500).json({ message: 'Error updating review', error: error.message });
  }
};

// Delete review
export const deleteReview = async (req, res) => {
  try {
    const userId = req.user.id;

    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    const reviewIndex = item.reviews.findIndex((review) => review.user.toString() === userId);

    if (reviewIndex === -1) {
      return res.status(404).json({ message: 'Review not found' });
    }

    item.reviews.splice(reviewIndex, 1);
    await item.save();
    return res.json(item);
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting review', error: error.message });
  }
};
