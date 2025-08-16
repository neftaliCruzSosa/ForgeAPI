import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search } from 'lucide-react'

interface ProjectFiltersProps {
  searchTerm: string
  frameworkFilter: string
  databaseFilter: string
  authTypeFilter: string
  uniqueFrameworks: string[]
  uniqueDatabases: string[]
  uniqueAuthType: string[]
  onSearchChange: (value: string) => void
  onFrameworkChange: (value: string) => void
  onDatabaseChange: (value: string) => void
  onAuthTypeChange: (value: string) => void
}

export function ProjectFilters({
  searchTerm,
  frameworkFilter,
  databaseFilter,
  authTypeFilter,
  uniqueFrameworks,
  uniqueDatabases,
  uniqueAuthType,
  onSearchChange,
  onFrameworkChange,
  onDatabaseChange,
  onAuthTypeChange,
}: ProjectFiltersProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-4">
      <div className="flex items-center space-x-2 flex-1">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by project name..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <Select value={frameworkFilter} onValueChange={onFrameworkChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Framework" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Frameworks</SelectItem>
          {uniqueFrameworks.map((framework) => (
            <SelectItem key={framework} value={framework}>
              {framework}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={databaseFilter} onValueChange={onDatabaseChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Database" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Databases</SelectItem>
          {uniqueDatabases.map((database) => (
            <SelectItem key={database} value={database}>
              {database}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={authTypeFilter} onValueChange={onAuthTypeChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Auth Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Auth Types</SelectItem>
          {uniqueAuthType.map((author) => (
            <SelectItem key={author} value={author}>
              {author}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}