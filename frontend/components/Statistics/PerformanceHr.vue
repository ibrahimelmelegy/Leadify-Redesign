<template lang="pug">
  .projects-operations.bg-white.rounded-2xl.p-6
    .header.mb-4
      h2(class="text-xl font-bold text-neutral-800 mb-4") Performance & HR Widgets
      //- StatisticsHeader

    .cards.grid.grid-cols-3.gap-4.mb-4
      StatisticsCard(:name="i.name" :data="i.value" v-for="i in preformanceStats.firstCards")
</template>

<script lang="ts" setup>
  import VChart from "vue-echarts";

  // fake data
  const colorPalette = ["#7849ff", "#9360ff", "#9360ff"];

  const preformanceStats = ref(await getPerformanceStatics());

  // const barChartOptions = getBarHorizontalChartData(bussinesStats.value?.projectsByStatus, colorPalette);
  // const pieChartOptions = getPieChartsData(dummyBarChartData, colorPalette);
</script>
