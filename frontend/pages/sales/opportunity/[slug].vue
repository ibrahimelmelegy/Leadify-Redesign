<template lang="pug">
.flex.items-center.justify-between.mb-5.mt-5
  .title.font-bold.text-2xl.mb-1.capitalize Opportunity Details
  el-dropdown(trigger="click")
      span.el-dropdown-link
          button.rounded-btn(class="!px-4"): Icon(  name="IconToggle" size="24")
      template(#dropdown)
          el-dropdown-menu
            el-dropdown-item( v-if="hasPermission('EDIT_OPPORTUNITIES')")
              NuxtLink.flex.items-center(:to="`/sales/opportunity/edit/${opportunity?.id}`")
                Icon.text-md.mr-2(size="20" name="IconEdit" )
                p.text-sm Edit
            el-dropdown-item
              NuxtLink.flex.items-center(:to="`/sales/deals/add-deal?opportunityId=${opportunity?.id}&leadId=${lead?.id}`")
                Icon.text-md.mr-2(size="20" name="IconDeal" )
                p.text-sm Convert to Deal
            //- el-dropdown-item
            //-   .flex.items-center
            //-     Icon.text-md.mr-2(size="20" name="IconRestore" )
            //-     p.text-sm Convert to
            //- el-dropdown-item
            //-   .flex.items-center
            //-     Icon.text-md.mr-2(size="20" name="IconOpportunity" )
            //-     p.text-sm Opportunity
            //- el-dropdown-item
            //-   .flex.items-center
            //-     Icon.text-md.mr-2(size="20" name="IconDeal" )
            //-     p.text-sm Deal
            //- el-dropdown-item
            //-   .flex.items-center
            //-     Icon.text-md.mr-2(size="20" name="IconProject" )
            //-     p.text-sm Project
            //- el-dropdown-item
            //-   .flex.items-center
            //-     Icon.text-md.mr-2(size="20" name="IconDelete" )
            //-     p.text-sm Delete
el-tabs.demo-tabs(v-model="activeName", @tab-click="handleClick")
  el-tab-pane(label="Summary", name="summary")
    .flex.align-center.gap-6.mt-3(class="flex-col xl:flex-row")
      .flex-1.bg-white.p-10.rounded-3xl
        .flex.align-center.gap-3(class="flex-col md:flex-row")
          //- Avatar(src="/images/avatar.png")
          div
            h4.text-2xl.font-semibold.mb-2.text-neutral-900.flex.items-center.gap-x-3 {{opportunity?.name}}
            p.text-neutral-600 {{lead?.companyName}}
        .mt-8
          p.text-neutral-900.font-semibold.mb-6.text-lg Information
          .grid.gap-4(class="md:grid-cols-2 grid-cols-1")
            NuxtLink.text-neutral-400(v-if="lead?.id" :to="`/sales/leads/${lead?.id}`")
              .font-medium.mb-2.flex.items-center
                Icon(name="IconAssign" size="20" class="mr-2")
                p Lead Name
              p.mb-2.underline.text-primary-purple-500 {{lead?.name}}
            div(v-if="lead?.email")
              .text-neutral-400.font-medium.mb-2.flex.items-center
                Icon(name="IconEmail" size="20" class="mr-2")
                p Email
              p.text-neutral-800.mb-2 {{lead?.email}}
            div(v-if="lead?.phone")
              .text-neutral-400.font-medium.mb-2.flex.items-center
                Icon(name="IconPhone" size="20" class="mr-2")
                p Phone Number
              p.text-neutral-800.mb-2 {{lead?.phone}}
            div(v-if="opportunity?.users?.length")
              .text-neutral-400.font-medium.mb-2.flex.items-center
                Icon(name="IconAssign" size="20" class="mr-2")
                p Assign
              p.text-neutral-800.mb-2 {{opportunity?.users?.map((user) => user.name).join(', ')}}
            div(v-if="opportunity?.interestedIn")
              .text-neutral-400.font-medium.mb-2.flex.items-center
                Icon(name="tabler:category-2" size="20" class="mr-2")
                p Products/Services
              p.text-neutral-800.mb-2 {{opportunity?.interestedIn}}
            div
              .text-neutral-400.font-medium.mb-2.flex.items-center
                Icon(name="lucide-lab:dollar-sign-square" size="20" class="mr-2")
                p Estimated Budget
              p.text-neutral-800.mb-2 $ {{opportunity?.estimatedValue}}
            div
              .text-neutral-400.font-medium.mb-2.flex.items-center
                Icon(name="IconCalendar" size="20" class="mr-2")
                p Expected Close Date
              p.text-neutral-800.mb-2 {{getYear(opportunity?.expectedCloseDate)}}
            div(v-if="opportunity?.priority")
              .text-neutral-400.font-medium.mb-2.flex.items-center
                Icon(name="IconPriority" size="20" class="mr-2")
                p Priority
              .items-center(:class="`inline-flex rounded-xl p-1 label-outline-${getStatusColor(formatSnakeCase(opportunity?.priority))}`")
                div(class="h-1.5 w-1.5 rounded-full mr-1" :class="`bg-solid-${getStatusColor(formatSnakeCase(opportunity?.priority))}`")
                span {{ formatSnakeCase(opportunity?.priority) }}
            div
              .text-neutral-400.font-medium.mb-2.flex.items-center.mb-3
                Icon(name="lets-icons:status" size="20" class="mr-2")
                p stage
              span.border.rounded-xl.px-2(:class="`label-outline-${getStatusColor(opportunity?.stage)}`") {{formatSnakeCase(opportunity?.stage)}}
            div
              .text-neutral-400.font-medium.mb-2.flex.items-center.mb-3
                Icon(name="IconSteps" size="20" class="mr-2")
                p Next Steps
              span.text-neutral-800.mb-2.bg-neutral-100.rounded-xl.py-1.px-2.mr-2(v-for="nextStep in opportunity?.nextSteps") {{nextStep}}
            div
              .text-neutral-400.font-medium.mb-2.flex.items-center
                Icon(name="IconCalendar" size="20" class="mr-2")
                p Created
              p.text-neutral-800.mb-2 {{formatDate(opportunity?.createdAt)}}
            div
              .text-neutral-400.font-medium.mb-2.flex.items-center
                Icon(name="IconCalendar" size="20" class="mr-2")
                p Last Updated
              p.text-neutral-800.mb-2 {{formatDate(opportunity?.updatedAt)}}
            div(v-if="opportunity?.stage  === 'LOST'")
              .text-neutral-400.font-medium.mb-2.flex.items-center
                Icon(name="mage:message-information" size="20" class="mr-2")
                p Reason for loss
              p.text-neutral-800.mb-2 {{opportunity?.reasonOfLose}}
      .flex-1.bg-white.p-10.rounded-3xl(v-if="opportunity?.notes")
        .flex.items-center.gap-2.mb-4
          .flex.items-center.justify-center.w-10.h-10.rounded-full.bg-secondary-turquoise-50: Icon.text-secondary-turquoise-700(name="IconNote" size="24")
          h4.text-lg.font-semibold.text-neutral-900 Notes
        p.text-neutral-800.leading-relaxed {{opportunity?.notes}}
  el-tab-pane(label="Proposal" , name="proposal")
    .bg-white.rounded-3xl.mt-3.border.px-2
     .title.font-bold.text-xl.capitalize.flex-1.mt-8 Proposal
       AppTable(
        without-filters,
        without-search,
        without-action,
        without-pagination,
        :columns="table?.columns",
        :data="table?.data",
        class="!py-0"
      )
  el-tab-pane(label="Activity log", name="activity")
     .mt-6.activity
       .flex.items-start.gap-x-6.mb-7(v-for="item in activity?.docs" class="w-full lg:w-6/12")
         .flex.items-center.justify-center.w-12.h-12.rounded-full(class="!min-w-[48px] !min-h-[48px]" :class="handleTypeStyle(item.status)"): Icon(:name="handleIconName(item.status)" size="24")
         .mt-2
             h4.text-neutral-800.font-semibold.text-sm.mb-1 {{  item?.status == 'assigned'? 'Assigned User' : item?.status == 'create' ?'Create New Opportunity'  :item?.status?.toString()?.toUpperCase() }}
             p.text-neutral-500.text-xs.mb-4.font-medium {{ formatDate(item?.createdAt) }}
             .bg-white.p-5.rounded-3xl(class="w-[65vw]")
               p.text-neutral-700.text-xs {{ item?.descripion?.toString()?.toUpperCase() }}
               .flex.items-center.gap-3.gap-x-2.mt-4
                 Avatar(:src="item?.user?.profilePicture ?? '/images/avatar.png'" small)
                 p.text-neutral-800.text-xs.font-medium  {{ item?.user?.name }}
     el-empty(v-if="activity?.docs?.length ==  0 || !activity?.docs " description="No activity recorded for this Opportunity." image="/images/empty.png")
     .flex.justify-center.items-center.w-full
      el-button( v-if="activity?.docs?.length >0" :loading = "loading" class="!rounded-2xl mb-2"  type= 'primary' size="large" :disabled="activity?.pagination?.totalPages == activity?.pagination?.page" @click="getActivityPage(Number(activity?.pagination?.page)+1)") View More
</template>
<script lang="ts" setup>
  const { hasPermission } = await usePermissions();
  const activeName = ref("summary");
  const route = useRoute();

  const loading = ref(false);

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

  // Call API to Get the opportunity
  const opportunity = await getOpportunity(route.params.slug);
  const respons = await getOpportunityActivity(route.params.slug + `?limit=10` + "&&page=1");
  activity.value = respons;

  const getActivityPage = async (page: number) => {
    try {
      loading.value = true;
      const responsPage = await getOpportunityActivity(route.params.slug + `?limit=10` + `&&page=${page}`);
      activity.value = { docs: [...activity.value.docs, ...responsPage.docs], pagination: responsPage.pagination };
    } finally {
      loading.value = false;
    }
  };

  // Call API to Get the lead
  const lead = await getLead(opportunity.leadId);
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
          { text: 'Tech & Financial', value: "MIXED" },
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
