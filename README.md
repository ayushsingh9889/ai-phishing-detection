# 🛡️ AI Phishing Detection Platform

A full-stack cybersecurity web application that detects phishing URLs and emails using rule-based analysis + VirusTotal API.

![React](https://img.shields.io/badge/React-18-blue)
![Vite](https://img.shields.io/badge/Vite-5-purple)
![Node](https://img.shields.io/badge/Node-Express-green)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-orange)
![JWT](https://img.shields.io/badge/Auth-JWT-red)

---

## 🎯 Features

- **🔗 URL Scanner** — Detects phishing URLs using 7+ rule checks + VirusTotal API (70+ antivirus engines)
- **📧 Email Analyzer** — Identifies phishing patterns in email content (urgency, credentials, threats, links)
- **📊 Dashboard** — Visual stats, 7-day activity chart, recent scans overview
- **📜 Scan History** — Full history with filters (URL/EMAIL, LOW/MEDIUM/HIGH)
- **👑 Admin Panel** — User management, system logs, role-based access
- **🔐 JWT Authentication** — Secure login/register with bcrypt password hashing
- **🎨 Modern UI** — Sidebar navigation, dark theme, fully responsive

---

## 🛠️ Tech Stack

### Frontend
- **React 18** + **Vite** — Fast SPA development
- **Tailwind CSS** — Utility-first styling
- **Framer Motion** — Smooth animations
- **React Router v6** — Client-side routing
- **Axios** — HTTP client

### Backend
- **Node.js** + **Express** — REST API
- **JWT** — Token-based authentication
- **bcryptjs** — Password hashing

### Database
- **Supabase (PostgreSQL)** — Hosted database

### Security APIs
- **VirusTotal API** — 70+ antivirus engines threat intelligence

---

## 🏗️ Architecture
