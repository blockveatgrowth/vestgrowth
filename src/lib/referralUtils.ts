import { User } from '@/models/User';
import Referral from '@/models/Referral';
import mongoose from 'mongoose';
import { calculateReferralCommission } from './planUtils';

// Commission percentages for each level
export const REFERRAL_COMMISSIONS = {
  LEVEL_1: 10,
  LEVEL_2: 5,
  LEVEL_3: 2.5,
  LEVEL_4: 1.25,
  LEVEL_5: 0.75,
};

/**
 * Get the commission percentage for a specific referral level
 */
export function getCommissionPercentage(level: number): number {
  switch (level) {
    case 1: return 4;   // 4%
    case 2: return 2;   // 2%
    case 3: return 1;   // 1%
    case 4: return 0.5; // 0.5%
    case 5: return 0.025; // 0.025%
    default: return 0;
  }
}

/**
 * Process a new referral relationship
 * @param userId The ID of the user being referred
 * @param referralCode The referral code used
 */
export async function processReferral(
  userId: mongoose.Types.ObjectId,
  referralCode: string
): Promise<void> {
  try {
    // Find the referrer using the referral code
    const referrer = await User.findOne({ referralCode }).select('_id');
    if (!referrer) {
      throw new Error('Invalid referral code');
    }

    // Create all referral relationships in parallel
    const referralPromises = [];
    const currentReferrerId = referrer._id;
    
    // Create level 1 referral and update referrer's count
    referralPromises.push(
      Referral.create({
        userId,
        referrerId: currentReferrerId,
        level: 1,
        commissionPercentage: 4,
        totalEarnings: 0,
      }),
      User.findByIdAndUpdate(currentReferrerId, {
        $inc: { referralCount: 1 },
      })
    );

    // Find higher level referrers (up to level 5) in one query
    const higherReferrers = await Referral.find({
      userId: currentReferrerId,
      level: 1,
    }).select('referrerId').limit(4);

    // Create higher level referral relationships
    higherReferrers.forEach((ref, index) => {
      const level = index + 2; // levels 2-5
      referralPromises.push(
        Referral.create({
          userId,
          referrerId: ref.referrerId,
          level,
          commissionPercentage: getCommissionPercentage(level),
          totalEarnings: 0,
        })
      );
    });

    // Execute all operations in parallel
    await Promise.all(referralPromises);
  } catch (error) {
    console.error('Error processing referral:', error);
    throw error;
  }
}

/**
 * Calculate and distribute commissions for a deposit
 * @param userId The ID of the user who made the deposit
 * @param amount The deposit amount
 */
export async function distributeReferralCommissions(
  userId: mongoose.Types.ObjectId,
  amount: number,
  directCommissionPercentage: number
): Promise<void> {
  try {
    // Find all referrers for this user across all levels
    const referrals = await Referral.find({ userId }).sort({ level: 1 });
    
    for (const referral of referrals) {
      // Calculate commission amount based on plan and level
      const commissionAmount = await calculateReferralCommission(amount, referral.level, directCommissionPercentage);
      
      if (commissionAmount <= 0) continue;
      
      // Update referrer's balance and referral earnings
      await User.findByIdAndUpdate(referral.referrerId, {
        $inc: {
          balance: commissionAmount,
          referralEarnings: commissionAmount
        }
      });
      
      // Update total earnings in the referral record
      await Referral.findByIdAndUpdate(referral._id, {
        $inc: { totalEarnings: commissionAmount }
      });
    }
  } catch (error) {
    console.error('Error distributing referral commissions:', error);
    throw error;
  }
}

/**
 * Get referral statistics for a user
 * @param userId The ID of the user
 */
export async function getReferralStats(userId: mongoose.Types.ObjectId) {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    // Get direct referrals (level 1)
    const directReferrals = await Referral.find({ 
      referrerId: userId,
      level: 1
    }).populate('userId', 'name email createdAt');
    
    // Count referrals by level
    const referralsByLevel = await Referral.aggregate([
      { $match: { referrerId: new mongoose.Types.ObjectId(userId.toString()) } },
      { $group: { _id: '$level', count: { $sum: 1 }, earnings: { $sum: '$totalEarnings' } } },
      { $sort: { _id: 1 } }
    ]);
    
    // Format results
    const levelCounts = Array(5).fill(0);
    const levelEarnings = Array(5).fill(0);
    
    referralsByLevel.forEach(item => {
      if (item._id >= 1 && item._id <= 5) {
        levelCounts[item._id - 1] = item.count;
        levelEarnings[item._id - 1] = item.earnings;
      }
    });
    
    return {
      referralCode: user.referralCode,
      referralLink: `${process.env.NEXT_PUBLIC_APP_URL || ''}/register?ref=${user.referralCode}`,
      referralCount: user.referralCount,
      totalEarnings: user.referralEarnings,
      directReferrals,
      referralsByLevel: {
        counts: levelCounts,
        earnings: levelEarnings
      }
    };
  } catch (error) {
    console.error('Error getting referral stats:', error);
    throw error;
  }
} 