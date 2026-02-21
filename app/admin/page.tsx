'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { ProjectForm } from '@/components/features/admin/project-form'
import { ProjectTable } from './_components/project-table'
import { DeleteDialog } from './_components/delete-dialog'
import { ImageCleanupDialog } from './_components/image-cleanup-dialog'
import { useToast } from '@/hooks/use-toast'
import { apiFetch } from '@/lib/utils/api'
import type { ProjectData } from '@/lib/types'
import { Plus, Trash } from 'lucide-react'

export default function AdminPage() {
  const { toast } = useToast()
  const [projects, setProjects] = useState<ProjectData[]>([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<ProjectData | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [cleanupOpen, setCleanupOpen] = useState(false)

  const loadProjects = async () => {
    try {
      const data = await apiFetch<ProjectData[]>('/api/projects?includeHidden=true')
      setProjects(data)
    } catch (err) {
      toast({ title: '加载失败', description: err instanceof Error ? err.message : '未知错误', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadProjects() }, [])

  const handleReorder = async (reordered: ProjectData[]) => {
    setProjects(reordered)
    const orders = reordered.map((p, i) => ({ id: p.id, order: i }))
    try {
      await apiFetch('/api/projects/reorder', { method: 'POST', body: JSON.stringify({ orders }) })
      toast({ title: '成功', description: '排序已更新' })
    } catch (err) {
      toast({ title: '更新排序失败', description: err instanceof Error ? err.message : '未知错误', variant: 'destructive' })
      loadProjects()
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await apiFetch(`/api/projects/${deleteTarget}`, { method: 'DELETE' })
      toast({ title: '成功', description: '项目已删除' })
      setDeleteTarget(null)
      loadProjects()
    } catch (err) {
      toast({ title: '删除失败', description: err instanceof Error ? err.message : '未知错误', variant: 'destructive' })
    }
  }

  const handleLogout = async () => {
    try {
      await apiFetch('/api/auth/logout', { method: 'POST' })
      window.location.href = '/admin/login'
    } catch (err) {
      toast({ title: '登出失败', description: err instanceof Error ? err.message : '未知错误', variant: 'destructive' })
    }
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="fixed top-4 right-4 z-50">
        <Button variant="outline" onClick={handleLogout}>登出</Button>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">项目管理</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setCleanupOpen(true)}>
            <Trash className="mr-2 h-4 w-4" />清理未使用图片
          </Button>
          <Button onClick={() => { setEditingProject(null); setFormOpen(true) }}>
            <Plus className="mr-2 h-4 w-4" />创建项目
          </Button>
        </div>
      </div>

      {loading ? (
        <p>加载中...</p>
      ) : projects.length === 0 ? (
        <p className="text-muted-foreground">暂无项目</p>
      ) : (
        <ProjectTable
          projects={projects}
          onReorder={handleReorder}
          onEdit={(p) => { setEditingProject(p); setFormOpen(true) }}
          onDelete={setDeleteTarget}
        />
      )}

      <ProjectForm project={editingProject} open={formOpen} onOpenChange={setFormOpen} onSuccess={loadProjects} />
      <DeleteDialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null) }} onConfirm={handleDelete} />
      <ImageCleanupDialog open={cleanupOpen} onOpenChange={setCleanupOpen} />
    </main>
  )
}
