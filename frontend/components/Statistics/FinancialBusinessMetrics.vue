<template lang="pug">
  .projects-operations.bg-white.rounded-2xl.p-6
    .header.mb-4
      h2(class="text-xl font-bold text-neutral-800 mb-4") Financial & Business Metrics Widgets
      //- StatisticsHeader

    .cards.grid.grid-cols-3.gap-4.mb-4
      StatisticsCard(:name="i.name" :data="i.value" v-for="i in bussinesStats.firstCards")
</template>

<script lang="ts" setup>
  import VChart from "vue-echarts";

  const colorPalette = ["#7849ff", "#9360ff", "#9360ff"];

  const defaultStats = {
    firstCards: [],
  };

  let fetchedStats = defaultStats;
  try {
    fetchedStats = await getBussinesStatics() || defaultStats;
  } catch (error) {
    console.error("Failed to load business statistics:", error);
  }

  const bussinesStats = ref(fetchedStats);
</script>
