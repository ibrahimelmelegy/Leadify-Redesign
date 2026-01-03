<template lang="pug">
.flex.align-center.gap-6.mt-3(class="flex-col xl:flex-row")
  .flex-1.bg-white.rounded-3xl
    div.w-full
     div(class="flex border-b-2 border-gray-200")
      button(v-for="(tab, index) in tabs" :key="index"  @click="activeTab = tab" class="py-2 px-4 rounded-[999px] m-2"  :class="{ 'bg-primary-purple-50 text-primary-purple-500': activeTab === tab, 'bg-white text-gray-600  hover:text-primary-purple-500': activeTab !== tab }") {{ tab }}
    div(class="p-4")
        div(v-if= "activeTab === 'Lead'")
         ReportSalesLeadFilter(@showFilter = "(val) => showFilter(val)")
        div(v-if= "activeTab === 'Opportunity'")
         ReportSalesOpportunityFilter(@showFilter = "(val) => showFilter(val)")
        div(v-if= "activeTab === 'Deal'")
         ReportSalesDealFilter(@showFilter = "(val) => showFilter(val)")
        div(v-if= "activeTab === 'Client'")
         ReportSalesClientFilter(@showFilter = "(val) => showFilter(val)")
        // div(v-if= "activeTab === 'Proposal'")
        //  ReportSalesProposalFilter(@showFilter = "(val) => showFilter(val)")
div(class="pt-4")
 div(v-if= "activeTab === 'Lead'")
         ReportSalesLeadTable(:filters="filter" :user ="user" :hasExport="hasPermission('EXPORT_SALES_REPORTS')")
 div(v-if= "activeTab === 'Opportunity'")
         ReportSalesOpportunityTable(:filters="filter" :user ="user" :hasExport="hasPermission('EXPORT_SALES_REPORTS')")
 div(v-if= "activeTab === 'Deal'")
         ReportSalesDealTable(:filters="filter" :user ="user" :hasExport="hasPermission('EXPORT_SALES_REPORTS')")
 div(v-if= "activeTab === 'Client'")
         ReportSalesClientTable(:filters="filter" :user ="user" :hasExport="hasPermission('EXPORT_SALES_REPORTS')")
//  div(v-if= "activeTab === 'Proposal'")
//          ReportSalesProposalTable(filter="filter")

</template>

<script lang="ts" setup>
  import { ref } from "vue";
  const { hasPermission } = await usePermissions();
  const props = defineProps({
    user: {
      type: Object,
      required: true,
    },
  });

  const route = useRoute();
  const router = useRouter();
  const tabs = ref(["Lead", "Opportunity", "Deal", "Client"]);
  const activeTab = ref(tabs.value[0]);
  const filter = ref();

  const showFilter = (val: any) => {
    filter.value = val;
  };

  const handleReset = async () => {
    filter.value = {};
    await router.push({ path: route.path, query: {} });
    numberOfFilters.value = 0;
    console.log(route.fullPath, filter.value);
  };

  watch(
    () => activeTab.value,
    () => {
      console.log();
      handleReset();
    }
  );
</script>
