<template lang="pug">
.flex.items-center.justify-between.mb-5.mt-5
  .title.font-bold.text-2xl.mb-1.capitalize Manpower Details
  el-dropdown(trigger="click")
      span.el-dropdown-link
          button.rounded-btn(class="!px-4"): Icon(  name="IconToggle" size="24")
      template(#dropdown)
          el-dropdown-menu
            el-dropdown-item(v-if="hasPermission('EDIT_MANPOWER')")
              NuxtLink.flex.items-center(:to="`/operations/manpower/edit/${manpower?.id}`")
                Icon.text-md.mr-2(size="20" name="IconEdit" )
                p.text-sm Edit
            //- el-dropdown-item
            //-   .flex.items-center
            //-     Icon.text-md.mr-2(size="20" name="IconRestore" )
            //-     p.text-sm Convert to
            //- el-dropdown-item
            //-   NuxtLink.flex.items-center(:to="`/sales/opportunity/add-opportunity?leadId=${lead?.id}`")
            //-     Icon.text-md.mr-2(size="20" name="IconOpportunity" )
            //-     p.text-sm Convert to Opportunity
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
          div(v-if="manpower?.role?.length")
            h4.text-2xl.font-semibold.mb-2.text-neutral-900.flex.items-center.gap-x-3 {{manpower?.name}} #[span.border.rounded-xl.text-xs.px-2(:class="`label-outline-${getStatusColor(manpower?.availabilityStatus)}`")  {{formatSnakeCase(manpower?.availabilityStatus)}}]
            p.text-neutral-600 {{manpower?.role?.map((role: string) => formatSnakeCase(role))?.join(', ')}}
        .mt-8
          p.text-neutral-900.font-semibold.mb-6.text-lg Information
          .grid.gap-4(class="md:grid-cols-2 grid-cols-1")
            div
              .text-neutral-400.font-medium.mb-2.flex.items-center
                Icon(name="IconEmail" size="20" class="mr-2")
                p Email
              p.text-neutral-800.mb-2 {{manpower?.email}}
            div
              .text-neutral-400.font-medium.mb-2.flex.items-center
                Icon(name="IconPhone" size="20" class="mr-2")
                p Phone Number
              p.text-neutral-800.mb-2 {{manpower?.phone}}
            div
              .text-neutral-400.font-medium.mb-2.flex.items-center
                Icon(name="material-symbols:event-available-outline" size="20" class="mr-2")
                p Availability Status
              p.text-neutral-800.mb-2 {{formatSnakeCase(manpower?.availabilityStatus)}}
            div
              .text-neutral-400.font-medium.mb-2.flex.items-center
                Icon(name="f7:money-dollar-circle" size="20" class="mr-2")
                p Salary
              p.text-neutral-800.mb-2 {{manpower?.salary}}
            div
              .text-neutral-400.font-medium.mb-2.flex.items-center
                Icon(name="solar:hashtag-outline" size="20" class="mr-2")
                p V. Allowance
              p.text-neutral-800.mb-2 {{manpower?.transportationAllowance}}
            div
              .text-neutral-400.font-medium.mb-2.flex.items-center
                Icon(name="solar:hashtag-outline" size="20" class="mr-2")
                p T. Allowance
              p.text-neutral-800.mb-2 {{manpower?.variableAllowance}}
            div
              .text-neutral-400.font-medium.mb-2.flex.items-center
                Icon(name="solar:hashtag-outline" size="20" class="mr-2")
                p Iqama Cost
              p.text-neutral-800.mb-2 {{manpower?.iqamaCost}}
            div
              .text-neutral-400.font-medium.mb-2.flex.items-center
                Icon(name="solar:hashtag-outline" size="20" class="mr-2")
                p EOF
              p.text-neutral-800.mb-2 {{manpower?.endOfServiceBenefit}}
            div
              .text-neutral-400.font-medium.mb-2.flex.items-center
                Icon(name="solar:hashtag-outline" size="20" class="mr-2")
                p Saudization
              p.text-neutral-800.mb-2 {{manpower?.saudization}}
            div
              .text-neutral-400.font-medium.mb-2.flex.items-center
                Icon(name="IconFees" size="20" class="mr-2")
                p Visa Fees
              p.text-neutral-800.mb-2 {{manpower?.visaFees}}
            div
              .text-neutral-400.font-medium.mb-2.flex.items-center
                Icon(name="fluent-emoji-high-contrast:ticket" size="20" class="mr-2")
                p Incoming flight ticket
              p.text-neutral-800.mb-2 {{manpower?.incomingFlightTicket}}
            div
              .text-neutral-400.font-medium.mb-2.flex.items-center
                Icon(name="solar:hashtag-outline" size="20" class="mr-2")
                p Health insurance
              p.text-neutral-800.mb-2 {{manpower?.healthInsurance}}
            div
              .text-neutral-400.font-medium.mb-2.flex.items-center
                Icon(name="solar:hashtag-outline" size="20" class="mr-2")
                p Org for Social Insurance
              p.text-neutral-800.mb-2 {{manpower?.generalOrganizationForSocialInsurance}}
            div
              .text-neutral-400.font-medium.mb-2.flex.items-center
                Icon(name="solar:hashtag-outline" size="20" class="mr-2")
                p Total Cost
              p.text-neutral-800.mb-2 {{manpower?.totalCost}}
            div
              .text-neutral-400.font-medium.mb-2.flex.items-center
                Icon(name="solar:hashtag-outline" size="20" class="mr-2")
                p Daily Cost
              p.text-neutral-800.mb-2 {{manpower?.dailyCost}}
      .flex-1.bg-white.p-10.rounded-3xl(v-if="manpower?.notes")
        .flex.items-center.gap-2.mb-4
          .flex.items-center.justify-center.w-10.h-10.rounded-full.bg-secondary-turquoise-50: Icon.text-secondary-turquoise-700(name="IconNote" size="24")
          h4.text-lg.font-semibold.text-neutral-900 Notes
        p.text-neutral-800.leading-relaxed {{manpower?.notes}}
  //- el-tab-pane(label="Activity log", name="activity")
  //-   .mt-6.activity
  //-     .flex.items-start.gap-x-6.mb-7(v-for="item in items" class="w-full lg:w-6/12")
  //-       .flex.items-center.justify-center.w-12.h-12.rounded-full(class="!min-w-[48px] !min-h-[48px]" :class="handleTypeStyle(item.enum)"): Icon(:name="item.icon" size="24")
  //-       .mt-2
  //-         h4.text-neutral-800.font-semibold.text-sm.mb-1 {{ item.type }}
  //-         p.text-neutral-500.text-xs.mb-4.font-medium {{ item.date }}
  //-         .bg-white.p-5.rounded-3xl
  //-           p.text-neutral-700.text-xs {{ item.description }}
  //-           .flex.items-center.gap-3.gap-x-2.mt-4
  //-             Avatar(:src="item.imageUrl" small)
  //-             p.text-neutral-800.text-xs.font-medium  {{ item.name }}
</template>
<script lang="ts" setup>
  const activeName = ref("summary");
  const route = useRoute();
  const { hasPermission } = await usePermissions();
  const items = [
    {
      icon: "IconAssign",
      type: "Assigned User",
      date: "14:00 - Yesterday",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce sagittis leo vitae justo euismod, vel rutrum augue auctor. Cras feugiat ornare nunc sed elementum. Proin vitae nibh vel est luctus cursus vel eget dolor. Nulla euismod odio vitae mauris porta aliquet.  ",
      imageUrl: "/images/avatar.png",
      name: "Amir Marei",
      enum: "ASSIGNED",
    },
    {
      icon: "IconEdit",
      type: "Edited",
      date: "14:00 - Yesterday",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce sagittis leo vitae justo euismod, vel rutrum augue auctor. Cras feugiat ornare nunc sed elementum. Proin vitae nibh vel est luctus cursus vel eget dolor. Nulla euismod odio vitae mauris porta aliquet.  ",
      imageUrl: "/images/avatar.png",
      name: "Amir Marei",
      enum: "EDITED",
    },
    {
      icon: "IconRestore",
      type: "Restored",
      date: "14:00 - Yesterday",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce sagittis leo vitae justo euismod, vel rutrum augue auctor. Cras feugiat ornare nunc sed elementum. Proin vitae nibh vel est luctus cursus vel eget dolor. Nulla euismod odio vitae mauris porta aliquet.  ",
      imageUrl: "/images/avatar.png",
      name: "Amir Marei",
      enum: "RESTORED",
    },
    {
      icon: "IconNewLead",
      type: "Create New Leads",
      date: "14:00 - Yesterday",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce sagittis leo vitae justo euismod, vel rutrum augue auctor. Cras feugiat ornare nunc sed elementum. Proin vitae nibh vel est luctus cursus vel eget dolor. Nulla euismod odio vitae mauris porta aliquet.  ",
      imageUrl: "/images/avatar.png",
      name: "Amir Marei",
      enum: "CREATED",
    },
    {
      icon: "IconDelete",
      type: "Delete Leads",
      date: "14:00 - Yesterday",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce sagittis leo vitae justo euismod, vel rutrum augue auctor. Cras feugiat ornare nunc sed elementum. Proin vitae nibh vel est luctus cursus vel eget dolor. Nulla euismod odio vitae mauris porta aliquet.  ",
      imageUrl: "/images/avatar.png",
      name: "Amir Marei",
      enum: "DELETED",
    },
    {
      icon: "IconArchived",
      type: "Archive Leads",
      date: "14:00 - Yesterday",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce sagittis leo vitae justo euismod, vel rutrum augue auctor. Cras feugiat ornare nunc sed elementum. Proin vitae nibh vel est luctus cursus vel eget dolor. Nulla euismod odio vitae mauris porta aliquet.  ",
      imageUrl: "/images/avatar.png",
      name: "Amir Marei",
      enum: "ARCHIVED",
    },
    {
      icon: "IconImport",
      type: "Import Leads",
      date: "14:00 - Yesterday",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce sagittis leo vitae justo euismod, vel rutrum augue auctor. Cras feugiat ornare nunc sed elementum. Proin vitae nibh vel est luctus cursus vel eget dolor. Nulla euismod odio vitae mauris porta aliquet.  ",
      imageUrl: "/images/avatar.png",
      name: "Amir Marei",
      enum: "IMPORTED",
    },
  ];

  const handleTypeStyle = (type: string) => {
    switch (type) {
      case "ASSIGNED":
        return "bg-primary-purple-50 text-primary-purple-500";
      case "EDITED":
        return "bg-secondary-turquoise-50 text-secondary-turquoise-700";
      case "RESTORED":
        return "bg-semantic-warning-background text-semantic-warning-foreground";
      case "CREATED":
        return "bg-primary-purple-50 text-primary-purple-500";
      case "DELETED":
        return "bg-semantic-error-background text-semantic-error-foreground";
      case "ARCHIVED":
        return "bg-neutral-100 text-neutral-500";
      case "IMPORTED":
        return "bg-secondary-blue-100 text-secondary-blue-600";
      case "EXPORTED":
        return "bg-secondary-turquoise-100 text-secondary-turquoise-900";
      default:
        return "";
    }
  };

  const manpower = await getManpower(route.params.slug);
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
