# Leadify - CRM Application

## Overview
Leadify is a full-stack CRM (Customer Relationship Management) application built with:
- **Frontend**: Nuxt 3 (Vue.js), Element Plus, TailwindCSS
- **Backend**: Node.js/Express with TypeScript, Sequelize ORM
- **Database**: PostgreSQL

## Project Structure
```
/backend                 # Express.js backend API
  /src
    /user               # User authentication & management
    /lead               # Lead management
    /opportunity        # Opportunity tracking
    /deal               # Deal management
    /project            # Project management
    /proposal           # Proposal generation
    /client             # Client management
    /config             # Database & Swagger config
    /utils              # Error handling, email utilities
    server.ts           # Server entry point
    app.ts              # Express app setup

/frontend               # Nuxt 3 frontend
  /pages                # Page components
  /components           # Reusable components
  /composables          # API utilities
  /stores               # Pinia stores
  /layouts              # Layout templates
  nuxt.config.js        # Nuxt configuration
```

## Environment Variables
The following environment variables are configured:
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` - Database connection
- `SECRET_KEY` - JWT secret for authentication
- `API_BASE_URL` - Frontend API base URL (set to `/api/` for proxying)
- `CORS_ORIGIN` - Allowed CORS origins

## Running the App
The application runs with two workflows:
1. **Backend API** (port 3000): Express.js API server
2. **Frontend** (port 5000): Nuxt 3 development server with API proxy

## Features
- User authentication (login, logout, password reset)
- Lead management
- Opportunity tracking
- Deal pipeline
- Project management
- Proposal generation
- Client management
- Role-based access control
- Daily task management

## Recent Changes
- January 3, 2026: Initial setup on Replit
  - Extracted and configured backend/frontend from zip file
  - Set up PostgreSQL database with auto-sync
  - Configured Nuxt dev proxy for API requests
  - Fixed TypeScript compilation errors
  - Disabled HMR for stable development in Replit environment
