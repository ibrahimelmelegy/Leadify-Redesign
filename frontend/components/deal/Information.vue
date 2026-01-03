<template lang="pug">
el-form(autocomplete="off" @submit.prevent="onSubmit" ref="myForm" label-position="top")
  .card.m-auto.bg-white.p-10.rounded-3xl(class="2xl:w-1/2 w-[90%] ")
    el-switch.my-4(v-if="!editMode" v-model="switchType", size="large" inline-prompt, style="--el-switch-on-color: #7849FF; --el-switch-off-color: #918E98", active-text="Select Client", inactive-text="Select Lead")
    .flex.justify-between.items-center.mb-6(v-if="switchType")
      h3.text-xl.font-semibold Client Information
      el-switch.ml-2(v-if="!editMode" v-model="switchValue", size="large" inline-prompt, style="--el-switch-on-color: #7849FF; --el-switch-off-color: #918E98", active-text="Existing Client", inactive-text="New Client")
    .grid.grid-cols-2.gap-3(v-if="switchType" :key="selectedClient")
      component(:is="isClients" label=" Client Name" name="leadName" :options="mappedClients" :value="selectedClient?.clientName" @change="getSelectedClient" :disabled="editMode")
      InputText(label="Company Name" name="leadCompanyName" :value="selectedClient?.companyName" :disabled="editMode" is-form)
      InputText(label="Email" name="email" :value="selectedClient?.email" @value="val=> isEmail = !!val" :disabled="editMode" is-form)
      InputPhone(label=" Phone Number" name="phone" :value="selectedClient?.phoneNumber" @validphone="val=> validPhone = val" @value="val=> isPhone = !!val" mode="international" :disabled="editMode")
    h3.text-xl.font-semibold.my-6 Deal Information
    .grid.grid-cols-2.gap-3
      InputSelect(v-if="!switchType" label=" Lead" name="leadId" :options="mappedLeads" :value="selectedLead?.id" :disabled="editMode")
      InputText(label="Deal Name" name="dealName" :value="deal?.name" is-form)
      InputText(label="Company Name" name="companyName" :value="deal?.companyName" is-form)
      InputText(label="Deal Price" type="number" name="dealPrice" :value="deal?.price" is-form)
      InputSelect(label=" Contract Type" name="contractType" :options="contractTypeOptions" :value="deal?.contractType")
      InputSelect(label=" Assign User" name="assignUser" isMultiple :options="users" :value="users?.filter((user: any) => deal?.users?.map((user: any) => user.id)?.includes(user.value))?.map((user: any) => user.value)")
      InputDate(label="Signature Date" placeholder="Enter Signature Date" :value="deal?.signatureDate" name="signatureDate")
      InputSelect(:class="{'col-span-2': switchType}" label=" Deal Stage" name="dealStage" :options="dealStageOptions" :value="deal?.stage" @change="checkIfCancelled")
    InputText(type="textarea" placeholder="Cancellation Reason" name="cancellationReason" :value="deal?.cancelledReason" v-if="isCancelled")
</template>

<script lang="ts" setup>
  import { defineEmits, defineProps } from "vue";
  import { useForm } from "vee-validate";
  import isEmailValidator from "validator/lib/isEmail";
  import * as yup from "yup";
  import { Plus } from "@element-plus/icons-vue";

  const props = defineProps({
    editMode: Boolean,
    deal: Object,
  });

  //  refs and composables
  const route = useRoute();
  const router = useRouter();
  const switchValue = ref(true);
  const switchType = ref(false);
  const isCancelled = ref(false);
  const validPhone = ref(true);
  const loading = ref(false);
  const emit = defineEmits(["onSubmit"]);
  const myForm = ref();
  const isEmail = ref(false);
  const isPhone = ref(false);

  // form schema for validation
  const formSchema = yup.object({
    leadName: yup.string().when([], {
      is: () => switchType.value,
      then: () => yup.string().trim().required().min(2).max(100).label("Client Name"),

      otherwise: () => yup.string().nullable().trim().max(100).label("Client Name"),
    }),
    leadCompanyName: yup.string().nullable().trim().max(100).label("Company Name"),
    leadId: yup.string().when([], {
      is: () => !switchType.value,
      then: () => yup.string().required().label("Lead"),

      otherwise: () => yup.string().nullable().label("Lead"),
    }),
    email: yup.string().when([], {
      is: () => isPhone.value || !switchType.value,
      then: () =>
        yup
          .string()
          .email()
          .max(100)
          .nullable()
          .test(
            "is-valid",
            (message: any) => "Invalid email",
            (value: any) => !value || isEmailValidator(value)
          )
          .label("Email"),
      otherwise: () =>
        yup
          .string()
          .email()
          .max(100)
          .nullable("At least one of email or phone number is required")
          .test(
            "is-valid",
            (message: any) => "Invalid email",
            (value: any) => (value ? isEmailValidator(value) : new yup.ValidationError("Invalid value"))
          )
          .label("Email"),
    }),
    phone: yup.number().when([], {
      is: () => isEmail.value || !switchType.value,
      then: () =>
        yup
          .number()
          .nullable() // Allows the value to be null
          .transform((value: any, originalValue: any) => (originalValue === "" ? null : Number.isNaN(value) ? null : value))
          .label("Phone Number")
          .test("Phone number", "Invalid Phone", function (value: any) {
            if (value === null || value === undefined) {
              return true;
            }
            return validPhone.value ? true : false;
          }),
      otherwise: () =>
        yup
          .number()
          .transform((value: any) => (Number.isNaN(value) ? null : value))
          .nullable()
          .required("At least one of email or phone number is required")
          .label("Phone Number")
          .test("Phone number", "invalid Phone", function (value: any) {
            return validPhone.value ? true : false;
          }),
    }),
    dealName: yup.string().trim().required().min(2).max(100).label("Deal Name"),
    companyName: yup.string().trim().required().min(2).max(100).label("Company Name"),
    contractType: yup.string().trim().required().max(100).label("Contract Type"),
    dealStage: yup.string().trim().required().max(100).label("Deal Stage"),
    assignUser: yup.array().of(yup.number()).required().min(1).label("Assign User"),
    dealPrice: yup
      .number()
      .nullable() // Allows null values
      .transform((value: any, originalValue: any) => (String(originalValue).trim() === "" ? null : value))
      .required("Deal Price is required")
      .max(100000000000)
      .label("Deal Price"),
    signatureDate: yup
      .mixed()
      .test("is-valid-date", "Signature Date must be a valid date", (value: any) => {
        // Check if the value is valid
        return value && !isNaN(new Date(value).getTime());
      })
      .required("Signature Date is required")
      .label("Signature Date"),
    cancellationReason: yup.string().when([], {
      is: () => isCancelled.value,
      then: () => yup.string().required().trim().min(2).max(250).label("Cancellation Reason"),
      otherwise: () =>
        yup
          .string()
          .trim()
          .nullable()
          .test(
            "min-length-if-entered",
            "Cancellation Reason must be at least 2 characters",
            (value: any) => !value || value.length >= 2
          )
          .trim()
          .max(250)
          .label("Cancellation Reason"),
    }),
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

  if (props.deal?.cancelledReason) {
    isCancelled.value = true;
  }

  const users = ref<any[]>([]);
  const leads = ref<any[]>([]);
  const mappedLeads = ref<any[]>([]);
  const selectedClient = ref<any>([]);
  const mappedClients = ref<{ label: string; value: any }[]>([]);
  const selectedLead = ref<string | null>();
  const clients = ref<any[]>([]);

  onMounted(async () => {
    try {
      const [usersRes, leadsRes, clientsRes] = await Promise.all([
        useApiFetch("users"),
        getLeads(),
        getClients()
      ]);
      
      users.value = usersRes?.body?.docs?.map((e: any) => ({
        label: e.name,
        value: e.id,
      })) || [];
      
      leads.value = leadsRes.leads || [];
      mappedLeads.value = leads.value.map((e: any) => ({
        label: e.name,
        value: e.id,
      }));
      
      clients.value = clientsRes.clients || [];
      mappedClients.value = clients.value.map((e: any) => ({
        label: e.clientName,
        value: e.clientName,
        id: e.id,
      }));

      if (props.deal?.clientId) {
        selectedClient.value = clients.value.find((client: any) => client.id === props.deal?.clientId);
        switchType.value = true;
      }

      const leadId = route.query?.leadId || props?.deal?.leadId;
      const opportunityId = route.query?.opportunityId;

      if (leadId) {
        let lead: any = leads.value.find((l: any) => l.id === leadId);

        if (!lead || opportunityId) {
          lead = await getLead(leadId as string);
        }

        if (lead) {
          mappedLeads.value = [...mappedLeads.value, { label: lead.name, value: lead.id }];
          selectedLead.value = lead;
        }
      }
    } catch (e) {
      console.error('Failed to load form data:', e);
    }
  });

  function getSelectedClient(e: any) {
    selectedClient.value = clients.value?.find((lead: any) => lead.id === e.id);

    if (selectedClient.value?.email) {
      isEmail.value = true;
    } else if (selectedClient.value?.phone) {
      isPhone.value = true;
    }
  }
  // computed property to determine which component to render
  const isClients = computed(() => {
    return mappedClients.value?.length && switchValue.value
      ? resolveComponent("InputSelect")
      : resolveComponent("InputText");
  });

  if (selectedClient.value?.email) {
    isEmail.value = true;
  } else if (selectedClient.value?.phone) {
    isPhone.value = true;
  }

  // Form Validation
  const { handleSubmit, errors, validate, resetForm, values } = useForm({
    validationSchema: formSchema,
  });

  watch(
    () => switchValue.value,
    () => {
      // if (!switchValue.value) {
      selectedClient.value = null;
      // }
    }
  );

  // submit deal form
  const onSubmit = handleSubmit((values: any) => {
    try {
      // Prepare formatted values
      const formattedValues = {
        lead: formatLeadData(values),
        deal: formatDealData(values),
      };

      // Set loading state to true
      loading.value = true;

      // Prepare submission payload
      const leadId = route.query?.leadId;
      const opportunityId = route.query?.opportunityId;
      const shouldSubmitWithLead = leadId || (mappedLeads?.length && !switchType.value && values.leadId);

      const payload =
        shouldSubmitWithLead || selectedClient.value
          ? {
              ...(switchType.value ? { deal: formattedValues.deal } : formattedValues.deal),
              ...(!route.path.includes("edit") && !switchType.value && { leadId: leadId || values.leadId }),
              ...(switchType.value && { clientId: selectedClient.value?.id }),
              ...(opportunityId && { opportunityId }),
            }
          : formattedValues;

      // Emit the submission event
      emit("onSubmit", payload);
    } catch (error) {
      console.error("Error while submitting the form:", error);
    } finally {
      // Reset loading state
      loading.value = false;
    }
  });

  // Utility functions for formatting data
  function formatLeadData(values: any) {
    return cleanObject({
      name: values.leadName,
      companyName: values.leadCompanyName,
      email: values.email,
      phone: normalizePhoneNumber(values.phone),
      users: values.assignUser,
    });
  }

  function formatDealData(values: any) {
    return cleanObject({
      name: values.dealName,
      price: Number(values.dealPrice),
      contractType: values.contractType,
      stage: values.dealStage,
      signatureDate: getYear(values.signatureDate),
      cancelledReason: values.cancellationReason,
      companyName: values.companyName,
      users: values.assignUser,
    });
  }

  async function onSubmitForm(): Promise<boolean> {
    // Validate the form, and exit early if validation fails
    await validate();
    if (Object.keys(errors.value).length) return false;
    try {
      await onSubmit();
      return true; // form submitted successfully
    } catch (error) {
      ElMessage.error("Submission failed");
      return false; // Submission failed
    }
  }

  async function onSubmitInformation() {
    const isSubmitted = await onSubmitForm();

    // Only proceed if all forms are submitted successfully
    if (!isSubmitted) {
      ElMessage.error("Please fill in all the required in Deal information fields.");
      return;
    }
  }

  // Expose methods to the parent component
  defineExpose({
    onSubmitInformation,
  });
</script>
