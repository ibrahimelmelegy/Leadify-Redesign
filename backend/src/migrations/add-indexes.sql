-- Performance Indexes for Leadify CRM
-- Run this migration to improve query performance

-- Users table indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON "Users" (email);
CREATE INDEX IF NOT EXISTS idx_users_role_id ON "Users" ("roleId");
CREATE INDEX IF NOT EXISTS idx_users_status ON "Users" (status);

-- Sessions table indexes
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON "Sessions" ("userId");
CREATE INDEX IF NOT EXISTS idx_sessions_token ON "Sessions" (token);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON "Sessions" ("expiresAt");

-- Leads table indexes
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads (status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads ("createdAt");
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads (email);

-- Opportunities table indexes
CREATE INDEX IF NOT EXISTS idx_opportunities_stage ON opportunities (stage);
CREATE INDEX IF NOT EXISTS idx_opportunities_lead_id ON opportunities ("leadId");
CREATE INDEX IF NOT EXISTS idx_opportunities_created_at ON opportunities ("createdAt");

-- Deals table indexes
CREATE INDEX IF NOT EXISTS idx_deals_stage ON deals (stage);
CREATE INDEX IF NOT EXISTS idx_deals_opportunity_id ON deals ("opportunityId");
CREATE INDEX IF NOT EXISTS idx_deals_created_at ON deals ("createdAt");

-- Projects table indexes
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects (status);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects ("createdAt");

-- Proposals table indexes
CREATE INDEX IF NOT EXISTS idx_proposals_status ON proposals (status);

-- Clients table indexes
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients (email);
CREATE INDEX IF NOT EXISTS idx_clients_created_at ON clients ("createdAt");

-- Notifications table indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications ("userId");
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications (read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications ("createdAt");

-- Daily tasks table indexes
CREATE INDEX IF NOT EXISTS idx_daily_tasks_user_id ON "dailyTasks" ("userId");
CREATE INDEX IF NOT EXISTS idx_daily_tasks_status ON "dailyTasks" (status);

-- Join tables indexes
CREATE INDEX IF NOT EXISTS idx_lead_users_lead_id ON "leadUsers" ("leadId");
CREATE INDEX IF NOT EXISTS idx_lead_users_user_id ON "leadUsers" ("userId");

CREATE INDEX IF NOT EXISTS idx_opportunity_users_opportunity_id ON "opportunityUsers" ("opportunityId");
CREATE INDEX IF NOT EXISTS idx_opportunity_users_user_id ON "opportunityUsers" ("userId");

CREATE INDEX IF NOT EXISTS idx_deal_users_deal_id ON "dealUsers" ("dealId");
CREATE INDEX IF NOT EXISTS idx_deal_users_user_id ON "dealUsers" ("userId");

CREATE INDEX IF NOT EXISTS idx_client_users_client_id ON "clientUsers" ("clientId");
CREATE INDEX IF NOT EXISTS idx_client_users_user_id ON "clientUsers" ("userId");
