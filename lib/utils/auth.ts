import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { readAdminConfig } from './read-config'
import { SignJWT, jwtVerify } from 'jose'

const SESSION_COOKIE_NAME = 'admin_session'
const SESSION_SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET || 'devport-secret-key-change-in-production'
)

interface SessionPayload {
  username: string
  exp: number
}

/**
 * 创建 session token
 */
async function createSessionToken(username: string): Promise<string> {
  const token = await new SignJWT({ username })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(SESSION_SECRET)
  
  return token
}

/**
 * 验证 session token
 */
async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SESSION_SECRET)
    // 检查 payload 中是否包含 username
    if (payload && typeof payload === 'object' && 'username' in payload && typeof payload.username === 'string') {
      return {
        username: payload.username,
        exp: payload.exp || 0,
      }
    }
    return null
  } catch (error) {
    return null
  }
}

/**
 * 验证用户凭据
 */
export async function verifyCredentials(username: string, password: string): Promise<boolean> {
  const adminConfig = readAdminConfig()
  
  if (!adminConfig.username || !adminConfig.password) {
    return false
  }
  
  return adminConfig.username === username && adminConfig.password === password
}

/**
 * 登录并设置 session cookie
 */
export async function login(username: string, password: string): Promise<boolean> {
  const isValid = await verifyCredentials(username, password)
  
  if (isValid) {
    const token = await createSessionToken(username)
    const cookieStore = await cookies()
    
    cookieStore.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 小时
      path: '/',
    })
  }
  
  return isValid
}

/**
 * 登出（清除 session cookie）
 */
export async function logout(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}

/**
 * 检查当前用户是否已登录
 */
export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value
  
  if (!token) {
    return false
  }
  
  const payload = await verifySessionToken(token)
  return payload !== null
}

/**
 * 获取当前登录的用户名
 */
export async function getCurrentUser(): Promise<string | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value
  
  if (!token) {
    return null
  }
  
  const payload = await verifySessionToken(token)
  return payload?.username || null
}

/**
 * API 路由鉴权中间件
 * 如果未登录，返回 401 错误
 */
export async function requireAuth(request: NextRequest): Promise<NextResponse | null> {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value
  
  if (!token) {
    return NextResponse.json(
      { error: '未授权，请先登录' },
      { status: 401 }
    )
  }
  
  const payload = await verifySessionToken(token)
  if (!payload) {
    return NextResponse.json(
      { error: '登录已过期，请重新登录' },
      { status: 401 }
    )
  }
  
  return null
}