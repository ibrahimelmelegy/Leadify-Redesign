<template lang="pug">
.card.m-auto.bg-white.p-10.rounded-3xl(class="2xl:w-1/2 w-[90%]")
  .flex.justify-between.items-center.mb-4
    span
    el-button(size='medium' plain type="primary" :icon="Plus" native-type="button" @click="AddDelivery" class="!rounded-2xl !py-2.5 !px-4") Add Delivery
  DealFormDelivery(
    v-for="(delivery, index) in deliveries"
    :key="delivery.id"
    :delivery="delivery"
    :index="index"
    ref="childRefs"
    @onDelete="onDelete(delivery.id)"
    @onSubmit="onSubmit"
    :editMode="editMode && index+1 <= props.deliveries.length"
  )
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { v4 as uuidv4 } from 'uuid'; // To generate unique IDs
import { ElMessage } from 'element-plus';
const emit = defineEmits(['onSubmit', 'isValid']);
const route = useRoute();
const props = defineProps({
  deliveries: {
    type: Array,
    required: true,
  },
  editMode: {
    type: Boolean,
    required: false,
  },
});

// Reactive delivery array
const deliveries = ref<Delivery[]>([
  {
    id: uuidv4(),
    deliveryDetails: '',
    deliveryDate: null,
  },
]);

if (props.deliveries?.length) {
  deliveries.value = props.deliveries.map((delivery: any) => ({
    deliveryDetails: delivery.deliveryDetails,
    deliveryDate: delivery.deliveryDate,
    id: delivery.id,
  }));
}

// Refs for child forms
const childRefs = ref<Record<string, any>>({});
// Add a new delivery
async function AddDelivery() {
  if (!(await validateForm())) return;

  deliveries.value.push({
    id: uuidv4(),
    deliveryDetails: '',
    deliveryDate: null,
  });
}

/**
 * Deletes an delivery from the list of deliveries.
 * @param {string} id - The ID of the delivery to delete.
 * @returns {void}
 */
function onDelete(id: string) {
  // Filter out the delivery to be deleted from the list of deliveries
  deliveries.value = deliveries.value.filter((delivery: Delivery) => delivery.id !== id);
}

/**
 * Submits an delivery form, either updating an existing delivery or adding a new one.
 * @param {Delivery} values - The submitted delivery form values.
 * @returns {void}
 */
function onSubmit(values: Delivery) {
  const index = deliveries.value.findIndex((delivery: Delivery) => delivery.id === values.id);

  if (index !== -1) {
    // Update an existing delivery
    deliveries.value[index] = { ...values };
  } else {
    // Add a new delivery
    deliveries.value.push(values);
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

function checkNoDeliveries() {
  const deliveryCount = deliveries.value.length;

  if (deliveryCount === 0) return true;
  if (deliveryCount > 1) return false;

  // Clone the invoice and remove the `id` field
  const { id, ...clonedDelivery } = childRefs.value[0]?.values; // Exclude `id` during destructuring
  // Check if all values (excluding `id`) are nullish
  return Object.values(clonedDelivery).every(isNullish);
}

/**
 * Submits all forms and logs the final data for API submission.
 * @returns {Promise<void>}
 */
async function onSubmitDeliveries() {
  if (checkNoDeliveries()) {
    emit('isValid', true);
    return;
  }
  const isSubmitted = await onSubmitForm();

  // Only proceed if all forms are submitted successfully
  if (!isSubmitted) {
    emit('isValid', false);
    ElMessage.error('Please fill in all the required in delivery fields.');
    return;
  }

  // Prepare and log final data for API
  const cleanedDeliveries = deliveries.value.map(({ id, ...data }: Delivery) => ({
    ...data,
    deliveryDate: getYear(data.deliveryDate),
  }));
  emit('isValid', true);
  if (route.path.includes('edit')) {
    emit('onSubmit', deliveries.value);
  } else {
    emit('onSubmit', cleanedDeliveries);
  }
}

defineExpose({ onSubmitDeliveries });
</script>
