import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Shield, Database } from "lucide-react"
import { useParams, Link } from "react-router-dom"
import NotFound from "../NotFound"
import logo from '../../../public/forge.svg'
import { EntityFilters } from "./components/EntityFilters"
import { FieldsTable } from "./components/FieldsTable"
import { MethodsTable } from "./components/MethodsTable"
import { FieldModal } from "./components/FieldModal"
import { MethodModal } from "./components/MethodModal"
import { EntityModal } from "./components/EntityModal"
import { DeleteConfirmModal } from "./components/DeleteConfirmModal"


function Project() {
  const [projectData, setProjectData] = useState<any | null>(null)
  const [selectedEntity, setSelectedEntity] = useState<string>("all")
  const [fieldModalOpen, setFieldModalOpen] = useState(false)
  const [methodModalOpen, setMethodModalOpen] = useState(false)
  const [editingField, setEditingField] = useState<any>(null)
  const [editingMethod, setEditingMethod] = useState<any>(null)
  const [fieldForm, setFieldForm] = useState({
    name: "",
    type: "STRING",
    ref: "",
    required: false,
    entityId: 1,
  })
  const [methodForm, setMethodForm] = useState({
    method: "CREATE",
    authLevel: "AUTH",
    entityId: 1,
  })

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [deleteItem, setDeleteItem] = useState<{ type: "field" | "method" | "entity"; item: any } | null>(null)
  const [entityModalOpen, setEntityModalOpen] = useState(false)
  const [editingEntity, setEditingEntity] = useState<any>(null)
  const [entityForm, setEntityForm] = useState({
    name: "",
  })
  const [notFound, setNotFound] = useState(false)
  const { id } = useParams(); // Destructure the 'id' parameter

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/${id}`);
        if (response.status === 404) {
          setNotFound(true)
          return
        }
        const data : any = await response.json();
        setProjectData(data);
        // Process the data
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  // Get all fields from all entities
  const allFields = projectData?.entities.flatMap((entity: any) =>
    entity.fields.map((field: any) => ({
      ...field,
      entityName: entity.name,
      entityBuiltIn: entity.builtIn,
    })),
  )

  // Get all protection methods from all entities
  const allMethods = projectData?.entities.flatMap((entity: any) =>
    entity.protect.map((method: any) => ({
      ...method,
      entityName: entity.name,
      entityBuiltIn: entity.builtIn,
    })),
  )

  // Filter data based on selected entity
  const filteredFields =
    selectedEntity === "all" ? allFields : allFields.filter((field : any) => field.entityName === selectedEntity)

  const filteredMethods =
    selectedEntity === "all" ? allMethods : allMethods.filter((method : any) => method.entityName === selectedEntity)


  const handleFieldSubmit = () => {
    if (editingField) {
      console.log("Updating field:", { ...fieldForm, id: editingField.id })
    } else {
      console.log("Creating field:", fieldForm)
    }
    setFieldModalOpen(false)
  }

  const handleMethodSubmit = () => {
    if (editingMethod) {
      console.log("Updating method:", { ...methodForm, id: editingMethod.id })
    } else {
      console.log("Creating method:", methodForm)
    }
    setMethodModalOpen(false)
  }

  const handleEntitySubmit = () => {
    if (editingEntity) {
      console.log("Updating entity:", { ...entityForm, id: editingEntity.id })
    } else {
      console.log("Creating entity:", entityForm)
    }
    setEntityModalOpen(false)
  }

  const handleDelete = () => {
    if (deleteItem) {
      console.log(`Deleting ${deleteItem.type}:`, deleteItem.item)
    }
    setDeleteConfirmOpen(false)
    setDeleteItem(null)
  }

  const handleFieldFormChange = (field: string, value: string | boolean | number) => {
    setFieldForm(prev => ({ ...prev, [field]: value }))
  }

  const handleMethodFormChange = (field: string, value: string | number) => {
    setMethodForm(prev => ({ ...prev, [field]: value }))
  }

  const handleEntityFormChange = (field: string, value: string) => {
    setEntityForm(prev => ({ ...prev, [field]: value }))
  }

  const handleAddField = () => {
    setEditingField(null)
    setFieldForm({ name: "", type: "STRING", ref: "", required: false, entityId: 1 })
    setFieldModalOpen(true)
  }

  const handleEditField = (field: any) => {
    setEditingField(field)
    setFieldForm({
      name: field.name,
      type: field.type,
      ref: field.ref || "",
      required: field.required,
      entityId: field.entityId,
    })
    setFieldModalOpen(true)
  }

  const handleDeleteField = (field: any) => {
    setDeleteItem({ type: "field", item: field })
    setDeleteConfirmOpen(true)
  }

  const handleAddMethod = () => {
    setEditingMethod(null)
    setMethodForm({ method: "CREATE", authLevel: "AUTH", entityId: 1 })
    setMethodModalOpen(true)
  }

  const handleEditMethod = (method: any) => {
    setEditingMethod(method)
    setMethodForm({
      method: method.method,
      authLevel: method.authLevel,
      entityId: method.entityId,
    })
    setMethodModalOpen(true)
  }

  const handleDeleteMethod = (method: any) => {
    setDeleteItem({ type: "method", item: method })
    setDeleteConfirmOpen(true)
  }

  return (
    projectData ? (
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold">{projectData.name}</h1>
              <Link to="/">
                <img src={logo} alt="Forge API" className="w-16 h-16 mt-[-12px] cursor-pointer hover:opacity-80 transition-opacity" />
              </Link>
            </div>
            <p className="text-muted-foreground">
              {projectData.framework} • {projectData.dbType} • {projectData.authType}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline">{projectData.entities.length} entities</Badge>
              <Badge variant="outline">{allFields.length} fields</Badge>
              <Badge variant="outline">{allMethods.length} methods</Badge>
            </div>
            <Button
              onClick={() => {
                setEditingEntity(null)
                setEntityForm({ name: "" })
                setEntityModalOpen(true)
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Entity
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-6 max-w-4xl mx-auto my-8">
          <EntityFilters
            selectedEntity={selectedEntity}
            entities={projectData.entities}
            onEntityChange={setSelectedEntity}
          />

          {/* Tabs for Fields and Methods */}
          <Tabs defaultValue="fields" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="fields" className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                  Fields ({filteredFields.length})
              </TabsTrigger>
              <TabsTrigger value="methods" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                  Protection Methods ({filteredMethods.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="fields">
              <FieldsTable
                fields={filteredFields}
                onAddField={handleAddField}
                onEditField={handleEditField}
                onDeleteField={handleDeleteField}
              />
            </TabsContent>

            <TabsContent value="methods">
              <MethodsTable
                methods={filteredMethods}
                onAddMethod={handleAddMethod}
                onEditMethod={handleEditMethod}
                onDeleteMethod={handleDeleteMethod}
              />
            </TabsContent>
          </Tabs>
        </div>
        <FieldModal
          isOpen={fieldModalOpen}
          isEditMode={!!editingField}
          fieldForm={fieldForm}
          entities={projectData.entities}
          onClose={() => setFieldModalOpen(false)}
          onFieldFormChange={handleFieldFormChange}
          onSubmit={handleFieldSubmit}
        />

        <MethodModal
          isOpen={methodModalOpen}
          isEditMode={!!editingMethod}
          methodForm={methodForm}
          entities={projectData.entities}
          onClose={() => setMethodModalOpen(false)}
          onMethodFormChange={handleMethodFormChange}
          onSubmit={handleMethodSubmit}
        />

        <DeleteConfirmModal
          isOpen={deleteConfirmOpen}
          deleteItem={deleteItem}
          onClose={() => setDeleteConfirmOpen(false)}
          onConfirm={handleDelete}
        />

        <EntityModal
          isOpen={entityModalOpen}
          isEditMode={!!editingEntity}
          entityForm={entityForm}
          onClose={() => setEntityModalOpen(false)}
          onEntityFormChange={handleEntityFormChange}
          onSubmit={handleEntitySubmit}
        />
      </div>)
      : ( !notFound ? <div>Loading...</div> : <NotFound />)
  )
};

export default Project;