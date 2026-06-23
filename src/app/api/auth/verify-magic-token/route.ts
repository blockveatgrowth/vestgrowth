export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { User } from "@/models/User";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const { token, email } = await request.json();

    if (!token || !email) {
      return NextResponse.json({ valid: false, error: "Missing token or email" }, { status: 400 });
    }

    await connectDB();

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
      magicToken: hashedToken,
      magicTokenExpiry: { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.json({ valid: false, error: "Invalid or expired token" }, { status: 401 });
    }

    // Clear token after use
    user.magicToken = undefined;
    user.magicTokenExpiry = undefined;
    await user.save();

    return NextResponse.json({
      valid: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.profileImage || null,
      },
    });
  } catch (error) {
    console.error("Verify magic token error:", error);
    return NextResponse.json({ valid: false, error: "Server error" }, { status: 500 });
  }
}
