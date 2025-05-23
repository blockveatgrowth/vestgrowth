import { Plan } from '@/models/Plan';

/**
 * Initialize default plans in the database
 */
export async function initializePlans() {
  const defaultPlans = [
    {
      name: 'Plan 1',
      minAmount: 50,
      maxAmount: 199,
      directCommissionPercentage: 10,
      dailyProfit: 2, // 2% daily profit
      referralCommissions: {
        level1: 2,
        level2: 1,
        level3: 0.5,
        level4: 0.25,
        level5: 0.025,
      },
    },
    {
      name: 'Plan 2',
      minAmount: 200,
      maxAmount: 499,
      directCommissionPercentage: 10,
      dailyProfit: 3, // 3% daily profit
      referralCommissions: {
        level1: 3,
        level2: 1.5,
        level3: 0.75,
        level4: 0.375,
        level5: 0.025,
      },
    },
    {
      name: 'Plan 3',
      minAmount: 500,
      maxAmount: 1499,
      directCommissionPercentage: 10,
      dailyProfit: 3.5, // 3.5% daily profit
      referralCommissions: {
        level1: 3.5,
        level2: 1.75,
        level3: 0.875,
        level4: 0.4375,
        level5: 0.025,
      },
    },
    {
      name: 'Plan 4',
      minAmount: 1500,
      maxAmount: 5000,
      directCommissionPercentage: 10,
      dailyProfit: 4, // 4% daily profit
      referralCommissions: {
        level1: 4,
        level2: 2,
        level3: 1,
        level4: 0.5,
        level5: 0.025,
      },
    },
  ];

  for (const plan of defaultPlans) {
    await Plan.findOneAndUpdate(
      { name: plan.name },
      plan,
      { upsert: true, new: true }
    );
  }
}

/**
 * Get the appropriate plan for a given deposit amount
 * @param amount The deposit amount
 * @returns The matching plan or null if no plan matches
 */
export async function getPlanForAmount(amount: number) {
  return await Plan.findOne({
    minAmount: { $lte: amount },
    maxAmount: { $gte: amount },
  });
}

/**
 * Calculate direct commission for a deposit based on its plan
 * @param amount The deposit amount
 * @returns The commission amount and plan used
 */
export async function calculateDirectCommission(amount: number, directCommissionPercentage: number = -1) {
  

  const plan = await getPlanForAmount(amount);
  if (!plan) return { commission: 0, plan: null };

  if (directCommissionPercentage !== -1) {
    return { commission: (amount * directCommissionPercentage) / 100, plan };
  }

  const commission = (amount * plan.directCommissionPercentage) / 100;
  return { commission, plan };
}

/**
 * Calculate referral commission for a specific level
 * @param amount The deposit amount
 * @param level The referral level (1-5)
 * @returns The commission amount for that level
 */
export async function calculateReferralCommission(amount: number, level: number, directCommissionPercentage: number = -1) {


  if (directCommissionPercentage !== -1) {
    return (amount * directCommissionPercentage) / 100;
  }

  const plan = await getPlanForAmount(amount);
  if (!plan) return 0;

  // Get level 1 percentage from plan
  const level1Percentage = plan.referralCommissions.level1;
  
  // Calculate percentage for current level by dividing by 2 for each level after 1
  let percentage = level1Percentage;
  for (let i = 1; i < level; i++) {
    percentage = percentage / 2;
  }

  return (amount * percentage) / 100;
} 