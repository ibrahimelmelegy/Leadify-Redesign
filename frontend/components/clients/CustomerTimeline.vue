<template lang="pug">
.customer-timeline
  h3.timeline-title Customer Activity Timeline
  .timeline-container
    .timeline-item(v-for="event in sortedEvents" :key="event.id" :class="event.type")
      .timeline-marker
        el-icon
          component(:is="getIcon(event.type)")
      .timeline-content
        .timeline-header
          span.timeline-type {{ getTypeLabel(event.type) }}
          span.timeline-date {{ formatDate(event.date) }}
        .timeline-body {{ event.description }}
        .timeline-meta(v-if="event.user")
          el-avatar(:size="20")
          span {{ event.user }}
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { 
  User, 
  Phone, 
  Message, 
  Document, 
  Money, 
  Check, 
  Star,
  Bell 
} from '@element-plus/icons-vue';

interface TimelineEvent {
  id: number;
  type: 'lead' | 'call' | 'email' | 'meeting' | 'proposal' | 'deal' | 'project' | 'note';
  description: string;
  date: string;
  user?: string;
}

const props = defineProps<{
  events: TimelineEvent[];
}>();

const sortedEvents = computed(() => {
  return [...props.events].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
});

function getIcon(type: string) {
  const icons: Record<string, any> = {
    lead: User,
    call: Phone,
    email: Message,
    meeting: Bell,
    proposal: Document,
    deal: Money,
    project: Star,
    note: Document
  };
  return icons[type] || Document;
}

function getTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    lead: 'Lead Created',
    call: 'Phone Call',
    email: 'Email Sent',
    meeting: 'Meeting',
    proposal: 'Proposal Sent',
    deal: 'Deal Closed',
    project: 'Project Started',
    note: 'Note Added'
  };
  return labels[type] || type;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}
</script>

<style scoped>
.customer-timeline {
  background: white;
  border-radius: 12px;
  padding: 20px;
}

.timeline-title {
  margin: 0 0 20px 0;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.timeline-container {
  position: relative;
  padding-left: 30px;
}

.timeline-container::before {
  content: '';
  position: absolute;
  left: 11px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: #e5e7eb;
}

.timeline-item {
  position: relative;
  padding-bottom: 24px;
}

.timeline-item:last-child {
  padding-bottom: 0;
}

.timeline-marker {
  position: absolute;
  left: -30px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border: 2px solid #e5e7eb;
  color: #6b7280;
}

.timeline-item.lead .timeline-marker { border-color: #3b82f6; color: #3b82f6; }
.timeline-item.call .timeline-marker { border-color: #10b981; color: #10b981; }
.timeline-item.email .timeline-marker { border-color: #8b5cf6; color: #8b5cf6; }
.timeline-item.meeting .timeline-marker { border-color: #f59e0b; color: #f59e0b; }
.timeline-item.proposal .timeline-marker { border-color: #ec4899; color: #ec4899; }
.timeline-item.deal .timeline-marker { border-color: #059669; color: #059669; }
.timeline-item.project .timeline-marker { border-color: #0ea5e9; color: #0ea5e9; }

.timeline-content {
  background: #f9fafb;
  border-radius: 8px;
  padding: 12px 16px;
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.timeline-type {
  font-weight: 600;
  font-size: 14px;
  color: #374151;
}

.timeline-date {
  font-size: 12px;
  color: #9ca3af;
}

.timeline-body {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.5;
}

.timeline-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
  font-size: 12px;
  color: #9ca3af;
}
</style>
