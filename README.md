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


# 🫱🏻‍🫲🏼 Team


### Seungjoo
- Project Planning
- Frontend Development  
- UI / UX Design


### Jibeom
- Project Planning
- Backend Development
- AI Model Training & Tuning


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

# 🗣️ Frontend Development Plan

| Feature | Description | Estimated Date |
|---|---|---|
| 1. Hamburgers | Hamburger menu implementation for logged-in and logged-out users | ~3/24 |
| 2. Main Chat | Chat UI, right tab, templates, and input window | ~4/7 |
| 3. Simulation | Simulation page and right-side tab UI | ~4/21 |
| 4. Calendar | Calendar library integration and right tab | ~5/11 |
| 5. History | Chat history, edit/delete buttons, chat tabs, top bar | ~5/18 |
| 6. Start Page / Sign Up / My Page | Nickname, MBTI settings, save functionality, profile window | ~5/20 |
| 7. Admin Page | Total users, ratings, question templates, log out button | ~5/22 |
| 8. Responsive Design | Responsive UI optimization | ~5/24 |
| 9. Testing | Frontend testing and debugging | ~5/26 |
| 10. Distribution | Deployment and distribution | ~5/26 |

---

# 🗣️ Backend Development Plan

| Feature | Description | Estimated Date |
|---|---|---|
| 1. Google Login Implementation | OAuth login system | ~3/24 |
| 2. Database Setup | Database schema and API variable structure for Main Chat, Simulation, Calendar | ~3/24 |
| 3. Main Chat | Main chat backend implementation | ~4/7 |
| 4. Simulation | Simulation backend implementation | ~4/21 |
| 5. Calendar | Calendar backend implementation | ~5/11 |
| 6. Sign Up / My Page | User profile and account management | ~5/19 |
| 7. Administrators Page | Admin system backend | ~5/22 |
| 8. Backend Layer | Backend layer integration for Main Chat, Simulation, Calendar | ~5/23 |
| 9. AI Service Layer | GPT tuning and AI service optimization | ~5/25 |
| 10. Testing | Backend testing and debugging | ~5/26 |

---

# ✅ Bug Tracking and Reporting

We use **GitHub Issues** to track bugs, errors, and unfinished fixes for this project.

## Where to Check Outstanding Bugs

Outstanding bugs can be checked in the **Issues** tab of this repository:

[GitHub Issues](https://github.com/printseungjoo/MBTInduce/issues)

Open issues represent bugs or problems that still need to be fixed.  
Closed issues represent bugs that have already been resolved.

## How to Report a Bug

If you find a bug, please report it by creating a new GitHub Issue.

### Steps to Report a Bug

1. Go to the [Issues page](https://github.com/printseungjoo/MBTInduce/issues)
2. Click **New Issue**
3. Write a clear title
4. Describe the bug using the format below
5. Submit the issue
