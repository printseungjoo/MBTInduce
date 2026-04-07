# Main Chat — 백엔드 계약 (프론트 `MBTInduce_frontend` 정렬)

프론트 폴더는 **참조만** 하며 수정하지 않는다. 아래 계약은 `FullMainScreen` / `TextInputBox` / `RightScreen` / `RangeBar` 동작에 맞춤.

## 프론트 UI ↔ API 필드

| 프론트 | 의미 | API |
|--------|------|-----|
| `TextInputBox` → `text` | 입력 문자열 | `POST .../messages` 바디 `content` (또는 호환용 `text`) |
| `RangeBar` `percentage` (0–100) | 왼쪽 글자 쪽 비율 | `mbtiWeights.energy` … 각 키는 **E, S, F, P** 방향 비율 |
| 행 순서 | E/I, S/N, F/T, P/J | `energy`→E%, `information`→S%, `decision`→F%, `lifestyle`→P% |

즉 슬라이더가 왼쪽 `E`에 가까울수록 `mbtiWeights.energy` 값을 크게(예: 80).

## 엔드포인트 (세션 쿠키 필요)

- `POST /api/chat/sessions` — 새 채팅 세션
- `GET /api/chat/sessions/:id` — 메시지 목록
- `POST /api/chat/sessions/:id/messages` — 전송 + (플레이스홀더) 어시스턴트 답변 저장
- `GET /api/mbti` — 저장된 MBTI + 슬라이더 값
- `PUT /api/mbti` — 글자 +/또는 `mbtiWeights` 저장

요청 시 `fetch(..., { credentials: "include" })`.

## `POST /api/chat/sessions/:id/messages` 바디 예시

```json
{
  "content": "Type your message 와 동일한 문자열",
  "mbtiWeights": {
    "energy": 72,
    "information": 40,
    "decision": 65,
    "lifestyle": 55
  },
  "persistMbtiWeights": true
}
```

- `persistMbtiWeights` 생략 시 `true`: 이번 요청의 슬라이더 스냅샷을 `MbtiPreference`에 반영.
- `false`이면 이번 응답 프롬프트에만 반영(저장 생략, 단 메모리상 스냅샷은 응답에 포함).

## 응답

- `userMessage`, `assistantMessage`: DB에 저장된 메시지 레코드
- `appliedMbti`: 이번 턴에 사용·저장된 MBTI 스냅샷(글자 + 0–100 가중치). 없으면 `null`

## AI 레이어

- 서버는 OpenAI **Chat Completions**를 사용하며 기본 모델은 **`gpt-4o-mini`** (`OPENAI_MODEL`로 변경 가능). [모델 개요](https://developers.openai.com/api/docs/models/gpt-4o-mini)
- 로컬 `.env`에 `OPENAI_API_KEY` 필요. 키는 Git에 커밋하지 말 것.
- 응답 생성 실패 시에도 어시스턴트 메시지 레코드는 생성되며, 본문에 실패 사유가 들어갈 수 있음.
