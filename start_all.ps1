# DropoutGuard AI - PowerShell Launcher
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "       DROPOUTGUARD AI - ALL SERVICES STARTUP           " -ForegroundColor Green
Write-Host "         Detect • Explain • Intervene • Monitor         " -ForegroundColor Yellow
Write-Host "========================================================" -ForegroundColor Cyan

Write-Host "`n[1/3] Starting Python ML Inference Service (Port 5001)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "python -m uvicorn ml.predict:app --host 127.0.0.1 --port 5001"

Start-Sleep -Seconds 2

Write-Host "[2/3] Starting Node.js + Express Backend (Port 5000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "node backend/server.js"

Start-Sleep -Seconds 2

Write-Host "[3/3] Starting React Frontend (Port 5173)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

Write-Host "`n========================================================" -ForegroundColor Green
Write-Host " All 3 services successfully launched!" -ForegroundColor Green
Write-Host " Frontend UI:  http://localhost:5173" -ForegroundColor Cyan
Write-Host " Backend API:  http://localhost:5000" -ForegroundColor Cyan
Write-Host " ML Service:   http://127.0.0.1:5001" -ForegroundColor Cyan
Write-Host "========================================================`n" -ForegroundColor Green
