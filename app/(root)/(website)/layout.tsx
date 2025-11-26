import Footer from '@/components/Application/Website/Footer'
import Header from '@/components/Application/Website/Header'
import React, { ReactNode } from 'react'
import ReduxProvider from '@/providers/ReduxProvider'   // <-- import provider
import { ToastContainer } from 'react-toastify'
import ReactQueryProvider from '@/components/providers/ReactQueryProvider'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <ReduxProvider>
      <ReactQueryProvider>

      
      <div>
        <Header />
        <main className="mt-20">{children}</main>
        <Footer />
        <ToastContainer />
      </div>
      </ReactQueryProvider>
    </ReduxProvider>
  )
}
