export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import dbConnect from '@/lib/db';
import { User } from '@/models/User';
import { getReferralStats } from '@/lib/referralUtils';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // Get the user
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get referral statistics for the user
    const referralStats = await getReferralStats(user._id);

    return NextResponse.json(referralStats);
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Error fetching referral data:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to fetch referral data' },
      { status: 500 }
    );
  }
} 