<template lang="pug">
div
  //- Header
  .flex.items-center.justify-between.mb-8
    .title.font-bold.text-2xl.mb-1.capitalize Role
    .flex.items-center.gap-x-3
      NuxtLink(to="/roles/add-role")
        el-button(   size='large' :loading="loading" v-if="hasPermission('CREATE_ROLES')" native-type="submit" type="primary" :icon="Plus" class="w-full !my-4 !rounded-2xl")  New Role
  AppTable(v-slot="{data}" without-filters without-search :filterOptions="filterOptions" :columns="table.columns" position="role" :pageInfo="response.pagination" :data="table.data" :sortOptions="table.sort" @handleRowClick="handleRowClick" searchPlaceholder="roles" )
    .flex.items-center.py-2(@click.stop)

        el-dropdown(class="outline-0" trigger="click")
            span(class="el-dropdown-link")
              .toggle-icon.text-md
                  Icon(name="IconToggle"  size="22")
            template(#dropdown='')
                el-dropdown-menu
                    el-dropdown-item
                      NuxtLink.flex.items-center(:to="`/roles/${data?.id}`")
                        Icon.text-md.mr-2(name="IconEye" )
                        p.text-sm View
                    el-dropdown-item(v-if="hasPermission('EDIT_ROLES')")
                      NuxtLink.flex.items-center(:to="`/roles/edit/${data?.id}`")
                        Icon.text-md.mr-2(name="IconEdit" )
                        p.text-sm Edit
  ActionModel(v-model="deleteRolePopup" :loading="loadingAction" btn-text="Move to Archive" description-one="Are you sure you want to delete this Role?" icon="/images/delete-image.png" description-two="It will be archived and can be restored later within 30 days." )
</template>

<script setup lang="ts">
  const router = useRouter();
  const { hasPermission } = await usePermissions();
  import { Plus } from "@element-plus/icons-vue";
  const loadingAction = ref(false);
  const deleteRolePopup = ref(false);

  const table = reactive({
    columns: [
      {
        prop: "name",
        label: "Role Name",
        component: "Text",
        sortable: true,
        type: "font-bold",
        width: 170,
      },
      {
        prop: "description",
        label: "Description",
        component: "Text",
        sortable: true,
        type: "font-default",
        width: 150,
      },
      {
        prop: "totalAssignedUsers",
        label: "Total Staff",
        component: "Text",
        sortable: true,
        type: "font-default",
        width: 150,
      },
      {
        prop: "updatedAt",
        label: "Last Modified",
        component: "Text",
        sortable: true,
        type: "font-default",
        width: 150,
      },
    ],
    data: [] as Role[],
  });

  // Call API to Get the role
  // const response = await getRoles();

  const response = await useTableFilter("role");
  table.data = response.formattedData;

  function handleRowClick(val: any) {
    router.push(`/roles/${val.id}`);
  }
</script>
