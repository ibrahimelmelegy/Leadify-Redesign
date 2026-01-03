<template lang="pug">
ClientOnly
  VForm(v-slot="{ handleSubmit: formHandleSubmit }" :validation-schema="formSchema")
    el-form(autocomplete="off" @submit.prevent="formHandleSubmit(onSubmit)" ref="formRef" label-position="top")
      .card.m-auto.bg-neutral-50.p-6.rounded-3xl.mb-4
        .flex.justify-between.items-center.mb-4
          h3.text-xl.font-semibold.my-4 Invoice
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
          InputText(label="Invoice Number" name="invoiceNumber" :value="invoice?.invoiceNumber")
          InputText(label="Invoice Amount" type="number" name="amount" :value="invoice?.amount")
          InputDate.mt-4(label="Invoice Due Date (Optional)" placeholder="Enter Invoice Due Date" :value="invoice?.invoiceDate" name="invoiceDate")
          InputSelect.mt-4(
            label="Invoice Collected (Optional)"
            placeholder="Choose Invoice Collected"
            name="collected"
            :options="[{ label: 'Yes', value: true }, { label: 'No', value: false }]"
            :value="invoice?.collected"
            @change="handleCollectedChange"
          )
          InputDate(
            label="Invoice Collected Date (Optional)"
            v-if="isCollected"
            placeholder="Enter Invoice Collected Date"
            :value="invoice?.collectedDate"
            name="collectedDate"
          )
</template>

<script lang="ts" setup>
  import { useForm } from "vee-validate";
  import * as yup from "yup";
  import { defineProps, defineEmits, defineModel, defineExpose } from "vue";
  import { Delete } from "@element-plus/icons-vue";
  import { id } from "yup-locales";

  // Props
  const props = defineProps({
    invoice: { type: Object, required: true },
    editMode: { type: Boolean, required: false },
  });

  // Emit events
  const emit = defineEmits(["onSubmit", "onDelete"]);

  // Validation schema
  const formSchema = yup.object({
    invoiceNumber: yup.string().trim().required().min(2).max(50).label("Invoice Number"),
    amount: yup
      .number()
      .required()
      .label("Invoice Amount")
      .transform((value: any, originalValue: any) => (String(originalValue).trim() === "" ? null : value)),
    invoiceDate: yup.date().nullable().label("Invoice Due Date"),
    collectedDate: yup.date().nullable().label("Invoice Collected Date"),
    collected: yup.string().trim().nullable().label("Invoice Collected"),
  });

  // Form setup
  const { handleSubmit, errors, validate, values } = useForm({ validationSchema: formSchema });

  const formRef = ref();

  //  Emit submittion values
  const onSubmit = handleSubmit((values: any) => {
    const formattedValues = {
      ...values,
      id: props.invoice.id,
      collectedDate: isCollected.value ? values.collectedDate : null,
    };
    emit("onSubmit", formattedValues);
  });

  // Emit delete
  function onDelete() {
    emit("onDelete", props.invoice.id);
  }

  /**
   * Handles the change event for the "collected" field.
   */
  const isCollected = ref(false);
  function handleCollectedChange(value: any) {
    if (value.label === "Yes") {
      isCollected.value = true;
    } else {
      isCollected.value = false;
    }
  }
  if (props.invoice?.collected) {
    isCollected.value = true;
  }

  // Expose methods to the parent component
  defineExpose({ onSubmit, validate, errors, values });
</script>
