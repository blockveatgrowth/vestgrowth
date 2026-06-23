export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { User } from '@/models/User';
import { Transaction } from '@/models/Transaction';
import ReferralModel from '@/models/Referral';
import { Profit } from '@/models/Increment';
import { processReferral, distributeReferralCommissions } from '@/lib/referralUtils';
import { processDailyIncrements } from '@/lib/incrementUtils';
import { connectToDatabase } from '@/lib/mongoose';

async function cleanupTestData() {
  // Delete all test users and their related data
  await User.deleteMany({
    email: {
      $in: [
        'test1@example.com',
        'test2@example.com',
        'test3@example.com',
        'test4@example.com',
        'test5@example.com',
        'increment@example.com',
      ],
    },
  });

  // Delete all test transactions
  await Transaction.deleteMany({
    userId: { $exists: false }, // This will match our test transactions since their users were deleted
  });

  // Delete all test referrals
  await ReferralModel.deleteMany({
    userId: { $exists: false }, // This will match our test referrals since their users were deleted
  });

  // Delete all test profits
  await Profit.deleteMany({
    userId: { $exists: false }, // This will match our test profits since their users were deleted
  });
}

async function createTestUsers() {
  // Create 5 users in a referral chain
  const users = [];
  for (let i = 0; i < 5; i++) {
    const user = new User({
      name: `Test User ${i + 1}`,
      email: `test${i + 1}@example.com`,
      password: 'password123',
      role: 'user',
    });
    await user.save();
    users.push(user);

    // Create referral relationship with the previous user
    if (i > 0) {
      await processReferral(user._id, users[i - 1].referralCode);
    }
  }

  return users;
}

async function testReferralCommission() {
  const results = {
    status: 'running',
    details: [] as string[],
  };

  try {
    results.details.push('Testing referral commission system...');
    
    // Create test users
    const users = await createTestUsers();
    const lastUser = users[users.length - 1];
    
    // Log referral relationships
    results.details.push('\nReferral Relationships:');
    for (let i = 0; i < users.length; i++) {
      const referrals = await ReferralModel.find({ userId: users[i]._id }).sort({ level: 1 });
      results.details.push(`\nUser ${i + 1} (${users[i].email}):`);
      if (referrals.length === 0) {
        results.details.push('- No referrers');
      } else {
        for (const ref of referrals) {
          const referrer = await User.findById(ref.referrerId);
          results.details.push(`- Level ${ref.level} referrer: ${referrer?.email} (${ref.commissionPercentage}%)`);
        }
      }
    }
    
    // Create a deposit for the last user
    const deposit = new Transaction({
      userId: lastUser._id,
      type: 'deposit',
      amount: 1000, // $1000 deposit
      status: 'approved',
    });
    await deposit.save();
    
    // Get initial balances
    const initialBalances = await Promise.all(
      users.map(user => User.findById(user._id).select('balance referralEarnings'))
    );
    
    // Process referral commission
    await distributeReferralCommissions(lastUser._id, deposit.amount, -1);
    
    // Get final balances
    const finalBalances = await Promise.all(
      users.map(user => User.findById(user._id).select('balance referralEarnings'))
    );
    
    // Verify commission distribution
    const expectedCommissions = [
      100, // 10% of 1000 for level 1 (test4@example.com)
      50,  // 5% of 1000 for level 2 (test3@example.com)
      25,  // 2.5% of 1000 for level 3 (test2@example.com)
      12.5, // 1.25% of 1000 for level 4 (test1@example.com)
    ];
    
    results.details.push('\nReferral Commission Test Results:');
    
    // Get referrals for the last user
    const referrals = await ReferralModel.find({ userId: lastUser._id }).sort({ level: 1 });
    
    for (let i = 0; i < referrals.length; i++) {
      const referral = referrals[i];
      const referrer = await User.findById(referral.referrerId);
      const initial = initialBalances.find(b => b._id.toString() === referral.referrerId.toString());
      const final = finalBalances.find(b => b._id.toString() === referral.referrerId.toString());
      const expected = expectedCommissions[i];
      const received = final.balance - initial.balance;
      
      results.details.push(`Level ${referral.level} Referrer (${referrer.email}):`);
      results.details.push(`- Expected Commission: $${expected}`);
      results.details.push(`- Received Commission: $${received}`);
      results.details.push(`- Match: ${Math.abs(expected - received) < 0.01 ? '✅' : '❌'}`);
    }

    results.status = 'success';
  } catch (error) {
    results.status = 'error';
    results.details.push(`Error in referral test: ${error instanceof Error ? error.message : String(error)}`);
  }

  return results;
}

async function testDailyIncrement() {
  const results = {
    status: 'running',
    details: [] as string[],
  };

  try {
    results.details.push('\nTesting daily increment system...');
    
    // Create a test user
    const user = new User({
      name: 'Increment Test User',
      email: 'increment@example.com',
      password: 'password123',
      role: 'user',
    });
    await user.save();
    results.details.push('Created test user');
    
    // Create a deposit
    const deposit = new Transaction({
      userId: user._id,
      type: 'deposit',
      amount: 1000, // $1000 deposit
      status: 'approved',
    });
    await deposit.save();
    results.details.push('Created test deposit');
    
    // Get initial balance
    const initialBalance = await User.findById(user._id).select('balance');
    results.details.push(`Initial balance: $${initialBalance.balance}`);
    
    // Process daily increment
    try {
      await processDailyIncrements(true); // true for test mode
      results.details.push('Processed daily increment');
    } catch (error) {
      results.details.push(`Error processing increment: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
    
    // Get final balance
    const finalBalance = await User.findById(user._id).select('balance');
    results.details.push(`Final balance: $${finalBalance.balance}`);
    
    // Verify increment
    const expectedIncrement = 100; // 10% of 1000
    const receivedIncrement = finalBalance.balance - initialBalance.balance;
    
    results.details.push('\nDaily Increment Test Results:');
    results.details.push(`- Expected Increment: $${expectedIncrement}`);
    results.details.push(`- Received Increment: $${receivedIncrement}`);
    results.details.push(`- Match: ${Math.abs(expectedIncrement - receivedIncrement) < 0.01 ? '✅' : '❌'}`);

    // Check profit record
    const profit = await Profit.findOne({ userId: user._id });
    if (profit) {
      results.details.push('\nProfit Record:');
      results.details.push(`- Amount: $${profit.amount}`);
      results.details.push(`- Status: ${profit.status}`);
      results.details.push(`- Referrer Earnings: ${JSON.stringify(profit.referrerEarnings, null, 2)}`);
    } else {
      results.details.push('\nNo profit record found');
    }

    results.status = 'success';
  } catch (error) {
    results.status = 'error';
    results.details.push(`Error in increment test: ${error instanceof Error ? error.message : String(error)}`);
  }

  return results;
}

export async function GET() {
  try {
    await connectToDatabase();
    
    // Clean up any existing test data
    await cleanupTestData();
    
    // Run tests
    const referralResults = await testReferralCommission();
    const incrementResults = await testDailyIncrement();
    
    // Clean up test data
    await cleanupTestData();
    
    return NextResponse.json({
      referralTest: referralResults,
      incrementTest: incrementResults,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Test execution failed' },
      { status: 500 }
    );
  }
} 