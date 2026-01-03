<template lang="pug">
.flex.align-center.gap-6.mt-3(class="flex-col ")
  .flex-1.bg-white.rounded-3xl
    div.w-full.p-4
     .flex.items-center.justify-between.mb-5.mt-5
      .title.font-bold.text-xl.mb-1.capitalize Staff Performance
    div(class="px-4")
     el-form(@submit.prevent='onSubmit' )
      .grid.grid-cols-2.gap-3
       InputSelect(label="Status" placeholder="Select Status" name="status" :options="staffStatuses" )
       InputSelect(label="Role" placeholder="Select Role" name="roleId" :options="mappedRoles" )
      .flex.justify-end
       el-button.my-2(native-type="submit" size='large' type="primary"  class="!rounded-2xl")  Show Filter Result
       el-button.mt-2(@click="ResetFilter" size='large'   class="!rounded-2xl text-col")  Reset Filter
  .flex-1.bg-white.rounded-3xl
    div.w-full.p-4
     .flex.justify-center.items-center.h-64(v-if="isLoading")
      .animate-spin.rounded-full.h-12.w-12.border-4.border-primary-purple-400.border-t-transparent

     //- Show table when not loading
     AppTable(v-else,v-slot="{ data }",
     @exportClick="exportClick",
     :columns="table.columns",
     position="users",
     :pageInfo="response.pagination",
     :data="table.data",
     :sortOptions="table.sort",
     :withoutAction="true",
     :withoutSearch="true",
     :withoutFilters="true",
     :exportButton="hasPermission('EXPORT_PERFORMANCE_REPORTS')")
    ActionModel(v-model="exportPopup",:loading="loadingExport",btn-text="Export",description="Please enter the email address where the Excel file will be received.",@confirm="confirmClick")
      template(#input)
       el-form-item(:label="label" :error='errorMessage' class="!mb-0" label-position="top")
         template(#label)
          p {{ label }} #[span.opacity-50  {{optional ?  "optional" : "" }}]
         el-input(size="large" label="Email"  type="text"  v-model='email')
</template>

<script setup lang="ts">
  import { useForm } from "vee-validate";
  const { hasPermission } = await usePermissions();
  const props = defineProps({
    user: {
      type: Object,
      required: true,
    },
  });

  const { handleSubmit, errors, values, resetForm } = useForm();
  const filter = ref();

  const mappedRoles = ref<{ label: string; value: any }[]>();
  //  Get roles
  let repsonse = await useApiFetch("role");
  // Map clients to Select Options
  mappedRoles.value = repsonse.body?.docs?.map((e: any) => ({
    label: e.name,
    value: e.id,
  }));

  const exportPopup = ref(false);
  const loadingExport = ref(false);
  const email = ref("");

  const isLoading = ref(false);

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

  const response = await getStaffs();
  table.data = response.staffs;

  const getData = async () => {
    isLoading.value = true;
    const response = await useTableFilter("users", filter.value);
    table.data = response.formattedData;
    isLoading.value = false;
  };

  const onSubmit = handleSubmit(async (values: any) => {
    filter.value = values;
    getData();
  });

  const ResetFilter = async () => {
    //await resetForm()
    filter.value = await { status: "", roleId: "" };
    await getData();
    resetForm();
  };
  async function setEmail(pre: any) {
    email.value = pre.target.value;
  }

  async function exportClick() {
    email.value = await props?.user?.email;
    exportPopup.value = await true;
  }

  async function confirmClick() {
    loadingExport.value = true;
    try {
      const res = await useTableFilter(`users/excel/${email.value}`, filter.value);
      if (res?.status == "200") {
        ElNotification({
          type: "success",
          title: "Success",
          message: "Send file to email successfully ",
        });
      } else {
        ElNotification({
          type: "error",
          title: "Error",
          message: "Unknown error",
        });
      }
    } catch (error) {
      // Catch any unexpected errors and handle them
      ElNotification({
        type: "error",
        title: "Error",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      email.value = "";
      loadingExport.value = false;
      exportPopup.value = false;
      getData();
    }
  }
</script>
