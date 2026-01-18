<template lang="pug">
.settings-dashboard
  .mb-8
    h1.text-3xl.font-bold.text-neutral-900(class="dark:text-white mb-2") Settings
    p.text-neutral-500(class="dark:text-slate-400") Manage your system preferences and security settings.

  .grid.grid-cols-1.gap-6(class="md:grid-cols-2 lg:grid-cols-3")
    //- Security Settings
    NuxtLink.block(to="/settings/security")
      .card-hover.bg-white.p-6.rounded-3xl.border.border-neutral-100(class="dark:bg-slate-800 dark:border-slate-700 h-full")
        .flex.items-center.gap-4.mb-4
          .w-12.h-12.rounded-2xl.bg-primary-purple-50.flex.items-center.justify-center(class="dark:bg-indigo-900/30")
             Icon.text-primary-purple-600(name="material-symbols:security" size="28" class="dark:text-indigo-400")
          div
            h3.text-lg.font-bold.text-neutral-900(class="dark:text-white") Security
            p.text-sm.text-neutral-500(class="dark:text-slate-400") Password, 2FA & Sessions

    //- Webhooks
    NuxtLink.block(to="/settings/webhooks")
      .card-hover.bg-white.p-6.rounded-3xl.border.border-neutral-100(class="dark:bg-slate-800 dark:border-slate-700 h-full")
        .flex.items-center.gap-4.mb-4
          .w-12.h-12.rounded-2xl.bg-secondary-turquoise-50.flex.items-center.justify-center(class="dark:bg-teal-900/30")
             Icon.text-secondary-turquoise-600(name="material-symbols:webhook" size="28" class="dark:text-teal-400")
          div
            h3.text-lg.font-bold.text-neutral-900(class="dark:text-white") Webhooks
            p.text-sm.text-neutral-500(class="dark:text-slate-400") Manage API Webhooks

    //- Audit Logs
    NuxtLink.block(to="/audit-logs")
      .card-hover.bg-white.p-6.rounded-3xl.border.border-neutral-100(class="dark:bg-slate-800 dark:border-slate-700 h-full")
        .flex.items-center.gap-4.mb-4
          .w-12.h-12.rounded-2xl.bg-secondary-blue-50.flex.items-center.justify-center(class="dark:bg-blue-900/30")
             Icon.text-secondary-blue-600(name="material-symbols:history-edu" size="28" class="dark:text-blue-400")
          div
            h3.text-lg.font-bold.text-neutral-900(class="dark:text-white") Audit Logs
            p.text-sm.text-neutral-500(class="dark:text-slate-400") View System Activity

    //- Roles & Permissions (If Admin)
    NuxtLink.block(to="/roles" v-if="hasPermission('MANAGE_ROLES')")
      .card-hover.bg-white.p-6.rounded-3xl.border.border-neutral-100(class="dark:bg-slate-800 dark:border-slate-700 h-full")
        .flex.items-center.gap-4.mb-4
          .w-12.h-12.rounded-2xl.bg-orange-50.flex.items-center.justify-center(class="dark:bg-orange-900/30")
             Icon.text-orange-600(name="material-symbols:admin-panel-settings" size="28" class="dark:text-orange-400")
          div
            h3.text-lg.font-bold.text-neutral-900(class="dark:text-white") Roles & Permissions
            p.text-sm.text-neutral-500(class="dark:text-slate-400") Team Access Control

    //- Notifications (Placeholder)
    NuxtLink.block(to="/notifications")
      .card-hover.bg-white.p-6.rounded-3xl.border.border-neutral-100(class="dark:bg-slate-800 dark:border-slate-700 h-full")
        .flex.items-center.gap-4.mb-4
          .w-12.h-12.rounded-2xl.bg-red-50.flex.items-center.justify-center(class="dark:bg-red-900/30")
             Icon.text-red-600(name="material-symbols:notifications-active" size="28" class="dark:text-red-400")
          div
            h3.text-lg.font-bold.text-neutral-900(class="dark:text-white") Notifications
            p.text-sm.text-neutral-500(class="dark:text-slate-400") Alert Preferences

</template>

<script setup lang="ts">
const { hasPermission } = await usePermissions();

definePageMeta({
  layout: 'default', // Ensures sidebar/header are shown
});
</script>

<style scoped>
.card-hover {
  transition: all 0.3s ease;
}
.card-hover:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 30px -10px rgba(0,0,0,0.1);
}
</style>
