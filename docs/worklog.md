## [2026-04-07 19:00] 변수명·API 계약 색인 (누적 참고)
### Type
Docs

### Request Summary
메인챗·MBTI·OpenAI 연동에 쓰인 요청/응답·DB·환경 변수 이름을 worklog 한곳에서 찾을 수 있게 정리.

### Problem / Goal
구현이 여러 파일에 흩어져 키 이름을 빠르게 찾기 어렵다.

### Detailed Changes — 변수·필드 색인

**환경 변수 (.env):** `NODE_ENV`, `PORT`, `DATABASE_URL`, `SESSION_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_CALLBACK_URL`, `CLIENT_ORIGIN`, `AUTH_SUCCESS_REDIRECT`, `AUTH_FAILURE_REDIRECT`, `ACCOUNT_DELETE_MODE`, `OPENAI_API_KEY`, `OPENAI_MODEL`, `OPENAI_TEMPERATURE`, `OPENAI_MAX_TOKENS`, `CHAT_MAX_MESSAGES`.

**`MbtiPreference`:** `energy`, `information`, `decision`, `lifestyle`, `energyWeight`, `informationWeight`, `decisionWeight`, `lifestyleWeight` (가중치 0–100은 각 행 왼쪽 극 E,S,F,P 비율).

**`POST /api/chat/sessions/:id/messages` 바디:** `content`, `text`, `mbtiWeights`, `energyWeight`, `informationWeight`, `decisionWeight`, `lifestyleWeight`, `persistMbtiWeights`.

**응답:** `userMessage`, `assistantMessage`, `appliedMbti`.

**`PUT /api/mbti` 바디:** 글자 필드 + `mbtiWeights` 또는 개별 `*Weight`.

**OpenAI:** `getChatCompletion(messages)` — 각 항목 `role`, `content`.

상세 문서: `docs/MAIN_CHAT_API.md`, 타입: `docs/frontend-api-types.example.ts`.

### Files Changed
- `docs/worklog.md`: 본 색인.

### Result
변수명·계약 키를 worklog에서 한 번에 검색 가능.

---

## [2026-04-07 18:00] OpenAI GPT-4o mini 연동 (메인챗 메시지 + /api/ai)
### Type
Feature

### Request Summary
메인챗 `POST /api/chat/sessions/:id/messages` 및 레거시 `/api/ai` 응답을 OpenAI Chat Completions `gpt-4o-mini`로 생성하도록 연동.

### Problem / Goal
플레이스홀더 응답만 저장되는 상태를 실제 모델 응답으로 교체. API 키는 저장소에 넣지 않고 `.env`만 사용.

### Root Cause Analysis
`openAiService.js`가 에코 플레이스홀더였고 `chat.controller`가 로컬 문자열만 저장함.

### Implementation Plan
1. `getChatCompletion(messages)` 구현 (Bearer, `OPENAI_MODEL` 기본 `gpt-4o-mini`).
2. 채팅: 시스템(MBTI 지시문) + 최근 메시지 히스토리로 멀티턴 요청, 실패 시 DB에 에러 문구 저장.
3. `getAiResponse`/`compareMessages`를 Completions 기반으로 갱신.
4. `.env.example`·`.gitignore`·문서 갱신. 채팅에 노출된 키는 폐기 안내.

### Files Changed
- `src/services/openAiService.js`: Chat Completions 호출, `compareMessages` 병렬 2회 호출.
- `src/controllers/chat.controller.js`: 히스토리 슬라이스, `getChatCompletion` 연동.
- `src/controllers/aiController.js`: 실제 `reply` 텍스트 반환.
- `.env.example`: `OPENAI_*`, `CHAT_MAX_MESSAGES`.
- `.gitignore`: `.env` 추가.
- `CHANGELOG.md`, `docs/worklog.md`: 본 항목.

### Detailed Changes
- 기본 모델: `gpt-4o-mini` ([모델 문서](https://developers.openai.com/api/docs/models/gpt-4o-mini)).
- 환경 변수: `OPENAI_API_KEY`, 선택 `OPENAI_MODEL`, `OPENAI_TEMPERATURE`, `OPENAI_MAX_TOKENS`, `CHAT_MAX_MESSAGES`.

### Risks / Edge Cases
- 키 미설정 시 예외 → 사용자에게 에러 문자열이 어시스턴트 메시지로 저장됨.
- 긴 히스토리 시 토큰 초과 가능 → `CHAT_MAX_MESSAGES`로 완화(추후 토큰 기준 자르기 권장).

### Verification
- `node -e "import('./src/app.js')"` 스모크 통과.

### Result
OpenAI 연동 코드 반영 완료. 운영 키는 로컬 `.env`에만 설정.

### Follow-up
- 채팅에 노출된 API 키 즉시 폐기·재발급.
- 이미 Git에 `.env`를 올렸다면 히스토리에서 제거 및 키 교체.

---

## [2026-04-07 16:40] Main Chat 백엔드 — 프론트 RangeBar 정렬 MBTI 가중치
### Type
Feature

### Request Summary
`MBTInduce_frontend` 메인챗 UI(RangeBar 0–100%, TextInputBox)에 맞춰 메인챗용 백엔드 계약·저장 로직을 확장할 것.

### Problem / Goal
프론트는 슬라이더로 차원별 비율을 쓰지만 백엔드는 이진 MBTI 글자만 저장·반영하고 있어, TV 메인챗 요구와 불일치. 프론트 폴더는 수정하지 않고 백엔드만 정렬할 것.

### Root Cause Analysis
`MbtiPreference`에 연속 가중치 필드가 없고, `POST .../messages`가 글자 기반 지시문만 생성함.

### Implementation Plan
1. Prisma에 0–100 가중치 4필드 추가 및 마이그레이션.
2. `mbtiPrompt.js`로 RangeBar 의미(E/S/F/P %) 문서화 및 지시문 생성.
3. `PUT /api/mbti`에서 `mbtiWeights`/개별 weight 및 글자 병행 처리.
4. `POST .../messages`에서 `content`|`text`, 가중치 병합, 선택적 DB 반영, `appliedMbti` 응답.
5. `docs/MAIN_CHAT_API.md`, 타입 예시, CHANGELOG, 본 worklog 반영.

### Files Changed
- `prisma/schema.prisma`: MBTI 슬라이더용 Int 4필드.
- `prisma/migrations/20260407063143_add_mbti_slider_weights/migration.sql`: DB 컬럼 추가(마이그레이션 생성됨).
- `src/lib/mbtiPrompt.js`: 가중치 정규화, 글자 도출, 가중 지시문 문자열.
- `src/controllers/mbti.controller.js`: upsert 시 weight·mbtiWeights·글자 병합.
- `src/controllers/chat.controller.js`: 메시지 바디 `text`/가중치/persist/appliedMbti.
- `docs/MAIN_CHAT_API.md`: 프론트 컴포넌트명 ↔ API 계약.
- `docs/frontend-api-types.example.ts`: 타입 갱신.
- `CHANGELOG.md`: Unreleased 요약.
- `docs/worklog.md`: 본 항목.

### Detailed Changes
- 슬라이더 의미: 각 값은 해당 행의 **왼쪽 극(E, S, F, P)** 으로의 백분율.
- 메시지 전송 시 가중치가 오면 기본적으로 `MbtiPreference` upsert로 동기화(`persistMbtiWeights: false`로 한 턴만 반영 가능).
- 어시스턴트 답변 본문은 여전히 플레이스홀더이나 접두사에 가중 지시문 포함(향후 AI 서비스 레이어가 동일 스냅샷 사용).

### Alternatives Considered
- JSON 단일 필드로 weight 저장: 쿼리·마이그레이션 단순하나 관리자/지표에서 컬럼 접근이 불리해 4 Int 컬럼 채택.

### Risks / Edge Cases
- 기존 사용자 행은 신규 컬럼 기본값 50. 글자 필드(예: OAuth 기본 ESTJ)와 50–50 근처 해석은 UI에서 재조정 가능.
- `appliedMbti`가 없는 경우: MBTI 행이 없고 가중치도 없을 때.

### Verification
- `npx prisma migrate dev` 적용 성공(로컬 DB).
- `node -e "import('./src/app.js')"` 스모크 통과.

### Result
메인챗용 MBTI 슬라이더 스냅샷 저장·메시지 API 반영·프론트 전달 문서화 완료.

### Follow-up
- OpenAI(또는 기존 `openAiService`)를 `postMessage`에 연결.
- Show Both / 듀얼 응답용 별도 엔드포인트.
