export interface ProjectData {
  id: string
  nameZh: string | null
  nameEn: string | null
  contentZh: string | null
  contentEn: string | null
  images: string[]
  coverImage: string
  demoUrl: string | null
  hidden: boolean
  order: number
  createdAt: Date
  updatedAt: Date
}

export interface CreateProjectInput {
  nameZh?: string | null
  nameEn?: string | null
  contentZh?: string | null
  contentEn?: string | null
  images: string[]
  coverImage: string
  demoUrl?: string | null
  hidden?: boolean
  order?: number
}

export interface UpdateProjectInput {
  nameZh?: string | null
  nameEn?: string | null
  contentZh?: string | null
  contentEn?: string | null
  images?: string[]
  coverImage?: string
  demoUrl?: string | null
  hidden?: boolean
  order?: number
}

