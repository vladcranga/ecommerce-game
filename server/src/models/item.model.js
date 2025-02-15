import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      enum: ['weapon', 'helmet', 'chestpiece', 'boots', 'potion', 'mount'],
    },
    rarity: {
      type: String,
      required: true,
      enum: ['common', 'uncommon', 'rare', 'epic', 'legendary'],
      default: 'common',
    },
    attributes: {
      damage: { type: Number, default: 0 },
      defense: { type: Number, default: 0 },
      magic: { type: Number, default: 0 },
      speed: { type: Number, default: 0 },
      health: { type: Number, default: 0 },
    },
    level: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 1,
    },
    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        rating: {
          type: Number,
          required: true,
          min: 1,
          max: 5,
        },
        comment: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    questRequirement: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quest',
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

itemSchema.virtual('averageRating').get(function calculateAverageRating() {
  if (!this.reviews || this.reviews.length === 0) return 0;
  const sum = this.reviews.reduce((total, review) => total + review.rating, 0);
  return (sum / this.reviews.length).toFixed(1);
});

const Item = mongoose.model('Item', itemSchema);
export default Item;
