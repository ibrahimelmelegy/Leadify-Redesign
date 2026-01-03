<template lang="pug">
el-dialog(v-model='dialog' width='800' title="Add New Manpower Row" align-center=''  destroy-on-close)
  OperationsProjectsFormManPower(v-model="addNewManPower" :loading="loading" @submit="confirm" is-modal :data="manpower" :is-new="isNewlyAdded" :manpowerOptions="manpowerOptions" :key="isNewlyAdded")
    template(#modal-footer)
        .dialog-footer.mt-8
            .flex.justify-end
                el-button(  class="!rounded-2xl" @click='dialog = false' size="large"   ) Cancel
                el-button(class="!rounded-2xl" type='primary' native-type="submit" size="large" :loading="loading") {{ manpower?.id ? 'Update' : 'Save' }}
  OperationsProjectsModalManpowerModule(v-model="addNewManPower"  @confirm="updateManpower")
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { Plus } from '@element-plus/icons-vue';
import { ref, defineProps, defineEmits, defineModel } from 'vue';
const props = defineProps({
  title: String,
  descriptionOne: String,
  descriptionTwo: String,
  loading: Boolean,
  icon: String,
  btnText: String,
  data: Object,
  manpower: Object as () => ProjectManpower,
});
const emit = defineEmits(['confirm', 'submit']);
const dialog = defineModel();
const confirm = () => {
  emit('confirm');
  dialog.value = false;
};
const addNewManPower = ref(false);
const manPowers = ref<ManpowerValues[]>([]);
const manpowerOptions = ref<{ label: string; value: string }[]>([]);
const isNewlyAdded = ref(false);
/**
 * Maps an array of manpowers into a format suitable for a select input.
 */
function mapManpowers(data: ManpowerValues[] = []): { label: string; value: string }[] {
  return data.map(({ name, id }) => ({ label: name, value: id }));
}
/**
 * Fetches the list of manpowers from the API and updates the select input with the results.
 */
async function fetchManpowers() {
  const response = await useTableFilter('manpower');
  manPowers.value = response?.formattedData || [];
  manpowerOptions.value = mapManpowers(manPowers.value);
}

async function updateManpower() {
  await fetchManpowers();
  isNewlyAdded.value = true;
}
await fetchManpowers();
</script>
