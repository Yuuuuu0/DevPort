import type { Metadata } from "next"
import { Chakra_Petch, Manrope } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { I18nProvider } from "@/lib/i18n/context"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { DynamicTitle } from "@/components/dynamic-title"
import { cn } from "@/lib/utils/cn"

const chakra = Chakra_Petch({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-heading",
})

const manrope = Manrope({ 
  subsets: ["latin"], 
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "DevPort - Portfolio",
  description: "My Developer Portfolio",
  icons: {
    icon: '/logo.svg',
    shortcut: '/logo.svg',
    apple: '/logo.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN">
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        manrope.variable,
        chakra.variable
      )}>
        <I18nProvider>
          <DynamicTitle />
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
          <Toaster />
        </I18nProvider>
      </body>
    </html>
  )
}
