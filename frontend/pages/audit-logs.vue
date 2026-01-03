<template lang="pug">
.audit-logs-page
  h1 Audit Logs
  p.description Track all system activities and changes
  AuditLogViewer
</template>

<script setup lang="ts">
import AuditLogViewer from '~/components/audit/AuditLogViewer.vue';

definePageMeta({
  layout: 'default',
  middleware: 'auth'
});
</script>

<style scoped>
.audit-logs-page {
  padding: 20px;
}

.audit-logs-page h1 {
  margin: 0 0 8px 0;
  font-size: 24px;
  color: #1f2937;
}

.description {
  color: #6b7280;
  margin: 0 0 24px 0;
}
</style>
