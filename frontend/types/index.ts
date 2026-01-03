export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  status: 'active' | 'inactive';
  profilePicture?: string;
  roleId: string;
  createdAt: string;
  updatedAt: string;
  role?: Role;
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Lead {
  id: number;
  name: string;
  companyName?: string;
  email: string;
  phone?: string;
  leadSource?: string;
  otherSource?: string;
  notes?: string;
  status: LeadStatus;
  lastContactDate?: string;
  createdAt: string;
  updatedAt: string;
  users?: User[];
}

export type LeadStatus = 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'UNQUALIFIED' | 'CONVERTED';

export interface Opportunity {
  id: number;
  name: string;
  description?: string;
  stage: OpportunityStage;
  probability?: number;
  expectedCloseDate?: string;
  leadId?: number;
  createdAt: string;
  updatedAt: string;
  lead?: Lead;
  users?: User[];
}

export type OpportunityStage = 'PROSPECTING' | 'QUALIFICATION' | 'PROPOSAL' | 'NEGOTIATION' | 'CLOSED_WON' | 'CLOSED_LOST';

export interface Deal {
  id: number;
  name: string;
  price: number;
  stage: DealStage;
  description?: string;
  opportunityId?: number;
  createdAt: string;
  updatedAt: string;
  opportunity?: Opportunity;
  users?: User[];
}

export type DealStage = 'NEW' | 'IN_PROGRESS' | 'PENDING' | 'CLOSED' | 'CANCELLED';

export interface Client {
  id: number;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
  users?: User[];
}

export interface Project {
  id: number;
  name: string;
  description?: string;
  status: ProjectStatus;
  startDate?: string;
  endDate?: string;
  budget?: number;
  clientId?: number;
  dealId?: number;
  createdAt: string;
  updatedAt: string;
  client?: Client;
  deal?: Deal;
}

export type ProjectStatus = 'PLANNING' | 'IN_PROGRESS' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED';

export interface Proposal {
  id: number;
  title: string;
  description?: string;
  status: ProposalStatus;
  dealId?: number;
  createdAt: string;
  updatedAt: string;
  deal?: Deal;
}

export type ProposalStatus = 'DRAFT' | 'SENT' | 'APPROVED' | 'REJECTED';

export interface Notification {
  id: number;
  body_en: string;
  body_ar?: string;
  userId: number;
  read: 'READ' | 'UN_READ';
  type: string;
  target?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DailyTask {
  id: number;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
  user?: User;
}

export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  body?: T;
  pagination?: Pagination;
  errors?: any[];
}

export interface TableFilter {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, any>;
}
