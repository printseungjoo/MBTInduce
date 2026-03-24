# MBTInduce Implementation Log

## 2026-03-24

### 1) MVP backend structure implemented
- Added auth/session/prisma-oriented structure for Google OAuth + DB persistence.
- Main app wiring:
  - `src/app.js`
  - `src/server.js`
  - `src/config/session.js`
  - `src/config/passport.js`
  - `src/lib/prisma.js`

### 2) Prisma schema created
- File: `prisma/schema.prisma`
- Models:
  - `User` (role/status/lastLoginAt/deletedAt)
  - `Account` (Google provider account link)
  - `MbtiPreference`
  - `ChatSession`
  - `Message`
  - `ResponseRating`
  - `Feedback`
  - `PromptTemplate`
- Enums:
  - `UserRole`, `UserStatus`, `AuthProvider`, `MessageRole`

### 3) Google OAuth flow added
- Start: `GET /auth/google`
- Callback: `GET /auth/google/callback`
- Logic:
  - Use `providerAccountId` (Google profile id) + `provider=GOOGLE` to find `Account`.
  - `Account.userId` links to internal `User.id`.
  - First login:
    - create `User` (if not exists by email)
    - create `Account`
    - create default `MbtiPreference`
  - Re-login:
    - update `lastLoginAt`, sync profile info

### 4) Implemented API endpoints
- Auth:
  - `GET /auth/google`
  - `GET /auth/google/callback`
  - `POST /auth/logout`
  - `DELETE /auth/withdraw`
- User:
  - `GET /api/me`
  - `PATCH /api/me`
  - `DELETE /api/me`
- MBTI:
  - `GET /api/mbti`
  - `PUT /api/mbti`
- Chat:
  - `GET /api/chat/sessions`
  - `POST /api/chat/sessions`
  - `GET /api/chat/sessions/:id`
  - `POST /api/chat/sessions/:id/messages`
- Rating/Feedback/Templates/Admin:
  - `POST /api/ratings`
  - `POST /api/feedback`
  - `GET /api/templates`
  - `GET /api/admin/dashboard`
  - `POST /api/admin/templates`
  - `PATCH /api/admin/templates/:id`
  - `DELETE /api/admin/templates/:id`

### 5) Authorization rules
- `requireAuth`:
  - Block unauthenticated users.
  - Block `SUSPENDED`/`DELETED` users.
- `requireAdmin`:
  - Allow only `role=ADMIN`.
- Ownership checks:
  - Chat detail/message APIs ensure `chatSession.userId === req.user.id`.

### 6) Session design
- `express-session` + `connect-pg-simple`.
- Session stores only serialized `user.id` via Passport.
- Cookie policy:
  - `httpOnly: true`
  - `secure: true` in production
  - `sameSite: "none"` in production, `"lax"` in development
- CORS credentials enabled in `src/app.js`.

---

## 2026-03-24 (Frontend handoff: TV requirements only)

### Scope
- Source: `requirements.pdf` TV items only (`TV 1`, `TV 3`, `TV 13`)
- Target screens for web frontend handoff:
  - Main Chat screen
  - Simulation screen
  - Calendar screen

### Naming convention (frontend)
- State variables: `camelCase`
- API payload keys: backend contract key names exactly
- Boolean: `is*`, `has*`, `can*`
- Arrays: plural nouns (`messages`, `templates`, `calendarEvents`)
- IDs: `*Id` suffix (`chatSessionId`, `templateId`, `eventId`)

### 1) Main Chat screen variables (TV 1 + TV 3 + TV 13)

#### Layout / navigation
- `activePanel`: `"chat" | "simulation" | "calendar"`
- `sidebarItems`: `Array<{ key: string; label: string; icon?: string }>`
- `isSidebarOpen`: `boolean`

#### Chat state
- `chatSessionId`: `string | null`
- `chatSessions`: `Array<ChatSessionSummary>`
- `messages`: `Array<ChatMessage>`
- `chatInput`: `string`
- `isSendingMessage`: `boolean`
- `isLoadingMessages`: `boolean`
- `chatError`: `string | null`

#### MBTI control state (applied in chat)
- `mbtiEnergy`: `"E" | "I"`
- `mbtiInformation`: `"S" | "N"`
- `mbtiDecision`: `"F" | "T"`
- `mbtiLifestyle`: `"P" | "J"`
- `isUpdatingMbti`: `boolean`
- `mbtiUpdatedAt`: `string | null`

#### Comparison / multi-response state
- `isCompareMode`: `boolean`
- `selectedCompareTraits`: `Array<"E" | "I" | "S" | "N" | "F" | "T" | "P" | "J">`
- `compareResponses`: `Array<{ trait: string; content: string }>`
- `isGeneratingCompare`: `boolean`

#### Template state (TV 13)
- `templates`: `Array<PromptTemplateItem>`
- `selectedTemplateId`: `string | null`
- `selectedTemplateContent`: `string`
- `isLoadingTemplates`: `boolean`

#### Rating / feedback state
- `targetMessageIdForRating`: `string | null`
- `responseRatingScore`: `number | null`  // expected 1..5
- `responseRatingComment`: `string`
- `feedbackCategory`: `string`
- `feedbackContent`: `string`
- `isSubmittingRating`: `boolean`
- `isSubmittingFeedback`: `boolean`

#### Suggested TS interfaces for frontend
- `ChatSessionSummary`
  - `id: string`
  - `title: string | null`
  - `updatedAt: string`
  - `_count?: { messages: number }`
- `ChatMessage`
  - `id: string`
  - `chatSessionId: string`
  - `role: "USER" | "ASSISTANT" | "SYSTEM"`
  - `content: string`
  - `createdAt: string`
- `PromptTemplateItem`
  - `id: string`
  - `title: string`
  - `content: string`
  - `category: string | null`
  - `isActive: boolean`

### 2) Simulation screen variables (TV 1 layout + simulation panel operation)

#### Scenario input / state
- `scenarioId`: `string | null`
- `scenarioTitle`: `string`
- `scenarioDescription`: `string`
- `scenarioContext`: `string`
- `isCreatingScenario`: `boolean`
- `isUpdatingScenario`: `boolean`
- `scenarioError`: `string | null`

#### Participant / persona selection
- `simulationParticipants`: `Array<SimulationParticipant>`
- `selectedParticipantIds`: `string[]`
- `maxSimulationTurns`: `number`   // ex) 6, 8, 10
- `currentTurn`: `number`

#### Simulation output
- `simulationMessages`: `Array<SimulationMessage>`
- `isRunningSimulation`: `boolean`
- `simulationRunStatus`: `"idle" | "running" | "done" | "failed"`

#### Suggested TS interfaces for frontend
- `SimulationParticipant`
  - `id: string`
  - `name: string`
  - `mbtiType: string` // ex) "INTJ"
  - `profileImage?: string`
- `SimulationMessage`
  - `id: string`
  - `speakerId: string`
  - `speakerName: string`
  - `content: string`
  - `turn: number`
  - `createdAt: string`

### 3) Calendar screen variables (TV 1 sidebar navigation + calendar feature usage)

#### Calendar view / navigation
- `calendarViewMode`: `"month" | "week" | "work_week" | "day" | "agenda"`
- `calendarCurrentDate`: `string` // ISO date
- `calendarSelectedDate`: `string | null`
- `calendarRangeStart`: `string | null`
- `calendarRangeEnd`: `string | null`

#### Event list / CRUD form
- `calendarEvents`: `Array<CalendarEventItem>`
- `selectedEventId`: `string | null`
- `eventFormTitle`: `string`
- `eventFormDescription`: `string`
- `eventFormStartAt`: `string`
- `eventFormEndAt`: `string`
- `eventFormIsAllDay`: `boolean`
- `eventFormNotificationType`: `"none" | "email" | "push" | "both"`
- `isSavingEvent`: `boolean`
- `isDeletingEvent`: `boolean`
- `calendarError`: `string | null`

#### Suggested TS interface for frontend
- `CalendarEventItem`
  - `id: string`
  - `title: string`
  - `description: string | null`
  - `startAt: string`
  - `endAt: string`
  - `isAllDay: boolean`
  - `notificationType?: string | null`
  - `createdAt?: string`
  - `updatedAt?: string`

### Backend API mapping for frontend variables
- Main Chat
  - `GET /api/chat/sessions` -> `chatSessions`
  - `POST /api/chat/sessions` -> new `chatSessionId`
  - `GET /api/chat/sessions/:id` -> `messages`
  - `POST /api/chat/sessions/:id/messages` -> append `messages`
  - `GET /api/mbti` -> `mbtiEnergy`, `mbtiInformation`, `mbtiDecision`, `mbtiLifestyle`
  - `PUT /api/mbti` -> MBTI update
  - `GET /api/templates` -> `templates`
  - `POST /api/ratings` -> rating submit
  - `POST /api/feedback` -> feedback submit
- Auth/session
  - `GET /auth/google`
  - `GET /auth/google/callback`
  - `POST /auth/logout`
  - `GET /api/me`
  - `PATCH /api/me`
  - `DELETE /api/me`

### Frontend usage note
- All authenticated API calls must include credentials:
  - fetch option: `credentials: "include"`
- Do not send `userId` from client for ownership logic.
  - Backend resolves owner from session `req.user.id`.

### Added handoff file
- `docs/frontend-api-types.example.ts`
  - Includes frontend request/response interfaces aligned to current backend APIs.
  - Includes minimal `apiFetch<T>()` helper with `credentials: "include"`.
  - Intended to be copied into frontend repository and adjusted per UI framework.
