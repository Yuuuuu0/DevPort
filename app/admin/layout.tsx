'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)
  
  useEffect(() => {
    // 如果是登录页面，不需要检查认证
    if (pathname === '/admin/login') {
      setIsChecking(false)
      return
    }
    
    // 检查登录状态
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check')
        if (!response.ok) {
          // 未登录，重定向到登录页
          router.push('/admin/login')
          return
        }
        setIsChecking(false)
      } catch (error) {
        // 检查失败，重定向到登录页
        router.push('/admin/login')
      }
    }
    
    checkAuth()
  }, [pathname, router])
  
  // 如果是登录页面，直接返回
  if (pathname === '/admin/login') {
    return <>{children}</>
  }
  
  // 正在检查登录状态时不显示内容，避免闪烁
  if (isChecking) {
    return null
  }
  
  return <>{children}</>
}
