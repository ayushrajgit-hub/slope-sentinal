@echo off
title Slope Sentinel - Frontend UI
echo Starting Slope Sentinel Frontend...
cd /d "%~dp0"
start http://localhost:5173
call npm run dev
pause
