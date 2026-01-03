<template lang="pug">
el-dialog(v-model='dialog' width='800' align-center='' title="Add New Vehicle" destroy-on-close	)
  OperationsVehicleForm.border-t.pt-4( :loading="loading" @submit="submitForm" :data="vehicle" is-modal)
    template(#modal-footer)
        .dialog-footer.mt-8
            .flex.justify-end
                el-button(  class="!rounded-2xl" @click='dialog = false' size="large"   ) Cancel
                el-button(class="!rounded-2xl" type='primary' native-type="submit" size="large" :loading="loading") {{ vehicle?.id ? 'Update' : 'Save' }}

</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, defineModel } from 'vue';
const props = defineProps({
  title: String,
  descriptionOne: String,
  descriptionTwo: String,
  icon: String,
  btnText: String,
  vehicle: Object as () => Vehicle,
});
const emit = defineEmits(['confirm', 'submit']);

const dialog = defineModel();

const loading = ref(false);
async function submitForm(values: Vehicle) {
  loading.value = true;
  let response;
  if (props.vehicle?.id) {
    response = await updateVehicle({ ...values, vehicleId: props.vehicle.id }, false);
    emit('confirm', response?.id, true);
  } else {
    response = await createVehicle(values, false);
    emit('confirm', response?.id);
  }
  loading.value = false;
  if (Object.keys(response).length) dialog.value = false;
}
</script>
