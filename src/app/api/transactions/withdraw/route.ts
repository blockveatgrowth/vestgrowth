import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import dbConnect from '@/lib/db';
import { User } from '@/models/User';
import { Transaction } from '@/models/Transaction';
import { Ticket } from '@/models/Ticket';
import { Profit } from '@/models/Increment';
import { Settings } from '@/models/Settings';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { bankType, accountNumber, amount, note } = body;

    if (!bankType || !accountNumber || !amount) {
      return NextResponse.json(
        { error: 'All required fields must be provided' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Get withdrawal threshold from settings
    let settings = await Settings.findOne();
    if (!settings) settings = await Settings.create({});
    const minWithdrawal = settings.withdrawalThreshold || 50;

    if (amount < minWithdrawal) {
      return NextResponse.json(
        { error: `Minimum withdrawal amount is $${minWithdrawal}` },
        { status: 400 }
      );
    }

    // Get the user
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Calculate total balance including all sources of funds
    const [deposits, withdrawals, profits] = await Promise.all([
      Transaction.aggregate([
        { $match: { userId: user._id, type: 'deposit', status: 'approved' } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      Transaction.aggregate([
        { $match: { userId: user._id, type: 'withdrawal', status: 'approved' } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      Profit.aggregate([
        { 
          $match: { 
            userId: user._id, 
            status: 'completed',
            // isAddedToBalance: true
          } 
        },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ])
    ]);

    const totalDeposits = deposits[0]?.total || 0;
    const totalWithdrawals = withdrawals[0]?.total || 0;
    const totalProfits = profits[0]?.total || 0;


    console.log(totalDeposits, totalWithdrawals, totalProfits, 'totalDeposits, totalWithdrawals, totalProfits');

    const currentBalance = totalDeposits + totalProfits - totalWithdrawals;
    const lockedAmount = totalDeposits; // Lock amount is now equal to total deposits
    const availableBalance = currentBalance - lockedAmount;
    
    // Check if withdrawal amount exceeds available balance
    if (amount > availableBalance) {
      return NextResponse.json(
        { error: `Insufficient available balance. Maximum withdrawal amount is ${availableBalance.toFixed(2)}` },
        { status: 400 }
      );
    }

    // Create the transaction
    const transaction = await Transaction.create({
      userId: user._id,
      type: 'withdrawal',
      amount,
      status: 'pending',
      accountDetails: `${bankType}:${accountNumber}`,
      note,
    });

    // Create a support ticket for the withdrawal
    await Ticket.create({
      userId: user._id,
      category: 'withdrawal',
      transactionId: transaction._id,
      status: 'open',
      subject: 'Withdrawal Request',
      description: `New withdrawal request of $${amount} to ${bankType} wallet ${accountNumber}`,
      priority: 'medium',
    });

    return NextResponse.json({
      message: 'Withdrawal request submitted successfully',
      transaction,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Error processing withdrawal:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to process withdrawal' },
      { status: 500 }
    );
  }
} 