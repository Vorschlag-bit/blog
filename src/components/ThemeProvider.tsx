"use client"

import { ThemeProvider as NextThemeProvider } from "next-themes"

export function ThemeProvider({children, ...props}: { children: React.ReactNode }) {
    return <NextThemeProvider {...props}>{children}</NextThemeProvider>
}