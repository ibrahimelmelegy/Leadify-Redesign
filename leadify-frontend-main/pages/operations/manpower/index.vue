<template lang="pug">
div
  //- Header
  .flex.items-center.justify-between.mb-8
    .title.font-bold.text-2xl.mb-1.capitalize Manpower
    .flex.items-center.gap-x-3
      NuxtLink(to="/operations/manpower/add-manpower")
        el-button(   size='large' :loading="loading" v-if="hasPermission('CREATE_MANPOWER')" native-type="submit" type="primary" :icon="Plus" class="w-full !my-4 !rounded-2xl")  New Manpower
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
  AppTable(v-slot="{data}"  :columns="table.columns" :filterOptions="filterOptions" position="manpower" :pageInfo="response.pagination" :data="table.data" :sortOptions="table.sort" @handleRowClick="handleRowClick" searchPlaceholder="manpower" )
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
                      NuxtLink.flex.items-center(:to="`/operations/manpower/${data?.id}`")
                        Icon.text-md.mr-2(name="IconEye" )
                        p.text-sm View
                    el-dropdown-item(v-if="hasPermission('EDIT_MANPOWER')")
                      NuxtLink.flex.items-center(:to="`/operations/manpower/edit/${data?.id}`")
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
        label: "Full Name",
        component: "Text",
        sortable: true,
        type: "font-bold",
        width: 150,
      },
      {
        prop: "manpowerContacts",
        label: "Contacts",
        component: "AvatarText",
        // sortable: true,
        type: "font-bold",
        width: 200,
      },
      {
        prop: "role",
        label: "Role",
        component: "Text",
        sortable: true,
        type: "font-default",
        width: 150,
      },
      {
        prop: "availabilityStatus",
        label: "Availability Status",
        component: "Label",
        sortable: true,
        type: "outline",
        filters: [
          { text: "Available", value: "AVAILABLE" },
          { text: "Not Available", value: "NOT_AVAILABLE" },
        ],
        width: 200,
      },
      {
        prop: "salary",
        label: "Salary",
        component: "Text",
        sortable: true,
        type: "font-default",
        width: 150,
      },

      // {
      //   prop: 'variableAllowance',
      //   label: 'V. Allowance',
      //   component: 'Text',
      //   // sortable: true,
      //   type: 'font-default',
      //   width: 150,
      // },
      // {
      //   prop: 'transportationAllowance',
      //   label: 'T. Allowance',
      //   component: 'Text',
      //   // sortable: true,
      //   type: 'font-default',
      //   width: 150,
      // },
      // {
      //   prop: 'iqamaCost',
      //   label: 'Iqama Cost',
      //   component: 'Text',
      //   // sortable: true,
      //   type: 'font-default',
      //   width: 150,
      // },
      // {
      //   prop: 'endOfServiceBenefit',
      //   label: 'EOF',
      //   component: 'Text',
      //   // sortable: true,
      //   type: 'font-default',
      //   width: 150,
      // },
      {
        prop: "totalCost",
        label: "Total Cost",
        component: "Text",
        sortable: true,
        type: "font-default",
        width: 150,
      },
      {
        prop: "dailyCost",
        label: "Daily Cost",
        component: "Text",
        sortable: true,
        type: "font-default",
        width: 150,
      },
    ],
    data: [] as ManpowerValues[],
  });

  const response = await useTableFilter("manpower");
  table.data = response.formattedData;

  function handleRowClick(val: any) {
    router.push(`/operations/manpower/${val?.id}`);
  }

  const filterOptions = [
    {
      title: "Availability Status",
      value: "availabilityStatus",
      options: [...manpowerAvailabilityStatus],
    },
    {
      title: "Role",
      value: "role",
      options: [...manpowerRoles],
    },
    {
      title: "Salary",
      value: ["fromSalary", "toSalary"],
      type: "input",
    },
    {
      title: "Variable Allowance",
      value: ["fromVariableAllowance", "toVariableAllowance"],
      type: "input",
    },
    {
      title: "Transportation Allowance",
      value: ["fromTransportationAllowance", "toTransportationAllowance"],
      type: "input",
    },
    {
      title: "Iqama Cost",
      value: ["fromIqamaCost", "toIqamaCost"],
      type: "input",
    },
    {
      title: "Total Cost",
      value: ["fromTotalCost", "toTotalCost"],
      type: "input",
    },
    {
      title: "Daily Cost",
      value: ["fromDailyCost", "toDailyCost"],
      type: "input",
    },
    {
      title: "Creation Date",
      value: ["fromDate", "toDate"],
      type: "date",
    },
  ];
</script>
