import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import connectDB from '@/lib/db';
import { Settings } from '@/models/Settings';
import { DailyTrade } from '@/models/DailyTrade';
import { User } from '@/models/User';
import { Transaction } from '@/models/Transaction';
import { Profit } from '@/models/Increment';
import { Plan } from '@/models/Plan';

// Crypto pairs to use for simulation
const CRYPTO_PAIRS = ['BTC/USDT', 'ETH/USDT', 'BNB/USDT', 'SOL/USDT'];

// Fetch real-time price from CoinGecko (free, no API key needed)
async function fetchCryptoPrice(pair: string): Promise<number> {
  const coinMap: Record<string, string> = {
    'BTC/USDT': 'bitcoin',
    'ETH/USDT': 'ethereum',
    'BNB/USDT': 'binancecoin',
    'SOL/USDT': 'solana',
  };
  const coinId = coinMap[pair] || 'bitcoin';
  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`,
      { next: { revalidate: 0 } }
    );
    const data = await res.json();
    return data[coinId]?.usd || 50000;
  } catch {
    // Fallback prices if API fails
    const fallback: Record<string, number> = {
      'BTC/USDT': 65000,
      'ETH/USDT': 3500,
      'BNB/USDT': 580,
      'SOL/USDT': 150,
    };
    return fallback[pair] || 50000;
  }
}

// Determine if today is a loss day based on weekly schedule
function isLossDay(date: Date, lossDaysPerWeek: number): boolean {
  // Use day of week to deterministically assign loss days
  // Week starts Monday (1) to Sunday (0)
  const dayOfWeek = date.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
  // Loss days: if lossDaysPerWeek=2, use Wednesday(3) and Saturday(6)
  const lossDays = [3, 6].slice(0, lossDaysPerWeek);
  return lossDays.includes(dayOfWeek);
}

// Generate a random float between min and max with 2 decimal places
function randomBetween(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

export async function POST(request: Request) {
  try {
    // Allow both admin session and cron secret
    const session = await getServerSession(authOptions);
    const body = await request.json().catch(() => ({}));
    const cronSecret = body?.secret || request.headers.get('x-cron-secret');
    
    const isAdmin = session?.user?.role === 'admin';
    const isCron = cronSecret === process.env.CRON_SECRET;
    
    if (!isAdmin && !isCron) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Get settings
    let settings = await Settings.findOne();
    if (!settings) settings = await Settings.create({});

    if (!settings.tradeEnabled) {
      return NextResponse.json({ message: 'Trade generation is disabled' });
    }

    // Check if today's trade already exists
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existingTrade = await DailyTrade.findOne({
      date: { $gte: today, $lt: tomorrow },
    });

    if (existingTrade) {
      return NextResponse.json({
        message: "Today's trade already generated",
        trade: existingTrade,
      });
    }

    // Pick a random crypto pair
    const pair = CRYPTO_PAIRS[Math.floor(Math.random() * CRYPTO_PAIRS.length)];
    const currentPrice = await fetchCryptoPrice(pair);

    // Determine profit or loss
    const lossDay = isLossDay(today, settings.tradeLossDaysPerWeek);
    let tradePercent: number;
    let sellPrice: number;

    if (lossDay) {
      tradePercent = -randomBetween(settings.tradeMinLoss, settings.tradeMaxLoss);
      sellPrice = Math.round(currentPrice * (1 + tradePercent / 100) * 100) / 100;
    } else {
      tradePercent = randomBetween(settings.tradeMinProfit, settings.tradeMaxProfit);
      sellPrice = Math.round(currentPrice * (1 + tradePercent / 100) * 100) / 100;
    }

    // Save the daily trade
    const dailyTrade = await DailyTrade.create({
      date: today,
      pair,
      buyPrice: currentPrice,
      sellPrice,
      tradePercent,
      isProfit: !lossDay,
    });

    // Now distribute profits to all users with active deposits
    if (!lossDay) {
      // Get all plans to determine profit cut
      const plans = await Plan.find();
      const planCuts: Record<string, number> = {
        'Plan 1': settings.planProfitCuts.plan1,
        'Plan 2': settings.planProfitCuts.plan2,
        'Plan 3': settings.planProfitCuts.plan3,
        'Plan 4': settings.planProfitCuts.plan4,
      };

      // Get all approved deposits
      const approvedDeposits = await Transaction.find({
        type: 'deposit',
        status: 'approved',
      }).populate('userId');

      // Group deposits by user
      const userDeposits: Record<string, { amount: number; planId: string; depositId: string }[]> = {};
      for (const deposit of approvedDeposits) {
        const uid = deposit.userId.toString();
        if (!userDeposits[uid]) userDeposits[uid] = [];
        userDeposits[uid].push({
          amount: deposit.amount,
          planId: deposit.planId?.toString() || '',
          depositId: deposit._id.toString(),
        });
      }

      // For each user, calculate their daily profit
      for (const [userId, deposits] of Object.entries(userDeposits)) {
        for (const dep of deposits) {
          // Find the plan for this deposit
          const plan = plans.find(p => p._id.toString() === dep.planId);
          const planName = plan?.name || 'Plan 1';
          const profitCutPercent = planCuts[planName] || 40;

          // User profit = deposit * tradePercent% * profitCut%
          const userProfitPercent = (tradePercent * profitCutPercent) / 100;
          const userProfitAmount = Math.round((dep.amount * userProfitPercent) / 100 * 100) / 100;

          if (userProfitAmount <= 0) continue;

          // Check if profit already exists for this deposit today
          const existingProfit = await Profit.findOne({
            userId,
            depositId: dep.depositId,
            date: { $gte: today, $lt: tomorrow },
            profitType: 'daily',
          });

          if (!existingProfit) {
            await Profit.create({
              userId,
              depositId: dep.depositId,
              amount: userProfitAmount,
              date: today,
              profitType: 'daily',
              status: 'completed',
              isAddedToBalance: false,
            });
          }
        }
      }

      // Process all pending profits (add to user balances)
      const pendingProfits = await Profit.find({
        status: 'completed',
        isAddedToBalance: false,
        date: { $gte: today, $lt: tomorrow },
      });

      for (const profit of pendingProfits) {
        await User.findByIdAndUpdate(profit.userId, {
          $inc: { balance: profit.amount },
        });
        profit.isAddedToBalance = true;
        await profit.save();
      }
    }

    return NextResponse.json({
      success: true,
      trade: dailyTrade,
      message: `Trade generated: ${pair} ${tradePercent > 0 ? '+' : ''}${tradePercent}%`,
    });
  } catch (error) {
    console.error('Error generating trade:', error);
    return NextResponse.json({ error: 'Failed to generate trade' }, { status: 500 });
  }
}
