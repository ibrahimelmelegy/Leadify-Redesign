<template lang="pug">
.activity-chart
  .chart-header
    h3.chart-title {{ title }}
    el-select(v-model="period" size="small" style="width: 120px")
      el-option(label="Last 7 Days" value="7")
      el-option(label="Last 30 Days" value="30")
      el-option(label="Last 90 Days" value="90")
  .chart-container
    canvas(ref="chartCanvas")
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';

const props = defineProps<{
  title: string;
  data: { label: string; value: number }[];
  color?: string;
}>();

const chartCanvas = ref<HTMLCanvasElement | null>(null);
const period = ref('7');

onMounted(() => {
  drawChart();
});

watch(() => props.data, () => {
  drawChart();
}, { deep: true });

function drawChart() {
  if (!chartCanvas.value) return;
  
  const canvas = chartCanvas.value;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);

  const width = rect.width;
  const height = rect.height;
  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  ctx.clearRect(0, 0, width, height);

  const data = props.data;
  if (!data.length) return;

  const maxValue = Math.max(...data.map(d => d.value)) * 1.2;
  const barWidth = chartWidth / data.length - 10;

  ctx.fillStyle = props.color || '#667eea';
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1;

  ctx.beginPath();
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, height - padding);
  ctx.lineTo(width - padding, height - padding);
  ctx.stroke();

  data.forEach((item, index) => {
    const x = padding + index * (chartWidth / data.length) + 5;
    const barHeight = (item.value / maxValue) * chartHeight;
    const y = height - padding - barHeight;

    const gradient = ctx.createLinearGradient(x, y, x, height - padding);
    gradient.addColorStop(0, props.color || '#667eea');
    gradient.addColorStop(1, '#a78bfa');
    ctx.fillStyle = gradient;

    ctx.beginPath();
    ctx.roundRect(x, y, barWidth, barHeight, 4);
    ctx.fill();

    ctx.fillStyle = '#64748b';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(item.label, x + barWidth / 2, height - padding + 15);
  });
}
</script>

<style scoped>
.activity-chart {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.chart-title {
  font-size: 16px;
  font-weight: 600;
  color: #1a202c;
  margin: 0;
}

.chart-container {
  height: 250px;
}

.chart-container canvas {
  width: 100%;
  height: 100%;
}

:deep(.dark) .activity-chart {
  background: #1e293b;
}

:deep(.dark) .chart-title {
  color: #f1f5f9;
}
</style>
