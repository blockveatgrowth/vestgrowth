import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { Transaction } from '@/models/Transaction';
import { Profit } from '@/models/Increment';
import { User } from '@/models/User';
import dbConnect from '@/lib/db';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Calculate total deposits and withdrawals
    const [deposits, withdrawals] = await Promise.all([
      Transaction.aggregate([
        {
          $match: {
            userId: user._id,
            type: 'deposit',
            status: 'approved',
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$amount' },
          },
        },
      ]),
      Transaction.aggregate([
        {
          $match: {
            userId: user._id,
            type: 'withdrawal',
            status: 'approved',
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$amount' },
          },
        },
      ]),
    ]);

    // Calculate total earnings from profits and referrals
    const profits = await Profit.aggregate([
      {
        $match: {
          userId: user._id,
          status: 'completed'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);

    const totalDeposits = deposits[0]?.total || 0;
    const totalWithdrawals = withdrawals[0]?.total || 0;
    const totalProfits = profits[0]?.total || 0;
    const totalReferralEarnings = user.referralEarnings || 0;

    // Calculate total earnings
    const totalEarnings = totalProfits + totalReferralEarnings;

    // Calculate balances
    const totalBalance = totalDeposits + totalEarnings - totalWithdrawals;
    const lockedAmount = totalDeposits; // Lock amount is now equal to total deposits
    const availableBalance = totalBalance - lockedAmount;

    return NextResponse.json({
      totalBalance,
      lockedAmount,
      availableBalance,
      totalDeposits,
      totalWithdrawals,
      totalEarnings,
      profitEarnings: totalProfits,
      referralEarnings: totalReferralEarnings,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Error fetching balance stats:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to fetch balance stats' },
      { status: 500 }
    );
  }
} 