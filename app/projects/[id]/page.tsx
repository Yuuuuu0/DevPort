import { notFound } from 'next/navigation'
import { projectService } from '@/lib/services/project-service'
import { ProjectDetailClient } from './project-detail-client'

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

