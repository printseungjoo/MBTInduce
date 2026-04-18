# Changelog

## [Unreleased]

- Hotfix: In development auth-bypass mode, `requireAuth` now upserts a test `User` record before setting `req.user`, preventing `ChatSession.userId` foreign-key 500 errors on `/api/chat`.
- Feature: Added `/api/chat` compatibility routes (`GET`/`POST`/`PATCH`) matching the frontend main chat flat `ChatMessage[]` contract, backed by a per-user “Main Chat” session and existing OpenAI pipeline (`postMessageCore`).
- Feature: `POST /api/showBoth` accepts a JSON array of axis codes (`EI`, `SN`, `FT`, `PJ`) from the Main Chat “Show Both” UI and persists them on `MbtiPreference.showBothAxes`.
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
