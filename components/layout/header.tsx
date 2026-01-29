'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LanguageSwitcher } from '../language-switcher'
import { motion } from 'framer-motion'

export function Header() {
  const pathname = usePathname()
  // 后台页面不显示语言切换器
  const isAdminPage = pathname?.startsWith('/admin') ?? false

  return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-4"
          >
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative w-8 h-8 flex items-center justify-center bg-primary text-primary-foreground font-heading font-bold rounded-sm group-hover:bg-accent group-hover:shadow-accent-glow transition-all duration-300">
                D
              </div>
              <span className="text-xl font-heading font-bold uppercase tracking-wider text-foreground group-hover:text-accent transition-colors duration-300">
                DevPort
                <span className="text-accent ml-1">.</span>
              </span>
            </Link>
          </motion.div>
          {!isAdminPage && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-4"
            >
              <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-muted/50 rounded-full border border-border/50 hover:border-accent/30 transition-colors duration-300">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                </span>
                <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest group-hover:text-accent transition-colors">System Online</span>
              </div>
              <LanguageSwitcher />
            </motion.div>
          )}
        </div>
      </header>
  )
}
