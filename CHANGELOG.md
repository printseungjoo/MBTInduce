# Changelog

## [Unreleased]

- Feature: Main Chat API accepts MBTI slider weights (0–100, E/S/F/P poles) aligned with frontend `RangeBar`; optional `text` alias for message body; `appliedMbti` on message response.
- Feature: `MbtiPreference` stores `energyWeight`, `informationWeight`, `decisionWeight`, `lifestyleWeight`; `PUT /api/mbti` accepts `mbtiWeights` or flat weight fields.
- Feature: OpenAI Chat Completions integration using `gpt-4o-mini` for `POST /api/chat/sessions/:id/messages` and `/api/ai/*`; configure via `OPENAI_API_KEY` and optional `OPENAI_MODEL`.
- Chore: Add `.env` to `.gitignore` to reduce accidental secret commits.
