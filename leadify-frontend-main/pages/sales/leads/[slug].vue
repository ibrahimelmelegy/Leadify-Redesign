<template lang="pug">
.flex.items-center.justify-between.mb-5.mt-5
  .title.font-bold.text-2xl.mb-1.capitalize Lead Details
  el-dropdown(trigger="click")
      span.el-dropdown-link
          button.rounded-btn(class="!px-4"): Icon(  name="IconToggle" size="24")
      template(#dropdown)
          el-dropdown-menu
            el-dropdown-item(v-if="hasPermission('EDIT_LEADS')")
              NuxtLink.flex.items-center(:to="`/sales/leads/edit/${lead?.id}`")
                Icon.text-md.mr-2(size="20" name="IconEdit" )
                p.text-sm Edit
            //- el-dropdown-item
            //-   .flex.items-center
            //-     Icon.text-md.mr-2(size="20" name="IconRestore" )
            //-     p.text-sm Convert to
            el-dropdown-item
              NuxtLink.flex.items-center(:to="`/sales/opportunity/add-opportunity?leadId=${lead?.id}`")
                Icon.text-md.mr-2(size="20" name="IconOpportunity" )
                p.text-sm Convert to Opportunity
            el-dropdown-item
              NuxtLink.flex.items-center(:to="`/sales/deals/add-deal?leadId=${lead?.id}`")
                Icon.text-md.mr-2(size="20" name="IconDeal" )
                p.text-sm Convert to Deal
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
            h4.text-2xl.font-semibold.mb-2.text-neutral-900.flex.items-center.gap-x-3 {{lead?.name}} #[span.border.rounded-xl.text-xs.px-2(:class="`label-outline-${getStatusColor(lead?.status)}`") {{formatSnakeCase(lead?.status)}}]
            p.text-neutral-600 {{lead?.companyName}}
        .mt-8
          p.text-neutral-900.font-semibold.mb-6.text-lg Information
          .grid.gap-4(class="md:grid-cols-2 grid-cols-1")
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
            div(v-if="lead?.users?.length")
              .text-neutral-400.font-medium.mb-2.flex.items-center
                Icon(name="IconAssign" size="20" class="mr-2")
                p Assign
              p.text-neutral-800.mb-2 {{lead?.users?.map((user) => user.name).join(', ')}}
            div
              .text-neutral-400.font-medium.mb-2.flex.items-center
                Icon(name="IconSource" size="20" class="mr-2")
                p Lead Source
              p.text-neutral-800.mb-2 {{formatSnakeCase(lead?.leadSource)}}
            div(v-if="lead?.otherSource")
              .text-neutral-400.font-medium.mb-2.flex.items-center
                Icon(name="IconSource" size="20" class="mr-2")
                p Other Source
              p.text-neutral-800.mb-2 {{lead?.otherSource}}
            div
              .text-neutral-400.font-medium.mb-2.flex.items-center
                Icon(name="IconCalendar" size="20" class="mr-2")
                p Created
              p.text-neutral-800.mb-2 {{formatDate(lead?.createdAt)}}
            div
              .text-neutral-400.font-medium.mb-2.flex.items-center
                Icon(name="IconCalendar" size="20" class="mr-2")
                p Last Contact
              p.text-neutral-800.mb-2 {{formatDate(lead?.lastContactDate)}}
      .flex-1.bg-white.p-10.rounded-3xl(v-if="lead?.notes")
        .flex.items-center.gap-2.mb-4
          .flex.items-center.justify-center.w-10.h-10.rounded-full.bg-secondary-turquoise-50: Icon.text-secondary-turquoise-700(name="IconNote" size="24")
          h4.text-lg.font-semibold.text-neutral-900 Notes
        p.text-neutral-800.leading-relaxed {{lead?.notes}}
  el-tab-pane(label="Activity log", name="activity")
   .mt-6.activity
     .flex.items-start.gap-x-6.mb-7(v-for="item in activity?.docs" class="w-full lg:w-6/12")
       .flex.items-center.justify-center.w-12.h-12.rounded-full(class="!min-w-[48px] !min-h-[48px]" :class="handleTypeStyle(item.status)"): Icon(:name="handleIconName(item.status)" size="24")
       .mt-2
           h4.text-neutral-800.font-semibold.text-sm.mb-1 {{  item?.status == 'assigned'? 'Assigned User' : item?.status == 'create' ?'Create New Lead'  :item?.status?.toString()?.toUpperCase() }}
           p.text-neutral-500.text-xs.mb-4.font-medium {{ formatDate(item?.createdAt) }}
           .bg-white.p-5.rounded-3xl(class="w-[65vw]")
             p.text-neutral-700.text-xs {{ item?.descripion?.toString()?.toUpperCase() }}
             .flex.items-center.gap-3.gap-x-2.mt-4
               Avatar(:src="item?.user?.profilePicture ?? '/images/avatar.png'" small)
               p.text-neutral-800.text-xs.font-medium  {{ item?.user?.name }}
   el-empty(v-if="activity?.docs?.length ==  0 || !activity?.docs " description="No activity recorded for this lead." image="/images/empty.png")
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
  // Call API to Get the lead
  const lead = await getLead(route.params.slug);
  const respons = await getActivity(route.params.slug + `?limit=10` + "&&page=1");
  activity.value = respons;

  const getActivityPage = async (page: number) => {
    try {
      loading.value = true;
      const responsPage = await getActivity(route.params.slug + `?limit=10` + `&&page=${page}`);
      activity.value = { docs: [...activity.value.docs, ...responsPage.docs], pagination: responsPage.pagination };
    } finally {
      loading.value = false;
    }
  };
</script>
<style scoped lang="scss">
  .activity {
    position: relative;
    ::before {
      content: "";
      height: 90%;
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
