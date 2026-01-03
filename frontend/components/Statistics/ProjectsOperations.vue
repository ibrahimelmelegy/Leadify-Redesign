<template lang="pug">
  .projects-operations.bg-white.rounded-2xl.p-6
    .header.mb-4
      h2(class="text-xl font-bold text-neutral-800 mb-4") Projects & Operations Widgets
      //- StatisticsHeader

    .cards.grid.grid-cols-2.gap-4.mb-4
      StatisticsCard(:name="i.name" :data="i.value" v-for="i in projectStats.firstCards")

    .bar-horizontal-chart.mb-4
      el-card.p-6.col-span-8(v-loading="loading" class='h-[400px]')
        h3(class="text-base font-semibold text-black") Projects by Status
        v-chart.bar-chart(:option='barChartOptions' autoresize)
    //- .bar-chart-cards.grid.grid-cols-12.gap-4.mb-4
    //-   el-card.p-6.col-span-9(v-loading="statsLoading" class='h-400px]')
    //-     h3(class="text-base font-semibold text-black") Projects by Status
    //-     v-chart.bar-chart(:option='barChartOptions' autoresize)
    //-   .col-span-3.gap-y-4.grid
    //-     StatisticsCard(:name="i.name" :data="i.value" v-for="i in projectStats.secondCards")
    //- .pie-chart.grid.grid-cols-2.gap-4
    //-   el-card.p-6(v-loading="loading" class='h-[600px]')
    //-     .flex.items-center.justify-between.mb-4
    //-       h3(class="text-base font-semibold text-black") Manpower Resource Allocation

    //-       //- el-select(size="large" @change="setCardsFilter('custom')"  class="!w-[120px]" )
    //-       //-   template(#prefix)
    //-       //-     Icon.text-lg.text-main(name="solar:calendar-minimalistic-linear")
    //-       //-   el-option(v-for="item in yearsFilterOptionTime" :key="item" :label="item.value" :value="item")

    //-     v-chart.pie-chart(:option='pieChartOptions' autoresize)

    //-   el-card.p-6(v-loading="loading" class='h-[600px]')
    //-     .flex.items-center.justify-between.mb-4
    //-       h3(class="text-base font-semibold text-black") Manpower Resource Allocation

    //-       //- el-select(size="large" @change="setCardsFilter('custom')"  class="!w-[120px]" )
    //-       //-   template(#prefix)
    //-       //-     Icon.text-lg.text-main(name="solar:calendar-minimalistic-linear")
    //-       //-   el-option(v-for="item in yearsFilterOptionTime" :key="item" :label="item.value" :value="item")

    //-     v-chart.pie-chart(:option='pieChartOptions' autoresize)
    .pie-chart.grid.grid-cols-2.gap-4
      el-card.p-6(v-loading="loading" class='h-[600px]')
        .flex.items-center.justify-between.mb-4
          h3(class="text-base font-semibold text-black") {{projectStats?.pieChart_one?.title}}

        v-chart.pie-chart(:option='getPieChartsData(projectStats?.pieChart_one?.options, colorPalette)' autoresize)

      el-card.p-6(v-loading="loading" class='h-[600px]')
        .flex.items-center.justify-between.mb-4
          h3(class="text-base font-semibold text-black") {{projectStats?.pieChart_two?.title}}

        v-chart.pie-chart(:option='getPieChartsData(projectStats?.pieChart_two?.options, colorPalette)' autoresize)

</template>

<script lang="ts" setup>
  import VChart from "vue-echarts";

  // fake data
  const colorPalette = ["#7849ff", "#9360ff", "#9360ff"];

  const projectStats = ref(await getProjectOperationsStatics());

  const barChartOptions = getBarHorizontalChartData(projectStats.value?.projectsByStatus, colorPalette);
</script>
