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
    position="lead"
    :pageInfo="response.pagination"
    :data="table.data"
    :sortOptions="table.sort"
    :withoutAction="true"
    :withoutSearch="true"
    :withoutFilters="true"
    :exportButton="hasExport"
  )
  ActionModel(v-model="exportPopup" :loading="loadingExport" btn-text="Export" description="Please enter the email address where the Excel file will be received." @confirm = "confirmClick" )
   template(#input)
    InputText( v-if="exportPopup" label="Email " @change ="setEmail" :value="email" )
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
        prop: "leadDetails",
        label: "Lead Name",
        component: "AvatarText",
        sortable: true,
        type: "font-bold",
        width: 170,
      },
      {
        prop: "phone",
        label: "Phone",
        component: "Text",
        sortable: true,
        type: "font-default",
        width: 150,
      },
      {
        prop: "email",
        label: "Email",
        component: "Text",
        sortable: true,
        type: "font-default",
        width: 200,
      },
      {
        prop: "status",
        label: "Status",
        component: "Label",
        sortable: true,
        type: "outline",
        filters: [
          { text: "New", value: "NEW" },
          { text: "Contacted", value: "CONTACTED" },
          { text: "Disqualified", value: "DISQUALIFIED" },
          { text: "Qualified", value: "QUALIFIED" },
        ],
        width: 150,
      },

      {
        prop: "leadSource",
        label: "Source",
        component: "Text",
        sortable: true,
        type: "font-default",
        width: 150,
      },
      {
        prop: "lastContactDate",
        label: "Last Contact",
        component: "Text",
        sortable: true,
        type: "font-default",
        width: 150,
      },
      {
        prop: "assign",
        label: "Assigned",
        component: "Text",
        type: "font-default",
        selectable: true,
        width: 200,
      },
      {
        prop: "createdAt",
        label: "Created",
        component: "Text",
        sortable: true,
        type: "font-default",
        width: 200,
      },
    ],
    data: [] as Lead[],
    sort: [
      { prop: "price", order: "ascending", value: "PRICE_ASC" },
      { prop: "price", order: "descending", value: "PRICE_DESC" },
      { prop: "identity", order: "ascending", value: "IDENTITY_ASC" },
      { prop: "identity", order: "descending", value: "IDENTITY_DESC" },
    ],
  });

  const response = await getLeads();
  table.data = response.leads;

  const getData = async () => {
    isLoading.value = true;
    const response = await useTableFilter("lead", props?.filters);
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
      const res = await useTableFilter(`lead/excel/${email.value}`, props?.filters);
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
