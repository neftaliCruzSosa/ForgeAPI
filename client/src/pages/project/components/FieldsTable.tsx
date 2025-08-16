import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Plus, Trash2 } from "lucide-react"
import { getFieldTypeColor } from "@/utils/colors"

interface Field {
  id: number
  name: string
  type: string
  ref?: string
  required: boolean
  entityId: number
  entityName: string
  entityBuiltIn: boolean
}


interface FieldsTableProps {
  fields: Field[]
  onAddField: () => void
  onEditField: (field: Field) => void
  onDeleteField: (field: Field) => void
}

export function FieldsTable({
  fields,
  onAddField,
  onEditField,
  onDeleteField,
}: FieldsTableProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Entity Fields</CardTitle>
            <CardDescription>Manage field definitions for your entities</CardDescription>
          </div>
          <Button size="sm" onClick={onAddField}>
            <Plus className="h-4 w-4 mr-2" />
            Add Field
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Entity</TableHead>
              <TableHead>Field Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Reference</TableHead>
              <TableHead>Required</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fields.map((field) => (
              <TableRow key={field.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{field.entityName}</span>
                    {field.entityBuiltIn && (
                      <Badge variant="secondary" className="text-xs uppercase">
                        Built-in
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-mono">{field.name}</TableCell>
                <TableCell>
                  <Badge className={`${getFieldTypeColor(field.type)} uppercase`}>{field.type}</Badge>
                </TableCell>
                <TableCell>
                  {field.ref ? (
                    <Badge variant="outline" className="uppercase">{field.ref}</Badge>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant={field.required ? "default" : "secondary"} className="uppercase">
                    {field.required ? "Required" : "Optional"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditField(field)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteField(field)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}