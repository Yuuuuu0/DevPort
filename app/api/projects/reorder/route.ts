import { NextRequest, NextResponse } from 'next/server'
import { projectRepository } from '@/lib/repositories/project-repository'
import { requireAuth } from '@/lib/utils/auth'

export async function POST(request: NextRequest) {
  try {
    // 需要鉴权
    const authError = await requireAuth(request)
    if (authError) return authError
    
    const body = await request.json()
    const { orders } = body as { orders: { id: string; order: number }[] }

    if (!Array.isArray(orders)) {
      return NextResponse.json(
        { error: 'orders 必须是数组' },
        { status: 400 }
      )
    }

    await projectRepository.updateOrders(orders)
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Reorder projects error:', error)
    return NextResponse.json(
      { error: error.message || '更新排序失败' },
      { status: 400 }
    )
  }
}
