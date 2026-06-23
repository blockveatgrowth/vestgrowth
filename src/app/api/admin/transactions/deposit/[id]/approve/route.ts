export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import dbConnect from '@/lib/db';
import { User } from '@/models/User';
import { Transaction } from '@/models/Transaction';
import { Settings } from '@/models/Settings';
import { distributeReferralCommissions } from '@/lib/referralUtils';
import { getPlanForAmount } from '@/lib/planUtils';

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

    // Load platform settings for configurable bonuses
    let settings = await Settings.findOne();
    if (!settings) settings = await Settings.create({});

    const welcomeBonusPct = settings.welcomeBonusPercent ?? 10;
    const directCommissionPct = settings.directCommissionPercent ?? 10;

    // Welcome bonus: only on first deposit
    const welcomeBonus = user.hasReceivedWelcomeBonus ? 0 : (transaction.amount * welcomeBonusPct) / 100;

    // Direct commission based on deposit amount
    const directCommission = (transaction.amount * directCommissionPct) / 100;

    // Find the plan for this deposit
    const plan = await getPlanForAmount(transaction.amount);
    if (plan && !transaction.planId) {
      transaction.planId = plan._id;
    }

    // Add deposit + welcome bonus + direct commission to user balance
    const totalAddition = transaction.amount + welcomeBonus + directCommission;
    user.balance += totalAddition;

    if (!user.hasReceivedWelcomeBonus && welcomeBonus > 0) {
      user.hasReceivedWelcomeBonus = true;
    }
    await user.save();

    // Update transaction status
    transaction.status = 'approved';
    transaction.approvedBy = admin._id;
    transaction.approvedAt = new Date();

    const notes: string[] = [];
    if (welcomeBonus > 0) notes.push(`Welcome bonus: $${welcomeBonus.toFixed(2)} (${welcomeBonusPct}%)`);
    if (directCommission > 0) notes.push(`Direct commission: $${directCommission.toFixed(2)} (${directCommissionPct}%)`);
    if (plan) notes.push(`Plan: ${plan.name}`);
    if (notes.length > 0) transaction.notes = notes.join(' | ');
    await transaction.save();

    // Distribute referral commissions through the 5-level network
    await distributeReferralCommissions(transaction.userId, transaction.amount, directCommissionPct);

    return NextResponse.json({
      message: 'Deposit approved successfully',
      transaction,
      welcomeBonus,
      directCommission,
      plan: plan ? { name: plan.name, directCommissionPercentage: directCommissionPct } : null,
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