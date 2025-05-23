import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { calculateDailyIncrements, processPendingIncrements } from '@/lib/increment';
import { User } from '@/models/User';
import { initializePlans } from '@/lib/planUtils';
import dbConnect from '@/lib/db';

export async function GET() {
  try {
    // const session = await getServerSession(authOptions);
    // if (!session) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    await dbConnect();

    // // Check if user is admin
    // const user = await User.findOne({ email: session.user.email });
    // if (!user || user.role !== 'admin') {
    //   return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    // }

    // Initialize plans if they don't exist
    await initializePlans();

    // Process daily increments
    await calculateDailyIncrements();
    await processPendingIncrements();

    return NextResponse.json({ 
      message: 'Daily increments processed successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error processing daily increments:', error);
    return NextResponse.json(
      { error: 'Failed to process daily increments' },
      { status: 500 }
    );
  }
} 