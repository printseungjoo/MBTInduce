## [2026-05-08 21:07] Remove calendar event userId from API response
### Type
Bug Fix

### Request Summary
Remove unnecessary `userId` exposure from calendar event API responses and proceed as a follow-up commit for the current PR.

### Problem / Goal
Calendar event response payloads currently include `userId` even though calendar endpoints already enforce per-user access via authenticated `req.user.id`. The goal is to minimize exposed identifiers while keeping behavior unchanged.

### Root Cause Analysis
`mapRow()` in `backend/src/services/calendarEventService.js` includes `userId` in every mapped event object. This field is not required by current frontend consumers.

### Implementation Plan
1. Verify frontend usage of calendar event response fields and confirm `userId` is not consumed.
2. Remove `userId` from the calendar event response mapping in backend service layer.
3. Update worklog with final implementation details, verification steps, risks, and outcome.
4. Update `backend/CHANGELOG.md` under `[Unreleased]` with a concise user-facing fix note.

### Files Changed
- docs/worklog.md: create in-progress record before code changes.
- backend/src/services/calendarEventService.js: removed `userId` from calendar event response mapping to reduce exposed identifiers.
- backend/CHANGELOG.md: added unreleased fix note for response payload minimization.

### Detailed Changes
- Confirmed frontend calendar code paths do not consume `userId` from calendar event responses.
- Updated `mapRow()` in calendar event service to stop returning `userId` while keeping all other fields unchanged (`id`, `title`, `description`, `startAt`, `endAt`, `allDay`, `mbti`, `planningNote`, timestamps).
- Kept handler, route, and authorization flow unchanged; only response payload surface was reduced.
- No schema, persistence, validation, or state management changes were required.

### Alternatives Considered
- Keep `userId` for potential frontend convenience: rejected because it increases response surface without functional benefit.
- Remove `userId` in controller layer only: rejected because service-level mapping is the single source used by all calendar handlers.

### Risks / Edge Cases
- If any hidden consumer depends on `userId`, that consumer could break after response shape change.
- API contract change should be reflected in PR context to avoid integration surprises.

### Verification
- Searched frontend source for `userId` references in calendar flow: no usage found.
- Reviewed `backend/src/services/calendarEventService.js` output mapper and confirmed `userId` is no longer emitted.
- Ran linter diagnostics on modified files: no lint errors reported.

### Result
Calendar API responses no longer expose `userId` for calendar events, reducing unnecessary identifier exposure without changing endpoint behavior or frontend compatibility.

### Follow-up
- Add/update API response contract notes if the team keeps external API docs.
