'use client'

import { useI18n } from '@/lib/i18n/context'
import { MarkdownContent } from '@/components/markdown-content'
import { Button } from '@/components/ui/button'
import { ExternalLink } from 'lucide-react'
import type { ProjectData } from '@/lib/types'

interface ProjectDetailClientProps {
  project: ProjectData
}

export function ProjectDetailClient({ project }: ProjectDetailClientProps) {
  const { t, locale } = useI18n()
  // 根据当前语言选择对应的内容，如果当前语言没有则回退到中文
  const content = locale === 'en' 
    ? (project.contentEn || project.contentZh || '')
    : (project.contentZh || project.contentEn || '')

  return (
    <main className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-6">{project.name}</h1>
        
        {project.demoUrl && (
          <div className="mb-6">
            <Button asChild size="lg">
              <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                {t.common.viewDemo}
              </a>
            </Button>
          </div>
        )}

        {content && (
          <div className="mb-8">
            <MarkdownContent content={content} />
          </div>
        )}
      </div>
    </main>
  )
}

