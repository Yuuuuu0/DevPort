export interface ProjectData {
  id: string
  name: string
  contentZh: string | null
  contentEn: string | null
  images: string[]
  coverImage: string
  demoUrl: string | null
  hidden: boolean
  createdAt: Date
  updatedAt: Date
}

export interface CreateProjectInput {
  name: string
  contentZh?: string | null
  contentEn?: string | null
  images: string[]
  coverImage: string
  demoUrl?: string | null
  hidden?: boolean
}

export interface UpdateProjectInput {
  name?: string
  contentZh?: string | null
  contentEn?: string | null
  images?: string[]
  coverImage?: string
  demoUrl?: string | null
  hidden?: boolean
}

