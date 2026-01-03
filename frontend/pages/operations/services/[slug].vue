<template lang="pug">
.flex.items-center.justify-between.mb-5.mt-5
  .title.font-bold.text-2xl.mb-1.capitalize Service Details
  el-dropdown(trigger="click")
      span.el-dropdown-link
          button.rounded-btn(class="!px-4"): Icon(  name="IconToggle" size="24")
      template(#dropdown)
          el-dropdown-menu
            el-dropdown-item(v-if="hasPermission('EDIT_SERVICES')")
              NuxtLink.flex.items-center(:to="`/operations/services/edit/${service?.id}`")
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
          .grid.gap-4(class="md:grid-cols-2 lg:grid-cols-3  xl:grid-cols-4")
            div
              .text-neutral-400.font-medium.mb-2.flex.items-center
                Icon(name="tabler:category-2" size="20" class="mr-2")
                p Service Type
              p.text-neutral-800.mb-2 {{service?.type}}
            div
              .text-neutral-400.font-medium.mb-2.flex.items-center
                Icon(name="solar:hashtag-outline" size="20" class="mr-2")
                p Service Price
              p.text-neutral-800.mb-2 {{service?.price}}
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

  const service = await getService(route.params.slug);
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
