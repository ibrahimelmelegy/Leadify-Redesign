<template lang="pug">
el-dialog(v-model="dialog", width="800", class="h-[95%]", align-center="")
  template(#header)

    .title.font-bold.text-2xl.mb-1.capitalize {{editStatus  ? 'Edit Status' : data ? 'Edit Proposal' : 'Create Proposals'}}
  template(#default="scope")
    div(style="overflow: auto; height: 80vh")
      el-form(
        autocomplete="off",
        @submit.prevent="onSubmit",
        ref="myForm",
        label-position="top",
        :validationSchema="formSchema"
      )
        .card.m-auto.bg-white.p-5.rounded-3xl(class="w-[100%]")
          
          .grid.grid-cols-1(class="md:grid-cols-2 gap-[16px]", style="height: 80% ")
            InputSelect(
              v-if="!editStatus"
              label="Related type",
              name="relatedEntityType",
              :options="proposalRelatedTypes",
              innerClass="!mb-0",
              :value="data?.relatedEntityType",
              @change="[fetchRelatedToOptions($event.value), setFieldValue('relatedEntityId', '')]"
            )
            InputSelect(
              v-if="!editStatus"
              label="Related to",
              name="relatedEntityId",
              :options="proposalRelatedToOptions",
              innerClass="!mb-0"
              :value="data?.relatedEntityId"
            )
            //- InputText(label="Client name" name="clientName")
            InputText(v-if="!editStatus" label="Proposal Title", name="title", :value="data?.title")
            InputText(
              v-if="!editStatus"
              label="Proposal Version",
              name="version",
              type="number",
              step="0.1",
              min="1"
              :value="data?.version ?? '1.0'"
            )
            InputSelect(
              v-if="!editStatus"
              :value="data?.type",
              label="Proposal Type",
              name="type",
              :options="ProposalType",
              innerClass="!mb-0"
            )
            InputSelect(
              v-if="editStatus"
              :value="data?.status == 'REJECTED' ? 'reject' : 'approve'",
              label="Proposal Status",
              name="status",
              :options="optionStaus",
              innerClass="!mb-0"
              @change="[]"
            )
            InputText( v-if="!editStatus" label="Proposal Reference", name="reference" :value="data?.reference")
            InputText(label="Proposal For" ,v-if="!editStatus", name="proposalFor" :value="data?.proposalFor")
            InputSelect(
              v-if="!editStatus"
              :value="data?.users?.map((el) => el?.id)",
              label="Assign User",
              name="users",
              :options="mappedUsers",
              isMultiple,
              innerClass="!mb-0"
            )
            InputUploadImage.col-span-1(
              v-if="!editStatus"
              label="Company Logo",  
              name="companyLogo",
             class="col-span-2 md:col-span-2",
             :value="data?.companyLogo"
             style= "justify-items:center"
             note="max File Size 20mg"
            )
           
            InputText.col-span-1.item-center(
              v-if="!editStatus"
              label="Notes",
              name="notes",
              type="textarea",
              class="md:col-span-2"
              :value="data?.notes"
            )
            InputText.col-span-1.item-center(
              v-if="values?.status == 'reject' && editStatus"
              label="Reason",
              name="reason",
              type="textarea",
              class="md:col-span-2"
              :value="data?.rejectionReason"
            )
            InputUploadFiles.col-span-1(
               v-if="!editStatus"
              label="File Attachments",
              name="file",
              :limit="4",
              :formats="fileAttachmentsFormats",
              :value="data?.fileAttachments?.map((file: any) => ({name: file, response: file }))"
              formatsError="Accept only PDF, Word, Jpg, Jpeg, Png",
              :tipNote="false",
              class="md:col-span-2",
              innerClass="!mb-0"
            )
          el-form-item.mt-8(class="!mb-0")
            el-button(
              size="large",
              plain,
              type="primary",
              class="!rounded-2xl",
              @click="dialog = false"
            ) Cancel
            el-button(
              size="large",
              type="primary",
              native-type="submit",
             
              :loading="loading",
              :disabled="loading",
              class="!px-5 !rounded-2xl"
            ) Next
</template>

<script setup lang="ts">
import { defineEmits, defineProps, defineModel } from "vue";
import { useForm } from "vee-validate";
import * as yup from "yup";

const dialog = defineModel();
const emit = defineEmits(["onSubmit"]);

const props = defineProps({
  title: {
    type: String,
  },
  data: {
    type: Object,
  },
  loading: {
    type: Boolean,
  },
  editStatus: {
    type: Boolean,
  },
});

// Form options
const mappedUsers = ref<any[]>([]);

onMounted(async () => {
  try {
    const response = await useApiFetch("users");
    mappedUsers.value = response?.body?.docs?.map((e: any) => ({
      label: e.name,
      value: e.id,
    })) || [];
  } catch (e) {
    console.error('Failed to load users:', e);
  }
});

watch(
  () => props.data,
  () => {
    if (props?.data?.relatedEntityType)
      fetchRelatedToOptions(props?.data?.relatedEntityType);
  }
);

// Handle form
const formSchema = yup.object({
  relatedEntityType: yup.string().trim().nullable().label("Related type"),
  relatedEntityId: yup.string().trim().nullable().label("Related to"),
  title: yup.string().trim().required().min(2).max(50).label("Proposal title"),
  version: yup.string().required().min(1).label("Proposal Version"),
  date: yup.date().required().label("Proposal date"),
  type: yup.string().trim().required().min(2).max(100).label("Proposal type"),
  reference: yup.string().trim().required().min(2).max(50).label("Proposal reference"),
  proposalFor: yup.string().trim().required().min(2).max(100).label("Proposal for"),
  users: yup.array().of(yup.string()).required().min(1).label("Assign User"),
  companyLogo: yup.string().trim().required().label("Company Logo"),
  fileAttachments: yup.array().min(1).label("File Attachments"),
  comments: yup.string().trim().nullable().max(500).label("Comments"),
});

const { handleSubmit, setFieldValue, values, resetForm, errors } = useForm({
  validationSchema: formSchema,
});

const optionStaus = [
  { value: "reject", label: "Reject" },
  { value: "approve", label: "Approve" },
    { value: "waiting-approval", label: "Waiting Approval" },
];
const onSubmit = () => {
  try {
    const createAt = String(getYear(new Date()));
    const data: any = { ...values, date: createAt };
    props?.data ? updateProposal({ ...data, id: props?.data?.id }) : createProposal(data);
  } catch (error) {
    console.error("Proposal creation failed", error);
  } finally {
    dialog.value = false;
    resetForm();
    // emit('onSubmit');
  }
};
</script>
