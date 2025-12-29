<template lang="pug">
div
  //- Header
  .flex.items-center.justify-between.mb-8
    .title.font-bold.text-2xl.mb-1.capitalize Proposals
    .flex.items-center.gap-x-3
      el-button.w-full(
        size="large",
        :loading="loading",
        v-if="hasPermission('CREATE_PROPOSALS')",
        native-type="submit",
        type="primary",
        :icon="Plus",
        class="!my-4 !rounded-2xl", @click='AddProposalPopup = true'
      ) New Proposal
  .flex.justify-center.items-center.h-64(v-if="loadingAction")
   .animate-spin.rounded-full.h-12.w-12.border-4.border-primary-purple-400.border-t-transparent
  AppTable(v-else,
    v-slot="{ data }",
    :filterOptions="filterOptions",
    :columns="table.columns",
    position="proposal",
    :pageInfo="response.pagination",
    :data="table.data",
    :sortOptions="table.sort",
    @handleRowClick="handleRowClick",
    searchPlaceholder="proposals"
  )
    .flex.items-center.py-2(@click.stop)
      el-dropdown.outline-0(trigger="click")
        span.el-dropdown-link
          .toggle-icon.text-md
            Icon(name="IconToggle", size="22")
        template(#dropdown="")
          el-dropdown-menu
            el-dropdown-item
              NuxtLink.flex.items-center(:to="`/sales/proposals/${data?.id}`")
                Icon.text-md.mr-2(name="IconEye")
                p.text-sm View Details
            el-dropdown-item
              NuxtLink.flex.items-center(:to="`/sales/proposals/add-table/${data?.id}`")
                Icon.text-md.mr-2(name="IconAdd")
                p.text-sm Finance Table
            el-dropdown-item
              NuxtLink.flex.items-center(:to="`/sales/proposals/editor/preview/${data?.id}`")
                Icon.text-md.mr-2( name="IconEye")
                p.text-sm Proposal Preview
            //- el-dropdown-item
            //-   NuxtLink.flex.items-center(
            //-     :to="`/sales/proposals/edit/${data?.id}`"
            //-   )
            //-     Icon.text-md.mr-2(name="IconEdit")
            //-     p.text-sm Edit
  ActionModel(
    v-model="deleteClientPopup",
    :loading="loadingAction",
    btn-text="Move to Archive",
    description-one="Are you sure you want to delete this Client?",
    icon="/images/delete-image.png",
    description-two="It will be archived and can be restored later within 30 days."
  )
  ProposalForm(v-model="AddProposalPopup"  @onSubmit="onSubmit")
</template>

<script setup lang="ts">
const router = useRouter();
const { hasPermission } = await usePermissions();
import { Plus } from "@element-plus/icons-vue";
const loadingAction = ref(false);
const deleteClientPopup = ref(false);
const AddProposalPopup = ref(false);

const table = reactive({
  columns: [
    {
      prop: "title",
      label: "Proposal Title",
      component: "Text",
      sortable: true,
      type: "font-bold",
      width: 200,
    },
    {
      prop: "version",
      label: "Version",
      component: "Text",
      sortable: true,
      type: "font-default",
      width: 150,
    },
    {
      prop: "relatedEntity",
      label: "Related to",
      component: "Text",
      sortable: false,
      type: "font-default",
      width: 150,
    },
    {
      prop: "type",
      label: "Type",
      component: "Text",
      sortable: true,
      type: "font-default",
      filters: [
        { text: "Financial", value: "FINANCIAL" },
        { text: "Technical", value: "TECHNICAL" },
        { text: 'Tech & Financial', value: "MIXED" },
      ],
      width: 150,
    },
    {
      prop: "proposalFor",
      label: "Client Name",
      component: "Text",
      sortable: false,
      type: "font-bold",
      width: 200,
    },
    {
      prop: "status",
      label: "Status",
      sortable: true,
      component: "Label",
      type: "outline",
      filters: [
        { text: "Approved", value: "APPROVED" },
        { text: "Waiting Approval", value: "WAITING_APPROVAL" },
        { text: "Rejected", value: "REJECTED" },
      ],
      width: 150,
    },
    {
      prop: "reference",
      label: "Reference",
      component: "Text",
      sortable: false,
      type: "font-bold",
      width: 200,
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
});

const response = await useTableFilter("proposal");
table.data =response.formattedData?.map((el:any) => {return {...el,
  type :el.type == "Mixed"  ? 'Tech & Financial' : el.type}})


function handleRowClick(val: any) {
  router.push(`/sales/proposals/${val.id}`);
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
    options: [...proposalStatus],
  },
  {
    title: "Type",
    value: "type",
    options: [...ProposalType],
  },
  {
    title: "Assigned user",
    value: "userId",
    options: [...mappedUsers],
  },
  {
    title: "Proposals Created ",
    value: ["fromDate", "toDate"],
    type: "date",
  },
];

const onSubmit = async () => {
  try {
    loadingAction.value = true;
    const response = await useTableFilter("proposal");
    table.data = response.formattedData;
  } finally {
    loadingAction.value = false;
  }
};
</script>
