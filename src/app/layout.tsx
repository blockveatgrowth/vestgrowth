import type { Metadata } from "next";
import { Inter as InterGoogleFont } from 'next/font/google';
import localFont from 'next/font/local';
import "./globals.css";
import { Toaster } from "sonner";
import AuthProvider from "@/components/auth/AuthProvider";

const inter = InterGoogleFont({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  fallback: ['system-ui', 'Arial', 'sans-serif']
});

const interLocal = localFont({
  src: [
    { path: '../assets/fonts/Inter-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../assets/fonts/Inter-Medium.woff2',  weight: '500', style: 'normal' },
    { path: '../assets/fonts/Inter-Bold.woff2',    weight: '700', style: 'normal' },
  ],
  variable: '--font-inter-local',
  fallback: ['system-ui', 'Arial', 'sans-serif']
});

const siteUrl = process.env.NEXTAUTH_URL || 'https://investoboost.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Investo Boost — Earn Daily From Live Crypto Trades",
    template: "%s | Investo Boost",
  },
  description:
    "Investo Boost is a trusted crypto investment platform. Earn daily profits from live crypto trades with 40–75% profit share, multi-level referral rewards, and instant withdrawals. Join thousands of investors today.",
  keywords: [
    "Investo Boost",
    "InvestoBoost",
    "investo boost platform",
    "investo boost crypto",
    "investoboost.com",
    "crypto investment platform",
    "daily crypto profits",
    "bitcoin daily profit",
    "ethereum investment",
    "crypto passive income",
    "crypto trading platform 2024",
    "automated crypto trading",
    "crypto referral program",
    "invest in crypto daily",
    "best crypto investment platform",
    "crypto profit sharing",
    "usdt investment platform",
    "crypto income platform",
    "investo boost login",
    "investo boost register",
    "investo boost review",
  ],
  authors: [{ name: "Investo Boost" }],
  creator: "Investo Boost",
  publisher: "Investo Boost",
  applicationName: "Investo Boost",
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
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
    title: "Investo Boost — Earn Daily From Live Crypto Trades",
    description:
      "Join Investo Boost and earn daily profits from live crypto trades. Plans starting from $50 with 40–75% profit share. Instant referral bonuses and daily withdrawals.",
    images: [
      {
        url: `${siteUrl}/images/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Investo Boost — Crypto Investment Platform",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@investoboost",
    creator: "@investoboost",
    title: "Investo Boost — Earn Daily From Live Crypto Trades",
    description:
      "Earn daily profits from live crypto trades. Join Investo Boost — plans from $50, 40–75% profit share, instant referral bonuses.",
    images: [`${siteUrl}/images/og-image.jpg`],
  },
  alternates: {
    canonical: siteUrl,
    languages: {
      'en-US': siteUrl,
    },
  },
  category: "finance",
  classification: "Crypto Investment Platform",
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || '',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const fontClass = process.env.NODE_ENV === 'development' ? interLocal.variable : inter.variable;

  // Organization structured data
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    "@id": `${siteUrl}/#organization`,
    "name": "Investo Boost",
    "alternateName": ["InvestoBoost", "Investo Boost Platform"],
    "description": "Investo Boost is a premium crypto investment platform offering daily profits from live crypto trades, multi-level referral commissions, and automated trading across BTC, ETH, BNB, SOL, and XRP pairs.",
    "url": siteUrl,
    "logo": {
      "@type": "ImageObject",
      "url": `${siteUrl}/images/logo.jpeg`,
      "width": 200,
      "height": 200,
    },
    "image": `${siteUrl}/images/og-image.jpg`,
    "foundingDate": "2024",
    "areaServed": "Worldwide",
    "serviceType": "Crypto Investment",
    "offers": [
      {
        "@type": "Offer",
        "name": "Starter Plan",
        "description": "40% of daily trade profit. Investment range $50–$199.",
        "priceCurrency": "USD",
        "price": "50",
        "priceSpecification": {
          "@type": "PriceSpecification",
          "minPrice": "50",
          "maxPrice": "199",
          "priceCurrency": "USD",
        },
      },
      {
        "@type": "Offer",
        "name": "Growth Plan",
        "description": "50% of daily trade profit. Investment range $200–$499.",
        "priceCurrency": "USD",
        "price": "200",
      },
      {
        "@type": "Offer",
        "name": "Advanced Plan",
        "description": "60% of daily trade profit. Investment range $500–$1,499.",
        "priceCurrency": "USD",
        "price": "500",
      },
      {
        "@type": "Offer",
        "name": "Elite Plan",
        "description": "75% of daily trade profit. Investment range $1,500–$5,000.",
        "priceCurrency": "USD",
        "price": "1500",
      },
    ],
    "sameAs": [
      `${siteUrl}`,
    ],
  };

  // WebSite structured data (enables Google Sitelinks Search Box)
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    "url": siteUrl,
    "name": "Investo Boost",
    "description": "Earn daily from live crypto trades with Investo Boost",
    "publisher": {
      "@id": `${siteUrl}/#organization`,
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${siteUrl}/auth/signup?ref={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  // FAQ structured data (boosts rich results in Google)
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is Investo Boost?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Investo Boost is a crypto investment platform that executes daily live trades on BTC, ETH, BNB, SOL, and XRP. Users earn a percentage of each day's trade profit based on their investment plan.",
        },
      },
      {
        "@type": "Question",
        "name": "How does Investo Boost generate daily profits?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Each day, the Investo Boost algorithm executes a real crypto trade using live market data. The profit or loss from that trade is distributed to investors proportionally based on their plan's profit-share percentage (40%, 50%, 60%, or 75%).",
        },
      },
      {
        "@type": "Question",
        "name": "What are the investment plans on Investo Boost?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Investo Boost offers four plans: Starter ($50–$199, 40% profit share), Growth ($200–$499, 50%), Advanced ($500–$1,499, 60%), and Elite ($1,500–$5,000, 75% profit share).",
        },
      },
      {
        "@type": "Question",
        "name": "Does Investo Boost have a referral program?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Investo Boost has a 5-level referral program. You earn instant bonuses when your referrals deposit, and you also earn a daily percentage of their daily profits — creating a passive income stream from your network.",
        },
      },
      {
        "@type": "Question",
        "name": "How do I withdraw from Investo Boost?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You can request a withdrawal from your dashboard once your balance meets the minimum threshold. Withdrawals are processed via USDT (TRC20, ERC20, or BEP20 networks).",
        },
      },
    ],
  };

  return (
    <html lang="en" suppressHydrationWarning className={fontClass}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
        <link rel="canonical" href={siteUrl} />
        <meta name="theme-color" content="#FFD700" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Investo Boost" />
        <link rel="apple-touch-icon" href="/images/logo.jpeg" />
        <meta name="msapplication-TileColor" content="#FFD700" />
        <meta name="msapplication-TileImage" content="/images/logo.jpeg" />
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
