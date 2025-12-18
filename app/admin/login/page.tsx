'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!username || !password) {
      toast({
        title: '错误',
        description: '请输入用户名和密码',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast({
          title: '登录失败',
          description: data.error || '用户名或密码错误',
          variant: 'destructive',
        })
        return
      }

      toast({
        title: '成功',
        description: '登录成功',
      })

      router.push('/admin')
      router.refresh()
    } catch (error: any) {
      toast({
        title: '登录失败',
        description: error.message || '网络错误，请稍后重试',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[100vh] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8" style={{ marginTop: 0 }}>
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            后台登录
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            请输入您的账号密码
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <Label htmlFor="username" className="sr-only">
                用户名
              </Label>
              <Input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                className="rounded-md"
                placeholder="用户名"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
              />
            </div>
            <div>
              <Label htmlFor="password" className="sr-only">
                密码
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="rounded-md"
                placeholder="密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  登录中...
                </>
              ) : (
                '登录'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}