import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface FormData {
  name: string
  dbType: string
  authType: string
  framework: string
  auth: boolean
}

interface ProjectModalProps {
  isOpen: boolean
  isEditMode: boolean
  formData: FormData
  onClose: () => void
  onInputChange: (field: string, value: string | boolean) => void
  onSubmit: () => void
}

export function ProjectModal({
  isOpen,
  isEditMode,
  formData,
  onClose,
  onInputChange,
  onSubmit,
}: ProjectModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
              onChange={(e) => onInputChange("name", e.target.value)}
              className="col-span-3"
              placeholder="my-awesome-api"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="framework" className="text-right">
                Framework
            </Label>
            <Select value={formData.framework} onValueChange={(value) => onInputChange("framework", value)}>
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
            <Select value={formData.dbType} onValueChange={(value) => onInputChange("dbType", value)}>
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
            <Select value={formData.authType} onValueChange={(value) => onInputChange("authType", value)}>
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
                onCheckedChange={(checked) => onInputChange("auth", checked)}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
              Cancel
          </Button>
          <Button onClick={onSubmit} disabled={!formData.name.trim()}>
            {isEditMode ? "Update Project" : "Create Project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}