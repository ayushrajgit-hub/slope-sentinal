@echo off
title Slope Sentinel - Backend API
echo Starting Slope Sentinel FastAPI Backend...
cd /d "%~dp0backend"
python -m pip install -r requirements.txt
python main.py
pause
