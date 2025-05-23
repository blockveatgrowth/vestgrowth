import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import dbConnect from '@/lib/db';
import { User } from '@/models/User';
import { Transaction } from '@/models/Transaction';
import Ticket from '@/models/Ticket';
import { Plan } from '@/models/Plan';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { transactionId, amount, planId, bankId } = body;

    if (!transactionId || !amount || !planId || !bankId) {
      return NextResponse.json(
        { error: 'Transaction ID, amount, plan selection, and bank selection are required' },
        { status: 400 }
      );
    }

    if (amount < 30) {
      return NextResponse.json(
        { error: 'Minimum deposit amount is $30' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Validate plan selection
    const selectedPlan = await Plan.findById(planId);
    if (!selectedPlan) {
      return NextResponse.json(
        { error: 'Selected plan not found' },
        { status: 404 }
      );
    }

    // Validate amount matches plan requirements
    if (amount < selectedPlan.minAmount || amount > selectedPlan.maxAmount) {
      return NextResponse.json(
        { error: `Deposit amount must be between $${selectedPlan.minAmount} and $${selectedPlan.maxAmount} for ${selectedPlan.name}` },
        { status: 400 }
      );
    }

    // Get the user
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Create the deposit transaction
    const deposit = await Transaction.create({
      userId: user._id,
      type: 'deposit',
      amount,
      planId: selectedPlan._id, // Ensure we store the plan ID
      bankId,
      transactionId,
      status: 'pending',
    });

    // Create a support ticket for the deposit
    const ticket = await Ticket.create({
      userId: user._id,
      category: 'deposit',
      transactionId: deposit._id,
      status: 'open',
      subject: `Deposit Request - $${amount}`,
      description: `User ${user.name} has requested a deposit of $${amount} with transaction ID: ${transactionId}`,
      priority: 'medium',
    });

    // Update the transaction with the ticket ID
    await Transaction.findByIdAndUpdate(deposit._id, { ticketId: ticket._id });

    return NextResponse.json({
      message: 'Deposit request created successfully',
      deposit,
      ticket,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Error processing deposit:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to process deposit' },
      { status: 500 }
    );
  }
} 