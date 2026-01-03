<template lang="pug">
div
  //- Header
  .flex.items-center.justify-between.mb-8
    .title.font-bold.text-2xl.mb-1.capitalize Clients
    .flex.items-center.gap-x-3
      NuxtLink(to="/sales/clients/add-client")
        el-button(   size='large' :loading="loading" v-if="hasPermission('CREATE_CLIENTS')" native-type="submit" type="primary" :icon="Plus" class="w-full !my-4 !rounded-2xl")  New Client
      //- el-dropdown(trigger="click")
      //-     span.el-dropdown-link
      //-         button.rounded-btn(class="!px-4"): Icon(  name="IconToggle" size="24")
      //-     template(#dropdown)
      //-         el-dropdown-menu
      //-           el-dropdown-item
      //-             NuxtLink.flex.items-center(:to="`/clients/1`")
      //-               Icon.text-md.mr-2(size="20" name="IconImport" )
      //-               p.text-sm Import
      //-           NuxtLink(:to="`/clients/1`")
      //-             el-dropdown-item
      //-               NuxtLink.flex.items-center(:to="`/clients/1`")
      //-                 Icon.text-md.mr-2(size="20" name="IconExport" )
      //-                 p.text-sm Export
      //-           el-dropdown-item
      //-               NuxtLink.flex.items-center(:to="`/clients/1`")
      //-                 Icon.text-md.mr-2(size="20" name="IconArchived" )
      //-                 p.text-sm Archived
  AppTable(v-slot="{data}" :filterOptions="filterOptions" :columns="table.columns" position="client" :pageInfo="response.pagination" :data="table.data" :sortOptions="table.sort" @handleRowClick="handleRowClick" searchPlaceholder="clients" )
    .flex.items-center.py-2(@click.stop)
        //- NuxtLink.toggle-icon(:to="`/clients/1`")
        //-     Icon.text-md(name="IconEye" )

        el-dropdown(class="outline-0" trigger="click")
            span(class="el-dropdown-link")
              .toggle-icon.text-md
                  Icon(name="IconToggle"  size="22")
            template(#dropdown='')
                el-dropdown-menu
                    el-dropdown-item
                      NuxtLink.flex.items-center(:to="`/sales/clients/${data?.id}`")
                        Icon.text-md.mr-2(name="IconEye" )
                        p.text-sm View
                    el-dropdown-item(v-if="hasPermission('EDIT_CLIENTS')")
                      NuxtLink.flex.items-center(:to="`/sales/clients/edit/${data?.id}`")
                        Icon.text-md.mr-2(name="IconEdit" )
                        p.text-sm Edit
                    //- el-dropdown-item(@click="[deleteclientPopup=true, userActionId = data?.id]" )
                    //-     .flex.items-center
                    //-       Icon.text-md.mr-2(name="IconDelete" )
                    //-       p.text-sm Delete
  ActionModel(v-model="deleteClientPopup" :loading="loadingAction" btn-text="Move to Archive" description-one="Are you sure you want to delete this Client?" icon="/images/delete-image.png" description-two="It will be archived and can be restored later within 30 days." )
</template>

<script setup lang="ts">
  const router = useRouter();
  import { Plus } from "@element-plus/icons-vue";
  const { hasPermission } = await usePermissions();
  const loadingAction = ref(false);
  const deleteClientPopup = ref(false);

  const table = reactive({
    columns: [
      {
        prop: "ClientDetails",
        label: "Client Name",
        component: "AvatarText",
        sortable: true,
        type: "font-bold",
        width: 170,
      },
      {
        prop: "clientType",
        label: "Type",
        component: "Text",
        sortable: true,
        type: "font-bold",
        width: 150,
      },
      {
        prop: "email",
        label: "Email",
        component: "Text",
        sortable: true,
        type: "font-default",
        width: 200,
      },
      {
        prop: "phoneNumber",
        label: "Phone",
        component: "Text",
        sortable: true,
        type: "font-default",
        width: 200,
      },
      {
        prop: "clientStatus",
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
        prop: "assign",
        label: "Assigned",
        component: "Text",
        type: "font-default",
        width: 200,
      },
      {
        prop: "createdAt",
        label: "Created",
        component: "Text",
        sortable: true,
        type: "font-default",
        width: 200,
      },
      // { prop: 'actions', label: 'Actions', sortable: false },
    ],
    data: [] as Client[],
    sort: [
      { prop: "price", order: "ascending", value: "PRICE_ASC" },
      { prop: "price", order: "descending", value: "PRICE_DESC" },
      { prop: "identity", order: "ascending", value: "IDENTITY_ASC" },
      { prop: "identity", order: "descending", value: "IDENTITY_DESC" },
    ],
  });

  // Call API to Get the client
  // const response = await getClients();

  const response = await useTableFilter("client");
  table.data = response.formattedData;

  function handleRowClick(val: any) {
    router.push(`/sales/clients/${val.id}`);
  }

  let users = await useApiFetch("users");
  const mappedUsers = users?.body?.docs?.map((e: any) => ({
    label: e.name,
    value: e.id,
  }));

  const filterOptions = [
    {
      title: "Status",
      value: "status",
      options: [...clientStatuses],
    },
    {
      title: "Type",
      value: "type",
      options: [...clientTypes],
    },
    {
      title: "Assigned user",
      value: "userId",
      options: [...mappedUsers],
    },
  ];
</script>
