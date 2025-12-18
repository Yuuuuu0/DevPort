'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LanguageSwitcher } from './language-switcher'
import { motion } from 'framer-motion'
import Image from 'next/image'

export function Header() {
  const pathname = usePathname()
  // 后台页面不显示语言切换器
  const isAdminPage = pathname?.startsWith('/admin') ?? false

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Image
              src="/logo.svg"
              alt="Logo"
              width={32}
              height={32}
              className="object-contain"
            />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent hover:from-primary/80 hover:to-primary/40 transition-all">
              DevPort
            </span>
          </Link>
        </motion.div>
        {!isAdminPage && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <LanguageSwitcher />
          </motion.div>
        )}
      </div>
    </header>
  )
}
