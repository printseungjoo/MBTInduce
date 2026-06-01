# MBTInduce


MBTInduce is a ChatGPT(AI) agent web service that allows users to induce ChatGPT responses based on selected MBTI personality traits.  
Users can choose specific MBTI characteristics and control how strongly those traits influence the AI's answers.

The platform helps users receive responses that match the emotional tone or logical style they want, and also allows them to simulate conversations with specific MBTI personalities.

---

## ⚠️ Problem Statement

Current AI chat services typically provide responses based on a single generalized model.  
While this approach works well for many cases, it does not consider that people often want different types of responses depending on their personality or emotional needs.

For example, some users may prefer empathetic and supportive responses, while others may prefer logical and objective advice. However, most AI systems generate answers without allowing users to control these perspectives.

In addition, people are often curious about how individuals with different personality types might react in certain situations. Existing AI tools do not provide an easy way to simulate conversations or responses based on specific personality traits.

Because of this limitation, users cannot easily:

- Guide the tone or reasoning style of AI responses  
- Compare answers from different personality perspectives  
- Simulate conversations with specific personality types  

MBTInduce addresses this problem by allowing users to influence AI responses using MBTI personality traits and simulate interactions from different personality perspectives.

---


## 📝 Project Overview


People often want different types of responses depending on the situation.  
Sometimes users want emotional comfort, while other times they want realistic or logical advice.


Recently, content like **“answering as an F-type personality”** has become popular online because people recognize that communication styles differ depending on personality traits.


MBTInduce integrates **MBTI personality concepts with AI responses** so that users can guide the tone and perspective of ChatGPT answers.


For example:


- A user whose MBTI is **ESFP** might want to understand how someone with **ENTP** would react in a conversation.
- A user might want to see how different personality perspectives approach the same problem.
- A user whose MBTI is **ESFJ** might want ChatGPT to plan tightly while a user whose MBTI is **ESFP** does not want to.


This service helps users explore their problems from various perspectives, understand others better, and simulate conversations based on MBTI personalities.


---


# ✨ Features


## 1. MBTI Trait-Based Response Induction
Users can input a question and select specific MBTI traits to influence the AI response.


Examples:
- Select **F** to receive a more empathetic response
- Select **T + S** for a logical and practical response


Users can also control the **influence percentage** of each trait using a slider.




---


## 2. Dual Perspective Comparison Mode
Users can compare answers from two different personality perspectives.


Example:
- F vs T
- N vs S


Both responses appear on the screen simultaneously, allowing users to choose which answer they prefer.


---


## 3. MBTI Conversation Simulation
Users can simulate conversations with a selected MBTI personality.




The AI generates dialogue responses as if the selected MBTI personality were participating in the conversation.


This feature works like a **role-play simulation system**.


---


## 4. Smart Planning with Calendar Integration
When the user asks the ChatGPT to plan, the original ChatGPT's answer is usually answered without knowing the user's existing schedule. With our service, the AI can generate plans while considering the user's calendar.


Users can:
- Write important existing events in a calendar UI
- Ask AI to generate schedules
- Receive plans that avoid original scheduling conflicts


---


## 5. User MBTI Personalization
Users can fill out their MBTI in advance.


If no MBTI traits are manually selected, the AI automatically generates responses that match the user's MBTI personality.


---


## 6. AI Feedback System
Users can evaluate every response with:


- 👍 Like
- 👎 Dislike
- Comments


These evaluations are used in the admin panel to improve future AI responses.


---


## 7. Google OAuth Login
Users can log in using their Google account via OAuth authentication.


---


## 8. Conversation Simulation with Media Context Interaction
Users can upload media files such as exported **KakaoTalk conversation records**.


The AI analyzes these records to gain contextual understanding before running a simulation, producing more realistic responses.


---


## 9. Question Template Library
A sidebar provides commonly used question templates to help users quickly start conversations.


---


## 10. MBTI Tab Response View
Users can view responses from all MBTI perspectives.


Instead of displaying everything at once, responses are organized into **tabs** for each MBTI dimension.


Example:
- E
- I
- S
- N
- T
- F
- J
- P


---


# 🛠 Admin Features


The admin dashboard provides analytics and management tools.


### Admin Capabilities


- View user feedback on AI responses
- Monitor the most frequently used templates
- Track comparison mode usage rate
- Monitor system error rates
- Track average response time
- View total users and number of questions
- Receive and respond to user inquiries


---

# 🎯 Goal


MBTInduce aims to create a new AI interaction experience where users can explore different personality perspectives, improve communication understanding, and receive responses tailored to their preferred emotional or logical style.

---

# Instructions for Checking Out the Source Code

### 1. Clone the Repository

Download the project directly from the main branch, or clone it using the command below.

```bash
git clone https://github.com/printseungjoo/MBTInduce.git
```

### 2. Move into the Project Folder

```bash
cd MBTInduce
```

### 3. Install Dependencies

Install dependencies for the root project, frontend, and backend.

```bash
npm install

cd frontend
npm install

cd ../backend
npm install

cd ..
```

### 4. Set Up Environment Variables

Move into the backend folder and create a `.env` file by copying `.env.example`.

```bash
cd backend
copy .env.example .env
```

> Note: For `.env` setup, please follow the instructions in the **Getting Started** section below.

### 5. Set Up the Database

After starting PostgreSQL, run the following commands inside the backend folder.

```bash
npm run prisma:generate
npm run prisma:migrate
```

---


# ⚙️ Getting Started

### 1. Clone the repository
git clone https://github.com/printseungjoo/MBTInduce.git  

cd MBTInduce

### 2. Install dependencies
npm install  

cd frontend && npm install  

cd ../backend && npm install  

cd ..

### 3. Environment Setup
The backend requires a `.env` file to work properly.
If you need access to the `.env` file, please request it via email:
printseungjoo@gmail.com  

The request will be reviewed before the file is shared.

### 4. Run the project
From the root directory:
npm run dev  

This command runs both frontend and backend simultaneously.

### Local Development
- Frontend: http://localhost:5173  
- Backend: http://localhost:4000

### Notes
- PostgreSQL must be running before starting the backend.
- The backend will not work without a valid `.env` file.

---


# 🔒 Privacy Policy


To protect user privacy:


- User questions and AI responses are **not stored permanently**
- Sensitive user conversations are **not collected or stored**
- Only anonymous analytics data is used for system improvement




















---


# 🚀 Tech Stack


### Frontend
- React
- TypeScript
- Emotion


### Backend
- Node.js
- AI API Integration
- Express

### Authentication
- Google OAuth


### AI
- OpenAI API
- Prompt Engineering
- Personality-based response tuning


---

### Tools
- Jira
- Figma
- Git / GitHub

---

## 🗣️ Frontend Development Plan

| Feature                                              | Description                                                                                               | Estimated Date | Status      |
| ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | -------------: | ----------- |
| 1. Hamburger / Navigation UI                         | Hamburger menu implementation for logged-in and logged-out users                                          |          ~3/24 | ✅ Completed |
| 2. Main Chat Page                                    | Chat UI, right screen, templates, and input box                                                           |           ~4/7 | ✅ Completed |
| 3. Simulation Page                                   | Simulation UI and right-side interaction                                                                  |          ~4/21 | ✅ Completed |
| 4. Calendar Page                                     | Calendar UI and schedule interaction                                                                      |          ~5/11 | ✅ Completed |
| 5. History Page                                      | Main chat, simulation, and schedule history                                                               |          ~5/18 | ✅ Completed |
| 6. Start Page / Sign Up / My Page                    | Sign up flow, profile, nickname, MBTI settings                                                            |          ~5/20 | ✅ Completed |
| 7. Admin Page                                        | Statistics, rating data, logout functionality                                                             |          ~5/23 | ✅ Completed |
| 8. Responsive Design                                 | Responsive optimization for start page, main chat, simulation, calendar, history, my page, and admin page |          ~5/26 | ✅ Completed |
| 9. Testing and Bug Fixing                            | Frontend testing and debugging                                                                            |          ~5/30 | ✅ Completed |
| 10. Deployment / Analytics / Environment Refactoring | Deployment, analytics integration, and environment refactoring                                            |          ~5/31 | ✅ Completed |

---

## 🗣️ Backend Development Plan

| Feature                        | Description                                                                                 | Estimated Date | Status      |
| ------------------------------ | ------------------------------------------------------------------------------------------- | -------------: | ----------- |
| 1. Google Login Implementation | Google OAuth login system implementation                                                    |          ~3/24 | ✅ Completed |
| 2. Database Setup              | Database schema, variable naming, and API data flow for Main Chat, Simulation, and Calendar |          ~3/24 | ✅ Completed |
| 3. Main Chat                   | Main chat backend API and logic                                                             |           ~4/7 | ✅ Completed |
| 4. Simulation                  | Simulation backend API and functionality                                                    |          ~4/21 | ✅ Completed |
| 5. Calendar                    | Calendar backend API and event handling                                                     |          ~5/11 | ✅ Completed |
| 6. Sign Up / My Page           | User profile, sign up, and account management                                               |          ~5/19 | ✅ Completed |
| 7. Administrators Page         | Admin page backend and role-based access                                                    |          ~5/22 | ✅ Completed |
| 8. AI Service Layer - Tuning   | AI response service tuning and prompt improvements                                          |          ~5/25 | ✅ Completed |
| 9. Testing                     | Backend testing and debugging                                                               |          ~5/26 | ✅ Completed |


---

## Bug Tracking System

Our team uses **Jira** as the main bug tracking system for this project.

All outstanding bugs, reported issues, and serious problems are recorded and managed in Jira. Team members can check the current list of bugs, assigned person, and progress through the Jira project board.

If a new bug or issue is found, it should be reported in Jira with the following information:

- Description of the problem
- issued date
- Expected behavior

For serious bugs, the issue is generally assigned to a responsible team member, and the required bug-fixing time is managed according to the project milestones and schedule.

Since our team is using Jira instead of GitHub Issues, please refer to our Jira board for the official list of outstanding bugs and bug reports.

---

# 📡 API Documentation

[MBTInduce API (Google Doc)](https://docs.google.com/document/d/1cfbuPG2nsKaCHA7x5rJtaO5bWX-61feJREjMbKB7Ofo/edit?usp=sharing)


---

## 💻 Supported Operating Systems

The setup, build, and testing instructions in this project are intended to work on the operating systems currently used by our team members.

### 🖥️ Supported OS

* Windows 11 (Intel-based systems)
* Else

These instructions have been written and tested for Windows 11 development environments used by the team.

### ⚙️ Team Development Environment

| Team Member  | Operating System |
| ------------ | ---------------- |
| Seungjoo  | Windows 11       |
| Jibeom    | Windows 11       |

Since all team members use Windows 11, all setup, build, testing, and deployment instructions in this README are optimized for a Windows 11 environment.

---

# 🥹 Notification

When running the website, it would feel slow. But everything works well with low speed. Please wait for the process. Also, if something doesn’t work, can you report printseungjoo@gmail.com and jibeom.ryu@stonybrook.edu if you can give us a chance for us to refactor code?

---

# 🫱🏻‍🫲🏼 Team


### Seungjoo
- Project Planning
- Frontend Development  
- UI / UX Design


### Jibeom
- Project Planning
- Backend Development
- AI Model Training & Tuning
