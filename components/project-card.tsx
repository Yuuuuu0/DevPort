'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useI18n } from '@/lib/i18n/context'
import { getLocalizedField } from '@/lib/i18n/utils'
import type { ProjectData } from '@/lib/types'
import { ArrowUpRight } from 'lucide-react'

interface ProjectCardProps {
  project: ProjectData
  index?: number
}

export function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  const { locale } = useI18n()
  const projectName = getLocalizedField(project, 'name', locale)

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link href={`/projects/${project.id}`} className="block group">
        <div className="rounded-lg border bg-card overflow-hidden transition-shadow hover:shadow-soft">
          <div className="relative aspect-video w-full overflow-hidden bg-muted">
            <Image
              src={project.coverImage}
              alt={projectName}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <div className="p-4">
            <div className="flex justify-between items-center">
              <h3
                className="font-heading font-semibold text-base group-hover:text-primary transition-colors line-clamp-1"
                title={projectName}
              >
                {projectName}
              </h3>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
