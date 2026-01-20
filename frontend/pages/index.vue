<template lang="pug">
.statistics
  el-tabs.w-full(v-model='selectedTab' @tab-change="tabChange")

    el-tab-pane(label='Leads & Sales' name='leadsSales')
      Suspense(v-if="selectedTab === 'leadsSales'")
        template(#default)
          LazyStatisticsLeadsSales
        template(#fallback)
          .flex.justify-center.items-center.py-20
            el-skeleton(:rows="5" animated)

    el-tab-pane(label='Projects & Operations' name='projectsOperations')
      Suspense(v-if="selectedTab === 'projectsOperations'")
        template(#default)
          LazyStatisticsProjectsOperations
        template(#fallback)
          .flex.justify-center.items-center.py-20
            el-skeleton(:rows="5" animated)

    el-tab-pane(label='Financial & Business Metrics' name='financialBusinessMetrics')
      Suspense(v-if="selectedTab === 'financialBusinessMetrics'")
        template(#default)
          LazyStatisticsFinancialBusinessMetrics
        template(#fallback)
          .flex.justify-center.items-center.py-20
            el-skeleton(:rows="5" animated)

    el-tab-pane(label='Performance & HR' name='performanceHr')
      Suspense(v-if="selectedTab === 'performanceHr'")
        template(#default)
          LazyStatisticsPerformanceHr
        template(#fallback)
          .flex.justify-center.items-center.py-20
            el-skeleton(:rows="5" animated)
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
