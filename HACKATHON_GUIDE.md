# 🏆 DropoutGuard AI — Hackathon Presentation & Judge's Evaluation Guide

> **Enterprise AI-Powered Early-Warning Student Retention & Academic Care Platform**  
> Built for Institutional Scale, Real-Time Educational Telemetry & Explainable AI Interventions.

---

## ⚡ Quick Links & Live URLs
- **Live Web Application**: [http://localhost:5173/](http://localhost:5173/) (or port 5000 in unified production mode)
- **API Health Check**: [http://localhost:5000/health](http://localhost:5000/health)
- **Machine Learning Telemetry**: [http://localhost:5001/metrics](http://localhost:5001/metrics)
- **Benchmark Student Case Study**: [`/students/STU1024`](http://localhost:5173/students/STU1024) (Kavya Sharma, 78% High Risk)

---

## 🎯 1. The Problem Statement & Market Urgency
- **The Challenge**: Over **32% of higher education students** drop out or repeat years due to undetected academic distress, unaddressed course backlogs, and falling attendance.
- **The Institutional Flaw**: Most universities discover student distress **post-mortem** (after semester exams or dropout notices).
- **The Solution**: **DropoutGuard AI** predicts academic attrition risk **weeks before failure occurs**, explains the causal drivers through Explainable AI (XAI), and enables immediate workflow interventions with direct LMS connectivity.

---

## 🚀 2. Winning Feature Matrix & Differentiators

| Capability | What We Built | Industry Benchmark |
| :--- | :--- | :--- |
| **Machine Learning Engine** | Random Forest + Logistic Regression (0.925 ROC-AUC, 88% Accuracy trained on 4,424 records) | Traditional static threshold spreadsheets |
| **Explainable AI (XAI)** | Weighted factor contribution breakdown showing exact causal triggers for each student | "Black-box" scores with no reasoning |
| **Counterfactual Simulator** | Interactive slider sandbox testing intervention impact on predicted risk in real time | Theoretical manual projections |
| **SIS / LMS Integrations** | Real-time LTI 1.3 Advantage connectors for Canvas, Moodle, Google Classroom, Banner | Manual CSV imports or paper registers |
| **Regional Localization (i18n)** | 6 Regional Indian and global languages (English, हिन्दी, தமிழ், తెలుగు, मराठी, বাংলা) | English-only interfaces |
| **Institutional PDF Dossier** | 1-Click vector PDF generator with university letterhead, dual signatures, and scorecard | Generic HTML print screens |
| **Evaluation Persona Switcher**| Instant 1-click role switcher (Admin / Faculty / Student) built directly into the navbar | Complex manual re-login flows |

---

## 🎙️ 3. The 4-Minute Winning Pitch Script

### [0:00 - 0:45] The Hook & Executive Intelligence
> *"Good morning judges. Every semester, thousands of university students quietly slip through the cracks—not because they lack ability, but because institutional warning signs remain buried across disconnected systems.*
> 
> *Meet **DropoutGuard AI**—an enterprise academic intelligence platform monitoring over 1,250 active students at Apex University. Here on our Executive Console, academic deans instantly visualize cohort risk distributions, department vulnerabilities, and high-risk students in real time."*

### [0:45 - 1:45] Explainable AI & Benchmark Case (STU1024)
> *"Let's examine student **STU1024 — Kavya Sharma**. 
> Our ML model flags her at **78% High Risk**. But rather than giving educators an uninterpretable black-box percentage, our Explainable AI engine isolates the exact drivers:
> 1. **2 Course Backlogs** (40.5% model importance)
> 2. **Declining GPA** (-0.6 trend)
> 3. **Attendance at 58%**, breaching the mandatory 75% threshold."*

### [1:45 - 2:30] Counterfactual Simulation & Prescriptive Actions
> *"Notice our **Counterfactual Intervention Simulator**. An academic mentor can drag the attendance slider to 75% and simulated remedial tutoring: the model recalculates instantly, showing an immediate **28% drop in predicted risk**. We turn data into verifiable action plans."*

### [2:30 - 3:15] Direct LMS Telemetry (LTI 1.3 Advantage)
> *"Universities don't have time for manual CSV imports. We built an automated sync gateway connecting directly to **Canvas, Moodle, Google Classroom, and Ellucian Banner**. With one click, daily digital attendance and assignment rates ingest into our Bayesian inference engine, recalculating cohort risk on the fly."*

### [3:15 - 4:00] Regional Inclusion & Institutional PDF Dossier
> *"Finally, higher education must be inclusive. We support **6 regional languages** so students and regional faculty can access wellness counseling in Hindi, Tamil, Telugu, Marathi, or Bengali. And for official dean committees, our native PDF engine produces an **official signed Academic Risk Dossier** ready for institutional archive."*

---

## 🔑 4. Pre-Seeded Evaluation Credentials

You can log in manually or use the **1-Click Role Switcher** in the top navigation bar:

| Role | Email | Password | Pre-Configured Scope |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@apex.edu` | `admin123` | Full university analytics, department risk matrix, LMS sync |
| **Faculty Mentor** | `faculty@apex.edu` | `faculty123` | Department advising, intervention workflows, student mentoring |
| **Student** | `student@apex.edu` | `student123` | Wellness Hub, GPA goal calculator, academic support requests |

---

## 🛠️ 5. Instant Local & Cloud Deployment Options

### Option 1: 1-Command Production Start (Windows / Mac / Linux)
```bash
# Start all 3 tiers (Python ML, Node Backend, Vite Frontend):
.\start_all.bat
# or on PowerShell:
.\start_all.ps1
```

### Option 2: 1-Command Docker Compose
```bash
docker compose up --build -d
```

### Option 3: Instant Cloud Deployment
- **Render**: Connect repository and select Blueprint (`render.yaml`).
- **Vercel**: Connect repository, root `frontend`, output `dist` (`vercel.json` included).
- **Railway / Heroku**: Connect repository (`Procfile` and root `package.json` included).
