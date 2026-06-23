"use client";

import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, RefreshCw, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Trade {
  _id: string;
  date: string;
  pair: string;
  buyPrice: number;
  sellPrice: number;
  tradePercent: number;
  isProfit: boolean;
  userEarnings: number;
  userProfitPercent: number;
  profitCut: number;
  totalDeposit: number;
  planName: string;
}

function formatPrice(price: number): string {
  if (price >= 1000) return `$${price.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
  return `$${price.toFixed(4)}`;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function DailyTradeCard() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrades = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/trades");
      if (!res.ok) throw new Error("Failed to fetch trades");
      const data = await res.json();
      setTrades(data.trades || []);
    } catch {
      setError("Failed to load trade data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrades();
  }, []);

  if (loading) {
    return (
      <Card className="border-[#FFD700]/20 bg-[#0D1117]">
        <CardHeader>
          <CardTitle className="text-[#FFD700] flex items-center gap-2">
            <TrendingUp className="h-5 w-5" /> Daily Trade Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin text-[#FFD700]" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || trades.length === 0) {
    return (
      <Card className="border-[#FFD700]/20 bg-[#0D1117]">
        <CardHeader>
          <CardTitle className="text-[#FFD700] flex items-center gap-2">
            <TrendingUp className="h-5 w-5" /> Daily Trade Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-400">
            <TrendingUp className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No trade data available yet.</p>
            <p className="text-xs mt-1 text-gray-500">Trades are generated daily. Check back tomorrow.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const todayTrade = trades[0];

  return (
    <div className="space-y-4">
      {/* Today's Trade Highlight */}
      <Card className={`border-2 ${todayTrade.isProfit ? "border-green-500/40 bg-green-950/20" : "border-red-500/40 bg-red-950/20"} relative overflow-hidden`}>
        <div className={`absolute top-0 left-0 right-0 h-1 ${todayTrade.isProfit ? "bg-gradient-to-r from-green-500 to-emerald-400" : "bg-gradient-to-r from-red-500 to-rose-400"}`} />
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2 text-lg">
              {todayTrade.isProfit ? (
                <TrendingUp className="h-5 w-5 text-green-400" />
              ) : (
                <TrendingDown className="h-5 w-5 text-red-400" />
              )}
              Today&apos;s Trade — {todayTrade.pair}
            </CardTitle>
            <span className="text-xs text-gray-400">{formatDate(todayTrade.date)}</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-black/30 rounded-lg p-3">
              <p className="text-xs text-gray-400 mb-1">Buy Price</p>
              <p className="text-white font-semibold">{formatPrice(todayTrade.buyPrice)}</p>
            </div>
            <div className="bg-black/30 rounded-lg p-3">
              <p className="text-xs text-gray-400 mb-1">Sell Price</p>
              <p className={`font-semibold ${todayTrade.isProfit ? "text-green-400" : "text-red-400"}`}>
                {formatPrice(todayTrade.sellPrice)}
              </p>
            </div>
            <div className="bg-black/30 rounded-lg p-3">
              <p className="text-xs text-gray-400 mb-1">Trade Result</p>
              <p className={`font-bold text-lg flex items-center gap-1 ${todayTrade.isProfit ? "text-green-400" : "text-red-400"}`}>
                {todayTrade.isProfit ? (
                  <ArrowUpRight className="h-4 w-4" />
                ) : (
                  <ArrowDownRight className="h-4 w-4" />
                )}
                {todayTrade.tradePercent > 0 ? "+" : ""}{todayTrade.tradePercent.toFixed(2)}%
              </p>
            </div>
            <div className={`rounded-lg p-3 ${todayTrade.isProfit ? "bg-green-900/30 border border-green-500/20" : "bg-gray-900/30 border border-gray-500/20"}`}>
              <p className="text-xs text-gray-400 mb-1">Your Earnings</p>
              <p className={`font-bold text-lg ${todayTrade.isProfit ? "text-green-400" : "text-gray-400"}`}>
                {todayTrade.isProfit ? `+$${todayTrade.userEarnings.toFixed(2)}` : "$0.00"}
              </p>
              {todayTrade.isProfit && (
                <p className="text-xs text-gray-500 mt-0.5">
                  {todayTrade.profitCut}% of {todayTrade.tradePercent.toFixed(2)}% trade
                </p>
              )}
            </div>
          </div>

          {todayTrade.totalDeposit > 0 && (
            <div className="mt-3 p-3 bg-black/20 rounded-lg text-xs text-gray-400 flex flex-wrap gap-4">
              <span>Plan: <span className="text-[#FFD700]">{todayTrade.planName}</span></span>
              <span>Your Deposit: <span className="text-white">${todayTrade.totalDeposit.toFixed(2)}</span></span>
              <span>Profit Share: <span className="text-[#FFD700]">{todayTrade.profitCut}% of trade</span></span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Trade History Table */}
      <Card className="border-[#FFD700]/20 bg-[#0D1117]">
        <CardHeader>
          <CardTitle className="text-[#FFD700] text-base flex items-center gap-2">
            <RefreshCw className="h-4 w-4" /> Trade History (Last 14 Days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#FFD700]/10">
                  <th className="text-left py-2 px-3 text-gray-400 font-medium">Date</th>
                  <th className="text-left py-2 px-3 text-gray-400 font-medium">Pair</th>
                  <th className="text-right py-2 px-3 text-gray-400 font-medium">Buy</th>
                  <th className="text-right py-2 px-3 text-gray-400 font-medium">Sell</th>
                  <th className="text-right py-2 px-3 text-gray-400 font-medium">Result</th>
                  <th className="text-right py-2 px-3 text-gray-400 font-medium">Your Earnings</th>
                </tr>
              </thead>
              <tbody>
                {trades.map((trade, i) => (
                  <tr
                    key={trade._id}
                    className={`border-b border-[#FFD700]/5 transition-colors hover:bg-[#FFD700]/5 ${i === 0 ? "bg-[#FFD700]/5" : ""}`}
                  >
                    <td className="py-2 px-3 text-gray-300">
                      {formatDate(trade.date)}
                      {i === 0 && (
                        <span className="ml-2 text-xs bg-[#FFD700]/20 text-[#FFD700] px-1.5 py-0.5 rounded">Today</span>
                      )}
                    </td>
                    <td className="py-2 px-3 text-white font-medium">{trade.pair}</td>
                    <td className="py-2 px-3 text-right text-gray-300">{formatPrice(trade.buyPrice)}</td>
                    <td className={`py-2 px-3 text-right ${trade.isProfit ? "text-green-400" : "text-red-400"}`}>
                      {formatPrice(trade.sellPrice)}
                    </td>
                    <td className={`py-2 px-3 text-right font-semibold ${trade.isProfit ? "text-green-400" : "text-red-400"}`}>
                      {trade.tradePercent > 0 ? "+" : ""}{trade.tradePercent.toFixed(2)}%
                    </td>
                    <td className={`py-2 px-3 text-right font-semibold ${trade.isProfit && trade.userEarnings > 0 ? "text-green-400" : "text-gray-500"}`}>
                      {trade.isProfit && trade.userEarnings > 0 ? `+$${trade.userEarnings.toFixed(2)}` : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
