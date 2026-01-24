import { notFound } from 'next/navigation'
import { projectService } from '@/lib/services/project-service'
import { ProjectDetailClient } from './_components/project-detail-client'

// 禁用缓存，确保数据实时更新
export const revalidate = 0
export const dynamic = 'force-dynamic'

interface ProjectDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { id } = await params
  const project = await projectService.getProjectById(id)

  if (!project || project.hidden) {
    notFound()
  }

  return <ProjectDetailClient project={project} />
}
