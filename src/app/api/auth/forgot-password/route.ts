export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { User } from "@/models/User";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return new NextResponse("Email is required", { status: 400 });
    }

    await connectDB();

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return new NextResponse("No account found with this email", { status: 404 });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Save reset token to user
    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    // Return the reset token and URL (for development purposes only)
    return NextResponse.json({
      message: "Password reset token generated successfully",
      resetToken,
      resetUrl: `/auth/reset-password/${resetToken}`,
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 