<template lang="pug">
.statistics
  el-tabs.w-full(v-model='selectedTab' @tab-change="tabChange")

    el-tab-pane(label='Leads & Sales' name='leadsSales')
      StatisticsLeadsSales(v-if="selectedTab === 'leadsSales'")

    el-tab-pane(label='Projects & Operations' name='projectsOperations')
      StatisticsProjectsOperations(v-if="selectedTab === 'projectsOperations'")

    el-tab-pane(label='Financial & Business Metrics' name='financialBusinessMetrics')
      StatisticsFinancialBusinessMetrics(v-if="selectedTab === 'financialBusinessMetrics'")

    el-tab-pane(label='Performance & HR' name='performanceHr')
      StatisticsPerformanceHr(v-if="selectedTab === 'performanceHr'")
</template>

<script setup lang="ts">
  const route = useRoute();
  const router = useRouter();
  const selectedTab = ref("leadsSales");

  function tabChange(tab: string) {
    selectedTab.value = tab;
    router.push({
      path: "",
      query: { tab: selectedTab.value },
    });
  }

  selectedTab.value = (route.query?.tab as string) || "leadsSales";
</script>
