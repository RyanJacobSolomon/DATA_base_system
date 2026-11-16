@echo off
title Jules Cafe Backend Server
echo ========================================================
echo   Starting Jules Cafe Flask Backend Server (Port 5000)
echo ========================================================
echo.
cd /d "%~dp0"
python app.py
pause
