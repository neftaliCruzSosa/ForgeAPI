import type { Proyect } from "@prisma/client";
import { Button } from '@/components/ui/button';
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Database, Shield, Wrench, Server, FileCode } from 'lucide-react'
import { Link } from 'react-router-dom';

const getFrameworkColor = (framework: string) => {
  switch (framework.toLowerCase()) {
  case "express":
    return "bg-gray-800 text-white"
  case "fastify":
    return "bg-black text-white"
  case "nestjs":
    return "bg-red-600 text-white"
  case "koa":
    return "bg-blue-600 text-white"
  case "socket.io":
    return "bg-green-600 text-white"
  default:
    return "bg-gray-500 text-white"
  }
}

const getDbTypeColor = (dbType: string) => {
  switch (dbType.toLowerCase()) {
  case "mongo":
    return "bg-green-700 text-white"
  case "postgres":
    return "bg-blue-600 text-white"
  case "mysql":
    return "bg-orange-500 text-white"
  case "sqlite":
    return "bg-gray-600 text-white"
  case "redis":
    return "bg-red-500 text-white"
  default:
    return "bg-gray-500 text-white"
  }
}

const getAuthTypeColor = (authType: string) => {
  switch (authType.toLowerCase()) {
  case "jwt":
    return "bg-purple-600 text-white"
  case "oauth2":
    return "bg-blue-500 text-white"
  case "session":
    return "bg-yellow-600 text-white"
  case "apikey":
    return "bg-gray-700 text-white"
  case "bearer":
    return "bg-indigo-600 text-white"
  case "websocket":
    return "bg-teal-600 text-white"
  default:
    return "bg-gray-500 text-white"
  }
}

interface ProjectTableProps {
  paginatedProjects: Proyect[]
  filteredProjects: Proyect[]
  currentPage: number
  itemsPerPage: number
  totalPages: number
  onPageChange: (page: number) => void
  onGenerateCode: (project: Proyect) => void
  onClearFilters: () => void
}

export function ProjectTable({
  paginatedProjects,
  filteredProjects,
  currentPage,
  itemsPerPage,
  totalPages,
  onPageChange,
  onGenerateCode,
  onClearFilters,
}: ProjectTableProps) {
  const startIndex = (currentPage - 1) * itemsPerPage

  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">ID</TableHead>
            <TableHead>Project Name</TableHead>
            <TableHead>Framework</TableHead>
            <TableHead>Database</TableHead>
            <TableHead>Auth Type</TableHead>
            <TableHead>Auth Status</TableHead>
            <TableHead className="w-[70px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedProjects.map((project) => (
            <TableRow key={project.id}>
              <TableCell className="font-medium">#{project.id}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Server className="h-4 w-4 text-muted-foreground" />
                  <span className="font-mono text-sm">{project.name}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge className={getFrameworkColor(project.framework)}>
                  {project.framework}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-muted-foreground" />
                  <Badge className={getDbTypeColor(project.dbType)}>
                    {project.dbType}
                  </Badge>
                </div>
              </TableCell>
              <TableCell>
                <Badge className={getAuthTypeColor(project.authType)}>
                  {project.authType}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <Badge variant={project.auth ? "default" : "secondary"}>
                    {project.auth ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem>
                      <Link to={`/${project.id}`} className="flex items-center gap-2">
                        <Wrench className="mr-2 h-4 w-4" />
                            Configuration
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onGenerateCode(project)}>
                    <FileCode className="mr-2 h-4 w-4" />
                    Generate Code
                  </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      Delete project
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      {filteredProjects.length > 0 && (
        <div className="flex items-center justify-between px-4 py-4 border-t">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredProjects.length)} of {filteredProjects.length} projects
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPageChange(page)}
                  className="w-8 h-8 p-0"
                >
                  {page}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <Server className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No projects found matching your filters.</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={onClearFilters}
          >
            Clear all filters
          </Button>
        </div>
      )}
    </div>
  )
}