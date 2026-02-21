'use client'

import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { ProjectData } from '@/lib/types'
import { Pencil, Trash2, GripVertical } from 'lucide-react'
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

function SortableRow({ project, onEdit, onDelete }: {
  project: ProjectData
  onEdit: (project: ProjectData) => void
  onDelete: (id: string) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: project.id })
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }
  const name = project.nameZh || project.nameEn || '未命名'
  const displayName = project.nameZh && project.nameEn ? `${project.nameZh} / ${project.nameEn}` : name

  return (
    <TableRow ref={setNodeRef} style={style}>
      <TableCell className="w-10">
        <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground">
          <GripVertical className="h-5 w-5" />
        </button>
      </TableCell>
      <TableCell className="font-medium">{displayName}</TableCell>
      <TableCell>{project.images.length}</TableCell>
      <TableCell>
        {project.demoUrl ? (
          <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">查看</a>
        ) : (
          <span className="text-muted-foreground">无</span>
        )}
      </TableCell>
      <TableCell>
        {project.hidden
          ? <span className="text-muted-foreground">已隐藏</span>
          : <span className="text-green-600">显示中</span>}
      </TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => onEdit(project)}><Pencil className="h-4 w-4" /></Button>
          <Button variant="ghost" size="sm" onClick={() => onDelete(project.id)}><Trash2 className="h-4 w-4" /></Button>
        </div>
      </TableCell>
    </TableRow>
  )
}

interface ProjectTableProps {
  projects: ProjectData[]
  onReorder: (reordered: ProjectData[]) => void
  onEdit: (project: ProjectData) => void
  onDelete: (id: string) => void
}

export function ProjectTable({ projects, onReorder, onEdit, onDelete }: ProjectTableProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = projects.findIndex(p => p.id === active.id)
      const newIndex = projects.findIndex(p => p.id === over.id)
      onReorder(arrayMove(projects, oldIndex, newIndex))
    }
  }

  return (
    <div className="border rounded-lg">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
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
            <SortableContext items={projects.map(p => p.id)} strategy={verticalListSortingStrategy}>
              {projects.map(project => (
                <SortableRow key={project.id} project={project} onEdit={onEdit} onDelete={onDelete} />
              ))}
            </SortableContext>
          </TableBody>
        </Table>
      </DndContext>
    </div>
  )
}
