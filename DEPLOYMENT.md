# DropoutGuard AI — Production Deployment & Cloud Hosting Guide

This guide provides end-to-end instructions for deploying the full **DropoutGuard AI** platform to production environments, whether using **Docker Compose** on an on-premise server / VPS, or **modern cloud hosting platforms** (Vercel, Render, Railway, and MongoDB Atlas).

---

## 1. System Architecture Overview

```
                         Internet / End Users
                                  │
                                  ▼
                     ┌───────────────────────────┐
                     │     Frontend (Nginx)      │ Port 80 / 5173
                     │   React 19 + TypeScript   │
                     └─────────────┬─────────────┘
                                   │ /api/* reverse proxy
                                   ▼
                     ┌───────────────────────────┐
                     │    Node.js Express API    │ Port 5000
                     │  JWT Auth & CRUD Engine   │
                     └──────┬─────────────┬──────┘
                            │             │
        Direct ML Inference │             │ Query / Persistence
                            ▼             ▼
       ┌────────────────────────┐     ┌────────────────────────┐
       │   FastAPI ML Service   │     │    MongoDB Database    │
       │ Scikit-Learn Model.pkl │     │  (or In-Memory Store)  │
       │       Port 5001        │     │       Port 27017       │
       └────────────────────────┘     └────────────────────────┘
```

---

## 2. Option A: 1-Command Docker Deployment (Local / On-Premise / VPS)

Every service (`ml`, `backend`, `frontend`, `mongo`) is fully containerized with production-ready multi-stage Dockerfiles.

### Prerequisites:
- Install **Docker Engine** & **Docker Compose** (Docker Desktop on Windows/Mac, or `docker-ce` on Linux).

### Steps:
1. Open your terminal in the project root:
   ```bash
   cd Dropout
   ```
2. (Optional) Customize your environment variables:
   ```bash
   cp .env.example .env
   ```
3. Build and launch all 4 services in detached mode:
   ```bash
   docker compose up --build -d
   ```
4. Access the live services:
   - **Frontend Web Application**: [http://localhost/](http://localhost/) (or [http://localhost:5173/](http://localhost:5173/))
   - **Backend Health Check**: [http://localhost:5000/health](http://localhost:5000/health)
   - **ML Model Metrics**: [http://localhost:5001/metrics](http://localhost:5001/metrics)

### Stopping or Restarting:
```bash
# View live container logs
docker compose logs -f

# Stop containers
docker compose down

# Stop and wipe database volume
docker compose down -v
```

---

## 3. Option B: 1-Click Cloud Hosting (Render / Vercel / Railway)

### Method 1: Render 1-Click Blueprint (Recommended for Hackathons)
Because our repository contains [`render.yaml`](file:///c:/Users/swast/OneDrive/Desktop/Dropout/render.yaml), you can deploy all 3 tiers with a single click:
1. Push this repository to GitHub.
2. Log into [Render.com](https://render.com) and click **New ➔ Blueprint**.
3. Select your repository. Render automatically reads `render.yaml` and provisions:
   - `dropoutguard-ml` (Python FastAPI microservice)
   - `dropoutguard-backend` (Node.js API + Static SPA server)
   - `dropoutguard-frontend` (Global CDN Static Site)
4. Click **Apply**. Your entire platform will be live with free automated SSL certificates.

---

### Method 2: Unified 1-Port Deployment (Render, Railway, or Heroku)
Our backend server is configured to automatically serve the compiled frontend (`frontend/dist`) on the same port when co-located:
1. Connect your repository to [Railway](https://railway.app) or [Render](https://render.com).
2. Use the root directory. The root [`package.json`](file:///c:/Users/swast/OneDrive/Desktop/Dropout/package.json) will automatically run:
   - `npm run build:frontend` (compiles Vite React SPA)
   - `node backend/server.js` (serves both the frontend and `/api` on port 5000 / `$PORT`)
3. Both frontend and backend will be live on a single URL with **zero CORS configuration needed**!

---

### Method 3: Frontend on Vercel + Backend on Render
1. **Frontend on Vercel**:
   - Go to [vercel.com](https://vercel.com) ➔ **Add New Project**.
   - Select repository, set Root Directory: `frontend`.
   - Build Command: `npm run build`, Output Directory: `dist`.
   - Add Environment Variable: `VITE_API_URL` = `https://your-backend.onrender.com/api`
   - Deploy! (Our [`frontend/vercel.json`](file:///c:/Users/swast/OneDrive/Desktop/Dropout/frontend/vercel.json) guarantees zero 404s on page refresh).
2. **Backend on Render**:
   - Go to [render.com](https://render.com) ➔ **New ➔ Web Service**.
   - Root Directory: `backend`, Build: `npm install`, Start: `node server.js`.
   - Environment variables: `PORT=5000`, `NODE_ENV=production`, `JWT_SECRET=(any random string)`.

---

## 4. Option C: Dedicated Cloud VM (AWS EC2 / DigitalOcean / GCP)

For institutional on-premise or cloud hosting on a dedicated Ubuntu 22.04 LTS server:

1. **Connect to your server**:
   ```bash
   ssh ubuntu@your-server-ip
   ```
2. **Install Docker & Git**:
   ```bash
   sudo apt update && sudo apt install -y docker.io docker-compose git
   sudo systemctl enable --now docker
   sudo usermod -aG docker $USER
   # Log out and log back in to apply group changes
   ```
3. **Clone your repository and start**:
   ```bash
   git clone https://github.com/your-username/Dropout.git
   cd Dropout
   cp .env.example .env
   docker compose up --build -d
   ```
4. **Attach Domain & Free SSL (Let's Encrypt / Certbot)**:
   If mapping a custom domain (e.g. `dropoutguard.apex.edu`), point DNS `A` records to your server IP and run:
   ```bash
   sudo apt install -y certbot python3-certbot-nginx
   sudo certbot --nginx -d dropoutguard.apex.edu
   ```

---

## 5. Environment Variables Reference

| Variable | Service | Default / Recommended | Description |
| :--- | :--- | :--- | :--- |
| `PORT` | Backend | `5000` | Port for Express Node.js API server |
| `NODE_ENV` | Backend | `production` | Environment mode (`development` or `production`) |
| `JWT_SECRET` | Backend | *(random 64-char string)* | Cryptographic secret for signing JWT auth tokens |
| `MONGODB_URI` | Backend | `mongodb://mongo:27017/dropoutguard` | MongoDB connection URI |
| `SKIP_MONGO` | Backend | `false` | Fallback to in-memory JSON store if `true` |
| `ML_API_URL` | Backend | `http://ml:5001` (Docker) | URL pointing to Python FastAPI ML service |
| `GEMINI_API_KEY`| Backend | *(Optional)* | Google Gemini API key for clinical interventions |
| `VITE_API_URL` | Frontend| `/api` (Docker) or `https://domain/api` | Base URL used by browser to contact backend API |

---

## 6. Pre-Flight Verification Checklist

Before releasing to production or judging committees, verify:
- [x] All 3 background services respond to health checks (`/health`, `/metrics`, `/`).
- [x] Pre-configured demo accounts can log in with 1 click (`admin@apex.edu`, `faculty@apex.edu`, `student@apex.edu`).
- [x] Calibrated benchmark student `STU1024` accurately returns **78% High Risk**.
- [x] Counterfactual What-If simulator reduces risk in real time (e.g. to **24%**).
- [x] CSV bulk cohort ingestion parses and scores student records without failure.
- [x] Single-page routing (SPA) allows refreshing any URL (e.g. `/students/STU1024`) without 404 errors.
