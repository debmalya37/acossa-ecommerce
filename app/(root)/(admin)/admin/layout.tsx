import AppSidebar from '@/components/Application/Admin/AppSidebar';
import ThemeProvider from '@/components/Application/Admin/ThemeProvider';
import Topbar from '@/components/Application/Admin/Topbar';
import ReactQueryProvider from '@/components/providers/ReactQueryProvider';
import { SidebarProvider } from '@/components/ui/sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Copyright } from 'lucide-react';
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
          <div className="border-t h-[40px] flex justify-center items-center bg-gray-50 dark:bg-background text-sm">
            <Copyright className="h-3 w-3" /> {new Date().getFullYear()} ThiqIt. All Rights Reserved
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
