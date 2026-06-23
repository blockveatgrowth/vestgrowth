export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/db";
import { User } from "@/models/User";
import { Transaction } from "@/models/Transaction";
import { compare, hash } from "bcrypt";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectDB();

    // Fetch user data
    const user = await User.findById(session.user.id).select("-password");
    
    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Calculate total deposits and earnings
    const transactions = await Transaction.find({
      user: session.user.id,
      status: "completed",
    });

    const totalDeposits = transactions
      .filter(tx => tx.type === "deposit")
      .reduce((sum, tx) => sum + tx.amount, 0);

    const totalEarnings = transactions
      .filter(tx => tx.type === "profit" || tx.type === "commission")
      .reduce((sum, tx) => sum + tx.amount, 0);

    // Prepare response data - use profileImage first, fall back to avatar for legacy
    const profileData = {
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      role: user.role,
      balance: user.balance,
      totalDeposits,
      totalEarnings,
      avatar: user.profileImage || user.avatar || null,
      referralCode: user.referralCode || null,
    };

    return NextResponse.json(profileData);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { name, email, currentPassword, newPassword } = body;

    await connectDB();

    // Fetch user with password for verification
    const user = await User.findById(session.user.id);
    
    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Verify current password if trying to change password
    if (newPassword) {
      if (!currentPassword) {
        return new NextResponse("Current password is required", { status: 400 });
      }

      const isPasswordValid = await compare(currentPassword, user.password);
      if (!isPasswordValid) {
        return new NextResponse("Current password is incorrect", { status: 400 });
      }
    }

    // Check if email is already taken by another user
    if (email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return new NextResponse("Email is already taken", { status: 400 });
      }
    }

    // Update user data
    const updates: Record<string, unknown> = {};
    if (name) updates.name = name;
    if (email) updates.email = email;
    if (newPassword) {
      updates.password = await hash(newPassword, 12);
    }

    // Apply updates
    await User.findByIdAndUpdate(session.user.id, updates);

    return NextResponse.json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
