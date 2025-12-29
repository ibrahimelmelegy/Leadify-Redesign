<template lang="pug">
el-form-item(:label="label" :error='errorMessage' class="!mb-0" label-position="top")
    template(#label)
      p {{ label }} #[span.opacity-50  {{optional ?  "optional" : "" }}]
    el-input(size="large" :type="type" rows='4' :autosize="{ minRows: 4 }" :step="step" :min="min" :inputmode="type==='number' ?'decimal' : ''" :autocomplete="type==='password' ? 'new-password' : null" :show-password="type==='password' ? true : null"  :placeholder='placeholder ? placeholder : label' v-model='inputValue' :disabled="disabled" :name="name")
      template(#append v-if="append")
        slot
</template>

<script setup lang="ts">
import { useField } from 'vee-validate';

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
  append: {
    type: Boolean,
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
  isForm: {
    type: Boolean,
    default: false,
    required: false,
  },
  optional: {
    type: Boolean,
    default: false,
    required: false,
  },
  step: {
    type: String,
    default: '',
  },
  min: {
    type: String,
    default: '',
  },
});
const emit = defineEmits(['value']);
const {
  value: inputValue,
  errorMessage,
  handleBlur,
  handleChange,
  meta,
} = useField(props.name, undefined, {
  initialValue: props.value,
});

watchEffect(() => {
  if (props.value && props.isForm) {
    inputValue.value = props.value; // set value from parent
  }
});

watch(
  () => inputValue.value,
  () => {
    emit('value', inputValue.value);
  }
);
</script>

<style lang="scss">
.hide {
  &.el-form-item {
    margin-bottom: 0 !important;
    .el-form-item__content {
      height: 0 !important;
    }
  }
  .el-input {
    display: none;
  }
}
</style>
