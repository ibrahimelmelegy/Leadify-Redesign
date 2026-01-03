<template lang="pug">
el-form(  autocomplete="off"   @submit.prevent='onSubmit'   ref="myForm" label-position="top"  :validationSchema="formSchema" )
  slot
  .card.m-auto.bg-white.p-10.rounded-3xl(class="2xl:w-1/2 w-[90%] ")
      .grid.grid-cols-2.gap-3
        InputText(label="Lead Name"  name="leadName" :value="data?.name" )
        InputText(label="Company Name"  name="companyName" :value="data?.companyName" )
        InputText.mt-4(label="Email"  name="email" :value="data?.email" @value="val=> isEmail = !!val" )
        InputPhone.mt-4(label=" Phone Number"  name="phone" @value="val=> isPhone = !!val" :value="data?.phone" @validphone="val=> validPhone = val" mode="international" )
        InputSelect(label=" Lead State" name="leadState" :options="leadStates" :value="data?.status" )
        InputSelect(label=" Lead Source" name="leadSource" :options="leadSources" :value="data?.leadSource" @change="checkIfOtherSource" )
      InputText(label="Other Lead Source"  name="otherSource" v-if="isOtherSource" :value="data?.otherSource" )
      InputDate.mt-4(label="Last Contact Date" v-if="route.path.includes('edit')" placeholder="Enter Last Contact Date" disabledDate="future" :value="data?.lastContactDate || new Date()" name="lastContactDate" )
      InputSelect.mt-4(label=" Assign User" name="assignUser" isMultiple :options="users" :value="users?.filter((user: any) => data?.users?.map((user: any) => user.id)?.includes(user.value))?.map((user: any) => user.value)"  )
      InputText(type="textarea" placeholder="Notes"  name="notes" :value="data?.notes" )

</template>

<script lang="ts" setup>
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import isEmailValidator from 'validator/lib/isEmail';
import { defineEmits, defineProps, defineModel } from 'vue';
const router = useRouter();
const route = useRoute();
const activeStep = defineModel();

const props = defineProps({
  loading: Boolean,
  label: String,
  data: {
    type: Object,
    required: false,
  },
});

const emit = defineEmits(['submit']);
const validPhone = ref(true);
const isEmail = ref(false);
const isPhone = ref(false);
const isOtherSource = ref(false);

const formSchema = yup.object({
  leadName: yup.string().trim().required().min(2).max(100).label('Lead Name'),
  companyName: yup.string().nullable().trim().max(100).label('Company Name'),
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
  leadState: yup.string().trim().required().min(2).max(100).label('Lead State'),
  leadSource: yup.string().nullable().trim().max(100).label('Lead Source'),
  otherSource: yup.string().when([], {
    is: () => isOtherSource.value,
    then: () => yup.string().required().trim().min(2).max(100).label('Other Source'),
    otherwise: () =>
      yup
        .string()
        .trim()
        .nullable()
        .test('min-length-if-entered', 'Other Source must be at least 2 characters', (value: any) => !value || value.length >= 2)
        .trim()
        .max(250)
        .label('Other Source'),
  }),
  assignUser: yup.array().of(yup.number()).required().min(1).label('Assign User'),
  lastContactDate: yup.date().nullable().label('Last Contact Date'),
  notes: yup
    .string()
    .trim()
    .nullable()
    .test('min-length-if-entered', 'Notes must be at least 2 characters', (value: any) => !value || value.length >= 2)
    .trim()
    .max(2000)
    .label('Notes'),
});

const { handleSubmit } = useForm({
  validationSchema: formSchema,
});

const onSubmit = handleSubmit((values: any, actions: any) => {
  emit('submit', values);
});

const users = ref<any[]>([]);

onMounted(async () => {
  try {
    const response = await useApiFetch('users');
    users.value = response?.body?.docs?.map((e: any) => ({
      label: e.name,
      value: e.id,
    })) || [];
  } catch (e) {
    console.error('Failed to load users:', e);
  }
});

function checkIfOtherSource(value: any) {
  if (value.value === 'OTHER') {
    isOtherSource.value = true;
  } else {
    isOtherSource.value = false;
  }
}
if (props.data?.leadSource === 'OTHER') {
  isOtherSource.value = true;
}
</script>
