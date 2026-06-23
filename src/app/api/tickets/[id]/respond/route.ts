export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import dbConnect from '@/lib/db';
import Ticket from '@/models/Ticket';

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

    const { message } = await request.json();
    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Find the ticket
    const ticket = await Ticket.findById(id);
    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    // Check if user is authorized (either the ticket owner or an admin)
    const isAdmin = session.user.role === 'admin';
    const isOwner = ticket.userId.toString() === session.user.id;
    
    if (!isAdmin && !isOwner) {
      return NextResponse.json(
        { error: 'Not authorized to respond to this ticket' },
        { status: 403 }
      );
    }

    // Add the response
    ticket.responses.push({
      responseBy: session.user.id,
      message,
      createdAt: new Date(),
    });

    // If admin is responding, update status to in-progress if it's open
    if (isAdmin && ticket.status === 'open') {
      ticket.status = 'in-progress';
    }

    await ticket.save();

    return NextResponse.json({ ticket }, { status: 200 });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Error adding response to ticket:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to add response' },
      { status: 500 }
    );
  }
} 