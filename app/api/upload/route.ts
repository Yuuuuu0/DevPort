import { NextRequest, NextResponse } from 'next/server'
import { saveUploadedFile } from '@/lib/utils/upload'
import { deleteFile } from '@/lib/utils/file-delete'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: '未提供文件' }, { status: 400 })
    }

    const path = await saveUploadedFile(file)
    return NextResponse.json({ path })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: '上传失败' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { path } = body

    if (!path) {
      return NextResponse.json({ error: '未提供文件路径' }, { status: 400 })
    }

    await deleteFile(path)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete file error:', error)
    return NextResponse.json(
      { error: '删除文件失败' },
      { status: 500 }
    )
  }
}

