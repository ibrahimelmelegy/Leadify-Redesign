<template lang="pug">
  .flex.items-center.justify-between.mb-5.mt-5
    .title.font-bold.text-2xl.mb-1.capitalize View Role
    el-dropdown(trigger="click")
        span.el-dropdown-link
            button.rounded-btn(class="!px-4"): Icon(name="IconToggle" size="24")
        template(#dropdown)
            el-dropdown-menu
              el-dropdown-item(v-if="hasPermission('EDIT_ROLES')")
                NuxtLink.flex.items-center(:to="`/roles/edit/${role?.id}`")
                  Icon.text-md.mr-2(size="20" name="IconEdit" )
                  p.text-sm Edit
              //- el-dropdown-item
              //-   .flex.items-center
              //-     Icon.text-md.mr-2(size="20" name="IconDelete" )
              //-     p.text-sm Delete

  .flex-1.bg-white.p-10.rounded-3xl
      p.text-neutral-900.font-semibold.mb-6.text-lg Information
      .grid.gap-4(class="lg:grid-cols-4 grid-cols-1")
        div(v-if="role?.name")
          .text-neutral-400.font-medium.mb-2.flex.items-center
            Icon(name="tabler:category-2" size="20" class="mr-2")
            p Role
          p.text-neutral-800.mb-2 {{role?.name}}
        div
          .text-neutral-400.font-medium.mb-2.flex.items-center
            Icon(name="solar:hashtag-outline" size="20" class="mr-2")
            p Total Staff
          p.text-neutral-800.mb-2 {{role.totalAssignedUsers}}
        div(v-if="role.description")
          .text-neutral-400.font-medium.mb-2.flex.items-center
            Icon(name="solar:hashtag-outline" size="20" class="mr-2")
            p Description
          p.text-neutral-800.mb-2 {{role.description}}
  .card.m-auto.bg-white.rounded-3xl.p-10
    h3.text-2xl.font-bold.mb-5 Permissions

    .flex.flex-col.gap-y-6
      template(v-for="(permissions, key) in permissionsData" :key="key")
        div.flex.gap-x-4.rounded-2xl.items-center.border.border-neutral-100.divide-x.mb-4.bg-neutral-100(v-if="getEffectivePermissions(key)?.length")
          p.ps-4.h-full.text-sm.text-neutral-600.font-medium.py-3(class="w-[190px] min-w-[190px]") {{ formatKeyLabel(key) }}
          .grid.gap-4.w-full.text-sm.text-neutral-500.font-medium.bg-white.py-3.rounded-r-2xl.divide-x(class="grid-cols-2 xl:grid-cols-4")
            .px-4.w-full(v-for="permission in getEffectivePermissions(key)" :key="permission") {{ formatPermissionLabel(permission) }}
</template>

<script lang="ts" setup>
  const route = useRoute();
  const { hasPermission } = await usePermissions();

  // Call API to Get the role
  const role = await getRole(route.params.slug);

  const permissionsData = ref({
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
    reports: [
      "EXPORT_OWN_REPORTS",
      "EXPORT_GLOBAL_REPORTS",
      "EXPORT_SALES_REPORTS",
      "EXPORT_PROJECT_REPORTS",
      "EXPORT_PERFORMANCE_REPORTS",
    ],
    salesWidgets: ["VIEW_OWN_LEAD_SALES_WIDGETS", "VIEW_GLOBAL_LEAD_SALES_WIDGETS"],
    projectWidgets: ["VIEW_OWN_PROJECTS_OPERATIONS_WIDGETS", "VIEW_GLOBAL_PROJECTS_OPERATIONS_WIDGETS"],
    financialWidgets: ["VIEW_OWN_FINANCIAL_BUSINESS_METRICS_WIDGETS", "VIEW_GLOBAL_FINANCIAL_BUSINESS_METRICS_WIDGETS"],
    performanceWidgets: ["VIEW_OWN_PERFORMANCE_HR_WIDGETS", "VIEW_GLOBAL_PERFORMANCE_HR_WIDGETS"],
  });

  // Format section header
  function formatKeyLabel(key: string) {
    return key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());
  }

  // Format permission label
  function formatPermissionLabel(permission: string) {
    if (permission.includes("VIEW_OWN")) return "View (Own)";
    if (permission.includes("VIEW_GLOBAL")) return "View (Global)";
    if (permission.includes("CREATE")) return "Create";
    if (permission.includes("EDIT")) return "Edit";
    if (permission.includes("EXPORT_OWN")) return "Export (Own)";
    if (permission.includes("EXPORT_GLOBAL")) return "Export (Global)";
    if (permission.includes("EXPORT_SALES")) return "Export Sales Reports";
    if (permission.includes("EXPORT_PROJECT")) return "Export Project Reports";
    if (permission.includes("EXPORT_PERFORMANCE")) return "Export Performance Reports";
    return permission.replace(/_/g, " ").toLowerCase();
  }

  // Get displayed permissions
  function getEffectivePermissions(section: string): string[] {
    const available = permissionsData.value[section];
    const assigned = role?.permissions?.filter((p) => available.includes(p)) || [];

    if (assigned.length > 0) return assigned;

    // fallback to first VIEW_OWN_* if available
    const fallback = available.find((p) => p.includes("VIEW_OWN"));
    return fallback ? [fallback] : [];
  }
</script>
<style scoped lang="scss"></style>
