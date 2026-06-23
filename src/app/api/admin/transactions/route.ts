export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { Transaction } from '@/models/Transaction';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated and is an admin
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Check if user has admin role directly from session
    if (session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Access denied. Admin privileges required.' },
        { status: 403 }
      );
    }
    
    // Get query parameters
    const url = new URL(req.url);
    const type = url.searchParams.get('type');
    const status = url.searchParams.get('status');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    
    // Build query
    const query: Record<string, string> = {};
    if (type) query.type = type;
    if (status) query.status = status;
    
    // Fetch transactions with pagination
    const skip = (page - 1) * limit;
    
    const transactions = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('userId', 'name email')
      .lean();
    
    // Format transactions with user info
    const formattedTransactions = transactions.map(transaction => {
      const user = transaction.userId as Record<string, string | undefined>;
      return {
        ...transaction,
        userName: user?.name || 'Unknown',
        userEmail: user?.email || 'unknown@example.com',
        userId: transaction.userId?._id || transaction.userId,
      };
    });
    
    // Count total documents for pagination
    const total = await Transaction.countDocuments(query);
    
    return NextResponse.json({
      transactions: formattedTransactions,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
} 