<template lang="pug">
el-drawer(v-model="drawer", direction="rtl", :show-close="false" destroy-on-close	)
  template(#header="{ close, titleId, titleClass }")
    h4(:id="titleId", class="text-xl text-neutral-700 font-semibold") Filter
    button(@click="close", class="ml-auto flex items-center text-neutral-700")
      Icon(name="IconFilterClose" size="32")
  template(#default)
    .border-t.border-neutral-100
    el-collapse(v-model="activeNames", @change="handleCollapseChange")
      el-collapse-item(v-for="(item, index) in data" :key="index" :title="item.title" :name="(index + 1).toString()")
        TableFilterDateRange(v-if="item.type === 'date'" :key="checkList" :value="checkList" :position="item.value" @value="handleDateChange")
        .grid.grid-cols-2.gap-3(v-else-if="item.type === 'input' && item.value?.length === 2")
          InputText(label="from" type="number" :value="Number(checkList?.[item.value?.[0]]?.[0])" :name="item?.value?.[0]" placeholder="10 $" @value="(value) => handleInputChange(value, item?.value?.[0])")
          InputText(label="to" type="number" :value="Number(checkList?.[item.value?.[1]]?.[0])"  :name="item.value[1]" placeholder="20 $", @value="(value) => handleInputChange(value, item.value?.[1])")
        InputText(v-else-if="item.type === 'input' && typeof item.value === 'string'" :key="checkList" type="number" :value="Number(checkList?.[item.value])"  :name="item.value" placeholder="20 $", @value="(value) => handleInputChange(value, item.value)")
        el-checkbox-group(v-else v-model="checkList[item.value]" class="flex flex-col" @change="handleSelectChange($event, item.value)")
          el-checkbox(v-for="option in item.options" :key="option.value" :label="option.label" :value="option.value")
            | {{ option.label }}
  template(#footer)
    .flex.align-center.border-t-2.border-neutral-100.pt-4
      el-button.flex-1(@click="resetFilters", size="large", class="!rounded-2xl !text-secondary-blue-500 !border-secondary-blue-500") Reset
      el-button.flex-1(type="primary", @click="applyFilters", size="large", class="!rounded-2xl")
        span.mr-1 Apply
        span(v-if="selectedFiltersCount") ({{ selectedFiltersCount }})
</template>

<script lang="ts" setup>
  import { ref, computed, defineModel, defineProps, defineEmits } from "vue";
  const route = useRoute();
  const query = { ...route.query };
  const router = useRouter();
  const props = defineProps({
    filterOptions: {
      type: Array as PropType<FilterCategory[]>,
      default: [],
      required: true,
    },
  });
  const emit = defineEmits(["filter", "reset"]);
  // Drawer state
  const drawer = defineModel();

  // Collapse open state
  const activeNames = ref<string[]>([]);

  // CheckList: Store selected options for each filter category
  const checkList = ref<Record<string, string | string[] | number[]>>({});

  if (globalFilterOptions.value) {
    // Create a processed object from globalFilterOptions
    const processedFilterOptions = Object.entries(globalFilterOptions.value).reduce(
      (acc, [key, value]) => {
        if (key === "userId") {
          // Convert userId values to numbers (array or single value)
          acc[key] = Array.isArray(value)
            ? value.map((e: any) => Number(e)) // Map string array to number array
            : typeof value === "string"
            ? [Number(value)] // Convert single string to an array of numbers
            : []; // Default to an empty array if no valid value
        } else {
          // Ensure all other values are arrays if they are strings
          acc[key] = Array.isArray(value)
            ? value // Keep array as-is
            : typeof value === "string"
            ? [value] // Wrap single string in an array
            : value; // Keep other types unchanged
        }
        return acc;
      },
      {} as Record<string, any> // Define accumulator type
    );

    // Assign processed values back to the checkList
    checkList.value = processedFilterOptions;
  } else {
    // If globalFilterOptions is undefined, retain an empty object
    checkList.value = {};
  }
  interface FilterOption {
    label: string;
    value: string;
  }

  interface FilterCategory {
    title: string;
    options?: FilterOption[];
    type?: string;
    value?: string;
  }

  const data = ref<FilterCategory[]>([]);
  data.value = props.filterOptions.length ? props.filterOptions : [];
  // Initialize activeNames (all panels open by default)
  activeNames.value = data.value.map((_: any, index: number) => (index + 1).toString());

  // Count of selected filters across all categories
  const selectedFiltersCount = computed(() =>
    Object.values(checkList.value as Record<string, string[]>).reduce(
      (acc: number, selected: string[]) => acc + selected.length,
      0
    )
  );

  // Event Handlers
  const handleInputChange = (value: any, type: string) => {
    checkList.value[type] = value ? [Number(value)] : [];
  };

  const handleSelectChange = (selectedValues: string[], categoryTitle: string) => {
    checkList.value[categoryTitle] = [...selectedValues];
  };

  const resetFilters = () => {
    checkList.value = {};
    emit("reset", checkList.value);
  };

  const handleDateChange = (date: Date, type: string) => {
    if (!date) {
      checkList.value[type] = [];
      return;
    }
    checkList.value[type] = [getYear(date.toISOString())];
  };

  const applyFilters = () => {
    emit("filter", checkList.value);
  };

  onMounted(() => {
    numberOfFilters.value = filterLength(checkList.value);
  });
</script>
<style scopped>
  .el-checkbox__label {
    color: #5f5a6a !important;
  }
</style>
