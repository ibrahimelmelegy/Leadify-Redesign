<template lang="pug">
OperationsAssetForm( :loading="loading" @submit="submitForm" :data="asset")
  .flex.items-center.justify-between.mb-8
    .title.font-bold.text-2xl.mb-1.capitalize Edit Asset
    .flex.items-center.gap-x-2
      el-button(   size='large' plain type="primary" class="w-full !rounded-2xl" @click="router.back()") Cancel
      el-button(   size='large' type="primary" native-type="submit" :loading="loading"  :disabled="loading" class="w-full !px-5 !rounded-2xl") Save

</template>

<script lang="ts" setup>
  useHead({
    title: "App HP Tech | Edit Asset",
  });
  definePageMeta({
    middleware: "permissions",
    permission: "EDIT_ASSETS",
  });
  const router = useRouter();
  const route = useRoute();
  const loading = ref(false);
  const asset = await getAsset(route.params.slug);

  async function submitForm(values: Asset) {
    loading.value = true;
    await updateAsset({ ...values, id: route.params.slug });
    loading.value = false;
  }
</script>

<style lang="scss"></style>
