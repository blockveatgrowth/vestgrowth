export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { User } from "@/models/User";
import crypto from "crypto";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    if (!token || !email) {
      return NextResponse.redirect(new URL("/auth/signin?error=InvalidMagicLink", request.url));
    }

    await connectDB();

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      email: decodeURIComponent(email).toLowerCase().trim(),
      magicToken: hashedToken,
      magicTokenExpiry: { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.redirect(new URL("/auth/signin?error=MagicLinkExpired", request.url));
    }

    // Clear the magic token
    user.magicToken = undefined;
    user.magicTokenExpiry = undefined;
    await user.save();

    // Redirect to a special signin page that auto-signs in via credentials
    // We use a temporary session token approach: store a short-lived verified token
    const sessionToken = crypto.randomBytes(32).toString("hex");
    const hashedSessionToken = crypto.createHash("sha256").update(sessionToken).digest("hex");
    user.magicToken = hashedSessionToken;
    user.magicTokenExpiry = new Date(Date.now() + 2 * 60 * 1000); // 2 min to complete sign-in
    await user.save();

    // Redirect to the magic sign-in page with the session token
    const baseUrl = process.env.NEXTAUTH_URL || new URL(request.url).origin;
    return NextResponse.redirect(
      new URL(`/auth/magic-signin?token=${sessionToken}&email=${encodeURIComponent(user.email)}`, baseUrl)
    );
  } catch (error) {
    console.error("Magic verify error:", error);
    return NextResponse.redirect(new URL("/auth/signin?error=MagicLinkError", request.url));
  }
}
