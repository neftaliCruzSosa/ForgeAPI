# 🛣️ ForgeAPI Roadmap

## ✅ v0.1.2 (Next patch)
- Complete entity validation:
  - Field structure (`name`, `type`)
  - `ref` fields must reference valid entities
  - Valid roles for `protect`: `"admin"`, `"auth"`, `"self"`
- Project overwrite support:
  - Check if the project already exists (`projects/<name>`)
  - Throw error if it exists and `force: true` is not set
  - If `force: true`, remove previous content before generating
- Project output improvements:
  - Add useful scripts to `package.json`: `start`, `dev`
  - Include descriptive comments in `.env.example`
- Generation summary report:
  - Show DB and auth used, models generated, CRUDs, key files, execution time
- Technical refactors:
  - Extract `printSummary()` and `validateEntities()` as reusable helper functions

## 🔜 v0.1.3 (Reserved)
> This version is pending definition based on feedback and needs after v0.1.2 is released.

## 🚀 v0.2.0 (CLI Tool)
- Interactive CLI to select DB, auth, and entities
- Enhanced developer experience: progress, colors, clear output
- Support for presets and extended configuration

## 🔮 Future
- Support for more databases (MySQL, SQLite, etc.)
- OAuth2 login (Google, GitHub)
- Plugin and extension system