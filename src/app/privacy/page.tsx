import { Metadata } from "next";
import MainLayout from "@/components/layout/MainLayout";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy - Investo Boost",
  description: "Investo Boost's Privacy Policy - Learn how we collect, use and protect your personal information",
};

export default function PrivacyPolicyPage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent mb-4">
            Privacy Policy
          </h1>
          <p className="text-gray-400 mx-auto max-w-2xl">
            Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        <div className="prose prose-invert max-w-none">
          <div className="bg-[#111827]/50 p-8 rounded-lg mb-8 border border-[#FFD700]/20 animate-fade-in-up">
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">Introduction</h2>
            <p className="text-gray-300">
              At Investo Boost ("we", "us", or "our"), we value your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services. Please read this Privacy Policy carefully. If you do not agree with the terms of this Privacy Policy, please do not access the site.
            </p>
          </div>

          <div className="bg-[#111827]/50 p-8 rounded-lg mb-8 border border-[#FFD700]/20 animate-fade-in-up">
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">Information We Collect</h2>
            <h3 className="text-xl font-semibold text-white mt-6 mb-2">Personal Information</h3>
            <p className="text-gray-300">
              We may collect personal information that you voluntarily provide to us when you register on the website, express interest in obtaining information about us or our products and services, or otherwise contact us. The personal information we collect may include:
            </p>
            <ul className="list-disc pl-6 mt-4 text-gray-300">
              <li>Name and contact information (email address, phone number, etc.)</li>
              <li>Date of birth and government ID information for compliance purposes</li>
              <li>Financial information (bank account details, cryptocurrency wallet addresses, etc.)</li>
              <li>Profile information (username, password, etc.)</li>
              <li>Transaction history and investment preferences</li>
              <li>Any other information you choose to provide</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mt-6 mb-2">Automatically Collected Information</h3>
            <p className="text-gray-300">
              When you access our website, we may automatically collect certain information about your device and usage patterns, including:
            </p>
            <ul className="list-disc pl-6 mt-4 text-gray-300">
              <li>IP address, browser type, device type, and operating system</li>
              <li>Pages visited, time spent on pages, links clicked, and browsing patterns</li>
              <li>Location information</li>
              <li>Referral sources and parameters</li>
              <li>System activity and performance data</li>
            </ul>
          </div>

          <div className="bg-[#111827]/50 p-8 rounded-lg mb-8 border border-[#FFD700]/20 animate-fade-in-up">
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">How We Use Your Information</h2>
            <p className="text-gray-300">
              We may use the information we collect for various purposes, including:
            </p>
            <ul className="list-disc pl-6 mt-4 text-gray-300">
              <li>Providing, maintaining, and improving our services</li>
              <li>Processing transactions and managing your account</li>
              <li>Complying with legal and regulatory requirements (KYC/AML)</li>
              <li>Communicating with you about updates, security alerts, and support</li>
              <li>Responding to your requests, questions, and feedback</li>
              <li>Monitoring usage patterns and analyzing trends</li>
              <li>Protecting against fraud and unauthorized access</li>
              <li>Personalizing your experience and delivering tailored content</li>
              <li>Marketing and promotional purposes (with your consent where required)</li>
            </ul>
          </div>

          <div className="bg-[#111827]/50 p-8 rounded-lg mb-8 border border-[#FFD700]/20 animate-fade-in-up">
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">Data Sharing and Disclosure</h2>
            <p className="text-gray-300">
              We may share your information with third parties in the following circumstances:
            </p>
            <ul className="list-disc pl-6 mt-4 text-gray-300">
              <li>With service providers and partners who assist in operating our website and providing services</li>
              <li>To comply with legal obligations, including responding to lawful requests from public authorities</li>
              <li>To protect our rights, privacy, safety, or property</li>
              <li>In connection with a business transfer, merger, or acquisition</li>
              <li>With your consent or at your direction</li>
            </ul>
            <p className="text-gray-300 mt-4">
              We do not sell your personal information to third parties.
            </p>
          </div>
          
          <div className="bg-[#111827]/50 p-8 rounded-lg mb-8 border border-[#FFD700]/20 animate-fade-in-up">
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">Security Measures</h2>
            <p className="text-gray-300">
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.
            </p>
          </div>

          <div className="bg-[#111827]/50 p-8 rounded-lg mb-8 border border-[#FFD700]/20 animate-fade-in-up">
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">Investment Risks and Liability Disclaimer</h2>
            <p className="text-gray-300">
              Cryptocurrency and digital asset investments involve substantial risk and are not suitable for all investors. Before investing, you should carefully consider your investment objectives, level of experience, and risk appetite.
            </p>
            <p className="text-gray-300 mt-4">
              <strong className="text-[#FFD700]">IMPORTANT: LIMITATION OF LIABILITY:</strong> Investo Boost will not be responsible for any losses, damages, or liabilities arising from your investment decisions or market fluctuations. In case of any loss resulting from trading activities, market conditions, or platform issues, our liability is limited as described in our Terms of Service.
            </p>
            <p className="text-gray-300 mt-4">
              Past performance is not indicative of future results. The value of investments can go down as well as up, and you may not recover the amount of your original investment.
            </p>
          </div>

          <div className="bg-[#111827]/50 p-8 rounded-lg mb-8 border border-[#FFD700]/20 animate-fade-in-up">
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">Cookie Policy</h2>
            <p className="text-gray-300">
              We use cookies and similar tracking technologies to track activity on our website and store certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our service.
            </p>
            <p className="text-gray-300 mt-4">
              Types of cookies we use:
            </p>
            <ul className="list-disc pl-6 mt-4 text-gray-300">
              <li><strong>Essential Cookies:</strong> Required for the operation of our website</li>
              <li><strong>Analytical/Performance Cookies:</strong> Allow us to recognize and count visitors</li>
              <li><strong>Functionality Cookies:</strong> Used to recognize you when you return to our website</li>
              <li><strong>Targeting Cookies:</strong> Record your visit to our website and the pages you have visited</li>
            </ul>
          </div>

          <div className="bg-[#111827]/50 p-8 rounded-lg mb-8 border border-[#FFD700]/20 animate-fade-in-up">
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">Your Rights</h2>
            <p className="text-gray-300">
              Depending on your location, you may have certain rights regarding your personal information, including:
            </p>
            <ul className="list-disc pl-6 mt-4 text-gray-300">
              <li>The right to access and receive a copy of your personal information</li>
              <li>The right to rectify or update your personal information</li>
              <li>The right to erase your personal information</li>
              <li>The right to restrict processing of your personal information</li>
              <li>The right to object to processing of your personal information</li>
              <li>The right to data portability</li>
              <li>The right to withdraw consent</li>
            </ul>
            <p className="text-gray-300 mt-4">
              To exercise these rights, please contact us using the information provided below.
            </p>
          </div>

          <div className="bg-[#111827]/50 p-8 rounded-lg mb-8 border border-[#FFD700]/20 animate-fade-in-up">
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">International Data Transfers</h2>
            <p className="text-gray-300">
              Your information may be transferred to — and maintained on — computers located outside of your state, province, country, or other governmental jurisdiction where the data protection laws may differ. If you are located outside the United States and choose to provide information to us, please note that we transfer the information to the United States and process it there.
            </p>
            <p className="text-gray-300 mt-4">
              By providing your personal information, you consent to this transfer, storing, and processing.
            </p>
          </div>

          <div className="bg-[#111827]/50 p-8 rounded-lg mb-8 border border-[#FFD700]/20 animate-fade-in-up">
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">Children's Privacy</h2>
            <p className="text-gray-300">
              Our service is not directed to anyone under the age of 18. We do not knowingly collect personal information from children under 18. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact us. If we become aware that we have collected personal information from children without verification of parental consent, we take steps to remove that information from our servers.
            </p>
          </div>

          <div className="bg-[#111827]/50 p-8 rounded-lg mb-8 border border-[#FFD700]/20 animate-fade-in-up">
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">Changes to This Privacy Policy</h2>
            <p className="text-gray-300">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
            </p>
          </div>

          <div className="bg-[#111827]/50 p-8 rounded-lg mb-8 border border-[#FFD700]/20 animate-fade-in-up">
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">Contact Us</h2>
            <p className="text-gray-300">
              If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us at:
            </p>
            <p className="text-gray-300 mt-4">
              <strong>Email:</strong> <a href="mailto:privacy@investoboost.com" className="text-[#FFD700] hover:underline">privacy@investoboost.com</a>
            </p>
            <p className="text-gray-300 mt-2">
              <strong>Address:</strong> Investo Boost Headquarters, Financial District, New York, NY 10004, USA
            </p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-400">
            By using our website, you acknowledge that you have read and understood this Privacy Policy.
          </p>
          <div className="mt-6">
            <Link href="/terms" className="text-[#FFD700] hover:underline">
              View our Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 