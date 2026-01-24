'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { useI18n } from '@/lib/i18n/context'
import type { ProjectData } from '@/lib/types'
import { ArrowRight } from 'lucide-react'

interface ProjectCardProps {
  project: ProjectData
  index?: number
}

export function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  const { t, locale } = useI18n()
  
  // 根据当前语言获取项目名称，如果没有则回退
  const projectName = locale === 'en' 
    ? (project.nameEn || project.nameZh || '')
    : (project.nameZh || project.nameEn || '')
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/projects/${project.id}`} className="block group relative">
        <div className="absolute inset-0 bg-accent/5 transform translate-x-2 translate-y-2 border border-border/50 -z-10 transition-transform group-hover:translate-x-3 group-hover:translate-y-3" />
        
        <Card className="rounded-none border-2 border-border overflow-hidden bg-card transition-all duration-300 group-hover:border-accent">
          <div className="h-1 w-full bg-border group-hover:bg-accent transition-colors" />
          
          <div className="relative aspect-video w-full overflow-hidden border-b border-border bg-muted">
            <div className="absolute top-2 left-2 w-2 h-2 border-l-2 border-t-2 border-white/50 z-10" />
            <div className="absolute top-2 right-2 w-2 h-2 border-r-2 border-t-2 border-white/50 z-10" />
            <div className="absolute bottom-2 left-2 w-2 h-2 border-l-2 border-b-2 border-white/50 z-10" />
            <div className="absolute bottom-2 right-2 w-2 h-2 border-r-2 border-b-2 border-white/50 z-10" />

            <Image
              src={project.coverImage}
              alt={projectName}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105 filter grayscale group-hover:grayscale-0"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div className="px-4 py-2 bg-accent text-accent-foreground font-heading font-bold uppercase tracking-widest transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                {t.common.viewDetails}
              </div>
            </div>
            
            <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm text-white text-[10px] font-mono px-2 py-0.5 border border-white/20">
              PRJ-{String(index + 1).padStart(3, '0')}
            </div>
          </div>
          
          <CardContent className="p-5">
            <div className="flex justify-between items-start mb-2">
              <h3 
                className="font-heading font-bold text-lg uppercase tracking-tight group-hover:text-accent transition-colors line-clamp-1"
                title={projectName}
              >
                {projectName}
              </h3>
              <ArrowRight className="h-5 w-5 text-border group-hover:text-accent transition-colors -rotate-45 group-hover:rotate-0" />
            </div>
            
            <div className="flex items-center gap-2 mt-4">
              <div className="h-px flex-1 bg-border/50 group-hover:bg-accent/30 transition-colors" />
              <div className="text-[10px] font-mono text-muted-foreground uppercase">
                Systems Online
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}
