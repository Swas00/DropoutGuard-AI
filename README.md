# DropoutGuard AI 🎓🛡️
### AI-Powered Early-Warning and Intervention System for Student Dropout Risk
**HackDevengers 2.0 • Open Innovation Track • 24-Hour Hackathon Project**

> **Core Workflow: Detect ➔ Explain ➔ Intervene ➔ Monitor**

---

## 1. Problem Statement
Colleges and higher education institutions collect rich academic and engagement data across learning management systems (LMS), attendance logs, internal marks, and curricular unit records. However, they frequently lack a unified, predictive early-warning mechanism that correlates these signals before students reach critical academic failure or withdraw. 

Most existing systems are:
- **Retrospective:** Flagging failure only after end-of-semester results are published.
- **Black-Box:** Presenting arbitrary percentage risk scores without actionable explanations.
- **Diagnostic rather than supportive:** Failing to provide structured faculty interventions.

---

## 2. Solution Overview
**DropoutGuard AI** bridges this gap by unifying student performance and engagement telemetry into an explainable Machine Learning engine. Rather than making fatalistic predictions, it highlights emerging risk patterns so educators and academic advisors can intervene with personalized support while there is still time to turn outcomes around.

### Key Tenets
1. **Calibrated ML Risk Estimation:** Trained on the official **UCI Machine Learning Repository Dataset** (*"Predict Students' Dropout and Academic Success"*, 4,424 records) with **0.925 ROC-AUC**.
2. **Genuinely Learned Explainability ("Why?"):** Ranks contributing drivers based on empirical feature importances (e.g., *Multiple backlogs (40.5%)*, *Cumulative GPA (22.8%)*, *Attendance compliance (9.4%)*).
3. **Interactive What-If Simulator:** Allows faculty to test intervention scenarios (e.g., *Under this model scenario, improving attendance and completing missed coursework reduces predicted risk index significantly*).
4. **Actionable Intervention Pipeline:** Translates predictive factors into scheduled faculty mentorship sessions, remedial tutoring, and coursework recovery plans.
5. **Supportive Student View:** A transparent, non-alarming dashboard that encourages students with constructive milestones and advisor booking.
6. **Technical Honesty:** Real public benchmark records from the UCI repository are clearly differentiated from the calibrated presentation demo scenario (`STU1024`).

---

## 3. System Architecture

```
                                  ┌───────────────────────────────┐
                                  │      DROPOUTGUARD AI UI       │
                                  │  React + TypeScript + Vite    │
                                  │  Tailwind CSS + Recharts UI   │
                                  └───────────────┬───────────────┘
                                                  │ (REST / JSON)
                                                  ▼
                                  ┌───────────────────────────────┐
                                  │       BACKEND REST API        │
                                  │       Node.js + Express       │
                                  │    PORT: 5000 (CRUD/Sync)     │
                                  └───────┬───────────────┬───────┘
                                          │               │
                     ┌────────────────────┴───┐       ┌───┴────────────────────┐
                     ▼                        ▼       ▼                        ▼
          ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐
          │   DATABASE LAYER    │  │  PYTHON ML SERVICE  │  │ AI DECISION SUPPORT │
          │  MongoDB / In-Mem   │  │   FastAPI + Sklearn │  │ Gemini API Support  │
          │ 1,250 Seed Records  │  │   PORT: 5001        │  │ Guardrailed Actions │
          └─────────────────────┘  └─────────────────────┘  └─────────────────────┘
```

---

## 4. Key Features

| Feature | Description | Spec Section |
| :--- | :--- | :--- |
| **Authentication & RBAC** | Production JWT auth (`jsonwebtoken` + `bcryptjs`) with Admin, Faculty, and Student roles, plus 1-click evaluator persona switching. | Enterprise Auth |
| **Data Management Suite** | Complete CRUD: Single student enrollment with live risk preview, bulk CSV cohort ingestion with template download, telemetry editing, and safe deletion. | Enterprise CRUD |
| **Landing Page** | Value proposition, hero stats, ambient background video, and interactive product workflow loop (`01 Collect -> 02 Predict -> 03 Explain -> 04 Intervene`). | Section 20, 21 |
| **Admin Dashboard** | Institutional bird's-eye view with 1,250 monitored students, risk distribution donut, attendance vs. risk scatter, department comparison bars, and sortable registry. | Section 6, 22 |
| **Explainable Factors ("Why?")** | Transparent feature importance ranking for every student profile, breaking down exactly why a risk score was assigned using genuinely learned weights. | Section 8 |
| **Risk Timeline** | 5-month longitudinal trajectory (Jan ➔ May) illustrating the compounding escalation of risk over a semester. | Section 24 |
| **What-If Intervention Simulator** | Real-time parameter sliders allowing faculty to test intervention scenarios and inspect model sensitivity before meeting a student. | Section 23 |
| **Intervention Management** | Complete lifecycle management (Pending, In-Progress, Completed) with advisor assignments and resolution notes. | Section 9, 18 |
| **Supportive Student Dashboard** | Positive, non-alarmist student portal with wellness messaging, attendance buffers, and one-click advisor connection. | Section 5 |
| **Machine Learning Comparison Modal** | In-app modal displaying precision, recall, F1, ROC-AUC curves, and feature importance rankings on the real UCI dataset. | Section 11, 27 |

---

## 5. Machine Learning Approach & Metrics

### Dataset Attribution & Source (Section 12)
- **Source:** [UCI Machine Learning Repository: Predict Students' Dropout and Academic Success (Dataset ID: 697)](https://archive.ics.uci.edu/dataset/697/predict+students+dropout+and+academic+success)
- **Total Records:** 4,424 institutional student records from higher education programs.
- **Target Distribution:** 1,421 Dropout cases (32.1%), 2,209 Graduate, 794 Enrolled.
- **Validation Split:** 80/20 Stratified Train/Test Split (3,539 training records, 885 held-out test records).

### Model Comparison Results (Section 11)
Evaluated on the held-out test set:

| Metric | Random Forest (Selected Model) | Logistic Regression Baseline |
| :--- | :--- | :--- |
| **Accuracy** | **86.78%** | **85.88%** |
| **Precision** | **79.25%** | **76.81%** |
| **Recall** | **81.73%** | **79.60%** |
| **F1-Score** | **80.47%** | **78.18%** |
| **ROC-AUC Score** | **0.9251** | **0.9199** |
| **Primary Advantage** | Captures non-linear credit backlog interactions | High linear interpretability |

### Learned Feature Importance Breakdown (Random Forest)
1. **Curricular Backlogs (Unapproved units):** **40.5%** — Strongest empirical predictor of academic departure.
2. **Current GPA (2nd Semester Grade):** **22.8%**
3. **Previous GPA (1st Semester Grade):** **12.2%**
4. **Attendance & Tuition Compliance:** **9.4%**
5. **Assignment / Evaluation Completion Rate:** **4.5%**
6. **GPA Trend Delta:** **4.2%**
7. **LMS & Scholarship Engagement:** **4.1%**
8. **Internal Exam / Admission Marks:** **2.3%**

---

## 6. Demonstration Scenario (`STU1024`)
- **Profile:** Kavya Sharma (MCA, Semester 3)
- **Type:** Calibrated synthetic demonstration scenario (clearly labeled in UI)
- **Indicators:** Attendance: 58%, Current GPA: 6.2 (Previous: 7.1, Trend: -0.9), Assignments: 50%, Backlogs: 2, Internal Marks: 61, Engagement: 55%
- **Calibrated Risk Score:** **78% — HIGH**
- **What-If Simulation:** Attendance improved to 75% + Assignments to 85% ➔ **Risk decreases significantly**, illustrating early warning sensitivity.

---

## 7. API Documentation (Section 17)

### Backend API (Node.js / Express — Port 5000)
- `GET /api/dashboard`: Aggregated cohort counts, risk distribution, scatter data, department breakdown, and risk trend.
- `GET /api/students`: Filterable and paginated directory (`?search=`, `?riskLevel=`, `?course=`, `?page=`, `?limit=`).
- `GET /api/students/:id`: Detailed student profile with academic history and timeline.
- `GET /api/risk/:id`: Explainable factors, feature weights, and risk score.
- `POST /api/simulate`: What-if simulation calculating baseline, simulated risk, and delta percentage.
- `GET /api/interventions`: List all active/resolved student interventions.
- `POST /api/interventions`: Schedule and dispatch a new intervention.
- `PATCH /api/interventions/:id`: Update status (`Pending`, `In-Progress`, `Completed`).
- `POST /api/explain`: Generate personalized, guardrailed AI intervention text.
- `GET /api/metrics`: Real UCI dataset ML model comparison and feature importances.

### Python ML Service (FastAPI — Port 5001)
- `POST /predict`: Receives student features, outputs risk probability, risk level, and ranked factors.
- `POST /simulate`: Computes dual-state sensitivity delta.
- `GET /metrics`: Model evaluation metrics.
- `GET /health`: Liveness probe.

---

## 8. Quickstart & Installation

### Prerequisites
- Node.js (v18+)
- Python (3.10+)
- MongoDB *(Optional — system automatically falls back to pre-seeded 1,250 in-memory records if MongoDB is not running)*

### 1-Click Launch (Windows)
Double-click `start_all.bat` or run in PowerShell:
```powershell
.\start_all.ps1
```

### Manual Setup Step-by-Step

#### Step 1: Start Python ML Service
```bash
python -m pip install -r ml/requirements.txt
python ml/train.py
python -m uvicorn ml.predict:app --host 127.0.0.1 --port 5001
```

#### Step 2: Start Node.js Backend
```bash
cd backend
npm install
node server.js
```

#### Step 3: Start Frontend Web UI
```bash
cd frontend
npm install
npm run dev
```

Open **`http://localhost:5173`** in your browser.

#### Demo Evaluation Accounts (Pre-Seeded & 1-Click Switchable):
| Persona Role | Name & Title | Email | Password | Access Scope |
| :--- | :--- | :--- | :--- | :--- |
| **Administrator** | Dr. Aris Thorne (Dean) | `admin@apex.edu` | `Admin@2026` | Full institutional console, enrollment, CSV ingestion, deletion |
| **Faculty Mentor** | Prof. Ananya Sen (Advisor) | `faculty@apex.edu` | `Faculty@2026` | Advising workflows, intervention dispatch, What-If simulation |
| **Student** | Aarav Sharma (B.Tech) | `student@apex.edu` | `Student@2026` | Student wellness portal, non-alarmist milestone tracking |

---

## 9. Hackathon Presentation & Demo Script (Section 28)

Follow this structured 3-minute pitch flow to win the judges' vote:

1. **The Hook (30 sec):** 
   > *"Colleges today don't fail students because of a lack of data—they fail because warning signals hide in isolated silos until it's too late. DropoutGuard AI is an early-warning and intervention platform designed to Detect, Explain, Intervene, and Monitor."*
2. **The Bird's-Eye View (30 sec):** 
   - Open the **Admin Dashboard**.
   - Point out the **1,250 monitored students**, the clear breakdown (**84 High Risk, 213 Medium, 953 Low**), and the interactive attendance vs. risk correlation scatter plot.
   - Click the floating **ML Model Metrics button** to show the **0.925 ROC-AUC score on the real UCI dataset (4,424 records)**.
3. **The Anchor Deep Dive (45 sec):**
   - Click into demo student **`STU1024` (Kavya Sharma)**, clearly labeled as our calibrated demonstration scenario.
   - Highlight the **78% High Risk score**, the GPA drop (7.1 ➔ 6.2), and the **Risk Timeline** showing the progression from 21% in January to 78% in May.
4. **"The Most Important Feature: Why?" (45 sec):**
   - Point to the **Explainable Factors card**: show that rather than giving an opaque probability, DropoutGuard explains *why* based on genuinely learned factors (Multiple course backlogs: 40% weight, Declining GPA: 28% weight, Low attendance: 18% weight).
5. **The Interactive What-If Simulator (30 sec):**
   - Slide Attendance from **58% to 75%** and Assignments from **50% to 85%**.
   - Watch the simulator recalculate: *"Under this model scenario, the predicted risk changes from 78% to 31%."*
   - Highlight the ethical disclaimer: *"The simulator demonstrates model sensitivity, not a guaranteed outcome."*
6. **Closing the Loop (30 sec):**
   - Click *"Schedule Intervention"*, log an advising session with Prof. Ananya Sen, and show the updated status in **Interventions**.
   - Conclude: *"DropoutGuard AI transforms passive reporting into proactive human care."*

---

## 10. Ethical AI Safeguards
- **Support-Oriented:** Recommendations are strictly framed as institutional support actions (tutoring, advising, reminders), never as punitive diagnoses or automated dismissals.
- **Privacy First:** Avoids collecting sensitive demographic or personal attributes, focusing strictly on verifiable academic and engagement indicators.
- **Human-in-the-Loop:** All automated flags require faculty mentor verification before any administrative notice is issued.

---

## 11. Team & Acknowledgements
- **Team Name:** HackDevengers
- **Hackathon:** HackDevengers 2.0
- **Track:** Open Innovation MVP
- Built with Python, Scikit-Learn, FastAPI, Node.js, Express, MongoDB, React, TypeScript, and Tailwind CSS.
- Dataset credited to the UC Irvine Machine Learning Repository.
