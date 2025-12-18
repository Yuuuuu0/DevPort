import { projectService } from '@/lib/services/project-service'
import { ProjectCard } from '@/components/project-card'
import { HomePageClient } from './home-client'

// 禁用缓存，确保数据实时更新
export const revalidate = 0
export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const projects = await projectService.getAllProjects(false)

  return <HomePageClient projects={projects} />
}

