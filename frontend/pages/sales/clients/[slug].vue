<template lang="pug">
.flex.items-center.justify-between.mb-5.mt-5
  .title.font-bold.text-2xl.mb-1.capitalize Client Details
  el-dropdown(trigger="click")
      span.el-dropdown-link
          button.rounded-btn(class="!px-4"): Icon(  name="IconToggle" size="24")
      template(#dropdown)
          el-dropdown-menu
            el-dropdown-item(v-if="hasPermission('EDIT_CLIENTS')")
              NuxtLink.flex.items-center(:to="`/sales/clients/edit/${client?.id}`")
                Icon.text-md.mr-2(size="20" name="IconEdit" )
                p.text-sm Edit
            //- el-dropdown-item
            //-   NuxtLink.flex.items-center(:to="`/sales/deals/add-deal?clientId=${client?.id}&leadId=${client?.id}`")
            //-     Icon.text-md.mr-2(size="20" name="IconDeal" )
            //-     p.text-sm Convert to Deal
            //- el-dropdown-item
            //-   .flex.items-center
            //-     Icon.text-md.mr-2(size="20" name="IconRestore" )
            //-     p.text-sm Convert to
            //- el-dropdown-item
            //-   .flex.items-center
            //-     Icon.text-md.mr-2(size="20" name="IconOpportunity" )
            //-     p.text-sm Client
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
            h4.text-2xl.font-semibold.mb-2.text-neutral-900.flex.items-center.gap-x-3 {{client?.clientName}} #[span.border.rounded-xl.text-xs.px-2(:class="`label-outline-${getStatusColor(client?.clientStatus)}`") {{formatSnakeCase(client?.clientStatus)}}]
            p.text-neutral-600 {{client?.companyName}}
        .mt-8
          p.text-neutral-900.font-semibold.mb-6.text-lg Information
          .grid.gap-4(class="md:grid-cols-2 lg:grid-cols-3  xl:grid-cols-4")
            div(v-if="client?.email")
              .text-neutral-400.font-medium.mb-2.flex.items-center
                Icon(name="IconEmail" size="20" class="mr-2")
                p Email
              p.text-neutral-800.mb-2 {{client?.email}}
            div(v-if="client?.phone")
              .text-neutral-400.font-medium.mb-2.flex.items-center
                Icon(name="IconPhone" size="20" class="mr-2")
                p Phone Number
              p.text-neutral-800.mb-2 {{client?.phone}}
            div(v-if="client?.clientType")
              .text-neutral-400.font-medium.mb-2.flex.items-center
                Icon(name="tabler:category-2" size="20" class="mr-2")
                p Client Type
              p.text-neutral-800.mb-2 {{formatSnakeCase(client?.clientType)}}
            div(v-if="client?.city || client?.state || client?.streetAddress || client?.zipCode")
              .text-neutral-400.font-medium.mb-2.flex.items-center
                Icon(name="material-symbols:location-on" size="20" class="mr-2")
                p Address
              p.text-neutral-800.mb-2 {{ [ client?.city, client?.state, client?.streetAddress, client?.zipCode ].filter(Boolean).join(' - ') }}
            div(v-if="client?.industry")
              .text-neutral-400.font-medium.mb-2.flex.items-center
                Icon(name="tabler:category-2" size="20" class="mr-2")
                p Industry
              p.text-neutral-800.mb-2 {{client?.industry}}
            div(v-if="client?.users?.length")
              .text-neutral-400.font-medium.mb-2.flex.items-center
                Icon(name="IconAssign" size="20" class="mr-2")
                p Assign
              p.text-neutral-800.mb-2 {{client?.users?.map((user) => user.name).join(', ')}}
            div
              .text-neutral-400.font-medium.mb-2.flex.items-center
                Icon(name="IconCalendar" size="20" class="mr-2")
                p Created
              p.text-neutral-800.mb-2 {{formatDate(client?.createdAt)}}
            div
              .text-neutral-400.font-medium.mb-2.flex.items-center
                Icon(name="IconCalendar" size="20" class="mr-2")
                p Last Updated
              p.text-neutral-800.mb-2 {{formatDate(client?.updatedAt)}}
    .flex-1.bg-white.p-10.rounded-3xl.mt-6(v-if="client?.fileUpload?.length")
     .flex.items-center.gap-3.mb-6
      .flex.items-center.justify-center.w-12.h-12.rounded-full(class="!min-w-[48px] !min-h-[48px]" class="bg-secondary-turquoise-50 text-secondary-turquoise-700"): Icon(name="mdi:file-outline" size="24")
      h4.text-lg.font-semibold.text-neutral-900 Documents
     div( class="flex gap-4 flex-wrap items-center")
      button(@click="downloadFile(`https://staging-api.hp-tech.com/assets/${file}`, file)" class="bg-white border rounded-lg p-4 flex items-center space-x-4" v-for="file in client?.fileUpload" :key="file")
        img(:src="`/images/files/${file?.split('.').pop()}.svg`" size="40")
        p(class="text-gray-800 font-medium") {{file}}
        Icon(name="solar:download-bold" class="text-neutral-500 ml-auto")
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
  import { ElMessage } from "element-plus";

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

  // Call API to Get the client
  const client = await getClient(route.params.slug);

  const activity = ref();
  const respons = await getClientActivity(route.params.slug + `?limit=10` + "&&page=1");
  activity.value = respons;

  const getActivityPage = async (page: number) => {
    try {
      loading.value = true;
      const responsPage = await getClientActivity(route.params.slug + `?limit=10` + `&&page=${page}`);
      activity.value = { docs: [...activity.value.docs, ...responsPage.docs], pagination: responsPage.pagination };
    } finally {
      loading.value = false;
    }
  };

  async function downloadFile(pdfUrl: string, filename: string) {
    fetch(pdfUrl)
      // check to make sure you didn't have an unexpected failure (may need to check other things here depending on use case / backend)
      .then((resp) => (resp.status === 200 ? resp.blob() : Promise.reject("something went wrong")))
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        // the filename you want
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        // or you know, something with better UX...
        ElMessage.success(`Downloaded ${filename}`);
      })
      .catch(() => {
        ElMessage.error("Download failed");
      });
  }
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
