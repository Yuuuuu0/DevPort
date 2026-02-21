'use client'

import { useI18n } from '@/lib/i18n/context'
import { MarkdownContent } from '@/components/markdown-content'
import { Button } from '@/components/ui/button'
import { ExternalLink, ArrowLeft } from 'lucide-react'
import type { ProjectData } from '@/lib/types'
import { getLocalizedField } from '@/lib/i18n/utils'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface ProjectDetailClientProps {
  project: ProjectData
}

export function ProjectDetailClient({ project }: ProjectDetailClientProps) {
  const { t, locale } = useI18n()
  const projectName = getLocalizedField(project, 'name', locale)
  const content = getLocalizedField(project, 'content', locale)

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="mb-6">
            <Link href="/" className="inline-block">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground" suppressHydrationWarning>
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t.common.backToProjects}
              </Button>
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground">
              {projectName}
            </h1>
          </div>

          {project.demoUrl && (
            <div className="mb-8">
              <Button asChild variant="outline" className="group">
                <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" suppressHydrationWarning>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  {t.common.viewDemo}
                </a>
              </Button>
            </div>
          )}

          {content && (
            <div className="prose prose-lg max-w-none dark:prose-invert">
              <MarkdownContent content={content} />
            </div>
          )}
        </motion.div>
      </div>
    </main>
  )
}
