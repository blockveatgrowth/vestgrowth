import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import dbConnect from '@/lib/db';
import { User } from '@/models/User';
import { Transaction } from '@/models/Transaction';
import { Profit } from '@/models/Increment';

export async function GET() {
  try {
    // Verify admin authentication
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

    // Calculate date range for growth calculations
    const today = new Date();
    
    // Last 30 days
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    // Previous 30 days before that (for growth comparison)
    const sixtyDaysAgo = new Date(today);
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    // Get user statistics
    const [
      totalUsers,
      newUsers30Days,
      newUsersPrevious30Days,
      activeUsers
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      User.countDocuments({ 
        createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo } 
      }),
      User.countDocuments({ 
        lastActive: { $gte: thirtyDaysAgo } 
      })
    ]);

    // Calculate user growth
    const userGrowth = newUsersPrevious30Days === 0 
      ? newUsers30Days * 100 
      : ((newUsers30Days - newUsersPrevious30Days) / newUsersPrevious30Days) * 100;

    // Get transaction statistics
    const [
      deposits,
      depositsLast30Days,
      depositsPrevious30Days,
      withdrawals,
      withdrawalsLast30Days, 
      withdrawalsPrevious30Days,
      pendingDeposits,
      pendingWithdrawals
    ] = await Promise.all([
      Transaction.aggregate([
        { $match: { type: 'deposit', status: 'approved' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Transaction.aggregate([
        { 
          $match: { 
            type: 'deposit', 
            status: 'approved',
            createdAt: { $gte: thirtyDaysAgo }
          } 
        },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Transaction.aggregate([
        { 
          $match: { 
            type: 'deposit', 
            status: 'approved',
            createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo }
          } 
        },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Transaction.aggregate([
        { $match: { type: 'withdrawal', status: 'approved' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Transaction.aggregate([
        { 
          $match: { 
            type: 'withdrawal', 
            status: 'approved',
            createdAt: { $gte: thirtyDaysAgo }
          } 
        },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Transaction.aggregate([
        { 
          $match: { 
            type: 'withdrawal', 
            status: 'approved',
            createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo }
          } 
        },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Transaction.countDocuments({ type: 'deposit', status: 'pending' }),
      Transaction.countDocuments({ type: 'withdrawal', status: 'pending' })
    ]);

    // Calculate growth rates
    const depositGrowth = depositsPrevious30Days[0]?.total ? 
      ((depositsLast30Days[0]?.total || 0) - depositsPrevious30Days[0].total) / depositsPrevious30Days[0].total * 100 : 0;
    
    const withdrawalGrowth = withdrawalsPrevious30Days[0]?.total ? 
      ((withdrawalsLast30Days[0]?.total || 0) - withdrawalsPrevious30Days[0].total) / withdrawalsPrevious30Days[0].total * 100 : 0;

    // Get profit statistics
    const [profits, referralCount, referralEarnings] = await Promise.all([
      Profit.aggregate([
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      User.countDocuments({ referredBy: { $exists: true, $ne: null } }),
      User.aggregate([
        { $group: { _id: null, total: { $sum: '$referralEarnings' } } }
      ])
    ]);

    return NextResponse.json({
      totalUsers,
      activeUsers,
      totalDeposits: deposits[0]?.total || 0,
      totalWithdrawals: withdrawals[0]?.total || 0,
      totalIncrements: profits[0]?.total || 0,
      totalReferrals: referralCount,
      referralEarnings: referralEarnings[0]?.total || 0,
      pendingDeposits,
      pendingWithdrawals,
      userGrowth: parseFloat(userGrowth.toFixed(1)),
      depositGrowth: parseFloat(depositGrowth.toFixed(1)),
      withdrawalGrowth: parseFloat(withdrawalGrowth.toFixed(1)),
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Error fetching dashboard stats:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
} 