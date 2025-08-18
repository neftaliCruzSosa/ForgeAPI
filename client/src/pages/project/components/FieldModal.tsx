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
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Entity {
  id: number
  name: string
}

interface FieldForm {
  name: string
  type: string
  ref: string
  required: boolean
  entityId: number
}

interface FieldModalProps {
  isOpen: boolean
  isEditMode: boolean
  fieldForm: FieldForm
  entities: Entity[]
  onClose: () => void
  onFieldFormChange: (field: string, value: string | boolean | number) => void
  onSubmit: () => void
}

export function FieldModal({
  isOpen,
  isEditMode,
  fieldForm,
  entities,
  onClose,
  onFieldFormChange,
  onSubmit,
}: FieldModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Field" : "Add New Field"}</DialogTitle>
          <DialogDescription>
            {isEditMode ? "Update the field properties below." : "Create a new field for your entity."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="entity" className="text-right">
              Entity
            </Label>
            <Select
              value={fieldForm.entityId.toString()}
              onValueChange={(value) => onFieldFormChange("entityId", parseInt(value))}
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
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={fieldForm.name}
              onChange={(e) => onFieldFormChange("name", e.target.value)}
              className="col-span-3"
              placeholder="Field name"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">
              Type
            </Label>
            <Select 
              value={fieldForm.type} 
              onValueChange={(value) => onFieldFormChange("type", value)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="STRING">STRING</SelectItem>
                <SelectItem value="BOOLEAN">BOOLEAN</SelectItem>
                <SelectItem value="ARRAY">ARRAY</SelectItem>
                <SelectItem value="REF">REF</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {fieldForm.type === "REF" && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="ref" className="text-right">
                Reference
              </Label>
              <Select 
                value={fieldForm.ref} 
                onValueChange={(value) => onFieldFormChange("ref", value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select entity" />
                </SelectTrigger>
                <SelectContent>
                  {entities.map((entity) => (
                    <SelectItem key={entity.id} value={entity.name}>
                      {entity.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="required" className="text-right">
              Required
            </Label>
            <div className="col-span-3">
              <Checkbox
                id="required"
                checked={fieldForm.required}
                onCheckedChange={(checked) => onFieldFormChange("required", !!checked)}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSubmit}>{isEditMode ? "Update Field" : "Create Field"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}