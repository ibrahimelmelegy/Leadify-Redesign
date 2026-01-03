<template lang="pug">
.title.font-bold.text-2xl.mb-1.capitalize.mb-8 Edit Projects
el-steps(
  style="min-width: 100%"
  :space="500"
  :active="activeStep"
  align-center
)
  el-step(title="Project Info")
  el-step(title="Vehicles")
  el-step(title="Manpower")
  el-step(title="Materials")
  el-step(title="Assets")
OperationsProjectsInfo.mt-6(v-model="activeStep" :loading="loading" @submit="submitForm" v-if="activeStep === 0")
OperationsProjectsVehicles.mt-6(v-model="activeStep" :loading="loading" @submit="submitForm" v-if="activeStep === 1")
OperationsProjectsManpower.mt-6(v-model="activeStep" :loading="loading" @submit="submitForm" v-if="activeStep === 2")
OperationsProjectsMaterials.mt-6(v-model="activeStep" :loading="loading" @submit="submitForm" v-if="activeStep === 3")
OperationsProjectsAssets.mt-6(v-model="activeStep" :loading="loading" @submit="submitForm" v-if="activeStep === 4")
</template>

<script lang="ts" setup>
  useHead({
    title: "App HP Tech | Edit Projects",
  });
  definePageMeta({
    middleware: "permissions",
    permission: "EDIT_PROJECTS",
  });
  const activeStep = ref<number>(0);
  const loading = ref(false);
  const isFinished = ref(false);

  await fetchExistingProject();
</script>

<style lang="scss"></style>
