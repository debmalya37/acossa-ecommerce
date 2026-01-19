import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import logo from "./logo.jpg";

import ReduxProvider from "@/providers/ReduxProvider";
import WhatsAppButton from "@/components/Application/Website/WhatsAppButton";
import GTMPageView from "@/components/GTMPageView";
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Acossa Enterprise - Handcrafted Designer Sarees & Bridal Couture",
  description:
    "Handcrafted designer sarees & bridal couture — curated with elegance and rooted in Indian textile heritage.",
  icons: logo.src,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* ===============================
            Google Analytics 4 (gtag.js)
            =============================== */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-Q3EKPEFH37"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-Q3EKPEFH37');
          `}
        </Script>

        {/* ===============================
            Meta (Facebook) Pixel
            =============================== */}
        <Script
          id="facebook-pixel"
          strategy="afterInteractive"
        >
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}
            (window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');

            fbq('init', '863583602933465');
            fbq('track', 'PageView');
          `}
        </Script>
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {/* Note: The GTM <noscript> tag has been removed as gtag.js does not require it */}

        {/* ===============================
            Meta Pixel (NOSCRIPT)
            =============================== */}
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=863583602933465&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>

        <ReduxProvider>
          <Suspense fallback={null}>
            {/* SPA route tracking - Verify this component supports GA4/gtag logic */}
            <GTMPageView />

            {/* App content */}
            {children}

            <WhatsAppButton />
          </Suspense>
        </ReduxProvider>
      </body>
    </html>
  );
}