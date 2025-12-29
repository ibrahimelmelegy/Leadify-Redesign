<template lang="pug">
  StaffForm(:loading="loading" @submit="submitForm" :data="staff" editMode)
    .flex.items-center.justify-between.mb-8
      .title.font-bold.text-2xl.mb-1.capitalize Edit Staff Profiles
      .flex.items-center.gap-x-2
        el-button(size='large' plain type="primary" class="w-full !rounded-2xl" @click="router.back()") Cancel
        el-button(size='large' type="primary" native-type="submit" :loading="loading"  :disabled="loading" class="w-full !px-5 !rounded-2xl") Update

</template>

<script lang="ts" setup>
  useHead({
    title: "App HP Tech | Edit Staff",
  });
  definePageMeta({
    middleware: "permissions",
    permission: "EDIT_STAFF",
  });
  const router = useRouter();
  const route = useRoute();
  const loading = ref(false);

  // Call API to Get the Staff
  const staff = await getStaff(route.params.slug);

  async function submitForm(values: Staff) {
    loading.value = true;
    await updateStaff({ ...values, id: route.params.slug as string });
    loading.value = false;
  }
</script>

<style lang="scss"></style>
