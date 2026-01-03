<template lang="pug">
el-form(
  autocomplete="off"
  @submit.prevent="onSubmit"
  ref="formRef"
  label-position="top"
)
  InputText(label=" Category Name" name="name" :options="contractTypeOptions" :value="name" )

</template>

<script lang="ts" setup>
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { defineProps, defineEmits, defineModel, defineExpose } from 'vue';

// Props
const props = defineProps({
  name: { type: String, required: true },
});

// Emit events
const emit = defineEmits(['onSubmit', 'onDelete']);

// Validation schema
const formSchema = yup.object({
  name: yup.string().trim().required().min(2).max(100).label('Category Name'),
});

// Form setup
const { handleSubmit, errors, validate, values } = useForm({ validationSchema: formSchema });

const formRef = ref();

//  Emit submittion values
const onSubmit = handleSubmit((values: any) => {
  emit('onSubmit', values);
});

// Expose methods to the parent component
defineExpose({ onSubmit, validate, errors, values });
</script>
