# Google 로그인 · DB 변수 참고

이 문서는 MBTInduce 백엔드에서 **Google OAuth**와 **데이터베이스(Prisma·세션)**에 쓰이는 이름과 용도를 정리한 것입니다. 코드 기준: `src/config/passport.js`, `src/routes/auth.routes.js`, `src/controllers/auth.controller.js`, `src/config/session.js`, `prisma/schema.prisma`, `.env.example`.

---

## 1. 환경 변수

| 변수명 | 용도 |
|--------|------|
| `GOOGLE_CLIENT_ID` | Google OAuth 클라이언트 ID. `passport-google-oauth20`의 `clientID`로 전달. 없으면 Google 전략 미등록, `/auth/google`은 503. |
| `GOOGLE_CLIENT_SECRET` | Google OAuth 클라이언트 시크릿. `clientSecret`로 전달. `GOOGLE_CLIENT_ID`와 함께 있어야 로그인 동작. |
| `GOOGLE_CALLBACK_URL` | OAuth 콜백 URL(`callbackURL`). 미설정 시 기본 `http://localhost:4000/auth/google/callback`. Google Cloud 콘솔 URI와 일치해야 함. |
| `AUTH_SUCCESS_REDIRECT` | 콜백 성공 후 브라우저 리다이렉트 URL. 기본 `http://localhost:5173`. |
| `AUTH_FAILURE_REDIRECT` | OAuth 실패 또는 `/auth/google/failure` 시 리다이렉트 URL. 기본 `http://localhost:5173/login?error=oauth_failed`. |
| `SESSION_SECRET` | express-session 쿠키 서명용 비밀값. 로그인 후 `req.user` 유지. |
| `DATABASE_URL` | PostgreSQL 연결 문자열. Prisma datasource 및(설정 시) `connect-pg-simple` 세션 스토어(`user_sessions` 테이블)에 사용. |
| `NODE_ENV` | `production`이면 세션 쿠키 `secure`/`sameSite` 등 분기. Prisma는 `development`에서 쿼리 로그 확대. |
| `CLIENT_ORIGIN` | CORS 허용 origin(쉼표 구분 다중 가능). credentials 요청 시 필요. |
| `ACCOUNT_DELETE_MODE` | `HARD`면 `User` 물리 삭제, 그 외 소프트 삭제(`status`, `deletedAt` 등). 탈퇴 API. |
| `PORT` | 서버 포트(기본 4000). 콜백 URL과 맞추는 데 간접적으로 관련. |

---

## 2. GoogleStrategy 설정 매핑

| 코드 속성 | 출처 |
|-----------|------|
| `clientID` | `process.env.GOOGLE_CLIENT_ID` |
| `clientSecret` | `process.env.GOOGLE_CLIENT_SECRET` |
| `callbackURL` | `process.env.GOOGLE_CALLBACK_URL` 또는 기본 `http://localhost:4000/auth/google/callback` |

---

## 3. Passport 콜백 내부 변수 (`passport.js`)

| 이름 | 용도 |
|------|------|
| `accessToken` | Google API 액세스 토큰 → `Account.accessToken` 저장. |
| `refreshToken` | 리프레시 토큰(없으면 `null`) → `Account.refreshToken`. |
| `profile` | Google 프로필 객체. |
| `profile.id` | Google 사용자 ID → `providerAccountId`, DB `Account.providerAccountId` 조회 키. |
| `profile.emails?.[0]?.value` | 이메일(소문자) → `User.email`. |
| `profile.photos?.[0]?.value` | 프로필 이미지 URL → `User.profileImage`. |
| `profile.displayName` | 표시 이름 → 닉네임 후보. 없으면 이메일 `@` 앞 또는 `"user"`. |
| `provider` | 상수 `"GOOGLE"` → `Account.provider` (`AuthProvider.GOOGLE`). |
| `providerAccountId` | `profile.id` 보관. |
| `existingAccount` | `provider` + `providerAccountId`로 조회한 `Account`(연결 `user` 포함). |
| `existingUserByEmail` | 동일 `email`의 기존 `User`(계정 연결 시 재사용). |
| `user` | 로그인/가입 대상 `User`. |
| `updatedUser` / `createdUser` | 갱신·조회 후 Passport에 전달하는 사용자 객체. |
| `done` | Passport 콜백 완료 함수. |

### 세션 직렬화

- **serializeUser**: 세션에 `user.id`만 저장.
- **deserializeUser**: `id`로 `User` 재조회 시 선택 필드: `id`, `email`, `nickname`, `profileImage`, `role`, `status`.

### 라우트 OAuth 스코프

- `passport.authenticate("google", { scope: ["profile", "email"] })`

---

## 4. 세션·쿠키 (`session.js`, `auth.controller.js`)

| 이름 | 용도 |
|------|------|
| `mbtinduce.sid` | 세션 쿠키 이름(`name`). 로그아웃·탈퇴 시 `clearCookie("mbtinduce.sid")`. |
| `user_sessions` | PostgreSQL 세션 테이블명(`connect-pg-simple` `tableName`). |
| `isProd` | `NODE_ENV === "production"` — 쿠키 옵션 분기. |
| `sessionOptions` | `secret`, `cookie` 등 express-session 옵션 객체. |

---

## 5. Prisma 애플리케이션 코드

| 이름 | 용도 |
|------|------|
| `prisma` | `src/lib/prisma.js`에서 export하는 `PrismaClient` 인스턴스. |
| `globalForPrisma` | 개발 환경에서 `globalThis`에 클라이언트 재사용. |
| `getDbConfig().url` | `src/config/db.js` — `process.env.DATABASE_URL` 래퍼(빈 문자열 기본). |

---

## 6. Prisma 스키마 — 열거형

| 열거형 | 값 | Google 로그인과의 관계 |
|--------|-----|------------------------|
| `UserRole` | `USER`, `ADMIN` | 신규 가입 시 `USER` 기본. |
| `UserStatus` | `ACTIVE`, `SUSPENDED`, `DELETED` | `DELETED`/`SUSPENDED`는 로그인 거부. |
| `AuthProvider` | `GOOGLE` | `Account.provider`에만 사용. |

---

## 7. Prisma 스키마 — 모델 필드 (Google 흐름에서 직접 사용)

### `User`

| 필드 | 용도(로그인 관련) |
|------|-------------------|
| `id` | PK, 세션 직렬화 키. |
| `email` | 고유, Google 이메일 동기화. |
| `nickname` | 표시 이름. |
| `profileImage` | 아바타 URL. |
| `role` | 권한(기본 `USER`). |
| `status` | `ACTIVE`만 정상 로그인. |
| `lastLoginAt` | 로그인 시 갱신. |
| `deletedAt`, `createdAt`, `updatedAt` | 스키마·탈퇴 등. |
| `accounts`, `mbti`, … | 관계 필드. |

### `Account`

| 필드 | 용도 |
|------|------|
| `userId` | `User` FK. |
| `provider` | `GOOGLE`. |
| `providerAccountId` | Google `profile.id`. |
| `accessToken`, `refreshToken`, `tokenExpiresAt` | 토큰 보관. |
| `id`, `createdAt`, `updatedAt` | 메타. |
| `@@unique([provider, providerAccountId])` | 조회 키 `provider_providerAccountId`. |

### `MbtiPreference`

Google로 **신규 사용자** 생성 시 `upsert`로 기본 MBTI 축(`energy`, `information`, `decision`, `lifestyle`) 생성.

### 기타 모델

`ChatSession`, `Message`, `ResponseRating`, `Feedback`, `PromptTemplate`은 Google 콜백에서 직접 쓰이지 않으며, 각 API에서 사용. 전체 필드 정의는 `prisma/schema.prisma` 참고.

---

## 8. 관련 파일 경로

| 경로 | 내용 |
|------|------|
| `.env.example` | 환경 변수 예시. |
| `prisma/schema.prisma` | DB 스키마. |
| `src/config/passport.js` | Google 전략, 사용자 동기화. |
| `src/routes/auth.routes.js` | `/auth/google`, 콜백, 실패 라우트. |
| `src/controllers/auth.controller.js` | 성공/실패 리다이렉트, 로그아웃, 탈퇴. |
| `src/config/session.js` | 세션 미들웨어·PG 스토어. |
| `src/lib/prisma.js` | Prisma 클라이언트. |
| `src/config/db.js` | DB URL 헬퍼. |

---

## 변경 시 체크리스트

1. Google Cloud: 승인된 리다이렉트 URI ↔ `GOOGLE_CALLBACK_URL`.
2. 프론트 도메인 ↔ `AUTH_SUCCESS_REDIRECT`, `AUTH_FAILURE_REDIRECT`, `CLIENT_ORIGIN`.
3. 배포 환경: `NODE_ENV`, `SESSION_SECRET`, `DATABASE_URL`, 쿠키 `secure`/`sameSite`.
