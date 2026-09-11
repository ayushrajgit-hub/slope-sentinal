@echo off
title Slope Sentinel - Launcher
echo ===================================================
echo   Starting Slope Sentinel SIH 2026 Prototype
echo ===================================================
cd /d "%~dp0"

echo [1/2] Launching Frontend (React + Vite)...
start "Slope Sentinel Frontend" cmd /k "npm run dev"

echo [2/2] Launching Backend (FastAPI Mock Server)...
start "Slope Sentinel Backend" cmd /k "cd backend && python main.py"

echo.
echo ===================================================
echo Services launching:
echo   - Web UI:     http://localhost:5173
echo   - Backend API: http://localhost:8000/docs
echo ===================================================
echo.
timeout /t 3 >nul
start http://localhost:5173
