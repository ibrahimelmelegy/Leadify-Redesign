<template lang="pug">
.flex.items-center.justify-between.mb-5.mt-5
  .title.font-bold.text-2xl.mb-1.capitalize Proposal Details
  div
    el-dropdown(trigger="click")
      span.el-dropdown-link
        button.rounded-btn(class="!px-4"): Icon(name="IconToggle", size="24")
      template(#dropdown)
        el-dropdown-menu
          el-dropdown-item
            NuxtLink.flex.items-center(
              :to="`/sales/proposals/editor/preview/${proposal?.id}`"
            )
              Icon.text-md.mr-2(size="20", name="IconEye")
              p.text-sm Preview
          el-dropdown-item( @click='AddProposalPopup = true' ,:disabled="proposal?.status == 'APPROVED'")
              Icon.text-md.mr-2(size="20", name="IconEdit")
              p.text-sm Edit
          el-dropdown-item( @click='EditProposalPopup = true')
              Icon.text-md.mr-2(size="20", name="IconEdit")
              p.text-sm Edit Status
.flex.align-center.gap-6.mt-3.flex-row(class="xl:flex-row")
  .flex-1.bg-white.p-10.rounded-3xl
    .mt-2
      .grid.gap-4(class="md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4")
        div(v-if="proposal?.title")
          .text-neutral-400.font-medium.mb-2.flex.items-center
            Icon.mr-2(name="solar:hashtag-outline", size="20")
            p Proposal Title
          p.text-neutral-800.mb-2 {{ proposal?.title }}
        div(v-if="proposal?.version")
          .text-neutral-400.font-medium.mb-2.flex.items-center
            Icon.mr-2(name="solar:hashtag-outline", size="20")
            p Version
          p.text-neutral-800.mb-2 {{ proposal?.version }}
        div
          .text-neutral-400.font-medium.mb-2.flex.items-center
            Icon.mr-2(name="solar:hashtag-outline", size="20")
            p Related to
          p.text-neutral-800.mb-2 {{ proposal?.relatedEntity?.name }} #[span.border.rounded-xl.text-xs.px-2(:class="`label-outline-${getStatusColor(proposal?.relatedEntityType)}`") {{ formatSnakeCase(proposal?.relatedEntityType) }}]
        div(v-if="proposal?.status")
          .text-neutral-400.font-medium.mb-2.flex.items-center
            Icon.mr-2(name="tabler:category-2", size="20")
            p Status
          p.text-neutral-800.mb-2 #[span.border.rounded-xl.text-xs.px-2(:class="`label-outline-${getStatusColor(proposal?.status)}`" @click='EditProposalPopup = true' style="cursor: pointer") {{ proposal?.status == "Mixed" ? 'Tech & Financial' : formatSnakeCase(proposal?.status) }}]
        div(v-if="proposal?.proposalDate")
          .text-neutral-400.font-medium.mb-2.flex.items-center
            Icon.mr-2(name="IconCalendar", size="20")
            p Date
          p.text-neutral-800.mb-2 {{ formatDate(proposal?.proposalDate) }}
        div
          .text-neutral-400.font-medium.mb-2.flex.items-center
            Icon.mr-2(name="tabler:category-2", size="20")
            p Type
          p.text-neutral-800.mb-2 {{ proposal?.type == "MIXED"  ? 'Tech & Financial' : formatSnakeCase(proposal?.type)}}
        div
          .text-neutral-400.font-medium.mb-2.flex.items-center
            Icon.mr-2(name="solar:hashtag-outline", size="20")
            p Reference
          p.text-neutral-800.mb-2 {{ proposal?.reference }}
        div
          .text-neutral-400.font-medium.mb-2.flex.items-center
            Icon.mr-2(name="solar:hashtag-outline", size="20")
            p Proposal For
          p.text-neutral-800.mb-2 {{ proposal?.proposalFor }}
        div(v-if="proposal?.users?.length")
          .text-neutral-400.font-medium.mb-2.flex.items-center
            Icon.mr-2(name="IconAssign", size="20")
            p Assign
          p.text-neutral-800.mb-2 {{ proposal?.users?.map((user) => user.name).join(", ") }}
.flex-1.bg-white.p-10.rounded-3xl.mt-6(v-if="proposal?.notes")
        .flex.items-center.gap-2.mb-4
          .flex.items-center.justify-center.w-10.h-10.rounded-full.bg-secondary-turquoise-50: Icon.text-secondary-turquoise-700(name="IconNote" size="24")
          h4.text-lg.font-semibold.text-neutral-900 Notes
        p.text-neutral-800.leading-relaxed {{proposal?.notes}}
.flex-1.bg-white.p-10.rounded-3xl.mt-6(v-if="proposal?.rejectionReason")
        .flex.items-center.gap-2.mb-4
          .flex.items-center.justify-center.w-10.h-10.rounded-full.bg-secondary-turquoise-50: Icon.text-secondary-turquoise-700(name="IconNote" size="24")
          h4.text-lg.font-semibold.text-neutral-900 Rejection Reason
        p.text-neutral-800.leading-relaxed {{proposal?.rejectionReason}}
        
.flex-1.bg-white.p-10.rounded-3xl.mt-6(v-if="proposal?.fileAttachments?.length")
    .flex.items-center.gap-3.mb-6
      .flex.items-center.justify-center.w-12.h-12.rounded-full(class="!min-w-[48px] !min-h-[48px]" class="bg-secondary-turquoise-50 text-secondary-turquoise-700"): Icon(name="mdi:file-outline" size="24")
      h4.text-lg.font-semibold.text-neutral-900 Documents
    .flex.gap-4.flex-wrap.items-center
      button(@click="downloadFile(`https://staging-api.hp-tech.com/assets/${file}`, file)" class="bg-white border rounded-lg p-4 flex items-center space-x-4" v-for="file in proposal?.fileAttachments" :key="file")
        img(:src="`/images/files/${file?.split('.').pop()}.svg`" size="40")
        p(class="text-gray-800 font-medium") {{file}}
        Icon(name="solar:download-bold" class="text-neutral-500 ml-auto")
ProposalForm(v-model="AddProposalPopup" :editStatus="false"  @onSubmit="onSubmit" :data="proposal")
ProposalForm(v-model="EditProposalPopup" :editStatus="true"  @onSubmit="onSubmit" :data="proposal")
</template>

<script setup>
const activeName = ref("information");
const route = useRoute();
import { ElMessage } from "element-plus";
const AddProposalPopup = ref(false)
const EditProposalPopup =  ref(false)
const loading = ref(false);
const proposal = ref(null);
const content = ref(null);

// Call API to Get the client
const fetchProposal = async () => {
  try {
    proposal.value = await getProposal(route.params.slug);
    const parser = new DOMParser();
    const doc = parser.parseFromString(proposal.value?.content, "text/html");

    // Find the div you want to remove
    const targetDiv = doc.querySelector('.page[data-content-idx="0"]'); // Adjust the selector if needed
    if (targetDiv) {
      targetDiv.remove(); // Removes the div from the document
    }
    doc.querySelectorAll(".page").forEach((element, index) => {
      element.style.top = index * 1180 + 1700;
      console.log(element.style.top);
    });
    content.value = doc.body.innerHTML;
  } catch (error) {
    console.error("Error fetching proposal:", error);
  }
};

onMounted(async () => {
  await fetchProposal();
});

const  onSubmit = async () =>{
try{
  loading.value = true
  fetchProposal()
}finally{
  loading.value = false
} 
}

</script>

<style scoped lang="scss">
.activity {
  position: relative;
  &::before {
    content: "";
    height: 100%;
    width: 1px;
    position: absolute;
    left: 24px;
    top: 2%;
    border: 1px dashed #e7e6e9;
    z-index: -1;
  }
  > div:last-of-type {
    background: #f8f7fa !important;
  }
}
</style>
