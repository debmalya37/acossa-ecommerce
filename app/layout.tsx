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
            Google Tag Manager (HEAD)
           =============================== */}
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
        {/* ===============================
            Google Tag Manager (NOSCRIPT)
           =============================== */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-59MFV9VF"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

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
            {/* SPA route tracking */}
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
