<template lang="pug">
OperationsManPowerForm( :loading="loading" @submit="submitForm")
  .flex.items-center.justify-between.mb-8
    .title.font-bold.text-2xl.mb-1.capitalize create Manpower
    .flex.items-center.gap-x-2
      el-button(   size='large' plain type="primary" class="w-full !rounded-2xl" @click="router.back()") Cancel
      el-button(   size='large' type="primary" native-type="submit" :loading="loading"  :disabled="loading" class="w-full !px-5 !rounded-2xl") Save

</template>

<script lang="ts" setup>
  useHead({
    title: "App HP Tech | Add Manpower",
  });
  definePageMeta({
    middleware: "permissions",
    permission: "CREATE_MANPOWER",
  });
  const router = useRouter();
  const loading = ref(false);
  async function submitForm(values: ManpowerValues) {
    loading.value = true;
    await createManpower(values);
    loading.value = false;
  }
</script>

<style lang="scss"></style>
