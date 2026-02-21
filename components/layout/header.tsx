'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LanguageSwitcher } from '../language-switcher'
import { motion } from 'framer-motion'

export function Header() {
  const pathname = usePathname()
  const isAdminPage = pathname?.startsWith('/admin') ?? false

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-14 flex justify-between items-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-lg font-heading font-semibold text-foreground group-hover:text-primary transition-colors">
              DevPort
            </span>
          </Link>
        </motion.div>
        {!isAdminPage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <LanguageSwitcher />
          </motion.div>
        )}
      </div>
    </header>
  )
}
