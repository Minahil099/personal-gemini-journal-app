# 🌟 Personal Gemini Journal

> **A confidential, AI-powered personal journaling sanctuary built with Gemini, Firebase, Firestore, and Google Cloud.**

Personal Gemini Journal is a secure, user-authenticated journaling application built for the **Google Cloud Gen AI Academy APAC — Cohort 3 Ideathon 2026**, organized by **Hack2skill**.

The application allows users to privately record their thoughts and reflections while engaging in multi-turn conversations with Gemini. Journal data is isolated according to the authenticated user's Firebase Authentication UID.

---

## ✨ Features

### 🔐 Secure Authentication

* Google Sign-In using Firebase Authentication
* Authenticated access to personal journal data
* User-specific Firestore data isolation
* Secure sign-out functionality

### 🤖 Gemini-Powered Reflection

* Multi-turn AI conversations
* Context-aware reflective responses
* Follow-up questions for deeper reflection
* Empathetic journaling assistance

### 💭 Guided Reflection Prompts

* 🌅 **Daily Check-In**
* 💛 **Gratitude & Joy**
* 🧩 **Working Through Friction**
* 🎨 **Creative Introspection**

### 📊 Smart Journal Insights

Gemini can help identify useful patterns from journal entries, including:

* Mood
* Topics
* Reflection patterns
* Journal statistics

### 📝 Journal Management

* Create journal entries
* Save entries to Firestore
* Load personal entries
* Delete entries
* Sign out securely

---

## 🛠️ Tech Stack

| Layer             | Technology                                      |
| ----------------- | ----------------------------------------------- |
| AI                | Gemini API                                      |
| AI Development    | Google AI Studio                                |
| Authentication    | Firebase Authentication                         |
| Database          | Cloud Firestore                                 |
| Cloud Platform    | Google Cloud                                    |
| Deployment        | Google Cloud Run                                |
| Secret Management | Google Cloud Secret Manager / AI Studio Secrets |
| Frontend          | Google AI Studio Build Mode                     |

---

# 🔒 Security & Threat Model

The application was developed with a **threat-modeling-first approach**.

### Input Surfaces

User-submitted journal content is handled as application input and processed through the application's AI workflow.

### Prompt Injection

The application considers prompt-injection risks and includes safeguards intended to reduce the possibility of malicious instructions improperly influencing AI behavior.

### Tool & API Execution

Backend access follows a least-privilege approach where applicable.

### Memory & State Isolation

Journal data is associated with the authenticated user's Firebase Authentication UID.

Firestore security rules are designed to enforce user-level access so that authenticated users can access only their own journal data.

### Secrets

Sensitive Gemini credentials are not intended to be hardcoded into the application source code.

Private API credentials are provided through runtime secret configuration where applicable.

### Cross-User Verification

Cross-user isolation was manually tested by signing in with a second Google account and verifying that another user's journal entries were not visible.

---

# 🔐 Firestore Security

Journal entries are protected using **Cloud Firestore Security Rules**.

The intended access model is:

```text
Unauthenticated user
        ↓
     DENIED

Authenticated user
        ↓
Check Firebase Authentication UID
        ↓
UID matches journal owner
        ↓
     ALLOWED
```

The application does **not** rely on hiding the Firebase Web API key to protect journal data.

The Firebase Web API key contained in the client configuration is a public Firebase configuration value. Data protection is instead enforced through:

* Firebase Authentication
* Firestore Security Rules
* User-specific UID ownership
* Backend/runtime secret handling for private credentials

> **Important:** The private Gemini API key is not intended to be exposed in the public repository.

---

# 🏗️ Architecture

```text
                    ┌─────────────────────┐
                    │       User          │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Google Sign-In    │
                    │ Firebase Auth       │
                    └──────────┬──────────┘
                               │
                         Authenticated
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Personal Journal UI │
                    │ Google AI Studio    │
                    └───────┬───────┬─────┘
                            │       │
                 Journal   │       │ Gemini
                 Data      │       │ Requests
                            ▼       ▼
                 ┌────────────┐  ┌───────────┐
                 │ Firestore  │  │  Gemini   │
                 │ UID-based  │  │    AI     │
                 │ isolation  │  └───────────┘
                 └────────────┘
                            │
                            ▼
                    ┌─────────────────┐
                    │   Google Cloud  │
                    │    / Cloud Run  │
                    └─────────────────┘
```

---

# 🚀 Deployment

## 1. Configure Google AI Studio

Custom instructions were used to define requirements for:

* Firebase Authentication
* Firestore security
* User data isolation
* Gemini integration
* Threat modeling
* Secure secret handling
* Responsive UI

## 2. Build the Application

The application was generated and refined using **Google AI Studio Build Mode**.

The build requirements included:

* Authentication
* Journaling
* Gemini conversations
* Firestore storage
* User-level data isolation
* Security considerations
* Responsive interface

## 3. Configure Firebase & Firestore

Firebase Authentication and Cloud Firestore were configured in the connected Google Cloud environment.

Journal entries are stored according to the authenticated user's UID.

## 4. Test the Application

The following functionality was tested:

* ✅ Google Sign-In
* ✅ Multi-turn Gemini conversations
* ✅ Journal creation
* ✅ Firestore save/load
* ✅ Entry deletion
* ✅ Sign-out
* ✅ Cross-user data isolation

## 5. Publish the Application

The application was published through the Google AI Studio publishing flow:

```text
Publish
   ↓
Configure Preferences
   ↓
Publish Your App
```

## 6. Cloud Run Label

The Cloud Run service was labeled:

```text
dev-tutorial: cloud-run-ai-challenge
```

## 7. GitHub Sync

The source code was synchronized to GitHub using the Google AI Studio GitHub integration:

```text
Share → GitHub
```

---

# 🔗 Live Application

**Live App:**

https://ais-dev-6ouoocm6zx4pxjkmneky4i-169198190045.asia-east1.run.app

The deployed application provides:

* Google Sign-In
* Gemini-powered conversations
* Journal creation
* Firestore save/load
* Personal journal data isolation

---

# 🎯 Project Goal

Personal Gemini Journal aims to provide a private space where users can:

**Write → Reflect → Converse → Understand**

Instead of simply storing journal entries, the application uses Gemini to transform journaling into an interactive reflection experience.

---

# 🏆 Built For

**Google Cloud Gen AI Academy APAC Edition — Cohort 3**

**Ideathon 2026 — Hack2skill**

Built using Google Cloud technologies and Gemini.

### Hashtag

`#AccelerateAIwithCloudRun`

---

# 👤 Author

**Minahil Sajjad**

Software Engineering Student

---

# 📌 Project Status

🟢 **Built and deployed for the Hack2skill Ideathon 2026**

The application has been deployed to Google Cloud Run and the core authentication, Gemini interaction, Firestore journaling, and cross-user isolation functionality have been tested.
