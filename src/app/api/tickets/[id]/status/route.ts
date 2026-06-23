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

    // Only admins can update ticket status
    if (session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Only admins can update ticket status' },
        { status: 403 }
      );
    }

    const { status } = await request.json();
    if (!status || !['open', 'in-progress', 'resolved', 'closed'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      );
    }

    await dbConnect();

    const ticket = await Ticket.findById(id);
    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    ticket.status = status;
    await ticket.save();

    return NextResponse.json({ ticket }, { status: 200 });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Error updating ticket status:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to update ticket status' },
      { status: 500 }
    );
  }
} 