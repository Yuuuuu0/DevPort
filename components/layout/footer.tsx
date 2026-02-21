'use client'

import Link from 'next/link'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full border-t bg-background mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-sm text-muted-foreground">
          <span>© {currentYear} DevPort</span>
          <Link
            href="https://github.com/Yuuuuu0/DevPort"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            GitHub
          </Link>
        </div>
      </div>
    </footer>
  )
}
