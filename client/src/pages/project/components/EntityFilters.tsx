import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Database } from "lucide-react"

interface Entity {
  id: number
  name: string
  builtIn: boolean
}

interface EntityFiltersProps {
  selectedEntity: string
  entities: Entity[]
  onEntityChange: (value: string) => void
}

export function EntityFilters({
  selectedEntity,
  entities,
  onEntityChange,
}: EntityFiltersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Entity Filter
        </CardTitle>
        <CardDescription>Select an entity to filter fields and methods, or view all</CardDescription>
      </CardHeader>
      <CardContent>
        <Select value={selectedEntity} onValueChange={onEntityChange}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select entity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Entities</SelectItem>
            {entities.map((entity) => (
              <SelectItem key={entity.id} value={entity.name}>
                {entity.name} {entity.builtIn && "(Built-in)"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  )
}