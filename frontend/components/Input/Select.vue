<template lang="pug">
el-form-item(:error='errorMessage' label-position="top" :label="label" :class="innerClass")
  el-select(size="large" @remove-tag="removeTag" v-model="inputValue" filterable :reserve-keyword="false"  :multiple="isMultiple"  :disabled="disabled" :placeholder="placeholder ? placeholder :  'Choose ' + label ")
    div(
      v-infinite-scroll="load"
      infinite-scroll-immediate
      class="w-full"
      class="{'h-[200px]' : options?.length > 10}")
      el-option(
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
        @click="onChange(item)"
        )

</template>

<script lang="ts" setup>
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
  value: {
    type: String,
    default: '',
    required: false,
  },

  options: {
    type: Array,
    default: [],
    required: true,
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
  isMultiple: {
    type: Boolean,
    default: false,
    required: false,
  },
  firstOption: {
    type: Boolean,
    default: false,
  },
  innerClass: {
    type: String,
    default: 'mb-6',
  },
});
const {
  value: inputValue,
  errorMessage,
  handleBlur,
  handleChange,
  meta,
} = useField(props.name, undefined, {
  initialValue: props.isMultiple ? [] : props.firstOption ? props.options[0].value : props.value,
});

watchEffect(() => {
  if (props.value && props.isMultiple && props.value?.length) {
    inputValue.value = props.value;
  }
});

const emits = defineEmits(['loadMore', 'change']);
const load = () => {
  /**
   * Emits the 'loadMore' event to notify the parent component to load more options.
   */

  emits('loadMore');
};

function onChange(item: any) {
  emits('change', item);
}

function removeTag(tag: any) {
  emits(
    'change',
    props.options.find((option: any) => option.value === tag)
  );
}
</script>
<style lang="scss">
.el-select--large .el-select__wrapper {
  border-radius: 1rem !important;
}
</style>
