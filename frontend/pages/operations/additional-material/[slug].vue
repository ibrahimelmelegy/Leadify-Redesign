<template lang="pug">
.flex.items-center.justify-between.mb-5.mt-5
  .title.font-bold.text-2xl.mb-1.capitalize Material Details
  el-dropdown(trigger="click")
      span.el-dropdown-link
          button.rounded-btn(class="!px-4"): Icon(  name="IconToggle" size="24")
      template(#dropdown)
          el-dropdown-menu
            el-dropdown-item(v-if="hasPermission('EDIT_ADDITIONAL_MATERIAL')")
              NuxtLink.flex.items-center(:to="`/operations/additional-material/edit/${material?.id}`")
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
.flex.align-center.gap-6.mt-3(class="flex-col xl:flex-row")
    .flex-1.bg-white.p-10.rounded-3xl
      .title.font-bold.text-xl.capitalize {{material?.name}}
      AppTable(without-filters without-search without-action without-pagination :columns="table.columns" :data="table.data" class="!py-0")
      //- .grid.gap-4(class="md:grid-cols-2 lg:grid-cols-3  xl:grid-cols-4")
      //-   div
      //-     .text-neutral-400.font-medium.mb-2.flex.items-center
      //-       Icon(name="tabler:category-2" size="20" class="mr-2")
      //-       p material Type
      //-     p.text-neutral-800.mb-2 {{material?.type}}
      //-   div
      //-     .text-neutral-400.font-medium.mb-2.flex.items-center
      //-       Icon(name="solar:hashtag-outline" size="20" class="mr-2")
      //-       p material Price
      //-     p.text-neutral-800.mb-2 {{material?.price}}
</template>
<script lang="ts" setup>
  const activeName = ref("summary");
  const route = useRoute();
  const { hasPermission } = await usePermissions();
  const table = reactive({
    columns: [
      {
        prop: "name",
        label: "Item",
        component: "Text",
        // sortable: true,
        type: "font-default",
      },
      {
        prop: "price",
        label: "Price",
        component: "Text",
        // sortable: true,
        type: "font-default",
      },
    ],
    data: [] as CategoryItem[],
  });

  const material = await getAdditionalMaterial(route.params.slug);
  table.data = material?.materialItem || [];
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
