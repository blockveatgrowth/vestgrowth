export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import dbConnect from '@/lib/db';
import Ticket from '@/models/Ticket';
import { Transaction } from '@/models/Transaction';

// Get all tickets for the current user
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    const status = url.searchParams.get('status') || undefined;

    await dbConnect();

    const query: Record<string, unknown> = { userId: session.user.id };
    if (status) query.status = status;

    const tickets = await Ticket.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('userId', 'name email')
      .populate('transactionId');

    const total = await Ticket.countDocuments(query);

    return NextResponse.json({
      tickets,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Error fetching tickets:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to fetch tickets' },
      { status: 500 }
    );
  }
}

// Create a new ticket
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { transactionId, subject, description, category } = await req.json();

    await dbConnect();
    
    let transaction;
    if (transactionId) {
      // Verify transaction exists and belongs to user
      transaction = await Transaction.findOne({ 
        _id: transactionId,
        userId: session.user.id
      });
      
      if (!transaction) {
        return NextResponse.json(
          { error: 'Transaction not found or does not belong to user' },
          { status: 404 }
        );
      }
    }

    // Create ticket
    const ticket = await Ticket.create({
      userId: session.user.id,
      transactionId: transaction?._id,
      subject,
      description,
      category,
      status: 'open',
      priority: 'medium',
      responses: [],
    });

    // Update transaction with ticket reference if applicable
    if (transaction) {
      transaction.ticketId = ticket._id;
      await transaction.save();
    }

    return NextResponse.json({ ticket }, { status: 201 });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Error creating ticket:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to create ticket' },
      { status: 500 }
    );
  }
} 