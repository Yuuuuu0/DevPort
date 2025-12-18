/**
 * 网站配置文件
 * 联系方式从 config/.env 文件读取
 */

import { readSocialConfig } from './utils/read-config'

export interface SocialLink {
  type: 'github' | 'email' | 'telegram'
  label: string
  url: string
  icon?: string
}

/**
 * 从配置文件构建联系方式配置
 * 如果某个配置项未设置，则对应的联系方式不会显示
 * 这个函数在服务器端调用，会在运行时读取配置文件
 */
export function buildSocialLinks(): SocialLink[] {
  const links: SocialLink[] = []
  const config = readSocialConfig()

  // GitHub
  if (config.github && config.github.trim()) {
    links.push({
      type: 'github',
      label: 'GitHub',
      url: config.github.trim(),
    })
  }

  // Email
  if (config.email && config.email.trim()) {
    // 如果 email 不是 mailto: 开头，自动添加
    const email = config.email.trim().startsWith('mailto:')
      ? config.email.trim()
      : `mailto:${config.email.trim()}`
    links.push({
      type: 'email',
      label: 'Email',
      url: email,
    })
  }

  // Telegram
  if (config.telegram && config.telegram.trim()) {
    // 如果 telegram 不是完整 URL，自动添加 https://t.me/
    let telegram = config.telegram.trim()
    if (!telegram.startsWith('http')) {
      // 移除 @ 符号（如果有）
      const username = telegram.replace(/^@/, '')
      telegram = `https://t.me/${username}`
    }
    links.push({
      type: 'telegram',
      label: 'Telegram',
      url: telegram,
    })
  }

  return links
}
