<template lang="pug">
ClientForm( :loading="loading" @submit="submitForm" :data="client" editMode)
  .flex.items-center.justify-between.mb-8
    .title.font-bold.text-2xl.mb-1.capitalize Edit Client
    .flex.items-center.gap-x-2
      el-button(   size='large' plain type="primary" class="w-full !rounded-2xl" @click="router.back()") Cancel
      el-button(   size='large' type="primary" native-type="submit" :loading="loading"  :disabled="loading" class="w-full !px-5 !rounded-2xl") Update

</template>

<script lang="ts" setup>
  useHead({
    title: "App HP Tech | Edit Client",
  });
  definePageMeta({
    middleware: "permissions",
    permission: "EDIT_CLIENTS",
  });
  const router = useRouter();
  const route = useRoute();
  const loading = ref(false);

  const client = await getClient(route.params.slug);
  async function submitForm(values: FormattedValues) {
    loading.value = true;
    await updateClient({ ...values, id: route.params.slug });
    loading.value = false;
  }
</script>

<style lang="scss"></style>
