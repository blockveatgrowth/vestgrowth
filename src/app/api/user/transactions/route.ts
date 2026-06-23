export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import dbConnect from '@/lib/db';
import { User } from '@/models/User';
import { Transaction } from '@/models/Transaction';

interface TransactionQuery {
  userId: string;
  type?: string;
  status?: string;
  $or?: Array<{
    transactionId?: { $regex: string; $options: string };
    accountDetails?: { $regex: string; $options: string };
  }>;
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // Get the user
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get query parameters
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    const type = searchParams.get('type') || '';
    const status = searchParams.get('status') || '';
    const search = searchParams.get('search') || '';

    // Build query
    const query: TransactionQuery = { userId: user._id };
    if (type) query.type = type;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { transactionId: { $regex: search, $options: 'i' } },
        { accountDetails: { $regex: search, $options: 'i' } },
      ];
    }

    // Find transactions with filters
    const transactions = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Transaction.countDocuments(query);

    return NextResponse.json({
      transactions,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Error fetching transactions:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
} 