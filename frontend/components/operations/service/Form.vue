<template lang="pug">
el-form(  autocomplete="off"   @submit.prevent='onSubmit'   ref="myForm" label-position="top"  :validationSchema="formSchema" )
  slot
  div(:class="{'2xl:w-1/2 w-[90%] p-10  card m-auto bg-white rounded-3xl': !isModal}")
    .grid.grid-cols-2.gap-3
      InputText(label=" Service Type" name="type" placeholder="Enter Service Type" :value="data?.type" )
      InputText(label="Service Price"  placeholder="Enter Service Price SAR" name="price" :value="data?.price" )
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
  type: yup.string().trim().required().min(2).max(100).label('Service Type'),
  price: yup
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
    .label('Service Price'),
});

const { handleSubmit } = useForm({
  validationSchema: formSchema,
});

const onSubmit = handleSubmit((values: any, actions: any) => {
  emit('submit', values);
});
</script>
