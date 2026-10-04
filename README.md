<div align="center">

# 🛡️ AI Phishing Detection Platform

### Detect phishing URLs & emails before it's too late.

A full-stack cybersecurity web application that combines **rule-based analysis** with **real-time threat intelligence** to protect users from phishing attacks.

[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)
[![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io)

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Visit_Site-success?style=for-the-badge)](https://YOUR_VERCEL_URL.vercel.app)
[![GitHub Stars](https://img.shields.io/github/stars/YOUR_USERNAME/ai-phishing-detection?style=for-the-badge&color=yellow)](https://github.com/YOUR_USERNAME/ai-phishing-detection)

</div>

---

## 📖 Table of Contents

- [🎯 Overview](#-overview)
- [✨ Key Features](#-key-features)
- [🖼️ Screenshots](#️-screenshots)
- [🛠️ Tech Stack](#️-tech-stack)
- [🏗️ Architecture](#️-architecture)
- [🧠 How Detection Works](#-how-detection-works)
- [🚀 Quick Start](#-quick-start)
- [🗄️ Database Schema](#️-database-schema)
- [🔌 API Documentation](#-api-documentation)
- [🚢 Deployment](#-deployment)
- [🔮 Future Roadmap](#-future-roadmap)
- [👨‍💻 Author](#-author)
- [📝 License](#-license)

---

## 🎯 Overview

**Phishing attacks are the #1 cause of data breaches worldwide.** Millions of users fall victim to fake websites and emails every day because they can't distinguish between legitimate and malicious content.

This platform solves that problem with a **practical, lightweight, and effective approach**:

- ✅ **No complex ML training** — uses proven rule-based heuristics
- ✅ **Real threat intelligence** — integrated with VirusTotal (70+ antivirus engines)
- ✅ **Full-stack architecture** — production-ready, deployable code
- ✅ **Beautiful UI** — modern dark theme with smooth animations
- ✅ **Role-based access** — user + admin panels

Whether you're a student, developer, or organization — this tool helps you **verify links before clicking** and **spot phishing emails instantly**.

---

## ✨ Key Features

<table>
<tr>
<td width="50%">

### 🔗 URL Scanner
- 7+ rule-based security checks
- VirusTotal API integration
- Trusted domain whitelist
- Real-time risk scoring
- Detailed detection reasons

</td>
<td width="50%">

### 📧 Email Analyzer
- Urgency pattern detection
- Credential request alerts
- Financial bait detection
- Threat language analysis
- Suspicious link extraction

</td>
</tr>
<tr>
<td width="50%">

### 📊 Analytics Dashboard
- Total scans overview
- Risk distribution stats
- 7-day activity chart
- Recent scan summary
- Average risk score

</td>
<td width="50%">

### 📜 Scan History
- Filter by type (URL/Email)
- Filter by risk level
- Color-coded results
- Timestamp tracking
- Score visualization

</td>
</tr>
<tr>
<td width="50%">

### 👑 Admin Panel
- System-wide statistics
- User management
- Role assignment (user/admin)
- Complete scan logs
- Multi-tab interface

</td>
<td width="50%">

### 🔐 Secure Authentication
- JWT-based sessions
- bcrypt password hashing
- Protected routes
- Role-based access control
- Auto logout on token expiry

</td>
</tr>
</table>

---

## 🖼️ Screenshots

<div align="center">

### 📊 Dashboard
<img src="screenshots/dashboard.png" alt="Dashboard" width="800"/>

### 🔗 URL Scanner
<img src="screenshots/url-scanner.png" alt="URL Scanner" width="800"/>

### 📧 Email Analyzer
<img src="screenshots/email-analyzer.png" alt="Email Analyzer" width="800"/>

### 👑 Admin Panel
<img src="screenshots/admin-panel.png" alt="Admin Panel" width="800"/>

</div>

---

## 🛠️ Tech Stack

<table>
<tr>
<td align="center" width="25%">

### 🎨 Frontend

<br/>

![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)
![Framer](https://img.shields.io/badge/Framer_Motion-0055FF?style=flat-square&logo=framer&logoColor=white)

</td>
<td align="center" width="25%">

### ⚙️ Backend

<br/>

![Node](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)
![bcrypt](https://img.shields.io/badge/bcrypt-003A70?style=flat-square&logo=letsencrypt&logoColor=white)

</td>
<td align="center" width="25%">

### 🗄️ Database

<br/>

![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat-square&logo=postgresql&logoColor=white)

</td>
<td align="center" width="25%">

### 🔒 Security APIs

<br/>

![VirusTotal](https://img.shields.io/badge/VirusTotal-394EFF?style=flat-square&logo=virustotal&logoColor=white)

</td>
</tr>
</table>

---

## 🏗️ Architecture

```mermaid
graph TD
    A[👤 User Browser] -->|HTTP| B[⚛️ React Frontend]
    B -->|REST API| C[🚀 Express Backend]
    C -->|Query| D[🗄️ Supabase PostgreSQL]
    C -->|Threat Check| E[🔒 VirusTotal API]
    C -->|Risk Score| F[🧠 Risk Engine]
    F -->|Response| C
    D -->|Data| C
    C -->|JSON| B
    B -->|UI| A
