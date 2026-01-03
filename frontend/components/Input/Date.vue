<template lang="pug">
el-form-item(:label="label" :error='errorMessage' :class="innerClass" label-position="top")
    el-date-picker( class="!w-full" size="large" :disabled-date="disabledDate === 'future' ? disableFutureDates : disabledDate === 'past' ? disablePastDates : ()=> false"  type="date"  :placeholder='placeholder ? placeholder : label ? "enter " + label : "enter date"' v-model='inputValue' :disabled="disabled" :name="name")
</template>

<script setup lang="ts">
import { useField } from 'vee-validate';
const emit = defineEmits(['value']);
const props = defineProps({
  type: {
    type: String,
    default: 'text',
    required: false,
  },
  name: {
    type: String,
    default: '',
    required: false,
  },
  value: {
    type: String,
    default: '',
    required: false,
  },

  label: {
    type: String,
    required: true,
  },
  placeholder: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
    required: false,
  },
  disabledDate: {
    type: String,
    default: false,
    required: false,
  },
  innerClass: {
    type: String,
    default: '!mb-6',
  },
});
// use `toRef` to create reactive references to `name` prop which is passed to `useField`
// this is important because vee-validte needs to know if the field name changes
// https://vee-validate.logaretm.com/v4/guide/composition-api/caveats

// we don't provide any rules here because we are using form-level validation
// https://vee-validate.logaretm.com/v4/guide/validation#form-level-validation

const {
  value: inputValue,
  errorMessage,
  handleBlur,
  handleChange,
  meta,
} = useField(props.name, undefined, {
  initialValue: props.value,
});

if (props.value) {
  inputValue.value = props.value;
}

watch(
  () => inputValue.value,
  () => {
    emit('value', inputValue.value);
  }
);

// Disable future dates
const disableFutureDates = (date: Date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to midnight for comparison
  return date.getTime() > today.getTime(); // Disable dates after today
};

// Disable past dates
const disablePastDates = (date: Date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to midnight for comparison
  return date.getTime() < today.getTime(); // Disable dates before today
};
</script>

<style lang="scss" scoped>
/* Firefox */
</style>
