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
      <section className="relative overflow-hidden bg-[#0D1117] py-16 md:py-20 animate-fade-in">
        <div className="absolute inset-0 bg-gradient-to-b from-[#FFD700]/5 to-transparent animate-pulse-slow" />
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#FFD700] to-[#FFD700]/50 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem] animate-gradient-x" />
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col gap-6 md:gap-12 md:flex-row-reverse items-center text-center">
            <div className="w-full max-w-2xl mb-8 animate-fade-in-up">
	              <img
                src="/images/feature-4.jpg"
                alt="Investo Boost Hero"
                className="w-full h-auto object-cover rounded-lg shadow-[0_0_30px_rgba(255,215,0,0.2)]"
              />
            </div>
            <div className="flex flex-col items-start text-left">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent pb-2 animate-fade-in-up">
              Redefining Crypto Investment
            </h1>
            <p className="mt-6 text-xl text-gray-400 max-w-3xl animate-fade-in-up delay-200">
              Investo Boost is a premium crypto investment platform that takes the complexity
              out of digital asset trading, allowing you to profit from market movements without
              the learning curve.
            </p>
            <div className="mt-10 flex flex-row gap-4 animate-fade-in-up delay-300">
              <Link href="/auth/signup">
                <Button size="lg" className="w-full sm:w-auto bg-[#FFD700] hover:bg-[#FFD700]/90 text-black font-semibold shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:shadow-[0_0_30px_rgba(255,215,0,0.5)] transition-all duration-300 transform hover:scale-105">
                  Get Started
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" size="lg" className="w-full sm:w-auto border-[#FFD700]/20 text-[#FFD700] hover:bg-[#FFD700]/10 shadow-[0_0_20px_rgba(255,215,0,0.1)] hover:shadow-[0_0_30px_rgba(255,215,0,0.2)] transition-all duration-300 transform hover:scale-105">
                  Learn More
                </Button>
              </Link>
            </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-20 bg-[#0D1117]/80 backdrop-blur-lg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">
              Why Choose Investo Boost
            </h2>
            <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
              Our platform offers unique features designed to maximize your investment potential
              while minimizing risk.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature cards with updated styling */}
            <div className="flex flex-col items-center text-center p-8 rounded-xl border border-[#FFD700]/20 bg-[#0D1117]/60 backdrop-blur supports-[backdrop-filter]:bg-[#0D1117]/60 shadow-[0_0_20px_rgba(255,215,0,0.1)] hover:shadow-[0_0_30px_rgba(255,215,0,0.2)] transition-all duration-300 transform hover:scale-105 hover:border-[#FFD700]/40 animate-fade-in-up">
              <div className="w-12 h-12 rounded-full bg-[#FFD700]/10 flex items-center justify-center mb-4 animate-bounce-slow">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 text-[#FFD700]"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">
                Daily Profits
              </h3>
              <p className="text-gray-400">
                Earn a 5% daily profit on your deposits, automatically added to your balance
                for consistent growth.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-8 rounded-xl border border-[#FFD700]/20 bg-[#0D1117]/60 backdrop-blur supports-[backdrop-filter]:bg-[#0D1117]/60 shadow-[0_0_20px_rgba(255,215,0,0.1)] hover:shadow-[0_0_30px_rgba(255,215,0,0.2)] transition-all duration-300 transform hover:scale-105 hover:border-[#FFD700]/40 animate-fade-in-up delay-100">
              <div className="w-12 h-12 rounded-full bg-[#FFD700]/10 flex items-center justify-center mb-4 animate-bounce-slow delay-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 text-[#FFD700]"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">
                Multi-Level Referrals
              </h3>
              <p className="text-gray-400">
                Earn commissions from referrals up to 5 levels deep.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-8 rounded-xl border border-[#FFD700]/20 bg-[#0D1117]/60 backdrop-blur supports-[backdrop-filter]:bg-[#0D1117]/60 shadow-[0_0_20px_rgba(255,215,0,0.1)] hover:shadow-[0_0_30px_rgba(255,215,0,0.2)] transition-all duration-300 transform hover:scale-105 hover:border-[#FFD700]/40 animate-fade-in-up delay-200">
              <div className="w-12 h-12 rounded-full bg-[#FFD700]/10 flex items-center justify-center mb-4 animate-bounce-slow delay-200">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 text-[#FFD700]"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">
                Straightforward Deposits
              </h3>
              <p className="text-gray-400">
                Easy deposit process with minimum of $50, and a simple withdrawal system after
                reaching the $50 threshold.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <PlansSection />

      {/* CTA Section */}
      <section className="relative py-16 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#FFD700]/5 to-transparent animate-pulse-slow" />
        <div className="absolute inset-x-0 -bottom-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-bottom-80">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#FFD700] to-[#FFD700]/50 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem] animate-gradient-x" />
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center animate-fade-in-up">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">
              Ready to Start Investing?
            </h2>
            <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
              Join thousands of investors who are already growing their wealth with
              Investo Boost.
            </p>
            <Link href="/auth/signup" className="mt-8 inline-block">
              <Button size="lg" className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-black font-semibold shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:shadow-[0_0_30px_rgba(255,215,0,0.5)] transition-all duration-300 transform hover:scale-105">
                Create Your Account
              </Button>
            </Link>
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
