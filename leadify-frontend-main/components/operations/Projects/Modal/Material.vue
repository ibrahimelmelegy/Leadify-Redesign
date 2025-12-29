<template lang="pug">
el-dialog(v-model='dialog' width='800' align-center='' :class="{ 'material': isAdditionalMaterial || isAdditionalService}" title="Create Material New Row")
  el-form.border-t.pt-4(  autocomplete="off"   @submit.prevent='onSubmit'   ref="myForm" label-position="top"  :validationSchema="formSchema" )
    InputText.mt-4(label="Description"  placeholder="Enter Description" name="description" :value="data?.description" )
    .grid.grid-cols-2.gap-3
      InputText.mt-4(label="Material Quantity" type="number"  placeholder="Enter Material Quantity" name="quantity" :value="data?.quantity" )
      InputText.mt-4(label="Material Unit Price"  placeholder="Enter Material Unit Price" name="unitPrice" :value="data?.unitPrice" )
    .bg-neutral-50.p-4.rounded-3xl.flex.items-center.justify-between.mb-6.mt-9
      p.text-base.text-neutral-500.font-semibold Additional Material
      <el-switch v-model="isAdditionalMaterial" class="ml-2"  style="--el-switch-on-color: #13ce66;"/>
    template(v-if="isAdditionalMaterial")
      p.text-sm.text-neutral-500.font-semibold.mb-3 Additional Material Category
      .flex.align-center.gap-1
        InputSelect.flex-1(placeholder=" Additional Material Category" name="materialCategoryId" :options="addMaterialsOptions"  :value="addMaterialId" :key="addMaterialId" @change="toggleAddMaterialSelection" )
        el-button(size='medium' v-if="addMaterialId" :icon="Select" native-type="button" @click='AdditionalMaterialItem = true' class="!rounded-2xl !border-[#e9e8eb] !color-[#e9e8eb] !py-7 !px-4 !m-0")
        el-button(size='medium' :icon="Plus" native-type="button" @click='selectedMaterial= {},addAdditionMaterial = true' class="!rounded-2xl !border-[#e9e8eb] !color-[#e9e8eb] !py-7 !px-4 !m-0")
        el-button(size='medium' :icon="Edit" native-type="button" @click='selectedMaterial=addMaterials?.find((item: any) => item.id === addMaterialId),addAdditionMaterial = true' v-if="addMaterialId" class="!rounded-2xl !border-[#e9e8eb] !color-[#e9e8eb] !py-7 !px-4 !m-0")
      .bg-white.rounded-3xl.my-3.border.p-5
        .flex.justify-justify-between.items-center
          .title.font-bold.text-base.capitalize.flex-1 Items
        AppTable(without-filters without-search without-action without-pagination :columns="items.columns" :data="items.data" class="!py-0" :key="items.data")
    .bg-neutral-50.p-4.rounded-3xl.flex.items-center.justify-between.mb-6
      p.text-base.text-neutral-500.font-semibold Additional Service
      <el-switch v-model="isAdditionalService" class="ml-2"  style="--el-switch-on-color: #13ce66;"/>
    template(v-if="isAdditionalService")
      p.text-sm.text-neutral-500.font-semibold.mb-3 Service Type
      .flex.align-center.gap-1
        InputSelect.flex-1(placeholder=" Service Type" name="serviceId" :options="services" :value="isNewlyAdded ? services[0]?.value : serviceId? services?.find((item: any) => item.value === serviceId)?.value :data?.serviceId" :key="isNewlyAdded" @change="toggleServiceSelection" )
        el-button(size='medium' :icon="Plus" native-type="button" @click="selectedService={},addService = true" class="!rounded-2xl !border-[#e9e8eb] !color-[#e9e8eb] !py-7 !px-4")
        el-button(size='medium' :icon="Edit" native-type="button" @click='selectedService=services?.find((item: any) => item.value === serviceId),addService = true' v-if="serviceId" class="!rounded-2xl !border-[#e9e8eb] !color-[#e9e8eb] !py-7 !px-4 !m-0")
      InputText.mt-4(label="Service Price" type="number" disabled name="servicePrice" :value="services.find((service: any) => service.value === values.serviceId)?.price || 0" :key="values.serviceId" )
    .dialog-footer
        .flex.mt-4.justify-end
            el-button(  class="!rounded-2xl" @click='dialog = false' size="large"   ) Cancel
            el-button(class="!rounded-2xl" type='primary' native-type="submit" @click='confirm' size="large" :loading="loading") Add
  OperationsProjectsModalAdditionalMaterial(v-model="addAdditionMaterial" v-if="isAdditionalMaterial" :material="selectedMaterial" @confirm="fetchAddMaterials" )
  OperationsProjectsModalAdditionalMaterialItem(v-model="AdditionalMaterialItem" :isNew="!!Object.keys(selectedAddMaterialItem).length" :allAddMaterialItems="allAddMaterialItems" v-if="AdditionalMaterialItem" :addMaterial="addMaterial"   @confirm="getAddMaterialsItem" )
  OperationsProjectsModalService(v-model="addService"  @confirm="updateService" :service="selectedService" v-if="addService" )

</template>

<script setup lang="ts">
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { Plus, Select, Edit } from '@element-plus/icons-vue';
import { ref, defineProps, defineEmits, defineModel } from 'vue';
const props = defineProps({
  title: String,
  descriptionOne: String,
  descriptionTwo: String,
  loading: Boolean,
  icon: String,
  btnText: String,
  data: Object,
  selectedAddMaterialItem: Object,
  allAddMaterialItems: Array,
});
const emit = defineEmits(['confirm', 'submit']);
const dialog = defineModel();
const addAdditionMaterial = ref(false);
const addService = ref(false);
const AdditionalMaterialItem = ref(false);
const isAdditionalMaterial = ref(false);
const isAdditionalService = ref(false);
const addMaterialsOptions = ref<{ label: string; value: string }[]>([]);
const addMaterials = ref<AdditionalMaterial[]>([]);
const addMaterial = ref<AdditionalMaterial>();
const selectedMaterial = ref<AdditionalMaterial>();
const addMaterialsId = ref<string[]>([]);
const serviceId = ref();
const addMaterialsItems = ref<any>();
const selectedService = ref<Service>();
const finalAddMaterialsItems = ref<any>([]);
const formSchema = yup.object({
  description: yup.string().trim().required().min(2).max(100).label('Description'),
  quantity: yup
    .number()
    .required()
    .label('material Quantity')
    .transform((value: any, originalValue: any) => (String(originalValue).trim() === '' ? null : value)),
  unitPrice: yup
    .string()
    .required()
    .test('is-valid-number', 'Please enter a valid number.', (value: any) => /^\d*\.?\d*$/.test(value || ''))
    .label('material Unit Price'),
});

const { handleSubmit, values } = useForm({
  validationSchema: formSchema,
});

const onSubmit = handleSubmit(async (values: any, actions: any) => {
  const formattedValues = cleanObject({
    materialId: props.data?.id,
    serviceId: values.serviceId,
    unitPrice: Number(values.unitPrice),
    quantity: Number(values.quantity),
    description: values.description,
    materialCategoryId: values.materialCategoryId,
  });
  try {
    // Attempt to create the project
    let material = await createtMaterial(formattedValues);
    emit('confirm', material, finalAddMaterialsItems.value);
    dialog.value = false;
  } catch (error) {
    // Handle the error and prevent the step from being incremented
    console.error('Project creation failed', error);
  }
  // emit('submit')
});
const items = ref({
  columns: [
    {
      prop: 'name',
      label: 'Item Name',
      component: 'Text',
      // sortable: true,
      type: 'font-bold',
      width: 130,
    },
    {
      prop: 'price',
      label: 'Price',
      component: 'Text',
      // sortable: true,
      type: 'font-bold',
      width: 150,
    },
    {
      prop: 'quantity',
      label: 'Quantity',
      component: 'Text',
      // sortable: true,
      type: 'font-default',
      width: 120,
    },
    {
      prop: 'additionalMaterialPrice',
      label: 'Additional material Price',
      component: 'Text',
      // sortable: true,
      type: 'font-default',
      width: 200,
    },
  ],
  data: [] as AdditionalMaterial[],
});

isAdditionalMaterial.value = !!props.data?.additionalMaterialId;

isAdditionalService.value = !!props.data?.serviceId;

let services = await useTableFilter('service');
services = services.formattedData.map((item: any) => ({
  label: item.type,
  value: item.id,
  price: item.price,
}));
/**
 * Maps an array of addMaterials into a format suitable for a select input.
 */
function mapAddMaterials(data: AdditionalMaterial[] = []): { label: string; value: string }[] {
  return data.map(({ name, id }) => ({ label: name, value: id }));
}

/**
 * Updates the items data and filtered addMaterials list based on the selected addMaterial IDs.
 */
function updateTableData() {
  items.value.data = addMaterialsItems.value?.map((item: any) => ({
    price: item?.price,
    name:
      item?.name ||
      addMaterials.value
        ?.find((material: any) => Object.keys(finalAddMaterialsItems.value).includes(material.id?.toString()))
        ?.materialItem.find((materialI: any) => materialI.id === item?.id)?.name,
    quantity: item?.quantity || 1,
    additionalMaterialPrice: item?.price * (item?.quantity || 1),
  }));
}

const addMaterialId = ref<string>('');
/**
 * Toggles the selection of a addMaterial by its ID.
 */
function toggleAddMaterialSelection(val?: any) {
  addMaterialId.value = val?.value || val;
  addMaterial.value = addMaterials.value?.find((item: any) => item.id === addMaterialId.value);
  if (props.selectedAddMaterialItem && addMaterial.value && Object.keys(props.selectedAddMaterialItem).length) {
    addMaterial.value = updateMaterialQuantities(props.selectedAddMaterialItem, addMaterial.value);
    getAddMaterialsItem(props.selectedAddMaterialItem);
  } else if (
    props.allAddMaterialItems &&
    Object.keys(props.allAddMaterialItems).length &&
    Object.keys(props.allAddMaterialItems).includes(addMaterialId.value?.toString())
  ) {
    getAddMaterialsItem({ [addMaterialId.value]: props.allAddMaterialItems[addMaterialId.value as any] });
  }
}
/**
 * Fetches the list of addMaterials from the API and updates the select input with the results.
 */
async function fetchAddMaterials(id: string = '') {
  const response = await useTableFilter('additional-material');
  addMaterials.value = response?.formattedData || [];
  addMaterialsOptions.value = mapAddMaterials(addMaterials.value);
  toggleAddMaterialSelection(id);
}

if (props.data) {
  serviceId.value = props.data?.serviceId;
}

function getAddMaterialsItem(val: any) {
  console.log('val', val);
  finalAddMaterialsItems.value = val;
  addMaterialsItems.value = val[Object.keys(val)[0]];
  updateTableData();
}
await fetchAddMaterials(props?.data?.additionalMaterialId);

function updateMaterialQuantities(selectedItems: any, additionalMaterial: any) {
  return {
    ...additionalMaterial,
    materialItem: additionalMaterial.materialItem?.map((item: any) => {
      const selectedItem = selectedItems[Object.keys(selectedItems)[0]]?.find((s: any) => s.id === item.id);
      return selectedItem ? { ...item, quantity: selectedItem.quantity } : item;
    }),
  };
}

const isNewlyAdded = ref(false);

function toggleServiceSelection(val?: any) {
  serviceId.value = val?.value || val;
}

async function updateService(val?: any) {
  serviceId.value = '';
  services = await useTableFilter('service');
  services = services.formattedData.map((item: any) => ({
    label: item.type,
    value: item.id,
    price: item.price,
  }));

  if (val) {
    serviceId.value = val;
  } else {
    isNewlyAdded.value = true;
  }
}
</script>
