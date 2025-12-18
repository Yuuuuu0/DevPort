'use client'

import Link from 'next/link'
import { LanguageSwitcher } from './language-switcher'

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          DevPort
        </Link>
        <LanguageSwitcher />
      </div>
    </header>
  )
}

