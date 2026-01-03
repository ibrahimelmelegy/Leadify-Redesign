<template lang="pug">
    OperationsDailyTasksForm( :loading="loading" @submit="submitForm" :data="dailyTask")
      .flex.items-center.justify-between.mb-8
        .title.font-bold.text-2xl.mb-1.capitalize Edit Daily Task
        .flex.items-center.gap-x-2
          el-button(   size='large' plain type="primary" class="w-full !rounded-2xl" @click="router.back()") Cancel
          el-button(   size='large' type="primary" native-type="submit" :loading="loading"  :disabled="loading" class="w-full !px-5 !rounded-2xl") Save
    
    </template>
    
    <script lang="ts" setup>
    useHead({
      title: 'App HP Tech | Edit Daily task',
    });
    const router = useRouter();
    const route = useRoute();
    const loading = ref(false);
    const dailyTask = await getDailyTask(route.params.slug);
    
    async function submitForm(values: DailyTask) {
      loading.value = true;
      await updateDailyTask({ ...values} ,route.params.slug);
      loading.value = false;
    }
    </script>
    
    <style lang="scss"></style>
    