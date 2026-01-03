<template lang="pug">
el-form(autocomplete="off" @submit.prevent="onSubmit" ref="formRef" label-position="top")
  .card.m-auto.bg-neutral-50.p-6.rounded-3xl.mb-4
    .flex.justify-between.items-center.mb-4
      h3.text-xl.font-semibold.my-4 Delivery
      el-button(
        v-if="!editMode"
        size="medium"
        plain
        type="primary"
        :icon="Delete"
        native-type="button"
        class="!rounded-2xl !py-5 !px-3"
        @click="onDelete"
      )
    .grid.grid-cols-2.gap-3
      InputText(label="Delivery Details" name="deliveryDetails" :value="delivery?.deliveryDetails")
      InputDate(label="Delivery Date" placeholder="Enter Delivery Date" :value="delivery?.deliveryDate" name="deliveryDate")


</template>

<script lang="ts" setup>
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { defineProps, defineEmits, defineModel, defineExpose } from 'vue';
import { Delete } from '@element-plus/icons-vue';

// Props
const props = defineProps({
  delivery: { type: Object, required: true },
  editMode: { type: Boolean, required: false },
});

// Emit events
const emit = defineEmits(['onSubmit', 'onDelete']);

// Validation schema
const formSchema = yup.object({
  deliveryDetails: yup.string().trim().required().min(2).max(500).label('Delivery Details'),
  deliveryDate: yup.date().required().label('Delivery Date'),
});

// Form setup
const { handleSubmit, errors, validate, values } = useForm({ validationSchema: formSchema });

const formRef = ref();

//  Emit submittion values
const onSubmit = handleSubmit((values: any) => {
  emit('onSubmit', { ...values, id: props.delivery.id });
});

// Emit delete
function onDelete() {
  emit('onDelete', props.delivery.id);
}

// Expose methods to the parent component
defineExpose({ onSubmit, validate, errors, values });
</script>
