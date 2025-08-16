export const getFrameworkColor = (framework: string) => {
  switch (framework.toLowerCase()) {
  case "express":
    return "bg-gray-100 text-gray-900"
  case "fastify":
    return "bg-gray-100 text-gray-900"
  case "nestjs":
    return "bg-red-100 text-red-900"
  case "koa":
    return "bg-blue-100 text-blue-900"
  case "socket.io":
    return "bg-green-100 text-green-900"
  default:
    return "bg-gray-100 text-gray-900"
  }
}

export const getDbTypeColor = (dbType: string) => {
  switch (dbType.toLowerCase()) {
  case "mongo":
    return "bg-green-100 text-green-900"
  case "postgres":
    return "bg-blue-100 text-blue-900"
  case "mysql":
    return "bg-orange-100 text-orange-900"
  case "sqlite":
    return "bg-gray-100 text-gray-900"
  case "redis":
    return "bg-red-100 text-red-900"
  default:
    return "bg-gray-100 text-gray-900"
  }
}

export const getAuthTypeColor = (authType: string) => {
  switch (authType.toLowerCase()) {
  case "jwt":
    return "bg-purple-100 text-purple-900"
  case "oauth2":
    return "bg-blue-100 text-blue-900"
  case "session":
    return "bg-yellow-100 text-yellow-900"
  case "apikey":
    return "bg-gray-100 text-gray-900"
  case "bearer":
    return "bg-indigo-100 text-indigo-900"
  case "websocket":
    return "bg-teal-100 text-teal-900"
  default:
    return "bg-gray-100 text-gray-900"
  }
}

export const getFieldTypeColor = (type: string) => {
  switch (type) {
  case "STRING":
    return "bg-blue-100 text-blue-900"
  case "BOOLEAN":
    return "bg-green-100 text-green-900"
  case "ARRAY":
    return "bg-purple-100 text-purple-900"
  case "REF":
    return "bg-orange-100 text-orange-900"
  default:
    return "bg-gray-100 text-gray-900"
  }
}

export const getAuthLevelColor = (level: string) => {
  switch (level) {
  case "ADMIN":
    return "bg-red-100 text-red-900"
  case "AUTH":
    return "bg-yellow-100 text-yellow-900"
  case "SELF":
    return "bg-green-100 text-green-900"
  default:
    return "bg-gray-100 text-gray-900"
  }
}

export const getMethodColor = (method: string) => {
  switch (method) {
  case "CREATE":
    return "bg-green-100 text-green-900"
  case "GET_ALL":
    return "bg-blue-100 text-blue-900"
  case "UPDATE":
    return "bg-yellow-100 text-yellow-900"
  case "DELETE":
    return "bg-red-100 text-red-900"
  case "RESTORE":
    return "bg-purple-100 text-purple-900"
  default:
    return "bg-gray-100 text-gray-900"
  }
}