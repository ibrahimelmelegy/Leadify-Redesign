<template lang="pug">
el-form(autocomplete="off" @submit.prevent="onSubmit" ref="myForm" label-position="top")
  slot
  div(:class="{'2xl:w-1/2 w-[90%] card m-auto bg-white p-10 rounded-3xl': !isModal}")
    InputText(label="Asset Name" name="name" placeholder="Enter Assets Name" :value="data?.name" )
    .grid.grid-cols-2.gap-3
      InputText.mt-4(label="Rent Price"  placeholder="Enter Rent Price SAR" name="rentPrice" :value="data?.rentPrice" )
      InputText.mt-4(label="Buy Price"  placeholder="Enter Buy Price SAR" name="buyPrice" :value="data?.buyPrice" )
  slot(name="modal-footer")
</template>

<script lang="ts" setup>
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { defineEmits, defineProps } from 'vue';
const router = useRouter();
const props = defineProps({
  loading: Boolean,
  isModal: Boolean,
  label: String,
  data: {
    type: Object,
    required: false,
  },
});

const emit = defineEmits(['submit']);

const formSchema = yup.object({
  name: yup.string().trim().required().min(2).max(100).label('Assets Name'),
  rentPrice: yup
    .string() // Use string to allow flexible input (empty, float, or integer)
    .nullable()
    .test(
      'is-valid-number',
      'Please enter a valid number.', // Custom error message
      (value: any) => {
        if (!value) return true; // Allow empty input
        return /^\d*\.?\d*$/.test(value); // Check if value is a valid integer or float
      }
    )
    .max(25)
    .label('Rent Price'),
  buyPrice: yup
    .string() // Use string to allow flexible input (empty, float, or integer)
    .nullable()
    .test(
      'is-valid-number',
      'Please enter a valid number.', // Custom error message
      (value: any) => {
        if (!value) return true; // Allow empty input
        return /^\d*\.?\d*$/.test(value); // Check if value is a valid integer or float
      }
    )
    .max(25)
    .label('Buy Price'),
});

const { handleSubmit } = useForm({
  validationSchema: formSchema,
});

const onSubmit = handleSubmit((values: any, actions: any) => {
  emit('submit', values);
});
</script>
