export enum LeadPermissionsEnum {
  VIEW_OWN_LEADS = 'VIEW_OWN_LEADS',
  VIEW_GLOBAL_LEADS = 'VIEW_GLOBAL_LEADS',
  CREATE_LEADS = 'CREATE_LEADS',
  EDIT_LEADS = 'EDIT_LEADS'
}

export enum OpportunityPermissionsEnum {
  VIEW_OWN_OPPORTUNITIES = 'VIEW_OWN_OPPORTUNITIES',
  VIEW_GLOBAL_OPPORTUNITIES = 'VIEW_GLOBAL_OPPORTUNITIES',
  CREATE_OPPORTUNITIES = 'CREATE_OPPORTUNITIES',
  EDIT_OPPORTUNITIES = 'EDIT_OPPORTUNITIES'
}

export enum DealPermissionsEnum {
  VIEW_OWN_DEALS = 'VIEW_OWN_DEALS',
  VIEW_GLOBAL_DEALS = 'VIEW_GLOBAL_DEALS',
  CREATE_DEALS = 'CREATE_DEALS',
  EDIT_DEALS = 'EDIT_DEALS'
}

export enum ProposalPermissionsEnum {
  VIEW_OWN_PROPOSALS = 'VIEW_OWN_PROPOSALS',
  VIEW_GLOBAL_PROPOSALS = 'VIEW_GLOBAL_PROPOSALS',
  CREATE_PROPOSALS = 'CREATE_PROPOSALS',
  EDIT_PROPOSALS = 'EDIT_PROPOSALS'
}

export enum ProjectPermissionsEnum {
  VIEW_OWN_PROJECTS = 'VIEW_OWN_PROJECTS',
  VIEW_GLOBAL_PROJECTS = 'VIEW_GLOBAL_PROJECTS',
  CREATE_PROJECTS = 'CREATE_PROJECTS',
  EDIT_PROJECTS = 'EDIT_PROJECTS'
}

export enum VehiclePermissionsEnum {
  VIEW_VEHICLES = 'VIEW_VEHICLES',
  CREATE_VEHICLES = 'CREATE_VEHICLES',
  EDIT_VEHICLES = 'EDIT_VEHICLES'
}

export enum ManpowerPermissionsEnum {
  VIEW_MANPOWER = 'VIEW_MANPOWER',
  CREATE_MANPOWER = 'CREATE_MANPOWER',
  EDIT_MANPOWER = 'EDIT_MANPOWER'
}

export enum AdditionalMaterialPermissionsEnum {
  VIEW_ADDITIONAL_MATERIAL = 'VIEW_ADDITIONAL_MATERIAL',
  CREATE_ADDITIONAL_MATERIAL = 'CREATE_ADDITIONAL_MATERIAL',
  EDIT_ADDITIONAL_MATERIAL = 'EDIT_ADDITIONAL_MATERIAL'
}

export enum ServicePermissionsEnum {
  VIEW_SERVICES = 'VIEW_SERVICES',
  CREATE_SERVICES = 'CREATE_SERVICES',
  EDIT_SERVICES = 'EDIT_SERVICES'
}

export enum AssetPermissionsEnum {
  VIEW_ASSETS = 'VIEW_ASSETS',
  CREATE_ASSETS = 'CREATE_ASSETS',
  EDIT_ASSETS = 'EDIT_ASSETS'
}

export enum ClientPermissionsEnum {
  VIEW_OWN_CLIENTS = 'VIEW_OWN_CLIENTS',
  VIEW_GLOBAL_CLIENTS = 'VIEW_GLOBAL_CLIENTS',
  CREATE_CLIENTS = 'CREATE_CLIENTS',
  EDIT_CLIENTS = 'EDIT_CLIENTS'
}

export enum StaffPermissionsEnum {
  VIEW_OWN_STAFF = 'VIEW_OWN_STAFF',
  VIEW_GLOBAL_STAFF = 'VIEW_GLOBAL_STAFF',
  CREATE_STAFF = 'CREATE_STAFF',
  EDIT_STAFF = 'EDIT_STAFF'
}

export enum RolePermissionsEnum {
  VIEW_ROLES = 'VIEW_ROLES',
  CREATE_ROLES = 'CREATE_ROLES',
  EDIT_ROLES = 'EDIT_ROLES'
}

export enum SettingsPermissionsEnum {
  VIEW_SETTINGS = 'VIEW_SETTINGS',
  EDIT_SETTINGS = 'EDIT_SETTINGS'
}

export enum ReportPermissionsEnum {
  EXPORT_OWN_REPORTS = 'EXPORT_OWN_REPORTS',
  EXPORT_GLOBAL_REPORTS = 'EXPORT_GLOBAL_REPORTS',
  EXPORT_SALES_REPORTS = 'EXPORT_SALES_REPORTS',
  EXPORT_PROJECT_REPORTS = 'EXPORT_PROJECT_REPORTS',
  EXPORT_PERFORMANCE_REPORTS = 'EXPORT_PERFORMANCE_REPORTS'
}

export enum LeadAndSalesWidgetsPermissionsEnum {
  VIEW_OWN_LEAD_SALES_WIDGETS = 'VIEW_OWN_LEAD_SALES_WIDGETS',
  VIEW_GLOBAL_LEAD_SALES_WIDGETS = 'VIEW_GLOBAL_LEAD_SALES_WIDGETS'
}

export enum ProjectsAndOperationsWidgetsPermissionsEnum {
  VIEW_OWN_PROJECTS_OPERATIONS_WIDGETS = 'VIEW_OWN_PROJECTS_OPERATIONS_WIDGETS',
  VIEW_GLOBAL_PROJECTS_OPERATIONS_WIDGETS = 'VIEW_GLOBAL_PROJECTS_OPERATIONS_WIDGETS'
}
export enum FinancialAndBusinessMetricsWidgetsPermissionsEnum {
  VIEW_OWN_FINANCIAL_BUSINESS_METRICS_WIDGETS = 'VIEW_OWN_FINANCIAL_BUSINESS_METRICS_WIDGETS',
  VIEW_GLOBAL_FINANCIAL_BUSINESS_METRICS_WIDGETS = 'VIEW_GLOBAL_FINANCIAL_BUSINESS_METRICS_WIDGETS'
}

export enum PerformanceAndHRWidgetsPermissionsEnum {
  VIEW_OWN_PERFORMANCE_HR_WIDGETS = 'VIEW_OWN_PERFORMANCE_HR_WIDGETS',
  VIEW_GLOBAL_PERFORMANCE_HR_WIDGETS = 'VIEW_GLOBAL_PERFORMANCE_HR_WIDGETS'
}

// Consolidating all permissions
export const permissions = {
  leads: Object.keys(LeadPermissionsEnum),
  opportunities: Object.keys(OpportunityPermissionsEnum),
  deals: Object.keys(DealPermissionsEnum),
  proposals: Object.keys(ProposalPermissionsEnum),
  projects: Object.keys(ProjectPermissionsEnum),
  vehicles: Object.keys(VehiclePermissionsEnum),
  manpower: Object.keys(ManpowerPermissionsEnum),
  additionalMaterial: Object.keys(AdditionalMaterialPermissionsEnum),
  services: Object.keys(ServicePermissionsEnum),
  assets: Object.keys(AssetPermissionsEnum),
  clients: Object.keys(ClientPermissionsEnum),
  staff: Object.keys(StaffPermissionsEnum),
  roles: Object.keys(RolePermissionsEnum),
  settings: Object.keys(SettingsPermissionsEnum),
  reports: Object.keys(ReportPermissionsEnum),
  leadAndSalesWidgets: Object.keys(LeadAndSalesWidgetsPermissionsEnum),
  projectsAndOperationsWidgets: Object.keys(ProjectsAndOperationsWidgetsPermissionsEnum),
  financialAndBusinessMetricsWidgets: Object.keys(FinancialAndBusinessMetricsWidgetsPermissionsEnum),
  performanceAndHRWidgets: Object.keys(PerformanceAndHRWidgetsPermissionsEnum)
};

// Function to get all permissions
export function getAllPermissions(): string[] {
  return Object.values(permissions).reduce((total, row) => {
    total.push(...row);
    return total;
  }, []);
}

export function getPermissionsGroupedByName(): Record<string, string[]> {
  const grouped: Record<string, string[]> = {};
  for (const key in permissions) {
    const typedKey = key as keyof typeof permissions;
    grouped[key] = [...permissions[typedKey]];
  }
  return grouped;
}
