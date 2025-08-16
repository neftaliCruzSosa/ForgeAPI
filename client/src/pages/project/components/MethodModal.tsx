import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Entity {
  id: number
  name: string
}

interface MethodForm {
  method: string
  authLevel: string
  entityId: number
}

interface MethodModalProps {
  isOpen: boolean
  isEditMode: boolean
  methodForm: MethodForm
  entities: Entity[]
  onClose: () => void
  onMethodFormChange: (field: string, value: string | number) => void
  onSubmit: () => void
}

export function MethodModal({
  isOpen,
  isEditMode,
  methodForm,
  entities,
  onClose,
  onMethodFormChange,
  onSubmit,
}: MethodModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Protection Method" : "Add New Protection Method"}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update the method properties below."
              : "Create a new protection method for your entity."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="entity" className="text-right">
              Entity
            </Label>
            <Select
              value={methodForm.entityId.toString()}
              onValueChange={(value) => onMethodFormChange("entityId", parseInt(value))}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {entities.map((entity) => (
                  <SelectItem key={entity.id} value={entity.id.toString()}>
                    {entity.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="method" className="text-right">
              Method
            </Label>
            <Select
              value={methodForm.method}
              onValueChange={(value) => onMethodFormChange("method", value)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CREATE">CREATE</SelectItem>
                <SelectItem value="GET_ALL">GET_ALL</SelectItem>
                <SelectItem value="UPDATE">UPDATE</SelectItem>
                <SelectItem value="DELETE">DELETE</SelectItem>
                <SelectItem value="RESTORE">RESTORE</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="authLevel" className="text-right">
              Auth Level
            </Label>
            <Select
              value={methodForm.authLevel}
              onValueChange={(value) => onMethodFormChange("authLevel", value)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ADMIN">ADMIN</SelectItem>
                <SelectItem value="AUTH">AUTH</SelectItem>
                <SelectItem value="SELF">SELF</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSubmit}>{isEditMode ? "Update Method" : "Create Method"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}