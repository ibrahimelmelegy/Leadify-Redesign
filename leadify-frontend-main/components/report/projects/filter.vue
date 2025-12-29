<template lang="pug">
  .flex.align-center.gap-6.mt-3(class="flex-col xl:flex-row")
    .flex-1.bg-white.rounded-3xl
      div.w-full
       div(class="flex border-b-2 border-gray-200")
        button(v-for="(tab, index) in tabs" :key="index"  @click="activeTab = tab" class="py-2 px-4 rounded-[999px] m-2"  :class="{ 'bg-primary-purple-50 text-primary-purple-500': activeTab === tab, 'bg-white text-gray-600  hover:text-primary-purple-500': activeTab !== tab }") {{ tab }}
      div(class="p-4")
          div(v-if= "activeTab === 'Projects'")
           ReportProjectsProjectFilter(@showFilter = "(val) => showFilter(val)")
          div(v-if= "activeTab === 'Manpower'")
           ReportProjectsManpowerFilter(@showFilter = "(val) => showFilter(val)")
          div(v-if= "activeTab === 'Vehicle'")
           ReportProjectsVehicleFilter(@showFilter = "(val) => showFilter(val)")
          div(v-if= "activeTab === 'Service'")
           ReportProjectsServiceFilter(@showFilter = "(val) => showFilter(val)")
           // div(v-if= "activeTab === 'Additional Material'")
          //  ReportProjectsMaterialFilter(@showFilter = "(val) => showFilter(val)")
          div(v-if= "activeTab === 'Asset'")
           ReportProjectsAssetFilter(@showFilter = "(val) => showFilter(val)")
  div(class="pt-4")
   div(v-if= "activeTab === 'Projects'")
    ReportProjectsProjectTable(:filters="filter" :user="user" :hasExport="hasPermission('EXPORT_PROJECT_REPORTS')")
   div(v-if= "activeTab === 'Manpower'")
    ReportProjectsManpowerTable(:filters="filter" :user ="user" :hasExport="hasPermission('EXPORT_PROJECT_REPORTS')")
   div(v-if= "activeTab === 'Vehicle'")
    ReportProjectsVehicleTable(:filters="filter" :user ="user"  :hasExport="hasPermission('EXPORT_PROJECT_REPORTS')")
   div(v-if= "activeTab === 'Service'")
    ReportProjectsServiceTable(:filters="filter" :user ="user" :hasExport="hasPermission('EXPORT_PROJECT_REPORTS')")
   div(v-if= "activeTab === 'Asset'")
    ReportProjectsAssetTable(:filters="filter" :user ="user" :hasExport="hasPermission('EXPORT_PROJECT_REPORTS')")
  //  div(v-if= "activeTab === 'Additional Material'")
  //   ReportProjectsMaterialTable(:filters="filter" :user ="user")
  </template>

<script lang="ts" setup>
  const { hasPermission } = await usePermissions();
  import { ref } from "vue";
  const props = defineProps({
    user: {
      type: Object,
      required: true,
    },
  });

  const route = useRoute();
  const router = useRouter();
  const tabs = ref(["Projects", "Manpower", "Vehicle", "Service", "Asset"]);
  const activeTab = ref(tabs.value[0]);

  const filter = ref();

  const showFilter = (val: any) => {
    filter.value = val;
  };

  const handleReset = async () => {
    filter.value = {};
    await router.push({ path: route.path, query: {} });
    numberOfFilters.value = 0;
  };

  watch(
    () => activeTab.value,
    () => {
      handleReset();
    }
  );
</script>
