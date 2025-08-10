import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Edit, Plus, Trash2, Shield, Database } from "lucide-react"
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
import { useParams } from "react-router-dom"
import NotFound from "./NotFound"


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

  const getTypeColor = (type: string) => {
    switch (type) {
    case "STRING":
      return "bg-blue-100 text-blue-800"
    case "BOOLEAN":
      return "bg-green-100 text-green-800"
    case "ARRAY":
      return "bg-purple-100 text-purple-800"
    case "REF":
      return "bg-orange-100 text-orange-800"
    default:
      return "bg-gray-100 text-gray-800"
    }
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

  return (
    projectData ? (
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{projectData.name}</h1>
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
          {/* Entity Filter */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                  Entity Filter
              </CardTitle>
              <CardDescription>Select an entity to filter fields and methods, or view all</CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={selectedEntity} onValueChange={setSelectedEntity}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select entity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Entities</SelectItem>
                  {projectData.entities.map((entity : any) => (
                    <SelectItem key={entity.id} value={entity.name}>
                      {entity.name} {entity.builtIn && "(Built-in)"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

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

            {/* Fields Tab */}
            <TabsContent value="fields">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Entity Fields</CardTitle>
                      <CardDescription>Manage field definitions for your entities</CardDescription>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => {
                        setEditingField(null)
                        setFieldForm({ name: "", type: "STRING", ref: "", required: false, entityId: 1 })
                        setFieldModalOpen(true)
                      }}
                    >
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
                      {filteredFields.map((field :any) => (
                        <TableRow key={field.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{field.entityName}</span>
                              {field.entityBuiltIn && (
                                <Badge variant="secondary" className="text-xs">
                                    Built-in
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="font-mono">{field.name}</TableCell>
                          <TableCell>
                            <Badge className={getTypeColor(field.type)}>{field.type}</Badge>
                          </TableCell>
                          <TableCell>
                            {field.ref ? (
                              <Badge variant="outline">{field.ref}</Badge>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant={field.required ? "default" : "secondary"}>
                              {field.required ? "Required" : "Optional"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setEditingField(field)
                                  setFieldForm({
                                    name: field.name,
                                    type: field.type,
                                    ref: field.ref || "",
                                    required: field.required,
                                    entityId: field.entityId,
                                  })
                                  setFieldModalOpen(true)
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setDeleteItem({ type: "field", item: field })
                                  setDeleteConfirmOpen(true)
                                }}
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
            </TabsContent>

            {/* Methods Tab */}
            <TabsContent value="methods">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Protection Methods</CardTitle>
                      <CardDescription>Manage authentication and authorization rules</CardDescription>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => {
                        setEditingMethod(null)
                        setMethodForm({ method: "CREATE", authLevel: "AUTH", entityId: 1 })
                        setMethodModalOpen(true)
                      }}
                    >
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
                      {filteredMethods.map((method : any) => (
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
                            {method.method === "CREATE" && "Allow creating new records"}
                            {method.method === "GET_ALL" && "Allow reading all records"}
                            {method.method === "UPDATE" && "Allow updating records"}
                            {method.method === "DELETE" && "Allow deleting records"}
                            {method.method === "RESTORE" && "Allow restoring deleted records"}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setEditingMethod(method)
                                  setMethodForm({
                                    method: method.method,
                                    authLevel: method.authLevel,
                                    entityId: method.entityId,
                                  })
                                  setMethodModalOpen(true)
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setDeleteItem({ type: "method", item: method })
                                  setDeleteConfirmOpen(true)
                                }}
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
            </TabsContent>
          </Tabs>
        </div>
        {/* Field Modal */}
        <Dialog open={fieldModalOpen} onOpenChange={setFieldModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingField ? "Edit Field" : "Add New Field"}</DialogTitle>
              <DialogDescription>
                {editingField ? "Update the field properties below." : "Create a new field for your entity."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="entity" className="text-right">
                  Entity
                </Label>
                <Select
                  value={fieldForm.entityId.toString()}
                  onValueChange={(value) => setFieldForm({ ...fieldForm, entityId: Number.parseInt(value) })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {projectData.entities.map((entity : any) => (
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
                  onChange={(e) => setFieldForm({ ...fieldForm, name: e.target.value })}
                  className="col-span-3"
                  placeholder="Field name"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">
                  Type
                </Label>
                <Select value={fieldForm.type} onValueChange={(value) => setFieldForm({ ...fieldForm, type: value })}>
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
                  <Select value={fieldForm.ref} onValueChange={(value) => setFieldForm({ ...fieldForm, ref: value })}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select entity" />
                    </SelectTrigger>
                    <SelectContent>
                      {projectData.entities.map((entity : any) => (
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
                    onCheckedChange={(checked) => setFieldForm({ ...fieldForm, required: !!checked })}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setFieldModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleFieldSubmit}>{editingField ? "Update Field" : "Create Field"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Method Modal */}
        <Dialog open={methodModalOpen} onOpenChange={setMethodModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingMethod ? "Edit Protection Method" : "Add New Protection Method"}</DialogTitle>
              <DialogDescription>
                {editingMethod
                  ? "Update the method properties below."
                  : "Create a new protection method for your entity."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="entity" className="text-right">
                  Entity
                </Label>
                <Select
                  value={methodForm.entityId.toString()}
                  onValueChange={(value) => setMethodForm({ ...methodForm, entityId: Number.parseInt(value) })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {projectData.entities.map((entity : any) => (
                      <SelectItem key={entity.id} value={entity.id.toString()}>
                        {entity.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="method" className="text-right">
                  Method
                </Label>
                <Select
                  value={methodForm.method}
                  onValueChange={(value) => setMethodForm({ ...methodForm, method: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CREATE">CREATE</SelectItem>
                    <SelectItem value="GET_ALL">GET_ALL</SelectItem>
                    <SelectItem value="UPDATE">UPDATE</SelectItem>
                    <SelectItem value="DELETE">DELETE</SelectItem>
                    <SelectItem value="RESTORE">RESTORE</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="authLevel" className="text-right">
                  Auth Level
                </Label>
                <Select
                  value={methodForm.authLevel}
                  onValueChange={(value) => setMethodForm({ ...methodForm, authLevel: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">ADMIN</SelectItem>
                    <SelectItem value="AUTH">AUTH</SelectItem>
                    <SelectItem value="SELF">SELF</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setMethodModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleMethodSubmit}>{editingMethod ? "Update Method" : "Create Method"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Modal */}
        <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this {deleteItem?.type}? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            {deleteItem && (
              <div className="py-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium">
                    {deleteItem.type === "field" && `Field: ${deleteItem.item.name}`}
                    {deleteItem.type === "method" && `Method: ${deleteItem.item.method}`}
                    {deleteItem.type === "entity" && `Entity: ${deleteItem.item.name}`}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {deleteItem.type === "field" &&
                      `Type: ${deleteItem.item.type} | Entity: ${deleteItem.item.entityName}`}
                    {deleteItem.type === "method" &&
                      `Auth Level: ${deleteItem.item.authLevel} | Entity: ${deleteItem.item.entityName}`}
                    {deleteItem.type === "entity" &&
                      `${deleteItem.item.fields?.length || 0} fields, ${deleteItem.item.protect?.length || 0} methods`}
                  </p>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Delete {deleteItem?.type}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Entity Modal */}
        <Dialog open={entityModalOpen} onOpenChange={setEntityModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingEntity ? "Edit Entity" : "Add New Entity"}</DialogTitle>
              <DialogDescription>
                {editingEntity ? "Update the entity properties below." : "Create a new entity for your project."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="entityName" className="text-right">
                  Name
                </Label>
                <Input
                  id="entityName"
                  value={entityForm.name}
                  onChange={(e) => setEntityForm({ ...entityForm, name: e.target.value })}
                  className="col-span-3"
                  placeholder="Entity name (e.g., User, Post)"
                />
              </div>

              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> After creating the entity, you can add fields and protection methods using the
                  respective tabs.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEntityModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEntitySubmit}>{editingEntity ? "Update Entity" : "Create Entity"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>)
      : ( !notFound ? <div>Loading...</div> : <NotFound />)
  )
};

export default Project;