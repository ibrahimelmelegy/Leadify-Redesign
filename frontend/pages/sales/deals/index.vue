<template lang="pug">
div
  //- Header
  .flex.items-center.justify-between.mb-8
    .title.font-bold.text-2xl.mb-1.capitalize Deals
    .flex.items-center.gap-x-3
      NuxtLink(to="/sales/deals/add-deal")
        el-button(   size='large' :loading="loading" v-if="hasPermission('CREATE_DEALS')" native-type="submit" type="primary" :icon="Plus" class="w-full !my-4 !rounded-2xl")  New Deal
      //- el-dropdown(trigger="click")
      //-     span.el-dropdown-link
      //-         button.rounded-btn(class="!px-4"): Icon(  name="IconToggle" size="24")
      //-     template(#dropdown)
      //-         el-dropdown-menu
      //-           el-dropdown-item
      //-             NuxtLink.flex.items-center(:to="`/deals/1`")
      //-               Icon.text-md.mr-2(size="20" name="IconImport" )
      //-               p.text-sm Import
      //-           NuxtLink(:to="`/deals/1`")
      //-             el-dropdown-item
      //-               NuxtLink.flex.items-center(:to="`/deals/1`")
      //-                 Icon.text-md.mr-2(size="20" name="IconExport" )
      //-                 p.text-sm Export
      //-           el-dropdown-item
      //-               NuxtLink.flex.items-center(:to="`/deals/1`")
      //-                 Icon.text-md.mr-2(size="20" name="IconArchived" )
      //-                 p.text-sm Archived
  AppTable(v-slot="{data}" :filterOptions="filterOptions" :columns="table.columns" position="deal" :pageInfo="response.pagination" :data="table.data" :sortOptions="table.sort" @handleRowClick="handleRowClick" searchPlaceholder="deals" )
    .flex.items-center.py-2(@click.stop)
        //- NuxtLink.toggle-icon(:to="`/deals/1`")
        //-     Icon.text-md(name="IconEye" )

        el-dropdown(class="outline-0" trigger="click")
            span(class="el-dropdown-link")
              .toggle-icon.text-md
                  Icon(name="IconToggle"  size="22")
            template(#dropdown='')
                el-dropdown-menu
                    el-dropdown-item
                      NuxtLink.flex.items-center(:to="`/sales/deals/${data?.id}`")
                        Icon.text-md.mr-2(name="IconEye" )
                        p.text-sm View
                    el-dropdown-item(v-if="hasPermission('EDIT_DEALS')")
                      NuxtLink.flex.items-center(:to="`/sales/deals/edit/${data?.id}`")
                        Icon.text-md.mr-2(name="IconEdit" )
                        p.text-sm Edit
                    //- el-dropdown-item(@click="[deleteLeadPopup=true, userActionId = data?.id]" )
                    //-     .flex.items-center
                    //-       Icon.text-md.mr-2(name="IconDelete" )
                    //-       p.text-sm Delete
  ActionModel(v-model="deleteLeadPopup" :loading="loadingAction" btn-text="Move to Archive" description-one="Are you sure you want to delete this Deal?" icon="/images/delete-image.png" description-two="It will be archived and can be restored later within 30 days." )
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
        prop: "dealDetails",
        label: "Deal Name",
        component: "AvatarText",
        sortable: true,
        type: "font-bold",
        width: 170,
      },
      {
        prop: "stage",
        label: "Stage",
        component: "Label",
        sortable: true,
        type: "outline",
        filters: dealStageOptions.map((stage) => ({ text: stage.label, value: stage.value })),
        width: 150,
      },
      {
        prop: "price",
        label: "Price",
        component: "Text",
        sortable: true,
        type: "font-default",
        width: 150,
      },
      {
        prop: "assign",
        label: "Assigned",
        component: "Text",
        // sortable: true,
        type: "font-default",
        width: 200,
      },
      {
        prop: "contractType",
        label: "Contract Type",
        component: "Label",
        sortable: true,
        type: "solid",
        width: 150,
      },
      {
        prop: "signatureDate",
        label: "Signature Date",
        component: "Text",
        sortable: true,
        type: "font-default",
        width: 150,
      },
    ],
    data: [] as Deal[],
  });

  // Call API to Get the deal
  // const response = await getLeads();

  const response = await useTableFilter("deal");
  table.data = response.formattedData;

  function handleRowClick(val: any) {
    router.push(`/sales/deals/${val.id}`);
  }

  let users = await useApiFetch("users");
  const mappedUsers = users?.body?.docs?.map((e: any) => ({
    label: e.name,
    value: e.id,
  }));

  const filterOptions = [
    {
      title: "Deal Stage",
      value: "stage",
      options: [...dealStageOptions],
    },
    {
      title: "Assigned user",
      value: "userId",
      options: [...mappedUsers],
    },
    {
      title: "Contract Type",
      value: "contractType",
      options: [...contractTypeOptions],
    },
    {
      title: "Expected Signature Date",
      value: ["fromDate", "toDate"],
      type: "date",
    },
    {
      title: "Deal Price",
      value: ["fromPrice", "toPrice"],
      type: "input",
    },
  ];
</script>
