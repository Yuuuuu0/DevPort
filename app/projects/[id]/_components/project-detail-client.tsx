'use client'

import { useI18n } from '@/lib/i18n/context'
import { MarkdownContent } from '@/components/markdown-content'
import { Button } from '@/components/ui/button'
import { ExternalLink, ArrowLeft } from 'lucide-react'
import type { ProjectData } from '@/lib/types'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface ProjectDetailClientProps {
  project: ProjectData
}

export function ProjectDetailClient({ project }: ProjectDetailClientProps) {
  const { t, locale } = useI18n()
  // 根据当前语言选择对应的标题，如果当前语言没有则回退
  const projectName = locale === 'en' 
    ? (project.nameEn || project.nameZh || '')
    : (project.nameZh || project.nameEn || '')
  // 根据当前语言选择对应的内容，如果当前语言没有则回退到中文
  const content = locale === 'en' 
    ? (project.contentEn || project.contentZh || '')
    : (project.contentZh || project.contentEn || '')

  return (
    <main className="min-h-screen bg-background relative">
      <div className="fixed inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <div className="container mx-auto px-4 py-16 max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <Link href="/" className="inline-block">
              <Button variant="ghost" className="group font-mono uppercase tracking-wider text-muted-foreground hover:text-accent hover:bg-accent/5" suppressHydrationWarning>
                <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                {t.common.backToProjects}
              </Button>
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-12 border-l-4 border-accent pl-6 py-2 shadow-[inset_4px_0_20px_-12px_rgba(0,217,255,0.5)]"
          >
            <div className="text-sm font-mono text-accent mb-2 uppercase tracking-widest">Project Details // {project.id.slice(0, 8)}</div>
            <h1 className="text-5xl md:text-6xl font-heading font-bold bg-clip-text text-foreground uppercase tracking-tight">
              {projectName}
            </h1>
          </motion.div>
          
          {project.demoUrl && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-12"
            >
              <Button asChild size="lg" className="group rounded-none border-2 border-accent bg-accent text-accent-foreground hover:bg-accent/90 hover:border-accent hover:shadow-accent-glow font-bold uppercase tracking-widest transition-all duration-300" >
                <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" suppressHydrationWarning>
                  <ExternalLink className="mr-2 h-4 w-4 group-hover:rotate-45 transition-transform" />
                  {t.common.viewDemo}
                </a>
              </Button>
            </motion.div>
          )}

          {content && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="prose prose-lg max-w-none dark:prose-invert font-sans"
            >
              <div className="relative bg-card border border-border p-8 md:p-12">
                <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-accent" />
                <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-accent" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-accent" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-accent" />
                
                <MarkdownContent content={content} />
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </main>
  )
}
