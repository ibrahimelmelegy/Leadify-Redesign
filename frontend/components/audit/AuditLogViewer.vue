<template lang="pug">
.audit-log-viewer
  .filters
    el-row(:gutter="16")
      el-col(:span="6")
        el-select(v-model="filters.action" placeholder="Action" clearable @change="fetchLogs")
          el-option(label="Login" value="LOGIN")
          el-option(label="Logout" value="LOGOUT")
          el-option(label="Login Failed" value="LOGIN_FAILED")
          el-option(label="Create" value="CREATE")
          el-option(label="Update" value="UPDATE")
          el-option(label="Delete" value="DELETE")
          el-option(label="2FA Enabled" value="2FA_ENABLED")
          el-option(label="2FA Disabled" value="2FA_DISABLED")
      el-col(:span="6")
        el-select(v-model="filters.entityType" placeholder="Entity Type" clearable @change="fetchLogs")
          el-option(label="User" value="USER")
          el-option(label="Lead" value="LEAD")
          el-option(label="Opportunity" value="OPPORTUNITY")
          el-option(label="Deal" value="DEAL")
          el-option(label="Client" value="CLIENT")
          el-option(label="Project" value="PROJECT")
      el-col(:span="8")
        el-date-picker(
          v-model="dateRange"
          type="daterange"
          range-separator="to"
          start-placeholder="Start date"
          end-placeholder="End date"
          @change="fetchLogs"
        )
      el-col(:span="4")
        ExportButton(
          :data="logs"
          filename="audit-logs"
          :columns="exportColumns"
        )
  
  el-table(:data="logs" v-loading="loading" stripe)
    el-table-column(prop="createdAt" label="Date" width="180")
      template(#default="{ row }")
        | {{ formatDate(row.createdAt) }}
    el-table-column(prop="action" label="Action" width="140")
      template(#default="{ row }")
        el-tag(:type="getActionType(row.action)" size="small") {{ row.action }}
    el-table-column(prop="entityType" label="Entity" width="120")
    el-table-column(prop="entityId" label="Entity ID" width="100")
    el-table-column(label="User" width="150")
      template(#default="{ row }")
        span {{ `User #${row.userId}` }}
    el-table-column(prop="ipAddress" label="IP Address" width="140")
    el-table-column(label="Details")
      template(#default="{ row }")
        el-button(
          v-if="row.oldValues || row.newValues"
          type="primary"
          link
          @click="showDetails(row)"
        ) View Changes
  
  el-pagination(
    v-model:current-page="page"
    v-model:page-size="limit"
    :total="total"
    :page-sizes="[20, 50, 100]"
    layout="total, sizes, prev, pager, next"
    @current-change="fetchLogs"
    @size-change="fetchLogs"
  )
  
  el-dialog(v-model="detailsVisible" title="Change Details" width="600px")
    .change-details(v-if="selectedLog")
      .change-section(v-if="selectedLog.oldValues")
        h4 Previous Values
        pre {{ JSON.stringify(selectedLog.oldValues, null, 2) }}
      .change-section(v-if="selectedLog.newValues")
        h4 New Values
        pre {{ JSON.stringify(selectedLog.newValues, null, 2) }}
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useApiFetch } from '~/composables/useApiFetch';
import ExportButton from '~/components/global/ExportButton.vue';

interface AuditLog {
  id: number;
  userId: number;
  action: string;
  entityType: string;
  entityId?: number;
  oldValues?: object;
  newValues?: object;
  ipAddress?: string;
  createdAt: string;
}

const logs = ref<AuditLog[]>([]);
const loading = ref(false);
const page = ref(1);
const limit = ref(50);
const total = ref(0);
const detailsVisible = ref(false);
const selectedLog = ref<AuditLog | null>(null);
const dateRange = ref<[Date, Date] | null>(null);

const filters = ref({
  action: '',
  entityType: ''
});

const exportColumns = [
  { key: 'createdAt', label: 'Date' },
  { key: 'action', label: 'Action' },
  { key: 'entityType', label: 'Entity Type' },
  { key: 'entityId', label: 'Entity ID' },
  { key: 'userId', label: 'User ID' },
  { key: 'ipAddress', label: 'IP Address' }
];

onMounted(() => {
  fetchLogs();
});

async function fetchLogs() {
  try {
    loading.value = true;
    const params = new URLSearchParams();
    params.append('page', page.value.toString());
    params.append('limit', limit.value.toString());
    
    if (filters.value.action) params.append('action', filters.value.action);
    if (filters.value.entityType) params.append('entityType', filters.value.entityType);
    if (dateRange.value) {
      params.append('startDate', dateRange.value[0].toISOString());
      params.append('endDate', dateRange.value[1].toISOString());
    }

    const response = await useApiFetch(`audit?${params.toString()}`);
    logs.value = response?.logs || [];
    total.value = response?.total || 0;
  } catch (error) {
    console.error('Failed to fetch audit logs:', error);
  } finally {
    loading.value = false;
  }
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleString();
}

function getActionType(action: string): string {
  if (action.includes('LOGIN') && !action.includes('FAILED')) return 'success';
  if (action.includes('FAILED')) return 'danger';
  if (action === 'CREATE') return 'success';
  if (action === 'DELETE') return 'danger';
  if (action === 'UPDATE') return 'warning';
  return 'info';
}

function showDetails(log: AuditLog) {
  selectedLog.value = log;
  detailsVisible.value = true;
}
</script>

<style scoped>
.audit-log-viewer {
  padding: 20px;
}

.filters {
  margin-bottom: 20px;
}

.change-details {
  max-height: 400px;
  overflow-y: auto;
}

.change-section {
  margin-bottom: 20px;
}

.change-section h4 {
  margin: 0 0 10px 0;
  color: #374151;
}

.change-section pre {
  background: #f3f4f6;
  padding: 12px;
  border-radius: 6px;
  overflow-x: auto;
  font-size: 13px;
}

.el-pagination {
  margin-top: 20px;
  justify-content: flex-end;
}
</style>
