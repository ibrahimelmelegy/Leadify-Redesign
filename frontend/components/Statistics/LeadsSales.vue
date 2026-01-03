<template lang="pug">
.leads-sales.bg-white.rounded-2xl.p-6
  .header.mb-4
    h2(class="text-xl font-bold text-neutral-800 mb-4") Leads & Sales Widgets
    //- StatisticsHeader

  .cards.grid.grid-cols-3.gap-4.mb-4
    StatisticsCard(:name="i.name" :data="i.value" v-for="i in leadStats.firstCards")

  .bar-chart-cards.grid.grid-cols-12.gap-4.mb-4
    el-card.p-6.col-span-8(v-loading="statsLoading" class='h-[400px]')
      .flex.items-center.justify-between.mb-4
        h3(class="text-base font-semibold text-black") Deals Pipeline Overview

        //- el-select(size="large" @change="setCardsFilter('custom')"  class="!w-[120px]" )
        //-   template(#prefix)
        //-     Icon.text-lg.text-main(name="solar:calendar-minimalistic-linear")
        //-   el-option(v-for="item in yearsFilterOptionTime" :key="item" :label="item.value" :value="item")

      v-chart.bar-chart(:option='barChartOptions' autoresize)

    .col-span-4.gap-y-4.grid
      StatisticsCard(:name="i.name" :data="i.value" v-for="i in leadStats.secondCards")

  .pie-chart-line-increase.grid.grid-cols-12.gap-4
    el-card.p-6.col-span-5(v-loading="statsLoading" class='h-[600px]')
      .flex.items-center.justify-between.mb-4
        h3(class="text-base font-semibold text-black") Opportunities by Stage

        //- el-select(size="large" @change="setCardsFilter('custom')"  class="!w-[120px]" )
        //-   template(#prefix)
        //-     Icon.text-lg.text-main(name="solar:calendar-minimalistic-linear")
        //-   el-option(v-for="item in yearsFilterOptionTime" :key="item" :label="item.value" :value="item")

      v-chart.pie-chart(:option='pieChartOptions' autoresize)

    el-card.p-6.col-span-7(v-loading="statsLoading" class="h-[600px]")
      .flex.items-center.justify-between.mb-4
        h3(class="text-base font-semibold text-black") Sales Performance Over Time

        //- el-select(size="large" @change="setCardsFilter('custom')"  class="!w-[120px]" )
        //-   template(#prefix)
        //-     Icon.text-lg.text-main(name="solar:calendar-minimalistic-linear")
        //-   el-option(v-for="item in yearsFilterOptionTime" :key="item" :label="item.value" :value="item")

      v-chart.line-chart(:option='lineChartOptions' autoresize)

</template>

<script lang="ts" setup>
  import VChart from "vue-echarts";

  const colorPalette = ["#7849ff", "#9360ff", "#9360ff"];

  const defaultStats = {
    firstCards: [],
    secondCards: [],
    dealsPipeline: {},
    opportunityStages: {},
    salesPerformance: [],
  };

  let fetchedStats = defaultStats;
  try {
    fetchedStats = await getLeadsStatics() || defaultStats;
  } catch (error) {
    console.error("Failed to load lead statistics:", error);
  }

  const leadStats = ref(fetchedStats);

  const barChartOptions = getBarChartData(leadStats.value?.dealsPipeline || {}, colorPalette);
  const pieChartOptions = getPieChartsData(leadStats.value?.opportunityStages || {}, colorPalette);
  const lineChartOptions = getIncreaseLineChart(leadStats.value?.salesPerformance || [], colorPalette);
</script>
