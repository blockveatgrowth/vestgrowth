export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import dbConnect from '@/lib/db';
import { User } from '@/models/User';
import { Transaction } from '@/models/Transaction';
import { Settings } from '@/models/Settings';
import { getPlanForAmount } from '@/lib/planUtils';
import Referral from '@/models/Referral';

// Instant referral commission rates per level (% of deposited amount)
const REFERRAL_LEVEL_RATES: Record<number, number> = {
  1: 10,  // Level 1: 10%
  2: 5,   // Level 2: 5%
  3: 3,   // Level 3: 3%
  4: 2,   // Level 4: 2%
  5: 1,   // Level 5: 1%
};

export async function POST(request: NextRequest) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Transaction ID is required' }, { status: 400 });
    }

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const admin = await User.findOne({ email: session.user.email });
    if (!admin || admin.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const transaction = await Transaction.findById(id);
    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }
    if (transaction.status !== 'pending') {
      return NextResponse.json({ error: 'Transaction is not in pending status' }, { status: 400 });
    }

    const user = await User.findById(transaction.userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Load platform settings
    let settings = await Settings.findOne();
    if (!settings) settings = await Settings.create({});

    // Find the plan for this deposit
    const plan = await getPlanForAmount(transaction.amount);
    if (plan && !transaction.planId) {
      transaction.planId = plan._id;
    }

    // Determine plan profit cut (40/50/60/75)
    const planCutMap: Record<string, number> = {
      'Plan 1': settings.planProfitCuts?.plan1 ?? 40,
      'Plan 2': settings.planProfitCuts?.plan2 ?? 50,
      'Plan 3': settings.planProfitCuts?.plan3 ?? 60,
      'Plan 4': settings.planProfitCuts?.plan4 ?? 75,
    };
    const planCut = plan ? (planCutMap[plan.name] ?? 40) : 40;

    // ── Welcome Bonus (ONE TIME ONLY) ──────────────────────────────────────────
    // Formula: $5 fixed + ((planCut * 2) / 10)% of first deposit
    // Guard: hasReceivedWelcomeBonus ensures it is never given twice
    let welcomeBonus = 0;
    if (!user.hasReceivedWelcomeBonus) {
      const bonusPct = (planCut * 2) / 10; // plan1=40→8%, plan2=50→10%, plan3=60→12%, plan4=75→15%
      welcomeBonus = parseFloat((5 + (transaction.amount * bonusPct) / 100).toFixed(2));
      user.hasReceivedWelcomeBonus = true;
    }

    // ── Credit deposit + welcome bonus to user balance ─────────────────────────
    user.balance = parseFloat((user.balance + transaction.amount + welcomeBonus).toFixed(2));
    await user.save();

    // ── Update transaction ─────────────────────────────────────────────────────
    transaction.status = 'approved';
    transaction.approvedBy = admin._id;
    transaction.approvedAt = new Date();
    const notes: string[] = [];
    if (welcomeBonus > 0) notes.push(`Welcome bonus: $${welcomeBonus} (one-time)`);
    if (plan) notes.push(`Plan: ${plan.name} (${planCut}% profit cut)`);
    if (notes.length > 0) transaction.notes = notes.join(' | ');
    await transaction.save();

    // ── Instant referral commissions (10/5/3/2/1% of deposit) ─────────────────
    const referrals = await Referral.find({ userId: transaction.userId }).sort({ level: 1 });
    for (const ref of referrals) {
      const rate = REFERRAL_LEVEL_RATES[ref.level] ?? 0;
      if (rate <= 0) continue;
      const commissionAmount = parseFloat(((transaction.amount * rate) / 100).toFixed(2));
      if (commissionAmount <= 0) continue;

      await User.findByIdAndUpdate(ref.referrerId, {
        $inc: { balance: commissionAmount, referralEarnings: commissionAmount },
      });
      await Referral.findByIdAndUpdate(ref._id, {
        $inc: { totalEarnings: commissionAmount },
      });
    }

    return NextResponse.json({
      message: 'Deposit approved successfully',
      transaction,
      welcomeBonus,
      plan: plan ? { name: plan.name, profitCut: planCut } : null,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Error approving deposit:', err);
    return NextResponse.json({ error: err.message || 'Failed to approve deposit' }, { status: 500 });
  }
}
