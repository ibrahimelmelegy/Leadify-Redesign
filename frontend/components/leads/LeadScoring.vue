<template lang="pug">
.lead-scoring
  .score-circle(:class="scoreClass")
    .score-value {{ score }}
    .score-label Score
  .score-details
    .score-breakdown
      .score-item(v-for="item in breakdown" :key="item.label")
        .score-item-label {{ item.label }}
        .score-item-bar
          .score-item-fill(:style="{ width: `${item.percentage}%` }" :class="item.type")
        .score-item-value +{{ item.value }}
    .score-recommendation(v-if="recommendation")
      el-icon
        InfoFilled
      span {{ recommendation }}
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { InfoFilled } from '@element-plus/icons-vue';

const props = defineProps<{
  lead: {
    email?: string;
    phone?: string;
    companyName?: string;
    leadSource?: string;
    status?: string;
    lastContactDate?: string;
    notes?: string;
  };
}>();

interface ScoreItem {
  label: string;
  value: number;
  percentage: number;
  type: 'success' | 'warning' | 'info';
}

const breakdown = computed<ScoreItem[]>(() => {
  const items: ScoreItem[] = [];
  
  if (props.lead.email) {
    items.push({ label: 'Has Email', value: 15, percentage: 100, type: 'success' });
  }
  if (props.lead.phone) {
    items.push({ label: 'Has Phone', value: 15, percentage: 100, type: 'success' });
  }
  if (props.lead.companyName) {
    items.push({ label: 'Company Name', value: 20, percentage: 100, type: 'success' });
  }
  if (props.lead.leadSource && props.lead.leadSource !== 'OTHER') {
    items.push({ label: 'Known Source', value: 10, percentage: 100, type: 'info' });
  }
  if (props.lead.status === 'QUALIFIED') {
    items.push({ label: 'Qualified', value: 25, percentage: 100, type: 'success' });
  } else if (props.lead.status === 'CONTACTED') {
    items.push({ label: 'Contacted', value: 10, percentage: 40, type: 'warning' });
  }
  if (props.lead.lastContactDate) {
    const daysSince = Math.floor((Date.now() - new Date(props.lead.lastContactDate).getTime()) / 86400000);
    if (daysSince < 7) {
      items.push({ label: 'Recent Contact', value: 15, percentage: 100, type: 'success' });
    } else if (daysSince < 30) {
      items.push({ label: 'Recent Contact', value: 8, percentage: 53, type: 'warning' });
    }
  }
  
  return items;
});

const score = computed(() => {
  return breakdown.value.reduce((sum, item) => sum + item.value, 0);
});

const scoreClass = computed(() => {
  if (score.value >= 70) return 'score-hot';
  if (score.value >= 40) return 'score-warm';
  return 'score-cold';
});

const recommendation = computed(() => {
  if (score.value >= 70) return 'Hot lead! Prioritize for immediate follow-up.';
  if (score.value >= 40) return 'Warm lead. Schedule a follow-up within this week.';
  return 'Cold lead. Nurture with marketing content.';
});
</script>

<style scoped>
.lead-scoring {
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

.score-circle {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.score-hot {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
}

.score-warm {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
}

.score-cold {
  background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
  color: white;
}

.score-value {
  font-size: 28px;
  font-weight: 700;
}

.score-label {
  font-size: 12px;
  opacity: 0.9;
}

.score-details {
  flex: 1;
}

.score-breakdown {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.score-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.score-item-label {
  width: 120px;
  font-size: 13px;
  color: #6b7280;
}

.score-item-bar {
  flex: 1;
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
}

.score-item-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.5s ease;
}

.score-item-fill.success { background: #10b981; }
.score-item-fill.warning { background: #f59e0b; }
.score-item-fill.info { background: #3b82f6; }

.score-item-value {
  width: 40px;
  font-size: 13px;
  font-weight: 500;
  color: #059669;
  text-align: right;
}

.score-recommendation {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
  padding: 12px;
  background: #f0f9ff;
  border-radius: 8px;
  color: #0369a1;
  font-size: 13px;
}
</style>
