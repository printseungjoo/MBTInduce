# Changelog

## [Unreleased]

- Feature: Split admin question templates by `PromptTemplate.kind` — `/api/admin/main-chat-question-templates` and `/api/admin/simulation-question-templates`; migration adds `QuestionTemplateKind` enum.
- Feature: `GET /api/admin/statistics` adds `ratingStatistics` with `ratingCounts` (1–5) for admin rating distribution UI.
- Feature: `ADMIN_EMAILS` env var — comma-separated emails receive `ADMIN` on signup/login; OAuth success redirects admins to `AUTH_ADMIN_SUCCESS_REDIRECT` (default `{AUTH_SUCCESS_REDIRECT}/admin`).
- Docs: Full API specification documented in repository root `docs/api.md`.
- Feature: Added `POST /api/profile` (`postProfile`) for local sign-up with the same body and response as `POST /api/auth/signup`; shared `completeLocalSignup` keeps both endpoints in sync.
- Fix: Export `patchSimulationTemplateHandler` and `patchUserProfiles` in `simulation.controller.js` so `PATCH /api/simulation/simulationTemplate/:id` and `PATCH /api/simulation/userProfiles/:id` match registered routes; scenario body field remains `content` for frontend.
- Feature: Admin backend APIs — `GET /api/admin/statistics`, `GET /api/admin/feedback` (pagination; `rating` filter uses `ResponseRating`), CRUD `/api/admin/question-templates` (backed by `PromptTemplate`); `requireAuth` + `requireAdmin`; legacy `/api/admin/dashboard` and `/api/admin/templates` unchanged.
- Feature: Chat session rename — `PATCH /api/chatMessage/sessions/:id` with body `{ "title": "..." }` (owner-only, trimmed, max 200 chars) for History chat list Edit UX.
- Feature: Chat session delete — `DELETE /api/chatMessage/sessions/:id` (owner-only, cascades messages/ratings; history `chatSessionId` set null); `DELETE /api/chat?pageType=main|simulation&simulationKey=...` returns empty message array for frontend compat.
- feat: link `HistoryRecord` to Main Chat via optional `chatSessionId` FK to `ChatSession` (`ON DELETE SET NULL`); `POST /api/history` accepts optional `chatSessionId` (must belong to current user); migration `20260511180000_add_history_chat_session_fk`.
- feat: add signup and local authentication support (`User.passwordHash`, `POST /api/auth/signup`, `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`, bcrypt; Google OAuth and `POST /auth/logout` unchanged).
- feat: add user profile management (`GET /api/profile`, `PATCH /api/profile`, `{ success, data }`; MBTI synced to `MbtiPreference`).
- feat: add history record management (Prisma `HistoryRecord`, `GET`/`POST /api/history`, `GET`/`DELETE /api/history/:id`, list filters and owner-only access).
- chore: document history signup profile backend implementation (`docs/worklog.md`, migration `20260511120000_add_password_hash_and_history_record`).
- Fix: Removed `userId` from `/api/calendarEvent` response payloads to avoid exposing unnecessary user identifiers to the frontend.
- feat: add calendar event management — Prisma `CalendarEvent` model (migration `add_calendar_event_model`), REST `/api/calendarEvent` (list with optional `start`/`end`/`view`, get by id, create, patch, delete), shared validators, `{ success, data | message }` JSON envelope.
- feat: `POST /api/calendarEvent/recommend` — loads events in a UTC range (default 28 days from today), prefers a day with zero events else the day with the fewest events, calls OpenAI `gpt-4o-mini` with `response_format: json_object` for one suggested event on that day; falls back to an all-day block if the model output is invalid.
- Refactor: Removed `POST /api/exportChat` and the in-memory export helper from the simulation page API; export chat is out of project scope.
- feat: Simulation Page initial implementation
- Feature: Added `PATCH /api/simulation/simulationTemplate/:id` and `PATCH /api/simulation/userProfiles/:id` to support scenario/profile edits in Simulation CRUD.
- Hotfix: In development auth-bypass mode, `requireAuth` now upserts a test `User` record before setting `req.user`, preventing `ChatSession.userId` foreign-key 500 errors on `/api/chat`.
- Feature: Added `/api/chat` compatibility routes (`GET`/`POST`/`PATCH`) matching the frontend main chat flat `ChatMessage[]` contract, backed by a per-user "Main Chat" session and existing OpenAI pipeline (`postMessageCore`).
- Feature: `POST /api/showBoth` accepts a JSON array of axis codes (`EI`, `SN`, `FT`, `PJ`) from the Main Chat "Show Both" UI and persists them on `MbtiPreference.showBothAxes`.
- Fix: Added frontend-interop aliases `/api/mbtiRange` and `/api/chatMessage` while keeping existing main routes.
- Fix: MBTI update now accepts additional frontend DTO formats (`mbtiRange.eValue/sValue/fValue/pValue` and flat `eValue/sValue/fValue/pValue`).
- Fix: Restored `normalizeLetter` usage safety in MBTI controller to avoid runtime reference issues.
- Chore: CORS origin check switched to explicit function validation against allowed origins list.
- Chore: Added development-only auth bypass flags (`DEV_AUTH_BYPASS`, `DEV_AUTH_USER_ID`, `DEV_AUTH_ROLE`) for local integration testing.
- Feature: Added simulation backend CRUD APIs (`simulationTemplate`, `userProfiles`, `chatMessage`) with frontend-aligned field names and `mbtiRange` shape.
- Feature: Main Chat API accepts MBTI slider weights (0–100, E/S/F/P poles) aligned with frontend `RangeBar`; optional `text` alias for message body; `appliedMbti` on message response.
- Feature: `MbtiPreference` stores `energyWeight`, `informationWeight`, `decisionWeight`, `lifestyleWeight`; `PUT /api/mbti` accepts `mbtiWeights` or flat weight fields.
- Feature: OpenAI Chat Completions integration using `gpt-4o-mini` for `POST /api/chat/sessions/:id/messages` and `/api/ai/*`; configure via `OPENAI_API_KEY` and optional `OPENAI_MODEL`.
- Chore: Add `.env` to `.gitignore` to reduce accidental secret commits.