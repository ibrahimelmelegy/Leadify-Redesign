<template lang="pug">
.session-management
  el-card
    template(#header)
      .card-header
        h3 Active Sessions
        el-button(type="danger" size="small" @click="logoutAllOthers") Logout All Other Sessions
    
    .sessions-list
      .session-item(v-for="session in sessions" :key="session.id" :class="{ current: session.isCurrent }")
        .session-icon
          el-icon(:size="24")
            Monitor(v-if="session.deviceType === 'desktop'")
            Iphone(v-else-if="session.deviceType === 'mobile'")
            Iphone(v-else)
        .session-details
          .session-device {{ session.browser }} on {{ session.os }}
          .session-location {{ session.location || 'Unknown location' }}
          .session-time 
            span(v-if="session.isCurrent") Current session
            span(v-else) Last active: {{ formatTime(session.lastActivity) }}
        .session-actions(v-if="!session.isCurrent")
          el-button(type="danger" size="small" @click="logoutSession(session.id)") Logout
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Monitor, Iphone } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';

interface Session {
  id: string;
  browser: string;
  os: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  location?: string;
  ipAddress: string;
  lastActivity: string;
  isCurrent: boolean;
}

const sessions = ref<Session[]>([
  {
    id: '1',
    browser: 'Chrome 120',
    os: 'Windows 11',
    deviceType: 'desktop',
    location: 'Cairo, Egypt',
    ipAddress: '192.168.1.1',
    lastActivity: new Date().toISOString(),
    isCurrent: true
  }
]);

onMounted(async () => {
});

function formatTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} minutes ago`;
  if (hours < 24) return `${hours} hours ago`;
  return `${days} days ago`;
}

async function logoutSession(sessionId: string) {
  try {
    await ElMessageBox.confirm(
      'Are you sure you want to logout this session?',
      'Logout Session',
      { type: 'warning' }
    );
    sessions.value = sessions.value.filter(s => s.id !== sessionId);
    ElMessage.success('Session logged out');
  } catch {
  }
}

async function logoutAllOthers() {
  try {
    await ElMessageBox.confirm(
      'Are you sure you want to logout all other sessions?',
      'Logout All Sessions',
      { type: 'warning' }
    );
    sessions.value = sessions.value.filter(s => s.isCurrent);
    ElMessage.success('All other sessions logged out');
  } catch {
  }
}
</script>

<style scoped>
.session-management {
  max-width: 700px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  margin: 0;
}

.sessions-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.session-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid transparent;
}

.session-item.current {
  background: #ecfdf5;
  border-color: #10b981;
}

.session-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
}

.session-item.current .session-icon {
  color: #10b981;
}

.session-details {
  flex: 1;
}

.session-device {
  font-weight: 600;
  color: #1f2937;
}

.session-location {
  font-size: 13px;
  color: #6b7280;
  margin-top: 2px;
}

.session-time {
  font-size: 12px;
  color: #9ca3af;
  margin-top: 4px;
}

.session-item.current .session-time span {
  color: #10b981;
  font-weight: 500;
}
</style>
