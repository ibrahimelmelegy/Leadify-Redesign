<template lang="pug">
el-dialog.manpower-module(v-model='dialog' width='750' align-center='' title="Add New Manpower Module" append-to-body destroy-on-close)
  OperationsManPowerForm.border-t.pt-4( :loading="loading" @submit="submitForm" is-modal :data="manpower")
    template(#modal-footer)
        .dialog-footer.mt-8
            .flex.justify-end
                el-button(  class="!rounded-2xl" @click='dialog = false' size="large"   ) Cancel
                el-button(class="!rounded-2xl" type='primary' native-type="submit" size="large" :loading="loading") {{ manpower?.id ? 'Update' : 'Save' }}

</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, defineModel } from 'vue';
const props = defineProps({
  title: String,
  descriptionOne: String,
  descriptionTwo: String,
  loading: Boolean,
  icon: String,
  btnText: String,
  label: String,
  manpower: Object as () => ManpowerValues,
});
const emit = defineEmits(['confirm', 'submit']);
const dialog = defineModel();

const loading = ref(false);
async function submitForm(values: ManpowerValues) {
  loading.value = true;
  let response;
  if (props.manpower?.id) {
    response = await updateManpower({ ...values, manpowerId: props.manpower.id }, false);
  } else {
    response = await createManpower(values, false);
  }
  loading.value = false;
  if (response) {
    emit('confirm');
    dialog.value = false;
  }
}
</script>
