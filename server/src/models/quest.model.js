import mongoose from 'mongoose';

const questSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    requirements: {
      pointsNeeded: {
        type: Number,
        default: 0,
      },
      level: {
        type: Number,
        default: 1,
      },
      itemsRequired: [
        {
          item: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Item',
          },
          quantity: {
            type: Number,
            default: 1,
          },
        },
      ],
    },
    rewards: {
      points: {
        type: Number,
        default: 0,
      },
      experience: {
        type: Number,
        default: 0,
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

const Quest = mongoose.model('Quest', questSchema);
export default Quest;
