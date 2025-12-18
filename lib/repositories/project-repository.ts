import { prisma } from '@/lib/prisma'
import type { ProjectData, CreateProjectInput, UpdateProjectInput } from '@/lib/types'

export class ProjectRepository {
  async findAll(includeHidden = false): Promise<ProjectData[]> {
    const projects = await prisma.project.findMany({
      where: includeHidden ? undefined : { hidden: false },
      orderBy: { createdAt: 'desc' },
    })
    return projects.map(this.mapToProjectData)
  }

  async findById(id: string): Promise<ProjectData | null> {
    const project = await prisma.project.findUnique({
      where: { id },
    })
    return project ? this.mapToProjectData(project) : null
  }

  async create(input: CreateProjectInput): Promise<ProjectData> {
    const project = await prisma.project.create({
      data: {
        name: input.name,
        contentZh: input.contentZh ?? null,
        contentEn: input.contentEn ?? null,
        images: JSON.stringify(input.images),
        coverImage: input.coverImage,
        demoUrl: input.demoUrl ?? null,
        hidden: input.hidden ?? false,
      },
    })
    return this.mapToProjectData(project)
  }

  async update(id: string, input: UpdateProjectInput): Promise<ProjectData> {
    const updateData: any = {}
    if (input.name !== undefined) updateData.name = input.name
    if (input.contentZh !== undefined) updateData.contentZh = input.contentZh
    if (input.contentEn !== undefined) updateData.contentEn = input.contentEn
    if (input.images !== undefined) updateData.images = JSON.stringify(input.images)
    if (input.coverImage !== undefined) updateData.coverImage = input.coverImage
    if (input.demoUrl !== undefined) updateData.demoUrl = input.demoUrl
    if (input.hidden !== undefined) updateData.hidden = input.hidden

    const project = await prisma.project.update({
      where: { id },
      data: updateData,
    })
    return this.mapToProjectData(project)
  }

  async delete(id: string): Promise<void> {
    await prisma.project.delete({
      where: { id },
    })
  }

  private mapToProjectData(project: any): ProjectData {
    return {
      id: project.id,
      name: project.name,
      contentZh: project.contentZh,
      contentEn: project.contentEn,
      images: JSON.parse(project.images),
      coverImage: project.coverImage,
      demoUrl: project.demoUrl,
      hidden: project.hidden,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    }
  }
}

export const projectRepository = new ProjectRepository()

