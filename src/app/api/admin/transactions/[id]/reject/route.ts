export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { Transaction } from '@/models/Transaction';
import { User } from '@/models/User';
import { connectToDatabase } from '@/lib/mongoose';
import mongoose from 'mongoose';

export async function POST(
  request: NextRequest,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: any
) {
  try {
    const { id } = context.params;


    if (!id) {
      return NextResponse.json(
        { error: 'Transaction ID is required' },
        { status: 400 }
      );
    }
    const session = await getServerSession();
    
    // Check if user is authenticated and is an admin
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Connect to database
    await connectToDatabase();
    
    // Get user from database
    const admin = await User.findOne({ email: session.user.email });
    
    if (!admin || admin.role !== 'admin') {
      return NextResponse.json(
        { error: 'Access denied. Admin privileges required.' },
        { status: 403 }
      );
    }
    
    
    // Validate MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid transaction ID' },
        { status: 400 }
      );
    }
    
    // Find the transaction
    const transaction = await Transaction.findById(id);
    
    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }
    
    // Check if transaction is already processed
    if (transaction.status !== 'pending') {
      return NextResponse.json(
        { error: 'Transaction has already been processed' },
        { status: 400 }
      );
    }
    
    // Update the transaction status
    transaction.status = 'rejected';
    transaction.rejectedBy = admin._id;
    transaction.rejectedAt = new Date();
    await transaction.save();
    
    // TODO: Create a notification for the user
    
    return NextResponse.json({
      message: `Transaction ${transaction.type} rejected successfully`,
      transaction
    });
  } catch (error) {
    console.error('Error rejecting transaction:', error);
    return NextResponse.json(
      { error: 'Failed to reject transaction' },
      { status: 500 }
    );
  }
} 