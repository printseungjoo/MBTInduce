# MBTInduce API

---

## Table of contents

1. [Common conventions](#1-common-conventions)
2. [Health check](#2-health-check)
3. [Authentication (OAuth · session)](#3-authentication-oauth--session)
4. [Authentication API (local signup/login)](#4-authentication-api-local-signuplogin)
5. [Profile](#5-profile)
6. [User (`/api/me`)](#6-user-apime)
7. [MBTI preferences](#7-mbti-preferences)
8. [Show Both axes](#8-show-both-axes)
9. [Main chat (frontend flat, `/api/chat`)](#9-main-chat-frontend-flat-apichat)
10. [Chat sessions (`/api/chatMessage`)](#10-chat-sessions-apichatmessage)
11. [AI utilities (`/api/ai`)](#11-ai-utilities-apiai)
12. [History](#12-history)
13. [Calendar events](#13-calendar-events)
14. [Simulation CRUD (`/api/simulation`)](#14-simulation-crud-apisimulation)
15. [Simulation page (`/api/*` legacy routes)](#15-simulation-page-api-legacy-routes)
16. [Ratings · feedback · templates (extra)](#16-ratings--feedback--templates-extra)
17. [Admin API](#17-admin-api)
18. [Data model summary](#18-data-model-summary)
19. [Environment variables](#19-environment-variables)

---

## 1. Common conventions

### 1.1 Authentication

Most `/api/*` endpoints require **session cookie** authentication.

| Item | Description |
|------|-------------|
| Cookie name | `mbtinduce.sid` |
| Store | PostgreSQL `user_sessions` (when `DATABASE_URL` is set) |
| Unauthenticated | `401` `{ "message": "Unauthorized" }` |
| Suspended account | `403` `{ "message": "Account suspended" }` |
| Deleted account | `403` `{ "message": "Account deleted" }` |

**Development-only bypass** (`NODE_ENV=development`):

| Variable | Description |
|----------|-------------|
| `DEV_AUTH_BYPASS=true` | Proceed as a test user without a session |
| `DEV_AUTH_USER_ID` | Bypass user ID (default `dev-bypass-user`) |
| `DEV_AUTH_ROLE` | `USER` or `ADMIN` (default `USER`) |

Admin-only APIs additionally require `req.user.role === "ADMIN"` → `403` `{ "success": false, "message": "Admin permission required" }`

Emails listed in `ADMIN_EMAILS` (comma-separated in `.env`) are assigned `ADMIN` on local signup/login and Google OAuth; existing `USER` rows are promoted on next login. OAuth success redirects admins to `AUTH_ADMIN_SUCCESS_REDIRECT` (default `{AUTH_SUCCESS_REDIRECT}/admin`).

### 1.2 Response envelopes (3 patterns)

**A. `{ success, data | message }`** — profile, history, calendar, admin (`/api/admin/*`)

```json
{ "success": true, "data": { } }
{ "success": false, "message": "description" }
```

**B. `{ message }`** — chat sessions, OAuth logout, some simulation routes, global error handler

**C. Domain wrappers** — `{ user }`, `{ mbti }`, `{ sessions }`, `{ simulationTemplate }`, etc.

Global 404: `{ "message": "Route not found" }`  
Global 500: `{ "message": "Internal server error" }`

### 1.3 MBTI 16 types

`ISTJ`, `ISFJ`, `INFJ`, `INTJ`, `ISTP`, `ISFP`, `INFP`, `INTP`, `ESTP`, `ESFP`, `ENFP`, `ENTP`, `ESTJ`, `ESFJ`, `ENFJ`, `ENTJ` (case-insensitive; stored uppercase)

### 1.4 MBTI slider weights (0–100)

| Field | Axis | 0% pole | 100% pole |
|-------|------|---------|-----------|
| `eValue` / `energyWeight` | E/I | I | E |
| `sValue` / `informationWeight` | S/N | N | S |
| `fValue` / `decisionWeight` | F/T | T | F |
| `pValue` / `lifestyleWeight` | P/J | J | P |

Requests may use `mbtiWeights`, `mbtiRange`, or flat `eValue`/`sValue`/`fValue`/`pValue` aliases.

---

## 2. Health check

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/` | None | Server liveness. `200` text `MBTInduce Backend Running` |

---

## 3. Authentication (OAuth · session)

Mount: `/auth`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/auth/google` | None | Start Google OAuth. `503` if not configured |
| `GET` | `/auth/google/callback` | None | OAuth callback. On success, redirect to `AUTH_SUCCESS_REDIRECT` (default `http://localhost:5173`) |
| `GET` | `/auth/google/failure` | None | On failure, redirect to `AUTH_FAILURE_REDIRECT` (default `http://localhost:5173/login?error=oauth_failed`) |
| `POST` | `/auth/logout` | Required | End session. `200` `{ "message": "Logged out" }` |
| `DELETE` | `/auth/withdraw` | Required | Delete account then end session. `ACCOUNT_DELETE_MODE`: `SOFT` (default) or `HARD`. `200` `{ "message": "Account deleted" }` |

---

## 4. Authentication API (local signup/login)

Mount: `/api/auth`  
Response envelope: **A**

### `POST /api/auth/signup`

Local signup + automatic login (session created).

**Request body**

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `email` | string | ✓ | Valid email format |
| `password` | string | ✓ | At least 8 characters |
| `nickname` | string | ✓ | Non-empty |
| `mbti` | string | | One of 16 types (if omitted, default E/S/T/J preference is created) |

**Responses**

| Status | body |
|--------|------|
| `201` | `{ "success": true, "data": ProfilePayload }` |
| `400` | `{ "success": false, "message": "..." }` |
| `409` | Duplicate email |

**ProfilePayload** (`data`)

```json
{
  "id": "cuid",
  "email": "user@example.com",
  "nickname": "nickname",
  "mbti": "INTJ"
}
```

### `POST /api/auth/login`

**Request:** `{ "email", "password" }` (both required)

**Response:** `200` + ProfilePayload (same as above). On failure: `401`.

### `POST /api/auth/logout`

Auth required. `200` `{ "success": true, "data": null }`

### `GET /api/auth/me`

Auth required. `200` + ProfilePayload.

---

## 5. Profile

Mount: `/api/profile`  
Envelope: **A**

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/api/profile` | None | Same as `POST /api/auth/signup` (signup) |
| `GET` | `/api/profile` | Required | Current user profile |
| `PATCH` | `/api/profile` | Required | Update nickname/MBTI |

**PATCH body** (at least one field)

| Field | Description |
|-------|-------------|
| `nickname` | Non-empty string |
| `mbti` | 16-type code |

`200` → ProfilePayload.

---

## 6. User (`/api/me`)

Mount: `/api` (`userRoutes`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/api/me` | Required | User details |
| `PATCH` | `/api/me` | Required | Nickname · profile image |
| `DELETE` | `/api/me` | Required | Soft delete + logout |

**GET/PATCH `user` object fields:** `id`, `email`, `nickname`, `profileImage`, `role`, `status`, (`GET` only) `lastLoginAt`, `createdAt`

**PATCH body:** `nickname?`, `profileImage?` (strings)

**DELETE:** `200` `{ "message": "Account deleted" }`

---

## 7. MBTI preferences

Mount: `/api/mbti`, `/api/mbtiRange` (**same router**)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/api/mbti` | Required | Fetch `MbtiPreference` |
| `POST` | `/api/mbti` | Required | Create/update (upsert) |
| `PUT` | `/api/mbti` | Required | Same as `POST` |

**GET Response**

```json
{
  "mbti": {
    "id": "...",
    "userId": "...",
    "energy": "E",
    "information": "S",
    "decision": "T",
    "lifestyle": "J",
    "energyWeight": 50,
    "informationWeight": 50,
    "decisionWeight": 50,
    "lifestyleWeight": 50,
    "showBothAxes": ["EI", "SN"],
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

(`null` if no preference exists)

**POST/PUT body** (all optional; letters derived from weights)

| Field | Description |
|-------|-------------|
| `energy`, `information`, `decision`, `lifestyle` | `E`/`I`, `S`/`N`, `F`/`T`, `P`/`J` |
| `mbtiWeights` | `{ energy, information, decision, lifestyle }` (0–100) |
| `mbtiRange` | `{ eValue, sValue, fValue, pValue }` |
| `energyWeight`, `informationWeight`, `decisionWeight`, `lifestyleWeight` | Flat weights |
| `eValue`, `sValue`, `fValue`, `pValue` | Flat aliases |

**Response:** `200` `{ "mbti": <MbtiPreference> }`

---

## 8. Show Both axes

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/api/showBoth` | Required | Persist axis codes selected in the UI |

**Request body:** JSON array, e.g. `["EI", "SN"]`  
Allowed codes: `EI`, `SN`, `FT`, `PJ` (deduplicated, case-insensitive)

**Response**

```json
{
  "ok": true,
  "showBothAxes": ["EI", "SN"]
}
```

---

## 9. Main chat (frontend flat, `/api/chat`)

**ChatMessage[]** format for frontend `FullMainScreen`. Uses OpenAI `gpt-4o-mini`.

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/api/chat` | Required | List messages (auto-creates session if missing) |
| `POST` | `/api/chat` | Required | Send message + AI reply; returns full array |
| `PATCH` | `/api/chat/:messageId` | Required | Rate assistant message (1–5) |
| `DELETE` | `/api/chat` | Required | Delete session for context |

### Query (GET/DELETE)

| Parameter | Default | Description |
|-----------|---------|-------------|
| `pageType` | `main` | `main` or `simulation` |
| `simulationKey` | `""` | Required when `pageType=simulation` |

### POST body

| Field | Required | Description |
|-------|----------|-------------|
| `content` | ✓ | User message (`text` alias supported) |
| `mbtiRange` | | `{ eValue, sValue, fValue, pValue }` |
| `mbtiWeights`, flat weights | | See [§1.4](#14-mbti-slider-weights-0-100) |
| `persistMbtiWeights` | | If `false`, weights are not saved to DB (default `true`) |
| `pageType`, `simulationKey` | | Same as GET |

### ChatMessage (array element)

```json
{
  "id": "cuid",
  "role": "user",
  "content": "...",
  "mbtiRange": { "eValue": 50, "sValue": 50, "fValue": 50, "pValue": 50 },
  "createdAt": "2026-05-23T00:00:00.000Z",
  "rate": 4
}
```

- `role`: `user` | `ai`
- `rate`: Assistant messages only, when rated

### PATCH `/api/chat/:messageId`

**Body:** `{ "rate": 1 }` or `{ "score": 1 }` (integer 1–5)

**Response:** Updated ChatMessage[] (`200`)

### DELETE

On success: `200` + `[]`. `404` if no session.

---

## 10. Chat sessions (`/api/chatMessage`)

Session-based chat + OpenAI. Mount: `/api/chatMessage`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/api/chatMessage/sessions` | Required | List my sessions (includes `_count.messages`) |
| `POST` | `/api/chatMessage/sessions` | Required | Create session |
| `GET` | `/api/chatMessage/sessions/:id` | Required | Session + messages |
| `PATCH` | `/api/chatMessage/sessions/:id` | Required | Rename session |
| `DELETE` | `/api/chatMessage/sessions/:id` | Required | Delete session (cascades messages/ratings; history `chatSessionId` set null) |
| `POST` | `/api/chatMessage/sessions/:id/messages` | Required | Send message + AI reply |
| `POST` | `/api/chatMessage` | Required | Compat: `chatSessionId` / `sessionId` / `id` in body |

### Create session

**Body:** `{ "title": "New Chat" }` (optional, default `"New Chat"`)

**Response:** `201` `{ "session": ChatSession }`

### Send message

**Body**

| Field | Required | Description |
|-------|----------|-------------|
| `content` | ✓ | (`text` alias supported) |
| MBTI weight fields | | Same as [§7](#7-mbti-preferences) |
| `persistMbtiWeights` | | Default `true` |

**Response `201`**

```json
{
  "userMessage": { "id", "chatSessionId", "role": "USER", "content", "createdAt" },
  "assistantMessage": { "id", "role": "ASSISTANT", "content", "createdAt" },
  "appliedMbti": {
    "energy", "information", "decision", "lifestyle",
    "energyWeight", "informationWeight", "decisionWeight", "lifestyleWeight"
  }
}
```

On AI failure, assistant `content` is prefixed with `[AI response generation failed] ...` (Korean prefix may appear in runtime messages from the server).

### PATCH session title

**Body:** `{ "title": "..." }` (1–200 chars, trimmed)

**Response:** `200` `{ "session": ... }`

### DELETE session

**Response:** `200` `{ "id": "<sessionId>" }`

> **Note:** `POST /api/chatMessage` (root) is the compat message sender. It **overlaps** with simulation page `POST /api/chatMessage` ([§15](#15-simulation-page-api-legacy-routes)). Express registration order may match compat first.

---

## 11. AI utilities (`/api/ai`)

**No authentication** (OpenAI API key required)

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/ai/respond` | Single message + traits-based reply |
| `POST` | `/api/ai/compare` | Compare two messages |

### `POST /api/ai/respond`

**Body**

| Field | Required |
|-------|----------|
| `message` | ✓ (string) |
| `traits` | Array (default `[]`) |

**Response:** `200` `{ "reply": "<string>" }`

### `POST /api/ai/compare`

**Body**

| Field | Required |
|-------|----------|
| `messageA` | ✓ |
| `messageB` | ✓ |
| `traits` | Array (optional) |

**Response:** `200` `{ "result": <comparison> }`

---

## 12. History

Mount: `/api/history`  
Envelope: **A**

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/api/history` | Required | List (pagination · filters) |
| `POST` | `/api/history` | Required | Create record |
| `GET` | `/api/history/:id` | Required | Detail (includes `content`) |
| `DELETE` | `/api/history/:id` | Required | Delete |

### GET Query

| Parameter | Default | Description |
|-----------|---------|-------------|
| `mbti` | | Filter by 16-type code |
| `sourceType` | | String |
| `search` | | `title`/`preview` ILIKE |
| `limit` | `20` | Max `100` |
| `page` | `1` | |

**Response `data`:** Array (list items)

```json
{
  "id", "chatSessionId", "title", "preview", "mbti", "sourceType", "createdAt", "updatedAt"
}
```

### POST body

| Field | Required |
|-------|----------|
| `title` | ✓ |
| `content` | ✓ |
| `preview` | |
| `mbti` | 16-type code |
| `sourceType` | |
| `chatSessionId` | Must be owned by current user |

**Response:** `201` + list-shaped object

---

## 13. Calendar events

Mount: `/api/calendarEvent`  
Envelope: **A**  
`event`/`events` responses **omit `userId`** (minimize exposure to frontend)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/api/calendarEvent` | Required | List (max 500) |
| `POST` | `/api/calendarEvent` | Required | Create |
| `GET` | `/api/calendarEvent/:id` | Required | Get one |
| `PATCH` | `/api/calendarEvent/:id` | Required | Update |
| `DELETE` | `/api/calendarEvent/:id` | Required | Delete |
| `POST` | `/api/calendarEvent/recommend` | Required | AI schedule recommendation |

### GET Query

| Parameter | Description |
|-----------|-------------|
| `start`, `end` | Both present or both omitted. ISO8601 or `YYYY-MM-DD` |
| `view` | Arbitrary string (echoed in response) |

**Response `data`**

```json
{
  "events": [ CalendarEvent ],
  "view": null
}
```

### CalendarEvent

```json
{
  "id", "title", "description", "startAt", "endAt", "allDay",
  "mbti", "planningNote", "createdAt", "updatedAt"
}
```

(Date fields are ISO8601 strings)

### POST create body

| Field | Required | Description |
|-------|----------|-------------|
| `title` | ✓ | |
| `allDay` | ✓ | boolean |
| `startAt`, `endAt` | ✓ | Valid dates; `endAt >= startAt` |
| `description`, `mbti`, `planningNote` | | |

When `allDay=true`, normalized to UTC calendar day bounds.

### PATCH

Partial update. At least one valid field.

### `POST /api/calendarEvent/recommend`

**Body**

| Field | Description |
|-------|-------------|
| `topic` | Optional, max 500 chars |
| `rangeStart`, `rangeEnd` | Both provided or omitted (default: today UTC 00:00 ~ +28 days) |

**Response `data`**

```json
{
  "targetReason": "empty",
  "recommendedDate": "2026-05-23",
  "dayEventCountBefore": 0,
  "range": { "start": "...", "end": "..." },
  "suggestion": {
    "title", "description", "allDay", "startAt", "endAt", "mbti", "planningNote"
  }
}
```

`targetReason`: `empty` (no events that day) | `sparse` (fewest events). On model failure, falls back to an all-day block on that UTC day.

---

## 14. Simulation CRUD (`/api/simulation`)

Mount: `/api/simulation`  
Envelope: **B** (`{ message }` / domain keys)

### 14.1 simulationTemplate

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/simulation/simulationTemplate` | List |
| `POST` | `/api/simulation/simulationTemplate` | Create |
| `PATCH` | `/api/simulation/simulationTemplate/:id` | Update |
| `DELETE` | `/api/simulation/simulationTemplate/:id` | Delete |

**Item:** `{ "id", "content" }`  
**POST body:** `{ "content": "..." }` (required)

### 14.2 userProfiles

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/simulation/userProfiles` | List |
| `POST` | `/api/simulation/userProfiles` | Create |
| `PATCH` | `/api/simulation/userProfiles/:id` | Update |
| `DELETE` | `/api/simulation/userProfiles/:id` | Delete |

**Item:** `{ "id", "name", "meOrNot", "mbti" }`  
**POST body:** `name` (string), `meOrNot` (boolean), `mbti` (string)

### 14.3 chatMessage (simulation-only)

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/simulation/chatMessage` | List |
| `POST` | `/api/simulation/chatMessage` | Create |
| `PATCH` | `/api/simulation/chatMessage/:id` | Update |
| `DELETE` | `/api/simulation/chatMessage/:id` | Delete |

**Item**

```json
{
  "id", "role": "user"|"ai", "content",
  "mbtiRange": { "eValue", "sValue", "fValue", "pValue" },
  "createdAt", "rate"
}
```

**POST body:** `role`, `content`, `mbtiRange` (required), `rate?`

---

## 15. Simulation page (`/api/*` legacy routes)

Mount: `/api` (`simulationPageRouter`) — **initial simulation screen APIs**

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/chatMessage` | Simulation chat list (no `mbtiRange`) |
| `POST` | `/api/chatMessage` | ⚠ Route conflict with [§10](#10-chat-sessions-apichatmessage) |
| `PATCH` | `/api/chatMessage/:id` | Update `rate` |
| `DELETE` | `/api/chatMessage/:id` | Delete |
| `GET` | `/api/simulationScenario` | Scenario list (`SimulationTemplate`) |
| `POST` | `/api/simulationScenario` | `{ "content" }` |
| `DELETE` | `/api/simulationScenario/:id` | |
| `GET` | `/api/userInfo` | Latest self profile (`meOrNot=true`) |
| `POST` | `/api/userInfo` | `{ "name", "mbti" }` upsert |
| `GET` | `/api/targetInfo` | Counterpart profile (`meOrNot=false`) |
| `POST` | `/api/targetInfo` | `{ "name", "mbti" }` upsert |

**Simulation chatMessage item:** `{ "id", "role", "content", "createdAt", "rate" }`

**userInfo/targetInfo:** `{ "id", "name", "mbti" }` or `null`

---

## 16. Ratings · feedback · templates (extra)

Mount: `/api` (`extraRouter`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/api/ratings` | Required | Create response rating |
| `POST` | `/api/feedback` | Required | Create feedback |
| `GET` | `/api/templates` | None | Active Main Chat `PromptTemplate` list (`kind: MAIN_CHAT`) |
| `GET` | `/api/simulation-question-templates` | None | Active Simulation `PromptTemplate` list (`kind: SIMULATION`) |

### `POST /api/ratings`

**Body:** `chatSessionId` (required), `score` (number, required), `messageId?`, `comment?`  
**Response:** `201` `{ "rating": ResponseRating }`

### `POST /api/feedback`

**Body:** `content` (required), `category?`  
**Response:** `201` `{ "feedback": Feedback }`

### `GET /api/templates`

**Response:** `200` `{ "templates": PromptTemplate[] }` (`isActive: true`, `kind: MAIN_CHAT` only)

### `GET /api/simulation-question-templates`

**Response:** `200` `{ "templates": PromptTemplate[] }` (`isActive: true`, `kind: SIMULATION` only)

---

## 17. Admin API

### 17.1 Admin API (`/api/admin`)

Envelope: **A**, `requireAuth` + `requireAdmin`

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/admin/statistics` | Dashboard statistics |
| `GET` | `/api/admin/feedback` | Feedback/rating list |
| `GET` | `/api/admin/main-chat-question-templates` | Main Chat question templates |
| `POST` | `/api/admin/main-chat-question-templates` | Create Main Chat template |
| `PATCH` | `/api/admin/main-chat-question-templates/:id` | Update Main Chat template |
| `DELETE` | `/api/admin/main-chat-question-templates/:id` | Delete Main Chat template |
| `GET` | `/api/admin/simulation-question-templates` | Simulation question templates |
| `POST` | `/api/admin/simulation-question-templates` | Create Simulation template |
| `PATCH` | `/api/admin/simulation-question-templates/:id` | Update Simulation template |
| `DELETE` | `/api/admin/simulation-question-templates/:id` | Delete Simulation template |
| `GET` | `/api/admin/question-templates` | **Legacy alias** — same as main-chat list |
| `POST` | `/api/admin/question-templates` | **Legacy alias** — create Main Chat template |
| `PATCH` | `/api/admin/question-templates/:id` | **Legacy alias** — update Main Chat template |
| `DELETE` | `/api/admin/question-templates/:id` | **Legacy alias** — delete Main Chat template |

**GET /statistics `data`**

```json
{
  "totalUsers": 257,
  "totalQuestions": 1032,
  "totalRatings": 1032,
  "averageRating": 4.3,
  "ratingStatistics": {
    "averageRating": 4.3,
    "totalRatings": 1032,
    "ratingCounts": { "1": 253, "2": 132, "3": 354, "4": 213, "5": 532 }
  },
  "totalChatSessions": 0,
  "totalHistoryRecords": 0,
  "totalCalendarEvents": 0
}
```

`ratingStatistics.ratingCounts` — number of `ResponseRating` rows per score (1–5); missing scores are `0`. Keys are numeric in application code (`ratingCounts[1]`); JSON may serialize keys as strings.

**GET /feedback Query:** `page`, `limit`, `rating?` (integer 1–5 filters `ResponseRating`; otherwise `Feedback`)

**Response `data`:** `{ "items", "page", "limit", "total" }`

**Question template fields:** `id`, `title`, `category`, `content`, `kind` (`MAIN_CHAT` \| `SIMULATION`), `isActive`, `createdAt`, `updatedAt`

Kind is set by route (not accepted in POST/PATCH body). Updating or deleting via the wrong route returns `404`.

**POST body:** `title`, `content` (required), `category?`, `isActive?` (default `true`)

### 17.2 Legacy admin (`/api/admin/*` on extraRouter)

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/admin/dashboard` | Users · queries · ratings · feedback summary |
| `POST` | `/api/admin/templates` | Create template |
| `PATCH` | `/api/admin/templates/:id` | Update template |
| `DELETE` | `/api/admin/templates/:id` | Delete template |

**dashboard Response:** `totalUsers`, `totalQueries`, `averageRating`, `ratingDistribution`, `feedbacks` (latest 50)

---

## 18. Data model summary

| Prisma model | Primary APIs |
|--------------|--------------|
| `User` | auth, profile, `/api/me` |
| `Account` | Google OAuth |
| `MbtiPreference` | `/api/mbti`, `/api/showBoth` |
| `ChatSession`, `Message` | `/api/chat`, `/api/chatMessage` |
| `SimulationChatMessage` | `/api/simulation/chatMessage`, `/api/chatMessage` (legacy) |
| `SimulationTemplate` | simulationTemplate, simulationScenario |
| `UserProfile` | userProfiles, userInfo, targetInfo |
| `HistoryRecord` | `/api/history` |
| `CalendarEvent` | `/api/calendarEvent` |
| `ResponseRating` | ratings, chat rate PATCH |
| `Feedback` | feedback |
| `PromptTemplate` | templates, simulation-question-templates, admin question-templates (`kind`: `MAIN_CHAT` \| `SIMULATION`) |

---

## 19. Environment variables

| Variable | Purpose |
|----------|---------|
| `PORT` | Server port (default 4000) |
| `DATABASE_URL` | PostgreSQL + session store |
| `SESSION_SECRET` | Session signing secret |
| `CLIENT_ORIGIN` | CORS allowed origins |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | OAuth |
| `AUTH_SUCCESS_REDIRECT`, `AUTH_FAILURE_REDIRECT` | OAuth redirects |
| `AUTH_ADMIN_SUCCESS_REDIRECT` | OAuth redirect for users with `role === ADMIN` (default: `{AUTH_SUCCESS_REDIRECT}/admin`) |
| `ADMIN_EMAILS` | Comma-separated emails auto-assigned `ADMIN` on signup/login |
| `OPENAI_API_KEY`, `OPENAI_MODEL` | AI (default `gpt-4o-mini`) |
| `CHAT_MAX_MESSAGES` | Chat history window (default 40) |
| `ACCOUNT_DELETE_MODE` | `SOFT` \| `HARD` |
| `DEV_AUTH_BYPASS`, `DEV_AUTH_USER_ID`, `DEV_AUTH_ROLE` | Development auth bypass |

---

## Appendix: Quick endpoint reference

| Method | Path |
|--------|------|
| `GET` | `/` |
| `GET` | `/auth/google` |
| `GET` | `/auth/google/callback` |
| `GET` | `/auth/google/failure` |
| `POST` | `/auth/logout` |
| `DELETE` | `/auth/withdraw` |
| `POST` | `/api/auth/signup` |
| `POST` | `/api/auth/login` |
| `POST` | `/api/auth/logout` |
| `GET` | `/api/auth/me` |
| `POST` | `/api/profile` |
| `GET` | `/api/profile` |
| `PATCH` | `/api/profile` |
| `GET` | `/api/me` |
| `PATCH` | `/api/me` |
| `DELETE` | `/api/me` |
| `GET` | `/api/mbti` |
| `POST` | `/api/mbti` |
| `PUT` | `/api/mbti` |
| `POST` | `/api/showBoth` |
| `GET` | `/api/chat` |
| `POST` | `/api/chat` |
| `PATCH` | `/api/chat/:messageId` |
| `DELETE` | `/api/chat` |
| `GET` | `/api/chatMessage/sessions` |
| `POST` | `/api/chatMessage/sessions` |
| `GET` | `/api/chatMessage/sessions/:id` |
| `PATCH` | `/api/chatMessage/sessions/:id` |
| `DELETE` | `/api/chatMessage/sessions/:id` |
| `POST` | `/api/chatMessage/sessions/:id/messages` |
| `POST` | `/api/chatMessage` |
| `POST` | `/api/ai/respond` |
| `POST` | `/api/ai/compare` |
| `GET` | `/api/history` |
| `POST` | `/api/history` |
| `GET` | `/api/history/:id` |
| `DELETE` | `/api/history/:id` |
| `GET` | `/api/calendarEvent` |
| `POST` | `/api/calendarEvent` |
| `GET` | `/api/calendarEvent/:id` |
| `PATCH` | `/api/calendarEvent/:id` |
| `DELETE` | `/api/calendarEvent/:id` |
| `POST` | `/api/calendarEvent/recommend` |
| `GET` | `/api/simulation/simulationTemplate` |
| `POST` | `/api/simulation/simulationTemplate` |
| `PATCH` | `/api/simulation/simulationTemplate/:id` |
| `DELETE` | `/api/simulation/simulationTemplate/:id` |
| `GET` | `/api/simulation/userProfiles` |
| `POST` | `/api/simulation/userProfiles` |
| `PATCH` | `/api/simulation/userProfiles/:id` |
| `DELETE` | `/api/simulation/userProfiles/:id` |
| `GET` | `/api/simulation/chatMessage` |
| `POST` | `/api/simulation/chatMessage` |
| `PATCH` | `/api/simulation/chatMessage/:id` |
| `DELETE` | `/api/simulation/chatMessage/:id` |
| `GET` | `/api/simulationScenario` |
| `POST` | `/api/simulationScenario` |
| `DELETE` | `/api/simulationScenario/:id` |
| `GET` | `/api/userInfo` |
| `POST` | `/api/userInfo` |
| `GET` | `/api/targetInfo` |
| `POST` | `/api/targetInfo` |
| `POST` | `/api/ratings` |
| `POST` | `/api/feedback` |
| `GET` | `/api/templates` |
| `GET` | `/api/simulation-question-templates` |
| `GET` | `/api/admin/statistics` |
| `GET` | `/api/admin/feedback` |
| `GET` | `/api/admin/main-chat-question-templates` |
| `POST` | `/api/admin/main-chat-question-templates` |
| `PATCH` | `/api/admin/main-chat-question-templates/:id` |
| `DELETE` | `/api/admin/main-chat-question-templates/:id` |
| `GET` | `/api/admin/simulation-question-templates` |
| `POST` | `/api/admin/simulation-question-templates` |
| `PATCH` | `/api/admin/simulation-question-templates/:id` |
| `DELETE` | `/api/admin/simulation-question-templates/:id` |
| `GET` | `/api/admin/question-templates` |
| `POST` | `/api/admin/question-templates` |
| `PATCH` | `/api/admin/question-templates/:id` |
| `DELETE` | `/api/admin/question-templates/:id` |
| `GET` | `/api/admin/dashboard` |
| `POST` | `/api/admin/templates` |
| `PATCH` | `/api/admin/templates/:id` |
| `DELETE` | `/api/admin/templates/:id` |

Alias: `/api/mbtiRange` → same as `/api/mbti`.

---


