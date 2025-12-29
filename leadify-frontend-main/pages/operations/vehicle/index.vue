<template lang="pug">
div
  //- Header
  .flex.items-center.justify-between.mb-8
    .title.font-bold.text-2xl.mb-1.capitalize Vehicle
    .flex.items-center.gap-x-3
      NuxtLink(to="/operations/vehicle/add-vehicle")
        el-button(   size='large' :loading="loading" v-if="hasPermission('CREATE_VEHICLES')" native-type="submit" type="primary" :icon="Plus" class="w-full !my-4 !rounded-2xl")  New Vehicle
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
  AppTable(v-slot="{data}" :columns="table.columns" :filterOptions="filterOptions" position="vehicle" :pageInfo="response.pagination" :data="table.data" :sortOptions="table.sort" @handleRowClick="handleRowClick" searchPlaceholder="vehicle" )
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
                      NuxtLink.flex.items-center(:to="`/operations/vehicle/${data?.id}`")
                        Icon.text-md.mr-2(name="IconEye" )
                        p.text-sm View
                    el-dropdown-item(v-if="hasPermission('EDIT_VEHICLES')")
                      NuxtLink.flex.items-center(:to="`/operations/vehicle/edit/${data?.id}`")
                        Icon.text-md.mr-2(name="IconEdit" )
                        p.text-sm Edit
                    //- el-dropdown-item(@click="[deleteLeadPopup=true, userActionId = data?.id]" )
                    //-     .flex.items-center
                    //-       Icon.text-md.mr-2(name="IconDelete" )
                    //-       p.text-sm Delete
  ActionModel(v-model="deleteLeadPopup" :loading="loadingAction" btn-text="Move to Archive" description-one="Are you sure you want to delete this Vehicle?" icon="/images/delete-image.png" description-two="It will be archived and can be restored later within 30 days." )
</template>

<script setup lang="ts">
  const router = useRouter();
  import { Plus } from "@element-plus/icons-vue";
  const { hasPermission } = await usePermissions();
  const loadingAction = ref(false);
  const deleteLeadPopup = ref(false);

  const table = reactive({
    columns: [
      {
        prop: "plate",
        label: "Plate",
        component: "Text",
        // sortable: true,
        type: "font-bold",
        width: 150,
      },
      {
        prop: "manufacturer",
        label: "Manufacturer",
        component: "Text",
        // sortable: true,
        type: "font-bold",
        width: 200,
      },
      {
        prop: "rentCost",
        label: "Rent Cost",
        component: "Text",
        sortable: true,
        type: "font-default",
        width: 150,
      },
      {
        prop: "gasCost",
        label: "Gas Cost",
        component: "Text",
        sortable: true,
        type: "font-default",
        width: 150,
      },
      {
        prop: "oilCost",
        label: "Oil Cost",
        component: "Text",
        sortable: true,
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
    ],
    data: [] as Vehicle[],
  });

  const response = await useTableFilter("vehicle");
  table.data = response.formattedData;

  function handleRowClick(val: any) {
    router.push(`/operations/vehicle/${val.id}`);
  }

  const filterOptions = [
    {
      title: "Manufacturer",
      value: "manufacturer",
      options: [...manufacturers],
    },
    {
      title: "Rent Cost",
      value: ["fromRentCost", "toRentCost"],
      type: "input",
    },
    {
      title: "Gas Cost",
      value: ["fromGasCost", "toGasCost"],
      type: "input",
    },
    {
      title: "Oil Cost",
      value: ["fromOilCost", "toOilCost"],
      type: "input",
    },
    {
      title: "Regular Maintenance Cost",
      value: ["fromRegularMaintenanceCost", "toRegularMaintenanceCost"],
      type: "input",
    },
  ];
</script>
