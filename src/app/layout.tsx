import type { Metadata } from "next";
import { Inter as InterGoogleFont } from 'next/font/google';
import localFont from 'next/font/local';
import "./globals.css";
import { Toaster } from "sonner";
import AuthProvider from "@/components/auth/AuthProvider";

// Google font with fallback mechanism
const inter = InterGoogleFont({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  fallback: ['system-ui', 'Arial', 'sans-serif']
});

// Local fallback font
const interLocal = localFont({
  src: [
    {
      path: '../assets/fonts/Inter-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../assets/fonts/Inter-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../assets/fonts/Inter-Bold.woff2',
      weight: '700',
      style: 'normal',
    }
  ],
  variable: '--font-inter-local',
  fallback: ['system-ui', 'Arial', 'sans-serif']
});

export const metadata: Metadata = {
  title: "Investo Boost Platform - Invest and Grow",
  description: "Boost your investments with our platform offering daily profits, referral commissions, and more",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Try to use Google font, fall back to system fonts
  const fontClass = process.env.NODE_ENV === 'development' ? interLocal.variable : inter.variable;
  
  return (
    <html lang="en" suppressHydrationWarning className={fontClass}>
      <body>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
