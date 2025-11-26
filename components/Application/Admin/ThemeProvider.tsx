"use client"

import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from "next-themes"
import { ReactNode } from "react"

const ThemeProvider = ({ children, ...props }: ThemeProviderProps & { children: ReactNode }) => {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

export default ThemeProvider
