export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectToDatabase } from '@/lib/mongoose';
import { getUserIncrementHistory } from '@/lib/incrementUtils';
import { User } from '@/models/User';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectToDatabase();
    
    // Get user ID
    const user = await User.findOne({ email: session.user.email });
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Parse dates if provided
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;

    // Get increment history
    const history = await getUserIncrementHistory(user._id, start, end);
    
    return NextResponse.json({ history });
  } catch (error) {
    console.error('Error fetching increment history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch increment history' },
      { status: 500 }
    );
  }
} 