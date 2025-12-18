import { projectRepository } from '@/lib/repositories/project-repository'
import { deleteMultipleFiles } from '@/lib/utils/file-delete'
import type { ProjectData, CreateProjectInput, UpdateProjectInput } from '@/lib/types'

export class ProjectService {
  async getAllProjects(includeHidden = false): Promise<ProjectData[]> {
    return projectRepository.findAll(includeHidden)
  }

  async getProjectById(id: string): Promise<ProjectData | null> {
    return projectRepository.findById(id)
  }

  async createProject(input: CreateProjectInput): Promise<ProjectData> {
    // 验证 coverImage 必须在 images 中
    if (!input.images.includes(input.coverImage)) {
      throw new Error('封面图必须来自图片列表')
    }
    return projectRepository.create(input)
  }

  async updateProject(id: string, input: UpdateProjectInput): Promise<ProjectData> {
    // 如果更新了 images，需要删除不再使用的图片文件
    if (input.images) {
      const current = await projectRepository.findById(id)
      if (current) {
        const deletedImages = current.images.filter(img => !input.images!.includes(img))
        if (deletedImages.length > 0) {
          await deleteMultipleFiles(deletedImages)
        }
      }
    }

    // 如果更新了 images 或 coverImage，验证 coverImage 必须在 images 中
    if (input.images && input.coverImage && !input.images.includes(input.coverImage)) {
      throw new Error('封面图必须来自图片列表')
    }
    // 如果只更新了 coverImage，需要先获取当前项目数据
    if (input.coverImage && !input.images) {
      const current = await projectRepository.findById(id)
      if (current && !current.images.includes(input.coverImage)) {
        throw new Error('封面图必须来自图片列表')
      }
    }
    return projectRepository.update(id, input)
  }

  async deleteProject(id: string): Promise<void> {
    // 先获取项目信息，以便删除关联的图片文件
    const project = await projectRepository.findById(id)
    if (project) {
      // 删除所有图片文件（coverImage 已经在 images 中，不需要重复）
      await deleteMultipleFiles(project.images)
    }
    // 删除数据库记录
    return projectRepository.delete(id)
  }
}

export const projectService = new ProjectService()

