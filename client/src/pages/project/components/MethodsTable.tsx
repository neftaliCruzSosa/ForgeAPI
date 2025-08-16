import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Plus, Trash2 } from "lucide-react"

interface Method {
  id: number
  method: string
  authLevel: string
  entityId: number
  entityName: string
  entityBuiltIn: boolean
}

const getAuthLevelColor = (level: string) => {
  switch (level) {
  case "ADMIN":
    return "bg-red-100 text-red-800"
  case "AUTH":
    return "bg-yellow-100 text-yellow-800"
  case "SELF":
    return "bg-green-100 text-green-800"
  default:
    return "bg-gray-100 text-gray-800"
  }
}

const getMethodColor = (method: string) => {
  switch (method) {
  case "CREATE":
    return "bg-green-100 text-green-800"
  case "GET_ALL":
    return "bg-blue-100 text-blue-800"
  case "UPDATE":
    return "bg-yellow-100 text-yellow-800"
  case "DELETE":
    return "bg-red-100 text-red-800"
  case "RESTORE":
    return "bg-purple-100 text-purple-800"
  default:
    return "bg-gray-100 text-gray-800"
  }
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
  methods: Method[]
  onAddMethod: () => void
  onEditMethod: (method: Method) => void
  onDeleteMethod: (method: Method) => void
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
                    {method.entityBuiltIn && (
                      <Badge variant="secondary" className="text-xs">
                        Built-in
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getMethodColor(method.method)}>{method.method}</Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getAuthLevelColor(method.authLevel)}>{method.authLevel}</Badge>
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