# 📑 Changelog

All notable changes to this project will be documented in this file.

---

## [0.1.1] - 2025-07-15
### Added
- Error handling with contextual logging in all file and template generators
- `LoggerService` now supports levels (info, warn, error, debug)
- Logs are now written to `logs/<projectName>.log` per project
- Logger includes timestamps in files, and colored levels in console
- `quiet` mode and `debug` level toggle added for advanced control

### Changed
- All generator classes now catch and log meaningful errors
- `BaseFileGenerator` handles and propagates errors consistently

### Fixed
- Some uncaught errors during generation are now reported with context

---

## [0.1.0] - 2025-07-14
### Added
- Initial API generator with modular architecture
- MongoDB and PostgreSQL support
- JWT and IronSession authentication
- Entity-level `protect` system with roles: admin, auth, self
- Demo project generation
