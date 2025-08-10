import { useState, useEffect } from 'react'
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
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MoreHorizontal, Plus, Search, Database, Shield, Wrench, Server, FileCode, CheckCircle, FolderOpen } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import logo from '../../public/forge.svg'
import { Link } from 'react-router-dom';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

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


function Home() {
  const [projects, setProjects] = useState<Proyect[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000');
        const data : Proyect[] = await response.json();
        setProjects(data);
        // Process the data
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);


  const [searchTerm, setSearchTerm] = useState("")
  const [frameworkFilter, setFrameworkFilter] = useState("all")
  const [databaseFilter, setDatabaseFilter] = useState("all")
  const [authTypeFilter, setAuthTypeFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Modal Form Data
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingProject, setEditingProject] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: "",
    dbType: "mongo",
    authType: "jwt",
    framework: "express",
    auth: true,
  })

  // Success modal state
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [generatedProject, setGeneratedProject] = useState<any>(null)

  // Get unique values for filters
  const uniqueFrameworks = [...new Set(projects.map(p => p.framework))]
  const uniqueDatabases = [...new Set(projects.map(p => p.dbType))]
  const uniqueAuthType = [...new Set(projects.map(p => p.authType))]

  // Define filteredProjects with multiple filters
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFramework = frameworkFilter === "all" || project.framework === frameworkFilter
    const matchesDatabase = databaseFilter === "all" || project.dbType === databaseFilter
    const matchesAuthType = authTypeFilter === "all" || project.authType === authTypeFilter

    return matchesSearch && matchesFramework && matchesDatabase && matchesAuthType
  })

  // Now use filteredProjects for pagination calculations
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedProjects = filteredProjects.slice(startIndex, startIndex + itemsPerPage)

  // Reset to first page when filters change
  const resetToFirstPage = () => {
    setCurrentPage(1)
  }

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    resetToFirstPage()
  }

  const handleFrameworkChange = (value: string) => {
    setFrameworkFilter(value)
    resetToFirstPage()
  }

  const handleDatabaseChange = (value: string) => {
    setDatabaseFilter(value)
    resetToFirstPage()
  }

  const handleAuthTypeChange = (value: string) => {
    setAuthTypeFilter(value)
    resetToFirstPage()
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    })
    )
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setIsEditMode(false)
    setEditingProject(null)
    // Reset form when closing
    setFormData({
      name: "",
      dbType: "mongo",
      authType: "jwt",
      framework: "express",
      auth: true,
    })
  }

  const handleCreateProject = () => {
    if (isEditMode) {
      // Here you would typically send the data to your API for updating
      console.log("Updating project:", { id: editingProject.id, ...formData })
    } else {
      // Here you would typically send the data to your API for creating
      console.log("Creating project:", formData)
    }

    // Reset form and close modal
    setFormData({
      name: "",
      dbType: "mongo",
      authType: "jwt",
      framework: "express",
      auth: true,
    })
    setIsModalOpen(false)
    setIsEditMode(false)
    setEditingProject(null)
  }

  const handleGenerateCode = (project: any) => {
    // Here you would typically call your API to generate the code
    console.log("Generating code for project:", project)

    // Simulate code generation process
    setTimeout(() => {
      setGeneratedProject(project)
      setIsSuccessModalOpen(true)
    }, 1000)
  }

  const handleSuccessModalClose = () => {
    setIsSuccessModalOpen(false)
    setGeneratedProject(null)
  }


  return (
    <div className="container mx-auto p-4 space-y-6 mt-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
            <img src={logo} alt="Forge API" className="w-16 h-16 mt-[-12px]" />
          </div>
          <p className="text-muted-foreground mt-2">
            Manage your projects and configurations
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </div>

      <div className="flex flex-col max-w-4xl gap-4 mx-auto my-8">
        {/* Filters Section */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-4">
          <div className="flex items-center space-x-2 flex-1">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by project name..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <Select value={frameworkFilter} onValueChange={handleFrameworkChange}>
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

          <Select value={databaseFilter} onValueChange={handleDatabaseChange}>
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

          <Select value={authTypeFilter} onValueChange={handleAuthTypeChange}>
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

        {/* Table Section */}
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
                        <DropdownMenuItem onClick={() => handleGenerateCode(project)}>
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
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
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
                      onClick={() => setCurrentPage(page)}
                      className="w-8 h-8 p-0"
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
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
                onClick={() => {
                  setSearchTerm("")
                  setFrameworkFilter("all")
                  setDatabaseFilter("all")
                  setAuthTypeFilter("all")
                  setCurrentPage(1)
                }}
              >
                Clear all filters
              </Button>
            </div>
          )}

        </div>
      </div>
      {/* Modal Project */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Edit Project" : "Create New Project"}</DialogTitle>
            <DialogDescription>
              {isEditMode
                ? "Update your API project configuration."
                : "Create a new API project with your preferred configuration."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                  Name *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="col-span-3"
                placeholder="my-awesome-api"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="framework" className="text-right">
                  Framework
              </Label>
              <Select value={formData.framework} onValueChange={(value) => handleInputChange("framework", value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="express">Express</SelectItem>
                  <SelectItem value="fastify">Fastify</SelectItem>
                  <SelectItem value="nestjs">NestJS</SelectItem>
                  <SelectItem value="koa">Koa</SelectItem>
                  <SelectItem value="socket.io">Socket.io</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dbType" className="text-right">
                  Database
              </Label>
              <Select value={formData.dbType} onValueChange={(value) => handleInputChange("dbType", value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mongo">MongoDB</SelectItem>
                  <SelectItem value="postgres">PostgreSQL</SelectItem>
                  <SelectItem value="mysql">MySQL</SelectItem>
                  <SelectItem value="sqlite">SQLite</SelectItem>
                  <SelectItem value="redis">Redis</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="authType" className="text-right">
                  Auth Type
              </Label>
              <Select value={formData.authType} onValueChange={(value) => handleInputChange("authType", value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="jwt">JWT</SelectItem>
                  <SelectItem value="oauth2">OAuth2</SelectItem>
                  <SelectItem value="session">Session</SelectItem>
                  <SelectItem value="apikey">API Key</SelectItem>
                  <SelectItem value="bearer">Bearer Token</SelectItem>
                  <SelectItem value="websocket">WebSocket</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="auth" className="text-right">
                  Enable Auth
              </Label>
              <div className="col-span-3">
                <Switch
                  id="auth"
                  checked={formData.auth}
                  onCheckedChange={(checked) => handleInputChange("auth", checked)}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleModalClose}>
                Cancel
            </Button>
            <Button onClick={handleCreateProject} disabled={!formData.name.trim()}>
              {isEditMode ? "Update Project" : "Create Project"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

        {/* Success Modal */}
        <Dialog open={isSuccessModalOpen} onOpenChange={setIsSuccessModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <DialogTitle className="text-xl">Code Generated Successfully!</DialogTitle>
                <DialogDescription className="mt-1">
                  Your project has been generated and is ready to use.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="py-4">
            {generatedProject && (
              <div className="space-y-4">
                <div className="rounded-lg border bg-gray-50 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FolderOpen className="h-4 w-4 text-gray-600" />
                    <span className="font-medium text-sm text-gray-700">Project Location</span>
                  </div>
                  <code className="text-sm font-mono bg-white px-2 py-1 rounded border">
                    {generatedProject.outputDir}
                  </code>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Framework:</span>
                    <div className="mt-1">
                      <Badge className={getFrameworkColor(generatedProject.framework)}>
                        {generatedProject.framework}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Database:</span>
                    <div className="mt-1">
                      <Badge className={getDbTypeColor(generatedProject.dbType)}>{generatedProject.dbType}</Badge>
                    </div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Auth Type:</span>
                    <div className="mt-1">
                      <Badge className={getAuthTypeColor(generatedProject.authType)}>{generatedProject.authType}</Badge>
                    </div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Auth Status:</span>
                    <div className="mt-1">
                      <Badge variant={generatedProject.auth ? "default" : "secondary"}>
                        {generatedProject.auth ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    <strong>Next steps:</strong> Navigate to the project directory and run{" "}
                    <code className="bg-blue-100 px-1 rounded">npm install</code> to install dependencies.
                  </p>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={handleSuccessModalClose}>Got it!</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Home