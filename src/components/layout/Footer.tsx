import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#0D1117] border-t border-[#FFD700]/20 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center space-x-2">
              <div className="relative w-10 h-10 rounded-full overflow-hidden">
                <Image 
                  src="/images/logo.jpeg" 
                  alt="Investo Boost Logo" 
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </div>
              {/* <span className="font-bold text-xl bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">
                Investo Boost
              </span> */}
            </div>
            <p className="mt-4 text-sm text-gray-400">
              A premium crypto investment platform that takes the complexity out of digital asset trading.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-3 text-[#FFD700]">Platform</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm text-gray-400 hover:text-[#FFD700] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm text-gray-400 hover:text-[#FFD700] transition-colors">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3 text-[#FFD700]">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-sm text-gray-400 hover:text-[#FFD700] transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-gray-400 hover:text-[#FFD700] transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3 text-[#FFD700]">Contact Us</h3>
            <ul className="space-y-2">
             
              <li>
                <a href="mailto:support@investoboost.com" className="text-sm text-gray-400 hover:text-[#FFD700] transition-colors">
                  support@investoboost.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-[#FFD700]/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              &copy; March, {new Date().getFullYear()} Investo Boost. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/terms" className="text-sm text-gray-400 hover:text-[#FFD700] transition-colors">
                Terms
              </Link>
              <Link href="/privacy" className="text-sm text-gray-400 hover:text-[#FFD700] transition-colors">
                Privacy
              </Link>
              <Link href="/cookies" className="text-sm text-gray-400 hover:text-[#FFD700] transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 