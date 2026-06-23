export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { User } from "@/models/User";
import crypto from "crypto";
import { sendMagicLinkEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    await connectDB();
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json({ message: "If that email exists, a magic link has been sent." });
    }

    // Generate secure magic token (15 min expiry)
    const magicToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(magicToken).digest("hex");

    user.magicToken = hashedToken;
    user.magicTokenExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    await user.save();

    try {
      await sendMagicLinkEmail(user.email, user.name, magicToken);
    } catch (emailError) {
      console.error("Magic link email error:", emailError);
    }

    return NextResponse.json({ message: "If that email exists, a magic link has been sent." });
  } catch (error) {
    console.error("Magic link error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
