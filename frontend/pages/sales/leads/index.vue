<template lang="pug">
div
  //- Header
  .flex.items-center.justify-between.mb-8
    .title.font-bold.text-2xl.mb-1.capitalize Leads
    .flex.items-center.gap-x-3
      NuxtLink(to="/sales/leads/add-lead")
        el-button(   size='large' :loading="loading" v-if="hasPermission('CREATE_LEADS')" native-type="submit" type="primary" :icon="Plus" class="w-full !my-4 !rounded-2xl")  New Lead
      el-dropdown(trigger="click")
          span.el-dropdown-link
              button.rounded-btn(class="!px-4"): Icon(  name="IconToggle" size="24")
          template(#dropdown)
              el-dropdown-menu
                el-dropdown-item
                  button.flex.items-center(:to="`/leads/1`" @click="triggerFileInput" type="button")
                    Icon.text-md.mr-2(size="20" name="IconImport" )
                    p.text-sm Import
                //- NuxtLink(:to="`/leads/1`")
                //-   el-dropdown-item
                //-     NuxtLink.flex.items-center(:to="`/leads/1`")
                //-       Icon.text-md.mr-2(size="20" name="IconExport" )
                //-       p.text-sm Export
                //- el-dropdown-item
                //-     NuxtLink.flex.items-center(:to="`/leads/1`")
                //-       Icon.text-md.mr-2(size="20" name="IconArchived" )
                //-       p.text-sm Archived
  input(type="file", ref="fileInput", style="display: none", accept=".xls,.xlsx", @change="handleFileChange")
  // Spinner
  el-spinner(size="large" v-if="loadingAction" class="nuxt-loading-indicator")
  AppTable(v-slot="{data}"  v-if="!loadingAction" :externalLoading="loading" :filterOptions="filterOptions" :columns="table.columns" position="lead" :pageInfo="response.pagination"  :data="table.data" :sortOptions="table.sort" @handleRowClick="handleRowClick" searchPlaceholder="leads" :key="table.data" )
    .flex.items-center.py-2(@click.stop)
        //- NuxtLink.toggle-icon(:to="`/leads/1`")
        //-     Icon.text-md(name="IconEye" )

        el-dropdown(class="outline-0" trigger="click")
            span(class="el-dropdown-link")
              .toggle-icon.text-md
                  Icon(name="IconToggle"  size="22")
            template(#dropdown='')
                el-dropdown-menu
                    el-dropdown-item
                      NuxtLink.flex.items-center(:to="`/sales/leads/${data?.id}`")
                        Icon.text-md.mr-2(name="IconEye" )
                        p.text-sm View
                    el-dropdown-item( v-if="hasPermission('EDIT_LEADS')")
                      NuxtLink.flex.items-center(:to="`/sales/leads/edit/${data?.id}`")
                        Icon.text-md.mr-2(name="IconEdit" )
                        p.text-sm Edit
                    //- el-dropdown-item(@click="[deleteLeadPopup=true, userActionId = data?.id]" )
                    //-     .flex.items-center
                    //-       Icon.text-md.mr-2(name="IconDelete" )
                    //-       p.text-sm Delete
  ActionModel(v-model="qualifiedLeadPopup" :loading="loadingAction" btn-text="Save" description="Would you like to convert this lead into an Opportunity or a Deal?" @confirm = "editPresent" )
   template(#input)
    InputSelect(label=" Present " @change ="setPresent" :options="leadPresent"  )
</template>

<script setup lang="ts">
  const router = useRouter();
  import { ElNotification } from "element-plus";
  import { Plus } from "@element-plus/icons-vue";
  const { hasPermission } = await usePermissions();
  const loadingAction = ref(false);
  const loading = ref(false);
  const present = ref("");
  const select = ref();
  const qualifiedLeadPopup = ref(false);

  const leadPresent = [
    {
      label: "Convert to Opportunity",
      value: "opportunity",
    },
    {
      label: "Convert to Deal",
      value: "deal",
    },
    {
      label: "Not Now",
      value: "now",
    },
  ];

  async function setPresent(pre: any) {
    present.value = pre.value;
  }

  async function changeStatus(id: any, newStatus: any) {
    const lead: any = await getLead(id);
    loadingAction.value = true;
    try {
      await updateLead({ ...lead, leadState: newStatus, id: id });
    } catch {
    } finally {
      const response = await useTableFilter("lead");
      table.value.data = response.formattedData;
      loadingAction.value = false;
    }
  }

  async function submitForm(values: any) {
    try {
      if (values?.status === "QUALIFIED") {
        qualifiedLeadPopup.value = true;
        select.value = values;
      }
      if (values?.status !== "QUALIFIED") changeStatus(values?.id, values?.status);
    } catch {}
  }

  async function editPresent() {
    await changeStatus(select.value?.id, select.value?.status);
    if (present.value === "opportunity") router.push(`/sales/opportunity/add-opportunity?leadId=${select.value?.id}`);
    if (present.value === "deal") router.push(`/sales/deals/add-deal?leadId=${select.value?.id}`);
    qualifiedLeadPopup.value = false;
    present.value = "";
    select.value = {};
  }

  const table = ref({
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
        type: "select",
        filters: [
          { text: "New", value: "NEW", actions: submitForm },
          { text: "Contacted", value: "CONTACTED", actions: submitForm },
          { text: "Disqualified", value: "DISQUALIFIED", actions: submitForm },
          { text: "Qualified", value: "QUALIFIED", actions: submitForm },
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
      // { prop: 'actions', label: 'Actions', sortable: false },
    ],
    data: [] as Lead[],
    sort: [
      { prop: "price", order: "ascending", value: "PRICE_ASC" },
      { prop: "price", order: "descending", value: "PRICE_DESC" },
      { prop: "identity", order: "ascending", value: "IDENTITY_ASC" },
      { prop: "identity", order: "descending", value: "IDENTITY_DESC" },
    ],
  });

  // Call API to Get the lead
  // const response = await getLeads();
  let response;
  response = await useTableFilter("lead");
  table.value.data = response.formattedData;
  function handleRowClick(val: any) {
    router.push(`/sales/leads/${val.id}`);
  }

  let users = await useApiFetch("users");
  const mappedUsers = users?.body?.docs?.map((e: any) => ({
    label: e.name,
    value: e.id,
  }));

  const filterOptions = [
    {
      title: "Status",
      value: "status",
      options: [...leadStates],
    },
    {
      title: "Lead Source",
      value: "leadSource",
      options: [...leadSources],
    },
    {
      title: "Assigned user",
      value: "userId",
      options: [...mappedUsers],
    },
    {
      title: "Creation Date",
      value: ["fromDate", "toDate"],
      type: "date",
    },
    {
      title: "Last Contact Date",
      value: ["fromLastContactDate", "toLastContactDate"],
      type: "date",
    },
  ];

  // implement import leads

  const fileInput = ref<HTMLInputElement | null>(null);

  const triggerFileInput = () => {
    fileInput.value?.click();
  };

  const handleFileChange = async (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    // Validate file type
    const validTypes = ["application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"];
    if (!validTypes.includes(file.type)) {
      ElNotification({
        type: "error",
        title: "Error",
        message: "Please upload a valid Excel file (.xls or .xlsx)",
      });
      target.value = ""; // Reset input
      return;
    }
    loading.value = true;
    try {
      const fileResponse = await useApiFetch("lead/import", "POST", formData, false, true);
      if (!fileResponse?.success) {
        ElNotification({
          type: "error",
          title: "Error",
          message: fileResponse?.message || "Failed to import file",
        });
        return;
      }
      // Refresh leads after import
      response = await useTableFilter("lead");
      table.value.data = response.formattedData;

      ElNotification({
        type: "success",
        title: "success",
        message: "Leads successfully imported.",
      });
    } catch (err) {
      ElNotification({
        type: "error",
        title: "Error",
        message: "Failed to import file",
      });
    } finally {
      // Reset the file input so you can upload the same file again if needed
      target.value = "";
      loading.value = false;
    }
  };
</script>
