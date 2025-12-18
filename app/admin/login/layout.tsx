'use client'

import { Toaster } from "@/components/ui/toaster"
import { useEffect } from 'react'

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    // 隐藏 header 和 footer
    const style = document.createElement('style')
    style.textContent = `
      body > div > div > header,
      body > div > div > footer {
        display: none !important;
      }
      body > div > div > main {
        padding-top: 0 !important;
        padding-bottom: 0 !important;
      }
    `
    document.head.appendChild(style)
    
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  return (
    <>
      {children}
      <Toaster />
    </>
  )
}