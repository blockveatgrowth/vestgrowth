import { User } from '@/models/User';
import { Transaction } from '@/models/Transaction';
import { Profit } from '@/models/Increment';
import { Plan } from '@/models/Plan';
import dbConnect from './db';

export const calculateDailyIncrements = async () => {
  try {
    // Connect to database
    await dbConnect();
    console.log('Connected to database for daily increment processing');

    // Get all approved deposits
    const deposits = await Transaction.find({
      type: 'deposit',
      status: 'approved'
    }).populate({
      path: 'planId',
      model: Plan
    });

    for (const deposit of deposits) {
      // Calculate daily profit based on plan percentage
      const dailyPercentage = deposit.planId.dailyProfit;
      const profitAmount = (deposit.amount * dailyPercentage) / 100;

      // Create profit record
      const profit = await Profit.create({
        userId: deposit.userId,
        depositId: deposit._id,
        amount: profitAmount,
        date: new Date(),
        profitType: 'daily',
        status: 'completed',
        isAddedToBalance: false
      });

      // Calculate and distribute referral profits
      const user = await User.findById(deposit.userId).select('referredBy');
      if (user?.referredBy) {
        let currentUserId = user.referredBy;
        let level = 1;
        const referrerEarnings = new Map();

        while (currentUserId && level <= 5) {
          const referrerProfit = profitAmount * 0.1; // 10% of user's profit
          referrerEarnings.set(currentUserId.toString(), referrerProfit);

          // Create referral profit record
          await Profit.create({
            userId: currentUserId,
            depositId: deposit._id,
            amount: referrerProfit,
            date: new Date(),
            profitType: 'referral',
            status: 'completed',
            isAddedToBalance: false
          });

          const referrer = await User.findById(currentUserId).select('referredBy');
          if (!referrer) break;

          currentUserId = referrer.referredBy;
          level++;
        }

        profit.referrerEarnings = Object.fromEntries(referrerEarnings);
        await profit.save();
      }
    }
  } catch (error) {
    console.error('Error calculating daily profits:', error);
    throw error;
  }
};

export const processPendingIncrements = async () => {
  try {
    // Get all unprocessed profits
    const pendingProfits = await Profit.find({
      status: 'completed',
      isAddedToBalance: false
    });

    for (const profit of pendingProfits) {
      // Get user
      const user = await User.findById(profit.userId);
      if (!user) {
        console.warn(`User not found for profit ${profit._id}`);
        continue;
      }

      // Add profit amount to user's balance
      await User.findByIdAndUpdate(profit.userId, {
        $inc: { balance: profit.amount }
      });

      // Mark profit as added to balance
      profit.isAddedToBalance = true;
      await profit.save();
    }
  } catch (error) {
    console.error('Error processing pending profits:', error);
    throw error;
  }
};

export const incrementUtils = {
  calculateDailyIncrements,
  processPendingIncrements
}; 