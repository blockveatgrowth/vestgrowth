import { Metadata } from "next";
import MainLayout from "@/components/layout/MainLayout";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms & Conditions - Investo Boost",
  description: "Investo Boost's Terms & Conditions - Please read before using our services",
};

export default function TermsAndConditionsPage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent mb-4">
            Terms & Conditions
          </h1>
          <p className="text-gray-400 mx-auto max-w-2xl">
            Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        <div className="prose prose-invert max-w-none">
          <div className="bg-[#111827]/50 p-8 rounded-lg mb-8 border border-[#FFD700]/20 animate-fade-in-up">
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">Introduction</h2>
            <p className="text-gray-300">
              Welcome to Investo Boost. These Terms & Conditions govern your use of the Investo Boost website and platform (collectively, the &ldquo;Service&rdquo;). By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the Service.
            </p>
          </div>

          <div className="bg-[#111827]/50 p-8 rounded-lg mb-8 border border-[#FFD700]/20 animate-fade-in-up">
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">Definitions</h2>
            <ul className="list-disc pl-6 text-gray-300">
              <li><strong>Company:</strong> &ldquo;Investo Boost&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo; refers to Investo Boost.</li>
              <li><strong>User:</strong> &ldquo;User&rdquo;, &ldquo;you&rdquo;, and &ldquo;your&rdquo; refer to the individual accessing or using the Service, or the company or other legal entity on behalf of which such individual is accessing or using the Service.</li>
              <li><strong>Website:</strong> Investo Boost&apos;s website, accessible from https://investoboost.com</li>
              <li><strong>Service:</strong> The entire investment platform, including the website, applications, and all services provided by Investo Boost.</li>
              <li><strong>Account:</strong> A unique account created for you to access our Service.</li>
              <li><strong>Investments:</strong> Any deposits or financial contributions made by users through the platform.</li>
            </ul>
          </div>

          <div className="bg-[#111827]/50 p-8 rounded-lg mb-8 border border-[#FFD700]/20 animate-fade-in-up">
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">Account Registration</h2>
            <p className="text-gray-300">
              To use our Service, you must register for an account by providing certain personal information. You must be at least 18 years old to create an account and use the Service. You are responsible for maintaining the confidentiality of your account information, including your password, and for all activities that occur under your account.
            </p>
            <p className="text-gray-300 mt-4">
              You agree to:
            </p>
            <ul className="list-disc pl-6 mt-2 text-gray-300">
              <li>Provide accurate, current, and complete information during the registration process</li>
              <li>Maintain and promptly update your account information to keep it accurate, current, and complete</li>
              <li>Notify us immediately of any unauthorized use of your account or any other breach of security</li>
              <li>Ensure that you log out from your account at the end of each session</li>
            </ul>
            <p className="text-gray-300 mt-4">
              We reserve the right to refuse service, terminate accounts, remove or edit content, or cancel orders at our sole discretion.
            </p>
          </div>

          <div className="bg-[#111827]/50 p-8 rounded-lg mb-8 border border-[#FFD700]/20 animate-fade-in-up">
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">Acceptable Use</h2>
            <p className="text-gray-300">
              You agree not to:
            </p>
            <ul className="list-disc pl-6 mt-2 text-gray-300">
              <li>Use the Service in any way that violates any applicable laws or regulations</li>
              <li>Impersonate any person or entity, or falsely state or misrepresent your affiliation with a person or entity</li>
              <li>Engage in unauthorized framing or linking to the website</li>
              <li>Upload or transmit viruses, malware, or other malicious code</li>
              <li>Collect or track the personal information of others</li>
              <li>Spam, phish, or engage in other deceptive practices</li>
              <li>Interfere with or circumvent the security features of the Service</li>
              <li>Attempt to gain unauthorized access to any portion of the Service</li>
            </ul>
          </div>

          <div className="bg-[#111827]/50 p-8 rounded-lg mb-8 border border-[#FFD700]/20 animate-fade-in-up">
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">Deposits and Withdrawals</h2>
            <p className="text-gray-300">
              By making a deposit on our platform, you agree to:
            </p>
            <ul className="list-disc pl-6 mt-2 text-gray-300">
              <li>Provide accurate and complete payment information</li>
              <li>Maintain a minimum deposit amount of $50</li>
              <li>Accept our deposit verification process, which may take up to 24 hours</li>
              <li>Understand that deposit processing times may vary depending on the payment method</li>
            </ul>

            <p className="text-gray-300 mt-4">
              Regarding withdrawals:
            </p>
            <ul className="list-disc pl-6 mt-2 text-gray-300">
              <li>Withdrawal requests are processed within 24-48 hours</li>
              <li>A minimum balance of $300 must be maintained in your account</li>
              <li>Withdrawals may be subject to verification for security purposes</li>
              <li>Withdrawal methods may be limited to those used for deposits</li>
              <li>Withdrawal fees may apply as outlined in our fee schedule</li>
            </ul>

            <p className="text-gray-300 mt-4">
              Investo Boost reserves the right to refuse or delay any transaction if we suspect fraudulent activity or violations of our terms.
            </p>
          </div>

          <div className="bg-[#111827]/50 p-8 rounded-lg mb-8 border border-[#FFD700]/20 animate-fade-in-up">
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">Investment Plans</h2>
            <p className="text-gray-300">
              We offer various investment plans with different profit percentages based on deposit amounts:
            </p>
            <ul className="list-disc pl-6 mt-2 text-gray-300">
              <li>Plan 1: $50-$199 with 2% daily profit</li>
              <li>Plan 2: $200-$499 with 3% daily profit</li>
              <li>Plan 3: $500-$1,499 with 3.5% daily profit</li>
              <li>Plan 4: $1,500-$5,000 with 4% daily profit</li>
            </ul>
            <p className="text-gray-300 mt-4">
              You acknowledge that:
            </p>
            <ul className="list-disc pl-6 mt-2 text-gray-300">
              <li>The selection of an investment plan is based on your deposit amount</li>
              <li>Each deposit is subject to a 30-day lock period</li>
              <li>Daily profits will be automatically credited to your account</li>
              <li>Investment plans and rates may be subject to change with notice</li>
            </ul>
          </div>

          <div className="bg-[#111827]/50 p-8 rounded-lg mb-8 border border-[#FFD700]/20 animate-fade-in-up">
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">Referral Program</h2>
            <p className="text-gray-300">
              Our referral program allows you to earn commissions from people you refer to our platform. The program includes:
            </p>
            <ul className="list-disc pl-6 mt-2 text-gray-300">
              <li>A 5-level commission structure</li>
              <li>Commission rates ranging from 10% to 0.75% depending on the level</li>
              <li>Immediate commission distribution when your referrals make deposits</li>
              <li>Access to detailed referral statistics in your dashboard</li>
            </ul>
            <p className="text-gray-300 mt-4">
              By participating in our referral program, you agree not to:
            </p>
            <ul className="list-disc pl-6 mt-2 text-gray-300">
              <li>Make false or misleading statements about Investo Boost</li>
              <li>Spam or harass potential referrals</li>
              <li>Create fake accounts to generate commissions</li>
              <li>Engage in any deceptive practices to generate referrals</li>
            </ul>
            <p className="text-gray-300 mt-4">
              We reserve the right to modify or terminate the referral program at any time.
            </p>
          </div>

          <div className="bg-[#111827]/50 p-8 rounded-lg mb-8 border border-[#FFD700]/20 animate-fade-in-up">
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">Intellectual Property</h2>
            <p className="text-gray-300">
              The Service and its original content, features, and functionality are and will remain the exclusive property of Investo Boost. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of Investo Boost.
            </p>
          </div>

          <div className="bg-[#111827]/50 p-8 rounded-lg mb-8 border border-[#FFD700]/20 animate-fade-in-up">
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">Risks and Disclaimer of Liability</h2>
            <p className="text-gray-300">
              Cryptocurrency and digital asset investments involve substantial risk and are highly speculative. You should only invest funds you can afford to lose.
            </p>
            <p className="text-gray-300 mt-4">
              By using our platform, you acknowledge that:
            </p>
            <ul className="list-disc pl-6 mt-2 text-gray-300">
              <li>Digital asset investments are subject to extreme price volatility</li>
              <li>Past performance is not indicative of future results</li>
              <li>Technology risks, including system failures, may affect your ability to access or use the Service</li>
              <li>Regulatory changes may impact the Service and your investments</li>
            </ul>
            
            <p className="text-gray-300 mt-6 p-4 border border-[#FFD700] rounded-lg bg-[#111827]">
              <strong className="text-[#FFD700]">IMPORTANT LIMITATION OF LIABILITY:</strong> Investo Boost will not be responsible for any losses, damages, or liabilities arising from your investment decisions, market fluctuations, or platform usage. In case of any loss resulting from trading activities, market volatility, security breaches, technical failures, or any other circumstances, 100% of such loss will be tolerated by the client. By using our platform, you acknowledge and accept full responsibility for all trading decisions and investment risks.
            </p>
            
            <p className="text-gray-300 mt-4">
              TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL INVESTO BOOST BE LIABLE FOR ANY SPECIAL, INCIDENTAL, INDIRECT, OR CONSEQUENTIAL DAMAGES WHATSOEVER (INCLUDING, BUT NOT LIMITED TO, DAMAGES FOR LOSS OF PROFITS, LOSS OF DATA, OR ANY OTHER PECUNIARY LOSS) ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THE SERVICE.
            </p>
          </div>

          <div className="bg-[#111827]/50 p-8 rounded-lg mb-8 border border-[#FFD700]/20 animate-fade-in-up">
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">KYC/AML Compliance</h2>
            <p className="text-gray-300">
              We are committed to implementing and maintaining Anti-Money Laundering (AML) and Know Your Customer (KYC) compliance programs. By using our Service, you agree to:
            </p>
            <ul className="list-disc pl-6 mt-2 text-gray-300">
              <li>Provide accurate identification information when requested</li>
              <li>Submit to verification processes for large deposits or withdrawals</li>
              <li>Acknowledge that we may reject or suspend transactions that appear suspicious</li>
              <li>Understand that we may be required to report certain transactions to regulatory authorities</li>
            </ul>
            <p className="text-gray-300 mt-4">
              Failure to comply with our KYC/AML requirements may result in the suspension or termination of your account.
            </p>
          </div>

          <div className="bg-[#111827]/50 p-8 rounded-lg mb-8 border border-[#FFD700]/20 animate-fade-in-up">
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">Termination</h2>
            <p className="text-gray-300">
              We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
            </p>
            <p className="text-gray-300 mt-4">
              Upon termination, your right to use the Service will immediately cease. If you wish to terminate your account, you may simply discontinue using the Service or contact us to request account deletion.
            </p>
            <p className="text-gray-300 mt-4">
              All provisions of the Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
            </p>
          </div>

          <div className="bg-[#111827]/50 p-8 rounded-lg mb-8 border border-[#FFD700]/20 animate-fade-in-up">
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">Changes to Terms</h2>
            <p className="text-gray-300">
              We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days&apos; notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
            </p>
            <p className="text-gray-300 mt-4">
              By continuing to access or use our Service after any revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, you are no longer authorized to use the Service.
            </p>
          </div>

          <div className="bg-[#111827]/50 p-8 rounded-lg mb-8 border border-[#FFD700]/20 animate-fade-in-up">
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">Indemnification</h2>
            <p className="text-gray-300">
              You agree to defend, indemnify, and hold harmless Investo Boost and its licensee and licensors, and their employees, contractors, agents, officers, and directors, from and against any and all claims, damages, obligations, losses, liabilities, costs or debt, and expenses (including but not limited to attorney&apos;s fees), resulting from or arising out of:
            </p>
            <ul className="list-disc pl-6 mt-2 text-gray-300">
              <li>Your use and access of the Service</li>
              <li>Your violation of any term of these Terms</li>
              <li>Your violation of any third-party right, including without limitation any copyright, property, or privacy right</li>
              <li>Any claim that your use of the Service caused damage to a third party</li>
            </ul>
            <p className="text-gray-300 mt-4">
              This defense and indemnification obligation will survive these Terms and your use of the Service.
            </p>
          </div>

          <div className="bg-[#111827]/50 p-8 rounded-lg mb-8 border border-[#FFD700]/20 animate-fade-in-up">
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">Governing Law</h2>
            <p className="text-gray-300">
              These Terms shall be governed and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.
            </p>
            <p className="text-gray-300 mt-4">
              Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect.
            </p>
          </div>

          <div className="bg-[#111827]/50 p-8 rounded-lg mb-8 border border-[#FFD700]/20 animate-fade-in-up">
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">Dispute Resolution</h2>
            <p className="text-gray-300">
              Any disputes arising out of or relating to these Terms or the Service shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association. The arbitration shall be conducted in New York, New York, and judgment on the arbitration award may be entered in any court having jurisdiction thereof.
            </p>
            <p className="text-gray-300 mt-4">
              You agree that any arbitration shall be limited to the dispute between you and Investo Boost individually. To the full extent permitted by law:
            </p>
            <ul className="list-disc pl-6 mt-2 text-gray-300">
              <li>No arbitration shall be joined with any other proceeding</li>
              <li>There is no right or authority for any dispute to be arbitrated on a class-action basis</li>
              <li>There is no right or authority for any dispute to be brought in a purported representative capacity</li>
            </ul>
          </div>

          <div className="bg-[#111827]/50 p-8 rounded-lg mb-8 border border-[#FFD700]/20 animate-fade-in-up">
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">Contact Us</h2>
            <p className="text-gray-300">
              If you have any questions about these Terms, please contact us at:
            </p>
            <p className="text-gray-300 mt-4">
              <strong>Email:</strong> <a href="mailto:legal@investoboost.com" className="text-[#FFD700] hover:underline">legal@investoboost.com</a>
            </p>
            <p className="text-gray-300 mt-2">
              <strong>Address:</strong> Investo Boost Headquarters, Financial District, New York, NY 10004, USA
            </p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-400">
            By using our website and services, you acknowledge that you have read and agreed to these Terms & Conditions.
          </p>
          <div className="mt-6">
            <Link href="/privacy" className="text-[#FFD700] hover:underline">
              View our Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 