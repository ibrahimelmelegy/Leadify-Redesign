<template lang="pug">
  //- Spinner shown when loading
  .flex.justify-center.items-center.h-64(v-if="isLoading")
    .animate-spin.rounded-full.h-12.w-12.border-4.border-primary-purple-400.border-t-transparent

  //- Show table when not loading
  AppTable(
    v-else
    v-slot="{ data }"
    @exportClick="exportClick"
    :columns="table.columns"
    position="opportunity"
    :pageInfo="response.pagination"
    :data="table.data"
    :sortOptions="table.sort"
    :withoutAction="true"
    :withoutSearch="true"
    :withoutFilters="true"
    :exportButton="true"
  )
  ActionModel(v-model="exportPopup" :loading="loadingExport" btn-text="Export" description="Please enter the email address where the Excel file will be received." @confirm = "confirmClick" )
   template(#input)
    InputText(v-if="exportPopup" label="Email " @change ="setEmail" :value="email")
</template>

<script setup lang="ts">
  const props = defineProps({
    filters: {
      type: Object,
      required: false,
    },
    user: {
      type: Object,
      required: true,
    },
    hasExport: {
      type: Boolean,
      required: false,
    },
  });

  const exportPopup = ref(false);
  const loadingExport = ref(false);
  const email = ref("");

  const isLoading = ref(false);
  const table = reactive({
    columns: [
      {
        prop: "name",
        label: "Opportunity Name",
        component: "Text",
        sortable: true,
        type: "font-bold",
        width: 200,
      },
      {
        prop: "stage",
        label: "Stage",
        component: "Label",
        sortable: true,
        type: "outline",
        filters: stageOptions.map((stage) => ({ text: stage.label, value: stage.value })),
        width: 150,
      },

      {
        prop: "estimatedValue",
        label: "Budget",
        component: "Text",
        sortable: true,
        type: "font-default",
        width: 150,
      },
      {
        prop: "expectedCloseDate",
        label: "Close Date",
        component: "Text",
        sortable: true,
        type: "font-default",
        width: 200,
      },
      {
        prop: "priority",
        label: "Priority",
        component: "Label",
        sortable: true,
        type: "solid",
        filters: priorityOptions.map((priority) => ({ text: priority.label, value: priority.value })),
        width: 150,
      },
      {
        prop: "assign",
        label: "Assigned",
        component: "Text",
        type: "font-default",
        width: 200,
      },
      {
        prop: "createdAt",
        label: "Created",
        component: "Text",
        sortable: true,
        type: "font-default",
        width: 150,
      },
    ],
    data: [] as Opportunities[],
  });

  const response = await getOpportunities();
  table.data = response.opportunties;
  console.log(response.opportunties);

  const getData = async () => {
    isLoading.value = true;
    const response = await useTableFilter("opportunity", props?.filters);
    table.data = response.formattedData;
    isLoading.value = false;
  };

  watch(
    () => props?.filters,
    () => {
      getData();
    }
  );

  async function setEmail(pre: any) {
    email.value = pre.target.value;
  }

  async function exportClick() {
    email.value = await props?.user?.email;
    exportPopup.value = await true;
  }

  async function confirmClick() {
    loadingExport.value = true;
    try {
      const res = await useTableFilter(`opportunity/excel/${email.value}`, props?.filters);
      if (res?.status == "200") {
        ElNotification({
          type: "success",
          title: "Success",
          message: "Send file to email successfully ",
        });
      } else {
        ElNotification({
          type: "error",
          title: "Error",
          message: "Unknown error",
        });
      }
    } catch (error) {
      // Catch any unexpected errors and handle them
      ElNotification({
        type: "error",
        title: "Error",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      email.value = "";
      loadingExport.value = false;
      exportPopup.value = false;
      getData();
    }
  }
</script>
