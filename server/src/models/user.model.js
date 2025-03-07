import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    points: {
      type: Number,
      default: 75,
    },
    level: {
      type: Number,
      default: 1,
    },
    inventory: [
      {
        item: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Item',
        },
        quantity: {
          type: Number,
          default: 1,
        },
        acquiredAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    cart: [
      {
        item: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Item',
          required: true,
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    equippedItems: {
      weapon: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        default: null,
      },
      helmet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        default: null,
      },
      chestpiece: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        default: null,
      },
      boots: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        default: null,
      },
      potion: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        default: null,
      },
    },
    stats: {
      health: {
        type: Number,
        default: 100,
      },
      defense: {
        type: Number,
        default: 5,
      },
      damage: {
        type: Number,
        default: 10,
      },
      magic: {
        type: Number,
        default: 0,
      },
      speed: {
        type: Number,
        default: 10,
      },
    },
    achievements: [
      {
        name: String,
        description: String,
        unlockedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    gameStats: {
      gamesPlayed: {
        type: Number,
        default: 0,
      },
      questsCompleted: {
        type: Number,
        default: 0,
      },
      totalTimePlayed: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  },
);

// Hash password before saving
userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (error) {
    return next(error);
  }
});

// Method to compare passwords
userSchema.methods.matchPassword = async function comparePassword(enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
