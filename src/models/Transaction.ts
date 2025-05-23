import mongoose from 'mongoose';

export interface TransactionDocument extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  type: 'deposit' | 'withdrawal';
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  planId?: mongoose.Types.ObjectId;  // Reference to the selected plan
  bankId?: string;  // Reference to the selected bank for deposits
  transactionId?: string;
  accountDetails?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  approvedBy?: mongoose.Types.ObjectId;
  approvedAt?: Date;
  ticketId?: mongoose.Types.ObjectId;
}

const transactionSchema = new mongoose.Schema<TransactionDocument>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    type: {
      type: String,
      enum: ['deposit', 'withdrawal'],
      required: [true, 'Transaction type is required'],
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [30, 'Minimum deposit amount is 30'],
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Plan',
      required: [
        function(this: TransactionDocument) {
          return this.type === 'deposit';
        },
        'Plan selection is required for deposits'
      ],
    },
    bankId: {
      type: String,
      required: [
        function(this: TransactionDocument) {
          return this.type === 'deposit';
        },
        'Bank selection is required for deposits'
      ],
    },
    transactionId: {
      type: String,
      trim: true,
    },
    accountDetails: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    approvedAt: {
      type: Date,
    },
    ticketId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ticket',
    },
  },
  {
    timestamps: true,
  }
);

// Add validation to ensure plan amount matches deposit amount
transactionSchema.pre('save', async function(next) {
  if (this.type === 'deposit' && this.planId) {
    const Plan = mongoose.models.Plan;
    const selectedPlan = await Plan.findById(this.planId);
    
    if (!selectedPlan) {
      throw new Error('Selected plan not found');
    }
    
    if (this.amount < selectedPlan.minAmount || this.amount > selectedPlan.maxAmount) {
      throw new Error(`Deposit amount must be between $${selectedPlan.minAmount} and $${selectedPlan.maxAmount} for ${selectedPlan.name}`);
    }
  }
  next();
});

// Check if the model exists before creating it to avoid model overwrite errors
export const Transaction = mongoose.models.Transaction || 
  mongoose.model<TransactionDocument>('Transaction', transactionSchema); 