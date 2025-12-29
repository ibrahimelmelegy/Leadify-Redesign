<template lang="pug">
OperationsMaterialFormCategoryItem(
  v-for="(categoryItem, index) in categoryItems"
  :key="categoryItem.id"
  :categoryItem="categoryItem"
  :index="index"
  ref="childRefs"
  @onSubmit="onSubmit"
)
  .flex.align-center(v-if="index === categoryItems.length - 1")
    el-button.mt-7(
      size="medium"
      plain
      type="primary"
      :icon="Plus"
      native-type="button"
      class="!rounded-2xl !py-6 !px-3"
      @click="AddCategoryItem"
    )
    el-button.mt-7(
      v-if="categoryItems.length > 1 && categoryItems.length > items.length"
      size="medium"
      plain
      type="danger"
      :icon="Delete"
      native-type="button"
      class="!rounded-2xl !py-6 !px-3"
      @click="onDelete(categoryItem.id)"
    )
  el-button.mt-7(
    v-if="!editMode && index !== categoryItems.length - 1"
    size="medium"
    plain
    type="danger"
    :icon="Delete"
    native-type="button"
    class="!rounded-2xl !py-6 !px-3"
    @click="onDelete(categoryItem.id)"
  )
</template>

<script lang="ts" setup>
import { ref, defineExpose, defineEmits } from 'vue';
import { v4 as uuidv4 } from 'uuid'; // To generate unique IDs
import { ElMessage } from 'element-plus';
import { Delete, Plus } from '@element-plus/icons-vue';

const props = defineProps({
  items: {
    type: Array,
    required: true,
    default: [],
  },
  editMode: {
    type: Boolean,
    required: false,
  },
});
const route = useRoute();
const emit = defineEmits(['onSubmit']);
// Reactive categoryItem array
const categoryItems = ref<CategoryItem[]>([
  {
    id: uuidv4(),
    name: '',
    price: null,
  },
]);

if (props.items?.length) {
  categoryItems.value = props.items.map(({ name, price, id }: any) => ({ name, price, id }));
}
const loading = ref(false);
// Refs for child forms
const childRefs = ref<Record<string, any>>({});
// Add a new categoryItem
async function AddCategoryItem() {
  if (!(await validateForm())) return;

  categoryItems.value.push({
    id: uuidv4(),
    name: '',
    price: null,
  });
}

/**
 * Deletes a category item from the list of category items.
 * @param {string} id - The ID of the category item to delete.
 * @returns {void}
 */
function onDelete(id: string): void {
  // Filter out the category item to be deleted from the list of category items
  categoryItems.value = categoryItems.value.filter((Item: CategoryItem) => Item.id !== id);
}

/**
 * Handles the submission of a category item form, either creating a new category item or updating an existing one.
 * @param {CategoryItem} values - The submitted category item form values.
 */
function onSubmit(values: CategoryItem) {
  const index = categoryItems.value.findIndex((Item: CategoryItem) => Item.id === values.id);

  if (index !== -1) {
    // Update an existing category item
    categoryItems.value[index] = { ...values };
  } else {
    // Add a new category item
    categoryItems.value.push(values);
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

/**
 * Submits all category item forms and logs the final data for API submission.
 * Validates and ensures all forms are submitted successfully before proceeding.
 * If any form submission fails, displays an error message.
 * Prepares the cleaned category items data for further processing.
 * @returns {Promise<void>}
 */

async function onSubmitCategoryItems(): Promise<void> {
  const isSubmitted = await onSubmitForm();

  // Only proceed if all forms are submitted successfully
  if (!isSubmitted) {
    return;
  }

  // Prepare and log final data for API
  const cleanedCategoryItems = categoryItems.value.map(({ id, ...data }: CategoryItem) => data);
  if (route.path.includes('edit')) {
    const cleanedCategories = categoryItems.value.map(({ id, ...data }: CategoryItem) => ({
      ...data,
      ...(props.items?.find((item: any) => item.id === id) ? { id } : {}),
    }));
    emit('onSubmit', cleanedCategories);
  } else {
    emit('onSubmit', cleanedCategoryItems);
  }
}

defineExpose({ onSubmitCategoryItems });
</script>
