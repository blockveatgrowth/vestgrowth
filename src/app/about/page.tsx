import MainLayout from "@/components/layout/MainLayout";
import { ArrowUpRight, ChevronRight, DollarSign, LineChart, Zap, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AboutPage() {
  return (
    <MainLayout>
      {/* About Hero Section */}
      <section className="relative overflow-hidden bg-background py-12 md:py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent animate-fade-in [animation-duration:2s]" />
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-primary/50 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem] animate-pulse-slow" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 text-sm font-medium rounded-lg bg-primary/10 text-primary animate-fade-in-down [animation-delay:200ms]">
              ABOUT INVESTO BOOST
            </div>
            <h1 className="text-2xl md:text-4xl md:text-6xl !text-[#FFD700] font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent pb-2 animate-fade-in-up [animation-delay:400ms]">
              Founded By Traders For Investors
            </h1>
            <p className="mt-6 text-xl text-muted-foreground max-w-3xl animate-fade-in-up [animation-delay:600ms]">
              Investo Boost was founded in 2020 by a team of professional crypto traders and blockchain developers who recognized a gap in the market: individuals wanting to profit from cryptocurrencies without needing to become trading experts.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-12 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="relative animate-fade-in-left [animation-delay:200ms]">
              <div className="absolute -inset-4">
                <div className="w-full h-full mx-auto rotate-2 bg-gradient-to-r from-primary to-primary/30 blur-2xl opacity-30 rounded-3xl animate-pulse-slow"></div>
              </div>
              <div className="relative">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-primary/10">
                  <img
                    src="/images/ourstory.png"
                    alt="Investo Boost team working"
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6 animate-fade-in-right [animation-delay:400ms]">
              <div className="inline-flex items-center justify-start px-4 py-1.5 text-sm font-medium rounded-lg bg-primary/10 text-primary w-fit">
                OUR STORY
              </div>
              <h2 className="text-3xl !text-[#FFD700] font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                A Vision for Accessible Crypto Investment
              </h2>
              <div className="space-y-6 text-muted-foreground">
                <p>
                  Our platform began with a simple idea: pool investments from many clients, leverage our trading expertise and algorithms to generate consistent returns, and share those profits daily in a transparent manner.
                </p>
                <p>
                  Today, we manage over $120 million in digital assets, serving clients from 45+ countries with our team of 30+ cryptocurrency professionals and developers.
                </p>
                <p>
                  Our mission is to make cryptocurrency investment accessible to everyone, regardless of their trading experience or technical knowledge. We believe in transparency, security, and sustainable growth for all our investors.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24 bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center mb-16 animate-fade-in-up [animation-delay:200ms]">
            <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 text-sm font-medium rounded-lg bg-primary/10 text-primary mt-10 md:mt-0">
              HOW IT WORKS
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">
              A Simple Process For Maximum Returns
            </h2>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
              We&apos;ve simplified crypto investing so you can focus on results, not complexity.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Step 1: Deposit */}
            <div className="flex flex-col items-center text-center p-8 rounded-2xl border border-[#FFD700] bg-background/60 backdrop-blur animate-fade-in-up [animation-delay:400ms]">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <DollarSign className="h-8 w-8 text-[#00ffcc] animate-bounce" />
              </div>
              <h3 className="text-xl font-semibold text-[#FFD700] mb-3">
                1. Deposit
              </h3>
              <p className="text-muted-foreground">
                Choose an investment plan and deposit your funds in BTC, ETH, or USDT.
              </p>
            </div>

            {/* Step 2: We Trade */}
            <div className="flex flex-col items-center text-center p-8 rounded-2xl border border-[#FFD700] bg-background/60 backdrop-blur animate-fade-in-up [animation-delay:600ms]">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <LineChart className="h-8 w-8 text-[#3b82f6] animate-pulse" />
              </div>
              <h3 className="text-xl font-semibold text-[#FFD700] mb-3">
                2. We Trade
              </h3>
              <p className="text-muted-foreground">
                Our expert traders and algorithms work 24/7 to generate profits in various market conditions.
              </p>
            </div>

            {/* Step 3: Daily Profits */}
            <div className="flex flex-col items-center text-center p-8 rounded-2xl border border-[#FFD700] bg-background/60 backdrop-blur animate-fade-in-up [animation-delay:800ms]">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Zap className="h-8 w-8 text-[#FFD700] animate-ping [animation-duration:3s]" />
              </div>
              <h3 className="text-xl font-semibold text-[#FFD700] mb-3">
                3. Daily Profits
              </h3>
              <p className="text-muted-foreground">
                Receive your share of trading profits daily, with transparent reporting and tracking.
              </p>
            </div>
          </div>

          <div className="mt-12 flex justify-center animate-fade-in-up [animation-delay:1000ms]">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-[#FFD700] text-primary-foreground hover:bg-primary/90 transition-transform hover:scale-105">
                Start Investing Now
                <ArrowUpRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trading Strategy Section */}
      <section className="relative overflow-hidden bg-background py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center mb-16 animate-fade-in-up [animation-delay:200ms]">
            <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 text-sm font-medium rounded-lg bg-primary/10 text-primary">
              HOW WE GENERATE PROFIT
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">
              Our Trading Strategy & Profit Sharing
            </h2>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
              Learn how we generate consistent returns and distribute profits to our investors.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Trading Strategies Card */}
            <div className="rounded-2xl border border-[#FFD700] bg-card/50 backdrop-blur p-8 animate-fade-in-left [animation-delay:400ms]">
              <h3 className="text-2xl font-semibold text-primary mb-6">
                Advanced Trading Strategies
              </h3>
              <p className="text-muted-foreground mb-8">
                Our team of expert traders utilizes sophisticated algorithmic trading strategies to
                identify and capitalize on market opportunities 24/7, across multiple exchanges and
                trading pairs.
              </p>
              
              <div className="space-y-6">
                <p className="text-muted-foreground mb-4">We employ a combination of:</p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 animate-fade-in-left [animation-delay:500ms]">
                    <ChevronRight className="h-5 w-5 text-[#FFD700] mt-0.5" />
                    <p className="text-muted-foreground">High-frequency trading algorithms that execute thousands of trades daily</p>
                  </div>
                  <div className="flex items-start gap-3 animate-fade-in-left [animation-delay:600ms]">
                    <ChevronRight className="h-5 w-5 text-[#FFD700] mt-0.5" />
                    <p className="text-muted-foreground">Arbitrage opportunities between different exchanges and trading pairs</p>
                  </div>
                  <div className="flex items-start gap-3 animate-fade-in-left [animation-delay:700ms]">
                    <ChevronRight className="h-5 w-5 text-[#FFD700] mt-0.5" />
                    <p className="text-muted-foreground">Momentum trading strategies that capitalize on market trends</p>
                  </div>
                  <div className="flex items-start gap-3 animate-fade-in-left [animation-delay:800ms]">
                    <ChevronRight className="h-5 w-5 text-[#FFD700] mt-0.5" />
                    <p className="text-muted-foreground">Risk management systems to protect capital during volatile markets</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Profit Distribution Card */}
            <div className="rounded-2xl border border-[#FFD700] bg-card/50 backdrop-blur p-8 animate-fade-in-right [animation-delay:400ms]">
              <h3 className="text-2xl font-semibold text-primary mb-6">
                Profit Distribution
              </h3>
              <p className="text-muted-foreground mb-8">
                We believe in fair and transparent profit sharing with our investors:
              </p>

              <div className="space-y-6 mb-8">
                <div className="flex items-center justify-between p-4 rounded-lg bg-background/60 animate-fade-in-right [animation-delay:500ms]">
                  <span className="text-muted-foreground">Investor Returns</span>
                  <span className="text-xl font-semibold text-primary">70% of profits</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-background/60 animate-fade-in-right [animation-delay:600ms]">
                  <span className="text-muted-foreground">Platform Development</span>
                  <span className="text-xl font-semibold text-primary">20% of profits</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-background/60 animate-fade-in-right [animation-delay:700ms]">
                  <span className="text-muted-foreground">Operational Costs</span>
                  <span className="text-xl font-semibold text-primary">10% of profits</span>
                </div>
              </div>

              <p className="text-muted-foreground">
                This model ensures that our interests are aligned with yours - we only succeed
                when you succeed. Daily profit distribution ensures you can see your investments
                growing in real-time.
              </p>
            </div>
          </div>

          <div className="mt-12 flex justify-center animate-fade-in-up [animation-delay:900ms] ">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-[#FFD700]  text-primary-foreground hover:bg-primary/90 transition-transform hover:scale-105">
                Start Earning Daily Profits
                <ArrowUpRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="relative overflow-hidden bg-background  md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="flex flex-col gap-6 animate-fade-in-left [animation-delay:200ms]">
              <div className="inline-flex items-center justify-start px-4 py-1.5 text-sm font-medium rounded-lg bg-primary/10 text-[#9333ea] w-fit">
                SECURITY FIRST
              </div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">
                Your Investments, Protected
              </h2>
              <p className="text-muted-foreground">
                At Investo Boost, security is not an afterthought—it&apos;s built into every aspect of our
                platform. We implement bank-grade security measures to ensure your digital assets
                remain safe at all times.
              </p>

              <div className="space-y-4 mt-4">
                <div className="flex items-start gap-3 animate-fade-in-left [animation-delay:300ms]">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Check className="h-3 w-3 text-primary" />
                  </div>
                  <p className="text-muted-foreground">Cold storage for 95% of all digital assets</p>
                </div>
                <div className="flex items-start gap-3 animate-fade-in-left [animation-delay:400ms]">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Check className="h-3 w-3 text-primary" />
                  </div>
                  <p className="text-muted-foreground">Multi-signature wallets for all transactions</p>
                </div>
                <div className="flex items-start gap-3 animate-fade-in-left [animation-delay:500ms]">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Check className="h-3 w-3 text-primary" />
                  </div>
                  <p className="text-muted-foreground">Advanced encryption for all data</p>
                </div>
                <div className="flex items-start gap-3 animate-fade-in-left [animation-delay:600ms]">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Check className="h-3 w-3 text-primary" />
                  </div>
                  <p className="text-muted-foreground">Regular security audits by third-party firms</p>
                </div>
                <div className="flex items-start gap-3 animate-fade-in-left [animation-delay:700ms]">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Check className="h-3 w-3 text-primary" />
                  </div>
                  <p className="text-muted-foreground">Real-time monitoring for suspicious activities</p>
                </div>
              </div>
            </div>

            <div className="relative animate-fade-in-right [animation-delay:400ms]">
              <div className="absolute -inset-4">
                <div className="w-full h-full mx-auto rotate-2 bg-gradient-to-r from-primary to-primary/30 blur-2xl opacity-30 rounded-3xl animate-pulse-slow"></div>
              </div>
              <div className="relative">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-primary/10">
                  <img
                    src="/images/security-graphic.png"
                    alt="Secure crypto investment"
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py- md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#FFD700]/5 to-transparent animate-pulse-slow" />
        <div className="absolute inset-x-0 -bottom-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-bottom-80">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#FFD700] to-[#FFD700]/50 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem] animate-gradient-x" />
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col items-center text-center animate-fade-in-up [animation-delay:200ms]">
            <h2 className="text-4xl md:text-5xl mt-10 md:mt-0 font-bold bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent mb-6">
              Ready to Grow Your Portfolio?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mb-12">
              Join thousands of investors already earning daily profits with Investo Boost&apos;s
              intelligent crypto investment platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-10 md:mb-0">
              <Link href="/auth/signup">
                <Button size="lg" className="bg-[#FFD700] text-primary-foreground hover:bg-primary/90 min-w-[200px] transition-transform hover:scale-105 animate-fade-in-up [animation-delay:400ms]">
                  Create Free Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
} 