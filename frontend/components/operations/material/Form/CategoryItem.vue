<template lang="pug">
el-form(
  autocomplete="off"
  @submit.prevent="onSubmit"
  ref="formRef"
  label-position="top"
)
  .flex.items-center.gap-3.mt-5
    InputText.flex-1(label=" Item Name" name="name" :value="categoryItem?.name")
    InputText.flex-1(label=" Price" type="number" name="price" :value="categoryItem?.price")
    slot

</template>

<script lang="ts" setup>
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { defineProps, defineEmits, defineModel, defineExpose } from 'vue';

// Props
const props = defineProps({
  categoryItem: { type: Object, required: true },
});

// Emit events
const emit = defineEmits(['onSubmit', 'onDelete']);

// Validation schema
const formSchema = yup.object({
  name: yup.string().trim().required().min(2).max(500).label('Item Name'),
  price: yup
    .number()
    .required()
    .label('Price')
    .transform((value: any, originalValue: any) => (String(originalValue).trim() === '' ? null : value)),
});

// Form setup
const { handleSubmit, errors, validate, values } = useForm({ validationSchema: formSchema });

const formRef = ref();

//  Emit submittion values
const onSubmit = handleSubmit((values: any) => {
  emit('onSubmit', { name: values.name, id: props.categoryItem.id, price: Number(values.price) });
});

// Expose methods to the parent component
defineExpose({ onSubmit, validate, errors, values });
</script>
