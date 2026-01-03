<template lang="pug">
div
  //- Header
  .flex.items-center.justify-between.mb-8
    .title.font-bold.text-2xl.mb-1.capitalize Opportunity
    .flex.items-center.gap-x-3
      NuxtLink(to="/sales/opportunity/add-opportunity")
        el-button(size='large' :loading="loading" v-if="hasPermission('CREATE_OPPORTUNITIES')" native-type="submit" type="primary" :icon="Plus" class="w-full !my-4 !rounded-2xl") New Opportunity
      //- el-dropdown(trigger="click")
      //-     span.el-dropdown-link
      //-         button.rounded-btn(class="!px-4"): Icon(  name="IconToggle" size="24")
      //-     template(#dropdown)
      //-         el-dropdown-menu
      //-           el-dropdown-item
      //-             NuxtLink.flex.items-center(:to="`/opportunity/1`")
      //-               Icon.text-md.mr-2(size="20" name="IconImport" )
      //-               p.text-sm Import
      //-           NuxtLink(:to="`/opportunity/1`")
      //-             el-dropdown-item
      //-               NuxtLink.flex.items-center(:to="`/opportunity/1`")
      //-                 Icon.text-md.mr-2(size="20" name="IconExport" )
      //-                 p.text-sm Export
      //-           el-dropdown-item
      //-               NuxtLink.flex.items-center(:to="`/opportunity/1`")
      //-                 Icon.text-md.mr-2(size="20" name="IconArchived" )
      //-                 p.text-sm Archived
  AppTable(v-slot="{data}" v-if="!loadingAction" :filterOptions="filterOptions" :columns="table.columns" position="opportunity" :pageInfo="response.pagination" :data="table.data" :sortOptions="table.sort" @handleRowClick="handleRowClick" searchPlaceholder="opportunity" )
    .flex.items-center.py-2(@click.stop)
        //- NuxtLink.toggle-icon(:to="`/opportunities/1`")
        //-     Icon.text-md(name="IconEye" )

        el-dropdown(class="outline-0" trigger="click")
            span(class="el-dropdown-link")
              .toggle-icon.text-md
                  Icon(name="IconToggle"  size="22")
            template(#dropdown='')
                el-dropdown-menu
                    el-dropdown-item
                      NuxtLink.flex.items-center(:to="`/sales/opportunity/${data?.id}`")
                        Icon.text-md.mr-2(name="IconEye" )
                        p.text-sm View
                    el-dropdown-item( v-if="hasPermission('EDIT_OPPORTUNITIES')")
                      NuxtLink.flex.items-center(:to="`/sales/opportunity/edit/${data?.id}`")
                        Icon.text-md.mr-2(name="IconEdit" )
                        p.text-sm Edit
                    //- el-dropdown-item(@click="[deleteLeadPopup=true, userActionId = data?.id]" )
                    //-     .flex.items-center
                    //-       Icon.text-md.mr-2(name="IconDelete" )
                    //-       p.text-sm Delete
  ActionModel(v-model="deleteLeadPopup" :loading="loadingAction" btn-text="Move to Archive" description-one="Are you sure you want to delete this Opportunity?" icon="/images/delete-image.png" description-two="It will be archived and can be restored later within 30 days." )
  ActionModel(v-model="wonPopup" :loading="loadingAction" btn-text="Save" description="Would you like to convert this opportunity into a Deal or a Project?" @confirm = " editPresent" )
   template(#input)
    InputSelect(v-if="select?.status === 'WON' " label=" Present " @change ="setPresent" :options="opportunityPresent"  )
    InputSelect( v-if="select?.status === 'LOST' " label=" Reason for lose" @change ="setReasons" :options="reasonOptions" )
</template>

<script setup lang="ts">
  const router = useRouter();
  import { Plus } from "@element-plus/icons-vue";
  const { hasPermission } = await usePermissions();
  const loadingAction = ref(false);
  const deleteLeadPopup = ref(false);

  const present = ref("");
  const reasons = ref("");
  const select = ref();
  const wonPopup = ref(false);

  const opportunityPresent = [
    {
      label: "Convert to Deal",
      value: "deal",
    },
    {
      label: "Convert to Project",
      value: "project",
    },
    {
      label: "Not Now",
      value: "now",
    },
  ];

  async function setPresent(pre: any) {
    present.value = pre.value;
  }
  async function setReasons(pre: any) {
    reasons.value = pre.value;
    console.log(pre.value);
  }

  async function changeStage(id: any, newStage: any) {
    const opportunity: any = await getOpportunity(id);
    loadingAction.value = true;
    try {
      await updateOpportunity({ stage: newStage }, id);
    } catch {
    } finally {
      const response = await useTableFilter("opportunity");
      table.data = response.formattedData;
      loadingAction.value = false;
    }
  }

  async function editWithResone() {
    const opportunity: any = await getOpportunity(select.value?.id);
    loadingAction.value = true;
    try {
      await updateOpportunity({ stage: select.value?.status, reasonOfLose: reasons.value }, select.value?.id);
    } catch {
    } finally {
      const response = await useTableFilter("opportunity");
      table.data = response.formattedData;
      loadingAction.value = false;
    }
  }

  async function submitForm(values: any) {
    try {
      if (values?.status === "WON" || values?.status === "LOST") {
        wonPopup.value = true;
        select.value = values;
      }
      if (values?.status !== "WON" && values?.status !== "LOST") changeStage(values?.id, values?.status);
    } catch {}
  }

  async function editPresent() {
    if (select?.value?.status === "LOST") {
      await editWithResone();
    } else {
      await changeStage(select.value?.id, select.value?.status);
      if (present.value === "project")
        router.push(`/operations/projects/add-project?opportunityId=${select.value?.id}&leadId=${select.value?.leadId}`);
      if (present.value === "deal")
        router.push(`/sales/deals/add-deal?opportunityId=${select.value?.id}&leadId=${select.value?.leadId}`);
    }
    wonPopup.value = false;
    present.value = "";
    reasons.value = "";
    select.value = {};
  }

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
        type: "select",
        filters: stageOptions.map((stage) => ({ text: stage.label, value: stage.value, actions: submitForm })),
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
        prop: "profit",
        label: "Profit",
        component: "Text",
        // sortable: true,
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
      // { prop: 'actions', label: 'Actions', sortable: false },
    ],
    data: [] as Opportunities[],
  });

  // Call API to Get the lead
  // const response = await getopportunity();

  const response = await useTableFilter("opportunity");
  table.data = response.formattedData;

  function handleRowClick(val: any) {
    router.push(`/sales/opportunity/${val.id}`);
  }

  let users = await useApiFetch("users");
  const mappedUsers = users?.body?.docs?.map((e: any) => ({
    label: e.name,
    value: e.id,
  }));

  const filterOptions = [
    {
      title: "Opportunity Stage",
      value: "stage",
      options: [...stageOptions],
    },
    {
      title: "Assigned user",
      value: "userId",
      options: [...mappedUsers],
    },
    {
      title: "Priority",
      value: "priority",
      options: [...priorityOptions],
    },
    {
      title: "Expected Close Date",
      value: ["fromExpectedCloseDate", "toExpectedCloseDate"],
      type: "date",
    },
    {
      title: "Estimated Budget",
      value: ["fromEstimatedValue", "toEstimatedValue"],
      type: "input",
    },
    {
      title: "Profit",
      value: ["fromProfit", "toProfit"],
      type: "input",
    },
  ];
</script>
