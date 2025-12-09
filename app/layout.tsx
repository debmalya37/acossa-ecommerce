import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import logo from "./logo.jpg";

import ReduxProvider from "@/providers/ReduxProvider";
import WhatsAppButton from "@/components/Application/Website/WhatsAppButton";
import GTMPageView from "@/components/GTMPageView";
import { Suspense } from "react";
// ❌ REMOVE GoogleAnalytics if GA is handled via GTM
// import GoogleAnalytics from "@/components/Application/Website/GoogleAnalytics";

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
        {/* ✅ Google Tag Manager — highest possible in <head> */}
        <Script
          id="gtm-head"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-59MFV9VF');
            `,
          }}
        />
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {/* ✅ Google Tag Manager (noscript) – immediately after <body> */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-59MFV9VF"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

        <ReduxProvider>
          <Suspense fallback={null}>
          <GTMPageView />
          {/* ✅ All app content */}
          {children}
          <WhatsAppButton />
          </Suspense>
        </ReduxProvider>
      </body>
    </html>
  );
}
