import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import AuthHydrator from "@/components/AuthHydrator";
import ReduxProvider from "@/providers/ReduxProvider";
import WhatsAppButton from "@/components/Application/Website/WhatsAppButton";
import GoogleAnalytics from "@/components/Application/Website/GoogleAnalytics";

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
  description: "Handcrafted designer sarees & bridal couture — curated with elegance and rooted in Indian textile heritage.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ReduxProvider>
          <GoogleAnalytics />
        {children}
        <WhatsAppButton />
        </ReduxProvider>
      </body>
    </html>
  );
}
