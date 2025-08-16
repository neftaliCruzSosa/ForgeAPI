import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface EntityForm {
  name: string
}

interface EntityModalProps {
  isOpen: boolean
  isEditMode: boolean
  entityForm: EntityForm
  onClose: () => void
  onEntityFormChange: (field: string, value: string) => void
  onSubmit: () => void
}

export function EntityModal({
  isOpen,
  isEditMode,
  entityForm,
  onClose,
  onEntityFormChange,
  onSubmit,
}: EntityModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Entity" : "Add New Entity"}</DialogTitle>
          <DialogDescription>
            {isEditMode ? "Update the entity properties below." : "Create a new entity for your project."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="entityName" className="text-right">
              Name
            </Label>
            <Input
              id="entityName"
              value={entityForm.name}
              onChange={(e) => onEntityFormChange("name", e.target.value)}
              className="col-span-3"
              placeholder="Entity name (e.g., User, Post)"
            />
          </div>

          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> After creating the entity, you can add fields and protection methods using the
              respective tabs.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSubmit}>{isEditMode ? "Update Entity" : "Create Entity"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}