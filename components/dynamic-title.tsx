'use client'

import { useEffect } from 'react'
import { useI18n } from '@/lib/i18n/context'

/**
 * 动态更新页面标题和 HTML lang 属性的组件
 * 根据当前语言设置更新 document.title 和 html lang
 */
export function DynamicTitle() {
  const { locale, t } = useI18n()

  useEffect(() => {
    // 更新页面标题
    document.title = t.site.title
    
    // 更新 HTML lang 属性
    document.documentElement.lang = locale === 'zh' ? 'zh-CN' : 'en'
    
    // 更新 meta description（如果存在）
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', t.site.description)
    }
  }, [locale, t])

  return null
}
