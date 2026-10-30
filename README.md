# CampusConnect AI — Autonomous College Management Platform

> An AI-powered, production-grade university operating system and student portal built with **React 19**, **TypeScript**, **Tailwind CSS v4**, **Express**, and **Google Gemini 3.8 Flash**.

[![Live Demo](https://img.shields.io/badge/Live_Demo-Google_AI_Studio-6366f1?style=for-the-badge&logo=google)](https://ais-dev-jktr3aeuh7yt4mtadykho3-544781637057.asia-southeast1.run.app)
[![Built with Gemini](https://img.shields.io/badge/Gemini_3.8_Flash-Google_Gen_AI-8b5cf6?style=for-the-badge&logo=googlegemini)](https://ai.google.dev/)
[![React 19](https://img.shields.io/badge/React_19-Vite_8-38bdf8?style=for-the-badge&logo=react)](https://react.dev/)

---

## 🏛️ Project Overview

**CampusConnect AI** unifies academic tracking, facility navigation, student support, and study acceleration into a single coherent web platform for modern institutions (showcased with **Apex Institute of Science & Technology**):

1. **University Public Website**: Full-featured institutional web presence featuring academic program explorer, campus life showcase, embedded interactive AI playground, institutional pricing plans, and quick launch triggers.
2. **Student Management Portal**: Comprehensive dashboard for enrolled students with real-time academic monitors, attendance calculators, and live campus alerts.

---

## ⚡ Key Features

### 1. 🤖 AI Campus Concierge (Powered by Gemini 3.8 Flash)
- **Domain-Grounded AI**: Accurate knowledge of university statutes, department faculty, GPU cluster labs, library hours, examination bylaws, and shuttle routes.
- **Embedded Web Playground & Portal Chat**: Live streaming responses, code & markdown highlights, prompt chips, and fallback simulation.

### 2. 📊 Student Dashboard & 75% Attendance Sentinel
- **Eligibility Forecaster**: Real-time course tracking with safe margin calculations. Students can simulate attending or missing future classes to verify whether they remain eligible for end-semester examinations.
- **Academic KPIs**: Cumulative GPA (8.92 / 10.0), credit tracker (94/130 earned), and today's class timeline.

### 3. 🗓️ Smart Conflict-Free Timetable
- **Dual Visualizations**: Seamless switching between Day Agenda and Full Week Schedule Matrix.
- **iCal / Google Calendar Export**: One-click generation of RFC-5545 standard `.ics` files for mobile sync.
- **Personal Study Scheduler**: Add custom revision or project sprint slots saved in local storage.

### 4. 🗺️ Interactive Campus 2D Vector Map & Route Finder
- **120-Acre Digital Twin**: Interactive SVG canvas with clickable pins for Block A, Block B (Innovation & AI Hub), Central Library, Admin Block 104, Cafeteria, Sports Complex, and Hostels.
- **Turn-by-Turn Route Pathfinding**: Computes animated walking paths between campus landmarks with estimated walk times, distance, and wheelchair accessibility notes.

### 5. 🛡️ Student Grievance & Complaint Redressal (24-48h SLA)
- **Multi-Stage Tracking**: Real-time status badges (`Submitted`, `Under Review`, `In Progress`, `Resolved`, `Escalated`).
- **Anonymous Filing**: Protects student identity when reporting infrastructure, hostel, or mess issues.
- **Interactive Timeline**: Technician repair notes and student follow-up comments.

### 6. 🧠 AI Study Buddy & Quiz Coach
- **Lecture Notes Summarizer**: Ingests textbook excerpts and outputs structured summaries and interactive 3D flip flashcards.
- **Smart Quiz Generator**: Generates multiple-choice questions with difficulty tiers, distractor explanations, and celebration confetti.
- **ELI5 Concept Explainer**: Provides intuitive real-world analogies and golden exam rules for complex technical topics.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Canvas Confetti
- **Backend / Full-Stack**: Node.js, Express, `tsx`, Vite Middleware
- **AI Integration**: `@google/genai` TypeScript SDK (`gemini-3.8-flash`) with server-side proxy
- **State & Storage**: React Hooks, LocalStorage persistence, Full-Stack REST API

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ / 20+
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/Mokshcodes201108/GOOGLE-AI-STUDIO_CAMPUS-CONNECT-AI.git
cd GOOGLE-AI-STUDIO_CAMPUS-CONNECT-AI

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Set your GEMINI_API_KEY in .env

# Run development server (runs full-stack Express + Vite on port 3000)
npm run dev
```

Visit `http://localhost:3000` to view the application.

### Building for Production

```bash
npm run build
npm start
```

---

## 📄 License
Apache-2.0