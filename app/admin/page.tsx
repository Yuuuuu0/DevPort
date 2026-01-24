'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ProjectForm } from '@/components/features/admin/project-form'
import { useToast } from '@/hooks/use-toast'
import type { ProjectData } from '@/lib/types'
import { Plus, Pencil, Trash2, GripVertical, Trash } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import Image from 'next/image'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

// 可拖拽的行组件
function SortableTableRow({ project, onEdit, onDelete }: { 
  project: ProjectData
  onEdit: (project: ProjectData) => void
  onDelete: (id: string) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const displayName = project.nameZh || project.nameEn || '未命名'
  const nameDisplay = project.nameZh && project.nameEn 
    ? `${project.nameZh} / ${project.nameEn}`
    : displayName

  return (
    <TableRow ref={setNodeRef} style={style}>
      <TableCell className="w-10">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
        >
          <GripVertical className="h-5 w-5" />
        </button>
      </TableCell>
      <TableCell className="font-medium">{nameDisplay}</TableCell>
      <TableCell>{project.images.length}</TableCell>
      <TableCell>
        {project.demoUrl ? (
          <a
            href={project.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            查看
          </a>
        ) : (
          <span className="text-muted-foreground">无</span>
        )}
      </TableCell>
      <TableCell>
        {project.hidden ? (
          <span className="text-muted-foreground">已隐藏</span>
        ) : (
          <span className="text-green-600">显示中</span>
        )}
      </TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(project)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(project.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  )
}

export default function AdminPage() {
  const { toast } = useToast()
  const [projects, setProjects] = useState<ProjectData[]>([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<ProjectData | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  
  // 清理未使用图片相关状态
  const [cleanupDialogOpen, setCleanupDialogOpen] = useState(false)
  const [unusedImages, setUnusedImages] = useState<string[]>([])
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set())
  const [loadingUnused, setLoadingUnused] = useState(false)
  const [cleanupConfirmOpen, setCleanupConfirmOpen] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const loadProjects = async () => {
    try {
      const response = await fetch('/api/projects?includeHidden=true')
      if (!response.ok) throw new Error('加载失败')
      const data = await response.json()
      setProjects(data)
    } catch (error: any) {
      toast({
        title: '加载失败',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProjects()
  }, [])

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = projects.findIndex((p) => p.id === active.id)
      const newIndex = projects.findIndex((p) => p.id === over.id)

      const newProjects = arrayMove(projects, oldIndex, newIndex)
      setProjects(newProjects)

      // 更新每个项目的 order 值
      const orders = newProjects.map((project, index) => ({
        id: project.id,
        order: index,
      }))

      try {
        const response = await fetch('/api/projects/reorder', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orders }),
        })

        if (!response.ok) throw new Error('更新排序失败')

        toast({
          title: '成功',
          description: '排序已更新',
        })
      } catch (error: any) {
        toast({
          title: '更新排序失败',
          description: error.message,
          variant: 'destructive',
        })
        // 回滚到原始顺序
        loadProjects()
      }
    }
  }

  const handleCreate = () => {
    setEditingProject(null)
    setFormOpen(true)
  }

  const handleEdit = (project: ProjectData) => {
    setEditingProject(project)
    setFormOpen(true)
  }

  const handleDeleteClick = (id: string) => {
    setDeletingId(id)
    setDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!deletingId) return

    try {
      const response = await fetch(`/api/projects/${deletingId}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('删除失败')

      toast({
        title: '成功',
        description: '项目已删除',
      })

      setDeleteDialogOpen(false)
      setDeletingId(null)
      loadProjects()
    } catch (error: any) {
      toast({
        title: '删除失败',
        description: error.message,
        variant: 'destructive',
      })
    }
  }

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      })

      if (response.ok) {
        window.location.href = '/admin/login'
      }
    } catch (error: any) {
      toast({
        title: '登出失败',
        description: error.message,
        variant: 'destructive',
      })
    }
  }

  const handleOpenCleanupDialog = async () => {
    setCleanupDialogOpen(true)
    setLoadingUnused(true)
    setSelectedImages(new Set())

    try {
      const response = await fetch('/api/uploads/unused')
      if (!response.ok) throw new Error('获取未使用图片失败')
      const data = await response.json()
      setUnusedImages(data.unusedImages || [])
    } catch (error: any) {
      toast({
        title: '加载失败',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setLoadingUnused(false)
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedImages(new Set(unusedImages))
    } else {
      setSelectedImages(new Set())
    }
  }

  const handleToggleImage = (path: string) => {
    const newSelected = new Set(selectedImages)
    if (newSelected.has(path)) {
      newSelected.delete(path)
    } else {
      newSelected.add(path)
    }
    setSelectedImages(newSelected)
  }

  const handleCleanup = () => {
    if (selectedImages.size === 0) {
      toast({
        title: '提示',
        description: '请至少选择一张图片',
      })
      return
    }
    setCleanupConfirmOpen(true)
  }

  const handleConfirmCleanup = async () => {
    const pathsToDelete = Array.from(selectedImages)
    
    try {
      const response = await fetch('/api/uploads/cleanup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paths: pathsToDelete }),
      })

      if (!response.ok) throw new Error('清理失败')

      const data = await response.json()
      toast({
        title: '成功',
        description: `已清理 ${data.deleted || pathsToDelete.length} 张图片`,
      })

      setCleanupConfirmOpen(false)
      setCleanupDialogOpen(false)
      setSelectedImages(new Set())
      // 重新加载未使用图片列表
      handleOpenCleanupDialog()
    } catch (error: any) {
      toast({
        title: '清理失败',
        description: error.message,
        variant: 'destructive',
      })
    }
  }

  return (
    <main className="container mx-auto px-4 py-8">
      {/* 右上角登出按钮 */}
      <div className="fixed top-4 right-4 z-50">
        <Button variant="outline" onClick={handleLogout}>
          登出
        </Button>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">项目管理</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleOpenCleanupDialog}>
            <Trash className="mr-2 h-4 w-4" />
            清理未使用图片
          </Button>
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            创建项目
          </Button>
        </div>
      </div>

      {loading ? (
        <p>加载中...</p>
      ) : projects.length === 0 ? (
        <p className="text-muted-foreground">暂无项目</p>
      ) : (
        <div className="border rounded-lg">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10"></TableHead>
                  <TableHead>项目名称</TableHead>
                  <TableHead>图片数量</TableHead>
                  <TableHead>演示链接</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <SortableContext
                  items={projects.map((p) => p.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {projects.map((project) => (
                    <SortableTableRow
                      key={project.id}
                      project={project}
                      onEdit={handleEdit}
                      onDelete={handleDeleteClick}
                    />
                  ))}
                </SortableContext>
              </TableBody>
            </Table>
          </DndContext>
        </div>
      )}

      <ProjectForm
        project={editingProject}
        open={formOpen}
        onOpenChange={setFormOpen}
        onSuccess={loadProjects}
      />

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
            <DialogDescription>
              此操作无法撤销，确定要删除这个项目吗？
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false)
                setDeletingId(null)
              }}
            >
              取消
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              删除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 清理未使用图片弹窗 */}
      <Dialog open={cleanupDialogOpen} onOpenChange={setCleanupDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>清理未使用的图片</DialogTitle>
            <DialogDescription>
              以下图片未被任何项目使用，可以安全删除
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto mt-4">
            {loadingUnused ? (
              <div className="text-center py-8 text-muted-foreground">加载中...</div>
            ) : unusedImages.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">没有未使用的图片</div>
            ) : (
              <div className="space-y-2">
                {/* 全选 */}
                <div className="flex items-center space-x-2 p-2 border-b sticky top-0 bg-background z-10">
                  <Checkbox
                    id="select-all"
                    checked={selectedImages.size === unusedImages.length && unusedImages.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                  <label
                    htmlFor="select-all"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    全选 ({selectedImages.size}/{unusedImages.length})
                  </label>
                </div>

                {/* 图片列表 */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-2">
                  {unusedImages.map((path) => (
                    <div
                      key={path}
                      className="relative group border rounded-lg overflow-hidden hover:border-primary transition-colors"
                    >
                      <div className="absolute top-2 left-2 z-10">
                        <Checkbox
                          checked={selectedImages.has(path)}
                          onCheckedChange={() => handleToggleImage(path)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      <div className="aspect-video relative">
                        <Image
                          src={path}
                          alt="未使用的图片"
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                      </div>
                      <div className="p-2">
                        <p className="text-xs text-muted-foreground truncate" title={path}>
                          {path.split('/').pop()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setCleanupDialogOpen(false)
                setSelectedImages(new Set())
              }}
            >
              取消
            </Button>
            <Button
              variant="destructive"
              onClick={handleCleanup}
              disabled={selectedImages.size === 0}
            >
              清理选中 ({selectedImages.size})
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 二次确认弹窗 */}
      <Dialog open={cleanupConfirmOpen} onOpenChange={setCleanupConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认清理</DialogTitle>
            <DialogDescription>
              确定要删除选中的 {selectedImages.size} 张图片吗？此操作无法撤销。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCleanupConfirmOpen(false)}
            >
              取消
            </Button>
            <Button variant="destructive" onClick={handleConfirmCleanup}>
              确认清理
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}
