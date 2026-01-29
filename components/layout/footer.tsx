'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-mono text-muted-foreground"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-accent rounded-sm shadow-accent-glow" />
            <span>DEVPORT_V1.0</span>
          </div>
          
          <div className="flex items-center gap-6">
            <span>© {currentYear}</span>
            <span className="text-border">|</span>
            <Link
              href="https://github.com/Yuuuuu0/DevPort"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent transition-colors duration-300 uppercase tracking-wider hover:shadow-accent-glow"
            >
              Mark By Yu
            </Link>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
