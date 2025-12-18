import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads')

export async function saveUploadedFile(file: File): Promise<string> {
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  // 确保上传目录存在
  await mkdir(UPLOAD_DIR, { recursive: true })

  // 生成唯一文件名
  const timestamp = Date.now()
  const randomStr = Math.random().toString(36).substring(2, 15)
  const ext = file.name.split('.').pop() || 'jpg'
  const filename = `${timestamp}-${randomStr}.${ext}`
  const filepath = join(UPLOAD_DIR, filename)

  await writeFile(filepath, buffer)

  // 使用 API 路由提供文件，解决 standalone 模式下静态文件无法访问的问题
  return `/api/uploads/${filename}`
}

