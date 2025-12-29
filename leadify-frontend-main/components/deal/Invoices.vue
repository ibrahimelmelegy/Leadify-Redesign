<template lang="pug">
.card.m-auto.bg-white.p-10.rounded-3xl(class="2xl:w-1/2 w-[90%]")
  .flex.justify-between.items-center.mb-4
    span
    el-button(size='medium' plain type="primary" :icon="Plus" native-type="button" @click="AddInvoice" class="!rounded-2xl !py-2.5 !px-4") Add Invoice
  DealFormInovice(
    v-for="(invoice, index) in invoices"
    :key="invoice.id"
    :invoice="invoice"
    :index="index"
    ref="childRefs"
    @onDelete="onDelete(invoice.id)"
    @onSubmit="onSubmit"
    :editMode="editMode && index+1 <= props.invoices.length"
  )
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { v4 as uuidv4 } from 'uuid'; // To generate unique IDs
import { ElMessage } from 'element-plus';
const emit = defineEmits(['onSubmit', 'isValid']);
const route = useRoute();
const props = defineProps({
  invoices: {
    type: Array,
    required: true,
  },
  editMode: {
    type: Boolean,
    required: false,
  },
});

// Reactive invoice array
const invoices = ref<Invoice[]>([
  {
    id: uuidv4(),
    invoiceNumber: '',
    amount: null,
    dueDate: null,
    collectedDate: null,
    collected: null,
  },
]);

if (props.invoices?.length) {
  invoices.value = props.invoices.map((invoice: any) => ({
    amount: invoice.amount || null,
    invoiceNumber: invoice.invoiceNumber || '',
    dueDate: new Date(invoice.dueDate),
    collectedDate: new Date(invoice.collectedDate),
    collected: invoice.collected ? true : false,
    id: invoice.id,
  }));
}

// Refs for child forms
const childRefs = ref<Record<string, any>>({});
// Add a new invoice
async function AddInvoice() {
  if (!(await validateForm())) return;

  invoices.value.push({
    id: uuidv4(),
    invoiceNumber: '',
    amount: null,
    dueDate: null,
    collectedDate: null,
    collected: null,
  });
}

/**
 * Deletes an invoice from the list of invoices.
 * @param {string} id - The ID of the invoice to delete.
 * @returns {void}
 */
function onDelete(id: string) {
  // Filter out the invoice to be deleted from the list of invoices
  invoices.value = invoices.value.filter((invoice: Invoice) => invoice.id !== id);
}

/**
 * Submits an invoice form, either updating an existing invoice or adding a new one.
 * @param {Invoice} values - The submitted invoice form values.
 * @returns {void}
 */
function onSubmit(values: Invoice) {
  const index = invoices.value.findIndex((invoice: Invoice) => invoice.id === values.id);

  if (index !== -1) {
    // Update an existing invoice
    invoices.value[index] = { ...values };
  } else {
    // Add a new invoice
    invoices.value.push(values);
  }
}

/**
 * Validates all child forms and returns a boolean indicating whether all forms are valid.
 * @returns {Promise<boolean>} Whether all forms were validated successfully.
 */

// Collect validation promises from all child forms
async function validateForm(): Promise<boolean> {
  const childPromises = childRefs.value.map(async (child: any) => {
    if (child) {
      // Await validation result
      await child.validate();
      // Return true if no errors are present
      return !Object.keys(child.errors).length;
    }
    // If the child is null or undefined, return false
    return false;
  });

  // Await all validation results
  const results = await Promise.all(childPromises);

  // Return true if all children passed validation
  return results.every((isValid: boolean) => isValid);
}

/**
 * Submits all forms and logs the final data for API submission.
 * @returns {Promise<boolean>} Whether all forms were submitted successfully.
 */
async function onSubmitForm(): Promise<boolean> {
  // Validate the form, and exit early if validation fails
  const isFormValid = await validateForm();
  if (!isFormValid) return false;
  try {
    // Collect child submission promises
    const childPromises = childRefs.value.map(async (child: any) => {
      if (child) {
        await child.onSubmit();
      }
    });
    // Wait for all child submissions to complete
    await Promise.all(childPromises);
    return true; // All forms submitted successfully
  } catch (error) {
    ElMessage.error('Submission failed');
    return false; // Submission failed
  }
}

function checkNoInvoices() {
  const invoiceCount = invoices.value.length;

  if (invoiceCount === 0) return true;
  if (invoiceCount > 1) return false;

  // Clone the invoice and remove the `id` field
  const { id, ...clonedInvoice } = childRefs.value[0]?.values; // Exclude `id` during destructuring
  // Check if all values (excluding `id`) are nullish
  return Object.values(clonedInvoice).every(isNullish);
}

/**
 * Submits all forms and logs the final data for API submission.
 * @returns {Promise<void>}
 */
async function onSubmitInvoices() {
  if (checkNoInvoices()) {
    emit('isValid', true);
    return;
  }
  const isSubmitted = await onSubmitForm();

  // Only proceed if all forms are submitted successfully
  if (!isSubmitted) {
    emit('isValid', false);
    console.log('Please fill in all the required in invoices fields.');
    ElMessage.error('Please fill in all the required in invoices fields.');
    return;
  }

  // Prepare and log final data for API
  const cleanedInvoices = invoices.value.map(({ id, ...data }: Invoice) => ({
    ...data,
    dueDate: getYear(data.dueDate),
    collectedDate: getYear(data.collectedDate),
    amount: Number(data.amount),
  }));
  emit('isValid', true);
  if (route.path.includes('edit')) {
    emit('onSubmit', invoices.value);
  } else {
    emit('onSubmit', cleanedInvoices);
  }
}

defineExpose({ onSubmitInvoices });
</script>
