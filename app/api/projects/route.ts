import { NextRequest, NextResponse } from 'next/server'
import { projectService } from '@/lib/services/project-service'
import { requireAuth } from '@/lib/utils/auth'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const includeHidden = searchParams.get('includeHidden') === 'true'
    
    // 如果包含隐藏项目，需要鉴权
    if (includeHidden) {
      const authError = await requireAuth(request)
      if (authError) return authError
    }
    
    const projects = await projectService.getAllProjects(includeHidden)
    return NextResponse.json(projects)
  } catch (error) {
    console.error('Get projects error:', error)
    return NextResponse.json(
      { error: '获取项目列表失败' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // 创建项目需要鉴权
    const authError = await requireAuth(request)
    if (authError) return authError
    
    const body = await request.json()
    const project = await projectService.createProject(body)
    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error('Create project error:', error)
    const message = error instanceof Error ? error.message : undefined
    return NextResponse.json(
      { error: message || '创建项目失败' },
      { status: 400 }
    )
  }
}
