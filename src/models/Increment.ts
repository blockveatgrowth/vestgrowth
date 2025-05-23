import mongoose from 'mongoose';

export interface IProfit extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  depositId: mongoose.Types.ObjectId;
  amount: number;
  date: Date;
  profitType: 'daily' | 'referral' | 'welcome';
  status: 'pending' | 'completed';
  referrerEarnings?: {
    [key: string]: number;
  };
  isAddedToBalance: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const profitSchema = new mongoose.Schema<IProfit>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  depositId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  profitType: {
    type: String,
    enum: ['daily', 'referral', 'welcome'],
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending',
  },
  referrerEarnings: {
    type: Map,
    of: Number,
  },
  isAddedToBalance: {
    type: Boolean,
    default: false,
  }
}, {
  timestamps: true,
});

// Add indexes
profitSchema.index({ userId: 1, date: 1 });
profitSchema.index({ status: 1 });
profitSchema.index({ createdAt: 1 });
profitSchema.index({ depositId: 1 });
profitSchema.index({ isAddedToBalance: 1 });

export const Profit = mongoose.models.Profit || mongoose.model<IProfit>('Profit', profitSchema); 