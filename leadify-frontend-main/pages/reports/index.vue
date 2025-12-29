<template lang="pug">
.flex.items-center.justify-between.mb-5.mt-5
  .title.font-bold.text-2xl.mb-1.capitalize Reports
el-tabs.demo-tabs(v-model="activeName", @tab-click="handleClick")
  el-tab-pane(label="Sales", name="sales")
    ReportSalesFilter(:user ="user")
  el-tab-pane(label="Projects", name="projects")
    ReportProjectsFilter(:user ="user")
  el-tab-pane(label="Performance ", name="performance ")
    ReportPerformanceFilter(:user ="user")
</template>

<script setup lang="ts">
const activeName = ref('sales');
const user = ref()

const response = await useApiFetch('auth/me');
user.value = response?.user;

</script>
