import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import type { ProjectData } from '@/lib/types'

interface ProjectCardProps {
  project: ProjectData
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/projects/${project.id}`}>
      <Card className="overflow-hidden transition-all hover:shadow-lg cursor-pointer">
        <div className="relative aspect-video w-full">
          <Image
            src={project.coverImage}
            alt={project.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg">{project.name}</h3>
        </CardContent>
      </Card>
    </Link>
  )
}

