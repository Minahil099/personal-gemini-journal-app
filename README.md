🌟 Personal Gemini Journal

A confidential, AI-powered personal journaling sanctuary built with Gemini, Firebase, Firestore, and Google Cloud.

Personal Gemini Journal is a secure, user-authenticated journaling application created for the Google Cloud Gen AI Academy APAC Cohort 3 — Ideathon 2026, organized by Hack2skill.

The application allows users to privately record their thoughts and reflections while engaging in multi-turn, empathetic conversations with Gemini. Each user's journal data is isolated using their Firebase Authentication UID.

✨ Features
🔐 Secure Authentication
Google Sign-In using Firebase Authentication
Authenticated access to personal journal data
User-specific Firestore data isolation
🤖 Gemini-Powered Reflection
Multi-turn AI conversations
Context-aware reflective responses
Follow-up questions to encourage deeper reflection
Empathetic journaling assistance
💭 Guided Reflection Prompts
🌅 Daily Check-In
💛 Gratitude & Joy
🧩 Working Through Friction
🎨 Creative Introspection
📊 Smart Journal Insights

Gemini helps extract useful insights from journal entries, including:

Mood
Topics
Reflection patterns
Journal statistics
📝 Journal Management
Create journal entries
Save entries to Firestore
Load personal entries
Delete entries
Sign out securely
🛠️ Tech Stack
Layer	Technology
AI Model	Gemini API via Google AI Studio
Authentication	Firebase Authentication — Google Sign-In
Database	Cloud Firestore
Hosting / Deployment	Google Cloud Run
Secrets Management	Google Cloud Secret Manager
Frontend	Google AI Studio Build Mode
🔒 Security & Threat Model

The application was developed with a threat-modeling-first approach.

Input Surfaces

User-submitted journal content is validated and handled carefully before being processed.

Prompt Injection

The application considers prompt-injection risks and includes safeguards designed to prevent malicious instructions from improperly influencing AI behavior.

Tool & API Execution

Backend access follows a least-privilege approach wherever applicable.

Memory & State Isolation

Journal data is associated with the authenticated user's Firebase UID.

Firestore security rules enforce user-level access so that users cannot access another user's journal entries.

Secrets

Sensitive credentials and API keys are not hardcoded into the application. Secret management is handled through Google Cloud Secret Manager where applicable.

Cross-User Verification

Cross-user isolation was manually tested by signing in with a second Google account and verifying that another user's journal entries were not visible.

🚀 Deployment

The application was built and deployed using Google AI Studio Build Mode.

1. Configure Google AI Studio

Custom instructions defined requirements for:

Firebase Authentication
Firestore security
User data isolation
Gemini integration
Threat modeling
Secure secret handling
Responsive UI
2. Build the Application

The application was generated and refined in Google AI Studio Build Mode with requirements for authentication, journaling, Gemini conversations, Firestore storage, and security.

3. Configure Firebase & Firestore

Firebase Authentication and Cloud Firestore were configured in the connected Google Cloud project.

Journal entries are stored according to the authenticated user's UID.

4. Test the Application

The following functionality was tested:

Google Sign-In
Multi-turn Gemini conversations
Journal creation
Firestore save/load
Entry deletion
Sign-out
Cross-user data isolation
5. Publish the Application

The application was published through the Google AI Studio publishing flow:

Publish → Configure Preferences → Publish Your App

6. Cloud Run Label

The Cloud Run service was labeled:

dev-tutorial: cloud-run-ai-challenge

7. GitHub Sync

The source code was synchronized to GitHub through the Google AI Studio:

Share → GitHub

🔗 Live Application

Live App: https://ais-dev-6ouoocm6zx4pxjkmneky4i-169198190045.asia-east1.run.app

This is the live, working Cloud Run deployment of the application. Google Sign-In, multi-turn Gemini conversations, and Firestore journal save/load have all been verified working on this link.

🔐 Firestore Security

Journal entries are protected by Firestore security rules.

The intended access model is:

text
Authenticated User
        │
        ▼
Firebase Authentication
        │
        ▼
     User UID
        │
        ▼
Cloud Firestore
        │
        └── Only matching user's journal data

No public read/write access is permitted.

Access requires an authenticated user whose UID matches the owner of the stored journal data.

Firestore Security Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Deny all by default
    match /{document=**} {
      allow read, write: if false;
    }
    // User data is strictly isolated to the authenticated user matching the userId path segment
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
Security Notes

The firebaseApiKey in firebase-applet-config.json is a public Firebase Web API key, not a secret credential — this is standard per Firebase's official documentation. Actual data security is enforced via Firestore security rules (user-scoped request.auth.uid == userId) and Firebase Authentication, not by hiding this key.

The private Gemini API key is never exposed in this repository — it is injected only at runtime via environment secrets (Secret Manager / AI Studio Secrets panel).

🏗️ Architecture
text
                    ┌───────────────────┐
                    │       User        │
                    └─────────┬─────────┘
                              │
                              ▼
                    ┌───────────────────┐
                    │ Firebase Auth     │
                    │ Google Sign-In    │
                    └─────────┬─────────┘
                              │
                              ▼
                    ┌───────────────────┐
                    │ Personal Gemini   │
                    │ Journal           │
                    │                   │
                    │ AI Studio Build   │
                    │ Mode              │
                    └──────┬─────┬──────┘
                           │     │
              ┌────────────┘     └────────────┐
              ▼                               ▼
     ┌──────────────────┐          ┌──────────────────┐
     │    Gemini API    │          │  Cloud Firestore │
     │                  │          │                  │
     │ AI Reflection    │          │ User-Isolated    │
     │ & Insights       │          │ Journal Data     │
     └──────────────────┘          └──────────────────┘
                           │
                           ▼
                  ┌──────────────────┐
                  │ Google Cloud Run │
                  └──────────────────┘
🎯 Project Goal

Personal Gemini Journal aims to provide a private space where users can:

Write → Reflect → Converse → Understand

Instead of simply storing journal entries, the application uses Gemini to turn journaling into an interactive reflection experience.

🏆 Built For

Google Cloud Gen AI Academy APAC Edition — Cohort 3

Ideathon 2026 — Hack2skill

Built using Google Cloud technologies and Gemini.

Hashtag

#AccelerateAIwithCloudRun

👤 Author

Minahil Sajjad

Software Engineering Student

📌 Project Status

Built and deployed for the Hack2skill Ideathon 2026
