<template lang="pug">
ClientOnly
  VForm(v-slot="{ handleSubmit: formHandleSubmit }" :validation-schema="formSchema" @submit="onSubmit")
    el-form(autocomplete="off" @submit.prevent="formHandleSubmit(onSubmit)" ref="myForm" label-position="top")
      slot
      div(:class="{'2xl:w-1/2 w-[90%] card m-auto bg-white p-10 rounded-3xl': !isModal}")
        .grid.grid-cols-2.gap-3
          InputText(label="Full Name"  name="name" :value="data?.name" )
          InputSelect(label=" Nationality" name="nationality" :options="ManpowerNationalityOptions" :value="data?.nationality" )
          InputText(label="Email"  name="email" :value="data?.email" @value="val=> isEmail = !!val" )
          InputPhone(label=" Phone Number"  name="phone" :value="data?.phone" @validphone="val=> validPhone = val" mode="international" @value="val=> isPhone = !!val" )
          InputSelect(label=" Role" name="role" isMultiple :options="manpowerRoles" :value="data?.role" )
          InputSelect(label=" Availability Status" name="availabilityStatus" :options="manpowerAvailabilityStatus" :value="data?.availabilityStatus" )
        InputText(label="Salary" placeholder="Enter Salary SAR" name="salary" :value="data?.salary" )
        .grid.grid-cols-2.gap-3
          InputText.mt-4(label="V. Allowance"  placeholder="Enter V. Allowance SAR" name="variableAllowance" :value="data?.variableAllowance" )
          InputText.mt-4(label="T. Allowance"  placeholder="Enter T. Allowance SAR" name="transportationAllowance" :value="data?.transportationAllowance" )
          InputText.mt-4(label="Iqama Cost"  placeholder="Enter Iqama Cost SAR" name="iqamaCost" :value="data?.iqamaCost" )
          InputText.mt-4(label="EOF"  placeholder="Enter EOF SAR" name="endOfServiceBenefit" :value="data?.endOfServiceBenefit" )
          InputText.mt-4(label="Saudization (optional)"  placeholder="Enter Saudization SAR" name="saudization" :value="data?.saudization" )
          InputText.mt-4(label="Visa Fees (optional)"  placeholder="Enter Visa Fees SAR" name="visaFees" :value="data?.visaFees" )
          InputText.mt-4(label="Incoming flight ticket (optional)"  placeholder="Enter Incoming flight ticket SAR" name="incomingFlightTicket" :value="data?.incomingFlightTicket" )
          InputText.mt-4(label="Health insurance (optional)"  placeholder="Enter Health insurance SAR" name="healthInsurance" :value="data?.healthInsurance" )
        InputText.mt-4(label="General Organization for Social Insurance (optional)"  placeholder="Enter General Organization for Social Insurance SAR" name="generalOrganizationForSocialInsurance" :value="data?.generalOrganizationForSocialInsurance" )
        InputText.mt-4(type="textarea" placeholder="Enter Notes"  label="Additional Notes (optional)"  name="notes" :value="data?.notes" )
      slot(name="modal-footer")
</template>

<script lang="ts" setup>
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import isEmailValidator from 'validator/lib/isEmail';
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
const validPhone = ref(true);
const isEmail = ref(false);
const isPhone = ref(false);

const formSchema = yup.object({
  name: yup.string().trim().required().min(2).max(100).label('Full Name'),
  nationality: yup.string().trim().required().min(2).max(100).label('Nationality'),
  email: yup.string().when([], {
    is: () => isPhone.value,
    then: () =>
      yup
        .string()
        .email()
        .max(100)
        .nullable()
        .test(
          'is-valid',
          (message: any) => 'Invalid email',
          (value: any) => !value || isEmailValidator(value)
        )
        .label('Email'),
    otherwise: () =>
      yup
        .string()
        .email()
        .max(100)
        .required('At least one of email or phone number is required')
        .test(
          'is-valid',
          (message: any) => 'Invalid email',
          (value: any) => (value ? isEmailValidator(value) : new yup.ValidationError('Invalid value'))
        )
        .label('Email'),
  }),
  phone: yup.number().when([], {
    is: () => isEmail.value,
    then: () =>
      yup
        .number()
        .nullable() // Allows the value to be null
        .transform((value: any, originalValue: any) => (originalValue === '' ? null : Number.isNaN(value) ? null : value))
        .label('Phone Number')
        .test('Phone number', 'Invalid Phone', function (value: any) {
          if (value === null || value === undefined) {
            return true;
          }
          return validPhone.value ? true : false;
        }),
    otherwise: () =>
      yup
        .number()
        .transform((value: any) => (Number.isNaN(value) ? null : value))
        .nullable()
        .required('At least one of email or phone number is required')
        .label('Phone Number')
        .test('Phone number', 'invalid Phone', function (value: any) {
          return validPhone.value ? true : false;
        }),
  }),
  role: yup.array().of(yup.string()).required().min(1).label('Role'),
  availabilityStatus: yup.string().trim().required().min(2).max(100).label('Availability Status'),
  salary: yup
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
    .label('Salary'),
  variableAllowance: yup
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
    .label('V. Allowance'),
  transportationAllowance: yup
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
    .label('T. Allowance'),
  iqamaCost: yup
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
    .label('Iqama Cost'),
  endOfServiceBenefit: yup
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
    .label('V. Allowance'),
  saudization: yup
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
    .label('Saudization'),
  visaFees: yup
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
    .label('Visa Fees'),
  incomingFlightTicket: yup
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
    .label('Incoming Flight'),
  healthInsurance: yup
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
    .label('Health Insurance'),
  generalOrganizationForSocialInsurance: yup
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
    .label('General Organization for Social Insurance'),
  notes: yup.string().nullable().trim().max(2000).label('Additional Notes'),
});

const { handleSubmit } = useForm({
  validationSchema: formSchema,
});

const onSubmit = handleSubmit((values: any, actions: any) => {
  emit('submit', cleanObject(values));
});

if (props.data?.email) {
  isEmail.value = true;
} else if (props.data?.phone) {
  isPhone.value = true;
}
</script>
