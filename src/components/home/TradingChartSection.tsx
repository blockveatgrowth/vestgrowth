"use client";

import { useEffect, useRef, useState } from "react";

// Simulated candle data — realistic BTC-like price action
const CANDLES = [
  { o: 62100, h: 63400, l: 61800, c: 63100, v: 1.2 },
  { o: 63100, h: 64200, l: 62800, c: 63800, v: 0.9 },
  { o: 63800, h: 65100, l: 63500, c: 64700, v: 1.5 },
  { o: 64700, h: 65300, l: 63900, c: 64200, v: 0.7 },
  { o: 64200, h: 64800, l: 63200, c: 63500, v: 1.1 },
  { o: 63500, h: 64100, l: 62400, c: 62700, v: 1.3 },
  { o: 62700, h: 63200, l: 61900, c: 62100, v: 0.8 },
  { o: 62100, h: 63600, l: 61800, c: 63400, v: 1.4 },
  { o: 63400, h: 65200, l: 63100, c: 65000, v: 1.8 },
  { o: 65000, h: 66100, l: 64700, c: 65800, v: 1.6 },
  { o: 65800, h: 67200, l: 65500, c: 66900, v: 2.1 },
  { o: 66900, h: 67800, l: 66200, c: 67500, v: 1.9 },
  { o: 67500, h: 68400, l: 67000, c: 68100, v: 2.3 },
  { o: 68100, h: 68900, l: 67400, c: 67800, v: 1.7 },
  { o: 67800, h: 68500, l: 67100, c: 68300, v: 1.4 },
  { o: 68300, h: 69200, l: 68000, c: 69000, v: 2.0 },
  { o: 69000, h: 70100, l: 68700, c: 69800, v: 2.5 },
  { o: 69800, h: 70500, l: 69200, c: 70200, v: 2.2 },
  { o: 70200, h: 71000, l: 69800, c: 70700, v: 1.8 },
  { o: 70700, h: 71500, l: 70300, c: 71200, v: 2.4 },
];

function useScrollProgress(ref: React.RefObject<HTMLElement | null>) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const windowH = window.innerHeight;
      // 0 when top of section hits bottom of viewport, 1 when bottom hits top
      const total = rect.height + windowH;
      const current = windowH - rect.top;
      const p = Math.max(0, Math.min(1, current / total));
      setProgress(p);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [ref]);

  return progress;
}

function CandlestickChart({ revealCount }: { revealCount: number }) {
  const allPrices = CANDLES.flatMap(c => [c.h, c.l]);
  const minP = Math.min(...allPrices) - 500;
  const maxP = Math.max(...allPrices) + 500;
  const range = maxP - minP;

  const W = 700;
  const H = 220;
  const PAD_L = 10;
  const PAD_R = 10;
  const PAD_T = 15;
  const PAD_B = 30;
  const chartW = W - PAD_L - PAD_R;
  const chartH = H - PAD_T - PAD_B;

  const candleW = chartW / CANDLES.length;
  const gap = candleW * 0.25;

  const toY = (price: number) => PAD_T + chartH - ((price - minP) / range) * chartH;
  const toX = (i: number) => PAD_L + i * candleW + candleW / 2;

  // Build smooth price line from close prices
  const linePoints = CANDLES.map((c, i) => `${toX(i)},${toY(c.c)}`).join(" ");

  // Gradient area under line
  const areaPath = `M ${toX(0)},${toY(CANDLES[0].c)} ` +
    CANDLES.map((c, i) => `L ${toX(i)},${toY(c.c)}`).join(" ") +
    ` L ${toX(CANDLES.length - 1)},${PAD_T + chartH} L ${toX(0)},${PAD_T + chartH} Z`;

  const visibleCandles = Math.max(1, Math.min(CANDLES.length, Math.floor(revealCount)));

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full h-full"
      style={{ filter: "drop-shadow(0 0 20px rgba(255,215,0,0.15))" }}
    >
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFD700" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#FFD700" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FFD700" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#FFA500" stopOpacity="1" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <clipPath id="reveal">
          <rect x="0" y="0" width={PAD_L + visibleCandles * candleW + candleW / 2} height={H} />
        </clipPath>
      </defs>

      {/* Grid lines */}
      {[0.25, 0.5, 0.75].map(f => (
        <line
          key={f}
          x1={PAD_L} y1={PAD_T + chartH * f}
          x2={W - PAD_R} y2={PAD_T + chartH * f}
          stroke="rgba(255,215,0,0.06)" strokeWidth="1" strokeDasharray="4 4"
        />
      ))}

      {/* Price labels */}
      {[0, 0.5, 1].map(f => {
        const price = maxP - f * range;
        return (
          <text key={f} x={W - PAD_R + 2} y={PAD_T + chartH * f + 4}
            fill="rgba(255,215,0,0.35)" fontSize="9" textAnchor="start">
            {(price / 1000).toFixed(0)}k
          </text>
        );
      })}

      {/* Area fill (clipped) */}
      <g clipPath="url(#reveal)">
        <path d={areaPath} fill="url(#areaGrad)" />
      </g>

      {/* Price line (clipped) */}
      <g clipPath="url(#reveal)">
        <polyline
          points={linePoints}
          fill="none"
          stroke="url(#lineGrad)"
          strokeWidth="2"
          strokeLinejoin="round"
          filter="url(#glow)"
        />
      </g>

      {/* Candles (clipped) */}
      <g clipPath="url(#reveal)">
        {CANDLES.map((c, i) => {
          const isBull = c.c >= c.o;
          const color = isBull ? "#22c55e" : "#ef4444";
          const x = toX(i);
          const bodyTop = toY(Math.max(c.o, c.c));
          const bodyBot = toY(Math.min(c.o, c.c));
          const bodyH = Math.max(2, bodyBot - bodyTop);
          return (
            <g key={i}>
              {/* Wick */}
              <line x1={x} y1={toY(c.h)} x2={x} y2={toY(c.l)}
                stroke={color} strokeWidth="1.5" opacity="0.7" />
              {/* Body */}
              <rect
                x={x - (candleW - gap) / 2}
                y={bodyTop}
                width={candleW - gap}
                height={bodyH}
                fill={color}
                opacity="0.85"
                rx="1"
              />
            </g>
          );
        })}
      </g>

      {/* Live dot at last visible candle */}
      {visibleCandles > 0 && visibleCandles <= CANDLES.length && (
        <g>
          <circle
            cx={toX(visibleCandles - 1)}
            cy={toY(CANDLES[visibleCandles - 1].c)}
            r="5"
            fill="#FFD700"
            filter="url(#glow)"
          />
          <circle
            cx={toX(visibleCandles - 1)}
            cy={toY(CANDLES[visibleCandles - 1].c)}
            r="9"
            fill="none"
            stroke="#FFD700"
            strokeWidth="1"
            opacity="0.4"
          >
            <animate attributeName="r" values="5;12;5" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.4;0;0.4" dur="2s" repeatCount="indefinite" />
          </circle>
        </g>
      )}

      {/* X-axis time labels */}
      {["Jan", "Mar", "May", "Jul", "Sep", "Nov"].map((m, i) => {
        const idx = Math.floor(i * (CANDLES.length / 6));
        return (
          <text key={m} x={toX(idx)} y={H - 5}
            fill="rgba(255,255,255,0.2)" fontSize="9" textAnchor="middle">
            {m}
          </text>
        );
      })}
    </svg>
  );
}

export function TradingChartSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const progress = useScrollProgress(sectionRef);

  // Reveal candles as user scrolls (0 → 20 candles)
  const revealCount = progress * CANDLES.length * 2.2;

  // 3D tilt effect based on scroll
  const tiltX = (progress - 0.5) * 8;
  const tiltY = (progress - 0.3) * -6;

  // Stats that count up as you scroll
  const btcPrice = Math.floor(62100 + progress * 8100);
  const profitPct = (progress * 6.2).toFixed(1);
  const totalTrades = Math.floor(progress * 1247);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-32 overflow-hidden bg-[#060810]"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FFD700]/3 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,215,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,215,0,0.02)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

      {/* Floating orbs */}
      <div
        className="absolute left-[-10%] top-[20%] w-[400px] h-[400px] rounded-full bg-[#FFD700]/4 blur-[100px] pointer-events-none"
        style={{ transform: `translateY(${(progress - 0.5) * -40}px)` }}
      />
      <div
        className="absolute right-[-5%] bottom-[10%] w-[300px] h-[300px] rounded-full bg-[#FFA500]/5 blur-[80px] pointer-events-none"
        style={{ transform: `translateY(${(progress - 0.5) * 30}px)` }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section header */}
        <div
          className="text-center mb-14"
          style={{
            opacity: Math.min(1, progress * 3),
            transform: `translateY(${Math.max(0, 30 - progress * 90)}px)`,
          }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase bg-[#FFD700]/10 text-[#FFD700] border border-[#FFD700]/20 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFD700] animate-pulse" />
            Live Market Engine
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-4">
            Real Trades.{" "}
            <span className="bg-gradient-to-r from-[#FFD700] via-[#FFC200] to-[#FFA500] bg-clip-text text-transparent">
              Real Profits.
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Every day our algorithm executes trades using live CoinGecko market data.
            Your earnings are a direct percentage of each day&apos;s result — scroll to watch it unfold.
          </p>
        </div>

        {/* Main chart card with 3D perspective */}
        <div
          className="max-w-4xl mx-auto"
          style={{
            perspective: "1200px",
            opacity: Math.min(1, progress * 2.5),
          }}
        >
          <div
            className="rounded-2xl border border-[#FFD700]/20 bg-[#0a0d18]/90 backdrop-blur-xl shadow-[0_0_80px_rgba(255,215,0,0.12)] overflow-hidden"
            style={{
              transform: `rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(0)`,
              transition: "transform 0.1s ease-out",
              transformStyle: "preserve-3d",
            }}
          >
            {/* Chart header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/20 flex items-center justify-center">
                  <span className="text-sm">₿</span>
                </div>
                <div>
                  <div className="text-white font-bold text-sm">BTC / USDT</div>
                  <div className="text-gray-500 text-xs">Bitcoin · 1D Chart</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-[#FFD700] font-black text-lg">
                    ${btcPrice.toLocaleString()}
                  </div>
                  <div className="text-green-400 text-xs font-semibold">▲ +{profitPct}%</div>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-green-400 text-xs font-semibold">LIVE</span>
                </div>
              </div>
            </div>

            {/* Chart area */}
            <div className="px-4 pt-4 pb-2 h-[240px] sm:h-[280px]">
              <CandlestickChart revealCount={revealCount} />
            </div>

            {/* Chart footer stats */}
            <div className="grid grid-cols-3 border-t border-white/5">
              {[
                { label: "24h High", value: "$71,500", color: "text-green-400" },
                { label: "24h Volume", value: `${(progress * 2.4).toFixed(1)}B`, color: "text-[#FFD700]" },
                { label: "Trades Today", value: totalTrades.toLocaleString(), color: "text-white" },
              ].map((stat, i) => (
                <div key={i} className={`px-4 py-3 text-center ${i < 2 ? "border-r border-white/5" : ""}`}>
                  <div className={`font-black text-sm ${stat.color}`}>{stat.value}</div>
                  <div className="text-gray-600 text-xs mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Floating profit cards that appear on scroll */}
        <div className="max-w-4xl mx-auto mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              delay: 0.3,
              icon: "📈",
              title: "Today's Trade",
              value: `+${profitPct}%`,
              sub: "BTC/USDT profit",
              color: "text-green-400",
              border: "border-green-500/20",
              bg: "bg-green-500/5",
            },
            {
              delay: 0.5,
              icon: "💰",
              title: "Your Share (Elite)",
              value: `+${(parseFloat(profitPct) * 0.75).toFixed(2)}%`,
              sub: "75% of trade profit",
              color: "text-[#FFD700]",
              border: "border-[#FFD700]/20",
              bg: "bg-[#FFD700]/5",
            },
            {
              delay: 0.7,
              icon: "⚡",
              title: "Auto-Credited",
              value: "Daily",
              sub: "No action needed",
              color: "text-blue-400",
              border: "border-blue-500/20",
              bg: "bg-blue-500/5",
            },
          ].map((card, i) => (
            <div
              key={i}
              className={`rounded-xl border ${card.border} ${card.bg} p-4 backdrop-blur-sm`}
              style={{
                opacity: Math.min(1, Math.max(0, (progress - card.delay) * 4)),
                transform: `translateY(${Math.max(0, 20 - (progress - card.delay) * 60)}px)`,
                transition: "none",
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{card.icon}</span>
                <span className="text-gray-400 text-xs font-medium">{card.title}</span>
              </div>
              <div className={`text-2xl font-black ${card.color}`}>{card.value}</div>
              <div className="text-gray-600 text-xs mt-0.5">{card.sub}</div>
            </div>
          ))}
        </div>

        {/* Scroll hint */}
        <div
          className="text-center mt-10"
          style={{ opacity: Math.max(0, 1 - progress * 5) }}
        >
          <div className="inline-flex flex-col items-center gap-2 text-gray-600 text-xs">
            <span>Scroll to reveal the trade</span>
            <div className="w-5 h-8 rounded-full border border-gray-700 flex items-start justify-center pt-1.5">
              <div className="w-1 h-2 rounded-full bg-gray-600 animate-bounce" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
