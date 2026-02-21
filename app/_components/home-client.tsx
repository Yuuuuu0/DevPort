'use client'

import { useI18n } from '@/lib/i18n/context'
import { ProjectCard } from '@/components/project-card'
import { SocialLinks } from '@/components/social-links'
import { TerminalHero } from '@/components/terminal-hero'
import type { ProjectData } from '@/lib/types'
import type { SocialLink } from '@/lib/config'
import { motion } from 'framer-motion'
import { Inbox } from 'lucide-react'

interface HomePageClientProps {
  projects: ProjectData[]
  socialLinks: SocialLink[]
}

export function HomePageClient({ projects, socialLinks }: HomePageClientProps) {
  const { t } = useI18n()

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-16 max-w-4xl mx-auto"
        >
          <TerminalHero className="mb-8" />
          <SocialLinks socialLinks={socialLinks} />
        </motion.div>

        {projects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center py-16 border border-dashed border-border rounded-lg"
          >
            <Inbox className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">{t.common.noProjects}</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-heading font-semibold">{t.common.projects}</h2>
              <span className="text-sm text-muted-foreground">
                {projects.length} {t.common.projects.toLowerCase()}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </main>
  )
}
