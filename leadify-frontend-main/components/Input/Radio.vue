<template lang="pug">
el-form-item(:label="label" :error='errorMessage' class="!mb-6")
    el-radio-group( v-model="inputValue")
        el-radio(size="large"  v-for="option in options" :value="option.value"  :disabled="option.disabled" :name="name") {{ option.label }}

</template>

<script setup lang="ts">
import { useField } from "vee-validate";
const props = defineProps({
  name: {
    type: String,
    default: "",
    required: false,
  },

  value: {
    type: String,
    default: "",
    required: false,
  },
  options: {
    type: Array,
    default: [],
  },
  label: {
    type: String,
    required: true,
  },
  placeholder: {
    type: String,
    default: "",
  },
  disabled: {
    type: Boolean,
    default: false,
    required: false,
  },
});

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
  () => props.value,
  () => {
    if (props.value) {
      inputValue.value = props.value; // set value from parent
    }
  }
);
</script>

<style lang="scss" scoped>
.el-radio.el-radio--large {
  height: fit-content !important;
}
</style>
