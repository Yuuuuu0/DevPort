'use client'

import { useI18n } from '@/lib/i18n/context'
import { ProjectCard } from '@/components/project-card'
import type { ProjectData } from '@/lib/types'

interface HomePageClientProps {
  projects: ProjectData[]
}

export function HomePageClient({ projects }: HomePageClientProps) {
  const { t } = useI18n()

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">{t.common.projects}</h1>
      {projects.length === 0 ? (
        <p className="text-muted-foreground">{t.common.noProjects}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </main>
  )
}

