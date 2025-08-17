import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Plus, Trash2 } from "lucide-react"
import { getAuthLevelColor, getMethodColor } from "@/utils/colors"
import type { Protect } from "@prisma/client"

export type ProtectDecorator =  Protect & {
  entityName: string
}


const getMethodDescription = (method: string) => {
  switch (method) {
  case "CREATE":
    return "Allow creating new records"
  case "GET_ALL":
    return "Allow reading all records"
  case "UPDATE":
    return "Allow updating records"
  case "DELETE":
    return "Allow deleting records"
  case "RESTORE":
    return "Allow restoring deleted records"
  default:
    return ""
  }
}

interface MethodsTableProps {
  methods: ProtectDecorator[]
  onAddMethod: () => void
  onEditMethod: (method: ProtectDecorator) => void
  onDeleteMethod: (method: ProtectDecorator) => void
}

export function MethodsTable({
  methods,
  onAddMethod,
  onEditMethod,
  onDeleteMethod,
}: MethodsTableProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Protection Methods</CardTitle>
            <CardDescription>Manage authentication and authorization rules</CardDescription>
          </div>
          <Button size="sm" onClick={onAddMethod}>
            <Plus className="h-4 w-4 mr-2" />
            Add Method
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Entity</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Auth Level</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {methods.map((method) => (
              <TableRow key={method.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{method.entityName}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={`${getMethodColor(method.method)} uppercase`}>{method.method}</Badge>
                </TableCell>
                <TableCell>
                  <Badge className={`${getAuthLevelColor(method.authLevel)} uppercase`}>{method.authLevel}</Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {getMethodDescription(method.method)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditMethod(method)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteMethod(method)}
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