@echo off
title Leadify Development Environment
echo ============================================
echo        Leadify Development Startup
echo ============================================
echo.

REM Check if Docker is running
docker ps >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker is not running! Please start Docker Desktop first.
    pause
    exit /b 1
)

echo [1/3] Starting PostgreSQL Database...
cd /d "%~dp0backend"
docker-compose up -d db
timeout /t 5 /nobreak >nul
echo       Database started.

echo.
echo [2/3] Starting Backend Server (Port 3000)...
start "Leadify Backend" cmd /k "cd /d %~dp0backend && npm run dev"
timeout /t 8 /nobreak >nul

echo.
echo [3/3] Starting Frontend Server (Port 5000)...
start "Leadify Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"
timeout /t 10 /nobreak >nul

echo.
echo ============================================
echo        All Services Started!
echo ============================================
echo.
echo   Frontend:  http://localhost:5000
echo   Backend:   http://localhost:3000
echo   API Docs:  http://localhost:3000/api-docs
echo.
echo   Close the terminal windows to stop services.
echo.

REM Open browser
start http://localhost:5000
pause
