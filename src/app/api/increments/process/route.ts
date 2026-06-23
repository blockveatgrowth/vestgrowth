export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { processDailyIncrements } from '@/lib/incrementUtils';
import { connectToDatabase } from '@/lib/db';

const BATCH_SIZE = 100; // Process users in batches of 100
const TIMEOUT = 50000; // 50 second timeout

export async function POST(req: NextRequest) {
  try {
    // Connect to database
    await connectToDatabase();

    // Get session to check if user is admin
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is admin
    const isAdmin = session.user.role === 'admin';
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Only admins can process increments' },
        { status: 403 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(req.url);
    const isTest = searchParams.get('test') === 'true';
    const batchSize = parseInt(searchParams.get('batchSize') || String(BATCH_SIZE));
    
    // Create a timeout promise
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Processing timeout')), TIMEOUT);
    });

    // Process increments with timeout
    const processPromise = processDailyIncrements(isTest, batchSize);
    
    // Race between processing and timeout
    await Promise.race([processPromise, timeoutPromise]);

    return NextResponse.json(
      { message: 'Increments processed successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing increments:', error);
    
    // Check if it's a timeout error
    if (error instanceof Error && error.message === 'Processing timeout') {
      return NextResponse.json(
        { error: 'Processing timed out. Please try with a smaller batch size.' },
        { status: 408 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to process increments' },
      { status: 500 }
    );
  }
} 