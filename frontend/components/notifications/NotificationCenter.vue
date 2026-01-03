<template lang="pug">
.notification-center
  el-popover(
    placement="bottom-end"
    :width="360"
    trigger="click"
    popper-class="notification-popover"
  )
    template(#reference)
      el-badge(:value="unreadCount" :hidden="unreadCount === 0" :max="99")
        el-button(circle)
          el-icon(:size="20")
            Bell
    .notification-header
      h4 Notifications
      el-button(
        v-if="unreadCount > 0"
        type="primary"
        link
        @click="markAllAsRead"
      ) Mark all as read
    .notification-list(v-if="notifications.length")
      .notification-item(
        v-for="notification in notifications"
        :key="notification.id"
        :class="{ unread: notification.read === 'UN_READ' }"
        @click="handleNotificationClick(notification)"
      )
        .notification-icon(:class="getIconClass(notification.type)")
          el-icon
            component(:is="getIcon(notification.type)")
        .notification-content
          .notification-body {{ notification.body_en }}
          .notification-time {{ formatTime(notification.createdAt) }}
    .notification-empty(v-else)
      el-empty(description="No notifications")
    .notification-footer
      el-button(type="primary" link @click="viewAll") View All
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { Bell, Check, Warning, InfoFilled, User } from '@element-plus/icons-vue';
import { useApiFetch } from '~/composables/useApiFetch';

interface Notification {
  id: number;
  body_en: string;
  read: 'READ' | 'UN_READ';
  type: string;
  target?: string;
  createdAt: string;
}

const notifications = ref<Notification[]>([]);
const loading = ref(false);

const unreadCount = computed(() => 
  notifications.value.filter(n => n.read === 'UN_READ').length
);

onMounted(async () => {
  await fetchNotifications();
});

async function fetchNotifications() {
  try {
    loading.value = true;
    const response = await useApiFetch('notification?limit=10');
    notifications.value = response?.body || [];
  } catch (error) {
    console.error('Failed to fetch notifications:', error);
  } finally {
    loading.value = false;
  }
}

async function markAllAsRead() {
  try {
    await useApiFetch('notification/mark-all-read', { method: 'PUT' });
    notifications.value = notifications.value.map(n => ({ ...n, read: 'READ' }));
  } catch (error) {
    console.error('Failed to mark all as read:', error);
  }
}

async function handleNotificationClick(notification: Notification) {
  if (notification.read === 'UN_READ') {
    try {
      await useApiFetch(`notification/${notification.id}/read`, { method: 'PUT' });
      notification.read = 'READ';
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  }
  
  if (notification.target) {
    navigateTo(notification.target);
  }
}

function viewAll() {
  navigateTo('/notifications');
}

function getIcon(type: string) {
  switch (type) {
    case 'success': return Check;
    case 'warning': return Warning;
    case 'info': return InfoFilled;
    default: return User;
  }
}

function getIconClass(type: string) {
  return `icon-${type || 'info'}`;
}

function formatTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}
</script>

<style scoped>
.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #e5e7eb;
}

.notification-header h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.notification-list {
  max-height: 400px;
  overflow-y: auto;
}

.notification-item {
  display: flex;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  transition: background 0.2s;
}

.notification-item:hover {
  background: #f9fafb;
}

.notification-item.unread {
  background: #eff6ff;
}

.notification-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.icon-success { background: #d1fae5; color: #059669; }
.icon-warning { background: #fef3c7; color: #d97706; }
.icon-info { background: #dbeafe; color: #2563eb; }

.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-body {
  font-size: 14px;
  color: #374151;
  line-height: 1.4;
}

.notification-time {
  font-size: 12px;
  color: #9ca3af;
  margin-top: 4px;
}

.notification-empty {
  padding: 24px;
}

.notification-footer {
  padding: 12px 16px;
  border-top: 1px solid #e5e7eb;
  text-align: center;
}
</style>
