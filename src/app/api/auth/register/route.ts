import { NextResponse, NextRequest } from "next/server";
import { hash } from "bcrypt";
import connectDB from "@/lib/db";
import { User } from "@/models/User";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { name, email, password, referralCode } = body;

    // Validate inputs
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Connect to the database
    await connectDB();

    // Check if user exists and hash password in parallel
    const [existingUser, hashedPassword] = await Promise.all([
      User.findOne({ email }).select('_id').lean(),
      hash(password, 8)  // Reduced from 10 to 8 rounds for better performance while maintaining security
    ]);

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Check if referral code exists
    const referredBy = referralCode ? await User.findOne({ referralCode }).select('_id').lean() as { _id: string } | null : null;

    // Create the user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      referredBy: referredBy?._id,
    });

    // Return success
    return NextResponse.json(
      {
        message: "User registered successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          referralCode: user.referralCode,
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    
    // Check for MongoDB duplicate key error
    if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to register user" },
      { status: 500 }
    );
  }
} 