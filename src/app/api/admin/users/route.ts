export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import dbConnect from '@/lib/db';
import { User } from '@/models/User';

interface SearchQuery {
  $or?: Array<{
    name?: { $regex: string; $options: string };
    email?: { $regex: string; $options: string };
  }>;
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated and is an admin
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Check if user has admin role directly from session
    if (session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Access denied. Admin privileges required.' },
        { status: 403 }
      );
    }
    
    await dbConnect();

    // Get query parameters
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const searchTerm = url.searchParams.get('search') || '';
    
    // Build query
    const query: SearchQuery = {};
    if (searchTerm) {
      query.$or = [
        { name: { $regex: searchTerm, $options: 'i' } },
        { email: { $regex: searchTerm, $options: 'i' } },
      ];
    }
    
    // Fetch users with pagination
    const skip = (page - 1) * limit;
    
    const users = await User.find(query, {
      password: 0, // Exclude password field for security
      resetToken: 0,
      resetTokenExpiry: 0,
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    
    // Count total documents for pagination
    const total = await User.countDocuments(query);
    
    // Get statistics
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    
    return NextResponse.json({
      users,
      stats: {
        totalAdmins,
      },
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Error fetching users:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to fetch users' },
      { status: 500 }
    );
  }
} 