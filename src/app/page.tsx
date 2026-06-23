import Link from "next/link";
import { Button } from "@/components/ui/button";
import MainLayout from "@/components/layout/MainLayout";
import { AlgorithmSection } from "@/components/home/AlgorithmSection";
import { InvestmentJourneySection } from "@/components/home/InvestmentJourneySection";
import { PlansSection } from "@/components/home/PlansSection";

export default function Home() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#0D1117] py-20 md:py-28 animate-fade-in">
        <div className="absolute inset-0 bg-gradient-to-b from-[#FFD700]/5 to-transparent animate-pulse-slow" />
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#FFD700] to-[#FFD700]/50 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem] animate-gradient-x" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col gap-10 md:gap-16 md:flex-row-reverse items-center">
            {/* Hero image */}
            <div className="w-full md:w-1/2 max-w-xl animate-fade-in-up">
              <img
                src="/images/feature-4.jpg"
                alt="Investo Boost — Crypto Trading Platform"
                className="w-full h-auto object-cover rounded-2xl shadow-[0_0_60px_rgba(255,215,0,0.15)] border border-[#FFD700]/10"
              />
            </div>
            {/* Hero text */}
            <div className="flex flex-col items-start text-left md:w-1/2">
              <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase bg-[#FFD700]/10 text-[#FFD700] border border-[#FFD700]/20 mb-5 animate-fade-in-up">
                Professional Crypto Investment
              </span>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-[#FFD700] via-[#FFC200] to-[#FFA500] bg-clip-text text-transparent pb-2 animate-fade-in-up">
                Earn Daily From<br />Live Crypto Trades
              </h1>
              <p className="mt-6 text-lg text-gray-400 max-w-xl animate-fade-in-up delay-100 leading-relaxed">
                Investo Boost executes real-time algorithmic trades on top crypto pairs every day.
                Your earnings are a direct percentage of each day&apos;s trade result — no fixed
                promises, just transparent market-based returns.
              </p>
              {/* Stats row */}
              <div className="mt-8 grid grid-cols-3 gap-4 w-full animate-fade-in-up delay-200">
                <div className="text-center p-3 rounded-xl bg-[#FFD700]/5 border border-[#FFD700]/15">
                  <div className="text-2xl font-bold text-[#FFD700]">4–8%</div>
                  <div className="text-xs text-gray-500 mt-0.5">Daily Trade Range</div>
                </div>
                <div className="text-center p-3 rounded-xl bg-[#FFD700]/5 border border-[#FFD700]/15">
                  <div className="text-2xl font-bold text-[#FFD700]">75%</div>
                  <div className="text-xs text-gray-500 mt-0.5">Max Profit Share</div>
                </div>
                <div className="text-center p-3 rounded-xl bg-[#FFD700]/5 border border-[#FFD700]/15">
                  <div className="text-2xl font-bold text-[#FFD700]">5x</div>
                  <div className="text-xs text-gray-500 mt-0.5">Referral Levels</div>
                </div>
              </div>
              <div className="mt-10 flex flex-row gap-4 animate-fade-in-up delay-300">
                <Link href="/auth/signup">
                  <Button size="lg" className="bg-[#FFD700] hover:bg-[#FFC200] text-black font-bold shadow-[0_0_25px_rgba(255,215,0,0.4)] hover:shadow-[0_0_40px_rgba(255,215,0,0.6)] transition-all duration-300 transform hover:scale-105">
                    Start Investing
                  </Button>
                </Link>
                <Link href="#plans">
                  <Button variant="outline" size="lg" className="border-[#FFD700]/30 text-[#FFD700] hover:bg-[#FFD700]/10 transition-all duration-300 transform hover:scale-105">
                    View Plans
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-24 bg-[#0D1117]/80 backdrop-blur-lg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in-up">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase bg-[#FFD700]/10 text-[#FFD700] border border-[#FFD700]/20 mb-4">
              Platform Features
            </span>
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">
              Why Choose Investo Boost
            </h2>
            <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
              A transparent, market-driven investment platform built for serious crypto investors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="flex flex-col items-center text-center p-8 rounded-2xl border border-[#FFD700]/20 bg-[#0D1117]/60 backdrop-blur shadow-[0_0_20px_rgba(255,215,0,0.08)] hover:shadow-[0_0_35px_rgba(255,215,0,0.2)] transition-all duration-300 transform hover:-translate-y-1 hover:border-[#FFD700]/40 animate-fade-in-up">
              <div className="w-14 h-14 rounded-2xl bg-[#FFD700]/10 flex items-center justify-center mb-5 animate-bounce-slow border border-[#FFD700]/20">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-[#FFD700]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">
                Market-Based Daily Profits
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Earn 40–75% of each day&apos;s live crypto trade result based on your plan.
                Profits are credited automatically to your balance every day the market is positive.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col items-center text-center p-8 rounded-2xl border border-[#FFD700]/20 bg-[#0D1117]/60 backdrop-blur shadow-[0_0_20px_rgba(255,215,0,0.08)] hover:shadow-[0_0_35px_rgba(255,215,0,0.2)] transition-all duration-300 transform hover:-translate-y-1 hover:border-[#FFD700]/40 animate-fade-in-up delay-100">
              <div className="w-14 h-14 rounded-2xl bg-[#FFD700]/10 flex items-center justify-center mb-5 animate-bounce-slow delay-100 border border-[#FFD700]/20">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-[#FFD700]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">
                5-Level Referral Network
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Build a passive income stream by referring others. Earn commissions across
                5 levels of your network — the more you grow your team, the more you earn.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col items-center text-center p-8 rounded-2xl border border-[#FFD700]/20 bg-[#0D1117]/60 backdrop-blur shadow-[0_0_20px_rgba(255,215,0,0.08)] hover:shadow-[0_0_35px_rgba(255,215,0,0.2)] transition-all duration-300 transform hover:-translate-y-1 hover:border-[#FFD700]/40 animate-fade-in-up delay-200">
              <div className="w-14 h-14 rounded-2xl bg-[#FFD700]/10 flex items-center justify-center mb-5 animate-bounce-slow delay-200 border border-[#FFD700]/20">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-[#FFD700]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">
                Simple Deposits & Withdrawals
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Deposit via USDT (TRC20, ERC20, BEP20) starting from just $50.
                Withdraw your earnings anytime once you reach the minimum withdrawal threshold.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <PlansSection />

      {/* CTA Section */}
      <section className="relative py-20 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#FFD700]/5 to-transparent animate-pulse-slow" />
        <div className="absolute inset-x-0 -bottom-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-bottom-80">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#FFD700] to-[#FFD700]/50 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem] animate-gradient-x" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl mx-auto text-center p-12 rounded-3xl border border-[#FFD700]/20 bg-[#0D1117]/60 backdrop-blur shadow-[0_0_60px_rgba(255,215,0,0.1)] animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent mb-4">
              Ready to Start Earning?
            </h2>
            <p className="text-lg text-gray-400 max-w-xl mx-auto mb-8 leading-relaxed">
              Join Investo Boost today and start earning from real crypto market movements.
              Choose your plan, deposit, and watch your balance grow every trading day.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup">
                <Button size="lg" className="bg-[#FFD700] hover:bg-[#FFC200] text-black font-bold shadow-[0_0_25px_rgba(255,215,0,0.4)] hover:shadow-[0_0_40px_rgba(255,215,0,0.6)] transition-all duration-300 transform hover:scale-105 px-10">
                  Create Free Account
                </Button>
              </Link>
              <Link href="/auth/signin">
                <Button variant="outline" size="lg" className="border-[#FFD700]/30 text-[#FFD700] hover:bg-[#FFD700]/10 transition-all duration-300">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Algorithm Trading and Investment Journey Sections */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-fade-in-up">
            <AlgorithmSection />
          </div>
          <div className="mt-24 animate-fade-in-up delay-100">
            <InvestmentJourneySection />
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
