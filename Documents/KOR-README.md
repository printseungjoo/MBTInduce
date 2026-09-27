# MBTInduce

> **MBTI 성향과 영향도를 조절하여 다양한 관점의 AI 응답을 경험하고 비교할 수 있는 대화형 AI 웹 서비스**

---

## 1. 프로젝트 소개

MBTInduce는 사용자가 **E/I, S/N, T/F, J/P 성향의 영향도를 직접 설정하여 AI의 응답 방향을 조절할 수 있는 대화형 AI 웹 서비스**입니다.

MBTI 성향 기반 AI 대화를 중심으로 사용자에게 맞춤형 응답 제시, 서로 다른 관점의 응답 비교, 특정 MBTI 성향을 가진 상대와의 대화 시뮬레이션, 사용자의 일정을 고려한 AI 계획 생성 등의 기능을 제공합니다.

---

## 2. 시작 배경

기존 AI 대화에서는 같은 질문에 대해 하나의 응답을 제공받지만, 사용자가 원하는 답변의 방식은 상황에 따라 달라질 수 있다고 생각했습니다.

고민을 이야기할 때는 공감과 위로가 필요할 수 있고, 문제를 해결해야 할 때는 감정보다 논리적이고 현실적인 의견이 필요할 수 있습니다. 또한 중요한 대화를 앞두고 있다면 상대방의 성향에 따라 어떤 반응이 나타날지 미리 경험해보고 싶을 수도 있습니다.

이러한 문제에서 출발해 **AI가 정해준 하나의 관점을 받아들이는 것이 아니라, 사용자가 원하는 관점을 직접 선택하고 탐색할 수 있는 대화 경험**을 만드는 것을 목표로 MBTInduce를 개발했습니다.

---

## 3. 프로젝트 개요

| 항목 | 내용 |
| ---  | --- |
| **프로젝트명** | MBTInduce |
| **개발 형태** | 2인 팀 프로젝트 |
| **개발 기간** | 2026.03 - 2026.06 |
| **현재 상태** | 지속 운영 및 개선 중 |
| **서비스 대상** | 개인의 성향에 맞춘 AI 대화와 다양한 관점의 대화를 경험하고 싶은 사용자 |
| **담당 범위** | **@printseungjoo** — 기획 · UI/UX · Frontend · 리팩토링<br>**@jibeomryu** — 기획 · Backend · DB · AI 응답 로직 설계 | 
| **지원 언어** | 영어 |
| **서비스 형태** | Responsive Web |

### Tech Stack

**Frontend**  
React · TypeScript · Vite · React Router · Emotion · React Big Calendar

**Backend & Database**  
Node.js · Express · PostgreSQL · Prisma

**AI**  
OpenAI API

**Authentication & Security**  
Google OAuth · bcrypt · Helmet · CORS

**Deployment**  
Railway

**Collaboration**  
GitHub · Jira · Figma

---

## 4. 화면 구성


서비스의 전체 화면들과 기능은 아래 화면 정의서에서 확인할 수 있습니다.

[MBTInduce 화면 구성 및 화면 정의서](https://drive.google.com/file/d/11kU227K9eItTz7KiAYHeTyBycoPvBwxE/view?usp=sharing)

---

## 5. 주요 기능

### 5-1. MBTI 성향 기반 AI 응답

사용자가 E/I, S/N, T/F, J/P 성향의 영향도를 직접 조절하여 AI 응답에 반영할 수 있습니다.

단순히 하나의 MBTI 유형을 선택하는 방식이 아니라 **Slider Interface를 통해 각 성향의 정도를 세밀하게 조절**할 수 있도록 구성했습니다.

**예시**

- `F` 성향 강화 → 공감과 감정적인 관점을 강조한 답변
- `T + S` 성향 강화 → 논리적이고 현실적인 관점을 강조한 답변

**Implementation**

- E/I, S/N, T/F, J/P에 대응하는 성향 값을 TypeScript Domain Type으로 관리
- 사용자가 조절한 성향 값을 채팅 요청과 연결하여 Backend에 전달
- AI 응답과 함께 적용된 MBTI 성향 정보를 관리하여 대화 데이터와 응답 성향을 연결

---

### 5-2. 동시 관점 비교

동일한 질문에 대해 **서로 다른 MBTI 관점의 AI 응답을 동시에 생성하고 비교**할 수 있습니다.

`F/T`, `S/N` 등 서로 반대되는 성향의 답변을 하나의 화면에서 확인하여 같은 상황을 여러 관점에서 바라볼 수 있도록 구성했습니다.

사용자가 하나의 AI 응답만 받아들이는 것이 아니라 **서로 다른 관점을 직접 비교한 뒤 필요한 답변을 선택할 수 있도록** 했습니다.

---

### 5-3. MBTI 기반 대화 Simulation

특정 MBTI 성향을 가진 상대방과의 대화를 가정하여 시뮬레이션을 진행할 수 있습니다.

사용자가 상대방의 MBTI와 상황을 설정하면 해당 성향을 반영한 AI와 대화를 진행할 수 있습니다.

**Implementation**

- Simulation 전용 화면에서 대화 메시지와 MBTI 성향 데이터를 함께 관리
- 대화별 MBTI 성향 정보를 메시지 데이터와 연결
- 실제 AI 응답이 생성되는 동안 Streaming 상태를 UI에 반영
- Main Chat과 Simulation이 공통 API 및 메시지 구조를 활용할 수 있도록 Frontend 구조를 정리

---

### 5-4. AI와 일정 짜기

사용자가 Calendar에 기존 일정을 등록하고 이를 기반으로 AI에게 새로운 계획을 요청할 수 있습니다.

사용자의 실제 일정을 알지 못한 상태에서 계획을 생성하는 일반적인 AI 대화의 한계를 보완하기 위해 **등록된 일정 정보를 AI 요청과 연결할 수 있도록** 구성했습니다.

**일정 생성 시 선택지**

- 방해 가능
- 하루 종일 방해 금지
- 해당 시간만 방해 금지

Calendar UI는 React Big Calendar를 활용하여 구성했습니다.

---

### 5-5. 질문 템플릿

자주 사용할 만한 질문을 템플릿 형태로 제공하여 처음 서비스를 사용하는 사용자도 빠르게 AI 대화를 시작할 수 있도록 구성했습니다.

반복적으로 사용되는 질문을 직접 입력해야 하는 과정을 줄이고, 사용자가 서비스의 주요 AI 기능을 쉽게 경험할 수 있도록 했습니다.

---

### 5-6. AI 응답 피드백

각 AI 응답에 대해 사용자가 별점을 통해 피드백을 남길 수 있습니다.

수집된 피드백은 관리자 페이지에서 확인하여 **AI 응답 품질과 서비스 사용 경험을 지속적으로 확인할 수 있도록** 구성했습니다.

---

### 5-7. Admin Dashboard

서비스 운영과 사용자 피드백 확인을 위한 Admin Dashboard를 제공합니다.

관리자는 다음 정보를 확인하거나 관리할 수 있습니다.

- Question Template 조회 및 수정
- 전체 사용자 수 조회
- 전체 질문(메시지) 수 조회
- 피드백 평균 별점 조회
- 별점별 피드백 개수 조회

사용자 기능 구현에서 끝나지 않고 **실제 서비스의 사용 현황과 사용자 피드백을 확인할 수 있는 운영 기능까지 구현**했습니다.

---

## 6. Architecture

```text
                         ┌─────────────────────┐
                         │        User         │
                         └──────────┬──────────┘
                                    │
                                    ▼
                      ┌──────────────────────────┐
                      │    React + TypeScript    │
                      │         Frontend         │
                      └────────────┬─────────────┘
                                   │
                         REST API / Streaming
                                   │
                                   ▼
                      ┌──────────────────────────┐
                      │    Node.js + Express     │
                      │          Backend         │
                      └───────┬───────┬──────────┘
                              │       │
                   ┌──────────┘       └───────────┐
                   │                              │
                   ▼                              ▼
          ┌────────────────┐            ┌────────────────┐
          │   OpenAI API   │            │  Google OAuth  │
          └────────────────┘            └────────────────┘
                   │
                   │ Streaming Response
                   │
                   ▼
             Frontend UI


                      Node.js + Express
                              │
                              ▼
                        ┌──────────┐
                        │  Prisma  │
                        └────┬─────┘
                             │
                             ▼
                     ┌────────────────┐
                     │   PostgreSQL   │
                     └────────────────┘
```

---

## 7. Trouble Shooting

### 7-1. Dark Mode 환경에서 발생한 텍스트 가독성 문제

#### Problem

베타 사용자 테스트 과정에서 한 사용자의 Dark Mode 환경에서 일부 텍스트 색상이 예상과 다르게 표시되어 배경과 글자의 대비가 낮아지는 문제가 발견되었습니다.

사용자의 브라우저 및 시스템 테마에 따라 특정 텍스트의 가독성이 크게 떨어졌습니다.

#### Analysis

일부 UI 요소에서 텍스트 색상을 명시적으로 지정하지 않아 브라우저와 시스템의 Dark Mode 설정에 영향을 받고 있었습니다.

그 결과 특정 환경에서 브라우저가 텍스트 색상을 변경하면서 기존 배경과 충분한 대비를 유지하지 못했습니다.

#### Solution

Emotion 스타일을 점검하고 주요 텍스트와 UI 상태별 색상을 명시적으로 정의했습니다.

또한 Dark Mode를 포함한 서로 다른 테마 환경에서 화면을 검증하여 사용자의 시스템 설정과 관계없이 의도한 색상과 가독성이 유지되도록 수정했습니다.

#### Result

사용자의 시스템 테마와 관계없이 주요 화면에서 **일관된 텍스트 가독성을 유지할 수 있도록 개선**했습니다.

사용자 테스트에서 발견된 환경 의존적인 UI 문제를 실제 사용 환경을 기준으로 분석하고 개선하는 경험을 할 수 있었습니다.

---

### 7-2. 기능 증가에 따른 Frontend 구조 복잡도 개선

#### Problem

Main Chat, Simulation, Calendar, History, My Page, Admin 등 서비스 기능이 증가하면서 화면별 Component와 UI Logic의 역할이 복잡해졌습니다.

유사한 UI와 데이터 처리 로직이 여러 화면에 분산되어 있어 기능을 수정할 때 여러 파일을 함께 확인해야 했고, 특정 UI의 변경이 다른 기능에 영향을 줄 가능성도 커졌습니다.

#### Analysis

Frontend 구조를 검토한 결과 다음과 같은 개선 지점을 확인했습니다.

- 화면 내부에 API 요청과 UI Logic이 함께 존재
- Main Chat과 Simulation에 유사한 입력 UI 존재
- Signup과 My Page에서 유사한 Profile Form 사용
- 여러 Modal에서 반복되는 UI 구조 존재
- Frontend Domain Type이 여러 위치에 분산
- Main Screen이 여러 기능을 동시에 담당

기능 자체의 문제가 아니라 **Component의 책임과 공통 로직의 경계가 명확하지 않은 구조적인 문제**라고 판단했습니다.

#### Solution

기능과 책임을 기준으로 Frontend 구조를 다시 정리했습니다.

- Main Screen을 Layout과 Route 단위로 분리
- 공통 Frontend API Client 구성
- Domain Type 중앙화
- Signup / My Page의 Profile Form 공통화
- Main Chat / Simulation의 입력 UI 공통화
- 반복되는 Modal Shell 공통 Component로 분리
- Admin Template 관련 중복 Panel 구조 정리
- UI Component 내부의 Network Call을 별도 영역으로 분리
- Error Boundary와 Loading State 추가

단순히 파일을 나누는 것이 아니라 **변경 이유가 같은 코드가 함께 위치하도록 책임을 재정의하는 방향**으로 리팩토링했습니다.

#### Result

화면별 책임과 공통 Component의 역할을 명확하게 분리하여 특정 기능을 수정할 때 확인해야 하는 범위를 줄였습니다.

또한 공통 UI와 API 처리 구조를 재사용할 수 있도록 구성하여 이후 기능 추가와 UI 변경에 대응하기 쉬운 Frontend 구조로 개선했습니다.

---

### 7-3. AI 응답 대기 경험 개선을 위한 Streaming Response 적용

#### Problem

AI 응답을 일반적인 요청/응답 방식으로 처리하면 AI가 전체 답변을 생성할 때까지 사용자는 완성된 응답을 기다려야 합니다.

특히 응답이 길어질수록 사용자는 요청이 정상적으로 처리되고 있는지 즉시 확인하기 어렵고, 실제 생성 시간보다 대기 시간이 더 길게 느껴질 수 있었습니다.

#### Analysis

AI 응답 생성 자체의 시간을 단순히 Frontend에서 줄일 수는 없기 때문에, 전체 응답이 완료된 이후 한 번에 렌더링하는 방식보다 **생성된 응답을 순차적으로 사용자에게 보여주는 방식이 채팅 UX에 적합하다고 판단**했습니다.

또한 Main Chat과 Simulation 모두 AI 응답을 사용하기 때문에 특정 화면에 종속된 방식이 아니라 공통으로 사용할 수 있는 Streaming 처리 구조가 필요했습니다.

#### Solution

AI 응답을 Streaming 방식으로 전달하고 Frontend에서 생성되는 내용을 순차적으로 반영하도록 구성했습니다.

- Streaming 요청을 처리하는 공통 API Client 구현
- `text/event-stream` 기반 응답 처리
- Main Chat에서 Streaming Endpoint를 통한 메시지 요청
- Simulation에서도 동일한 Streaming 처리 구조 활용
- Streaming 중인 AI Message 상태를 별도로 관리
- 전달되는 응답 내용을 기존 AI Message에 순차적으로 반영

이를 통해 Main Chat과 Simulation에서 동일한 Streaming 처리 방식을 재사용할 수 있도록 구성했습니다.

#### Result

사용자가 AI 응답 전체가 생성될 때까지 기다린 후 결과를 확인하는 대신 **응답이 생성되는 과정을 실시간으로 확인할 수 있도록 사용자 경험을 개선**했습니다.

또한 Streaming 처리를 공통 API Layer로 분리하여 여러 AI 대화 화면에서 동일한 로직을 재사용할 수 있도록 했습니다.

---

## 8. API Documentation

Frontend와 Backend의 Endpoint, 요청 형식, 응답 구조를 명확하게 공유하기 위해 API 명세를 별도의 문서로 관리했습니다.

2인 개발 과정에서 Frontend와 Backend가 동일한 요청·응답 규격을 기준으로 개발할 수 있도록 활용했습니다.

[MBTInduce API Documentation](https://docs.google.com/document/d/1cfbuPG2nsKaCHA7x5rJtaO5bWX-61feJREjMbKB7Ofo/edit?usp=sharing)

---

## 9. Project Goal

MBTInduce는 AI가 하나의 관점에서 답변을 제공하는 것을 넘어, **사용자가 직접 원하는 성향과 관점을 선택하고 비교할 수 있는 AI Interaction**을 목표로 개발했습니다.

MBTI 성향 조절, 동시 관점 비교, MBTI 기반 시뮬레이션, 일정 기반 AI 계획 등의 기능을 통해 사용자가 AI의 응답을 수동적으로 받아들이는 것이 아니라 **자신에게 필요한 관점을 직접 탐색하고 선택할 수 있는 경험**을 제공하고자 했습니다.