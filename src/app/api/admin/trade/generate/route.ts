export const dynamic = 'force-dynamic';
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
import Referral from '@/models/Referral';

// Referral daily profit mirror rates per level
// Each referrer earns X% of their referral's daily profit
const REFERRAL_DAILY_RATES: Record<number, number> = {
  1: 10, // Level 1 referrer gets 10% of referral's daily profit
  2: 5,
  3: 3,
  4: 2,
  5: 1,
};

// Crypto pairs mapping
const CRYPTO_PAIRS: { id: string; pair: string }[] = [
  { id: 'bitcoin', pair: 'BTC/USDT' },
  { id: 'ethereum', pair: 'ETH/USDT' },
  { id: 'binancecoin', pair: 'BNB/USDT' },
  { id: 'solana', pair: 'SOL/USDT' },
  { id: 'ripple', pair: 'XRP/USDT' },
];

interface PriceRange {
  high: number;
  low: number;
  current: number;
}

// Fetch real 24h high/low/current from CoinGecko markets endpoint (no API key needed)
async function fetch24hPriceRange(coinId: string): Promise<PriceRange | null> {
  try {
    const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinId}&order=market_cap_desc&per_page=1&page=1&sparkline=false`;
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 0 },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data) || !data.length) return null;
    const coin = data[0];
    return {
      high: coin.high_24h as number,
      low: coin.low_24h as number,
      current: coin.current_price as number,
    };
  } catch (err) {
    console.error(`CoinGecko fetch error for ${coinId}:`, err);
    return null;
  }
}

// Fallback static ranges if CoinGecko is unavailable
const FALLBACK_RANGES: Record<string, PriceRange> = {
  bitcoin:     { high: 68000, low: 63000, current: 65500 },
  ethereum:    { high: 3700,  low: 3400,  current: 3550  },
  binancecoin: { high: 610,   low: 570,   current: 590   },
  solana:      { high: 165,   low: 145,   current: 155   },
  ripple:      { high: 0.62,  low: 0.54,  current: 0.58  },
};

function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function round4(n: number): number {
  return Math.round(n * 10000) / 10000;
}

// Determine if today is a loss day using a deterministic weekly schedule
function isLossDay(date: Date, lossDaysPerWeek: number): boolean {
  // Wednesday (3) and Saturday (6) are default loss days
  const lossWeekdays = [3, 6, 2, 5, 1, 4, 0].slice(0, Math.min(lossDaysPerWeek, 6));
  return lossWeekdays.includes(date.getDay());
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json().catch(() => ({}));
    const cronSecret = (body as { secret?: string })?.secret || request.headers.get('x-cron-secret');

    const isAdmin = session?.user?.role === 'admin';
    const isCron = cronSecret === process.env.CRON_SECRET;

    if (!isAdmin && !isCron) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    let settings = await Settings.findOne();
    if (!settings) settings = await Settings.create({});

    if (!settings.tradeEnabled) {
      return NextResponse.json({ message: 'Trade generation is disabled' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Prevent duplicate trades
    const existingTrade = await DailyTrade.findOne({ date: { $gte: today, $lt: tomorrow } });
    if (existingTrade) {
      return NextResponse.json({ message: "Today's trade already generated", trade: existingTrade });
    }

    // Pick a random crypto pair
    const chosen = CRYPTO_PAIRS[Math.floor(Math.random() * CRYPTO_PAIRS.length)];

    // Fetch real 24h price range
    let priceRange = await fetch24hPriceRange(chosen.id);
    if (!priceRange || priceRange.high <= priceRange.low) {
      priceRange = FALLBACK_RANGES[chosen.id] || FALLBACK_RANGES.bitcoin;
    }

    const { high, low } = priceRange;
    const range = high - low;

    const lossDay = isLossDay(today, settings.tradeLossDaysPerWeek);
    let buyPrice: number;
    let sellPrice: number;
    let tradePercent: number;

    if (lossDay) {
      // Loss scenario: buy in the upper portion of the day's range, sell lower
      // This simulates buying near the daily high and selling lower (realistic loss)
      const buyFraction = randomBetween(0.55, 0.95); // buy in upper 45% of range
      buyPrice = round4(low + range * buyFraction);

      const lossPct = randomBetween(settings.tradeMinLoss, settings.tradeMaxLoss);
      tradePercent = -round4(lossPct);

      sellPrice = round4(buyPrice * (1 + tradePercent / 100));
      // Clamp sell price so it doesn't go below the day's low
      sellPrice = Math.max(round4(low * 0.99), sellPrice);

      // Recalculate actual trade percent based on real prices
      tradePercent = round4(((sellPrice - buyPrice) / buyPrice) * 100);
    } else {
      // Profit scenario: buy in the lower portion of the day's range, sell higher
      // This simulates buying near the daily low and selling higher (realistic profit)
      const buyFraction = randomBetween(0.02, 0.45); // buy in lower 45% of range
      buyPrice = round4(low + range * buyFraction);

      const profitPct = randomBetween(settings.tradeMinProfit, settings.tradeMaxProfit);
      sellPrice = round4(buyPrice * (1 + profitPct / 100));

      // Clamp sell price so it doesn't exceed the day's high
      sellPrice = Math.min(round4(high * 1.005), sellPrice);

      // Recalculate actual trade percent based on real prices
      tradePercent = round4(((sellPrice - buyPrice) / buyPrice) * 100);
    }

    // Save the daily trade record
    const dailyTrade = await DailyTrade.create({
      date: today,
      pair: chosen.pair,
      buyPrice,
      sellPrice,
      tradePercent,
      isProfit: !lossDay,
    });

    // Distribute profits to users on profit days
    if (!lossDay && tradePercent > 0) {
      const plans = await Plan.find();
      const planCutMap: Record<string, number> = {
        'Plan 1': settings.planProfitCuts.plan1,
        'Plan 2': settings.planProfitCuts.plan2,
        'Plan 3': settings.planProfitCuts.plan3,
        'Plan 4': settings.planProfitCuts.plan4,
      };

      const approvedDeposits = await Transaction.find({ type: 'deposit', status: 'approved' });

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

      // Track per-user daily profit totals for referral mirror
      const userDailyProfitTotals: Record<string, number> = {};

      for (const [userId, deposits] of Object.entries(userDeposits)) {
        for (const dep of deposits) {
          const plan = plans.find(p => p._id.toString() === dep.planId);
          const planName = plan?.name || 'Plan 1';
          const profitCutPercent = planCutMap[planName] ?? 40;

          // User profit = depositAmount × (tradePercent × profitCutPercent / 100) / 100
          const userProfitPercent = (tradePercent * profitCutPercent) / 100;
          const userProfitAmount = round4((dep.amount * userProfitPercent) / 100);
          if (userProfitAmount <= 0) continue;

          // Deduplicate: one profit record per user per deposit per day
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
            // Accumulate for referral mirror
            userDailyProfitTotals[userId] = (userDailyProfitTotals[userId] || 0) + userProfitAmount;
          }
        }
      }

      // Credit user profits to balances
      const pendingProfits = await Profit.find({
        status: 'completed',
        isAddedToBalance: false,
        date: { $gte: today, $lt: tomorrow },
        profitType: 'daily',
      });

      for (const profit of pendingProfits) {
        await User.findByIdAndUpdate(profit.userId, { $inc: { balance: profit.amount } });
        profit.isAddedToBalance = true;
        await profit.save();
      }

      // ── Referral daily profit mirror ────────────────────────────────────────
      // Each referrer earns a % of their referral's daily profit (10/5/3/2/1%)
      for (const [userId, userDailyProfit] of Object.entries(userDailyProfitTotals)) {
        if (userDailyProfit <= 0) continue;
        const referrals = await Referral.find({ userId }).sort({ level: 1 });
        for (const ref of referrals) {
          const rate = REFERRAL_DAILY_RATES[ref.level] ?? 0;
          if (rate <= 0) continue;
          const mirrorAmount = round4((userDailyProfit * rate) / 100);
          if (mirrorAmount <= 0) continue;
          const todayKey = today.toISOString().split('T')[0];
          const mirrorDepositId = `ref_mirror_${userId}_${todayKey}`;
          const existingMirror = await Profit.findOne({
            userId: ref.referrerId.toString(),
            depositId: mirrorDepositId,
            date: { $gte: today, $lt: tomorrow },
            profitType: 'referral',
          });
          if (!existingMirror) {
            await Profit.create({
              userId: ref.referrerId,
              depositId: mirrorDepositId,
              amount: mirrorAmount,
              date: today,
              profitType: 'referral',
              status: 'completed',
              isAddedToBalance: true,
            });
            await User.findByIdAndUpdate(ref.referrerId, {
              $inc: { balance: mirrorAmount, referralEarnings: mirrorAmount },
            });
            await Referral.findByIdAndUpdate(ref._id, {
              $inc: { totalEarnings: mirrorAmount },
            });
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      trade: dailyTrade,
      message: `Trade: ${chosen.pair} | Buy $${buyPrice} → Sell $${sellPrice} | ${tradePercent > 0 ? '+' : ''}${tradePercent}%`,
    });
  } catch (error) {
    console.error('Error generating trade:', error);
    return NextResponse.json({ error: 'Failed to generate trade' }, { status: 500 });
  }
}
