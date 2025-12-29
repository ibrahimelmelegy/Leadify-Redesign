<template lang="pug">
  el-tabs.demo-tabs(v-model="activeName", @tab-click="handleClick")
    el-tab-pane(label="Information Dashboard", name="info")
      OperationsDailyTasksStatistics
    el-tab-pane(label="Active Projects", name="active")
      .bg-white.p-10.rounded-3xl.mt-3
        .flex.items-center.justify-between.m-5
          .title.font-bold.text-2xl.mb-1.capitalize Active Projects
          .flex.items-center.gap-2
            el-button(type="primary" ,size='large' ,class="w-full !my-4 !rounded-2xl", @click="exportToPDF")
              .flex.items-center
                Icon.mr-2(name="IconExport", size="20")
                p.text-sm Export To PDF
            NuxtLink(to="/operations/daily-task/add-task?status=Active")
              el-button(size='large' ,class="w-full !my-4 !rounded-2xl", plain, type="primary")
                .flex.items-center
                  Icon.mr-2(name="IconAdd", size="20")
                p.text-sm Add project
        .flex.justify-center.items-center.h-64(v-if="loading")
          .animate-spin.rounded-full.h-12.w-12.border-4.border-primary-purple-400.border-t-transparent 
        AppTable(
          v-else
          v-slot="{ data }",
          :columns="activeColumns",
          :data="activeProjects",
          :loading="loading",
          :pageInfo="activeProjectsPagination",
          @page-change="handlePageChange",
          @search="handleSearch",
          without-filters,
          position="daily-task"
        )
         .flex.items-center.py-2(@click.stop)
           el-dropdown(class="outline-0" trigger="click")
            span(class="el-dropdown-link")
              .toggle-icon.text-md
                  Icon(name="IconToggle"  size="22")
            template(#dropdown='')
                el-dropdown-menu
                    el-dropdown-item
                      NuxtLink.flex.items-center(:to="`/operations/daily-task/${data?.id}`")
                        Icon.text-md.mr-2(name="IconEye" )
                        p.text-sm View
                    el-dropdown-item
                      NuxtLink.flex.items-center(:to="`/operations/daily-task/edits/${data?.id}`")
                        Icon.text-md.mr-2(name="IconEdit" )
                        p.text-sm Edit
  
    el-tab-pane(label="Completed Projects", name="completed")
      .bg-white.p-10.rounded-3xl.mt-3
        .flex.items-center.justify-between.m-5
          .title.font-bold.text-2xl.mb-1.capitalize Completed Projects
          .flex.items-center.gap-2
            el-button(type="primary", size='large' ,class="w-full !my-4 !rounded-2xl", @click="exportToPDF")
              .flex.items-center
                Icon.mr-2(name="IconExport", size="20")
                p.text-sm Export To PDF
            NuxtLink(to="/operations/daily-task/add-task?status=Completed")
              el-button(size='large' ,class="w-full !my-4 !rounded-2xl", plain, type="primary")
                .flex.items-center
                  Icon.mr-2(name="IconAdd", size="20")
                  p.text-sm Add Project
        .flex.justify-center.items-center.h-64(v-if="loading")
          .animate-spin.rounded-full.h-12.w-12.border-4.border-primary-purple-400.border-t-transparent 
        AppTable(
          v-else
          v-slot="{ data }",
          :columns="completedColumns",
          :data="completedProjects",
          :loading="loading",
          :pageInfo="completedProjectsPagination",
          @page-change="handlePageChange",
          @search="handleSearch",
          without-filters,
          position="daily-task"
        )
         .flex.items-center.py-2(@click.stop)
          el-dropdown(class="outline-0" trigger="click")
            span(class="el-dropdown-link")
              .toggle-icon.text-md
                  Icon(name="IconToggle"  size="22")
            template(#dropdown='')
                el-dropdown-menu
                    el-dropdown-item
                      NuxtLink.flex.items-center(:to="`/operations/daily-task/${data?.id}`")
                        Icon.text-md.mr-2(name="IconEye" )
                        p.text-sm View
                    el-dropdown-item
                      NuxtLink.flex.items-center(:to="`/operations/daily-task/edits/${data?.id}`")
                        Icon.text-md.mr-2(name="IconEdit" )
                        p.text-sm Edit
    el-tab-pane(label="Granted Projects", name="granted")
      .bg-white.p-10.rounded-3xl.mt-3
        .flex.items-center.justify-between.m-5
          .title.font-bold.text-2xl.mb-1.capitalize Granted Projects
          .flex.items-center.gap-2
            el-button(type="primary",size='large' ,class="w-full !my-4 !rounded-2xl", @click="exportToPDF")
              .flex.items-center
                Icon.mr-2(name="IconExport", size="20")
                p.text-sm Export To PDF
            NuxtLink(to="/operations/daily-task/add-task?status=Granted")
              el-button(size='large' ,class="w-full !my-4 !rounded-2xl", plain, type="primary")
               .flex.items-center
                Icon.mr-2(name="IconAdd", size="20")
                p.text-sm Add Project
        .flex.justify-center.items-center.h-64(v-if="loading")
          .animate-spin.rounded-full.h-12.w-12.border-4.border-primary-purple-400.border-t-transparent       
        AppTable(
          v-else
          v-slot="{ data }",
          :columns="grantedColumns",
          :loading="loading",
          :pageInfo="grantedProjectsPagination",
          :data="grantedProjects",
          @handleRowClick="handleView",
          without-filters,
          position="daily-task"
        )
         .flex.items-center.py-2(@click.stop)
           el-dropdown(class="outline-0" trigger="click")
            span(class="el-dropdown-link")
              .toggle-icon.text-md
                  Icon(name="IconToggle"  size="22")
            template(#dropdown='')
                el-dropdown-menu
                    el-dropdown-item
                      NuxtLink.flex.items-center(:to="`/operations/daily-task/${data?.id}`")
                        Icon.text-md.mr-2(name="IconEye" )
                        p.text-sm View
                    el-dropdown-item
                      NuxtLink.flex.items-center(:to="`/operations/daily-task/edits/${data?.id}`")
                        Icon.text-md.mr-2(name="IconEdit" )
                        p.text-sm Edit
  </template>

<script setup>
import { ref, reactive } from "vue";
import { ElMessage } from "element-plus";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import CairoFont from "../assets/fonts/Cairo-SemiBold.ttf";

const activeName = ref("info");
const loading = ref(false);
const router = useRouter();

onMounted(async () => {
  await handleClick({ props: { name: activeName.value } });
});

// Table columns configuration
const activeColumns = [
  {
    prop: "createdAt",
    label: "Date",
    component: "Text",
    sortable: true,
    width: 150,
    pdf: "Date",
    type: "font-default",
  },
  {
    prop: "clientName",
    label: "Client",
    component: "Text",
    sortable: true,
    width: 200,
    pdf: "Client Name",
    type: "font-default",
  },
  {
    prop: "name",
    label: "Project Description",
    component: "Text",
    width: 300,
    pdf: "Description",
    type: "font-default",
  },
  {
    prop: "salesRepresentativeName",
    label: "Sales Representative",
    component: "Text",
    sortable: true,
    width: 200,
    pdf: "Sales",
    type: "font-default",
  },
  {
    prop: "assignedToName",
    label: "Assigned To",
    component: "Text",
    sortable: true,
    width: 200,
    pdf: "Assigned",
    type: "font-default",
  },
  {
    prop: "priority",
    label: "Priority",
    component: "Text",
    sortable: true,
    width: 200,
    pdf: "Priority",
    type: "font-default",
  },
  {
    prop: "notes",
    label: "Notes",
    component: "Text",
    sortable: true,
    width: 200,
    pdf: "Notes",
    type: "font-default",
  },
  {
    prop: "status",
    label: "Status",
    component: "Label",
    sortable: true,
    width: 200,
    pdf: "Status",
    type: "outline",
  },
];

// Reuse the same columns structure for other tabs
const completedColumns = [
  {
    prop: "createdAt",
    label: "Date",
    component: "Text",
    sortable: true,
    width: 100,
    pdf: "Date",
    type: "font-default",
  },
  {
    prop: "clientName",
    label: "Client Name",
    component: "Text",
    sortable: true,
    width: 200,
    pdf: "Client",
    type: "font-default",
  },
  {
    prop: "name",
    label: "Project Description",
    component: "Text",
    width: 300,
    pdf: "Description",
    type: "font-default",
  },
  {
    prop: "salesRepresentativeName",
    label: "Sales Representative",
    component: "Text",
    sortable: true,
    width: 200,
    pdf: "Sales",
    type: "font-default",
  },
  {
    prop: "assignedToName",
    label: "Assigned To",
    component: "Text",
    sortable: true,
    width: 200,
    pdf: "Assigned",
    type: "font-default",
  },
   {
    prop: "notes",
    label: "Notes",
    component: "Text",
    sortable: true,
    width: 200,
    pdf: "Notes",
    type: "font-default",
  },
  {
    prop: "status",
    label: "Status",
    component: "Label",
    sortable: true,
    width: 200,
    pdf: "Status",
    type: "outline",
  },
  {
    prop: "cost",
    label: "Cost",
    component: "Text",
    sortable: true,
    width: 200,
    pdf: "Cost",
    type: "font-default",
  },
  {
    prop: "totalPaid",
    label: "Amount paid",
    component: "Text",
    sortable: true,
    width: 200,
    pdf: "Amount paid",
    type: "font-default",
  },
  {
    prop: "rest",
    label: "Rest",
    component: "Text",
    sortable: true,
    width: 200,
    pdf: "Rest",
    type: "font-default",
  },
];

const grantedColumns = [
  {
    prop: "createdAt",
    label: "Date",
    component: "Text",
    sortable: true,
    width: 150,
    pdf: "Date",
    type: "font-default",
  },
  {
    prop: "clientName",
    label: "Client Name",
    component: "Text",
    sortable: true,
    width: 200,
    pdf: "Client",
    type: "font-default",
  },
  {
    prop: "name",
    label: "Project Description",
    component: "Text",
    width: 300,
    pdf: "Description",
    type: "font-default",
  },
  {
    prop: "cost",
    label: "Cost",
    component: "Text",
    sortable: true,
    width: 200,
    pdf: "Cost",
    type: "font-default",
  },
  {
    prop: "downPayment",
    label: "Down Payment",
    component: "Text",
    sortable: true,
    width: 200,
    pdf: "Down Payment",
    type: "font-default",
  },
  // {
  //   prop: "startDate",
  //   label: "Start Date",
  //   component: "Text",
  //   sortable: true,
  //   width: 200,
  //   pdf: "Start",
  //   type: "font-default",
  // },
  {
    prop: "salesRepresentativeName",
    label: "Sales Representative",
    component: "Text",
    sortable: true,
    width: 200,
    pdf: "Sales",
    type: "font-default",
  },
  {
    prop: "assignedToName",
    label: "Assigned To",
    component: "Text",
    sortable: true,
    width: 200,
    pdf: "Assigned",
    type: "font-default",
  },
  {
    prop: "notes",
    label: "Notes",
    component: "Text",
    sortable: true,
    width: 200,
    pdf: "Notes",
    type: "font-default",
  },
  {
    prop: "status",
    label: "Status",
    component: "Label",
    sortable: true,
    width: 200,
    pdf: "Status",
    type: "outline",
  },
];

// Mock data - Replace with actual API calls
const activeProjects = ref([]);
const completedProjects = ref([]);
const grantedProjects = ref([]);

// Mock data - Replace with actual API calls
const activeProjectsPagination = ref([]);
const completedProjectsPagination = ref([]);
const grantedProjectsPagination = ref([]);

// Handle tab click
const handleClick = async (tab) => {
  try {
    // Fetch data based on selected tab
    loading.value = true;
    switch (tab.props.name) {
      case "active":
        const response = await useTableFilter("daily-task", { status: "ACTIVE,ON_HOLD" });
        activeProjects.value = await response.formattedData?.map((task) => ({
          ...task,
          createdAt: task.date,
          updatedAt: "-",
          clientName: task.client?.clientName,
          salesRepresentativeName: task.salesRepresentative?.name,
          assignedToName: task.user?.name,
        }));
        activeProjectsPagination.value = await response.pagination;

        break;
      case "completed":
        const responseCompleted = await useTableFilter("daily-task", {
          status: "COMPLETED",
        });
        completedProjects.value = responseCompleted.formattedData?.map((task) => ({
          ...task,
          createdAt: task?.date,
          updatedAt: "-",
          clientName: task.client?.clientName,
          salesRepresentativeName: task.salesRepresentative?.name,
          assignedToName: task.user?.name,
        }));
        completedProjectsPagination.value = responseCompleted.pagination;
        console.log(completedProjectsPagination.value);
        break;
      case "granted":
        const responseGranted = await useTableFilter("daily-task", {
          status: "WAITING_FOR_CONTRACT,CONTRACT_SIGNED",
        });
        grantedProjects.value = responseGranted.formattedData?.map((task) => ({
          ...task,
          createdAt: task?.date,
          updatedAt: "-",
          clientName: task.client?.clientName,
          salesRepresentativeName: task.salesRepresentative?.name,
          assignedToName: task.user?.name,
        }));

        grantedProjectsPagination.value = responseGranted.pagination;
        console.log(grantedProjectsPagination.value, responseGranted.formattedData);
        break;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    ElMessage.error("Failed to fetch data. Please try again later.");
  } finally {
    loading.value = false;
  }
};

// Export to PDF
const exportToPDF = () => {
  const data =
    activeName.value === "active"
      ? activeProjects.value
      : activeName.value === "completed"
      ? completedProjects.value
      : grantedProjects.value;
  const name =
    activeName.value === "active"
      ? "Active Projects"
      : activeName.value === "completed"
      ? "Completed Projects"
      : "Granted Projects";
  const columns =
    activeName.value === "active"
      ? activeColumns
      : activeName.value === "completed"
      ? completedColumns
      : grantedColumns;

  // Initialize jsPDF
  const doc = new jsPDF({
    orientation: "l", // Portrait mode
    unit: "mm",
    format: [500, 210], // Wider page (500mm width, 210mm height)
  });
  // Center title (h2 format)

  doc.addFont(CairoFont, "Cairo", "normal");
  doc.setFont("Cairo");
  console.log(doc.getFont());
  doc.text(`${name}`, 250, 10);

  // Use the imported `autoTable` function
  autoTable(doc, {
    head: [columns.map((column) => column.pdf)],
    body: data.map((item) => columns.map((column) => item[column.prop] ?? "N/A")),
    headStyles: {
      fillColor: [248, 247, 250], // Background color as rgba(231, 230, 233, 1)
      textColor: [101, 101, 101], // Ensuring text is visible
      fontStyle: "normal",
      fontSize: 12,
      font:"Cairo"
    },
    bodyStyles: {
      fillColor: [255, 255, 255],
      textColor: [0, 0, 0],
      font:"Cairo"
    },
    alternateRowStyles: { fillColor: [255, 255, 255] },
    styles: {
      lineWidth: 0.4, // Border width set to 1px
      lineColor: [231, 230, 233], // Black border
    },
  });
  // Save the PDF
  doc.save(`${name}${new Date().toLocaleDateString()}.pdf`);
};
const addTask = () => {
  // Implement add task logic
  ElMessage.success("Adding task...");
};
// Format date
const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString();
};

// Handle view action
const handleView = (row) => {
  router.push(`/operations/daily-task/${row?.id}`);
};
</script>

<style scoped>
.demo-tabs {
  @apply w-full;
}
</style>
