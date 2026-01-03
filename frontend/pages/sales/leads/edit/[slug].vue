<template lang="pug">
LeadsForm( :loading="loading" @submit="submitForm" :data="lead")
  .flex.items-center.justify-between.mb-8
    .title.font-bold.text-2xl.mb-1.capitalize Edit Lead
    .flex.items-center.gap-x-2
      el-button(   size='large' plain type="primary" class="w-full !rounded-2xl" @click="router.back()") Cancel
      el-button(   size='large' type="primary" native-type="submit" :loading="loading"  :disabled="loading" class="w-full !px-5 !rounded-2xl") Update

</template>

<script lang="ts" setup>
  useHead({
    title: "App HP Tech | Edit Lead",
  });
  definePageMeta({
    middleware: "permissions",
    permission: "EDIT_LEADS",
  });
  const router = useRouter();
  const route = useRoute();
  const loading = ref(false);

  // Call API to Get the lead
  const lead = await getLead(route.params.slug);

  // Call API to update the lead
  async function submitForm(values: LeadValues) {
    loading.value = true;
    await updateLead({ ...values, id: route.params.slug });
    loading.value = false;
  }
</script>

<style lang="scss"></style>
