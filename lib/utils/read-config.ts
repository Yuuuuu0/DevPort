import { readFileSync, existsSync, writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'

interface SocialConfig {
  github?: string
  email?: string
  telegram?: string
}

interface AdminConfig {
  username?: string
  password?: string
}

/**
 * 默认配置文件内容模板
 */
const DEFAULT_CONFIG_CONTENT = `# 联系方式配置文件
# 填写你的联系方式，留空则不会显示对应的联系方式

# GitHub 链接（完整 URL，例如：https://github.com/yourusername）
SOCIAL_GITHUB=

# 邮箱地址（会自动添加 mailto: 前缀）
SOCIAL_EMAIL=

# Telegram 用户名或链接（如果只提供用户名，会自动添加 https://t.me/ 前缀）
SOCIAL_TELEGRAM=

# 后台管理账号密码配置
# 用户名（用于登录后台）
ADMIN_USERNAME=admin

# 密码（用于登录后台）
ADMIN_PASSWORD=
`

/**
 * 读取配置文件路径（容器或本地）
 */
function getConfigPath(): string {
  const containerPath = '/app/config/.env'
  const localPath = join(process.cwd(), 'config', '.env')
  return existsSync(containerPath) ? containerPath : localPath
}

/**
 * 读取配置文件内容
 */
function readConfigFile(): string {
  const configPath = getConfigPath()
  
  // 如果配置文件不存在，自动创建
  if (!existsSync(configPath)) {
    try {
      const configDir = dirname(configPath)
      if (!existsSync(configDir)) {
        mkdirSync(configDir, { recursive: true })
      }
      writeFileSync(configPath, DEFAULT_CONFIG_CONTENT, 'utf-8')
    } catch (error) {
      return ''
    }
  }
  
  try {
    return readFileSync(configPath, 'utf-8')
  } catch (error) {
    return ''
  }
}

/**
 * 解析配置文件中的键值对
 */
function parseConfigValue(content: string, key: string): string | undefined {
  const lines = content.split('\n')
  
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) {
      continue
    }
    
    const match = trimmed.match(/^([^=]+)=(.*)$/)
    if (match) {
      const configKey = match[1].trim()
      const value = match[2].trim().replace(/^["']|["']$/g, '')
      
      if (configKey === key && value) {
        return value
      }
    }
  }
  
  return undefined
}

/**
 * 从配置文件读取联系方式配置
 * 配置文件路径：/app/config/.env（容器内）或 ./config/.env（本地开发）
 * 如果配置文件不存在，会自动创建
 */
export function readSocialConfig(): SocialConfig {
  const config: SocialConfig = {}
  const content = readConfigFile()
  
  config.github = parseConfigValue(content, 'SOCIAL_GITHUB')
  config.email = parseConfigValue(content, 'SOCIAL_EMAIL')
  config.telegram = parseConfigValue(content, 'SOCIAL_TELEGRAM')
  
  return config
}

/**
 * 从配置文件读取后台账号密码配置
 */
export function readAdminConfig(): AdminConfig {
  const config: AdminConfig = {}
  const content = readConfigFile()
  
  config.username = parseConfigValue(content, 'ADMIN_USERNAME')
  config.password = parseConfigValue(content, 'ADMIN_PASSWORD')
  
  return config
}
