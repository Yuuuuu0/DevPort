import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads')

interface RouteParams {
  params: Promise<{ filename: string }>
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { filename } = await params

    // 安全验证：防止路径遍历攻击
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return NextResponse.json({ error: '非法文件名' }, { status: 400 })
    }

    const filepath = join(UPLOAD_DIR, filename)

    // 检查文件是否存在
    if (!existsSync(filepath)) {
      return NextResponse.json({ error: '文件不存在' }, { status: 404 })
    }

    // 读取文件
    const fileBuffer = await readFile(filepath)

    // 根据文件扩展名设置 Content-Type
    const ext = filename.split('.').pop()?.toLowerCase()
    const contentTypeMap: Record<string, string> = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      gif: 'image/gif',
      webp: 'image/webp',
      svg: 'image/svg+xml',
    }
    const contentType = contentTypeMap[ext || ''] || 'application/octet-stream'

    // 返回文件，设置适当的响应头
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('Serve file error:', error)
    return NextResponse.json({ error: '读取文件失败' }, { status: 500 })
  }
}
