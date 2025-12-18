'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row justify-center items-center gap-2 text-sm text-muted-foreground"
        >
          <span>© {currentYear} DevPort. All rights reserved.</span>
          <span className="hidden sm:inline">&</span>
          <Link
            href="https://github.com/Yuuuuu0/DevPort"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors"
          >
            Mark By Yu
          </Link>
        </motion.div>
      </div>
    </footer>
  )
}
