import AppSidebar from '@/components/Application/Admin/AppSidebar';
import ThemeProvider from '@/components/Application/Admin/ThemeProvider';
import Topbar from '@/components/Application/Admin/Topbar';
import ReactQueryProvider from '@/components/providers/ReactQueryProvider';
import { SidebarProvider } from '@/components/ui/sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Copyright } from 'lucide-react';
import Link from 'next/link';
import React from 'react'

import { ReactNode } from 'react';

const layout = ({ children }: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
    <ReactQueryProvider>

    <TooltipProvider>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange >
    <SidebarProvider>
        <AppSidebar />
        <main className="md:w-[calc(100vw-16rem)] w-full">
          <div className="pt-[70px] md:px-8 px-5 min-h-[calc(100vh-40px)] pb-10">
            <Topbar />
            {children}
          </div>
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-xs text-rose-200/80 gap-2 text-center text-align-center">
           <p></p>
           <span><br />
           <p>© {new Date().getFullYear()} ACOSSA. All rights reserved.</p>Designed with ❤️ in India</span>
           <p>Developed by <Link href='https://www.thinqit.in/'>ThinQit Media</Link></p>
        </div>
        </main>
      </SidebarProvider>
    </ThemeProvider>
    </TooltipProvider>
    </ReactQueryProvider>
    </>
  )
}

export default layout
