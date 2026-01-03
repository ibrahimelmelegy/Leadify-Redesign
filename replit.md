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

## Admin Login
- Email: `admin@leadify.com`
- Password: `admin123`

## Recent Changes
- January 3, 2026: Initial setup on Replit
  - Extracted and configured backend/frontend from zip file
  - Set up PostgreSQL database with auto-sync
  - Configured Nuxt dev proxy for API requests
  - Fixed TypeScript compilation errors
  - Disabled HMR for stable development in Replit environment
  - Fixed authentication flow:
    - Added localStorage fallback for token storage (iframe compatibility)
    - Corrected cookie storage timing before redirect
  - Fixed permission system:
    - Added 'all' permission support for admin full access
  - Fixed statistics components error handling:
    - Added try-catch blocks for API calls in LeadsSales, ProjectsOperations, FinancialBusinessMetrics
  - Performance optimizations:
    - Added in-memory user caching in backend auth middleware (5 min TTL)
    - Added user caching in frontend auth middleware (avoids auth/me calls on every navigation)
    - Changed session cleanup from every request to periodic (1 min interval)
  - Fixed rendering issues:
    - Converted all top-level await calls to onMounted() in form components
    - Fixed layout blocking issues in default.vue and global/Menu.vue
  - Configured separate Backend and Frontend workflows for Replit
  - Fixed VeeValidate form integration:
    - Created vee-validate.client.ts plugin to register VForm, VField, VErrorMessage globally
    - Updated login.vue to wrap form with VForm component and ClientOnly for SSR compatibility
    - Fixed plugin errors in quill.client.js and cropper.ts (removed invalid .use() calls)
  - Fixed Menu component: changed invalid el-menu-items to el-menu-item-group
  - Fixed form validation across Sales and Operations sections:
    - REVERTED VForm wrapper pattern - was conflicting with existing useForm() hooks
    - Correct pattern: el-form(@submit.prevent="onSubmit") with useForm({ validationSchema }) in script
    - Fixed pug indentation issues (changed 8-space to proper 2/4-space hierarchy)
    - Forms use useForm() hook from VeeValidate for validation, NOT VForm component wrapper
    - Forms fixed: leads, client, opportunity, deal/Information, Proposal, Projects/Info, Projects/ManPower, Projects/Folder
    - Added missing imports in Proposal/Form.vue (proposalRelatedTypes, ProposalType, etc.)
  - Fixed login page email validation:
    - Removed validator/lib/isEmail dependency that was causing validation failures
    - Changed to yup's built-in .email() validation which works correctly
  - Fixed deal forms (Invoice, Delivery):
    - Removed ClientOnly/VForm wrapper and fixed indentation
