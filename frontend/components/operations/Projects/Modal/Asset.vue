<template lang="pug">
el-dialog(v-model='dialog' width='800' align-center='' title="Add New Assets Module" destroy-on-close)
  OperationsAssetForm.border-t.pt-4( :loading="loading" @submit="submitForm" :data="asset" is-modal)
    template(#modal-footer)
        .dialog-footer.mt-8
            .flex.justify-end
                el-button(  class="!rounded-2xl" @click='dialog = false' size="large"   ) Cancel
                el-button(class="!rounded-2xl" type='primary' native-type="submit" size="large" :loading="loading") {{ asset?.id ? 'Update' : 'Save' }}

</template>

<script setup lang="ts">
const props = defineProps({
  title: String,
  descriptionOne: String,
  descriptionTwo: String,
  icon: String,
  btnText: String,
  asset: Object as () => Asset,
});
const emit = defineEmits(['confirm', 'submit']);
const dialog = defineModel();

const loading = ref(false);
async function submitForm(values: Asset) {
  let response;
  loading.value = true;
  if (props.asset?.id) {
    response = await updateAsset({ ...values, id: props.asset.id }, false);
    emit('confirm', response?.id, true);
  } else {
    response = await createAsset(values, false);
    emit('confirm', response?.id);
  }
  loading.value = false;
  if (Object.keys(response).length) dialog.value = false;
}
</script>
