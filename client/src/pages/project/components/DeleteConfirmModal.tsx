import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface DeleteItem {
  type: "field" | "method" | "entity"
  item: any
}

interface DeleteConfirmModalProps {
  isOpen: boolean
  deleteItem: DeleteItem | null
  onClose: () => void
  onConfirm: () => void
}

export function DeleteConfirmModal({
  isOpen,
  deleteItem,
  onClose,
  onConfirm,
}: DeleteConfirmModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this {deleteItem?.type}? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        {deleteItem && (
          <div className="py-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-medium">
                {deleteItem.type === "field" && `Field: ${deleteItem.item.name}`}
                {deleteItem.type === "method" && `Method: ${deleteItem.item.method}`}
                {deleteItem.type === "entity" && `Entity: ${deleteItem.item.name}`}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {deleteItem.type === "field" &&
                  `Type: ${deleteItem.item.type} | Entity: ${deleteItem.item.entityName}`}
                {deleteItem.type === "method" &&
                  `Auth Level: ${deleteItem.item.authLevel} | Entity: ${deleteItem.item.entityName}`}
                {deleteItem.type === "entity" &&
                  `${deleteItem.item.fields?.length || 0} fields, ${deleteItem.item.protect?.length || 0} methods`}
              </p>
            </div>
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Delete {deleteItem?.type}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}