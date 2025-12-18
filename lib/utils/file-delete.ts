import { unlink } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

const PUBLIC_DIR = join(process.cwd(), 'public')

export async function deleteFile(filePath: string): Promise<void> {
  // 确保路径是相对路径，防止路径遍历攻击
  if (filePath.startsWith('/')) {
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

