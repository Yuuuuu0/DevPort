/**
 * 网站配置文件
 * 联系方式从环境变量读取
 */

export interface SocialLink {
  type: 'github' | 'email' | 'telegram'
  label: string
  url: string
  icon?: string // 可选的自定义图标
}

export interface SiteConfig {
  socialLinks: SocialLink[]
}

/**
 * 从环境变量构建联系方式配置
 * 如果某个环境变量未设置，则对应的联系方式不会显示
 */
function buildSocialLinks(): SocialLink[] {
  const links: SocialLink[] = []

  // GitHub
  const githubUrl = process.env.NEXT_PUBLIC_SOCIAL_GITHUB
  if (githubUrl && githubUrl.trim()) {
    links.push({
      type: 'github',
      label: 'GitHub',
      url: githubUrl.trim(),
    })
  }

  // Email
  const emailUrl = process.env.NEXT_PUBLIC_SOCIAL_EMAIL
  if (emailUrl && emailUrl.trim()) {
    // 如果 email 不是 mailto: 开头，自动添加
    const email = emailUrl.trim().startsWith('mailto:')
      ? emailUrl.trim()
      : `mailto:${emailUrl.trim()}`
    links.push({
      type: 'email',
      label: 'Email',
      url: email,
    })
  }

  // Telegram
  const telegramUrl = process.env.NEXT_PUBLIC_SOCIAL_TELEGRAM
  if (telegramUrl && telegramUrl.trim()) {
    // 如果 telegram 不是完整 URL，自动添加 https://t.me/
    let telegram = telegramUrl.trim()
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

export const siteConfig: SiteConfig = {
  socialLinks: buildSocialLinks(),
}
