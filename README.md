🌟 Personal Gemini Journal
A confidential, AI-powered personal journaling sanctuary built with Gemini, Firebase, Firestore, and Google Cloud Run.
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
Gemini helps extract useful insights from journal entries, including mood, topics, reflection patterns, and journal statistics.
📝 Journal Management
Create journal entries
Save entries to Firestore
Load personal entries
Delete entries
Sign out securely
🛠️ Tech Stack
Layer
Technology
AI Model
Gemini API (via Google AI Studio)
Authentication
Firebase Authentication (Google Sign-In)
Database
Cloud Firestore (per-user isolated documents)
Hosting/Deployment
Google Cloud Run
Secrets Management
Google Cloud Secret Manager
Frontend
Built and generated via Google AI Studio Build Mode
🔒 Security & Threat Model
This application was built with a threat-modeling-first approach, covering:
Input Surfaces — validating and sanitizing all user-submitted journal content
Prompt Injection & Reasoning — safeguards against malicious prompts influencing the AI's behavior
Tool & API Execution — least-privilege access to backend services
Memory & State — per-user Firestore isolation (request.auth.uid == userId), no cross-user data leakage
Inter-System Communication — secure API key handling via Secret Manager, no hardcoded secrets
Cross-user data isolation was manually verified by signing in with a second Google account and confirming zero visibility into another user's entries.
🔒 Security & Threat Model
The application was developed with a threat-modeling-first approach.
Input Surfaces — User-submitted journal content is validated and handled carefully before being processed.
Prompt Injection — The application considers prompt-injection risks and includes safeguards designed to prevent malicious instructions from improperly influencing AI behavior.
Tool & API Execution — Backend access follows a least-privilege approach wherever applicable.
Memory & State Isolation — Journal data is associated with the authenticated user's Firebase UID. Firestore security rules enforce user-level access so that users cannot access another user's journal entries.
Secrets — Sensitive credentials and API keys are not hardcoded into the application. Secret management is handled through Google Cloud Secret Manager where applicable.
Cross-User Verification — Cross-user isolation was manually tested by signing in with a second Google account and verifying that another user's journal entries were not visible.
🚀 Deployment
The application was built and deployed using Google AI Studio Build Mode.
Configure Google AI Studio — custom instructions defined requirements including Firebase Authentication, Firestore security, user data isolation, Gemini integration, threat modeling, secure secret handling, and responsive UI.
Build the Application — generated and refined in Google AI Studio Build Mode with requirements for authentication, journaling, Gemini conversations, Firestore storage, and security.
Configure Firebase & Firestore — Firebase Authentication and Cloud Firestore were configured in the connected Google Cloud project. Journal entries are stored according to the authenticated user's UID.
Test the Application — Google Sign-In, multi-turn Gemini conversations, journal creation, Firestore save/load, entry deletion, sign-out, and cross-user data isolation were all tested.
Publish to Cloud Run — published through the Google AI Studio publishing flow: Publish → Configure Preferences → Publish Your App.
Cloud Run Label — the Cloud Run service was labeled dev-tutorial: cloud-run-ai-challenge.
GitHub Sync — the source code was synchronized to GitHub through the Google AI Studio Share → GitHub flow.
🔗 Live Application
Cloud Run: https://journal-with-gemini55.ai.studio
🔐 Firestore Security
Journal entries are protected by Firestore security rules. The intended access model is:
Code
No public read/write access is permitted. Access requires an authenticated user whose UID matches the owner of the stored journal data.
🏗️ Architecture
Code
🎯 Project Goal
Personal Gemini Journal aims to provide a private space where users can:
Write → Reflect → Converse → Understand
Instead of simply storing journal entries, the application uses Gemini to turn journaling into an interactive reflection experience.
🏆 Built For
Google Cloud Gen AI Academy APAC Edition — Cohort 3
Ideathon 2026 — Hack2skill
Built using Google Cloud technologies and Gemini.
Hashtag: #AccelerateAIwithCloudRun
👤 Author
Minahil Sajjad
Software Engineering Student
📌 Project Status
Built and deployed for the Hack2skill Ideathon 2026.
