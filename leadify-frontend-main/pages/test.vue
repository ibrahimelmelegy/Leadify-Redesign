<template>
  <div class="permissions-table">
    <div v-for="(actions, category) in permissionsData" :key="category" class="permission-row">
      <div class="category-name">{{ labels[category] || category }}</div>

      <div class="checkbox-grid">
        <div v-for="permission in actions" :key="permission" class="checkbox-wrapper">
          <el-checkbox :label="permission" v-model="selectedPermissions">
            {{ dynamicLabel(permission) }}
          </el-checkbox>
        </div>
      </div>
    </div>

    <h3 style="margin-top: 20px">Selected Permissions:</h3>
    <pre>{{ selectedPermissions }}</pre>
  </div>
</template>

<script setup>
  import { ref } from "vue";

  const selectedPermissions = ref([]);

  const dynamicLabel = (permissionValue) => {
    if (permissionValue.startsWith("VIEW_OWN")) return "View (Own)";
    if (permissionValue.startsWith("VIEW_GLOBAL")) return "View (Global)";
    if (permissionValue.startsWith("VIEW")) return "View (Global)";
    if (permissionValue.startsWith("CREATE")) return "Create";
    if (permissionValue.startsWith("EDIT")) return "Edit";

    return permissionValue
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const permissionsData = {
    leads: ["VIEW_OWN_LEADS", "VIEW_GLOBAL_LEADS", "CREATE_LEADS", "EDIT_LEADS"],
    opportunities: ["VIEW_OWN_OPPORTUNITIES", "VIEW_GLOBAL_OPPORTUNITIES", "CREATE_OPPORTUNITIES", "EDIT_OPPORTUNITIES"],
    deals: ["VIEW_OWN_DEALS", "VIEW_GLOBAL_DEALS", "CREATE_DEALS", "EDIT_DEALS"],
    proposals: ["VIEW_OWN_PROPOSALS", "VIEW_GLOBAL_PROPOSALS", "CREATE_PROPOSALS", "EDIT_PROPOSALS"],
    projects: ["VIEW_OWN_PROJECTS", "VIEW_GLOBAL_PROJECTS", "CREATE_PROJECTS", "EDIT_PROJECTS"],
    vehicles: ["VIEW_VEHICLES", "CREATE_VEHICLES", "EDIT_VEHICLES"],
    manpower: ["VIEW_MANPOWER", "CREATE_MANPOWER", "EDIT_MANPOWER"],
    additionalMaterial: ["VIEW_ADDITIONAL_MATERIAL", "CREATE_ADDITIONAL_MATERIAL", "EDIT_ADDITIONAL_MATERIAL"],
    services: ["VIEW_SERVICES", "CREATE_SERVICES", "EDIT_SERVICES"],
    assets: ["VIEW_ASSETS", "CREATE_ASSETS", "EDIT_ASSETS"],
    clients: ["VIEW_OWN_CLIENTS", "VIEW_GLOBAL_CLIENTS", "CREATE_CLIENTS", "EDIT_CLIENTS"],
    staff: ["VIEW_OWN_STAFF", "VIEW_GLOBAL_STAFF", "CREATE_STAFF", "EDIT_STAFF"],
    roles: ["VIEW_ROLES", "CREATE_ROLES", "EDIT_ROLES"],
    settings: ["VIEW_SETTINGS", "EDIT_SETTINGS"],
    reports: [
      "EXPORT_OWN_REPORTS",
      "EXPORT_GLOBAL_REPORTS",
      "EXPORT_SALES_REPORTS",
      "EXPORT_PROJECT_REPORTS",
      "EXPORT_PERFORMANCE_REPORTS",
    ],
    // dashboard: ["VIEW_OWN_DASHBOARD", "VIEW_GLOBAL_DASHBOARD"],
    salesWidgets: [
      "TOTAL_LEADS_ASSIGNED",
      "LEAD_CONVERSION_RATE",
      "TOTAL_OPPORTUNITIES",
      "OPPORTUNITIES_BY_STAGE",
      "DEALS_PIPELINE_OVERVIEW",
      "TOTAL_DEALS_CLOSED",
      "REVENUE_FROM_WON_DEALS",
      "SALES_PERFORMANCE_OVER_TIME",
    ],
    projectWidgets: [
      "TOTAL_PROJECTS",
      "PROJECTS_BY_STATUS",
      "PROJECT_BUDGET_VS_ACTUAL_EXPENSES",
      "RESOURCE_ALLOCATION",
      "EITMAD_PROJECTS_OVERVIEW",
      "PROJECT_PROFITABILITY_ANALYSIS",
      "DELAYED_PROJECTS_AND_RISKS",
    ],
    financialWidgets: [
      "TOTAL_REVENUE",
      "OUTSTANDING_INVOICES_VS_COLLECTED_PAYMENTS",
      "PROFIT_MARGIN_ANALYSIS",
      "EXPENSE_BREAKDOWN",
      "ACCOUNTS_RECEIVABLE_PAYABLE_SUMMARY",
      "UPCOMING_PAYMENTS_OVERDUE_INVOICES",
    ],
    performanceWidgets: [
      "LEADS_WON_BY_USER",
      "OPPORTUNITIES_CONVERTED_TO_DEALS",
      "TOTAL_DEALS_CLOSED_PER_USER",
      "TOP_PERFORMING_EMPLOYEES",
      "TOP_PERFORMING_MANPOWER",
    ],
  };

  const labels = {
    roles: "Roles",
    settings: "Settings",
    reports: "Reports",
    dashboard: "Dashboard",
    salesWidgets: "Sales Widgets",
    projectWidgets: "Project Widgets",
    financialWidgets: "Financial Widgets",
    performanceWidgets: "Performance Widgets",
  };
</script>

<style scoped>
  .permissions-table {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .permission-row {
    display: flex;
    align-items: flex-start;
    padding: 8px;
    background: #f9f9f9;
    border: 1px solid #eee;
    border-radius: 6px;
  }

  .category-name {
    width: 160px;
    font-weight: bold;
    padding-top: 8px;
  }

  .checkbox-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 12px;
    flex: 1;
  }

  .checkbox-wrapper {
    display: flex;
    align-items: center;
  }
</style>
