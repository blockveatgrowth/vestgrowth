import mongoose, { Schema, Document } from 'mongoose';

export interface IReferral extends Document {
  userId: mongoose.Types.ObjectId;
  referrerId: mongoose.Types.ObjectId;
  level: number;
  commissionPercentage: number;
  totalEarnings: number;
  createdAt: Date;
  updatedAt: Date;
}

const ReferralSchema = new Schema<IReferral>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    referrerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    level: {
      type: Number,
      enum: [1, 2, 3, 4, 5],
      required: true,
    },
    commissionPercentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    totalEarnings: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

// Create a compound index for userId and referrerId to ensure uniqueness
ReferralSchema.index({ userId: 1, referrerId: 1, level: 1 }, { unique: true });

export default mongoose.models.Referral || mongoose.model<IReferral>('Referral', ReferralSchema); 