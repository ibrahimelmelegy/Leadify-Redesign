<template lang="pug">
  div
    //- Header
    .flex.items-center.justify-between.mb-8
      .title.font-bold.text-2xl.mb-1.capitalize Staff
      .flex.items-center.gap-x-3
        NuxtLink(to="/staff/add-staff")
          el-button(size='large' :loading="loading" v-if="hasPermission('CREATE_STAFF')" native-type="submit" type="primary" :icon="Plus" class="w-full !my-4 !rounded-2xl")  New Staff

    AppTable(v-slot="{data}" :filterOptions="filterOptions" :columns="table.columns" position="users" :pageInfo="response.pagination" :data="table.data" :sortOptions="table.sort" @handleRowClick="handleRowClick" searchPlaceholder="staff" :loading="loadingAction" )
      .flex.items-center.py-2(@click.stop)
          el-dropdown(class="outline-0" trigger="click")
              span(class="el-dropdown-link")
                .toggle-icon.text-md
                    Icon(name="IconToggle"  size="22")
              template(#dropdown='')
                  el-dropdown-menu
                      el-dropdown-item
                        NuxtLink.flex.items-center(:to="`/staff/${data?.id}`")
                          Icon.text-md.mr-2(name="IconEye" )
                          p.text-sm View
                      el-dropdown-item(v-if="hasPermission('EDIT_STAFF') && data?.id !== 1" )
                        NuxtLink.flex.items-center(:to="`/staff/edit/${data?.id}`")
                          Icon.text-md.mr-2(name="IconEdit" )
                          p.text-sm Edit
                      //- el-dropdown-item(@click="[deleteStaffPopup=true, staffActionId = data?.id]" )
                      //-     .flex.items-center
                      //-       Icon.text-md.mr-2(name="IconDelete" )
                      //-       p.text-sm Delete

    ActionModel(v-model="deleteStaffPopup" :loading="loadingAction" @confirm="deleteStaffAction()" btn-text="Move to Archive" description-one="Are you sure you want to delete this staff?" icon="/images/delete-image.png" description-two="It will be archived and can be restored later within 30 days." )
</template>

<script setup lang="ts">
  import { Plus } from "@element-plus/icons-vue";
  const { hasPermission } = await usePermissions();
  const router = useRouter();
  const loadingAction = ref(false);
  const deleteStaffPopup = ref(false);
  const staffActionId = ref();

  const table = reactive({
    columns: [
      {
        prop: "staffDetails",
        label: "Staff Name",
        component: "AvatarText",
        sortable: true,
        type: "font-bold",
        width: 170,
      },
      {
        prop: "email",
        label: "Email",
        component: "Text",
        sortable: true,
        type: "font-default",
        width: 220,
      },
      {
        prop: "phone",
        label: "Phone",
        component: "Text",
        sortable: false,
        type: "font-default",
        width: 150,
      },
      {
        prop: "roleDetails",
        label: "Role",
        component: "Text",
        sortable: false,
        type: "font-default",
        width: 200,
      },
      {
        prop: "status",
        label: "Status",
        component: "Label",
        sortable: true,
        type: "outline",
        filters: [
          { text: "Active", value: "ACTIVE" },
          { text: "Inactive", value: "INACTIVE" },
        ],
        width: 150,
      },
      {
        prop: "updatedAt",
        label: "Last Activity",
        component: "Text",
        sortable: false,
        type: "font-default",
        width: 200,
      },
    ],
    data: [] as Staff[],
    // sort: [
    //   { prop: 'price', order: 'ascending', value: 'PRICE_ASC' },
    //   { prop: 'price', order: 'descending', value: 'PRICE_DESC' },
    //   { prop: 'identity', order: 'ascending', value: 'IDENTITY_ASC' },
    //   { prop: 'identity', order: 'descending', value: 'IDENTITY_DESC' },
    // ],
  });

  // Call API to Get the staff
  const response = await useTableFilter("users");
  table.data = response.formattedData;

  function handleRowClick(val: any) {
    router.push(`/staff/${val.id}`);
  }

  // Call API to delete the staff
  async function deleteStaffAction() {
    loadingAction.value = true;

    await deleteStaff(staffActionId.value);
    deleteStaffPopup.value = false;

    // Call API to Get the staff
    const response = await useTableFilter("users");
    table.data = response.formattedData;

    loadingAction.value = false;
  }

  const mappedRoles = ref<{ label: string; value: any }[]>();
  //  Get roles
  let repsonse = await useApiFetch("role");
  // Map clients to Select Options
  mappedRoles.value = repsonse.body?.docs?.map((e: any) => ({
    label: e.name,
    value: e.id,
  }));

  const filterOptions = [
    {
      title: "Status",
      value: "status",
      options: [...staffStatuses],
    },
    {
      title: "Role",
      value: "roleId",
      options: mappedRoles.value,
    },
  ];
</script>
