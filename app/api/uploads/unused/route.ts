import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/utils/auth'
import { readdir } from 'fs/promises'
import { join } from 'path'
import { prisma } from '@/lib/prisma'

const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads')

export async function GET(request: NextRequest) {
  try {
    // 需要鉴权
    const authError = await requireAuth(request)
    if (authError) return authError

    // 获取所有上传的文件
    let uploadedFiles: string[] = []
    try {
      const files = await readdir(UPLOAD_DIR)
      uploadedFiles = files
        .filter(file => {
          // 只包含图片文件
          const ext = file.split('.').pop()?.toLowerCase()
          return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(ext || '')
        })
        .map(file => `/api/uploads/${file}`)
    } catch (error) {
      // 如果目录不存在，返回空数组
      console.error('Error reading upload directory:', error)
    }

    // 获取所有项目中使用的图片
    const projects = await prisma.project.findMany({
      select: {
        images: true,
        coverImage: true,
      },
    })

    const usedImages = new Set<string>()
    projects.forEach(project => {
      // 解析 images JSON 字符串
      try {
        const images = JSON.parse(project.images)
        images.forEach((img: string) => usedImages.add(img))
      } catch (e) {
        // 忽略解析错误
      }
      if (project.coverImage) {
        usedImages.add(project.coverImage)
      }
    })

    // 找出未使用的图片
    const unusedImages = uploadedFiles.filter(file => !usedImages.has(file))

    return NextResponse.json({ unusedImages })
  } catch (error) {
    console.error('Get unused images error:', error)
    const message = error instanceof Error ? error.message : undefined
    return NextResponse.json(
      { error: message || '获取未使用图片失败' },
      { status: 500 }
    )
  }
}
