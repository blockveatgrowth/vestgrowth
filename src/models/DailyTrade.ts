import mongoose from 'mongoose';

export interface IDailyTrade extends mongoose.Document {
  date: Date;           // The date of the trade (day only)
  pair: string;         // e.g. "BTC/USDT"
  buyPrice: number;     // Price at open
  sellPrice: number;    // Price at close
  tradePercent: number; // Positive = profit, negative = loss
  isProfit: boolean;
  createdAt: Date;
}

const dailyTradeSchema = new mongoose.Schema<IDailyTrade>(
  {
    date: { type: Date, required: true, unique: true },
    pair: { type: String, required: true },
    buyPrice: { type: Number, required: true },
    sellPrice: { type: Number, required: true },
    tradePercent: { type: Number, required: true },
    isProfit: { type: Boolean, required: true },
  },
  { timestamps: true }
);

dailyTradeSchema.index({ date: -1 });

export const DailyTrade =
  mongoose.models.DailyTrade ||
  mongoose.model<IDailyTrade>('DailyTrade', dailyTradeSchema);
