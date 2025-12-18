import { projectService } from '@/lib/services/project-service'
import { ProjectCard } from '@/components/project-card'
import { HomePageClient } from './home-client'

export default async function HomePage() {
  const projects = await projectService.getAllProjects(false)

  return <HomePageClient projects={projects} />
}

