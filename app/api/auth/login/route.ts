import { NextRequest, NextResponse } from 'next/server'
import { login } from '@/lib/utils/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password } = body

    if (!username || !password) {
      return NextResponse.json(
        { error: '用户名和密码不能为空' },
        { status: 400 }
      )
    }

    const isValid = await login(username, password)

    if (!isValid) {
      return NextResponse.json(
        { error: '用户名或密码错误' },
        { status: 401 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: '登录失败' },
      { status: 500 }
    )
  }
}