export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Plan } from '@/models/Plan';

const plans = [
  {
    name: 'Starter Plan',
    minAmount: 30,
    maxAmount: 299,
    directCommissionPercentage: 10,
    referralCommissions: {
      level1: 10,
      level2: 5,
      level3: 2.5,
      level4: 1.25,
      level5: 0.75,
    },
  },
  {
    name: 'Premium Plan',
    minAmount: 300,
    maxAmount: 999,
    directCommissionPercentage: 10,
    referralCommissions: {
      level1: 10,
      level2: 5,
      level3: 2.5,
      level4: 1.25,
      level5: 0.75,
    },
  },
  {
    name: 'Pro Plan',
    minAmount: 1000,
    maxAmount: 100000,
    directCommissionPercentage: 10,
    referralCommissions: {
      level1: 10,
      level2: 5,
      level3: 2.5,
      level4: 1.25,
      level5: 0.75,
    },
  },
];

export async function GET() {
  try {
    await connectDB();
    
    // Clear existing plans
    await Plan.deleteMany({});
    
    // Insert new plans
    await Plan.insertMany(plans);
    
    return NextResponse.json({ message: 'Plans seeded successfully!' });
  } catch (error) {
    console.error('Error seeding plans:', error);
    return NextResponse.json(
      { error: 'Failed to seed plans' },
      { status: 500 }
    );
  }
} 