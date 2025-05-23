import mongoose from 'mongoose';

export interface IPlan extends mongoose.Document {
  name: string;
  minAmount: number;
  maxAmount: number;
  directCommissionPercentage: number;
  dailyProfit: number; // Daily profit percentage
  referralCommissions: {
    level1: number;
    level2: number;
    level3: number;
    level4: number;
    level5: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const planSchema = new mongoose.Schema<IPlan>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    minAmount: {
      type: Number,
      required: true,
    },
    maxAmount: {
      type: Number,
      required: true,
    },
    directCommissionPercentage: {
      type: Number,
      required: true,
    },
    dailyProfit: {
      type: Number,
      required: true,
      default: 2, // Default to 2% if not specified
    },
    referralCommissions: {
      level1: {
        type: Number,
        required: true,
      },
      level2: {
        type: Number,
        required: true,
      },
      level3: {
        type: Number,
        required: true,
      },
      level4: {
        type: Number,
        required: true,
      },
      level5: {
        type: Number,
        required: true,
      },
    },
  },
  { timestamps: true }
);

export const Plan = mongoose.models.Plan || mongoose.model<IPlan>('Plan', planSchema); 