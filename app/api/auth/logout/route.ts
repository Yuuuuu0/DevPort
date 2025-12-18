import { NextRequest, NextResponse } from 'next/server'
import { logout } from '@/lib/utils/auth'

export async function POST(request: NextRequest) {
  try {
    await logout()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: '登出失败' },
      { status: 500 }
    )
  }
}