<template lang="pug">
.flex.items-center.justify-between.mb-5.mt-5
  .title.font-bold.text-2xl.mb-1.capitalize Project Details
  el-dropdown(trigger="click")
    span.el-dropdown-link
      button.rounded-btn(class="!px-4"): Icon(name="IconToggle", size="24")
    template(#dropdown)
      el-dropdown-menu
        el-dropdown-item(v-if="hasPermission('EDIT_PROJECTS')")
          NuxtLink.flex.items-center(
            :to="`/operations/projects/edit/${project?.id}`"
          )
            Icon.text-md.mr-2(size="20", name="IconEdit")
            p.text-sm Edit
        el-dropdown-item(@click="addShow = true")
          .flex.items-center
            Icon.text-md.mr-2(size="20", name="IconAdd")
            p.text-sm Create Folder
        //- el-dropdown-item
        //-   .flex.items-center
        //-     Icon.text-md.mr-2(size="20" name="IconRestore" )
        //-     p.text-sm Convert to
        //- el-dropdown-item
        //-   .flex.items-center
        //-     Icon.text-md.mr-2(size="20" name="IconDeal" )
        //-     p.text-sm Project
        //- el-dropdown-item
        //-   .flex.items-center
        //-     Icon.text-md.mr-2(size="20" name="IconProject" )
        //-     p.text-sm Project
        //- el-dropdown-item
        //-   .flex.items-center
        //-     Icon.text-md.mr-2(size="20" name="IconDelete" )
        //-     p.text-sm Delete
el-tabs.demo-tabs(v-model="activeName", @tab-click="handleClick")
  el-tab-pane(label="Information", name="information")
    .flex-1.bg-white.p-10.rounded-3xl
      .grid.gap-4.grid-cols-1(class="md:grid-cols-2 lg:grid-cols-4")
        div
          .text-neutral-400.font-medium.mb-2.flex.items-center
            Icon.mr-2(name="tabler:category-2", size="20")
            p Project Name
          p.text-neutral-800.mb-2 {{ project?.name }}
        div
          .text-neutral-400.font-medium.mb-2.flex.items-center
            Icon.mr-2(name="IconAssign", size="20")
            p Client
          p.text-neutral-800.mb-2 {{ project?.client?.clientName }}
        div
          .text-neutral-400.font-medium.mb-2.flex.items-center
            Icon.mr-2(name="solar:hashtag-outline", size="20")
            p Project Type
          p.text-neutral-800.mb-2 {{ formatSnakeCase(project?.type) }}
        div
          .text-neutral-400.font-medium.mb-2.flex.items-center
            Icon.mr-2(name="IconProjectStatus", size="20")
            p Project Status
          span.border.rounded-xl.text-xs.px-2(
            :class="`label-outline-${getStatusColor(valueMap[project?.status])}`"
          ) {{ formatSnakeCase(project?.status) }}
        div
          .text-neutral-400.font-medium.mb-2.flex.items-center
            Icon.mr-2(name="IconCalendar", size="20")
            p Start Date
          p.text-neutral-800.mb-2 {{ getYear(project?.startDate) }}
        div
          .text-neutral-400.font-medium.mb-2.flex.items-center
            Icon.mr-2(name="IconCalendar", size="20")
            p End Date
          p.text-neutral-800.mb-2 {{ getYear(project?.endDate) }}
        div
          .text-neutral-400.font-medium.mb-2.flex.items-center
            Icon.mr-2(name="solar:hashtag-outline", size="20")
            p Duration
          p.text-neutral-800.mb-2 {{ project?.duration }}
        div
          .text-neutral-400.font-medium.mb-2.flex.items-center
            Icon.mr-2(name="IconAssign", size="20")
            p Assign to
          p.text-neutral-800.mb-2 {{ project?.assignedUsers?.map((user: any) => user?.name).join(", ") }}

    .flex.align-center.gap-6.mt-3.flex-col(class="xl:flex-row")
      .flex-1.bg-white.p-10.rounded-3xl(v-if="project?.etimadProject")
        h4.text-lg.font-semibold.text-neutral-900.mb-4 Etimad Project
        .grid.gap-4.grid-cols-1(class="md:grid-cols-2 lg:grid-cols-4")
          div
            .text-neutral-400.font-medium.mb-2.flex.items-center
              Icon.mr-2(name="solar:hashtag-outline", size="20")
              p Abbreviation
            p.text-neutral-800.mb-2 {{ project?.etimadProject?.abbreviation }}
          div
            .text-neutral-400.font-medium.mb-2.flex.items-center
              Icon.mr-2(name="solar:hashtag-outline", size="20")
              p Organization Name
            p.text-neutral-800.mb-2 {{ project?.etimadProject?.organizationName }}
          div
            .text-neutral-400.font-medium.mb-2.flex.items-center
              Icon.mr-2(name="solar:hashtag-outline", size="20")
              p RFP Name
            p.text-neutral-800.mb-2 {{ project?.etimadProject?.rfpName }}
          div
            .text-neutral-400.font-medium.mb-2.flex.items-center
              Icon.mr-2(name="solar:hashtag-outline", size="20")
              p Contract Type
            p.text-neutral-800.mb-2 {{ project?.etimadProject?.contractType }}
          div
            .text-neutral-400.font-medium.mb-2.flex.items-center
              Icon.mr-2(name="solar:hashtag-outline", size="20")
              p Tender Price
            p.text-neutral-800.mb-2 {{ project?.etimadProject?.tenderPrice }}
          div
            .text-neutral-400.font-medium.mb-2.flex.items-center
              Icon.mr-2(name="solar:hashtag-outline", size="20")
              p Business Line
            p.text-neutral-800.mb-2 {{ project?.etimadProject?.businessLine }}
          div
            .text-neutral-400.font-medium.mb-2.flex.items-center
              Icon.mr-2(name="solar:hashtag-outline", size="20")
              p Estimated Budget
            p.text-neutral-800.mb-2 {{ project?.etimadProject?.estimatedBudget }}
          div
            .text-neutral-400.font-medium.mb-2.flex.items-center
              Icon.mr-2(name="solar:hashtag-outline", size="20")
              p Company Margin
            p.text-neutral-800.mb-2 {{ project?.etimadProject?.companyMargin }}
          div
            .text-neutral-400.font-medium.mb-2.flex.items-center
              Icon.mr-2(name="solar:hashtag-outline", size="20")
              p remaining Days
            p.text-neutral-800.mb-2 {{ project?.etimadProject?.remainingDays }}
          div
            .text-neutral-400.font-medium.mb-2.flex.items-center
              Icon.mr-2(name="IconProjectStatus", size="20")
              p Application Status
            span.border.rounded-xl.text-xs.px-2(
              :class="`label-outline-${getStatusColor(project?.etimadProject?.applicationStatus)}`"
            ) {{ formatSnakeCase(project?.etimadProject?.applicationStatus) }}
          div
            .text-neutral-400.font-medium.mb-2.flex.items-center
              Icon.mr-2(name="IconProjectStatus", size="20")
              p Proposal Status
            span.border.rounded-xl.text-xs.px-2(
              :class="`label-outline-${getStatusColor(project?.etimadProject?.proposalStatus)}`"
            ) {{ formatSnakeCase(project?.etimadProject?.proposalStatus) }}
          div
            .text-neutral-400.font-medium.mb-2.flex.items-center
              Icon.mr-2(name="IconCalendar", size="20")
              p Submission Date
            p.text-neutral-800.mb-2 {{ getYear(project?.etimadProject?.submissionDate) }}
    .flex.align-center.gap-6.mt-3.flex-col(class="xl:flex-row")
      .flex-1.bg-white.p-10.rounded-3xl(v-if="project?.description")
        h4.text-lg.font-semibold.text-neutral-900.mb-4 Project Description
        p.text-neutral-800.leading-relaxed {{ project?.description }}
      .bg-white.p-10.rounded-3xl
        p.text-lg.font-semibold.text-neutral-900.mb-3 Summary
        .flex.justify-between.items-center.gap-60.mb-4
          p.text-base.text-neutral-400 Subtotal :
          p.text-base.text-neutral-900 {{ project?.grandTotal || 0 }} SAR
        .flex.justify-between.items-center.gap-60.mb-4
          p.text-base.text-neutral-400 VAT (15%):
          p.text-base.text-neutral-900 {{ project?.vat || 0 }} SAR
        .flex.justify-between.items-center.gap-12.mb-4
          p.text-base.text-neutral-400 Discount :
          p.text-base.text-neutral-900 {{ project.discount || 0 }} SAR
        .flex.justify-between.items-center.gap-12.mb-4.border-b.pb-4
          p.text-base.text-neutral-400 Margin ({{ project.marginPercentage || 0 }}%) :
          p.text-base.text-neutral-900 {{ project?.marginAmount?.toFixed(2) }} SAR
        .flex.justify-between.items-center.gap-60.mb-4
          p.text-base.text-neutral-900 Total Project Cost :
          p.text-base.text-neutral-900 {{ project?.totalCost || 0 }} SAR
  el-tab-pane(label="Vehicles", name="vehicles")
    .bg-white.p-10.rounded-3xl.mt-3
      AppTable(
        without-filters,
        without-search,
        without-action,
        without-pagination,
        :columns="vehicles.columns",
        :data="vehicles.data",
        class="!py-0"
      )
  el-tab-pane(label="Manpower", name="project")
    .bg-white.p-10.rounded-3xl.mt-3
      AppTable(
        without-filters,
        without-search,
        without-action,
        without-pagination,
        :columns="manpowers.columns",
        :data="manpowers.data",
        class="!py-0"
      )
    .title.font-bold.text-xl.capitalize.flex-1.mt-8 Perview
    .bg-white.rounded-3xl.mt-3.border
      AppTable(
        without-filters,
        without-search,
        without-action,
        without-pagination,
        :columns="manPowerPreview.columns",
        :data="manPowerPreview.data",
        class="!py-0"
      )
    .bg-white.p-10.rounded-3xl.mt-3
      AppTable(
        without-filters,
        without-search,
        without-action,
        without-pagination,
        :columns="manPowertotal.columns",
        :data="manPowertotal.data",
        class="!py-0"
      )
  el-tab-pane(label="Materials", name="materials")
    .bg-white.p-10.rounded-3xl.mt-3
      AppTable(
        without-filters,
        without-search,
        without-action,
        without-pagination,
        :columns="materials.columns",
        :data="materials.data",
        class="!py-0"
      )
    .bg-white.p-10.rounded-3xl.mt-3
      AppTable(
        without-filters,
        without-search,
        without-action,
        without-pagination,
        :columns="materialsPreview.columns",
        :data="materialsPreview.data",
        class="!py-0"
      )
  el-tab-pane(label="Assets", name="assets")
    .bg-white.p-10.rounded-3xl.mt-3
      AppTable(
        without-filters,
        without-search,
        without-action,
        without-pagination,
        :columns="assets.columns",
        :data="assets.data",
        class="!py-0"
      )
    .bg-white.p-10.rounded-3xl.mt-3
      AppTable(
        without-filters,
        without-search,
        without-action,
        without-pagination,
        :columns="assetsTotal.columns",
        :data="assetsTotal.data",
        class="!py-0"
      )
  el-tab-pane(label="Preview", name="preview")
    OperationsProjectsShowPreview(
      :project="project",
      :manPowerPreview="finalCost"
    )
  el-tab-pane(label="proposal", name="proposal")
    .bg-white.rounded-3xl.mt-3.border.px-2
      .title.font-bold.text-xl.capitalize.flex-1.mt-8 proposal
        AppTable(
          without-filters,
          without-search,
          without-action,
          without-pagination,
          :columns="table?.columns",
          :data="table?.data",
          class="!py-0"
        )
  el-tab-pane(label="Folders", name="folders")
    .relative
      el-skeleton(:loading="loading" animated)
        template(#template)
          .grid.grid-cols-4.gap-4.grid-cols-1(class="md:grid-cols-2 lg:grid-cols-4")
            .rounded-3xl.m-3.p-5.bg-white(v-for="i in 4" :key="i")
              .text-neutral-600
                .flex.flex-row.justify-between
                  el-skeleton-item(variant="image" style="width: 40px; height: 40px")
                  el-skeleton-item(variant="button" style="width: 30px; height: 30px")
                el-skeleton-item(variant="text" style="width: 60%")
                el-skeleton-item(variant="text" style="width: 30%")
        template(#default)
          OperationsProjectsShowFolders(
            @onSubmit="handleSubmit",
            :project="project"
          )

  el-tab-pane(label="Activity log", name="activity")
    .mt-6.activity
      .flex.items-start.gap-x-6.mb-7.w-full(
        v-for="item in activity?.docs",
        class="lg:w-6/12"
      )
        .flex.items-center.justify-center.w-12.h-12.rounded-full(
          class="!min-w-[48px] !min-h-[48px]",
          :class="handleTypeStyle(item.status)"
        ): Icon(
          :name="handleIconName(item.status)",
          size="24"
        )
        .mt-2
          h4.text-neutral-800.font-semibold.text-sm.mb-1 {{ item?.status == "assigned" ? "Assigned User" : item?.status == "create" ? "Create New Project" : item?.status?.toString()?.toUpperCase() }}
          p.text-neutral-500.text-xs.mb-4.font-medium {{ formatDate(item?.createdAt) }}
          .bg-white.p-5.rounded-3xl(class="w-[65vw]")
            p.text-neutral-700.text-xs {{ item?.descripion?.toString()?.toUpperCase() }}
            .flex.items-center.gap-3.gap-x-2.mt-4
              Avatar(
                :src="item?.user?.profilePicture ?? '/images/avatar.png'",
                small
              )
              p.text-neutral-800.text-xs.font-medium {{ item?.user?.name }}
    el-empty(
      v-if="activity?.docs?.length == 0 || !activity?.docs",
      description="No activity recorded for this project.",
      image="/images/empty.png"
    )
    .flex.justify-center.items-center.w-full
      el-button.mb-2(
        v-if="activity?.docs?.length > 0",
        :loading="loading",
        class="!rounded-2xl",
        type="primary",
        size="large",
        :disabled="activity?.pagination?.totalPages == activity?.pagination?.page",
        @click="getActivityPage(Number(activity?.pagination?.page) + 1)"
      ) View More
el-dialog(
  v-model="addShow",
  class="!shadow-none xl:!w-[50%] lg:!w-[70%] sm:!w-[90%] !w-full",
  align-center="",
  @close="handleDialogClose"
)
  .title.font-bold.text-xl.capitalize Project Folders
  OperationsProjectsFolders(
    @onSubmit="handleSubmit",
    @onCancel="handleCancel",
    :project="project"
  )
</template>
<script lang="ts" setup>
  const activeName = ref("information");
  const route = useRoute();
  const loading = ref(false);
  const addShow = ref(false);
  const { hasPermission } = await usePermissions();
  const handleSubmit = async () => {
    loading.value = true;
    addShow.value = false;
    // Refresh project data
    project = await getProject(route.params.slug.toString());
    loading.value = false;
  };

  const handleCancel = () => {
    addShow.value = false;
  };

  const handleDialogClose = () => {
    addShow.value = false;
  };

  const handleTypeStyle = (type: string) => {
    switch (type) {
      case "assigned":
        return "bg-primary-purple-50 text-primary-purple-500";
      case "update":
        return "bg-secondary-turquoise-50 text-secondary-turquoise-700";
      case "restored":
        return "bg-semantic-warning-background text-semantic-warning-foreground";
      case "create":
        return "bg-primary-purple-50 text-primary-purple-500";
      case "delete":
        return "bg-semantic-error-background text-semantic-error-foreground";
      case "archived":
        return "bg-neutral-100 text-neutral-500";
      case "import":
        return "bg-secondary-blue-100 text-secondary-blue-600";
      case "export":
        return "bg-secondary-turquoise-100 text-secondary-turquoise-900";
      default:
        return "";
    }
  };

  const handleIconName = (type: string) => {
    switch (type) {
      case "assigned":
        return "IconAssign";
      case "update":
        return "IconEdit";
      case "restored":
        return "IconRestore";
      case "create":
        return "IconNewLead";
      case "delete":
        return "IconDelete";
      case "archived":
        return "IconArchived";
      case "import":
        return "IconImport";
      case "export":
        return "IconExport";
      default:
        return "";
    }
  };

  const activity = ref();

  // mock data for integrate till api is ready
  let project = await getProject(route.params.slug.toString());

  const respons = await getProjectActivity(route.params.slug + `?limit=10` + "&&page=1");
  activity.value = respons;

  const getActivityPage = async (page: number) => {
    try {
      loading.value = true;
      const responsPage = await getProjectActivity(route.params.slug + `?limit=10` + `&&page=${page}`);
      activity.value = {
        docs: [...activity.value.docs, ...responsPage.docs],
        pagination: responsPage.pagination,
      };
    } finally {
      loading.value = false;
    }
  };

  const valueMap = {
    ACTIVE: "PROJECT_ACTIVE",
    CANCELLED: "PROJECT_CANCELLED",
    COMPLETED: "PROJECT_COMPLETED",
    ON_HOLD: "PROJECT_ON_HOLD",
  };

  // vehicles table

  const vehicles = reactive({
    columns: [
      {
        prop: "plate",
        label: "Plate Number",
        component: "Text",
        // sortable: true,
        type: "font-bold",
        width: 130,
      },
      {
        prop: "manufacturer",
        label: "Manufacturer",
        component: "Text",
        // sortable: true,
        type: "font-bold",
        width: 150,
      },
      {
        prop: "rentCost",
        label: "Rent Cost",
        component: "Text",
        // sortable: true,
        type: "font-default",
        width: 120,
      },
      {
        prop: "gasCost",
        label: "Gas Cost",
        component: "Text",
        // sortable: true,
        type: "font-default",
        width: 120,
      },
      {
        prop: "oilCost",
        label: "Oil Cost",
        component: "Text",
        // sortable: true,
        type: "font-default",
        width: 150,
      },
      {
        prop: "regularMaintenanceCost",
        label: "Regular Maintenance Cost",
        component: "Text",
        // sortable: true,
        type: "font-default",
        width: 250,
      },
      {
        prop: "totalCost",
        label: "Total Cost",
        component: "Text",
        // sortable: true,
        type: "font-default",
        width: 250,
      },
    ],
    data: [] as Vehicle[],
  });

  if (project?.vehicles?.length) {
    vehicles.data =
      project?.vehicles?.map((vehicle: Vehicle) => ({
        ...vehicle,
        totalCost:
          Number(vehicle.rentCost || 0) +
          Number(vehicle.gasCost || 0) +
          Number(vehicle.oilCost || 0) +
          Number(vehicle.regularMaintenanceCost || 0),
      })) || [];
  }

  //  manpower table
  const manpowers = ref({
    columns: [
      {
        prop: "name",
        label: "Manpower Name",
        component: "Text",
        // sortable: true,
        type: "font-bold",
        width: 150,
      },
      {
        prop: "estimatedWorkDays",
        label: "Estimated Work Days ",
        component: "Text",
        // sortable: true,
        type: "font-bold",
        width: 180,
      },
      {
        prop: "mission",
        label: "Mission",
        component: "Text",
        // sortable: true,
        type: "font-default",
        width: 120,
      },
      {
        prop: "durationCost",
        label: "Duration Cost",
        component: "Text",
        // sortable: true,
        type: "font-default",
        width: 150,
      },
      {
        prop: "foodAllowanceCost",
        label: "Food Allowance Cost",
        component: "Text",
        // sortable: true,
        type: "font-default",
        width: 200,
      },
      {
        prop: "accommodationCostPerManpower",
        label: "Accommodation Cost/Manpower",
        component: "Text",
        // sortable: true,
        type: "font-default",
        width: 270,
      },
      {
        prop: "carRentPerManpower",
        label: "Car Rent/Manpower",
        component: "Text",
        // sortable: true,
        type: "font-default",
        width: 200,
      },
      {
        prop: "otherCosts",
        label: "Other Costs",
        component: "Text",
        // sortable: true,
        type: "font-default",
        width: 150,
      },
      {
        prop: "totalCost",
        label: "Total Cost",
        component: "Text",
        // sortable: true,
        type: "font-default",
        width: 150,
      },
    ],
    data: [] as ProjectManpower[],
  });
  const manPowertotal = ref({
    columns: [
      {
        prop: "totalCost",
        label: "Total Cost",
        component: "Text",
        // sortable: true,
        type: "font-bold",
        width: 130,
      },
      {
        prop: "finalManpowerTableTotalCost",
        label: "Final Manpower Table Total Cost",
        component: "Text",
        // sortable: true,
        type: "font-bold",
        width: 150,
      },
    ],
    data: [] as any,
  });

  const table = reactive({
    columns: [
      {
        prop: "title",
        label: "Proposal Title",
        component: "Text",
        sortable: true,
        type: "font-bold",
        width: 200,
      },
      {
        prop: "version",
        label: "Version",
        component: "Text",
        sortable: true,
        type: "font-default",
        width: 150,
      },
      {
        prop: "relatedEntity",
        label: "Related to",
        component: "Text",
        sortable: true,
        type: "font-default",
        width: 150,
      },
      {
        prop: "type",
        label: "Type",
        component: "Text",
        sortable: true,
        type: "font-default",
        filters: [
          { text: "Financial", value: "FINANCIAL" },
          { text: "Technical", value: "TECHNICAL" },
          { text: "Tech & Financial", value: "MIXED" },
        ],
        width: 150,
      },
      {
        prop: "proposalFor",
        label: "Client Name",
        component: "Text",
        sortable: true,
        type: "font-bold",
        width: 200,
      },
      {
        prop: "status",
        label: "Status",
        component: "Label",
        type: "outline",
        filters: [
          { text: "Approved", value: "APPROVED" },
          { text: "Waiting Approval", value: "WAITING_APPROVAL" },
          { text: "Rejected", value: "REJECTED" },
        ],
        width: 150,
      },
      {
        prop: "reference",
        label: "Reference",
        component: "Text",
        sortable: true,
        type: "font-bold",
        width: 200,
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
    data: [] as Client[],
  });

  const response = await useTableFilter(`proposal?relatedEntityId=${route.params.slug}&page=1&limit=100`);
 table.data =response.formattedData?.map((el:any) => {return {...el,
  type :el.type == "Mixed"  ? 'Tech & Financial' : el.type}})

  const manPowerPreview = ref({
    columns: [
      {
        prop: "totalCarRent",
        label: "Total Car Rent",
        component: "Text",
        // sortable: true,
        type: "font-bold",
        width: 130,
      },
      {
        prop: "totalCarRentDuration",
        label: "Total Car Rent/Duration",
        component: "Text",
        // sortable: true,
        type: "font-bold",
        width: 150,
      },
      {
        prop: "resourceCount",
        label: "Resource Count",
        component: "Text",
        // sortable: true,
        type: "font-default",
        width: 120,
      },
    ],
    data: [] as any,
  });

  let manpowersResponse = await useTableFilter("manpower");
  manpowersResponse = manpowersResponse.formattedData;

  if (project?.projectManpowerResources?.length) {
    manpowers.value.data =
      project?.projectManpowerResources?.map((manpower: any) => ({
        ...manpower,
        name: manpowersResponse?.find((item: any) => item.id === manpower?.manpowerId)?.name || "-",
        mission: manpower?.mission?.join(", "),
      })) || [];
    manPowertotal.value.data = [
      {
        totalCost: project?.manpowerTotalCost,
        finalManpowerTableTotalCost: project?.finalManpowerTotalCost,
      },
    ];
    manPowerPreview.value.data = [
      {
        totalCarRent: project?.totalCarRent,
        totalCarRentDuration: project?.totalCarRentPerDuration,
        resourceCount: manpowers.value.data?.length || 0,
      },
    ];
  }

  // materials table

  const materials = ref({
    columns: [
      {
        prop: "description",
        label: "Description",
        component: "Text",
        type: "font-default",
        width: 400,
      },
      {
        prop: "quantity",
        label: "Quantity",
        component: "Text",
        type: "font-default",
        width: 150,
      },
      {
        prop: "unitPrice",
        label: "Unit Price",
        component: "Text",
        type: "font-default",
        width: 120,
      },
      {
        prop: "additionalMaterial",
        label: "Additional Material Category",
        component: "Text",
        type: "font-default",
        width: 250,
      },
      {
        prop: "additionalMaterialCost",
        label: "Additional Material Cost",
        component: "Text",
        type: "font-default",
        width: 200,
      },
      {
        prop: "marginCommission",
        label: "Margin Commission",
        component: "Text",
        type: "font-default",
        width: 180,
      },
      {
        prop: "service",
        label: "Service",
        component: "Text",
        type: "font-default",
        width: 120,
      },
      {
        prop: "servicePrice",
        label: "Service Price",
        component: "Text",
        type: "font-default",
        width: 120,
      },
      {
        prop: "materialCost",
        label: "Material Cost",
        component: "Text",
        type: "font-default",
        width: 200,
      },
      {
        prop: "totalMaterialCost",
        label: "Total Material Cost",
        component: "Text",
        type: "font-default",
        width: 200,
      },
    ],
    data: [] as any,
  });
  const materialsPreview = ref({
    columns: [
      {
        prop: "totalMaterialCost",
        label: "Total Material Cost",
        component: "Text",
        type: "font-default",
        width: 200,
      },
      // {
      //   prop: 'totalAdditionalMaterialCost',
      //   label: 'Total Additional Material Cost',
      //   component: 'Text',
      //   type: 'font-default',
      //   width: 300,
      // },
    ],
    data: [] as any,
  });

  let serviceResponse = await useTableFilter("service");
  serviceResponse = serviceResponse?.formattedData || [];

  let addMaterials = await useTableFilter("additional-material");
  addMaterials = addMaterials?.formattedData || [];

  function materialMappedData() {
    if (!project?.materials?.length) return [];
    return project?.materials.map((material: any) => {
      // const additionalMaterials = project?.additionalMaterialItem[material.additionalMaterialId || 0] || [];
      const additionalMaterials =
        project?.additionalMaterialItem?.filter(
          (item: any) => item.AdditionalMaterialItem.additionalMateria === material.additionalMaterialId
        ) || [];

      console.log("material", material);
      const totalAdditionalMaterialCost = additionalMaterials.reduce((sum: number, item: any) => {
        return sum + item.quantity * Number(item.AdditionalMaterialItem?.price || 0);
      }, 0);

      const totalRelatedQuantity = project?.materials
        .filter((m: any) => m.additionalMaterialId === material.additionalMaterialId)
        .reduce((sum: number, item: any) => sum + item.quantity, 0);

      const additionalMaterialCost = totalRelatedQuantity > 0 ? totalAdditionalMaterialCost / totalRelatedQuantity : 0;
      const marginCommission = (material.unitPrice + additionalMaterialCost) * (project?.materialMargin.value || 1);
      const materialCost = material.unitPrice + additionalMaterialCost + marginCommission + (material.service?.price || 0);
      const totalMaterialCost = materialCost * material.quantity;

      return {
        projectId: project.id,
        materialId: material.id,
        additionalMaterialId: material.additionalMaterialId,
        additionalMaterial: material.additionalMaterialId
          ? addMaterials?.find((item: any) => item.id === material.additionalMaterialId)?.name
          : "-",
        description: material.description,
        quantity: material.quantity,
        unitPrice: material.unitPrice,
        additionalMaterialCost: +additionalMaterialCost.toFixed(2),
        marginCommission: +marginCommission.toFixed(2),
        materialCost: +materialCost.toFixed(2),
        totalMaterialCost: +totalMaterialCost.toFixed(2),
        service: material.serviceId ? serviceResponse?.find((s: any) => s.id === material.serviceId)?.type : "-",
        servicePrice: material.serviceId ? serviceResponse?.find((s: any) => s.id === material.serviceId)?.price : 0,
        id: material.id,
      };
    });
  }

  if (project?.materials?.length) {
    materials.value.data = materialMappedData();
    materialsPreview.value.data = [
      {
        totalMaterialCost: materialMappedData()?.reduce((sum: number, item: any) => sum + item.totalMaterialCost, 0),
        totalAdditionalMaterialCost: materialMappedData()?.reduce(
          (sum: number, item: any) => (sum += item.additionalMaterialCost),
          0
        ),
      },
    ];
  }

  // Assets table

  const assets = reactive({
    columns: [
      {
        prop: "name",
        label: "Assets Name",
        component: "Text",
        // sortable: true,
        type: "font-bold",
        width: 150,
      },
      {
        prop: "rentPrice",
        label: "Rent Price",
        component: "Text",
        // sortable: true,
        type: "font-bold",
        width: 150,
      },
      {
        prop: "buyPrice",
        label: "Buy Price",
        component: "Text",
        // sortable: true,
        type: "font-bold",
        width: 150,
      },
    ],
    data: [] as Asset[],
  });
  const assetsTotal = reactive({
    columns: [
      {
        prop: "totalRentPrice",
        label: "Total Rent Price",
        component: "Text",
        // sortable: true,
        type: "font-default",
        width: 150,
      },
      {
        prop: "totalBuyPrice",
        label: "Total Buy Price",
        component: "Text",
        // sortable: true,
        type: "font-default",
        width: 150,
      },
      {
        prop: "totalAssetsCost",
        label: "Total Assets Cost",
        component: "Text",
        // sortable: true,
        type: "font-default",
        width: 150,
      },
    ],
    data: [] as any,
  });

  let assetsResponse = await useTableFilter("asset");
  assetsResponse = assetsResponse?.formattedData || [];

  if (project?.projectAssets?.length) {
    let assetsId = project?.projectAssets?.map((projectAsset: any) => projectAsset.assetId);

    assets.data = assetsResponse?.filter(({ id }: Asset) => assetsId?.includes(id)) || [];
    // Calculate the total rent price by summing the rentPrice of each asset, ensuring the value is a number
    const totalRentPrice = assets.data?.reduce((acc: number, { rentPrice }: Asset) => acc + (Number(rentPrice) || 0), 0);

    // Calculate the total buy price by summing the buyPrice of each asset, ensuring the value is a number
    const totalBuyPrice = assets.data?.reduce((acc: number, { buyPrice }: Asset) => acc + (Number(buyPrice) || 0), 0);

    // Calculate the total assets cost by adding total rent price and buy price, ensuring the values are numbers
    const totalAssetsCost = (totalRentPrice || 0) + (totalBuyPrice || 0);
    assetsTotal.data = [
      {
        totalRentPrice,
        totalBuyPrice,
        totalAssetsCost,
      },
    ];
  }

  const finalCost = ref({
    columns: [
      {
        prop: "finalManpowerTableTotalCost",
        label: "Manpower Table  Cost",
        component: "Text",
        // sortable: true,
        type: "font-default",
        width: 270,
      },
      {
        prop: "finalMaterialsTableCost",
        label: "Materials Table Cost ",
        component: "Text",
        // sortable: true,
        type: "font-default",
        width: 250,
      },
      {
        prop: "finalAssetsTableCost",
        label: "Assets Table Cost",
        component: "Text",
        // sortable: true,
        type: "font-default",
        width: 250,
      },
    ],
    data: [] as any,
  });

  finalCost.value.data = [
    {
      finalManpowerTableTotalCost: project?.finalManpowerTotalCost?.toFixed(2),
      finalMaterialsTableCost: project?.totalMaterialCost?.toFixed(2),
      finalAssetsTableCost: project?.totalAssetsCost?.toFixed(2),
      grandTotal: project?.grandTotal?.toFixed(2),
      vat: project?.vat?.toFixed(2),
    },
  ];
</script>
<style scoped lang="scss">
  .activity {
    position: relative;
    ::before {
      content: "";
      height: 100%;
      width: 1px;
      position: absolute;
      left: 24px;
      top: 2%;
      border: 1px dashed #e7e6e9;
      z-index: -1;
    }
    > div:last-of-type {
      background: #f8f7fa !important;
    }
  }
</style>
