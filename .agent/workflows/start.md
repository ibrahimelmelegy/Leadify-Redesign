---
description: Start all development servers (Database, Backend, Frontend)
---

# Start Development Environment

This workflow starts all required services for the Leadify application.

## Prerequisites
- Docker Desktop must be running
- Node.js installed
- All dependencies installed (`npm run install:all` from root)

## Steps

### 1. Start PostgreSQL Database via Docker
// turbo
```powershell
cd d:\Hpt-New-CRM\Leadify-Redesign\backend; docker-compose up -d db
```
Wait 5 seconds for the database to initialize.

### 2. Start Backend Server (Port 3000)
```powershell
cd d:\Hpt-New-CRM\Leadify-Redesign\backend; npm run dev
```
This runs in the background. Wait for "Server is running on port 3000" message.

### 3. Start Frontend Server (Port 5000)
```powershell
cd d:\Hpt-New-CRM\Leadify-Redesign\frontend; npm run dev
```
This runs in the background. Wait for "Nuxt Nitro server built" message.

## Verification
- Frontend: http://localhost:5000
- Backend API: http://localhost:3000
- API Docs: http://localhost:3000/api-docs

## Quick Start (Alternative)
You can also double-click the `start-dev.bat` file in the project root to start everything automatically.
