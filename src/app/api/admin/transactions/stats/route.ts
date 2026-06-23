export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import dbConnect from '@/lib/db';
import { User } from '@/models/User';
import { Transaction } from '@/models/Transaction';

type TransactionStatus = 'pending' | 'approved' | 'rejected';

interface StatResult {
  count: number;
  totalAmount: number;
}

interface StatsAggregation {
  _id: TransactionStatus;
  count: number;
  totalAmount: number;
}

interface FormattedStats {
  pending: StatResult;
  approved: StatResult;
  rejected: StatResult;
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const admin = await User.findOne({ email: session.user.email });
    if (!admin || admin.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await dbConnect();

    // Get date range from query params
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Build date filter
    const dateFilter: { [key: string]: Date } = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);

    // Get deposit statistics
    const depositStats = await Transaction.aggregate<StatsAggregation>([
      {
        $match: {
          type: 'deposit',
          ...(Object.keys(dateFilter).length > 0 && { createdAt: dateFilter }),
        },
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
        },
      },
    ]);

    // Get withdrawal statistics
    const withdrawalStats = await Transaction.aggregate<StatsAggregation>([
      {
        $match: {
          type: 'withdraw',
          ...(Object.keys(dateFilter).length > 0 && { createdAt: dateFilter }),
        },
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
        },
      },
    ]);

    // Format statistics
    const formatStats = (stats: StatsAggregation[]): FormattedStats => {
      const result: FormattedStats = {
        pending: { count: 0, totalAmount: 0 },
        approved: { count: 0, totalAmount: 0 },
        rejected: { count: 0, totalAmount: 0 },
      };

      stats.forEach((stat) => {
        if (stat._id === 'pending' || stat._id === 'approved' || stat._id === 'rejected') {
          result[stat._id] = {
            count: stat.count,
            totalAmount: stat.totalAmount,
          };
        }
      });

      return result;
    };

    return NextResponse.json({
      deposits: formatStats(depositStats),
      withdrawals: formatStats(withdrawalStats),
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Error fetching transaction stats:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to fetch transaction statistics' },
      { status: 500 }
    );
  }
} 