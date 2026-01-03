<template lang="pug">
.customer-timeline
  h3.timeline-title
    Icon(name="ph:timeline-bold" size="20")
    span Customer Timeline
  .timeline-filters.mb-4
    el-radio-group(v-model="filter" size="small")
      el-radio-button(label="all") All
      el-radio-button(label="opportunities") Opportunities
      el-radio-button(label="deals") Deals
      el-radio-button(label="projects") Projects
  .timeline-content
    .timeline-empty(v-if="!filteredEvents.length")
      Icon(name="ph:clock-light" size="48")
      p No activity found
    .timeline-list(v-else)
      .timeline-item(v-for="event in filteredEvents" :key="event.id")
        .timeline-icon(:class="event.type")
          Icon(:name="getIcon(event.type)" size="16")
        .timeline-body
          .timeline-header
            span.timeline-title-text {{ event.title }}
            span.timeline-date {{ formatDate(event.date) }}
          .timeline-description {{ event.description }}
          .timeline-meta(v-if="event.value")
            span.timeline-value {{ formatCurrency(event.value) }}
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

const props = defineProps<{
  clientId: number;
}>();

const filter = ref('all');

interface TimelineEvent {
  id: number;
  type: 'opportunity' | 'deal' | 'project' | 'contact';
  title: string;
  description: string;
  date: string;
  value?: number;
}

const events = ref<TimelineEvent[]>([]);

const filteredEvents = computed(() => {
  if (filter.value === 'all') return events.value;
  return events.value.filter(e => e.type === filter.value.slice(0, -1));
});

function getIcon(type: string): string {
  const icons: Record<string, string> = {
    opportunity: 'ph:target-bold',
    deal: 'ph:handshake-bold',
    project: 'ph:folder-bold',
    contact: 'ph:phone-bold'
  };
  return icons[type] || 'ph:circle-bold';
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'SAR'
  }).format(value);
}

onMounted(async () => {
  try {
    const [opps, deals, projects] = await Promise.all([
      useApiFetch(`opportunity?clientId=${props.clientId}`, 'GET'),
      useApiFetch(`deal?clientId=${props.clientId}`, 'GET'),
      useApiFetch(`project?clientId=${props.clientId}`, 'GET')
    ]);
    
    const allEvents: TimelineEvent[] = [];
    
    if (opps?.data) {
      opps.data.forEach((o: any) => {
        allEvents.push({
          id: o.id,
          type: 'opportunity',
          title: o.name,
          description: `Stage: ${o.stage}`,
          date: o.createdAt,
          value: o.estimatedValue
        });
      });
    }
    
    if (deals?.data) {
      deals.data.forEach((d: any) => {
        allEvents.push({
          id: d.id,
          type: 'deal',
          title: d.name,
          description: `Stage: ${d.stage}`,
          date: d.createdAt,
          value: d.price
        });
      });
    }
    
    if (projects?.data) {
      projects.data.forEach((p: any) => {
        allEvents.push({
          id: p.id,
          type: 'project',
          title: p.name,
          description: `Status: ${p.status}`,
          date: p.createdAt
        });
      });
    }
    
    events.value = allEvents.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  } catch (e) {
    console.error('Failed to load timeline:', e);
  }
});
</script>

<style scoped>
.customer-timeline {
  background: white;
  border-radius: 16px;
  padding: 24px;
}

.timeline-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #1f2937;
}

.timeline-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: #9ca3af;
}

.timeline-list {
  position: relative;
  padding-left: 32px;
}

.timeline-list::before {
  content: '';
  position: absolute;
  left: 12px;
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

.timeline-icon {
  position: absolute;
  left: -32px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.timeline-icon.opportunity { background: #3b82f6; }
.timeline-icon.deal { background: #10b981; }
.timeline-icon.project { background: #8b5cf6; }
.timeline-icon.contact { background: #f59e0b; }

.timeline-body {
  background: #f9fafb;
  border-radius: 12px;
  padding: 16px;
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.timeline-title-text {
  font-weight: 600;
  color: #1f2937;
}

.timeline-date {
  font-size: 12px;
  color: #9ca3af;
}

.timeline-description {
  font-size: 14px;
  color: #6b7280;
}

.timeline-meta {
  margin-top: 8px;
}

.timeline-value {
  font-weight: 600;
  color: #059669;
}

.dark .customer-timeline {
  background: var(--bg-primary);
}

.dark .timeline-title {
  color: var(--text-primary);
}

.dark .timeline-body {
  background: var(--bg-tertiary);
}

.dark .timeline-title-text {
  color: var(--text-primary);
}

.dark .timeline-description {
  color: var(--text-secondary);
}
</style>
