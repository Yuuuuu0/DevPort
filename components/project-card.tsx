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
  const { t } = useI18n()
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
    >
      <Link href={`/projects/${project.id}`}>
        <Card className="group overflow-hidden transition-all hover:shadow-2xl cursor-pointer border-2 hover:border-primary/50 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
          <div className="relative aspect-video w-full overflow-hidden">
            <Image
              src={project.coverImage}
              alt={project.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
              <div className="flex items-center gap-2 text-white font-medium">
                <span suppressHydrationWarning>{t.common.viewDetails}</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </div>
          <CardContent className="p-6">
            <h3 className="font-bold text-xl group-hover:text-primary transition-colors">
              {project.name}
            </h3>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}
