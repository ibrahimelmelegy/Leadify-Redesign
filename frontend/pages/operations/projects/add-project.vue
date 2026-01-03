<template lang="pug">
.title.font-bold.text-2xl.mb-1.capitalize.mb-8 Create Projects
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
  el-step(title="Preview")
OperationsProjectsInfo.mt-6(v-model="activeStep" :loading="loading" @submit="submitForm" @cancel="isCanceling = true" v-if="activeStep === 0")
OperationsProjectsVehicles.mt-6(v-model="activeStep" :loading="loading" @submit="submitForm"  @cancel="isCanceling = true" v-if="activeStep === 1")
OperationsProjectsManpower.mt-6(v-model="activeStep" :loading="loading" @submit="submitForm"  @cancel="isCanceling = true" v-if="activeStep === 2")
OperationsProjectsMaterials.mt-6(v-model="activeStep" :loading="loading" @submit="submitForm"  @cancel="isCanceling = true" v-if="activeStep === 3")
OperationsProjectsAssets.mt-6(v-model="activeStep" :loading="loading" @submit="submitForm"  @cancel="isCanceling = true" v-if="activeStep === 4")
OperationsProjectsPreview.mt-6(v-model="activeStep" @onFinish="confirmCompeleteForm" :loading="loading"  @cancel="isCanceling = true" v-if="activeStep === 5")
ActionModel(v-model="isFinished" v-if="isFinished" @confirm="submitForm" :loading="loading" title="Are you sure you want to confirm Project Creation ?" description="you wants to proceed without making any further changes." )
ActionModel(v-model="isCanceling" v-if="isCanceling" @confirm="submitCancel" :loading="loading" title="Are you sure you want to cancel Project Creation ?" description="you wants to cancel the project creation." icon="/images/delete-image.png" )
</template>

<script lang="ts" setup>
  useHead({
    title: "App HP Tech | Add Projects",
  });
  definePageMeta({
    middleware: "permissions",
    permission: "CREATE_PROJECTS",
  });
  const router = useRouter();
  const activeStep = ref<number>(0);
  const loading = ref(false);
  const isFinished = ref(false);
  const isCanceling = ref(false);
  const values = ref<any>({});
  const finalvalues = ref<any>({});

  await fetchExistingProject();
  activeStep.value = project.value?.step ? project.value.step - 1 : 0;
  async function submitForm() {
    loading.value = true;
    await completeProject(values.value);
    loading.value = false;
  }

  async function submitCancel() {
    loading.value = true;
    await deleteProject();
    loading.value = false;
  }

  function confirmCompeleteForm(val: any) {
    isFinished.value = true;
    values.value = val;
  }
</script>

<style lang="scss"></style>
