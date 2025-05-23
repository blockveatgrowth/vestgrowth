import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import MainLayout from "@/components/layout/MainLayout";

export const metadata: Metadata = {
  title: "FAQs - Investo Boost",
  description: "Frequently Asked Questions about Investo Boost",
};

export default function FAQPage() {
  return (
    <MainLayout>
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in-up">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">
              Frequently Asked Questions
            </h1>
            <p className="mt-4 text-lg text-gray-400">
              Find answers to common questions about Investo Boost Platform
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-8 animate-fade-in-up delay-100">
            {/* General Questions */}
            <div>
              <h2 className="text-2xl font-semibold mb-6 bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">
                General Questions
              </h2>
              <div className="space-y-6">
                <div className="p-6 rounded-lg border border-[#FFD700]/20 bg-[#0D1117]/60 backdrop-blur">
                  <h3 className="text-lg font-medium text-[#FFD700] mb-2">
                    What is Investo Boost Platform?
                  </h3>
                  <p className="text-gray-400">
                    Investo Boost is a premium crypto investment platform that simplifies digital asset trading. We offer daily profits, multi-level referral systems, and automated investment management.
                  </p>
                </div>

                <div className="p-6 rounded-lg border border-[#FFD700]/20 bg-[#0D1117]/60 backdrop-blur">
                  <h3 className="text-lg font-medium text-[#FFD700] mb-2">
                    How do I get started?
                  </h3>
                  <p className="text-gray-400">
                    Getting started is easy! Simply sign up for an account, verify your email, and make your first deposit of at least $30 to begin earning daily profits.
                  </p>
                </div>
              </div>
            </div>

            {/* Investment Questions */}
            <div>
              <h2 className="text-2xl font-semibold mb-6 bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">
                Investment & Profits
              </h2>
              <div className="space-y-6">
                <div className="p-6 rounded-lg border border-[#FFD700]/20 bg-[#0D1117]/60 backdrop-blur">
                  <h3 className="text-lg font-medium text-[#FFD700] mb-2">
                    How much can I earn?
                  </h3>
                  <p className="text-gray-400">
                    You can earn a 10% daily profit on your deposits, plus additional earnings through our multi-level referral system with rates from 2-4% for Level 1 down to 0.025% for Level 5.
                  </p>
                </div>

                <div className="p-6 rounded-lg border border-[#FFD700]/20 bg-[#0D1117]/60 backdrop-blur">
                  <h3 className="text-lg font-medium text-[#FFD700] mb-2">
                    What's the minimum deposit?
                  </h3>
                  <p className="text-gray-400">
                    The minimum deposit is $30, and you'll need to maintain a minimum balance of $300 to make withdrawals.
                  </p>
                </div>
              </div>
            </div>

            {/* Referral Questions */}
            <div>
              <h2 className="text-2xl font-semibold mb-6 bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">
                Referral Program
              </h2>
              <div className="space-y-6">
                <div className="p-6 rounded-lg border border-[#FFD700]/20 bg-[#0D1117]/60 backdrop-blur">
                  <h3 className="text-lg font-medium text-[#FFD700] mb-2">
                    How does the referral system work?
                  </h3>
                  <p className="text-gray-400">
                    Our referral system goes 5 levels deep. You earn a percentage of your referrals' profits, with rates varying by level. The more people you refer, the more you can earn!
                  </p>
                </div>

                <div className="p-6 rounded-lg border border-[#FFD700]/20 bg-[#0D1117]/60 backdrop-blur">
                  <h3 className="text-lg font-medium text-[#FFD700] mb-2">
                    When do I receive referral commissions?
                  </h3>
                  <p className="text-gray-400">
                    Referral commissions are calculated and distributed automatically whenever your referrals receive their daily profits. The earnings are instantly added to your balance.
                  </p>
                </div>
              </div>
            </div>

            {/* Support Questions */}
            <div>
              <h2 className="text-2xl font-semibold mb-6 bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">
                Support
              </h2>
              <div className="space-y-6">
                <div className="p-6 rounded-lg border border-[#FFD700]/20 bg-[#0D1117]/60 backdrop-blur">
                  <h3 className="text-lg font-medium text-[#FFD700] mb-2">
                    How can I get help?
                  </h3>
                  <p className="text-gray-400">
                    Our support team is available 24/7. You can create a support ticket from your dashboard, and we'll respond to your inquiry as quickly as possible.
                  </p>
                </div>

                <div className="p-6 rounded-lg border border-[#FFD700]/20 bg-[#0D1117]/60 backdrop-blur">
                  <h3 className="text-lg font-medium text-[#FFD700] mb-2">
                    What if I have issues with deposits or withdrawals?
                  </h3>
                  <p className="text-gray-400">
                    For any transaction-related issues, a support ticket is automatically created. You can track the status of your request through your dashboard, and our team will assist you promptly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
} 