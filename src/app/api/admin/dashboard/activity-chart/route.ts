export const dynamic = 'force-dynamic';
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

    // Get date 30 days ago
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    // Format date for MongoDB $dateToString
    const dateFormat = '%Y-%m-%d';

    // Get daily profits
    const dailyProfits = await Profit.aggregate([
      {
        $match: {
          date: { $gte: thirtyDaysAgo },
          status: 'completed',
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          amount: { $sum: '$amount' },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Get deposit data by day for the last 30 days
    const depositsByDay = await Transaction.aggregate([
      {
        $match: {
          type: 'deposit',
          status: 'approved',
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: dateFormat, date: '$createdAt' } },
          value: { $sum: '$amount' }
        }
      },
      {
        $sort: { _id: 1 }
      },
      {
        $project: {
          _id: 0,
          date: '$_id',
          value: 1
        }
      }
    ]);

    // Get withdrawal data by day for the last 30 days
    const withdrawalsByDay = await Transaction.aggregate([
      {
        $match: {
          type: 'withdrawal',
          status: 'approved',
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: dateFormat, date: '$createdAt' } },
          value: { $sum: '$amount' }
        }
      },
      {
        $sort: { _id: 1 }
      },
      {
        $project: {
          _id: 0,
          date: '$_id',
          value: 1
        }
      }
    ]);

    // Get increment data by day for the last 30 days
    const incrementsByDay = await Profit.aggregate([
      {
        $match: {
          date: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: dateFormat, date: '$date' } },
          value: { $sum: '$amount' }
        }
      },
      {
        $sort: { _id: 1 }
      },
      {
        $project: {
          _id: 0,
          date: '$_id',
          value: 1
        }
      }
    ]);

    // Get new user registrations by day for the last 30 days
    const usersByDay = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: dateFormat, date: '$createdAt' } },
          value: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      },
      {
        $project: {
          _id: 0,
          date: '$_id',
          value: 1
        }
      }
    ]);

    // Fill in missing dates with zero values for consistent charts
    const filledData = fillMissingDates({
      deposits: depositsByDay,
      withdrawals: withdrawalsByDay,
      increments: incrementsByDay,
      users: usersByDay
    }, thirtyDaysAgo);

    return NextResponse.json(filledData);
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Error fetching activity chart data:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to fetch activity chart data' },
      { status: 500 }
    );
  }
}

interface DataPoint {
  date: string;
  value: number;
}

interface ChartData {
  deposits: DataPoint[];
  withdrawals: DataPoint[];
  increments: DataPoint[];
  users: DataPoint[];
}

// Helper function to fill in missing dates with zero values
function fillMissingDates(data: ChartData, startDate: Date): ChartData {
  const result: ChartData = {
    deposits: [],
    withdrawals: [],
    increments: [],
    users: []
  };
  
  // Generate all dates in the range
  const dates: string[] = [];
  const currentDate = new Date(startDate);
  const endDate = new Date();
  
  while (currentDate <= endDate) {
    const dateStr = currentDate.toISOString().split('T')[0];
    dates.push(dateStr);
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  // Create lookup maps for each data set
  const depositMap = new Map(data.deposits.map(item => [item.date, item.value]));
  const withdrawalMap = new Map(data.withdrawals.map(item => [item.date, item.value]));
  const incrementMap = new Map(data.increments.map(item => [item.date, item.value]));
  const userMap = new Map(data.users.map(item => [item.date, item.value]));
  
  // Fill in missing dates
  for (const date of dates) {
    result.deposits.push({
      date,
      value: depositMap.get(date) || 0
    });
    
    result.withdrawals.push({
      date,
      value: withdrawalMap.get(date) || 0
    });
    
    result.increments.push({
      date,
      value: incrementMap.get(date) || 0
    });
    
    result.users.push({
      date,
      value: userMap.get(date) || 0
    });
  }
  
  return result;
} 