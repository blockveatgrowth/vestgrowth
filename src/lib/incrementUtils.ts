import { Types } from 'mongoose';
import { User } from '@/models/User';
import { Transaction } from '@/models/Transaction';
import { Profit } from '@/models/Increment';
import { Plan } from '@/models/Plan';
import dbConnect from './db';

export async function processDailyIncrements(isTest = false, batchSize = 50) {
  try {
    // Connect to database
    await dbConnect();
    console.log('Connected to database for daily increment processing');

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get all active deposits in one query
    console.log('Fetching active deposits...');
    const deposits = await Transaction.find({
      type: 'deposit',
      status: 'approved',
    }).populate({
      path: 'planId',
      model: Plan
    });

    console.log(`Found ${deposits.length} active deposits to process`);

    // Process deposits in batches to avoid memory issues
    for (let i = 0; i < deposits.length; i += batchSize) {
      const batch = deposits.slice(i, i + batchSize);
      
      for (const deposit of batch) {
        try {
          // Get the plan's daily profit percentage
          const plan = deposit.planId;
          if (!plan) {
            console.warn(`No plan found for deposit ${deposit._id}`);
            continue;
          }

          // Calculate profit based on plan's daily profit percentage
          const profitAmount = deposit.amount * (plan.dailyProfit / 100);

          // Create profit record
          const profit = new Profit({
            userId: deposit.userId,
            amount: profitAmount,
            date: today,
            status: 'completed',
            depositId: deposit._id,
            profitType: 'daily',
          });

          // Get user's referral chain
          const user = await User.findById(deposit.userId);
          if (!user) {
            console.warn(`User not found for deposit ${deposit._id}`);
            continue;
          }

          let currentUserId = user.referredBy;
          let level = 1;
          const referrerEarnings = new Map<string, number>();

          // Calculate referrer profits (10% of the user's profit at each level)
          while (currentUserId && level <= 5) {
            const referrerProfit = profitAmount * (plan.dailyProfit / 100);
            referrerEarnings.set(currentUserId.toString(), referrerProfit);

            const referrer = await User.findById(currentUserId);
            if (!referrer) break;

            currentUserId = referrer.referredBy;
            level++;
          }

          profit.referrerEarnings = Object.fromEntries(referrerEarnings);

          // if (!isTest) {
            // Save the profit record first
            await profit.save();

            // Update user's balance
            await User.findByIdAndUpdate(
              deposit.userId,
              { $inc: { balance: profitAmount } }
            );

            // Update referrer balances one by one
            for (const [referrerId, amount] of referrerEarnings) {
              await User.findByIdAndUpdate(
                new Types.ObjectId(referrerId),
                { $inc: { balance: amount } }
              );
            }
          // }
        } catch (error) {
          console.error(`Error processing deposit ${deposit._id}:`, error);
        }
      }
    }

    console.log('Daily increment processing completed');
  } catch (error) {
    console.error('Error in processDailyIncrements:', error);
    throw error;
  }
}

export async function getUserIncrementHistory(userId: Types.ObjectId, start?: Date, end?: Date) {
  await dbConnect();

  const query: { userId: Types.ObjectId; date?: { $gte?: Date; $lte?: Date } } = { userId };
  if (start || end) {
    query.date = {};
    if (start) query.date.$gte = start;
    if (end) query.date.$lte = end;
  }

  return await Profit.find(query)
    .sort({ date: -1 })
    .lean();
} 