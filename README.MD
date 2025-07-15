
# 🔥 ForgeAPI · Modular API Generator

**Current version:** [![version](https://img.shields.io/badge/version-0.1.0-blue.svg)](https://github.com/neftaliCruzSosa/forgeapi/releases)

**ForgeAPI** is a powerful, modular API code generator designed to help developers quickly scaffold real-world backend applications with built-in authentication, validation, and access control.

---

## ✨ Features

- 🔐 JWT authentication and role-based access control
- 🧱 MongoDB and PostgreSQL support
- 🧩 Clean, modular hexagonal architecture
- 🛡️ Entity-level CRUD with per-route access control (`auth`, `admin`, `self`)
- 📂 Automatically generates models, controllers, routes, validators, and middlewares
- ⚙️ Template-based code generation using EJS
- 🧪 Includes test scripts and seed data for rapid iteration
- 👤 Built-in support for entities like `User`

---

## 🚀 Getting Started

1. **Clone the repository**
```bash
git clone https://github.com/neftaliCruzSosa/forgeapi.git
cd forgeapi
```

2. **Install dependencies**
```bash
npm install
```

3. **Run the demo to generate a full example project including test seed data**
```bash
npm run demo
```

4. **Check the generated API**
The generated project will appear under:
```
/projects/<yourProjectName>
```

---

## 📁 Project Structure

```
forgeapi/
├── src/
│   ├── application/           # Core use cases like GenerateApiUseCase
│   ├── domain/                # Domain models and logic
│   ├── infrastructure/        # Adapters: DB, output, auth
│   ├── config/                # Preset configurations
│   └── templates/             # EJS templates for code generation
├── test/                      # Example use cases and tests
├── projects/                  # Output folder for generated APIs
└── cli.js                     # CLI entry point (coming soon)
```

---

## 🧪 Full Example Entity Definition

```js
const entities = [
  {
    name: "User",
    builtIn: true,
    skipSystemFields: ["createdBy"],
    overrideFields: [
      { name: "bio", type: "String" },
      { name: "avatar", type: "String" },
    ],
    protect: {
      create: "admin",
      getAll: "admin",
      getById: "admin",
      update: "self",
      delete: "admin",
    },
  },
  {
    name: "Post",
    fields: [
      { name: "title", type: "String", required: true },
      { name: "content", type: "String" },
      { name: "tags", type: "Array" },
    ],
    protect: {
      create: "auth",
      update: "self",
      delete: "self",
      restore: "admin",
      hardDelete: "admin",
    },
  },
  {
    name: "Comment",
    fields: [
      { name: "text", type: "String", required: true },
      { name: "post", type: "ref", ref: "Post", required: true },
    ],
    protect: {
      create: "auth",
      update: "self",
      delete: "self",
      restore: "admin",
      hardDelete: "admin",
    },
  },
  {
    name: "Like",
    fields: [
      { name: "post", type: "ref", ref: "Post", required: true },
      { name: "user", type: "ref", ref: "User", required: true },
    ],
    protect: {
      create: "auth",
      delete: "self",
    },
  },
];
```

---

## 🔒 `protect` Field Explained

Each entity can define access levels for CRUD routes via the `protect` field. Available roles:

- `"admin"` – Only admins can access the route
- `"auth"` – Any authenticated user can access
- `"self"` – Only the user who created the resource can access
- `""` or omitted – Route is public

Supported route-level protections:

- `create`
- `getAll`
- `getById`
- `update`
- `delete`
- `restore` (for soft deletes)
- `hardDelete` (for permanent deletion)

---

## 🔑 Auth Routes Generated

When `auth: true` is enabled, ForgeAPI generates the following default authentication routes:

- `POST /api/auth/register` → Register a new user  
- `POST /api/auth/login` → Login
- `POST /api/auth/promote` → Promote user roles (e.g., to admin) — restricted to admins

These routes are automatically wired with authentication, role-based access control, and input validation.

---

## 🔁 Routes Generated per Entity

For each defined entity, ForgeAPI generates:

- `POST /api/<entity>` → Create entity
- `GET /api/<entity>` → Get all entities
- `GET /api/<entity>/:id` → Get entity by ID
- `PUT /api/<entity>/:id` → Update entity by ID
- `DELETE /api/<entity>/:id` → Soft delete
- `POST /api/<entity>/:id/restore` → Restore deleted entity
- `DELETE /api/<entity>/:id/hard` → Permanently delete

---

## ⚙️ System Fields

ForgeAPI automatically includes the following fields in every entity:

- `isDeleted` (for soft deletes)
- `createdBy` (if authentication is enabled)

You can skip these using `skipSystemFields`.

---

## 📄 License

MIT © 2025 Neftali Cruz Sosa