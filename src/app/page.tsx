"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { PlansSection } from "@/components/home/PlansSection";
import { AlgorithmSection } from "@/components/home/AlgorithmSection";
import { InvestmentJourneySection } from "@/components/home/InvestmentJourneySection";
import { TradingChartSection } from "@/components/home/TradingChartSection";

function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    document.querySelectorAll("[data-reveal]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

function useParallaxCoin(ref: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      ref.current.style.transform = `translateY(${window.scrollY * 0.15}px) rotateY(${window.scrollY * 0.05}deg)`;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [ref]);
}

export default function Home() {
  const { data: session } = useSession();
  const coinRef = useRef<HTMLDivElement>(null);
  useScrollReveal();
  useParallaxCoin(coinRef);

  const trustItems = [
    { icon: "🔐", text: "SSL Encrypted" },
    { icon: "📊", text: "Real Market Data" },
    { icon: "⚡", text: "Instant Payouts" },
    { icon: "🌍", text: "Global Access" },
    { icon: "💬", text: "24/7 Support" },
  ];

  const features = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-[#FFD700]">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
        </svg>
      ),
      title: "Market-Based Daily Profits",
      desc: "Earn 40–75% of each day's live crypto trade result based on your plan. Profits credited automatically every trading day.",
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-[#FFD700]">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
        </svg>
      ),
      title: "5-Level Referral Network",
      desc: "Earn instant commissions when your referrals deposit, plus ongoing daily profit bonuses from their earnings — across 5 levels.",
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-[#FFD700]">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
        </svg>
      ),
      title: "Simple Deposits & Withdrawals",
      desc: "Deposit via USDT (TRC20, ERC20, BEP20). Withdraw your earnings anytime once you reach the minimum threshold.",
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-[#FFD700]">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
      ),
      title: "Transparent & Secure",
      desc: "Every trade is logged with buy price, sell price, and profit %. Full transparency on your dashboard — no hidden fees.",
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-[#FFD700]">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
        </svg>
      ),
      title: "Real Crypto Data",
      desc: "Trade results are generated from live CoinGecko 24h market data. Buy and sell prices always within the actual daily range.",
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-[#FFD700]">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Automated Daily Profits",
      desc: "No manual action needed. The system generates trade results and credits your earnings automatically every day.",
    },
  ];

  const howItWorks = [
    { step: "01", title: "Create Account", desc: "Sign up in seconds with email or Google. Get your unique referral code instantly." },
    { step: "02", title: "Deposit Funds", desc: "Choose your investment plan and deposit USDT. Funds are confirmed within minutes." },
    { step: "03", title: "Earn Daily", desc: "Our system trades live crypto markets every day. Your share of the profit is credited automatically." },
    { step: "04", title: "Withdraw Anytime", desc: "Once you reach the withdrawal threshold, request a payout to your crypto wallet." },
  ];

  const referralLevels = [
    { level: "Level 1", icon: "👑", desc: "Direct referrals", bonus: "Instant deposit commission + daily profit share" },
    { level: "Level 2", icon: "🥈", desc: "Your referrals' referrals", bonus: "Deposit commission + daily profit share" },
    { level: "Level 3", icon: "🥉", desc: "3rd degree network", bonus: "Deposit commission + daily profit share" },
    { level: "Level 4", icon: "⭐", desc: "4th degree network", bonus: "Deposit commission + daily profit share" },
    { level: "Level 5", icon: "✨", desc: "5th degree network", bonus: "Deposit commission + daily profit share" },
  ];

  return (
    <MainLayout>
      {/* ============ HERO SECTION ============ */}
      <section className="relative overflow-hidden bg-[#060810] py-20 md:py-28 min-h-[90vh] flex items-center">
        {/* Background glows */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#FFD700]/5 via-transparent to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80 pointer-events-none">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#FFD700] to-[#FFD700]/50 opacity-15 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem] animate-gradient-x" />
        </div>
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,215,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,215,0,0.03)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

        {/* Floating 3D coins */}
        <div ref={coinRef} className="absolute right-[8%] top-[15%] hidden lg:block pointer-events-none z-10 will-change-transform">
          <div className="coin-3d" />
        </div>
        <div className="absolute right-[20%] top-[60%] hidden lg:block pointer-events-none z-10">
          <div className="coin-3d-sm" style={{ animationDelay: "1.2s" }} />
        </div>
        <div className="absolute left-[5%] top-[40%] hidden xl:block pointer-events-none z-10">
          <div className="coin-3d-xs" style={{ animationDelay: "2.1s" }} />
        </div>
        <div className="absolute right-[4%] bottom-[25%] hidden xl:block pointer-events-none z-10">
          <div className="coin-3d-xs" style={{ animationDelay: "0.7s" }} />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <div className="flex flex-col gap-10 md:gap-16 md:flex-row items-center">
            {/* Hero text */}
            <div className="flex flex-col items-start text-left md:w-1/2">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase bg-[#FFD700]/10 text-[#FFD700] border border-[#FFD700]/20 mb-6 animate-fade-in-up">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFD700] animate-pulse" />
                Live Crypto Investment Platform
              </div>

              {/* Headline */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] mb-6 animate-fade-in-up">
                <span className="text-white">Grow Your</span>
                <br />
                <span className="bg-gradient-to-r from-[#FFD700] via-[#FFC200] to-[#FFA500] bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(255,215,0,0.4)]">Wealth Daily</span>
                <br />
                <span className="text-white">From Crypto</span>
              </h1>

              {/* Subheadline */}
              <p className="text-lg text-gray-400 max-w-xl leading-relaxed mb-6 animate-fade-in-up delay-100">
                Investo Boost executes real-time trades on top crypto pairs every day.
                Your earnings are a direct percentage of each day&apos;s trade result — transparent, market-based returns.
              </p>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-2 mb-8 animate-fade-in-up delay-200">
                {trustItems.map((t) => (
                  <div key={t.text} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/3 border border-white/8 text-gray-400 text-xs font-medium hover:border-[#FFD700]/30 hover:text-[#FFD700] transition-all duration-200">
                    <span>{t.icon}</span>
                    <span>{t.text}</span>
                  </div>
                ))}
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-4 gap-3 w-full mb-8 animate-fade-in-up delay-200">
                {[
                  { value: "4–8%", label: "Daily Trade" },
                  { value: "75%", label: "Max Share" },
                  { value: "5×", label: "Ref Levels" },
                  { value: "24/7", label: "Live Data" },
                ].map((s) => (
                  <div key={s.label} className="text-center p-3 rounded-xl bg-[#FFD700]/5 border border-[#FFD700]/15 hover:border-[#FFD700]/30 transition-all duration-200">
                    <div className="text-xl font-black text-[#FFD700]">{s.value}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up delay-300">
                {session ? (
                  <Link href="/dashboard" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black font-black rounded-xl shadow-[0_0_30px_rgba(255,215,0,0.4)] hover:shadow-[0_0_50px_rgba(255,215,0,0.6)] transition-all duration-300 hover:scale-105 text-base">
                    Go to Dashboard →
                  </Link>
                ) : (
                  <>
                    <Link href="/auth/signup" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black font-black rounded-xl shadow-[0_0_30px_rgba(255,215,0,0.4)] hover:shadow-[0_0_50px_rgba(255,215,0,0.6)] transition-all duration-300 hover:scale-105 text-base">
                      Start Earning Today →
                    </Link>
                    <Link href="/auth/signin" className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-[#FFD700]/30 text-[#FFD700] font-bold rounded-xl hover:bg-[#FFD700]/10 hover:border-[#FFD700]/60 transition-all duration-300 text-base">
                      Sign In
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Hero visual */}
            <div className="w-full md:w-1/2 max-w-xl animate-fade-in-up delay-200">
              <div className="relative">
                {/* Main card */}
                <div className="rounded-2xl border border-[#FFD700]/15 bg-[#0a0d18]/80 backdrop-blur-xl shadow-[0_0_80px_rgba(255,215,0,0.1)] p-6 sm:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Today&apos;s Trade</div>
                      <div className="text-2xl font-black text-white">BTC/USDT</div>
                    </div>
                    <div className="px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-bold">
                      ▲ +6.2%
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    {[
                      { label: "Buy Price", value: "$64,230", color: "text-gray-300" },
                      { label: "Sell Price", value: "$68,210", color: "text-green-400" },
                      { label: "Trade Profit", value: "+6.2%", color: "text-green-400" },
                    ].map((row) => (
                      <div key={row.label} className="flex justify-between items-center py-2 border-b border-white/5">
                        <span className="text-gray-500 text-sm">{row.label}</span>
                        <span className={`font-bold ${row.color}`}>{row.value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-xl bg-[#FFD700]/5 border border-[#FFD700]/15 p-4">
                    <div className="text-xs text-gray-500 mb-2">Your Earnings (Elite Plan — 75%)</div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black text-[#FFD700]">+$93</span>
                      <span className="text-gray-500 text-sm">on $2,000 balance</span>
                    </div>
                    <div className="text-xs text-gray-600 mt-1">75% × 6.2% × $2,000 = $93.00</div>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2">
                    {["Plan 1 → $24", "Plan 2 → $37", "Plan 3 → $46"].map((ex) => (
                      <div key={ex} className="text-center py-2 px-1 rounded-lg bg-white/3 border border-white/6 text-xs text-gray-500">
                        {ex}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Floating badge */}
                <div className="absolute -top-4 -right-4 px-4 py-2 rounded-xl bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black text-xs font-black shadow-[0_0_20px_rgba(255,215,0,0.5)] animate-bounce-slow">
                  LIVE DATA ✓
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ LIVE TICKER ============ */}
      <div className="py-3 bg-[#FFD700]/5 border-y border-[#FFD700]/10 overflow-hidden">
        <div className="flex animate-ticker whitespace-nowrap">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-8 px-8 shrink-0">
              {["BTC/USDT", "ETH/USDT", "BNB/USDT", "SOL/USDT", "XRP/USDT"].map((pair) => (
                <span key={pair} className="flex items-center gap-2 text-sm text-gray-400">
                  <span className="text-[#FFD700] font-bold">{pair}</span>
                  <span className="text-green-400 text-xs">▲ Live</span>
                  <span className="text-gray-700 mx-2">•</span>
                </span>
              ))}
              <span className="text-[#FFD700]/30 mx-4">✦</span>
            </div>
          ))}
        </div>
      </div>

      {/* ============ HOW IT WORKS ============ */}
      <section className="py-20 md:py-24 bg-[#0a0d18]/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 animate-fade-in-up">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase bg-[#FFD700]/10 text-[#FFD700] border border-[#FFD700]/20 mb-4">
              How It Works
            </span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white">
              Start Earning in <span className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">4 Simple Steps</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((step, i) => (
              <div
                key={step.step}
                className="relative p-6 rounded-2xl border border-[#FFD700]/15 bg-[#0D1117]/60 backdrop-blur hover:border-[#FFD700]/35 hover:shadow-[0_0_30px_rgba(255,215,0,0.1)] transition-all duration-300 hover:-translate-y-1 animate-fade-in-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="text-5xl font-black text-[#FFD700]/12 mb-4 tabular-nums">{step.step}</div>
                <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
                {i < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 z-10 text-[#FFD700]/30 text-lg">→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ TRADING CHART (SCROLL-DRIVEN 3D) ============ */}
      <TradingChartSection />

      {/* ============ FEATURES ============ */}
      <section className="py-20 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 animate-fade-in-up">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase bg-[#FFD700]/10 text-[#FFD700] border border-[#FFD700]/20 mb-4">
              Platform Features
            </span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white">
              Everything You Need to <span className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">Grow</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div
                key={f.title}
                className="flex flex-col p-7 rounded-2xl border border-[#FFD700]/15 bg-[#0D1117]/60 backdrop-blur hover:border-[#FFD700]/35 hover:shadow-[0_0_30px_rgba(255,215,0,0.1)] transition-all duration-300 hover:-translate-y-1 animate-fade-in-up"
                style={{ animationDelay: `${(i % 3) * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-xl bg-[#FFD700]/10 flex items-center justify-center mb-4 border border-[#FFD700]/15">
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ INVESTMENT PLANS ============ */}
      <section id="plans" className="py-20 md:py-24 bg-[#0a0d18]/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 animate-fade-in-up">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase bg-[#FFD700]/10 text-[#FFD700] border border-[#FFD700]/20 mb-4">
              Investment Plans
            </span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white">
              Choose Your <span className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">Growth Plan</span>
            </h2>
            <p className="mt-4 text-gray-400 max-w-xl mx-auto">
              Each plan gives you a percentage share of the daily crypto trade profit. The more you invest, the higher your profit share.
            </p>
          </div>
          <PlansSection />
        </div>
      </section>

      {/* ============ REFERRAL SYSTEM ============ */}
      <section className="py-20 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            {/* Left: text */}
            <div className="animate-fade-in-up">
              <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase bg-[#FFD700]/10 text-[#FFD700] border border-[#FFD700]/20 mb-5">
                Referral Program
              </span>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-5">
                Earn More by <span className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">Referring Friends</span>
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-8">
                Our 5-level referral network rewards you every time someone in your network deposits or earns a daily profit. Build your network and watch your passive income grow automatically.
              </p>

              <div className="space-y-3 mb-8">
                {referralLevels.map((lvl, i) => (
                  <div
                    key={lvl.level}
                    className="flex items-center gap-4 p-4 rounded-xl border border-[#FFD700]/10 bg-[#FFD700]/3 hover:border-[#FFD700]/25 hover:bg-[#FFD700]/6 transition-all duration-200"
                    style={{ animationDelay: `${i * 80}ms` }}
                  >
                    <span className="text-2xl">{lvl.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[#FFD700] font-bold text-sm">{lvl.level}</span>
                        <span className="text-gray-500 text-xs">— {lvl.desc}</span>
                      </div>
                      <div className="text-gray-300 text-xs mt-0.5">{lvl.bonus}</div>
                    </div>
                  </div>
                ))}
              </div>

              {session ? (
                <Link href="/dashboard/referrals" className="inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black font-black rounded-xl shadow-[0_0_25px_rgba(255,215,0,0.35)] hover:shadow-[0_0_40px_rgba(255,215,0,0.55)] transition-all duration-300 hover:scale-105">
                  View My Referrals →
                </Link>
              ) : (
                <Link href="/auth/signup" className="inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black font-black rounded-xl shadow-[0_0_25px_rgba(255,215,0,0.35)] hover:shadow-[0_0_40px_rgba(255,215,0,0.55)] transition-all duration-300 hover:scale-105">
                  Join & Get Your Referral Code →
                </Link>
              )}
            </div>

            {/* Right: example card */}
            <div className="animate-fade-in-up delay-200">
              <div className="rounded-2xl border border-[#FFD700]/15 bg-[#0D1117]/60 backdrop-blur p-7 shadow-[0_0_50px_rgba(255,215,0,0.08)]">
                <h3 className="text-xl font-black text-white mb-1">Referral Example</h3>
                <p className="text-gray-500 text-sm mb-6">You refer a friend who deposits $500</p>

                <div className="space-y-3 mb-5">
                  <div className="flex justify-between items-center p-3.5 bg-[#FFD700]/5 rounded-xl border border-[#FFD700]/10">
                    <span className="text-gray-400 text-sm">Instant commission (Level 1)</span>
                    <span className="text-[#FFD700] font-bold">+$50</span>
                  </div>
                  <div className="flex justify-between items-center p-3.5 bg-green-500/5 rounded-xl border border-green-500/10">
                    <span className="text-gray-400 text-sm">Their daily profit (e.g. $15/day)</span>
                    <span className="text-green-400 font-bold">+$1.50/day</span>
                  </div>
                  <div className="flex justify-between items-center p-3.5 bg-[#FFD700]/8 rounded-xl border border-[#FFD700]/20">
                    <span className="text-white text-sm font-semibold">Your total (first 30 days)</span>
                    <span className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent font-black text-xl">$95+</span>
                  </div>
                </div>

                <p className="text-gray-600 text-xs">*Example based on typical trade results. Actual earnings vary with market conditions.</p>

                <div className="mt-5 pt-5 border-t border-white/5">
                  <div className="text-xs text-gray-500 mb-2">Your referral link looks like:</div>
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white/3 border border-white/8">
                    <span className="text-[#FFD700] text-xs font-mono truncate">investoboost.com/ref/YOUR_CODE</span>
                    <span className="text-gray-600 text-xs shrink-0">📋</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ ALGORITHM & JOURNEY SECTIONS ============ */}
      <section className="py-16 md:py-20 bg-[#0a0d18]/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-fade-in-up">
            <AlgorithmSection />
          </div>
          <div className="mt-24 animate-fade-in-up delay-100">
            <InvestmentJourneySection />
          </div>
        </div>
      </section>

      {/* ============ CTA SECTION ============ */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#FFD700]/5 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 -bottom-40 -z-10 transform-gpu overflow-hidden blur-3xl pointer-events-none">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#FFD700] to-[#FFD700]/50 opacity-15 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem] animate-gradient-x" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl mx-auto text-center p-10 sm:p-14 rounded-3xl border border-[#FFD700]/20 bg-[#0D1117]/70 backdrop-blur shadow-[0_0_80px_rgba(255,215,0,0.12)] animate-fade-in-up">
            {/* 3D coin */}
            <div className="flex justify-center mb-6">
              <div className="coin-3d" />
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-4">
              Ready to Start <span className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">Earning?</span>
            </h2>
            <p className="text-lg text-gray-400 max-w-xl mx-auto mb-8 leading-relaxed">
              Join investors already earning daily from live crypto trades. Create your account in under 60 seconds — no experience needed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {session ? (
                <Link href="/dashboard" className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black font-black rounded-xl shadow-[0_0_30px_rgba(255,215,0,0.4)] hover:shadow-[0_0_50px_rgba(255,215,0,0.6)] transition-all duration-300 hover:scale-105 text-base">
                  Go to Dashboard →
                </Link>
              ) : (
                <>
                  <Link href="/auth/signup" className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black font-black rounded-xl shadow-[0_0_30px_rgba(255,215,0,0.4)] hover:shadow-[0_0_50px_rgba(255,215,0,0.6)] transition-all duration-300 hover:scale-105 text-base">
                    Create Free Account →
                  </Link>
                  <Link href="/auth/signin" className="inline-flex items-center justify-center gap-2 px-10 py-4 border border-[#FFD700]/30 text-[#FFD700] font-bold rounded-xl hover:bg-[#FFD700]/10 hover:border-[#FFD700]/60 transition-all duration-300 text-base">
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
