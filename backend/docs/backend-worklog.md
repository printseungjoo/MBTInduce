## [2026-04-07 16:50] Simulation backend initial implementation

### Scope
- Added simulation CRUD APIs based on frontend field names.
- Kept frontend folder untouched.

### Implemented APIs
- `GET/POST/DELETE /api/simulation/simulationTemplate`
- `GET/POST/DELETE /api/simulation/userProfiles`
- `GET/POST/PATCH/DELETE /api/simulation/chatMessage`

### Field names preserved
- `simulationTemplate`: `id`, `content`
- `userProfiles`: `id`, `name`, `meOrNot`, `mbti`
- `chatMessage`: `id`, `role`, `content`, `mbtiRange`, `createdAt`, `rate`
- `mbtiRange`: `eValue`, `sValue`, `fValue`, `pValue`

### Files
- `prisma/schema.prisma`
- `prisma/migrations/20260407073303_add_simulation_models/migration.sql`
- `src/routes/simulation.routes.js`
- `src/controllers/simulation.controller.js`
- `src/services/simulation.service.js`
- `src/app.js`
- `docs/api-contract.md`
