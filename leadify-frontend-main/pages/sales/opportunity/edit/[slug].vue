<template lang="pug">
OpportunityForm( :loading="loading" @submit="submitForm" :data="opportunity" editMode)
  .flex.items-center.justify-between.mb-8
    .title.font-bold.text-2xl.mb-1.capitalize Edit Opportunity
    .flex.items-center.gap-x-2
      el-button(   size='large' plain type="primary" class="w-full !rounded-2xl" @click="router.back()") Cancel
      el-button(   size='large' type="primary" native-type="submit" :loading="loading"  :disabled="loading" class="w-full !px-5 !rounded-2xl") Update

</template>

<script lang="ts" setup>
  useHead({
    title: "App HP Tech | Edit Opportunity",
  });

  definePageMeta({
    middleware: "permissions",
    permission: "EDIT_OPPORTUNITIES",
  });

  const router = useRouter();
  const route = useRoute();
  const loading = ref(false);

  // Call API to Get the opportunity
  const opportunity = await getOpportunity(route.params.slug);

  // Call API to update the opportunity
  async function submitForm(values: FormattedValues) {
    loading.value = true;
    await updateOpportunity(values.opportunity, route.params.slug);
    loading.value = false;
  }
</script>

<style lang="scss"></style>
