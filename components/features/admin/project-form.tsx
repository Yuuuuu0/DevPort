'use client'

import { useState, useRef, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { uploadMultipleImages } from '@/lib/utils/image-upload'
import { useToast } from '@/hooks/use-toast'
import type { ProjectData } from '@/lib/types'
import { MarkdownEditor } from '@/components/markdown-editor'
import Image from 'next/image'
import { X, Copy } from 'lucide-react'

interface ProjectFormProps {
  project?: ProjectData | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

interface FormData {
  demoUrl: string
  hidden: boolean
}

export function ProjectForm({ project, open, onOpenChange, onSuccess }: ProjectFormProps) {
  const { toast } = useToast()
  const { register, handleSubmit, reset, setValue, watch } = useForm<FormData>({
    defaultValues: {
      demoUrl: project?.demoUrl || '',
      hidden: project?.hidden || false,
    },
  })

  const [lang, setLang] = useState<'zh' | 'en'>('zh')
  const [nameZh, setNameZh] = useState<string>('')
  const [nameEn, setNameEn] = useState<string>('')
  const [contentZh, setContentZh] = useState<string>('')
  const [contentEn, setContentEn] = useState<string>('')
  const [images, setImages] = useState<string[]>(project?.images || [])
  const [coverImage, setCoverImage] = useState<string>(project?.coverImage || '')
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const hidden = watch('hidden')

  useEffect(() => {
    if (project) {
      reset({
        demoUrl: project.demoUrl || '',
        hidden: project.hidden,
      })
      setNameZh(project.nameZh || '')
      setNameEn(project.nameEn || '')
      setContentZh(project.contentZh || '')
      setContentEn(project.contentEn || '')
      setImages(project.images)
      setCoverImage(project.coverImage)
    } else {
      reset({
        demoUrl: '',
        hidden: false,
      })
      setNameZh('')
      setNameEn('')
      setContentZh('')
      setContentEn('')
      setImages([])
      setCoverImage('')
    }
  }, [project, reset])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    setUploading(true)
    try {
      const paths = await uploadMultipleImages(files)
      const newImages = [...images, ...paths]
      setImages(newImages)
      
      // 如果没有封面图，自动设置第一张为封面
      if (!coverImage && newImages.length > 0) {
        setCoverImage(newImages[0])
      }

      toast({
        title: '上传成功',
        description: `成功上传 ${paths.length} 张图片`,
      })
    } catch (error: any) {
      toast({
        title: '上传失败',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const removeImage = async (path: string) => {
    // 删除文件
    try {
      const response = await fetch('/api/upload', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path }),
      })
      if (!response.ok) {
        console.error('Failed to delete file')
      }
    } catch (error) {
      console.error('Error deleting file:', error)
    }

    const newImages = images.filter((img: string) => img !== path)
    setImages(newImages)
    
    // 如果删除的是封面图，重新选择封面
    if (coverImage === path) {
      setCoverImage(newImages[0] || '')
    }
  }

  const setAsCover = (path: string) => {
    setCoverImage(path)
  }

  const copyImageMarkdown = async (path: string) => {
    try {
      // 获取完整的图片 URL
      const fullUrl = typeof window !== 'undefined' 
        ? `${window.location.origin}${path}`
        : path
      
      // 生成 markdown 格式
      const markdown = `![图片](${fullUrl})`
      
      // 复制到剪贴板
      await navigator.clipboard.writeText(markdown)
      
      toast({
        title: '已复制',
        description: 'Markdown 图片地址已复制到剪贴板',
      })
    } catch (error) {
      toast({
        title: '复制失败',
        description: '无法复制到剪贴板',
        variant: 'destructive',
      })
    }
  }

  const onSubmit = async (data: FormData) => {
    if (images.length === 0) {
      toast({
        title: '验证失败',
        description: '请至少上传一张图片',
        variant: 'destructive',
      })
      return
    }

    if (!coverImage || !images.includes(coverImage)) {
      toast({
        title: '验证失败',
        description: '请选择封面图',
        variant: 'destructive',
      })
      return
    }

    if (!nameZh.trim() && !nameEn.trim()) {
      toast({
        title: '验证失败',
        description: '请至少填写一个语言的项目名称',
        variant: 'destructive',
      })
      return
    }

    try {
      const payload = {
        nameZh: nameZh.trim() || null,
        nameEn: nameEn.trim() || null,
        contentZh: contentZh.trim() || null,
        contentEn: contentEn.trim() || null,
        images,
        coverImage,
        demoUrl: data.demoUrl || null,
        hidden: data.hidden,
      }

      const url = project ? `/api/projects/${project.id}` : '/api/projects'
      const method = project ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || '操作失败')
      }

      toast({
        title: '成功',
        description: project ? '项目已更新' : '项目已创建',
      })

      onSuccess()
      onOpenChange(false)
      reset()
      setNameZh('')
      setNameEn('')
      setContentZh('')
      setContentEn('')
      setImages([])
      setCoverImage('')
    } catch (error: any) {
      toast({
        title: '操作失败',
        description: error.message,
        variant: 'destructive',
      })
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // 关闭时重置表单
      reset({
        demoUrl: '',
        hidden: false,
      })
      setNameZh('')
      setNameEn('')
      setContentZh('')
      setContentEn('')
      setImages([])
      setCoverImage('')
    }
    onOpenChange(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{project ? '编辑项目' : '创建项目'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* 中英文切换 Tab */}
          <div className="border-b">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setLang('zh')}
                className={`px-4 py-2 font-medium transition-colors ${
                  lang === 'zh'
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                简体中文
              </button>
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`px-4 py-2 font-medium transition-colors ${
                  lang === 'en'
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                English
              </button>
            </div>
          </div>

          {/* 项目标题 */}
          <div>
            <Label htmlFor="name">{lang === 'zh' ? '项目名称 *' : 'Project Name *'}</Label>
            <Input
              id="name"
              value={lang === 'zh' ? nameZh : nameEn}
              onChange={(e) => {
                if (lang === 'zh') {
                  setNameZh(e.target.value)
                } else {
                  setNameEn(e.target.value)
                }
              }}
              placeholder={lang === 'zh' ? '请输入项目名称' : 'Enter project name'}
            />
          </div>

          {/* 项目内容 */}
          <div>
            <Label>{lang === 'zh' ? '项目内容（Markdown）' : 'Project Content (Markdown)'}</Label>
            <div className="mt-2">
              {lang === 'zh' ? (
                <MarkdownEditor
                  value={contentZh}
                  onChange={(value) => setContentZh(value || '')}
                />
              ) : (
                <MarkdownEditor
                  value={contentEn}
                  onChange={(value) => setContentEn(value || '')}
                />
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {lang === 'zh' 
                ? '提示：可以分别编辑中文和英文内容，前台会根据用户选择的语言自动显示对应内容'
                : 'Tip: You can edit Chinese and English content separately. The frontend will automatically display the corresponding content based on the user\'s selected language'}
            </p>
          </div>

          <div>
            <Label htmlFor="demoUrl">演示链接</Label>
            <Input
              id="demoUrl"
              type="url"
              {...register('demoUrl')}
              placeholder="https://example.com"
            />
          </div>

          <div>
            <Label>项目图片 *</Label>
            <div className="mt-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? '上传中...' : '上传图片'}
              </Button>
            </div>

            {images.length > 0 && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((path) => (
                  <div key={path} className="relative group">
                    <div className="relative aspect-video rounded-lg overflow-hidden border-2 border-transparent">
                      {coverImage === path && (
                        <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs z-10">
                          封面
                        </div>
                      )}
                      <Image
                        src={path}
                        alt="预览"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            size="sm"
                            variant="secondary"
                            onClick={() => setAsCover(path)}
                            disabled={coverImage === path}
                          >
                            {coverImage === path ? '已是封面' : '设为封面'}
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            onClick={() => removeImage(path)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => copyImageMarkdown(path)}
                          className="bg-white/90 hover:bg-white"
                        >
                          <Copy className="h-3 w-3 mr-1" />
                          复制 Markdown
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="hidden"
              checked={hidden}
              onCheckedChange={(checked) => setValue('hidden', checked as boolean)}
            />
            <Label htmlFor="hidden" className="cursor-pointer">
              隐藏项目（前台不显示）
            </Label>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              取消
            </Button>
            <Button type="submit" disabled={uploading}>
              {project ? '更新' : '创建'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
