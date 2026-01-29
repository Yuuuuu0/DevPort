'use client'

import { useI18n } from '@/lib/i18n/context'
import { ProjectCard } from '@/components/project-card'
import { SocialLinks } from '@/components/social-links'
import { TerminalHero } from '@/components/terminal-hero'
import type { ProjectData } from '@/lib/types'
import type { SocialLink } from '@/lib/config'
import { motion } from 'framer-motion'

interface HomePageClientProps {
  projects: ProjectData[]
  socialLinks: SocialLink[]
}

export function HomePageClient({ projects, socialLinks }: HomePageClientProps) {
  const { t } = useI18n()
  const currentYear = new Date().getFullYear()

  return (
    <main className="min-h-screen bg-background relative">
      <div className="fixed inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      
      <div className="container mx-auto px-4 py-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-24 max-w-4xl mx-auto"
        >
          <div className="inline-block mb-4 px-3 py-1 rounded-full border border-accent/20 bg-accent/5">
            <span className="text-sm font-mono text-accent tracking-widest uppercase">Portfolio // {currentYear}</span>
          </div>
          
          <TerminalHero className="mb-12" />

          <p className="text-muted-foreground font-mono text-sm md:text-base mb-8 uppercase tracking-widest">
            {projects.length > 0 
              ? `// ${projects.length} ${t.common.projects.toLowerCase()} DETECTED`
              : `// ${t.common.noProjects} DETECTED`
            }
          </p>

          <SocialLinks socialLinks={socialLinks} />
        </motion.div>

        {projects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center py-20 border border-dashed border-border/50 rounded-lg bg-muted/20"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-6">
              <svg
                className="w-10 h-10 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="square"
                  strokeLinejoin="miter"
                  strokeWidth={1.5}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
            </div>
            <p className="text-muted-foreground font-mono text-lg uppercase tracking-wider">{t.common.noProjects}</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
