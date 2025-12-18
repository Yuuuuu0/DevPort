import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { I18nProvider } from "@/lib/i18n/context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { DynamicTitle } from "@/components/dynamic-title"

const inter = Inter({ subsets: ["latin"] })

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
      <body className={inter.className}>
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

