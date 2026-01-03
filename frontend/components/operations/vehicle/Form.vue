<template lang="pug">
ClientOnly
  VForm(v-slot="{ handleSubmit: formHandleSubmit }" :validation-schema="formSchema" @submit="onSubmit")
    el-form(autocomplete="off" @submit.prevent="formHandleSubmit(onSubmit)" ref="myForm" label-position="top")
      slot
      div(:class="{'2xl:w-1/2 w-[90%] card m-auto bg-white p-10 rounded-3xl': !isModal}")
        .grid.grid-cols-2.gap-3
          InputText.mt-4(label="Plate"  placeholder="Enter Plate" name="plate" :value="data?.plate" )
          InputSelect.mt-4(label=" Manufacturer" name="manufacturer" :options="manufacturers" :value="data?.manufacturer" )
          InputText.mt-4(label="Rent Cost"  placeholder="Enter Rent Cost SAR" name="rentCost" :value="data?.rentCost" )
          InputText.mt-4(label="Gas Cost"  placeholder="Enter Gas Cost SAR" name="gasCost" :value="data?.gasCost" )
          InputText.mt-4(label="Oil Cost"  placeholder="Enter Oil Cost SAR" name="oilCost" :value="data?.oilCost" )
          InputText.mt-4(label="Regular Maintenance Cost"  placeholder="Enter Regular Maintenance Cost SAR" name="regularMaintenanceCost" :value="data?.regularMaintenanceCost" )
      slot(name="modal-footer")
</template>

<script lang="ts" setup>
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { defineEmits, defineProps } from 'vue';
const router = useRouter();
const props = defineProps({
  loading: Boolean,
  label: String,
  isModal: Boolean,
  data: {
    type: Object,
    required: false,
  },
});

const emit = defineEmits(['submit']);

const formSchema = yup.object({
  manufacturer: yup.string().trim().required().min(2).max(100).label('manufacturer'),
  rentCost: yup
    .string() // Use string to allow flexible input (empty, float, or integer)
    .required()
    .test(
      'is-valid-number',
      'Please enter a valid number.', // Custom error message
      (value: any) => {
        if (!value) return true; // Allow empty input
        return /^\d*\.?\d*$/.test(value); // Check if value is a valid integer or float
      }
    )
    .max(25)
    .label('Rent Cost'),
  gasCost: yup
    .string() // Use string to allow flexible input (empty, float, or integer)
    .required()
    .test(
      'is-valid-number',
      'Please enter a valid number.', // Custom error message
      (value: any) => {
        if (!value) return true; // Allow empty input
        return /^\d*\.?\d*$/.test(value); // Check if value is a valid integer or float
      }
    )
    .max(25)
    .label('Gas Cost'),
  oilCost: yup
    .string() // Use string to allow flexible input (empty, float, or integer)
    .required()
    .test(
      'is-valid-number',
      'Please enter a valid number.', // Custom error message
      (value: any) => {
        if (!value) return true; // Allow empty input
        return /^\d*\.?\d*$/.test(value); // Check if value is a valid integer or float
      }
    )
    .max(25)
    .label('Oil Cost'),
  plate: yup
    .string() // Use string to allow flexible input (empty, float, or integer)
    .required()
    .max(20)
    .label('Plate'),
  regularMaintenanceCost: yup
    .string() // Use string to allow flexible input (empty, float, or integer)
    .required()
    .test(
      'is-valid-number',
      'Please enter a valid number.', // Custom error message
      (value: any) => {
        if (!value) return true; // Allow empty input
        return /^\d*\.?\d*$/.test(value); // Check if value is a valid integer or float
      }
    )
    .max(25)
    .label('Regular Maintenance Cost'),
});

const { handleSubmit } = useForm({
  validationSchema: formSchema,
});

const onSubmit = handleSubmit((values: any, actions: any) => {
  emit('submit', values);
});
</script>
