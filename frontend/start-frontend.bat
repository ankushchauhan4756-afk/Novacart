@echo off
REM NovaCart Quick Start Frontend
REM Start frontend development server

title NovaCart - Frontend Server
echo.
echo =====================================
echo     NovaCart Frontend Server
echo =====================================
echo.
echo Starting frontend on port 3000...
echo.

cd frontend
call npm install
call npm run dev

pause
