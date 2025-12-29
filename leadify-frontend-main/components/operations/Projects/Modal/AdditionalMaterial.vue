<template lang="pug">
el-dialog(v-model='dialog' width='750' title="Add New Additional Material Category" append-to-body align-center='')
  OperationsMaterialCategory.border-t.pt-4(ref="categoryRef" @onSubmit="submitCategoryForm" :name="material.name" :key="material")
  OperationsMaterialCategoryItem(ref="categoryItemRef" @onSubmit="submitCategoryItemForm" :items="material.materialItem" :key="material")
  template(#footer='')
      .dialog-footer
          .flex.mt-4.justify-end
              el-button(  class="!rounded-2xl" @click='dialog = false' size="large"   ) Cancel
              el-button(class="!rounded-2xl" type='primary' @click='onSubmitMaterials' size="large" :loading="loading") Add
</template>

<script setup lang="ts">
const loading = ref(false);
const categoryRef = ref();
const categoryItemRef = ref();

const finalValues = ref<AdditionalMaterial>({
  name: '',
  items: [],
});

const props = defineProps({
  material: {
    type: Object,
    default: () => ({}),
  },
});
const emit = defineEmits(['confirm']);
const dialog = defineModel();
async function submitCategoryForm(values: any) {
  finalValues.value = { ...finalValues.value, ...values };
}

async function submitCategoryItemForm(values: any) {
  finalValues.value['items'] = [...values];
}
async function onSubmitMaterials() {
  //  reset values
  finalValues.value = {} as AdditionalMaterial;
  try {
    loading.value = true;
    let response;
    await categoryRef.value.onSubmit();
    await categoryItemRef.value.onSubmitCategoryItems();
    if (!finalValues.value?.name || !finalValues.value?.items || !finalValues.value?.items?.length) return;
    if (props.material?.id) {
      response = await updateAdditionalMaterial({ ...finalValues.value, materialId: props.material.id }, false);
    } else {
      response = await createAdditionalMaterial(finalValues.value, false);
    }
    emit('confirm', response?.id);
    if (Object.keys(response).length) dialog.value = false;
    loading.value = false;
  } catch (error) {
    console.log('Error saving forms:', error);
    loading.value = false;
  } finally {
    loading.value = false;
  }
}
</script>
