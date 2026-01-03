<template lang="pug">
    .leads-sales.bg-white.rounded-2xl.p-6(class="min-h-[70vh]")
      .header.mb-4.flex.gap-2
        Icon.text-2xl.text-main(name="bx:line-chart")
        h2(class="text-xl font-bold text-neutral-800 mb-4") Information Dashboard 
        //- StatisticsHeader
      .cards.grid.grid-cols-4.gap-4.mb-4
        OperationsDailyTasksCard(:name="i.name" :data="i.value" :icon="i.icon" v-for="i in cardData")
      .pie-chart-line-increase.grid.grid-cols-12.gap-4
        .stat-card.p-6.col-span-6(v-loading="dailyTaskStatisticsLoading" class='h-[600px]')
          .flex.items-center.justify-between.mb-4
            h3(class="text-base font-semibold text-black") Project status
          v-chart.pie-chart(:option='pieChartTaskStatusPercentageOptions' autoresize)
        .stat-card.p-6.col-span-6(v-loading="dailyTaskStatisticsLoading" class='h-[600px]')
          .flex.items-center.justify-between.mb-4
            h3(class="text-base font-semibold text-black") Monthly revenue
          v-chart.bar-chart(:option='barChartMonthlyRevenueOptions' autoresize)
        .stat-card.p-6.col-span-6(v-loading="dailyTaskStatisticsLoading" class='h-[600px]')
          .flex.items-center.justify-between.mb-4
            h3(class="text-base font-semibold text-black") Distribution of projects according to clients
          v-chart.pie-chart(:option='pieChartTaskDistributionByClientOptions' autoresize)
        .stat-card.p-6.col-span-6(v-loading="dailyTaskStatisticsLoading" class='h-[600px]')
          .flex.items-center.justify-between.mb-4
            h3(class="text-base font-semibold text-black") Sales Representative Performance
          v-chart.bar-chart(:option='barChartSalesPerformanceOptions' autoresize)
    </template>

<script lang="ts" setup>
import VChart from "vue-echarts";

const colorpieChart = ["#3498db", "#2ecc71", "#f39c12"];
const colorbarChart = ["#3498db"];

const dailyTaskStats = ref(await getDailyTaskStatistics());

const cardData = ref([
  {
    name: "Active Projects",
    value: dailyTaskStats.value?.activeTasks,
    icon: { name: "fluent:task-list-ltr-24-filled", color: "#3498db" },
  },
  {
    name: "Completed Projects",
    value: dailyTaskStats.value?.completedTasks,
    icon: { name: "ic:round-task-alt", color: "#2ecc71" },
  },
  {
    name: "Granted Projects",
    value: dailyTaskStats.value?.grantedTasks,
    icon: { name: "material-symbols:award-star", color: "#f39c12" },
  },
  {
    name: "Total Revenue Projects",
    value: dailyTaskStats.value?.totalRevenue,
    icon: { name: "ic:sharp-monetization-on", color: "#27ae60" },
  },
]);

const barChartSalesPerformanceOptions = getBarChartWithLineData(
  dailyTaskStats.value?.salesPerformance,["Tasks count","Total paid"],
  colorbarChart
);
const barChartMonthlyRevenueOptions = getBarChartData(
  dailyTaskStats.value?.monthlyRevenue,
  colorbarChart
);
console.log(barChartSalesPerformanceOptions)
const pieChartTaskDistributionByClientOptions = getCenterPieChartsData(
  dailyTaskStats.value?.taskDistributionByClient,
  colorpieChart,
  ""
);

const pieChartTaskStatusPercentageOptions = getPieChartsData(
  dailyTaskStats.value?.taskStatusPercentage,
  colorpieChart
);
</script>
