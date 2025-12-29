<template lang="pug">
RoleForm( :loading="loading" @submit="submitForm" :data="role")
  .flex.items-center.justify-between.mb-8
    .title.font-bold.text-2xl.mb-1.capitalize Edit Role
    .flex.items-center.gap-x-2
      el-button(   size='large' plain type="primary" class="w-full !rounded-2xl" @click="router.back()") Cancel
      el-button(   size='large' type="primary" native-type="submit" :loading="loading"  :disabled="loading" class="w-full !px-5 !rounded-2xl") update
.card.m-auto.bg-white.rounded-3xl(class="mt-4 p-10")
  h3.text-2xl.font-bold.mb-5 Permissions
  .flex.flex-col.gap-y-4
    div.flex.gap-x-4.rounded-2xl.items-center.border.border-neutral-100.divide-x.mb-4.bg-neutral-100(v-for="(permissions, key) in permissionsData" :key="key")
      p.ps-4.h-full.text-sm.text-neutral-600.font-medium.py-3(class="w-[190px] min-w-[190px]") {{ formatKeyLabel(key) }}
      el-checkbox-group.grid.gap-4.w-full.text-sm.text-neutral-500.font-medium.bg-white.py-3.rounded-r-2xl.divide-x(v-model="checkList[key]" class="grid-cols-2 xl:grid-cols-4")
        el-checkbox.px-4.w-full(v-for="permission in permissions" :key="permission"
          :label="permission"
          @change="handleMutuallyExclusive(permission, key)") {{ formatPermissionLabel(permission) }}
</template>

<script lang="ts" setup>
  const loading = ref(false);
  const route = useRoute();
  useHead({
    title: "App HP Tech | Edit Role",
  });
  definePageMeta({
    middleware: "permissions",
    permission: "EDIT_ROLES",
  });

  const role = await getRole(route.params.slug);

  async function submitForm(values: any) {
    loading.value = true;
    await updateRole({ ...values, id: route.params.slug as string, permissions: Object.values(checkList.value).flat() });
    loading.value = false;
  }

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

  const checkList = ref(Object.fromEntries(Object.keys(permissionsData.value).map((key) => [key, []])));

  function formatKeyLabel(key: string) {
    return key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());
  }

  function formatPermissionLabel(permission: string) {
    if (permission.includes("VIEW_OWN")) return "View (Own)";
    if (permission.includes("VIEW_GLOBAL")) return "View (Global)";
    if (permission.includes("VIEW")) return "View";
    if (permission.includes("CREATE")) return "Create";
    if (permission.includes("EDIT")) return "Edit";
    if (permission.includes("EXPORT_OWN")) return "Export (Own)";
    if (permission.includes("EXPORT_GLOBAL")) return "Export (Global)";
    if (permission.includes("EXPORT_SALES")) return "Export Sales Reports";
    if (permission.includes("EXPORT_PROJECT")) return "Export Project Reports";
    if (permission.includes("EXPORT_PERFORMANCE")) return "Export Performance Reports";
    return permission.replace(/_/g, " ").toLowerCase();
  }

  function handleMutuallyExclusive(permission: string, key: string) {
    const list = checkList.value[key];

    const isOwn = permission.includes("OWN");
    const isGlobal = permission.includes("GLOBAL");

    if (!isOwn && !isGlobal) return; // skip non-exclusive types

    const prefix = permission.startsWith("VIEW_") ? "VIEW" : permission.startsWith("EXPORT_") ? "EXPORT" : null;

    if (!prefix) return;

    const base = permission.replace(`${prefix}_OWN_`, "").replace(`${prefix}_GLOBAL_`, "");

    const ownPermission = `${prefix}_OWN_${base}`;
    const globalPermission = `${prefix}_GLOBAL_${base}`;

    if (permission === ownPermission && list.includes(globalPermission)) {
      checkList.value[key] = list.filter((p) => p !== globalPermission);
    } else if (permission === globalPermission && list.includes(ownPermission)) {
      checkList.value[key] = list.filter((p) => p !== ownPermission);
    }
  }

  const applySelectedPermissions = (selected: string[]) => {
    for (const [key, permissions] of Object.entries(permissionsData.value)) {
      checkList.value[key] = permissions?.filter((p) => selected.includes(p));
    }
  };

  onMounted(() => {
    if (role?.permissions) {
      applySelectedPermissions(role.permissions);
    }
  });
</script>
