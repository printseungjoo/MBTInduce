# MBTInduce

> **An interactive AI web service that allows users to adjust MBTI traits and their influence to experience and compare AI responses from different perspectives.**

[For Korean README, click me!](Documents/KOR-README.md)

---

## 1. Project Overview

MBTInduce is an **interactive AI web service that allows users to adjust the influence of E/I, S/N, T/F, and J/P traits to customize the direction of AI responses**.

Centered around MBTI-based AI conversations, the service provides personalized responses, side-by-side comparisons of different perspectives, conversation simulations with specific MBTI personality types, and AI-assisted planning based on the user's schedule.

---

## 2. Motivation

Even when asking about the same situation, users may prefer different types of responses depending on their needs.

When discussing personal concerns, users may want empathy and emotional support. When solving a problem, they may prefer a logical and practical perspective. Before an important conversation, users may also want to anticipate how someone with a particular personality type might respond.

MBTInduce was developed around this idea, with the goal of creating **an AI conversation experience where users can actively choose and explore the perspectives they need instead of passively receiving a single predefined perspective**.

---

## 3. Project Information

| Category | Details |
| --- | --- |
| **Project** | MBTInduce |
| **Team** | 2-person team project |
| **Development Period** | Mar 2026 – Jun 2026 |
| **Current Status** | Actively maintained and continuously improved |
| **Target Users** | Users who want personalized AI conversations and the ability to explore responses from different perspectives |
| **Responsibilities** | **@printseungjoo** — Planning · UI/UX · Frontend · Refactoring<br>**@jibeomryu** — Planning · Backend · Database · AI Response Logic Design |
| **Language** | English |
| **Platform** | Responsive Web |

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

## 4. Screens & Features

Detailed information about the service screens and features is available in the screen specification document below.

[MBTInduce UI Document (KOR)](https://drive.google.com/file/d/11kU227K9eItTz7KiAYHeTyBycoPvBwxE/view?usp=sharing)

---

## 5. Key Features

### 5-1. MBTI-Based AI Responses

Users can directly adjust the influence of E/I, S/N, T/F, and J/P traits and apply those preferences to AI responses.

Rather than simply selecting a predefined MBTI type, MBTInduce provides a **slider interface that allows users to fine-tune the influence of individual personality traits**.

**Examples**

- Stronger `F` preference → responses emphasizing empathy and emotional perspectives
- Stronger `T + S` preferences → responses emphasizing logical and practical perspectives

**Implementation**

- Managed values corresponding to E/I, S/N, T/F, and J/P using TypeScript domain types
- Connected user-adjusted MBTI values to chat requests and passed them to the backend
- Managed the applied MBTI information alongside AI responses to associate conversation data with response perspectives

---

### 5-2. Side-by-Side Perspective Comparison

Users can **generate and compare AI responses from different MBTI perspectives for the same question**.

Opposing personality dimensions such as `F/T` and `S/N` can be viewed within the same interface, allowing users to examine the same situation from multiple perspectives.

Instead of relying on a single AI response, users can **directly compare different perspectives and choose the response that best fits their needs**.

---

### 5-3. MBTI-Based Conversation Simulation

Users can simulate conversations with someone who has a specific MBTI personality type.

After configuring the other person's MBTI type and the conversation scenario, users can interact with an AI that responds according to the selected personality traits.

**Implementation**

- Managed conversation messages and MBTI data together within the dedicated Simulation screen
- Associated MBTI information with individual conversation messages
- Reflected the streaming state in the UI while AI responses were being generated
- Refactored the frontend architecture so Main Chat and Simulation could share common API and message structures

---

### 5-4. AI-Assisted Schedule Planning

Users can register existing events in the Calendar and ask the AI to create new plans based on their current schedule.

To address the limitation of AI generating plans without knowing a user's actual schedule, MBTInduce connects registered calendar information to AI requests.

**Scheduling Options**

- You can disturb
- Do not disturb whole day
- Do not disturb only at this time

The Calendar UI is implemented using React Big Calendar.

---

### 5-5. Question Templates

Frequently used questions are provided as templates so that first-time users can quickly start interacting with the AI.

This reduces the need to repeatedly type common questions and helps users easily explore the service's core AI features.

---

### 5-6. AI Response Feedback

Users can rate individual AI responses using a star-based feedback system.

The collected feedback can be reviewed through the Admin Dashboard, enabling the team to **continuously monitor AI response quality and the overall user experience**.

---

### 5-7. Admin Dashboard

MBTInduce provides an Admin Dashboard for monitoring service usage and user feedback.

Administrators can view or manage the following:

- View and edit Question Templates
- View the total number of users
- View the total number of questions/messages
- View the average feedback rating
- View the number of feedback entries for each rating

Beyond implementing user-facing features, the service also includes **operational functionality for monitoring service usage and user feedback**.

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

## 7. Troubleshooting

### 7-1. Text Readability Issues in Dark Mode

#### Problem

During beta testing, a user reported that some text colors were displayed differently than expected in Dark Mode, resulting in insufficient contrast between the text and background.

Text readability varied depending on the user's browser and system theme settings.

#### Analysis

Some UI elements did not have explicitly defined text colors, causing them to be affected by browser and system-level Dark Mode settings.

As a result, text colors could change in certain environments and fail to maintain sufficient contrast against the existing background.

#### Solution

Reviewed the Emotion styles and explicitly defined colors for key text elements and UI states.

The interface was also tested across different theme environments, including Dark Mode, to ensure that the intended colors and readability were maintained regardless of the user's system settings.

#### Result

Improved the interface to **maintain consistent text readability across different system themes**.

This experience also provided an opportunity to identify and resolve an environment-dependent UI issue discovered through actual user testing.

---

### 7-2. Reducing Frontend Complexity as the Service Expanded

#### Problem

As features such as Main Chat, Simulation, Calendar, History, My Page, and Admin were added, the responsibilities of individual components and UI logic became increasingly complex.

Similar UI and data-handling logic was distributed across multiple screens, requiring several files to be reviewed when modifying a feature and increasing the possibility that changes to one UI could affect another.

#### Analysis

After reviewing the frontend architecture, several areas for improvement were identified:

- API requests and UI logic were coupled within screen components
- Main Chat and Simulation contained similar input interfaces
- Signup and My Page used similar Profile Forms
- Multiple Modals contained repeated UI structures
- Frontend domain types were distributed across different locations
- Main Screen was responsible for multiple features

The issue was identified not as an individual feature problem, but as a **structural problem caused by unclear boundaries between component responsibilities and shared logic**.

#### Solution

The frontend architecture was reorganized based on functionality and responsibility.

- Separated Main Screen into Layout and Route-level responsibilities
- Introduced a shared frontend API client
- Centralized domain types
- Shared the Profile Form between Signup and My Page
- Shared the input UI between Main Chat and Simulation
- Extracted repeated Modal structures into a reusable Modal Shell component
- Reduced duplicated Admin Template Panel structures
- Separated network calls from UI components
- Added Error Boundary and Loading State handling

Rather than simply splitting files, the refactoring focused on **redefining responsibilities so that code that changes for the same reason is grouped together**.

#### Result

Clarified the responsibilities of individual screens and shared components, reducing the scope of code that needs to be reviewed when modifying specific features.

Shared UI and API handling structures were also made reusable, improving the frontend architecture for future feature additions and UI changes.

---

### 7-3. Improving AI Response UX with Streaming

#### Problem

With a conventional request-response approach, users must wait until the AI finishes generating the entire response before seeing the result.

As responses become longer, users may have difficulty determining whether their request is being processed correctly, making the perceived waiting time longer than the actual generation time.

#### Analysis

Because the frontend cannot directly reduce the AI model's generation time, displaying generated content progressively was considered more appropriate for a conversational interface than rendering the entire response only after generation was complete.

Since both Main Chat and Simulation use AI-generated responses, a reusable streaming architecture was required rather than a solution tied to a single screen.

#### Solution

Implemented streaming AI responses so that generated content could be progressively reflected in the frontend.

- Implemented a shared API client for streaming requests
- Processed `text/event-stream` responses
- Connected Main Chat to a streaming message endpoint
- Reused the same streaming architecture in Simulation
- Managed AI message streaming state separately
- Incrementally updated existing AI messages as response content arrived

This allowed Main Chat and Simulation to reuse the same streaming mechanism.

#### Result

Improved the user experience by allowing users to **see AI responses as they are generated instead of waiting for the entire response to complete**.

Streaming logic was also separated into a shared API layer, allowing the same implementation to be reused across multiple AI conversation screens.

---

## 8. API Documentation

The API specification is maintained as a separate document to clearly define endpoints, request formats, and response structures between the frontend and backend.

During the two-person development process, the document served as a shared reference to ensure that both frontend and backend development followed consistent request and response specifications.

[MBTInduce API Documentation](https://docs.google.com/document/d/1cfbuPG2nsKaCHA7x5rJtaO5bWX-61feJREjMbKB7Ofo/edit?usp=sharing)

---

## 9. Project Goal

MBTInduce was developed to go beyond AI providing responses from a single perspective and create an **AI interaction experience where users can directly choose, adjust, and compare the perspectives they want**.

Through MBTI trait adjustment, side-by-side perspective comparison, MBTI-based conversation simulation, and schedule-aware AI planning, MBTInduce aims to provide an experience where users can **actively explore and select the perspectives they need rather than passively accepting a single AI response**.