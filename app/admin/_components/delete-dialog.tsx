import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface DeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export function DeleteDialog({ open, onOpenChange, onConfirm }: DeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>确认删除</DialogTitle>
          <DialogDescription>
            此操作无法撤销，确定要删除这个项目吗？
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            删除
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
