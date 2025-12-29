<template lang="pug">
OpportunityForm( :loading="loading" @submit="submitForm" @leadId="(value)=>  leadId = value" :editMode="route.query.leadId")
  .flex.items-center.justify-between.mb-8
    .title.font-bold.text-2xl.mb-1.capitalize create Opportunity
    .flex.items-center.gap-x-2
      el-button(   size='large' plain type="primary" class="w-full !rounded-2xl" @click="router.back()") Cancel
      el-button(   size='large' type="primary" native-type="submit" :loading="loading"  :disabled="loading" class="w-full !px-5 !rounded-2xl") Save

</template>

<script lang="ts" setup>
  useHead({
    title: "App HP Tech | Add Opportunity",
  });

  definePageMeta({
    middleware: "permissions",
    permission: "CREATE_OPPORTUNITIES",
  });

  const router = useRouter();
  const route = useRoute();
  const loading = ref(false);
  const leadId = ref("");
  async function submitForm(values: FormattedValues) {
    loading.value = true;
    if (values?.clientId) {
      await createOpportunity(values);
    } else if (route.query.leadId || leadId.value) {
      await convertLeadToOpportunity({
        ...values.opportunity,
        ...((route.query.leadId || leadId.value) && { leadId: route.query.leadId || leadId.value }),
        ...(values.clientId && { clientId: values.clientId }),
      });
    } else {
      await createOpportunity(values);
    }
    loading.value = false;
  }
</script>

<style lang="scss"></style>
