import { unlink } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

const PUBLIC_DIR = join(process.cwd(), 'public')

export async function deleteFile(filePath: string): Promise<void> {
  // 处理 API 路由路径格式：/api/uploads/filename -> uploads/filename
  // 也兼容旧格式：/uploads/filename -> uploads/filename
  if (filePath.startsWith('/api/uploads/')) {
    filePath = filePath.replace('/api/uploads/', 'uploads/')
  } else if (filePath.startsWith('/uploads/')) {
    filePath = filePath.replace('/uploads/', 'uploads/')
  } else if (filePath.startsWith('/')) {
    filePath = filePath.substring(1)
  }
  
  const fullPath = join(PUBLIC_DIR, filePath)
  
  // 确保文件在 public 目录内
  if (!fullPath.startsWith(PUBLIC_DIR)) {
    throw new Error('Invalid file path')
  }

  if (existsSync(fullPath)) {
    await unlink(fullPath)
  }
}

export async function deleteMultipleFiles(filePaths: string[]): Promise<void> {
  await Promise.all(filePaths.map(path => deleteFile(path).catch(err => {
    console.error(`Failed to delete file ${path}:`, err)
  })))
}
