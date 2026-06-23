export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import dbConnect from '@/lib/db';
import { User } from '@/models/User';
import { Transaction } from '@/models/Transaction';

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

    // Get pending transaction counts
    const [pendingDeposits, pendingWithdrawals] = await Promise.all([
      Transaction.countDocuments({ type: 'deposit', status: 'pending' }),
      Transaction.countDocuments({ type: 'withdrawal', status: 'pending' }),
    ]);

    // Get recent deposit requests with user info
    const recentDeposits = await Transaction.find(
      { type: 'deposit', status: 'pending' },
      { amount: 1, createdAt: 1, userId: 1 }
    )
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('userId', 'name email')
      .lean();

    // Get recent withdrawal requests with user info
    const recentWithdrawals = await Transaction.find(
      { type: 'withdrawal', status: 'pending' },
      { amount: 1, createdAt: 1, userId: 1 }
    )
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('userId', 'name email')
      .lean();

    return NextResponse.json({
      pendingDeposits,
      pendingWithdrawals,
      recentDeposits,
      recentWithdrawals,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Error fetching pending transactions:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to fetch pending transactions' },
      { status: 500 }
    );
  }
} 