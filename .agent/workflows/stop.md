---
description: Stop all development servers and cleanup
---

# Stop Development Environment

This workflow stops all running services for the Leadify application.

## Steps

### 1. Stop Frontend and Backend processes
Find and stop any Node.js processes running on ports 3000 and 5000:
// turbo
```powershell
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
```

### 2. Stop Docker Database (Optional)
If you want to stop the database container:
```powershell
cd d:\Hpt-New-CRM\Leadify-Redesign\backend; docker-compose down
```

## Verification
Run these commands to verify all services are stopped:
```powershell
Get-NetTCPConnection -LocalPort 3000, 5000 -ErrorAction SilentlyContinue
docker ps
```
