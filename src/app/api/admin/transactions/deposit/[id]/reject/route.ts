export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import dbConnect from '@/lib/db';
import { User } from '@/models/User';
import { Transaction } from '@/models/Transaction';

export async function POST(request: NextRequest) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Transaction ID is required' },
        { status: 400 }
      );
    }

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

    // Find the transaction
    const transaction = await Transaction.findById(id);
    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    if (transaction.status !== 'pending') {
      return NextResponse.json(
        { error: 'Transaction is not in pending status' },
        { status: 400 }
      );
    }

    // Update transaction status to rejected
    transaction.status = 'rejected';
    transaction.rejectedBy = admin._id;
    transaction.rejectedAt = new Date();
    
    await transaction.save();

    return NextResponse.json({
      message: 'Deposit rejected successfully',
      transaction
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Error rejecting deposit:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to reject deposit' },
      { status: 500 }
    );
  }
} 