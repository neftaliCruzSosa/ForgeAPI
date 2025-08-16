import { Button } from '@/components/ui/button';
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CheckCircle, FolderOpen } from 'lucide-react'

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

interface GeneratedProject {
  name: string
  framework: string
  dbType: string
  authType: string
  auth: boolean
  outputDir: string
}

interface SuccessModalProps {
  isOpen: boolean
  generatedProject: GeneratedProject | null
  onClose: () => void
}

export function SuccessModal({
  isOpen,
  generatedProject,
  onClose,
}: SuccessModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
          <Button onClick={onClose}>Got it!</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}