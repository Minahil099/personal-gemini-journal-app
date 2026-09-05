# 🌟 Personal Gemini Journal

> **A private, AI-powered journaling sanctuary where users can write, reflect, and understand their thoughts through Gemini.**

Personal Gemini Journal is an AI-powered journaling application created for the **Google Cloud Gen AI Academy APAC Cohort 3 — Ideathon 2026**, organized by **Hack2skill**.

The project goes beyond traditional journaling by combining **multi-turn Gemini conversations, Smart Journal Insights, guided reflection prompts, and user-isolated Firestore storage** in one secure experience.

### 💡 Core Experience

**Write → Reflect → Converse → Understand**

Users can privately record their thoughts, discuss their reflections with Gemini, and gain additional insights from their journal entries.

---

## ✨ Key Features

### 🤖 1. Multi-Turn Gemini Reflection

The journal is designed as an ongoing conversation rather than a collection of one-time AI responses.

* Multi-turn AI conversations
* Context-aware reflective responses
* Follow-up questions for deeper reflection
* Empathetic journaling assistance

### 📊 2. Smart Journal Insights

Gemini helps users understand patterns within their reflections.

Insights include:

* **Mood**
* **Topics**
* **Reflection patterns**
* **Journal statistics**

This turns stored journal entries into meaningful reflection insights.

### 🔐 3. User-Isolated Journal Data

Every user's journal data is associated with their authenticated **Firebase UID**.

Firestore security rules are designed around user ownership:

```text
request.auth.uid == userId
```

This prevents users from accessing another user's journal entries.

### 🛡️ 4. Threat-Model-First Security

Security was considered as part of the application design rather than added afterward.

The project considers:

* Authentication and authorization
* User data isolation
* Prompt-injection risks
* Input handling
* Least-privilege access
* Secret management

### 💭 5. Guided Reflection Prompts

Users can start their reflection using structured prompts:

* 🌅 Daily Check-In
* 💛 Gratitude & Joy
* 🧩 Working Through Friction
* 🎨 Creative Introspection

### 📝 6. Complete Journal Management

Users can:

* Create journal entries
* Save entries to Firestore
* Load their personal entries
* Delete entries
* Sign out securely

---

# 🔒 Security & Threat Model

Personal Gemini Journal follows a **threat-model-first approach**.

### Authentication

Google Sign-In is implemented through **Firebase Authentication**.

Only authenticated users should access their personal journal data.

### Data Isolation

Journal entries are scoped to the authenticated user's Firebase UID.

The intended access model is:

```text
User
  ↓
Firebase Authentication
  ↓
Authenticated Firebase UID
  ↓
UID-based Firestore access
  ↓
User's own journal entries
```

### Prompt Injection

The application considers prompt-injection risks when processing user-provided journal content and AI interactions.

### Secrets

Sensitive Gemini credentials are not intended to be stored directly in the source code.

Secret handling is managed through the available **Google AI Studio / Google Cloud secret-management configuration**.

### Cross-User Verification

User isolation was manually tested by signing in with a second Google account and verifying that another user's journal entries were not visible.

---

# 🏗️ Architecture

```text
                         ┌──────────────────┐
                         │      User        │
                         └────────┬─────────┘
                                  │
                                  ▼
                    ┌─────────────────────────┐
                    │   Firebase Auth         │
                    │   Google Sign-In        │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │ Personal Gemini Journal │
                    │   React / TypeScript     │
                    └─────────┬───────┬───────┘
                              │       │
                       Journal│       │ Gemini
                         data │       │ requests
                              ▼       ▼
                     ┌────────────┐ ┌──────────┐
                     │ Firestore  │ │  Gemini  │
                     │ UID-based  │ │   API    │
                     │ isolation  │ └──────────┘
                     └────────────┘
                              │
                              ▼
                     ┌─────────────────┐
                     │  Google Cloud   │
                     │    Cloud Run    │
                     └─────────────────┘
```

---

# 🛠️ Technology Stack

| Layer             | Technology                                           |
| ----------------- | ---------------------------------------------------- |
| Frontend          | React + TypeScript                                   |
| AI                | Gemini API via Google AI Studio                      |
| Authentication    | Firebase Authentication — Google Sign-In             |
| Database          | Cloud Firestore                                      |
| Deployment        | Google Cloud Run                                     |
| Secret Management | Google AI Studio / Google Cloud secret configuration |
| Development       | Google AI Studio Build Mode                          |

---

# 🚀 Deployment

The application was built and published using **Google AI Studio Build Mode** and connected Google Cloud/Firebase services.

### Build & Configuration

Custom instructions were used to define requirements for:

* Firebase Authentication
* Firestore security
* User data isolation
* Gemini integration
* Threat modeling
* Secure secret handling
* Responsive UI

### Testing

The following core functionality was tested:

* ✅ Google Sign-In
* ✅ Multi-turn Gemini conversations
* ✅ Journal creation
* ✅ Firestore save/load
* ✅ Entry deletion
* ✅ Sign-out
* ✅ Cross-user data isolation

### Cloud Run

The application was deployed through the Google Cloud environment and tested as a Cloud Run application.

---

🔗 Live Application
Official Cloud Run Service: personal-gemini-journal (asia-southeast1)

https://journal-with-gemini55.ai.studio

Note: This deployment is temporarily inaccessible because the linked Academy codelab billing account closed after its credits expired, disabling billing on the project — this is unrelated to the application code. See the Demo section below for a full working walkthrough video.
---

# 🔐 Firestore Security Model

The intended access model is:

```text
No public journal access
          ↓
Authenticated user required
          ↓
Firebase Authentication UID
          ↓
UID matches journal owner
          ↓
       Access allowed
```

The application's journal data is designed around user ownership rather than shared access.

The Firebase Web API key contained in the frontend configuration is a **public Firebase Web API key**. It is not treated as the application's private secret.

Actual data protection relies on:

* Firebase Authentication
* Firestore Security Rules
* User-scoped authorization
* Secret management for private credentials

---

# 🎯 Why This Project?

Traditional journaling mainly focuses on storing thoughts.

Personal Gemini Journal adds an interactive reflection layer:

```text
Traditional Journal
Write → Save

Personal Gemini Journal
Write → Reflect → Converse → Discover Insights
```

The goal is to create a private space where users can explore their thoughts through an AI-assisted reflection experience while keeping journal data isolated per user.

---

# 🏆 Ideathon Focus

The project was designed with the Hack2skill Ideathon evaluation areas in mind:

### ❤️ Authenticity

A journaling experience enhanced with **multi-turn Gemini reflection and Smart Journal Insights**.

### 👤 Usability

Simple Google Sign-In, guided prompts, conversational reflection, and straightforward journal management.

### ⚙️ Stability

Core authentication, AI conversation, journal persistence, deletion, and sign-out flows were tested.

### 🛡️ Security

User-isolated Firestore storage, Firebase Authentication, security rules, threat modeling, and secret-management practices.

---

# 📌 Project Highlights

**🔐 Secure Authentication**
Google Sign-In with Firebase Authentication.

**🤖 AI Reflection**
Multi-turn, context-aware Gemini conversations.

**📊 Smart Insights**
Mood, topics, reflection patterns, and journal statistics.

**🔒 User Isolation**
Firestore data scoped to authenticated users.

**🛡️ Threat Modeling**
Security considered throughout application design.

**☁️ Cloud Deployment**
Application deployed using Google Cloud Run.

---

# 🎥 Demo

**Demo Video:**

https://drive.google.com/file/d/1NzpfG2JRTx2I-w7pGEsJ12O4IBf_rD9I/view?usp=drivesdk

The demo walks through the application from **sign-in → journaling → Gemini conversation → saving entries → application/code walkthrough**.

---

# 🏆 Built For

**Google Cloud Gen AI Academy APAC Edition — Cohort 3**

**Ideathon 2026 — Hack2skill**

Built with Google Cloud technologies, Firebase, and Gemini.

---

# 👤 Author

**Minahil Sajjad**

Software Engineering Student

---

## 🚀 Project Status

**Built for the Hack2skill Ideathon 2026.**

> **Write. Reflect. Converse. Understand.**
