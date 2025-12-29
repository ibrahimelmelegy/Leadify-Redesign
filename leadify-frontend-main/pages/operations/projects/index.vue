<template lang="pug">
div
  //- Header
  .flex.items-center.justify-between.mb-8
    .title.font-bold.text-2xl.mb-1.capitalize Projects
    .flex.items-center.gap-x-3
      NuxtLink(to="/operations/projects/add-project")
        el-button(   size='large' :loading="loading" v-if="hasPermission('CREATE_PROJECTS')" native-type="submit" type="primary" :icon="Plus" class="w-full !my-4 !rounded-2xl")  New Project
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
  AppTable(v-slot="{data}"  :filterOptions="filterOptions" :columns="table.columns" position="project" :pageInfo="response.pagination" :data="table.data" :sortOptions="table.sort" @handleRowClick="handleRowClick" searchPlaceholder="projects" )
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
                      NuxtLink.flex.items-center(:to="`/operations/projects/${data?.id}`")
                        Icon.text-md.mr-2(name="IconEye" )
                        p.text-sm View
                    el-dropdown-item(v-if="hasPermission('EDIT_PROJECTS')")
                      NuxtLink.flex.items-center(:to="`/operations/projects/edit/${data?.id}`")
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
        label: "Project Name",
        component: "Text",
        sortable: true,
        type: "font-bold",
        width: 150,
      },
      {
        prop: "projectClient",
        label: "Client Name",
        component: "Text",
        type: "font-bold",
        width: 150,
      },
      {
        prop: "category",
        label: "Category",
        component: "Text",
        sortable: true,
        type: "font-default",
        width: 150,
      },
      {
        prop: "type",
        label: "Type",
        component: "Text",
        sortable: true,
        type: "font-default",
        width: 150,
      },
      {
        prop: "status",
        label: "Status",
        component: "Label",
        sortable: true,
        type: "outline",
        filters: [
          { text: "Active", value: "PROJECT_ACTIVE" },
          { text: "Cancelled", value: "PROJECT_CANCELLED" },
          { text: "On Hold", value: "PROJECT_ON_HOLD" },
          { text: "Completed", value: "PROJECT_COMPLETE" },
        ],
        width: 150,
      },
      {
        prop: "startDate",
        label: "Start Date",
        component: "Text",
        sortable: true,
        type: "font-default",
        width: 150,
      },
      {
        prop: "endDate",
        label: "End Date",
        component: "Text",
        sortable: true,
        type: "font-default",
        width: 150,
      },
      {
        prop: "duration",
        label: "Duration",
        component: "Text",
        sortable: true,
        type: "font-default",
        width: 150,
      },
      {
        prop: "totalCost",
        label: "Total Cost",
        component: "Text",
        sortable: true,
        type: "font-default",
        width: 150,
      },
      {
        prop: "projectAssignedUsers",
        label: "assigned",
        component: "Text",
        // sortable: true,
        type: "font-default",
        width: 150,
      },
    ],
    data: [] as CombinedProjectValues[],
  });

  const response = await useTableFilter("project");
  table.data = response.formattedData;

  // mock data for integrate till api is ready
  // const project = await getProjectDraft();
  // table.data = [project].map(({ project, step }) => ({
  //   ...project,
  //   projectStartDate: getYear(project.startDate),
  //   projectEndDate: getYear(project.endDate),
  //   projectAssignedUsers: project.assignedUsers.length ? project.assignedUsers.map((user: any) => user.name).join(', ') : '-',
  //   projectClient: project.client?.clientName || '-',
  // }));

  function handleRowClick(val: any) {
    router.push(`/operations/projects/${val.id}`);
  }

  const filterOptions = [
    {
      title: "Project Status",
      value: "status",
      options: [...projectStatuses],
    },
    {
      title: "Project type",
      value: "category",
      options: [...projectCategories],
    },
    {
      title: "Start Date",
      value: ["fromStartDate", "toStartDate"],
      type: "date",
    },
    {
      title: "End Date ",
      value: ["fromEndDate", "toEndDate"],
      type: "date",
    },
  ];
</script>
