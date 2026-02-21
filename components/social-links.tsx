'use client'

import Link from 'next/link'
import type { SocialLink } from '@/lib/config'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils/cn'
import { Github, Mail, Send } from 'lucide-react'

const iconMap = {
  github: Github,
  email: Mail,
  telegram: Send,
} as const

interface SocialLinksProps {
  className?: string
  socialLinks: SocialLink[]
}

export function SocialLinks({ className, socialLinks }: SocialLinksProps) {
  const validLinks = socialLinks.filter(link => link.url?.trim())
  if (validLinks.length === 0) return null

  return (
    <div className={cn('flex items-center justify-center gap-3', className)}>
      {validLinks.map((link, index) => {
        const Icon = iconMap[link.type]
        return (
          <motion.div
            key={link.type}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Link
              href={link.url}
              target={link.type === 'email' ? undefined : '_blank'}
              rel={link.type === 'email' ? undefined : 'noopener noreferrer'}
              className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground hover:bg-muted"
              aria-label={link.label}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{link.label}</span>
            </Link>
          </motion.div>
        )
      })}
    </div>
  )
}
