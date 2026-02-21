'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { apiFetch } from '@/lib/utils/api'
import Image from 'next/image'

interface ImageCleanupDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ImageCleanupDialog({ open, onOpenChange }: ImageCleanupDialogProps) {
  const { toast } = useToast()
  const [unusedImages, setUnusedImages] = useState<string[]>([])
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const loadUnusedImages = async () => {
    setLoading(true)
    setSelectedImages(new Set())
    try {
      const data = await apiFetch<{ unusedImages: string[] }>('/api/uploads/unused')
      setUnusedImages(data.unusedImages || [])
    } catch (err) {
      toast({ title: '加载失败', description: err instanceof Error ? err.message : '未知错误', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) loadUnusedImages()
    else setSelectedImages(new Set())
    onOpenChange(nextOpen)
  }

  const toggleImage = (path: string) => {
    const next = new Set(selectedImages)
    if (next.has(path)) next.delete(path)
    else next.add(path)
    setSelectedImages(next)
  }

  const toggleAll = (checked: boolean) => {
    setSelectedImages(checked ? new Set(unusedImages) : new Set())
  }

  const handleCleanup = () => {
    if (selectedImages.size === 0) {
      toast({ title: '提示', description: '请至少选择一张图片' })
      return
    }
    setConfirmOpen(true)
  }

  const confirmCleanup = async () => {
    const paths = Array.from(selectedImages)
    try {
      const data = await apiFetch<{ deleted: number }>('/api/uploads/cleanup', {
        method: 'POST',
        body: JSON.stringify({ paths }),
      })
      toast({ title: '成功', description: `已清理 ${data.deleted || paths.length} 张图片` })
      setConfirmOpen(false)
      onOpenChange(false)
    } catch (err) {
      toast({ title: '清理失败', description: err instanceof Error ? err.message : '未知错误', variant: 'destructive' })
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>清理未使用的图片</DialogTitle>
            <DialogDescription>以下图片未被任何项目使用，可以安全删除</DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto mt-4">
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">加载中...</div>
            ) : unusedImages.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">没有未使用的图片</div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center space-x-2 p-2 border-b sticky top-0 bg-background z-10">
                  <Checkbox
                    id="select-all"
                    checked={selectedImages.size === unusedImages.length && unusedImages.length > 0}
                    onCheckedChange={toggleAll}
                  />
                  <label htmlFor="select-all" className="text-sm font-medium cursor-pointer">
                    全选 ({selectedImages.size}/{unusedImages.length})
                  </label>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-2">
                  {unusedImages.map((path) => (
                    <div key={path} className="relative group border rounded-lg overflow-hidden hover:border-primary transition-colors">
                      <div className="absolute top-2 left-2 z-10">
                        <Checkbox
                          checked={selectedImages.has(path)}
                          onCheckedChange={() => toggleImage(path)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      <div className="aspect-video relative">
                        <Image src={path} alt="" fill className="object-cover" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw" />
                      </div>
                      <div className="p-2">
                        <p className="text-xs text-muted-foreground truncate" title={path}>{path.split('/').pop()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => handleOpenChange(false)}>取消</Button>
            <Button variant="destructive" onClick={handleCleanup} disabled={selectedImages.size === 0}>
              清理选中 ({selectedImages.size})
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认清理</DialogTitle>
            <DialogDescription>确定要删除选中的 {selectedImages.size} 张图片吗？此操作无法撤销。</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>取消</Button>
            <Button variant="destructive" onClick={confirmCleanup}>确认清理</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
