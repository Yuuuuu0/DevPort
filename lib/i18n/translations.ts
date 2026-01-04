export type Locale = 'zh' | 'en'

export const translations = {
  zh: {
    site: {
      title: 'DevPort - 作品展示',
      description: '我的作品展示网站',
    },
    common: {
      viewDemo: '查看演示',
      noProjects: '暂无作品展示',
      projects: '作品展示',
      contact: '联系方式',
      backToProjects: '返回项目列表',
      viewDetails: '查看详情',
      businessDescription: '欢迎咨询项目合作，提供专业的开发服务与技术解决方案',
    },
    admin: {
      // 后台不需要多语言，但保留结构以便扩展
    },
  },
  en: {
    site: {
      title: 'DevPort - Portfolio',
      description: 'My Developer Portfolio',
    },
    common: {
      viewDemo: 'View Demo',
      noProjects: 'No projects available',
      projects: 'Portfolio',
      contact: 'Contact',
      backToProjects: 'Back to Projects',
      viewDetails: 'View Details',
      businessDescription: 'Open for project collaboration. Providing professional development services and technical solutions.',
    },
    admin: {
      // 后台不需要多语言，但保留结构以便扩展
    },
  },
} as const

export const defaultLocale: Locale = 'en'

