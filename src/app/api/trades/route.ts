import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import connectDB from '@/lib/db';
import { DailyTrade } from '@/models/DailyTrade';
import { Profit } from '@/models/Increment';
import { Settings } from '@/models/Settings';
import { Plan } from '@/models/Plan';
import { Transaction } from '@/models/Transaction';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Get last 14 days of trades
    const trades = await DailyTrade.find()
      .sort({ date: -1 })
      .limit(14)
      .lean();

    // Get user's profits for these trade dates
    const userId = session.user?.id;
    const settings = await Settings.findOne();
    const plans = await Plan.find();

    // Get user's approved deposits to calculate expected profit
    const userDeposits = await Transaction.find({
      userId,
      type: 'deposit',
      status: 'approved',
    });

    const totalDeposit = userDeposits.reduce((sum, d) => sum + d.amount, 0);
    
    // Get user's plan (from most recent deposit)
    const latestDeposit = userDeposits.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];
    
    const userPlan = plans.find(p => p._id.toString() === latestDeposit?.planId?.toString());
    const planName = userPlan?.name || 'Plan 1';
    
    const planCuts: Record<string, number> = {
      'Plan 1': settings?.planProfitCuts?.plan1 || 40,
      'Plan 2': settings?.planProfitCuts?.plan2 || 50,
      'Plan 3': settings?.planProfitCuts?.plan3 || 60,
      'Plan 4': settings?.planProfitCuts?.plan4 || 75,
    };
    const profitCut = planCuts[planName] || 40;

    // Get user's actual profits for these dates
    const tradeIds = trades.map(t => t.date);
    const userProfits = await Profit.find({
      userId,
      profitType: 'daily',
      date: { $in: tradeIds },
    }).lean();

    const profitByDate: Record<string, number> = {};
    for (const p of userProfits) {
      const dateKey = new Date(p.date).toDateString();
      profitByDate[dateKey] = (profitByDate[dateKey] || 0) + p.amount;
    }

    const enrichedTrades = trades.map(trade => {
      const dateKey = new Date(trade.date).toDateString();
      const userEarnings = profitByDate[dateKey] || 0;
      const userProfitPercent = trade.isProfit 
        ? (trade.tradePercent * profitCut) / 100 
        : 0;
      
      return {
        ...trade,
        userEarnings,
        userProfitPercent,
        profitCut,
        totalDeposit,
        planName,
      };
    });

    return NextResponse.json({ trades: enrichedTrades });
  } catch (error) {
    console.error('Error fetching trades:', error);
    return NextResponse.json({ error: 'Failed to fetch trades' }, { status: 500 });
  }
}
