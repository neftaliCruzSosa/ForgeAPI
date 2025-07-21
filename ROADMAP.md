# ForgeAPI Roadmap

## v0.1.2 – "Validation & Stability"

- **Complete entity validation:**
  - Field structure (`name`, `type`)
  - `ref` fields must reference valid entities
  - Valid roles for `protect`: `"admin"`, `"auth"`, `"self"`
- **Project overwrite support:**
  - Check if the project already exists (`projects/<name>`)
  - Throw error if it exists and `force: true` is not set
  - If `force: true`, remove previous content before generating
- **Project output improvements:**
  - Add useful scripts to `package.json`: `start`, `dev`
  - Include descriptive comments in `.env.example`
- **Generation summary report:**
  - Show DB and auth used, models generated, CRUDs, key files, execution time
- **Technical refactors:**
  - Extract `printSummary()` and `validateEntities()` as reusable helper functions

## v0.1.3 - "Modularization Patch – CLI-Ready" (next patch)

- **Modular architecture foundation:**
  - Create common interfaces for framework, database and auth
  - Implement dynamic adapter loading based on config
  - Extract all hardcoded logic into plug and play adapters
- **Project structure cleanup:**
  - Restructure `src/` to separate `framework/`, `db/`, `auth/`, `output/`
  - All generators become interchangeable modules
- **Centralized configuration:**
  - Use unified config file
  - Fallback to defaults, but expose full selection
- **CLI-ready internal:**
  - Remove direct calls in index.js
  - Ensure all generators can run programatically with injected options
  - Add runtime validation to detect missing/invalid adapters

## v0.2.0 (CLI Tool)

- Interactive CLI to select DB, auth, and entities
- Enhanced developer experience: progress, colors, clear output
- Support for presets and extended configuration

## Future

- Support for more databases (MySQL, SQLite, etc.)
- OAuth2 login (Google, GitHub)
- Plugin and extension system
