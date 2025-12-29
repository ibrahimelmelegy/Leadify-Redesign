<template lang="pug">
  el-dialog(v-model='dialog' width='750' align-center='' title="Add New Item Row" append-to-body)
    .flex.gap-3.items-center.mb-3(v-for="(item, index) in checkList" :key="item.id")
      el-checkbox(v-model="selectedItems" :value="item" :selected="isSelected(item)")
      InputText.flex-1(label="Item Name" :name="'name_' + item.id" disabled :value="item.name")
      InputText.flex-1(label="Price" type="number" :name="'price_' + item.id" disabled :value="item.price")
      InputText(
        label="Item Quantity"
        type="number"
        placeholder="Enter Item Quantity"
        :name="'quantity_' + item.id"
        :value="item.quantity"
        v-if="isSelected(item)"
        @value="(value) => (item.quantity = value)"
      )
    template(#footer='')
      .dialog-footer
        .flex.mt-4.justify-end
          el-button(  class="!rounded-2xl" @click='dialog = false' size="large" ) Cancel
          el-button(class="!rounded-2xl" type='primary' @click='onSubmit' size="large" :loading="loading") Add
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, defineModel } from 'vue';

const props = defineProps({
  title: String,
  descriptionOne: String,
  descriptionTwo: String,
  addMaterial: Object,
  // Changed the type from Array to Object because allAddMaterialItems is an object with keys
  allAddMaterialItems: Object,
  isNew: Boolean,
  loading: Boolean,
  icon: String,
  btnText: String,
});

const emit = defineEmits(['confirm', 'submit']);

// Initialize checklist
const checkList = ref([]);

// Track selected items
const selectedItems = ref<any[]>([]);

// ✅ Update checklist based on condition:
// - If addMaterial.id exists in allAddMaterialItems, use that data.
// - Otherwise, fallback to addMaterial.materialItem.
if (props.addMaterial?.id && props.allAddMaterialItems && props.allAddMaterialItems[props.addMaterial.id]) {
  if (!props.isNew) {
    let filterAddMaterial = props.addMaterial.materialItem;
    filterAddMaterial.forEach((item: any) => {
      const matchedItem = props.allAddMaterialItems?.[props.addMaterial?.id]?.find(
        (material: any) => material.id === item.id
      );
      if (matchedItem) {
        item.quantity = matchedItem.quantity; // Update the quantity in materialItem
      }
    });
    checkList.value = filterAddMaterial;
  } else {
    checkList.value = props.addMaterial.materialItem;
  }
} else if (props.addMaterial?.materialItem?.length) {
  checkList.value = props.addMaterial.materialItem;
}

// Update selectedItems (only items with quantity)
selectedItems.value = checkList.value.filter((item: any) => item.quantity > 0);

// Function to check if an item is selected 👍
const isSelected = (item: any) => selectedItems.value.some((i: any) => i.id === item.id);

// Collect data on form submit and emit the data
const onSubmit = () => {
  const selectedData = selectedItems.value.map((item: any) => ({
    name: item.name,
    id: item.id,
    quantity: +item.quantity || 1,
    price: +item.price,
  }));
  emit('confirm', {
    // Using addMaterial id as key and mapping to the selected data
    [`${props.addMaterial?.id}`]: [...selectedData],
  });
  dialog.value = false; // Close the dialog
};

const dialog = defineModel();
</script>
