import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { User } from "@/models/User";
import { hash } from "bcrypt";

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return new NextResponse("Token and password are required", { status: 400 });
    }

    await connectDB();

    // Find user by reset token and check if it's still valid
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() },
    });

    if (!user) {
      return new NextResponse("Invalid or expired reset token", { status: 400 });
    }

    // Hash new password
    const hashedPassword = await hash(password, 12);

    // Update user's password and clear reset token
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    return NextResponse.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 