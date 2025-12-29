<template lang="pug">
el-form.mt-6.mb-24(  autocomplete="off"   @submit.prevent='onSubmit'   ref="myForm" label-position="top"  :validationSchema="formSchema" )
  .card.m-auto.bg-white.p-10.rounded-3xl(class="w-[90%] ")
    .grid.grid-cols-2.gap-3
      InputText.mt-4(label="Accommodation Cost"  placeholder="Enter Accommodation Cost SAR" name="accommodationCost" :value="project?.accommodationCost" )
      InputText.mt-4(label="Food Cost Per Day"  placeholder="Enter Food Cost Per Day SAR" name="foodCost" :value="project?.foodCostPerDay" )
    InputText.mt-4(label="Management Addition Percentage"  placeholder="Enter Management Addition Percentage %" name="managementAddition" :value="project?.managementAdditionPercentage" )
    .bg-white.rounded-3xl.mt-3.border.mt-8
      .flex.justify-justify-between.items-center.p-10.pb-0
        .title.font-bold.text-xl.capitalize.flex-1 Manpower Info
        el-button(class="!rounded-2xl" type='primary' @click='selectedManpower = {} ,addManpower = true' :icon="Plus" size="large" :loading="loading") Add
      AppTable(v-slot="{data}" without-filters without-search without-pagination :columns="manpowers.columns" :data="manpowers.data" :key="manpowers.data || values.accommodationCost" class="!py-0")
        .flex.items-center.py-2(@click.stop)
          el-button(class="!rounded-2xl" type='danger' link @click="selectedManpower = data, isDelete = true"): Icon(name="IconDelete" size="20")
          el-button(class="!rounded-2xl" type='primary' link @click="editManpower(data.id)"): Icon(name="IconEdit" size="20")
    .title.font-bold.text-xl.capitalize.flex-1.mt-8 Perview
    .bg-white.rounded-3xl.mt-3.border
      AppTable(without-filters without-search without-action without-pagination :columns="manPowerPreview.columns" :data="manPowerPreview.data" :key="manPowerPreview.data" class="!py-0")
    .bg-white.rounded-3xl.mt-3.border
      AppTable(without-filters without-search without-action without-pagination :columns="manPowertotal.columns" :data="manPowertotal.data" :key="manPowertotal.data" class="!py-0")
  .endBar
      .flex.justify-between.w-full
        el-button(   size='large' plain type="primary" class=" !rounded-2xl" @click="emit('cancel')") Cancel
        .flex.items-center.gap-x-2
          el-button(type="primary"  size='large' link :loading="loading"  :disabled="loading" class=" !px-5 !rounded-2xl" @click="activeStep--") Back
          el-button(   size='large' type="primary" native-type="submit" :loading="loading"  :disabled="loading" class=" !px-5 !rounded-2xl") Next
OperationsProjectsModalManpower(v-model="addManpower" v-if="addManpower" :manpower="selectedManpower"  @confirm="fetchProjectsManpowers")
ActionModel(v-model="isDelete" v-if="isDelete" :loading="loadingAction" @confirm="deleteManpower" btn-text="delete" title="Delete Project Manpower" description="Are you sure you want to delete this Project Manpower?" icon="/images/delete-image.png" )
</template>

<script lang="ts" setup>
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { defineEmits, defineProps, defineModel } from 'vue';
import { Plus } from '@element-plus/icons-vue';
const route = useRoute();
const props = defineProps({
  loading: Boolean,
  label: String,
  data: {
    type: Object,
    required: false,
  },
  editMode: {
    type: Boolean,
    required: false,
  },
});
const activeStep = defineModel();
const addManpower = ref(false);
const selectedManpower = ref<ProjectManpower>({});
const isDelete = ref(false);
const emit = defineEmits(['submit', 'cancel']);
const loadingAction = ref(false);
const formSchema = yup.object({
  accommodationCost: yup.string().trim().required().min(1).max(100).label('Accommodation Cost'),
  foodCost: yup.string().trim().required().min(1).max(100).label('Food Cost Per Day'),
  managementAddition: yup.string().trim().required().min(1).max(100).label('Management Addition'),
});

const { handleSubmit, values } = useForm({
  validationSchema: formSchema,
});

const onSubmit = handleSubmit(async (values: any, actions: any) => {
  const formattedValues = cleanObject({
    accommodationCost: Number(values.accommodationCost),
    foodCostPerDay: Number(values.foodCost),
    managementAdditionPercentage: Number(values.managementAddition),
  });
  try {
    // Attempt to create the project
    await createtAssociatedManPower(formattedValues);
    activeStep.value++;
  } catch (error) {
    // Handle the error and prevent the step from being incremented
    console.error('Project creation failed', error);
  }
  // emit('submit')
});

const manpowers = ref({
  columns: [
    {
      prop: 'name',
      label: 'Manpower Name',
      component: 'Text',
      // sortable: true,
      type: 'font-bold',
      width: 150,
    },
    {
      prop: 'estimatedWorkDays',
      label: 'Estimated Work Days ',
      component: 'Text',
      // sortable: true,
      type: 'font-bold',
      width: 180,
    },
    {
      prop: 'mission',
      label: 'Mission',
      component: 'Text',
      // sortable: true,
      type: 'font-default',
      width: 120,
    },
    {
      prop: 'durationCost',
      label: 'Duration Cost',
      component: 'Text',
      // sortable: true,
      type: 'font-default',
      width: 150,
    },
    {
      prop: 'foodAllowanceCost',
      label: 'Food Allowance Cost',
      component: 'Text',
      // sortable: true,
      type: 'font-default',
      width: 200,
    },
    {
      prop: 'accommodationCostPerManpower',
      label: 'Accommodation Cost/Manpower',
      component: 'Text',
      // sortable: true,
      type: 'font-default',
      width: 270,
    },
    {
      prop: 'carRentPerManpower',
      label: 'Car Rent/Manpower',
      component: 'Text',
      // sortable: true,
      type: 'font-default',
      width: 200,
    },
    {
      prop: 'otherCosts',
      label: 'Other Costs',
      component: 'Text',
      // sortable: true,
      type: 'font-default',
      width: 150,
    },
    {
      prop: 'totalCost',
      label: 'Total Cost',
      component: 'Text',
      // sortable: true,
      type: 'font-default',
      width: 150,
    },
  ],
  data: [] as ProjectManpower[],
});
const manPowerPreview = ref({
  columns: [
    {
      prop: 'totalCarRent',
      label: 'Total Car Rent',
      component: 'Text',
      // sortable: true,
      type: 'font-bold',
      width: 130,
    },
    {
      prop: 'totalCarRentDuration',
      label: 'Total Car Rent/Duration',
      component: 'Text',
      // sortable: true,
      type: 'font-bold',
      width: 150,
    },
    {
      prop: 'resourceCount',
      label: 'Resource Count',
      component: 'Text',
      // sortable: true,
      type: 'font-default',
      width: 120,
    },
  ],
  data: [] as any,
});
const manPowertotal = ref({
  columns: [
    {
      prop: 'totalCost',
      label: 'Manpower Table Total Cost',
      component: 'Text',
      // sortable: true,
      type: 'font-bold',
      width: 130,
    },
    {
      prop: 'managementAdditionPercentage',
      label: 'Management addition percentage',
      component: 'Text',
      // sortable: true,
      type: 'font-bold',
      width: 130,
    },
    {
      prop: 'finalManpowerTableTotalCost',
      label: 'Final Manpower Table Total Cost',
      component: 'Text',
      // sortable: true,
      type: 'font-bold',
      width: 150,
    },
  ],
  data: [] as any,
});

const totalManpowerCost = (data: any) => {
  return data?.reduce((sum: number, manpower: any) => sum + Number(manpower.totalCost || 0), 0) ?? 0;
};

const finalManpowerTotalCost = (data: any) => {
  return (totalManpowerCost(data) + (totalManpowerCost(data) * Number(values.managementAddition)) / 100)?.toFixed(2) || 0;
};

const totalCarRent = (data: any) => {
  // return data?.reduce((sum: number, manpower: any) => sum + manpower.carRentPerManpower, 0)?.toFixed(2) ?? 0;
  return project.value?.totalCarRent ?? 0;
};

const totalCarRentDuration = (data: any) => {
  // const carRent = totalCarRent(data);
  // const projectDuration = project.value?.duration ?? 0;

  // return (carRent > 0 ? (carRent / 30) * projectDuration : 0).toFixed(2);
  return project.value?.totalCarRentPerDuration?.toFixed(2);
};

let filteredData: any = [];
const fetchProjectsManpowers = async () => {
  const response = await getProjectManpowers();
  filteredData = response.filter((item: any) => item?.projectId === projectId.value);
  if (response) {
    const accommodationCost =
      typeof Number(values.accommodationCost) === 'number' && !isNaN(Number(values.accommodationCost))
        ? Number(values.accommodationCost)
        : 0;
    const foodCost =
      typeof Number(values.foodCost) === 'number' && !isNaN(Number(values.foodCost)) ? Number(values.foodCost) : 0;

    // Ensure data is an array and get its length
    const numManpowers = Array.isArray(filteredData) ? filteredData.length : 0;
    manpowers.value.data = filteredData?.map((manpower: any) => {
      const accommodationCostPerManpower = numManpowers ? accommodationCost / numManpowers : 0;
      const estimatedWorkDays =
        typeof Number(manpower?.estimatedWorkDays) === 'number' && !isNaN(Number(manpower?.estimatedWorkDays))
          ? Number(manpower.estimatedWorkDays)
          : 0;
      const foodAllowanceCost = foodCost * estimatedWorkDays;
      const totalCost =
        (Number(manpower?.durationCost) || 0) +
        accommodationCostPerManpower +
        foodAllowanceCost +
        (Number(manpower?.carRentPerManpower) || 0) +
        (Number(manpower?.otherCosts) || 0);

      return {
        ...manpower,
        totalCost: totalCost?.toFixed(2),
        name: manpower?.manpower?.name || '-',
        mission: manpower?.mission?.join(', '),
        accommodationCostPerManpower: values.accommodationCost ? Number(values.accommodationCost) / filteredData?.length : 0,
        foodAllowanceCost: values.foodCost ? Number(values.foodCost) * Number(manpower?.estimatedWorkDays || 0) : 0,
      };
    });
    manPowertotal.value.data = [
      {
        totalCost: formatNumber(totalManpowerCost(manpowers.value.data)?.toFixed(2)),
        managementAdditionPercentage: formatNumber(
          (totalManpowerCost(manpowers.value.data) * Number(values.managementAddition)) / 100 || 0
        ),
        finalManpowerTableTotalCost: formatNumber(finalManpowerTotalCost(manpowers.value.data)),
      },
    ];
    manPowerPreview.value.data = [
      {
        totalCarRent: formatNumber(totalCarRent(filteredData)),
        totalCarRentDuration: formatNumber(totalCarRentDuration(filteredData)),
        resourceCount: filteredData?.length || 0,
      },
    ];
  }
};

const deleteManpower = async () => {
  loadingAction.value = true;
  if (await deleteProjectManPower(selectedManpower.value?.id)) {
    await fetchProjectsManpowers();
  }
  selectedManpower.value = {};
  isDelete.value = false;
  loadingAction.value = false;
};
const editManpower = async (id: string) => {
  selectedManpower.value = await getProjectManpower(id);
  addManpower.value = true;
};
await fetchProjectsManpowers();

watch(
  () => [values.accommodationCost, values.foodCost, values.managementAddition],
  () => {
    // Validate accommodationCost and foodCost
    const accommodationCost =
      typeof Number(values.accommodationCost) === 'number' && !isNaN(Number(values.accommodationCost))
        ? Number(values.accommodationCost)
        : 0;
    const foodCost =
      typeof Number(values.foodCost) === 'number' && !isNaN(Number(values.foodCost)) ? Number(values.foodCost) : 0;

    // Ensure data is an array and get its length
    const numManpowers = Array.isArray(filteredData) ? filteredData.length : 0;
    // Map each manpower entry with extra numeric checks
    manpowers.value.data = filteredData?.map((manpower: any) => {
      const estimatedWorkDays =
        typeof Number(manpower?.estimatedWorkDays) === 'number' && !isNaN(Number(manpower?.estimatedWorkDays))
          ? Number(manpower.estimatedWorkDays)
          : 0;
      const manpowerTotalCost =
        typeof Number(manpower?.totalCost) === 'number' && !isNaN(Number(manpower?.totalCost))
          ? Number(manpower.totalCost)
          : 0;

      const accommodationCostPerManpower = numManpowers ? accommodationCost / numManpowers : 0;
      const foodAllowanceCost = foodCost * estimatedWorkDays;
      const totalCost =
        (Number(manpower?.durationCost) || 0) +
        accommodationCostPerManpower +
        foodAllowanceCost +
        (Number(manpower?.carRentPerManpower) || 0) +
        (Number(manpower?.otherCosts) || 0);

      return {
        ...manpower,
        accommodationCostPerManpower: accommodationCostPerManpower?.toFixed(2),
        foodAllowanceCost: foodAllowanceCost?.toFixed(2),
        totalCost: totalCost?.toFixed(2),
        name: manpower?.manpower?.name || '-',
        mission: manpower?.mission?.join(', '),
      };
    });
    // Validate managementAddition
    const managementAddition =
      typeof Number(values.managementAddition) === 'number' && !isNaN(Number(values.managementAddition))
        ? Number(values.managementAddition)
        : 0;
    const totalManpower = totalManpowerCost(manpowers.value.data);
    const finalManpowerTableTotalCost = (
      (Number(totalManpower) || 0) +
      ((Number(totalManpower) || 0) * (Number(managementAddition) || 0)) / 100
    ).toFixed(2);

    manPowertotal.value.data = [
      {
        totalCost: formatNumber(totalManpower?.toFixed(2)),
        managementAdditionPercentage: formatNumber(
          ((totalManpowerCost(manpowers.value.data) * Number(values.managementAddition)) / 100)?.toFixed(2) || 0
        ),
        finalManpowerTableTotalCost: formatNumber(finalManpowerTableTotalCost),
      },
    ];
  }
);
// watch(
//   () => values.managementAddition,
//   () => {
//     // Validate managementAddition
//     const managementAddition =
//       typeof Number(values.managementAddition) === 'number' && !isNaN(Number(values.managementAddition))
//         ? Number(values.managementAddition)
//         : 0;
//     const totalManpower = totalManpowerCost(manpowers.value.data);
//     const finalManpowerTableTotalCost = (totalManpower + (totalManpower * managementAddition) / 100).toFixed(2);
//     manPowertotal.value.data = [
//       {
//         totalCost: totalManpower,
//         finalManpowerTableTotalCost,
//       },
//     ];
//   }
// );
</script>
