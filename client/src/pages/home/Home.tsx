import { useState, useEffect } from 'react'
import type { Proyect } from "@prisma/client";
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react'
import logo from '../../../public/forge.svg'
import { ProjectFilters } from '@/pages/home/components/ProjectFilters'
import { ProjectTable } from '@/pages/home/components/ProjectTable'
import { ProjectModal } from '@/pages/home/components/ProjectModal'
import { SuccessModal } from '@/pages/home/components/SuccessModal'



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

  const handleGenerateCode = (project: Proyect) => {
    console.log("Generating code for project:", project)
    setTimeout(() => {
      setGeneratedProject({
        ...project,
        outputDir: `/projects/${project.name}`
      })
      setIsSuccessModalOpen(true)
    }, 1000)
  }

  const handleSuccessModalClose = () => {
    setIsSuccessModalOpen(false)
    setGeneratedProject(null)
  }

  const handleClearFilters = () => {
    setSearchTerm("")
    setFrameworkFilter("all")
    setDatabaseFilter("all")
    setAuthTypeFilter("all")
    setCurrentPage(1)
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
        <ProjectFilters
          searchTerm={searchTerm}
          frameworkFilter={frameworkFilter}
          databaseFilter={databaseFilter}
          authTypeFilter={authTypeFilter}
          uniqueFrameworks={uniqueFrameworks}
          uniqueDatabases={uniqueDatabases}
          uniqueAuthType={uniqueAuthType}
          onSearchChange={handleSearchChange}
          onFrameworkChange={handleFrameworkChange}
          onDatabaseChange={handleDatabaseChange}
          onAuthTypeChange={handleAuthTypeChange}
        />

        <ProjectTable
          paginatedProjects={paginatedProjects}
          filteredProjects={filteredProjects}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          onGenerateCode={handleGenerateCode}
          onClearFilters={handleClearFilters}
        />
      </div>
      <ProjectModal
        isOpen={isModalOpen}
        isEditMode={isEditMode}
        formData={formData}
        onClose={handleModalClose}
        onInputChange={handleInputChange}
        onSubmit={handleCreateProject}
      />

      <SuccessModal
        isOpen={isSuccessModalOpen}
        generatedProject={generatedProject}
        onClose={handleSuccessModalClose}
      />
    </div>
  )
}

export default Home