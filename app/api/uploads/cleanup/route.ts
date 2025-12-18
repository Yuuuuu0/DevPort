import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/utils/auth'
import { deleteMultipleFiles } from '@/lib/utils/file-delete'

export async function POST(request: NextRequest) {
  try {
    // 需要鉴权
    const authError = await requireAuth(request)
    if (authError) return authError

    const body = await request.json()
    const { paths } = body as { paths: string[] }

    if (!Array.isArray(paths)) {
      return NextResponse.json(
        { error: 'paths 必须是数组' },
        { status: 400 }
      )
    }

    await deleteMultipleFiles(paths)
    
    return NextResponse.json({ 
      success: true,
      deleted: paths.length 
    })
  } catch (error: any) {
    console.error('Cleanup images error:', error)
    return NextResponse.json(
      { error: error.message || '清理图片失败' },
      { status: 500 }
    )
  }
}
