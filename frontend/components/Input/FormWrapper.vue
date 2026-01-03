<template lang="pug">
Form(
  v-slot="{ handleSubmit, errors, meta }"
  :validation-schema="validationSchema"
  :initial-values="initialValues"
  @submit="onSubmit"
)
  el-form(
    ref="elFormRef"
    :model="model"
    :label-position="labelPosition"
    :disabled="disabled"
    @submit.prevent="handleSubmit(onSubmit)"
  )
    slot(:handleSubmit="handleSubmit" :errors="errors" :meta="meta")
</template>

<script setup lang="ts">
import { Form } from 'vee-validate';

const props = defineProps({
  validationSchema: {
    type: Object,
    default: () => ({}),
  },
  initialValues: {
    type: Object,
    default: () => ({}),
  },
  model: {
    type: Object,
    default: () => ({}),
  },
  labelPosition: {
    type: String,
    default: 'top',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['submit']);
const elFormRef = ref(null);

const onSubmit = (values: any) => {
  emit('submit', values);
};
</script>
