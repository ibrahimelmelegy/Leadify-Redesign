<template lang="pug">
el-form-item(:label="label" :error='errorMessage' class="!mb-6")
    template(#label)
        p {{ label }} #[span.opacity-50  {{optional ?  "optional" : "" }}]
    el-input(size="large" :type="type"   :placeholder='placeholder ? placeholder : "enter" + label' v-model='inputValue' :disabled="disabled" :name="name")
        template(#append )
            button(type="button" @click="addValue()"): Icon.text-primary(name="IconPlus")
    TransitionGroup.w-full(name="list" tag="ul")
        li.w-full.flex.justify-between.mt-2.bg-primary-light.py-3.px-4.items-center.mb-2.word-break(class="rounded-[2.5rem]" v-for="(item, index) in listData" :key="item")
            p {{item}}
            button.toggle-icon(@click="removeValue(index)" type="button"): Icon(name="iconamoon:close" )
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
  optional: {
    type: Boolean,
    default: false,
    required: false,
  },
});
const emits = defineEmits(['getData']);
const listData = ref([]);
const {
  value: inputValue,
  errorMessage,
  handleBlur,
  handleChange,
  meta,
} = useField(props.name, undefined, {
  initialValue: '',
});

watch(
  () => props.value,
  () => {
    if (props.value) {
      listData.value = props.value;
    }
  }
);

function addValue() {
  if (!inputValue.value.trim() || errorMessage.value) return;
  listData.value.push(inputValue.value);
  emits('getData', listData.value);
  inputValue.value = '';
}
function removeValue(index: number) {
  listData.value?.splice(index, 1);
}
</script>

<style lang="scss" scoped>
.list-move, /* apply transition to moving elements */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.list-leave-active {
  position: absolute;
}
</style>
