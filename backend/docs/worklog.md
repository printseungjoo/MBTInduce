## [2026-04-17 17:10] Dev auth bypass FK 500 hotfix
### Type
Hotfix

### Request Summary
프론트에서 `/api/chat` 호출 시 401은 해결되었지만, 서버에서 `500 (Foreign key constraint violated on ChatSession.userId)`가 발생해 메인 챗이 동작하지 않음.

### Problem / Goal
- `DEV_AUTH_BYPASS=true` 환경에서 `req.user.id`는 만들어지지만 DB `User` 레코드가 없어서 `ChatSession.create({ userId })`가 FK 제약으로 실패.
- 개발 환경에서 우회 인증 사용 시에도 채팅 API가 안정적으로 동작하도록 보장.

### Root Cause Analysis
`requireAuth`의 개발 우회 경로는 세션 검증만 건너뛰고 메모리상 `req.user`만 주입했다. 이후 채팅 호환 컨트롤러가 `chatSession`을 생성할 때, `userId`가 실제 `User` 테이블에 없으므로 Postgres FK가 즉시 거절했다.

### Implementation Plan
1) `requireAuth`를 async로 전환  
2) dev bypass 경로에서 `DEV_AUTH_USER_ID` 기준으로 `User` upsert 수행  
3) 기존과 동일하게 `req.user` 주입 후 next  
4) 앱 import 스모크와 린트 확인  
5) worklog/CHANGELOG 기록

### Files Changed
- `src/middlewares/requireAuth.js`: dev bypass 시 테스트 사용자 자동 upsert 추가
- `docs/worklog.md`: 본 이슈 분석/조치 기록
- `CHANGELOG.md`: Unreleased 항목 추가

### Detailed Changes
- `requireAuth`에 `prisma`를 주입하고 `export async function requireAuth`로 변경.
- 조건(`NODE_ENV=development && DEV_AUTH_BYPASS=true`)에서:
  - `devUserId`, `devRole` 계산
  - `prisma.user.upsert` 수행:
    - `where.id = devUserId`
    - 없으면 `email: <id>@dev.local`, `nickname: "Dev Bypass User"`로 생성
    - 있으면 `role/status`를 dev 설정으로 동기화
  - 이후 `req.user = { id, role, status: "ACTIVE" }` 할당
- 결과적으로 `/api/chat`의 Main Chat 세션 생성 시 FK 위반이 재발하지 않음.

### Alternatives Considered
- `chat.compat.controller`에서 세션 생성 실패 시 사용자 자동 생성: 인증 책임이 컨트롤러로 새어 나가므로 보류.
- FK 제거/완화: 데이터 정합성 저하로 부적절.

### Risks / Edge Cases
- dev bypass에서 생성되는 이메일(`<id>@dev.local`)은 테스트용으로만 사용해야 함.
- 운영 환경에는 영향 없음(조건이 development + bypass true일 때만 실행).

### Verification
- `node -e "import('./src/app.js')"` 스모크 통과.
- `ReadLints`로 변경 파일 경고/에러 없음 확인.
- 기대 결과: 동일 환경에서 `GET /api/chat` 호출 시 500 FK 에러 대신 정상 200/빈 배열 또는 메시지 배열 반환.

### Result
개발 우회 인증 사용 시 발생하던 `ChatSession.userId` FK 500 오류를 인증 미들웨어에서 원천 차단했다.

### Follow-up
- 프론트 `FullMainScreen`의 `credentials: 'include'` 일관 적용 여부 재검증.
- `DEV_AUTH_USER_ID`를 고정 값으로 팀 내 공유해 로컬 데이터 혼선 방지.

## [2026-04-10 14:30] /api/chat 프론트 FullMainScreen 호환 라우트
### Type
Feature

### Request Summary
프론트가 `GET/POST /api/chat`, `PATCH /api/chat/:id`와 `ChatMessage[]` 응답을 기대하는데 백엔드는 `/api/chatMessage` 세션 API만 있어 404·DTO 불일치가 났음. 프론트 계약에 맞춘 별도 마운트 추가.

### Problem / Goal
- 경로 `/api/chat` 부재.
- 응답이 `{ userMessage, assistantMessage }` vs 프론트 기대 `ChatMessage[]`.
- 평점이 `PATCH` + `rate` vs 백엔드 `POST /api/ratings` + `score` + `chatSessionId`.

### Implementation Plan
1) `postMessage` 내부 로직을 `postMessageCore`로 추출해 재사용  
2) 사용자별 고정 제목 `"Main Chat"` 세션 get-or-create  
3) DB 메시지 + 현재 MBTI 가중치 + 최신 `ResponseRating`으로 프론트 DTO 배열 생성  
4) `GET/POST /api/chat`, `PATCH /api/chat/:messageId` 라우트 및 `app.js` 마운트  
5) 문서·CHANGELOG 반영

### Files Changed
- `src/controllers/chat.controller.js`: `postMessageCore` 추출, `postMessage` 래퍼
- `src/controllers/chat.compat.controller.js`: 신규
- `src/routes/chat.compat.routes.js`: 신규
- `src/app.js`: `app.use("/api/chat", chatCompatRouter)`
- `docs/api-contract.md`, `docs/worklog.md`, `CHANGELOG.md`

### Detailed Changes
- **세션**: `title === "Main Chat"` 인 비아카이브 세션을 우선 조회, 없으면 생성. 기존 다른 제목 세션과 분리되어 메인 UI 전용 스레드로 동작.
- **GET /**: 해당 세션 메시지 전부 시간순, `role` → `user`|`ai`, `mbtiRange`는 현재 `MbtiPreference` 슬라이더 값으로 통일(메시지별 저장 없음).
- **POST /**: `postMessageCore` 호출 후 동일 매핑으로 전체 배열 반환(HTTP 200, 프론트가 배열 파싱).
- **PATCH /:messageId**: 본인 세션 소속 메시지이며 `ASSISTANT`만; `rate` 1–5 정수 검증; 기존 `ResponseRating` 최신 행이 있으면 `score` 갱신, 없으면 생성.
- `/api/chatMessage` 등 기존 API는 유지.

### Alternatives Considered
- 프론트만 `/api/chatMessage`로 수정: 팀 요청은 백엔드 맞춤이므로 보류.
- 평점만 기존 `POST /api/ratings` 강제: 프론트 `PATCH`+`rate` 유지가 목표라 compat에서 흡수.

### Risks / Edge Cases
- 이미 다른 방식으로 만든 채팅 세션은 “Main Chat” 제목이 아니면 메인 화면 GET에 안 보임.
- 동일 제목 세션이 여러 개면 `findFirst`+`updatedAt`으로 하나만 사용.

### Verification
- `node -e "import('./src/app.js')"` 스모크 통과.
- 수동: `DEV_AUTH_BYPASS` 또는 로그인 후 `GET /api/chat` → `[]` 또는 메시지 배열; `POST` 후 user/ai 쌍 증가; `PATCH` 후 해당 메시지에 `rate` 반영.

### Result
프론트 메인 챗이 기대하는 URL·메서드·배열 응답 형태로 동작 가능.

### Follow-up
- 프론트 베이스 URL·포트·`credentials: 'include'` 통일은 여전히 필요.
- “Main Chat” 세션과 히스토리/다중 세션 UX를 제품적으로 정리할지 팀 합의.

## [2026-04-10 12:00] POST /api/showBoth (Main Chat “Show Both”)
### Type
Feature

### Request Summary
프론트 `RightScreen`이 `POST /api/showBoth`로 JSON 문자열 배열(`["EI","SN"]` 등)을 보내도록 되어 있는데 백엔드 라우트가 없어 404가 났음. 프론트 요청 형식에 맞춰 저장 API를 구현.

### Problem / Goal
- `/api/showBoth` 미구현 → merge 후에도 Show Both 버튼이 실패함.
- 선택한 축(EI/SN/FT/PJ)을 서버에 저장해 이후 메인 챗에서 이중 응답 등에 활용할 수 있게 함.

### Root Cause Analysis
초기 백엔드 범위에 듀얼 응답 엔드포인트만 논의되었고, 프론트가 먼저 호출하는 `showBoth` 저장 엔드포인트가 빠져 있었음.

### Implementation Plan
1) `MbtiPreference`에 `showBothAxes String[]` 추가 및 마이그레이션  
2) `postShowBoth` 컨트롤러: 배열 파싱, 허용 코드만 유지·중복 제거, upsert  
3) `POST /api/showBoth` 라우트 + `app.js` 마운트  
4) API 문서·worklog·CHANGELOG 갱신

### Files Changed
- `prisma/schema.prisma`: `showBothAxes` 필드
- `prisma/migrations/20260409173231_add_show_both_axes/migration.sql`: 컬럼 추가
- `src/controllers/showBoth.controller.js`: 신규
- `src/routes/showBoth.routes.js`: 신규
- `src/app.js`: `/api/showBoth` 마운트
- `docs/api-contract.md`: 계약 서술
- `docs/worklog.md`: 본 항목
- `CHANGELOG.md`: Unreleased 요약

### Detailed Changes
- 요청 본문은 **최상위 JSON 배열** (Express `express.json()`이 배열을 `req.body`로 파싱).
- 허용 값: `EI`, `SN`, `FT`, `PJ` (대소문자 무시). 그 외 문자열은 무시, 순서 유지하며 중복 제거.
- `MbtiPreference`가 없으면 `create`로 기본 MBTI 필드와 함께 `showBothAxes`만 채워 생성.
- 응답: `{ ok: true, showBothAxes: string[] }` (200). 본문이 배열이 아니면 400.
- 인증: `requireAuth` + 세션 쿠키(`credentials: include`) — 프론트 `RightScreen`과 동일.

### Alternatives Considered
- 별도 `UserPreference` 테이블: 스키마 단순화를 위해 `MbtiPreference`에 co-locate.
- `POST /api/mbtiRange`에 병합: 프론트가 이미 별도 버튼/요청으로 분리해 두어 경로를 맞춤.

### Risks / Edge Cases
- 빈 배열 `[]`은 “모든 Show Both 해제”로 정상 저장.
- 메인 챗 `POST`는 아직 `showBothAxes`를 읽어 듀얼 응답을 내지 **않음** — 저장만 완료; 추후 챗 컨트롤러 연동 필요.

### Verification
- `npx prisma migrate dev --name add_show_both_axes` 적용 및 `prisma generate` 성공(로컬 DB).
- 수동: 로그인(또는 `DEV_AUTH_BYPASS`) 후 `POST /api/showBoth` with `["EI","PJ"]` → 200 및 `GET /api/mbtiRange`에서 `mbti.showBothAxes` 반영 확인.

### Result
프론트와 동일한 URL·바디 형식으로 Show Both 축 설정을 저장하는 API 제공.

### Follow-up
- `chat.controller`에서 `showBothAxes` 기반 이중 OpenAI 호출 또는 응답 포맷 확장.
- 프론트 메인 챗 URL/세션/응답 DTO 정합성은 별도 PR에서 정리.

## [2026-04-09 20:25] Frontend review comments interop patch
### Type
Bug Fix

### Request Summary
프론트 리뷰 코멘트 기준으로 경로/DTO/인증/CORS 호환성 이슈를 수정.

### Problem / Goal
- `/api/mbtiRange`, `/api/chatMessage` 경로 미지원
- `normalizeLetter` 참조 누락 가능성
- MBTI DTO 포맷(`eValue/sValue/fValue/pValue`) 불일치
- 개발 중 로그인 없이는 API 테스트 어려움
- CORS origin 문자열 비교 디버깅 난이도

### Root Cause Analysis
초기 백엔드가 내부 기준 DTO·라우트로 먼저 구성되어 프론트 협업 규약 반영이 일부 누락됨.

### Implementation Plan
1) 라우트 alias 추가  
2) MBTI 컨트롤러 DTO 다중 포맷 허용  
3) `normalizeLetter` 복구  
4) CORS origin 함수형 검증  
5) 개발 전용 auth bypass 옵션 추가

### Files Changed
- `src/controllers/mbti.controller.js`
- `src/controllers/chat.controller.js`
- `src/routes/mbti.routes.js`
- `src/routes/chat.routes.js`
- `src/middlewares/requireAuth.js`
- `src/app.js`
- `.env.example`
- `docs/api-contract.md`
- `docs/worklog.md`
- `CHANGELOG.md`

### Detailed Changes
- `mbti.controller.js`: `normalizeLetter` 함수 추가.
- MBTI 입력 포맷 허용:
  - `mbtiWeights.*`
  - `*Weight`
  - `mbtiRange.eValue/sValue/fValue/pValue`
  - `eValue/sValue/fValue/pValue`
- `chat.controller.js`: 동일한 MBTI 포맷 허용 + `postMessageCompat` 추가.
- `chat.routes.js`: `POST /` 추가 (mount alias에서 `/api/chatMessage`로 사용).
- `app.js`:
  - CORS `origin` 함수를 사용해 허용 origin 명시 체크.
  - `/api/mbtiRange`, `/api/chatMessage` alias mount 추가.
- `requireAuth.js`:
  - `NODE_ENV=development && DEV_AUTH_BYPASS=true`일 때 임시 우회.
  - 기본 동작은 기존과 동일(세션 필요).

### Risks / Edge Cases
- 개발용 bypass를 실서버에서 켜면 보안 이슈 → 기본 `false` 유지 필요.
- alias 경로가 늘어 route 추적이 어려워질 수 있어 문서 동기화 필수.

### Verification
- `node -e "import('./src/app.js')"` import 스모크 테스트 통과
- lint diagnostics 에러 없음

### Result
프론트 코멘트 기반 인터롭 이슈를 backend에서 호환 가능하도록 반영.

### Follow-up
- 프론트 팀과 alias 사용 여부 확정 후, 불필요한 경로는 정식 계약으로 수렴.
