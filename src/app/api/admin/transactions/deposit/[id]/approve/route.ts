export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import dbConnect from '@/lib/db';
import { User } from '@/models/User';
import { Transaction } from '@/models/Transaction';
import { distributeReferralCommissions } from '@/lib/referralUtils';
import { calculateDirectCommission } from '@/lib/planUtils';

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

    // Get the user
    const user = await User.findById(transaction.userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Calculate welcome bonus (10% of deposit amount)
    const welcomeBonus = user.hasReceivedWelcomeBonus ? 0 : transaction.amount * 0.1;

    // Calculate direct commission based on plan
    const { commission: directCommission, plan } = await calculateDirectCommission(transaction.amount, welcomeBonus > 0 ? 10 : -1);

    // Update user's balance with deposit amount, welcome bonus, and direct commission
    const totalAddition = transaction.amount + welcomeBonus + directCommission;
    user.balance += totalAddition;
    let directCommissionPercentage = -1;
    
    // Mark that user has received welcome bonus if this is their first deposit
    if (!user.hasReceivedWelcomeBonus) {
      user.hasReceivedWelcomeBonus = true;
      directCommissionPercentage = 10;
    }
    
    await user.save();

    // Update transaction status and add bonus info
    transaction.status = 'approved';
    transaction.approvedBy = admin._id;
    transaction.approvedAt = new Date();
    
    const notes = [];
    if (welcomeBonus > 0) {
      notes.push(`Welcome bonus of $${welcomeBonus.toFixed(2)} added`);
    }
    if (directCommission > 0) {
      notes.push(`Direct commission of $${directCommission.toFixed(2)} (${plan?.directCommissionPercentage}%) added`);
    }
    if (notes.length > 0) {
      transaction.notes = notes.join('. ');
    }
    
    await transaction.save();

    // Process referral commissions
    await distributeReferralCommissions(transaction.userId, transaction.amount, directCommissionPercentage);

    return NextResponse.json({
      message: 'Deposit approved successfully',
      transaction,
      welcomeBonus,
      directCommission,
      plan: plan ? {
        name: plan.name,
        directCommissionPercentage: plan.directCommissionPercentage,
      } : null,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Error approving deposit:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to approve deposit' },
      { status: 500 }
    );
  }
} 