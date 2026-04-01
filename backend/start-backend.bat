@echo off
REM NovaCart Quick Start Script for Windows
REM This script starts both backend and frontend servers

title NovaCart - Backend Server
echo.
echo =====================================
echo     NovaCart Backend Server
echo =====================================
echo.
echo Starting backend on port 5000...
echo.

cd backend
call npm install
call npm run dev

pause
