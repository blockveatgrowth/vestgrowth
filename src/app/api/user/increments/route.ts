export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import dbConnect from '@/lib/db';
import { User } from '@/models/User';
import { Profit } from '@/models/Increment';

export async function GET(req: Request) {
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

    // Get query parameters for pagination
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Find profits for this user
    const profits = await Profit.find({ userId: user._id })
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Profit.countDocuments({ userId: user._id });

    return NextResponse.json({
      increments: profits,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Error fetching profits:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to fetch profits' },
      { status: 500 }
    );
  }
} 