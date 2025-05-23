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

    // Check if user is admin
    const user = await User.findOne({ email: session.user.email });
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get total deposits and withdrawals
    const [deposits, withdrawals] = await Promise.all([
      Transaction.aggregate([
        {
          $match: {
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
            type: 'withdraw',
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

    // Get total profits and referral earnings
    const profits = await Profit.aggregate([
      {
        $match: {
          status: 'processed',
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
          referrerEarnings: { $sum: '$referrerEarnings' },
        },
      },
    ]);

    // Get user statistics
    const [totalUsers, activeUsers] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ lastActive: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } }),
    ]);

    // Get total referrals
    const totalReferrals = await User.countDocuments({ referrer: { $exists: true } });

    // Get profit distribution by date
    const profitDistribution = await Profit.aggregate([
      {
        $match: {
          status: 'processed',
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          amount: { $sum: '$amount' },
        },
      },
      {
        $sort: { _id: -1 },
      },
      {
        $limit: 6,
      },
      {
        $project: {
          _id: 0,
          date: '$_id',
          amount: 1,
        },
      },
    ]);

    return NextResponse.json({
      totalDeposits: deposits[0]?.total || 0,
      totalWithdrawals: withdrawals[0]?.total || 0,
      totalIncrements: profits[0]?.total || 0,
      totalUsers,
      activeUsers,
      totalReferrals,
      referralEarnings: profits[0]?.referrerEarnings || 0,
      incrementDistribution: profitDistribution,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Error fetching analytics:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
} 