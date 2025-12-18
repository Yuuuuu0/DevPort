'use client'

import { useI18n } from '@/lib/i18n/context'
import { ProjectCard } from '@/components/project-card'
import { SocialLinks } from '@/components/social-links'
import type { ProjectData } from '@/lib/types'
import type { SocialLink } from '@/lib/config'
import { motion } from 'framer-motion'

interface HomePageClientProps {
  projects: ProjectData[]
  socialLinks: SocialLink[]
}

export function HomePageClient({ projects, socialLinks }: HomePageClientProps) {
  const { t } = useI18n()

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* 背景装饰 */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            {t.common.projects}
          </h1>
          <p className="text-muted-foreground text-lg mb-8">
            {projects.length > 0 
              ? `${projects.length} ${t.common.projects.toLowerCase()}`
              : t.common.noProjects
            }
          </p>
          <SocialLinks socialLinks={socialLinks} />
        </motion.div>

        {projects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center py-20"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-4">
              <svg
                className="w-10 h-10 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
            </div>
            <p className="text-muted-foreground text-lg">{t.common.noProjects}</p>
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
