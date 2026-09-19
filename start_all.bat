@echo off
title DropoutGuard AI - Hackathon Launcher
echo ========================================================
echo        DROPOUTGUARD AI - ALL SERVICES STARTUP          
echo          Detect • Explain • Intervene • Monitor         
echo ========================================================
echo.

echo [1/3] Starting Python ML Inference Service on Port 5001...
start "DropoutGuard ML Service" cmd /k "python -m uvicorn ml.predict:app --host 127.0.0.1 --port 5001"

timeout /t 2 /nobreak >nul

echo [2/3] Starting Node.js + Express Backend on Port 5000...
start "DropoutGuard Backend API" cmd /k "node backend/server.js"

timeout /t 2 /nobreak >nul

echo [3/3] Starting React + Vite Frontend on Port 5173...
start "DropoutGuard Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================================
echo  All 3 services have been launched in separate windows! 
echo  Frontend UI:  http://localhost:5173                   
echo  Backend API:  http://localhost:5000                   
echo  ML Service:   http://127.0.0.1:5001                   
echo ========================================================
echo.
pause
