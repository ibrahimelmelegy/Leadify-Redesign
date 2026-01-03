<template lang="pug">
el-form.mb-24(autocomplete="off" @submit.prevent="onSubmit" ref="myForm" label-position="top" :key="project")
  slot
  .card.m-auto.bg-white.p-10.rounded-3xl(class="w-[90%] ")
    .grid.grid-cols-2.gap-3
      InputText.mt-4(label="Project Name" placeholder="Enter Project Name" name="name" :value="project?.name")
      InputText.mt-4(label=" Project Type" placeholder="Enter Project Type" name="type" :value="project?.type")
      InputSelect.mt-4(label=" Category" name="category" :options="projectCategories" :value="project?.category" @change="checkIfEtimadProject")
      InputSelect.mt-4(label=" Client" name="client" :options="mappedClients" :value="mappedClients?.find((client: any) => client.value === project?.clientId)?.value")
      InputDate(label=" Start Date" placeholder="Enter Start Date" :value="project?.startDate" name="startDate")
      InputDate(label="End Date" placeholder="Enter End Date" :value="project?.endDate" name="endDate")
      InputText.mt-4(label=" Project Duration" placeholder="Enter Project Duration" name="duration" :value="project?.duration")
      InputSelect.mt-4(label=" Assign User" isMultiple name="assignUser" :options="users" :value="users?.filter((user: any) => project?.assignedUsers?.map((user: any) => user.id)?.includes(user.value))?.map((user: any) => user.value)")
    InputSelect.mt-4(label=" Status " name="status" :options="projectStatuses" :value="project?.status" @change="checkIfCancelled")
    InputText.mt-4(label="Cancel Reason" type="textarea" v-if="isCancelled" placeholder="Enter Cancel Reason" name="cancelReason" :value="project?.cancelledReason")
    InputText.mt-4(label="Project Description" type="textarea" placeholder="Enter Project Description" name="description" :value="project?.description")
    template(v-if="isEtimadProject")
      .title.font-bold.text-xl.capitalize.my-8 Etimad Projects
      .grid.grid-cols-2.gap-3
        InputText.mt-4(label="Abbreviation" placeholder="Enter Abbreviation" name="abbreviation" :value="project?.etimadProject?.abbreviation")
        InputText.mt-4(label="Organization Name" placeholder="Enter Organization Name" name="organizationName" :value="project?.etimadProject?.organizationName")
        InputText.mt-4(label="RFP Name" placeholder="Enter RFP Name" name="rfpName" :value="project?.etimadProject?.rfpName")
        InputSelect.mt-4(label=" Contract Type" name="contractType" :options="contractTypes" :value="project?.etimadProject?.contractType")
        InputText.mt-4(label="Tender Price" placeholder="Enter Tender Price" name="tenderPrice" :value="project?.etimadProject?.tenderPrice")
        InputText.mt-4(label="Business Line" placeholder="Enter Business Line" name="businessLine" :value="project?.etimadProject?.businessLine")
        InputText.mt-4(label="Estimated Budget" placeholder="Enter Estimated Budget" name="estimatedBudget" :value="project?.etimadProject?.estimatedBudget")
        InputText.mt-4(label="Company Margin" placeholder="Enter Company Margin %" name="companyMargin" :value="project?.etimadProject?.companyMargin")
        InputDate.mt-4(label=" Submission Date" placeholder="Enter Submission Date" disabledDate="past" :value="project?.etimadProject?.submissionDate" name="submissionDate")
        InputText.mt-4(label="Remaining Days" type="number" disabled name="remainingDays" :value="remainingDays" :key="remainingDays")
        InputSelect.mt-4(label=" Proposal Status" name="proposalStatus" :options="proposalStatuses" :value="project?.etimadProject?.proposalStatus")
        InputSelect.mt-4(label=" Application Status" name="applicationStatus" :options="applicationStatuses" :value="project?.etimadProject?.applicationStatus")
  .endBar
    .flex.justify-between.w-full
      el-button(size='large' plain type="primary" class=" !rounded-2xl" @click="emit('cancel')") Cancel
      el-button(size='large' type="primary" native-type="submit" :loading="loading" :disabled="loading" class=" !px-5 !rounded-2xl") Next
</template>

<script lang="ts" setup>
  import { useForm } from "vee-validate";
  import * as yup from "yup";
  import { defineEmits, defineProps, defineExpose, defineModel } from "vue";
  const route = useRoute();
  const router = useRouter();
  const props = defineProps({
    loading: Boolean,
    label: String,
    data: {
      type: Object,
      required: false,
    },
  });

  const activeStep = defineModel();
  const emit = defineEmits(["submit", "cancel"]);
  const isCancelled = ref(false);
  const isEtimadProject = ref(false);
  const formSchema = computed(() => {
    const baseSchema = {
      name: yup.string().trim().required().min(2).max(100).label("Project Name"),
      type: yup.string().trim().required().min(2).max(100).label("Project Type"),
      category: yup.string().trim().required().min(2).max(100).label("Category"),
      client: yup.string().nullable().trim().max(100).label("Client"),
      startDate: yup
        .mixed()
        .nullable()
        .notRequired()
        .test("is-valid-date", "Start Date must be a valid date", (value: any) => {
          if (!value) return true; // Skip if empty
          return !isNaN(new Date(value).getTime());
        })
        .label("Start Date"),

      endDate: yup
        .mixed()
        .nullable()
        .notRequired()
        .test("is-valid-date", "End Date must be a valid date", (value: any) => {
          if (!value) return true; // Skip if empty
          return !isNaN(new Date(value).getTime());
        })
        .test("is-after-start-date", "End Date must be after Start Date", function (value: any) {
          const { startDate } = this.parent;
          if (!value || !startDate) return true; // Only check if both exist
          return new Date(value) >= new Date(startDate);
        })
        .label("End Date"),
      duration: yup
        .string()
        .required()
        .test("is-valid-number", "Please enter a valid number.", (value: any) => {
          return /^\d+$/.test(value || "");
        })
        .label("Project Duration"),
      assignUser: yup.array().of(yup.number()).required().min(1).label("Assign User"),
      status: yup.string().trim().required().label("Status"),
      description: yup.string().trim().nullable().max(500).label("Project Description"),
      cancelReason: yup.string().when([], {
        is: () => isCancelled.value,
        then: () => yup.string().required().min(2).max(250).label("Cancellation Reason"),
      }),
    };

    if (isEtimadProject.value) {
      return yup.object({
        ...baseSchema,
        abbreviation: yup.string().trim().required().min(2).max(100).label("Abbreviation"),
        organizationName: yup.string().trim().required().min(2).max(100).label("Organization Name"),
        rfpName: yup.string().trim().required().min(2).max(100).label("RFP Name"),
        contractType: yup.string().trim().required().min(2).max(100).label("Contract Type"),
        tenderPrice: yup
          .string()
          .nullable()
          .test("is-valid-number", "Please enter a valid number.", (value: any) => /^\d*\.?\d*$/.test(value || ""))
          .label("Tender Price"),
        businessLine: yup.string().nullable().trim().max(100).label("Business Line"),
        estimatedBudget: yup
          .string()
          .nullable()
          .test("is-valid-number", "Please enter a valid number.", (value: any) => /^\d*\.?\d*$/.test(value || ""))
          .label("Estimated Budget"),
        companyMargin: yup
          .string()
          .nullable()
          .test("is-valid-number", "Please enter a valid number.", (value: any) => /^\d*\.?\d*$/.test(value || ""))
          .test("max-value", "Value must be less than or equal to 100.", (value: any) =>
            value ? parseFloat(value) <= 100 : true
          )
          .label("Company Margin"),
        submissionDate: yup
          .mixed()
          .test("is-valid-date", "Submission Date must be a valid date", (value: any) => {
            // Check if the value is valid
            return value && !isNaN(new Date(value).getTime());
          })
          .required("Submission Date is required")
          .label("Submission Date"),
        proposalStatus: yup.string().trim().required().label("Proposal Status"),
        applicationStatus: yup.string().trim().required().label("Application Status"),
      });
    }

    return yup.object(baseSchema);
  });

  const users = ref<any[]>([]);
  const mappedClients = ref<{ label: string; value: any }[]>([]);
  const clients = ref<any[]>([]);
  
  onMounted(async () => {
    try {
      const [usersRes, clientsRes] = await Promise.all([
        useApiFetch("users"),
        getClients()
      ]);
      
      users.value = usersRes?.body?.docs?.map((e: any) => ({
        label: e.name,
        value: e.id,
      })) || [];
      
      clients.value = clientsRes.clients || [];
      mappedClients.value = clients.value.map((e: any) => ({
        label: e.clientName,
        value: e.id,
      }));
    } catch (e) {
      console.error('Failed to load form data:', e);
    }
  });

  /**
   * Checks if the deal stage has been set to 'Cancelled'.
   */
  function checkIfCancelled(value: any) {
    if (value.label === "Cancelled") {
      isCancelled.value = true;
    } else {
      isCancelled.value = false;
    }
  }

  if (project.value?.cancelledReason) {
    isCancelled.value = true;
  }

  /**
   * Checks if the project category has been set to 'ETIMAD Project'.
   */
  function checkIfEtimadProject(value: any) {
    if (value.label === "Etimad Project") {
      isEtimadProject.value = true;
    } else {
      isEtimadProject.value = false;
    }
  }

  if (project.value?.category === "Etimad") {
    isEtimadProject.value = true;
  }

  const { handleSubmit, errors, values } = useForm({
    validationSchema: formSchema,
  });

  const onSubmit = handleSubmit(async (values: CombinedProjectValues) => {
    // Prepare the project info
    const basicInfo = formattedBasicInfo(values);
    const etimadInfo = formattedEtimadProjectInfo(values);
    const projectInfo = {
      basicInfo: {
        ...basicInfo,
        ...(isEtimadProject.value && { etimadInfo }),
      },
    };

    try {
      // Attempt to create the project
      await createProject(projectInfo);
      activeStep.value++;
    } catch (error) {
      // Handle the error and prevent the step from being incremented
      console.error("Project creation failed", error);
    }
    // emit('submit')
  });

  function formattedBasicInfo(values: any) {
    if (!values) return {};
    return cleanObject({
      name: values?.name,
      type: values?.type,
      category: values?.category,
      clientId: values?.client,
      startDate: typeof values?.startDate === "string" ? values?.startDate : values?.startDate?.toISOString(),
      endDate: typeof values?.endDate === "string" ? values?.endDate : values?.endDate?.toISOString(),
      duration: Number(values?.duration),
      assignedUsersIds: values?.assignUser,
      status: values?.status,
      description: values?.description,
      cancelledReason: values?.cancelReason,
    });
  }

  function formattedEtimadProjectInfo(values: any) {
    if (!values) return {};
    return cleanObject({
      abbreviation: values?.abbreviation,
      organizationName: values?.organizationName,
      rfpName: values?.rfpName,
      contractType: values?.contractType,
      tenderPrice: Number(values?.tenderPrice),
      businessLine: values?.businessLine,
      estimatedBudget: Number(values?.estimatedBudget),
      companyMargin: Number(values?.companyMargin),
      submissionDate:
        typeof values?.submissionDate === "string" ? values?.submissionDate : values?.submissionDate?.toISOString(),
      proposalStatus: values?.proposalStatus,
      applicationStatus: values?.applicationStatus,
    });
  }
  function calculateRemainingDays(): number | null {
    const submissionDate = values?.submissionDate; // Example: "2025-02-13"
    const currentDate = new Date().toISOString().split("T")[0];
    if (!submissionDate || !currentDate) return null;

    // Convert input strings to Date objects
    const submission = new Date(submissionDate);
    const current = new Date(currentDate);

    // Validate date conversion
    if (isNaN(submission.getTime()) || isNaN(current.getTime())) return null;

    // Calculate difference in time (milliseconds)
    const diffTime = submission.getTime() - current.getTime();

    // Convert milliseconds to days
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Ensure remaining days are not negative
    return diffDays >= 0 ? diffDays : 0;
  }

  const remainingDays = ref(calculateRemainingDays());
  remainingDays.value = project.value?.etimadProject?.remainingDays || calculateRemainingDays();
  watch(
    () => [values.submissionDate],
    () => {
      remainingDays.value = calculateRemainingDays();
      console.log("remainingDays.value", remainingDays.value);
    },
    {
      deep: true,
    }
  );
</script>
