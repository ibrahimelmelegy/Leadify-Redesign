<template lang="pug">
el-form-item(:error='errorMessage'  )
    el-switch(size="large"  :inline-prompt="inside"  :active-text="activeText" :inactive-text="inactiveText" :placeholder='placeholder ? placeholder : "enter" + label' v-model='inputValue' :disabled="disabled" :name="name")
        template(#active-action='' v-if="activeIcon")
                span.custom-active-action
                     Icon(:name="activeIcon")
        template(#inactive-action='' v-if="inactiveIcon")
                span.custom-inactive-action
                    Icon(:name="inactiveIcon" )

</template>

<script setup lang="ts">
import { useField } from 'vee-validate';
const props = defineProps({
  name: {
    type: String,
    default: '',
    required: false,
  },
  value: {
    type: String,
    default: false,
    required: false,
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
  activeText: {
    type: String,
    required: false,
  },
  inactiveText: {
    type: String,
    required: false,
  },
  inside: {
    type: Boolean,
    default: false,
  },
  activeIcon: {
    type: String,
    default: '',
  },
  inactiveIcon: {
    type: String,
    default: '',
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
  initialValue: props.value ? props.value : false,
});
watchEffect(() => {
  if (props.value) {
    inputValue.value = props.value; // set value from parent
  }
});
</script>

<style lang="scss" scoped>
/* Firefox */
</style>
