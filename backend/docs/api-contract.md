# API Contract

## Simulation Page

Base path: `/api/simulation`  
Auth: Required (`session`, `credentials: include`)

### simulationTemplate

#### GET `/api/simulation/simulationTemplate`
- Purpose: 현재 로그인 사용자 템플릿 목록 조회
- Response
```json
{
  "simulationTemplate": [
    { "id": "cuid", "content": "string" }
  ]
}
```

#### POST `/api/simulation/simulationTemplate`
- Request
```json
{ "content": "string" }
```
- Response
```json
{
  "simulationTemplate": { "id": "cuid", "content": "string" }
}
```

#### DELETE `/api/simulation/simulationTemplate/:id`
- Response
```json
{ "id": "cuid" }
```

### userProfiles

#### GET `/api/simulation/userProfiles`
- Response
```json
{
  "userProfiles": [
    { "id": "cuid", "name": "string", "meOrNot": true, "mbti": "ENFP" }
  ]
}
```

#### POST `/api/simulation/userProfiles`
- Request
```json
{ "name": "string", "meOrNot": true, "mbti": "ENFP" }
```
- Response
```json
{
  "userProfiles": { "id": "cuid", "name": "string", "meOrNot": true, "mbti": "ENFP" }
}
```

#### DELETE `/api/simulation/userProfiles/:id`
- Response
```json
{ "id": "cuid" }
```

### chatMessage

#### GET `/api/simulation/chatMessage`
- Response
```json
{
  "chatMessage": [
    {
      "id": "cuid",
      "role": "user",
      "content": "string",
      "mbtiRange": { "eValue": 50, "sValue": 50, "fValue": 50, "pValue": 50 },
      "createdAt": "2026-04-07T07:33:00.000Z",
      "rate": 4
    }
  ]
}
```

#### POST `/api/simulation/chatMessage`
- Request
```json
{
  "role": "user",
  "content": "string",
  "mbtiRange": { "eValue": 70, "sValue": 40, "fValue": 65, "pValue": 55 },
  "rate": 5
}
```
- Response
```json
{
  "chatMessage": {
    "id": "cuid",
    "role": "user",
    "content": "string",
    "mbtiRange": { "eValue": 70, "sValue": 40, "fValue": 65, "pValue": 55 },
    "createdAt": "2026-04-07T07:33:00.000Z",
    "rate": 5
  }
}
```

#### PATCH `/api/simulation/chatMessage/:id`
- Request (partial update)
```json
{
  "content": "updated content",
  "mbtiRange": { "eValue": 45 },
  "rate": 3
}
```
- Response
```json
{
  "chatMessage": {
    "id": "cuid",
    "role": "ai",
    "content": "updated content",
    "mbtiRange": { "eValue": 45, "sValue": 50, "fValue": 50, "pValue": 50 },
    "createdAt": "2026-04-07T07:33:00.000Z",
    "rate": 3
  }
}
```

#### DELETE `/api/simulation/chatMessage/:id`
- Response
```json
{ "id": "cuid" }
```

---

## Interop Compatibility Endpoints

These aliases are added to match frontend/backed collaboration comments.

### MBTI
- Existing: `GET/PUT /api/mbti`
- Added aliases:
  - `POST /api/mbti` (same behavior as PUT)
  - `GET/POST/PUT /api/mbtiRange` (mounted alias to same controller)

Supported request body formats for MBTI weights:
- `mbtiWeights.energy/information/decision/lifestyle`
- `energyWeight/informationWeight/decisionWeight/lifestyleWeight`
- `mbtiRange.eValue/sValue/fValue/pValue`
- `eValue/sValue/fValue/pValue`

### Chat
- Existing: `POST /api/chat/sessions/:id/messages`
- Added aliases:
  - `POST /api/chatMessage` (body must include `chatSessionId` or `sessionId` or `id`)
  - `POST /api/chatMessage/:id`

### Main Chat (frontend `FullMainScreen` flat API)

Base path: `/api/chat`  
Auth: Required (`credentials: include`)

Uses a dedicated session per user with `title: "Main Chat"` (auto-created). Response bodies are a **JSON array** of messages (same shape the frontend types as `ChatMessage[]`).

#### GET `/api/chat`
- Response `200`: `[{ "id", "role": "user"|"ai", "content", "mbtiRange": { "eValue", "sValue", "fValue", "pValue" }, "createdAt", "rate"? }, ...]`
- `mbtiRange` on each row reflects the user’s current `MbtiPreference` weights (DB does not store per-message sliders).
- `rate` (1–5) is included when a `ResponseRating` exists for that message.

#### POST `/api/chat`
- Request: `{ "content": "string", "role"?: "user", "mbtiRange"?: { "eValue", "sValue", "fValue", "pValue" } }` (same fields the frontend sends; `role` is ignored for authorship — always stored as user turn).
- Runs the same OpenAI pipeline as `POST .../sessions/:id/messages`.
- Response `200`: full `ChatMessage[]` for the Main Chat session after the assistant reply.

#### PATCH `/api/chat/:messageId`
- Request: `{ "rate": 1 }` … `{ "rate": 5 }` (integer; `score` alias accepted).
- Only `ASSISTANT` messages can be rated. Upserts the latest `ResponseRating` for `(user, messageId)`.
- Response `200`: full `ChatMessage[]` for that session (optional for clients that only update local state).

### Show Both (Main Chat right panel)

Base path: `/api/showBoth`  
Auth: Required (`session`, `credentials: include`)

#### POST `/api/showBoth`
- Purpose: 프론트 `RightScreen`에서 선택한 축(EI/SN/FT/PJ)을 사용자 MBTI 설정에 저장한다. 요청 본문은 **JSON 배열**이다 (`JSON.stringify(["EI","SN"])` 와 동일).
- Request (Content-Type: `application/json`)
```json
["EI", "SN"]
```
- 허용 코드(대소문자 무시, 중복 제거): `EI`, `SN`, `FT`, `PJ`
- Response `200`
```json
{
  "ok": true,
  "showBothAxes": ["EI", "SN"]
}
```
- Errors: `400` if body is not a JSON array.

`MbtiPreference.showBothAxes`에 반영되며, `GET /api/mbtiRange` 응답의 `mbti` 객체에도 포함된다(이후 메인 챗에서 이중 응답 생성 시 사용할 수 있음).

### Auth bypass for local interop test
- `DEV_AUTH_BYPASS=true` in development enables temporary auth bypass in `requireAuth`.
- Use only local dev; keep `false` in production.
