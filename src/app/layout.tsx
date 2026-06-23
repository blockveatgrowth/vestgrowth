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

const siteUrl = process.env.NEXTAUTH_URL || 'https://vestgrowth.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Investo Boost — Premium Crypto Investment Platform",
    template: "%s | Investo Boost",
  },
  description:
    "Investo Boost is a premium crypto investment platform offering daily profits of 4–8%, multi-level referral commissions, and automated trading. Start growing your wealth today.",
  keywords: [
    "Investo Boost",
    "investoboost",
    "crypto investment platform",
    "daily crypto profits",
    "bitcoin investment",
    "crypto trading platform",
    "passive income crypto",
    "crypto referral program",
    "automated crypto trading",
    "invest in crypto",
    "crypto profit daily",
    "best crypto investment 2024",
    "investo boost platform",
  ],
  authors: [{ name: "Investo Boost Team" }],
  creator: "Investo Boost",
  publisher: "Investo Boost",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Investo Boost",
    title: "Investo Boost — Premium Crypto Investment Platform",
    description:
      "Earn daily profits of 4–8% on your crypto investments. Join Investo Boost — the trusted platform for automated crypto trading and passive income.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Investo Boost — Premium Crypto Investment Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Investo Boost — Premium Crypto Investment Platform",
    description:
      "Earn daily profits of 4–8% on your crypto investments. Join Investo Boost today.",
    images: ["/images/og-image.jpg"],
    creator: "@investoboost",
  },
  alternates: {
    canonical: siteUrl,
  },
  category: "finance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const fontClass = process.env.NODE_ENV === 'development' ? interLocal.variable : inter.variable;
  
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    "name": "Investo Boost",
    "description": "Premium crypto investment platform offering daily profits and automated trading",
    "url": siteUrl,
    "logo": `${siteUrl}/images/logo.jpeg`,
    "sameAs": [],
    "offers": {
      "@type": "Offer",
      "description": "Crypto investment plans with daily profit distribution",
      "priceCurrency": "USD",
    },
  };

  return (
    <html lang="en" suppressHydrationWarning className={fontClass}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="canonical" href={siteUrl} />
        <meta name="theme-color" content="#FFD700" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body>
        <AuthProvider>
          {children}
          <Toaster richColors position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
