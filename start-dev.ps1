# Leadify Development Startup Script
# This script starts all required services for development

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "       Leadify Development Startup          " -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Start Docker Database
Write-Host "[1/3] Starting PostgreSQL Database via Docker..." -ForegroundColor Yellow
$dockerStatus = docker ps 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "  ERROR: Docker is not running! Please start Docker Desktop first." -ForegroundColor Red
    exit 1
}

# Check if database container is already running
$dbContainer = docker ps --filter "name=backend-db-1" --format "{{.Names}}" 2>&1
if ($dbContainer -eq "backend-db-1") {
    Write-Host "  Database already running." -ForegroundColor Green
} else {
    Write-Host "  Starting database container..." -ForegroundColor Yellow
    Set-Location -Path "$PSScriptRoot\backend"
    docker-compose up -d db
    Start-Sleep -Seconds 5
    Write-Host "  Database started successfully." -ForegroundColor Green
}

# Step 2: Start Backend Server
Write-Host ""
Write-Host "[2/3] Starting Backend Server (Port 3000)..." -ForegroundColor Yellow
$backendJob = Start-Job -ScriptBlock {
    Set-Location -Path "$using:PSScriptRoot\backend"
    npm run dev
}
Write-Host "  Backend starting in background (Job ID: $($backendJob.Id))" -ForegroundColor Green

# Wait for backend to be ready
Write-Host "  Waiting for backend to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 8

# Step 3: Start Frontend Server
Write-Host ""
Write-Host "[3/3] Starting Frontend Server (Port 5000)..." -ForegroundColor Yellow
$frontendJob = Start-Job -ScriptBlock {
    Set-Location -Path "$using:PSScriptRoot\frontend"
    npm run dev
}
Write-Host "  Frontend starting in background (Job ID: $($frontendJob.Id))" -ForegroundColor Green

# Wait for frontend to be ready
Write-Host "  Waiting for frontend to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "       All Services Started!                " -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""
Write-Host "  Frontend:  http://localhost:5000" -ForegroundColor Cyan
Write-Host "  Backend:   http://localhost:3000" -ForegroundColor Cyan
Write-Host "  API Docs:  http://localhost:3000/api-docs" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Press Ctrl+C to stop all services" -ForegroundColor Yellow
Write-Host ""

# Keep script running and show logs
try {
    while ($true) {
        # Check if jobs are still running
        $backendState = (Get-Job -Id $backendJob.Id).State
        $frontendState = (Get-Job -Id $frontendJob.Id).State
        
        if ($backendState -ne "Running" -or $frontendState -ne "Running") {
            Write-Host ""
            Write-Host "WARNING: A service has stopped!" -ForegroundColor Red
            if ($backendState -ne "Running") {
                Write-Host "Backend Status: $backendState" -ForegroundColor Red
                Receive-Job -Id $backendJob.Id
            }
            if ($frontendState -ne "Running") {
                Write-Host "Frontend Status: $frontendState" -ForegroundColor Red
                Receive-Job -Id $frontendJob.Id
            }
        }
        
        Start-Sleep -Seconds 5
    }
}
finally {
    # Cleanup on exit
    Write-Host ""
    Write-Host "Stopping all services..." -ForegroundColor Yellow
    Stop-Job -Id $backendJob.Id -ErrorAction SilentlyContinue
    Stop-Job -Id $frontendJob.Id -ErrorAction SilentlyContinue
    Remove-Job -Id $backendJob.Id -ErrorAction SilentlyContinue
    Remove-Job -Id $frontendJob.Id -ErrorAction SilentlyContinue
    Write-Host "All services stopped." -ForegroundColor Green
}
