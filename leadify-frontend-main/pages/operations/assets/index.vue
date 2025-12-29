<template lang="pug">
div
  //- Header
  .flex.items-center.justify-between.mb-8
    .title.font-bold.text-2xl.mb-1.capitalize Assets
    .flex.items-center.gap-x-3
      NuxtLink(to="/operations/assets/add-asset")
        el-button(   size='large' :loading="loading" v-if="hasPermission('CREATE_ASSETS')" native-type="submit" type="primary" :icon="Plus" class="w-full !my-4 !rounded-2xl")  New Asset
      //- el-dropdown(trigger="click")
      //-     span.el-dropdown-link
      //-         button.rounded-btn(class="!px-4"): Icon(  name="IconToggle" size="24")
      //-     template(#dropdown)
      //-         el-dropdown-menu
      //-           el-dropdown-item
      //-             NuxtLink.flex.items-center(:to="`/leads/1`")
      //-               Icon.text-md.mr-2(size="20" name="IconImport" )
      //-               p.text-sm Import
      //-           NuxtLink(:to="`/leads/1`")
      //-             el-dropdown-item
      //-               NuxtLink.flex.items-center(:to="`/leads/1`")
      //-                 Icon.text-md.mr-2(size="20" name="IconExport" )
      //-                 p.text-sm Export
      //-           el-dropdown-item
      //-               NuxtLink.flex.items-center(:to="`/leads/1`")
      //-                 Icon.text-md.mr-2(size="20" name="IconArchived" )
      //-                 p.text-sm Archived
  AppTable(v-slot="{data}" :filterOptions="filterOptions" :columns="table.columns" position="asset" :pageInfo="response.pagination" :data="table.data" :sortOptions="table.sort" @handleRowClick="handleRowClick" searchPlaceholder="asset" )
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
                      NuxtLink.flex.items-center(:to="`/operations/assets/${data?.id}`")
                        Icon.text-md.mr-2(name="IconEye" )
                        p.text-sm View
                    el-dropdown-item(v-if="hasPermission('EDIT_ASSETS')")
                      NuxtLink.flex.items-center(:to="`/operations/assets/edit/${data?.id}`")
                        Icon.text-md.mr-2(name="IconEdit" )
                        p.text-sm Edit
                    //- el-dropdown-item(@click="[deleteLeadPopup=true, userActionId = data?.id]" )
                    //-     .flex.items-center
                    //-       Icon.text-md.mr-2(name="IconDelete" )
                    //-       p.text-sm Delete
  ActionModel(v-model="deleteLeadPopup" :loading="loadingAction" btn-text="Move to Archive" description-one="Are you sure you want to delete this Lead?" icon="/images/delete-image.png" description-two="It will be archived and can be restored later within 30 days." )
</template>

<script setup lang="ts">
  const router = useRouter();
  const { hasPermission } = await usePermissions();
  import { Plus } from "@element-plus/icons-vue";
  const loadingAction = ref(false);
  const deleteLeadPopup = ref(false);
  const table = reactive({
    columns: [
      {
        prop: "name",
        label: "Assets Name",
        component: "Text",
        sortable: true,
        type: "font-default",
        width: 500,
      },
      {
        prop: "rentPrice",
        label: "Rent Price",
        component: "Text",
        sortable: true,
        type: "font-default",
        width: 150,
      },
      {
        prop: "buyPrice",
        label: "Buy Price",
        component: "Text",
        sortable: true,
        type: "font-default",
        width: 150,
      },
    ],
    data: [],
  });

  const response = await useTableFilter("asset");
  table.data = response.formattedData;

  function handleRowClick(val: any) {
    router.push(`/operations/assets/${val.id}`);
  }

  const filterOptions = [
    {
      title: "Rent Price",
      value: ["fromRentPrice", "toRentPrice"],
      type: "input",
    },
    {
      title: "Buy Price",
      value: ["fromBuyPrice", "toBuyPrice"],
      type: "input",
    },
  ];
</script>
