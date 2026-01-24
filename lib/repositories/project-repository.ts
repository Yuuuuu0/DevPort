import { prisma } from '@/lib/prisma'
import type { ProjectData, CreateProjectInput, UpdateProjectInput } from '@/lib/types'
import type { Prisma, Project } from '@prisma/client'

export class ProjectRepository {
  async findAll(includeHidden = false): Promise<ProjectData[]> {
    const projects = await prisma.project.findMany({
      where: includeHidden ? undefined : { hidden: false },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    })
    return projects.map((project) => this.mapToProjectData(project))
  }

  async findById(id: string): Promise<ProjectData | null> {
    const project = await prisma.project.findUnique({
      where: { id },
    })
    return project ? this.mapToProjectData(project) : null
  }

  async create(input: CreateProjectInput): Promise<ProjectData> {
    // 如果没有指定 order，获取当前最大 order 值并加 1
    let order = input.order
    if (order === undefined) {
      const maxOrderProject = await prisma.project.findFirst({
        orderBy: { order: 'desc' },
        select: { order: true },
      })
      order = (maxOrderProject?.order ?? -1) + 1
    }

    const project = await prisma.project.create({
      data: {
        nameZh: input.nameZh ?? null,
        nameEn: input.nameEn ?? null,
        contentZh: input.contentZh ?? null,
        contentEn: input.contentEn ?? null,
        images: JSON.stringify(input.images),
        coverImage: input.coverImage,
        demoUrl: input.demoUrl ?? null,
        hidden: input.hidden ?? false,
        order,
      },
    })
    return this.mapToProjectData(project)
  }

  async update(id: string, input: UpdateProjectInput): Promise<ProjectData> {
    const updateData: Prisma.ProjectUpdateInput = {}
    if (input.nameZh !== undefined) updateData.nameZh = input.nameZh
    if (input.nameEn !== undefined) updateData.nameEn = input.nameEn
    if (input.contentZh !== undefined) updateData.contentZh = input.contentZh
    if (input.contentEn !== undefined) updateData.contentEn = input.contentEn
    if (input.images !== undefined) updateData.images = JSON.stringify(input.images)
    if (input.coverImage !== undefined) updateData.coverImage = input.coverImage
    if (input.demoUrl !== undefined) updateData.demoUrl = input.demoUrl
    if (input.hidden !== undefined) updateData.hidden = input.hidden
    if (input.order !== undefined) updateData.order = input.order

    const project = await prisma.project.update({
      where: { id },
      data: updateData,
    })
    return this.mapToProjectData(project)
  }

  async updateOrders(orders: { id: string; order: number }[]): Promise<void> {
    await Promise.all(
      orders.map(({ id, order }) =>
        prisma.project.update({
          where: { id },
          data: { order },
        })
      )
    )
  }

  async delete(id: string): Promise<void> {
    await prisma.project.delete({
      where: { id },
    })
  }

  private mapToProjectData(project: Project): ProjectData {
    return {
      id: project.id,
      nameZh: project.nameZh,
      nameEn: project.nameEn,
      contentZh: project.contentZh,
      contentEn: project.contentEn,
      images: this.parseImages(project.images),
      coverImage: project.coverImage,
      demoUrl: project.demoUrl,
      hidden: project.hidden,
      order: project.order,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    }
  }

  private parseImages(imagesJson: string): string[] {
    try {
      const parsed: unknown = JSON.parse(imagesJson)
      return Array.isArray(parsed) && parsed.every((v) => typeof v === 'string') ? parsed : []
    } catch {
      return []
    }
  }
}

export const projectRepository = new ProjectRepository()
