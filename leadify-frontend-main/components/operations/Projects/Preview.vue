<template lang="pug">
el-form.mt-6(  autocomplete="off"   @submit.prevent='onSubmit'   ref="myForm" label-position="top"  :validationSchema="formSchema" )
  .card.m-auto.bg-white.p-10.rounded-3xl.mb-3(class="w-[90%] ")
      .grid.gap-4(class="md:grid-cols-3 grid-cols-1")
        div
          .text-neutral-400.font-medium.mb-2.flex.items-center
            Icon(name="tabler:category-2" size="20" class="mr-2")
            p Project Name
          p.text-neutral-800.mb-2 {{project?.name || '-'}}
        div
          .text-neutral-400.font-medium.mb-2.flex.items-center
            Icon(name="IconAssign" size="20" class="mr-2")
            p Client
          p.text-neutral-800.mb-2  {{project?.client?.clientName || '-'}}
        div
          .text-neutral-400.font-medium.mb-2.flex.items-center
            Icon(name="IconCalendar" size="20" class="mr-2")
            p Project Duration
          p.text-neutral-800.mb-2  {{project?.duration || 0}} Days
  .card.m-auto.bg-white.p-10.rounded-3xl.mb-24(class="w-[90%] ")
    .title.font-bold.text-xl.capitalize.flex-1.mt-8 Final Costs Table
    .rounded-3xl.mt-3.border.mt-8
      AppTable(without-filters without-search without-action without-pagination :columns="finalCost.columns" :data="finalCost.data" class="!py-0")
    .flex.items-center.gap-3(class="md:flex-row flex-col")
      .flex-1.bg-neutral-50.p-4.rounded-3xl.mt-4
        el-checkbox(label="Have Discount ?" v-model="haveDiscount")
        InputText(placeholder="Enter Discount SAR" name="discount" :value="data?.discount" v-if="haveDiscount")
      .flex-1.bg-neutral-50.p-4.rounded-3xl.mt-4
        el-checkbox(label="Have Margin ?" v-model="haveMargin")
        InputText(placeholder="Enter Margin %" name="margin" :value="data?.margin" v-if="haveMargin")
    .flex.justify-end.mt-12
      div
        p.text-lg.font-semibold.text-neutral-900.mb-3 Summary
        .flex.justify-between.items-center.gap-12.mb-4
          p.text-base.text-neutral-400 GrandTotal :
          p.text-base.text-neutral-900 {{formatNumber((project?.grandTotal || 0)?.toFixed(2))}} SAR
        .flex.justify-between.items-center.gap-12.mb-4
          p.text-base.text-neutral-400 Vat (15%) :
          p.text-base.text-neutral-900 {{formatNumber((project?.vat || 0)?.toFixed(2))}} SAR
        .flex.justify-between.items-center.gap-12.mb-4
          p.text-base.text-neutral-400 Discount :
          p.text-base.text-neutral-900 {{formatNumber(Number(values.discount) || 0)}} SAR
        .flex.justify-between.items-center.gap-12.mb-4.border-b.pb-4
          p.text-base.text-neutral-400 Margin ({{Number(values.margin) || 0}}%) :
          p.text-base.text-neutral-900 {{formatNumber(projectMargin?.toFixed(2))}} SAR
        .flex.justify-between.items-center.gap-12.mb-4
          p.text-base.text-neutral-900 Total Price :
          p.text-base.text-neutral-900 {{formatNumber((((project?.grandTotal || 0) + (project?.grandTotal * 15 / 100 || 0)) + projectMargin - ((Number(values.discount) || 0)))?.toFixed(2))}} SAR
  .endBar
      .flex.justify-between.w-full
        el-button(   size='large' plain type="primary" class=" !rounded-2xl" @click="emit('cancel')") Cancel
        .flex.items-center.gap-x-2
          el-button( type="primary"  size='large' link :loading="loading"  :disabled="loading" class=" !px-5 !rounded-2xl" @click="activeStep--") Back
          el-button(   size='large' type="primary" native-type="submit" :loading="loading"  :disabled="loading" class=" !px-5 !rounded-2xl") Finish
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
const emit = defineEmits(['submit', 'onFinish', 'cancel']);
const haveDiscount = ref(true);
const haveMargin = ref(true);

const formSchema = computed(() => {
  const schema = {
    discount: yup.string().when([], {
      is: () => haveDiscount.value,
      then: () =>
        yup
          .string()
          .required()
          .test('is-valid-number', 'Please enter a valid number.', (value: any) => {
            return /^\d+$/.test(value || '');
          })
          .test('is-valid-discount', 'Value must be less than or equal to grand total.', (value: any) => {
            return value <= (project.value?.grandTotal || 0);
          })
          .max(999999999.99)
          .label('Discount'),
    }),
    margin: yup.string().when([], {
      is: () => haveMargin.value,
      then: () =>
        yup
          .string()
          .required()
          .test('is-valid-number', 'Please enter a valid number.', (value: any) => {
            return /^\d+$/.test(value || '');
          })
          .max(9999)
          .label('Margin'),
    }),
  };
  return yup.object(schema);
});

const { handleSubmit, errors, values } = useForm({
  validationSchema: formSchema,
});

const onSubmit = handleSubmit((values: any, actions: any) => {
  const formatedValues = cleanObject({
    discount: Number(values.discount),
    marginPercentage: Number(values.margin),
  });
  emit('onFinish', formatedValues);
  // emit('submit', values);
});

const finalCost = ref({
  columns: [
    {
      prop: 'finalManpowerTableTotalCost',
      label: 'Final Manpower Table Total Cost',
      component: 'Text',
      // sortable: true,
      type: 'font-default',
      width: 270,
    },
    {
      prop: 'finalMaterialsTableCost',
      label: 'Final Materials Table Cost ',
      component: 'Text',
      // sortable: true,
      type: 'font-default',
      width: 250,
    },
    {
      prop: 'finalAssetsTableCost',
      label: 'Final Assets Table Cost',
      component: 'Text',
      // sortable: true,
      type: 'font-default',
      width: 250,
    },
    // {
    //   prop: 'grandTotal',
    //   label: 'Grand Total',
    //   component: 'Text',
    //   // sortable: true,
    //   type: 'font-default',
    //   width: 150,
    // },
    // {
    //   prop: 'vat',
    //   label: 'VAT',
    //   component: 'Text',
    //   // sortable: true,
    //   type: 'font-default',
    //   width: 150,
    // },
  ],
  data: [] as any,
});

if (projectId.value) {
  finalCost.value.data = [
    {
      finalManpowerTableTotalCost: project.value?.finalManpowerTotalCost?.toFixed(2),
      finalMaterialsTableCost: project.value?.totalMaterialCost?.toFixed(2),
      finalAssetsTableCost: project.value?.totalAssetsCost?.toFixed(2),
      grandTotal: project.value?.grandTotal?.toFixed(2),
      vat: project.value?.vat?.toFixed(2),
    },
  ];
}

const projectMargin = computed(() => {
  if (project.value?.grandTotal) {
    return (project.value?.grandTotal * values.margin) / 100 || 0;
  }
  return 0;
});
</script>
