import { projectService } from '@/lib/services/project-service'
import { HomePageClient } from './_components/home-client'
import { buildSocialLinks } from '@/lib/config'

// 禁用缓存，确保数据实时更新
export const revalidate = 0
export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const projects = await projectService.getAllProjects(false)
  const socialLinks = buildSocialLinks()

  return <HomePageClient projects={projects} socialLinks={socialLinks} />
}
