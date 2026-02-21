import { readSocialConfig } from './utils/read-config'

export interface SocialLink {
  type: 'github' | 'email' | 'telegram'
  label: string
  url: string
  icon?: string
}

function normalizeUrl(value: string, type: SocialLink['type']): string {
  const trimmed = value.trim()
  if (!trimmed) return ''
  if (type === 'email') {
    return trimmed.startsWith('mailto:') ? trimmed : `mailto:${trimmed}`
  }
  if (type === 'telegram' && !trimmed.startsWith('http')) {
    return `https://t.me/${trimmed.replace(/^@/, '')}`
  }
  return trimmed
}

export function buildSocialLinks(): SocialLink[] {
  const config = readSocialConfig()
  const entries: { type: SocialLink['type']; label: string; raw?: string }[] = [
    { type: 'github', label: 'GitHub', raw: config.github },
    { type: 'email', label: 'Email', raw: config.email },
    { type: 'telegram', label: 'Telegram', raw: config.telegram },
  ]
  return entries
    .filter(e => e.raw?.trim())
    .map(e => ({ type: e.type, label: e.label, url: normalizeUrl(e.raw!, e.type) }))
}
