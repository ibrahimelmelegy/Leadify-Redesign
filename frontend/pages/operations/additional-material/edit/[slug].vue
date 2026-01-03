<template lang="pug">
.flex.items-center.justify-between.mb-8
  .title.font-bold.text-2xl.mb-1.capitalize Edit Additional Material
  .flex.items-center.gap-x-2
    el-button(size='large' plain type="primary" class="w-full !rounded-2xl" @click="router.back()") Cancel
    el-button(size='large' type="primary" native-type="submit" :loading="loading" :disabled="loading" class="w-full !px-5 !rounded-2xl" @click="onSubmitMaterials") Save

.card.m-auto.bg-white.p-10.rounded-3xl(class="2xl:w-1/2 w-[90%]")
  OperationsMaterialCategory(ref="categoryRef" @onSubmit="submitCategoryForm" :name="material.name")
  OperationsMaterialCategoryItem(ref="categoryItemRef" @onSubmit="submitCategoryItemForm" :items="material.materialItem" edit-mode)

</template>

<script lang="ts" setup>
  useHead({
    title: "App HP Tech | Edit Material",
  });
  definePageMeta({
    middleware: "permissions",
    permission: "EDIT_ADDITIONAL_MATERIAL",
  });
  const router = useRouter();
  const route = useRoute();
  const loading = ref(false);
  const categoryRef = ref();
  const categoryItemRef = ref();
  const material = await getAdditionalMaterial(route.params.slug);

  const finalValues = ref<AdditionalMaterial>({
    name: "",
    items: [],
  });

  async function submitCategoryForm(values: any) {
    finalValues.value = { ...finalValues.value, ...values };
  }

  async function submitCategoryItemForm(values: any) {
    finalValues.value["items"] = [...values];
  }
  async function onSubmitMaterials() {
    //  reset values
    finalValues.value = {} as AdditionalMaterial;
    try {
      loading.value = true;
      await categoryRef.value.onSubmit();
      await categoryItemRef.value.onSubmitCategoryItems();
      if (!finalValues.value?.name || !finalValues.value?.items || !finalValues.value?.items?.length) return;
      await updateAdditionalMaterial({ ...finalValues.value, materialId: +route.params.slug });
      loading.value = false;
    } catch (error) {
      console.log("Error saving forms:", error);
      loading.value = false;
    } finally {
      loading.value = false;
    }
  }
</script>

<style lang="scss"></style>
