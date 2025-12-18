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
  // 根据当前语言选择对应的内容，如果当前语言没有则回退到中文
  const content = locale === 'en' 
    ? (project.contentEn || project.contentZh || '')
    : (project.contentZh || project.contentEn || '')

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* 背景装饰 */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>

      <div className="container mx-auto px-4 py-16 max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* 返回按钮 */}
          <Link href="/">
            <Button variant="ghost" className="mb-8 group" suppressHydrationWarning>
              <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              {t.common.backToProjects}
            </Button>
          </Link>

          {/* 项目标题 */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent"
          >
            {project.name}
          </motion.h1>
          
          {/* 演示链接 */}
          {project.demoUrl && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-12"
            >
              <Button asChild size="lg" className="group">
                <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" suppressHydrationWarning>
                  <ExternalLink className="mr-2 h-4 w-4 group-hover:rotate-45 transition-transform" />
                  {t.common.viewDemo}
                </a>
              </Button>
            </motion.div>
          )}

          {/* 项目内容 */}
          {content && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="prose prose-lg max-w-none dark:prose-invert"
            >
              <div className="bg-card/50 backdrop-blur-sm rounded-lg border p-8 md:p-12 shadow-lg">
                <MarkdownContent content={content} />
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </main>
  )
}
