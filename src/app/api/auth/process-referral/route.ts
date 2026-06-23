export const dynamic = 'force-dynamic';
import { NextResponse, NextRequest } from "next/server";
import connectDB from "@/lib/db";
import { User } from "@/models/User";
import { processReferral } from "@/lib/referralUtils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, referralCode } = body;

    // Validate inputs
    if (!userId || !referralCode) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Connect to the database
    await connectDB();

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Find the referrer using the referral code
    const referrer = await User.findOne({ referralCode }).select('_id');
    if (!referrer) {
      throw new Error('Invalid referral code');
    }

    // update the user's referredBy field
    user.referredBy = referrer._id;
    await user.save();

    // Process the referral
    await processReferral(user._id, referralCode);

    return NextResponse.json({
      message: "Referral processed successfully"
    });
  } catch (error) {
    console.error("Referral processing error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to process referral" },
      { status: 500 }
    );
  }
} 