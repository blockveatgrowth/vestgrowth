import mongoose from 'mongoose';
import crypto from 'crypto';

export interface UserDocument extends mongoose.Document {
  name: string;
  email: string;
  password?: string;
  role: "admin" | "user";
  googleId?: string;
  profileImage?: string;
  referralCode: string;
  referredBy?: mongoose.Types.ObjectId;
  referralCount: number;
  referralEarnings: number;
  balance: number;
  hasReceivedWelcomeBonus: boolean;
  avatar: string;
  resetToken: string;
  resetTokenExpiry: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema<UserDocument>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: false,
    },
    googleId: {
      type: String,
      sparse: true,
    },
    profileImage: {
      type: String,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    referralCode: {
      type: String,
      unique: true,
      default: () => crypto.randomBytes(4).toString('hex').toUpperCase(),
    },
    referredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      sparse: true,
    },
    referralCount: {
      type: Number,
      default: 0,
    },
    referralEarnings: {
      type: Number,
      default: 0,
    },
    balance: {
      type: Number,
      default: 0,
    },
    hasReceivedWelcomeBonus: {
      type: Boolean,
      default: false,
    },
    avatar: {
      type: String,
    },
    resetToken: {
      type: String,
    },
    resetTokenExpiry: {
      type: Date,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to ensure every user has a unique referral code
userSchema.pre('save', async function (next) {
  // Only generate referral code if it's not set
  if (!this.referralCode) {
    // Generate a longer code to reduce collision probability
    let code = crypto.randomBytes(6).toString('hex').toUpperCase();
    
    // Add timestamp to ensure uniqueness without needing a DB query
    code = `${code}${Date.now().toString(36)}`;
    
    this.referralCode = code;
  }
  this.updatedAt = new Date();
  next();
});

// Check if the model exists before creating it to avoid model overwrite errors
export const User = mongoose.models.User || mongoose.model<UserDocument>('User', userSchema); 