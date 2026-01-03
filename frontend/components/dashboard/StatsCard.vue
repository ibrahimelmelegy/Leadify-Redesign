<template lang="pug">
.stats-card(:class="colorClass")
  .stats-icon
    el-icon(:size="32")
      component(:is="icon")
  .stats-content
    .stats-value {{ formatValue(value) }}
    .stats-label {{ label }}
  .stats-trend(v-if="trend !== undefined" :class="trendClass")
    el-icon(:size="14")
      ArrowUp(v-if="trend > 0")
      ArrowDown(v-else-if="trend < 0")
    span {{ Math.abs(trend) }}%
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ArrowUp, ArrowDown } from '@element-plus/icons-vue';

const props = defineProps<{
  value: number;
  label: string;
  icon: any;
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  trend?: number;
  format?: 'number' | 'currency' | 'percentage';
}>();

const colorClass = computed(() => `stats-${props.color || 'primary'}`);

const trendClass = computed(() => {
  if (!props.trend) return '';
  return props.trend > 0 ? 'trend-up' : 'trend-down';
});

function formatValue(val: number): string {
  if (props.format === 'currency') {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  }
  if (props.format === 'percentage') {
    return `${val}%`;
  }
  return new Intl.NumberFormat('en-US').format(val);
}
</script>

<style scoped>
.stats-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s, box-shadow 0.2s;
}

.stats-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.stats-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.stats-primary .stats-icon { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.stats-success .stats-icon { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); }
.stats-warning .stats-icon { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
.stats-danger .stats-icon { background: linear-gradient(135deg, #eb3349 0%, #f45c43 100%); }
.stats-info .stats-icon { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }

.stats-content {
  flex: 1;
}

.stats-value {
  font-size: 24px;
  font-weight: 700;
  color: #1a202c;
}

.stats-label {
  font-size: 14px;
  color: #718096;
  margin-top: 4px;
}

.stats-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  font-weight: 500;
  padding: 4px 8px;
  border-radius: 6px;
}

.trend-up {
  color: #10b981;
  background: #d1fae5;
}

.trend-down {
  color: #ef4444;
  background: #fee2e2;
}

:deep(.dark) .stats-card {
  background: #1e293b;
}

:deep(.dark) .stats-value {
  color: #f1f5f9;
}

:deep(.dark) .stats-label {
  color: #94a3b8;
}
</style>
