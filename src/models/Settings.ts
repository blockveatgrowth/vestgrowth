import mongoose from 'mongoose';

export interface ISettings extends mongoose.Document {
  // Wallet addresses for deposits
  wallets: {
    trc20: string;
    erc20: string;
    bep20: string;
  };
  // Bonus settings
  welcomeBonus: number;            // Legacy fixed $ amount (kept for compat)
  welcomeBonusPercent: number;     // % of deposit given as welcome bonus
  directCommissionPercent: number; // % of deposit as direct commission on first deposit
  referralBonus: number;           // % of deposit distributed across referral levels
  // Withdrawal settings
  withdrawalThreshold: number; // Minimum balance to withdraw
  // Trade simulation settings
  tradeEnabled: boolean;
  tradeMinProfit: number;
  tradeMaxProfit: number;
  tradeMinLoss: number;
  tradeMaxLoss: number;
  tradeLossDaysPerWeek: number;
  // Plan profit cut percentages (how much of trade profit goes to user)
  planProfitCuts: {
    plan1: number; // 40%
    plan2: number; // 50%
    plan3: number; // 60%
    plan4: number; // 75%
  };
  updatedAt: Date;
}

const settingsSchema = new mongoose.Schema<ISettings>(
  {
    wallets: {
      trc20: { type: String, default: 'TCcDEhikqzaHpSp2HubiksS2tPm188PKUt' },
      erc20: { type: String, default: '0x8282a8a8f68f12c8cc2a9592a6585878e71cb039' },
      bep20: { type: String, default: '0x4b47b65b4d19249930e30d4a9c18751f9b3dc8f1' },
    },
    welcomeBonus: { type: Number, default: 5 },
    welcomeBonusPercent: { type: Number, default: 10 },
    directCommissionPercent: { type: Number, default: 10 },
    referralBonus: { type: Number, default: 10 },
    withdrawalThreshold: { type: Number, default: 50 },
    tradeEnabled: { type: Boolean, default: true },
    tradeMinProfit: { type: Number, default: 4 },
    tradeMaxProfit: { type: Number, default: 8 },
    tradeMinLoss: { type: Number, default: 3 },
    tradeMaxLoss: { type: Number, default: 9 },
    tradeLossDaysPerWeek: { type: Number, default: 2 },
    planProfitCuts: {
      plan1: { type: Number, default: 40 },
      plan2: { type: Number, default: 50 },
      plan3: { type: Number, default: 60 },
      plan4: { type: Number, default: 75 },
    },
  },
  { timestamps: true }
);

export const Settings =
  mongoose.models.Settings ||
  mongoose.model<ISettings>('Settings', settingsSchema);
