import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { Transaction } from '@/models/Transaction';
import { User } from '@/models/User';
import { connectToDatabase } from '@/lib/mongoose';
import mongoose from 'mongoose';
import { distributeReferralCommissions } from '@/lib/referralUtils';
import { Profit } from '@/models/Increment';


  export async function POST(request: NextRequest) {

    console.log('request.nextUrl.pathname', request.nextUrl.pathname);

    const segments = request.nextUrl.pathname.split("/").filter(Boolean); // removes empty strings
    const secondLast = segments[segments.length - 2];
    const id = secondLast;
    console.log('id', id);
    if (!id) {
      return NextResponse.json({ success: false, error: 'User ID not provided test' }, { status: 400 });
    }


  try {

    if (!id) {
      return NextResponse.json(
        { error: 'Transaction ID is required' },
        { status: 400 }
      );
    }
    

    const session = await getServerSession();
    
    // Check if user is authenticated and is an admin
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      );
    }
    
    // Connect to database
    await connectToDatabase();
    
    // Get user from database
    const admin = await User.findOne({ email: session.user.email });
    
    if (!admin || admin.role !== 'admin') {
      return NextResponse.json(
        { error: 'Access denied. Admin privileges required.' },
        { status: 403 }
      );
    }
    
    
    // Validate MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid transaction ID' },
        { status: 400 }
      );
    }
    
    // Find the transaction
    const transaction = await Transaction.findById(id);
    
    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }
    
    // Check if transaction is already processed
    if (transaction.status !== 'pending') {
      return NextResponse.json(
        { error: 'Transaction has already been processed' },
        { status: 400 }
      );
    }
    
    // Get the user associated with this transaction
    const user = await User.findById(transaction.userId);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User associated with this transaction not found' },
        { status: 404 }
      );
    }
    
    // Process the transaction based on type
    if (transaction.type === 'deposit') {
      // Always add the deposit amount to the balance
      user.balance += transaction.amount;
      let directCommissionPercentage = -1;
      
      
      // Add welcome bonus if this is their first deposit
      if (!user.hasReceivedWelcomeBonus) {
        directCommissionPercentage = 10;
        console.log('welcomeBonus here ', transaction.amount);
        const welcomeBonus = transaction.amount * 0.1;
        
        // Create welcome bonus profit record
        await Profit.create({
          userId: user._id,
          depositId: transaction._id,
          amount: welcomeBonus,
          date: new Date(),
          profitType: 'welcome',
          status: 'completed',
          isAddedToBalance: false
        });
        
        user.hasReceivedWelcomeBonus = true;
        transaction.notes = `Welcome bonus of $${welcomeBonus.toFixed(2)} (10%) added to deposit.`;
      }
      
      await user.save();

      
      // Distribute referral commissions
      await distributeReferralCommissions(transaction.userId, transaction.amount, directCommissionPercentage);
    } else if (transaction.type === 'withdrawal') {
      // Calculate total balance including all sources of funds
      const [deposits, withdrawals, profits] = await Promise.all([
        Transaction.aggregate([
          { $match: { userId: user._id, type: 'deposit', status: 'approved' } },
          { $group: { _id: null, total: { $sum: '$amount' } } },
        ]),
        Transaction.aggregate([
          { $match: { userId: user._id, type: 'withdrawal', status: 'approved' } },
          { $group: { _id: null, total: { $sum: '$amount' } } },
        ]),
        Profit.aggregate([
          { 
            $match: { 
              userId: user._id, 
              status: 'completed',
              // isAddedToBalance: true
            } 
          },
          { $group: { _id: null, total: { $sum: '$amount' } } },
        ])
      ]);

      const totalDeposits = deposits[0]?.total || 0;
      const totalWithdrawals = withdrawals[0]?.total || 0;
      const totalProfits = profits[0]?.total || 0;

      const currentBalance = totalDeposits + totalProfits - totalWithdrawals;
      const lockedAmount = totalDeposits; // Lock amount is now equal to total deposits
      const availableBalance = currentBalance - lockedAmount;

      // Check if user has sufficient available balance
      if (transaction.amount > availableBalance) {
        return NextResponse.json(
          { error: `Insufficient available balance. Maximum withdrawal amount is ${availableBalance.toFixed(2)}` },
          { status: 400 }
        );
      }
      
      // Update user's balance by subtracting the withdrawal amount
      user.balance = currentBalance - transaction.amount;
      await user.save();
    }
    
    // Update the transaction status
    transaction.status = 'approved';
    transaction.approvedBy = admin._id;
    transaction.approvedAt = new Date();
    await transaction.save();
    
    // Return response with welcome bonus info if applicable
    const response = {
      message: `Transaction ${transaction.type} approved successfully`,
      transaction,
      ...(transaction.type === 'deposit' && !user.hasReceivedWelcomeBonus && {
        welcomeBonus: transaction.amount * 0.1
      })
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error approving transaction:', error);
    return NextResponse.json(
      { error: 'Failed to approve transaction' },
      { status: 500 }
    );
  }
} 