'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils/cn'

interface TerminalHeroProps {
  className?: string
}

export function TerminalHero({ className }: TerminalHeroProps) {
  return (
    <div className={cn("w-full max-w-2xl mx-auto", className)}>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-3 text-center"
      >
        <h1 className="text-4xl md:text-6xl font-heading font-bold tracking-tight text-foreground">
          Developer &{' '}
          <span className="text-primary">Creator</span>
        </h1>
        <p className="text-base md:text-lg text-muted-foreground max-w-md mx-auto">
          Full-Stack · UI/UX · Open Source
        </p>
      </motion.div>
    </div>
  )
}
