import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import dbConnect from '@/lib/db';
import { Plan } from '@/models/Plan';
import { initializePlans } from '@/lib/planUtils';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // Initialize plans if they don't exist
    await initializePlans();

    // Get all plans sorted by minimum amount
    const plans = await Plan.find().sort({ minAmount: 1 });

    return NextResponse.json({
      plans: plans.map(plan => ({
        id: plan._id,
        name: plan.name,
        minAmount: plan.minAmount,
        maxAmount: plan.maxAmount,
        directCommissionPercentage: plan.directCommissionPercentage,
        referralCommissions: plan.referralCommissions,
      })),
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Error fetching plans:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to fetch plans' },
      { status: 500 }
    );
  }
} 