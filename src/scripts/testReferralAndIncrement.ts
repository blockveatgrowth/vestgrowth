import mongoose, { Types } from 'mongoose';
import { connectToDatabase } from '../lib/mongoose';
import { User, UserDocument } from '../models/User';
import { Transaction } from '../models/Transaction';
import { Plan, IPlan } from '../models/Plan';
import { processReferral, distributeReferralCommissions } from '../lib/referralUtils';
import { processDailyIncrements } from '../lib/incrementUtils';
import { initializePlans } from '../lib/planUtils';

interface UserBalance {
  userId: string;
  balance: number;
}

// Define level keys and their corresponding percentages
const REFERRAL_LEVELS = {
  1: 0.10, // 10%
  2: 0.05, // 5%
  3: 0.025, // 2.5%
  4: 0.0125, // 1.25%
  5: 0.0075, // 0.75%
} as const;

type ReferralLevel = keyof typeof REFERRAL_LEVELS;

type PlanDocument = mongoose.Document & IPlan;

async function createTestUsers(): Promise<UserDocument[]> {
  // Create 5 users in a referral chain
  const users: UserDocument[] = [];
  for (let i = 0; i < 5; i++) {
    const user = await User.create({
      name: `Test User ${i + 1}`,
      email: `test${i + 1}@example.com`,
      password: 'password123',
      role: 'user',
    });
    users.push(user);
  }

  // Create referral relationships
  for (let i = 1; i < users.length; i++) {
    await processReferral(users[i]._id as Types.ObjectId, users[i - 1].referralCode);
  }

  return users;
}

async function testPlanSelection() {
  console.log('\nTesting plan selection system...');

  // Initialize plans
  await initializePlans();
  const plans = (await Plan.find({}).lean()) as unknown as IPlan[];
  plans.sort((a: PlanDocument, b: PlanDocument) => a.minAmount - b.minAmount);
  
  // Create a test user
  const user = await User.create({
    name: 'Plan Test User',
    email: 'plantest@example.com',
    password: 'password123',
    role: 'user',
  });

  const testCases = [
    {
      name: 'Valid Plan 1 deposit',
      amount: 100,
      planId: plans[0]._id,
      expectSuccess: true,
    },
    {
      name: 'Valid Plan 2 deposit',
      amount: 300,
      planId: plans[1]._id,
      expectSuccess: true,
    },
    {
      name: 'Invalid amount for Plan 1',
      amount: 500,
      planId: plans[0]._id,
      expectSuccess: false,
    },
    {
      name: 'Amount below minimum',
      amount: 20,
      planId: plans[0]._id,
      expectSuccess: false,
    },
  ];

  console.log('\nPlan Selection Test Results:');
  for (const testCase of testCases) {
    console.log(`\nTest: ${testCase.name}`);
    try {
      await Transaction.create({
        userId: user._id as Types.ObjectId,
        type: 'deposit',
        amount: testCase.amount,
        planId: testCase.planId,
        status: 'pending',
        transactionId: `TEST-${Date.now()}`,
      });
      
      console.log('✅ Transaction created successfully');
      console.log(`- Amount: $${testCase.amount}`);
      const plan = await Plan.findById(testCase.planId).lean<PlanDocument>().exec();
      console.log(`- Plan: ${plan?.name}`);
      
      if (!testCase.expectSuccess) {
        console.log('❌ Expected failure but got success');
      }
    } catch (error) {
      if (testCase.expectSuccess) {
        console.log(`❌ Expected success but got error: ${error instanceof Error ? error.message : String(error)}`);
      } else {
        console.log(`✅ Got expected error: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  }
}

async function testReferralCommission() {
  console.log('\nTesting referral commission system...');
  
  // Create test users
  const users = await createTestUsers();
  const lastUser = users[users.length - 1];
  
  // Initialize plans
  await initializePlans();
  const plans = (await Plan.find({}).lean()) as unknown as IPlan[];
  plans.sort((a: PlanDocument, b: PlanDocument) => a.minAmount - b.minAmount);
  const plan = plans[2]; // Use Plan 3 ($500-1499) for testing
  
  // Create a deposit for the last user
  const deposit = await Transaction.create({
    userId: lastUser._id as Types.ObjectId,
    type: 'deposit',
    amount: 1000,
    planId: plan._id,
    status: 'approved',
    transactionId: `TEST-${Date.now()}`,
  });
  
  // Get initial balances
  const initialBalances = await Promise.all(
    users.map(user => User.findById(user._id).select('balance referralEarnings').lean<UserBalance>().exec())
  );
    
  // Process referral commission
  await distributeReferralCommissions(lastUser._id as Types.ObjectId, deposit.amount, -1);
  
  // Get final balances
  const finalBalances = await Promise.all(
    users.map(user => User.findById(user._id).select('balance referralEarnings').lean<UserBalance>().exec())
  );
  
  // Verify commission distribution
  console.log('\nReferral Commission Test Results:');
  console.log(`Using ${plan.name} with deposit amount: $${deposit.amount}`);
  
  for (let i = 0; i < users.length - 1; i++) {
    const initial = initialBalances[i];
    const final = finalBalances[i];
    const level = Math.min(Math.max(1, i + 1), 5) as ReferralLevel;
    const percentage = REFERRAL_LEVELS[level];
    const expectedAmount = (deposit.amount * percentage) / 100;
    const received = (final?.balance ?? 0) - (initial?.balance ?? 0);
    
    console.log(`\nLevel ${level} Referrer (${users[i].email}):`);
    console.log(`- Commission Rate: ${percentage * 100}%`);
    console.log(`- Expected Amount: $${expectedAmount.toFixed(2)}`);
    console.log(`- Received Amount: $${received.toFixed(2)}`);
    console.log(`- Match: ${Math.abs(expectedAmount - received) < 0.01 ? '✅' : '❌'}`);
  }
}

async function testDailyIncrement() {
  console.log('\nTesting daily increment system...');
  
  // Initialize plans
  await initializePlans();
  const plans = (await Plan.find({}).lean()) as unknown as IPlan[];
  plans.sort((a: PlanDocument, b: PlanDocument) => a.minAmount - b.minAmount);
  const plan = plans[2]; // Use Plan 3 for testing (3.5% daily profit)
  
  // Create a test user
  const user = await User.create({
    name: 'Increment Test User',
    email: 'increment@example.com',
    password: 'password123',
    role: 'user',
  });
  
  // Create a deposit
  const deposit = await Transaction.create({
    userId: user._id as Types.ObjectId,
    type: 'deposit',
    amount: 1000,
    planId: plan._id,
    status: 'approved',
    transactionId: `TEST-${Date.now()}`,
  });
  
  // Get initial balance
  const initialBalance = await User.findById(user._id).select('balance').lean<UserBalance>().exec();
  
  // Process daily increment
  await processDailyIncrements(true); // true for test mode
  
  // Get final balance
  const finalBalance = await User.findById(user._id).select('balance').lean<UserBalance>().exec();
  
  // Verify increment using plan's daily profit percentage
  const expectedIncrement = deposit.amount * (plan.dailyProfit / 100); // Use plan's daily profit percentage
  const receivedIncrement = (finalBalance?.balance ?? 0) - (initialBalance?.balance ?? 0);
  
  console.log('\nDaily Increment Test Results:');
  console.log(`Using ${plan.name} with deposit amount: $${deposit.amount}`);
  console.log(`Plan daily profit: ${plan.dailyProfit}%`);
  console.log(`- Expected Increment: $${expectedIncrement}`);
  console.log(`- Received Increment: $${receivedIncrement}`);
  console.log(`- Match: ${Math.abs(expectedIncrement - receivedIncrement) < 0.01 ? '✅' : '❌'}`);
}

async function runTests() {
  try {
    await connectToDatabase();
    
    // Run all tests
    await testPlanSelection();
    await testReferralCommission();
    await testDailyIncrement();
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error: unknown) {
    console.error('Test failed:', error instanceof Error ? error.message : String(error));
    await mongoose.disconnect();
    process.exit(1);
  }
}

runTests(); 