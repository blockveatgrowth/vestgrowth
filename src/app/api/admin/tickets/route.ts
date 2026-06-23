export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import dbConnect from '@/lib/db';
import Ticket from '@/models/Ticket';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admins can access this endpoint
    if (session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    
    // Filtering parameters
    const status = url.searchParams.get('status');
    const category = url.searchParams.get('category');
    const priority = url.searchParams.get('priority');
    const searchTerm = url.searchParams.get('search');
    
    await dbConnect();

    const query: Record<string, unknown> = {};
    
    // Apply filters if provided
    if (status) query.status = status;
    if (category) query.category = category;
    if (priority) query.priority = priority;
    
    // Apply search term if provided (search in subject and description)
    if (searchTerm) {
      query.$or = [
        { subject: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } },
      ];
    }

    const tickets = await Ticket.find(query)
      .sort({ updatedAt: -1 })
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
    console.error('Error fetching admin tickets:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to fetch tickets' },
      { status: 500 }
    );
  }
} 