<template lang="pug">
el-form(  autocomplete="off"   @submit.prevent='onSubmit'   ref="myForm" label-position="top"  :validationSchema="formSchema" )
  slot
  .card.m-auto.bg-white.p-10.rounded-3xl(class="2xl:w-1/2 w-[90%] ")
        el-switch.my-4(v-if="!editMode" v-model="switchType", size="large" inline-prompt, style="--el-switch-on-color: #7849FF; --el-switch-off-color: #918E98", active-text="Select Lead", inactive-text="Select Client")
        .flex.justify-between.items-center.mb-6(v-if="switchType")
          h3.text-xl.font-semibold Lead Information
          el-switch.ml-2(v-if="!editMode" v-model="switchValue", size="large" inline-prompt, style="--el-switch-on-color: #7849FF; --el-switch-off-color: #918E98", active-text="Existing Lead", inactive-text="New Lead")
        .grid.grid-cols-2.gap-3(v-if="switchType")
          component(:is="isLeads" label=" Lead Name"  name="leadName" :options="mappedLeads" :value="selectedLead?.name" @change="getSelectedLead" :disabled="editMode" )
          InputText(label="Company Name"  name="companyName" :value="selectedLead?.companyName" :disabled="editMode" is-form)
          InputText(label="Email"  name="email" :value="selectedLead?.email" @value="val=> isEmail = !!val" :disabled="editMode" is-form)
          InputPhone(label=" Phone Number"  name="phone" :value="selectedLead?.phone" @value="val=> isPhone = !!val" @validphone="val=> validPhone = val" mode="international" :disabled="editMode")
        h3.text-xl.font-semibold.my-6 Opportunity Information
        .grid.grid-cols-2.gap-3
          InputSelect(v-if="!switchType" label=" Client" name="clientId" :options="mappedClients" :value="data?.clientId" )
          InputText(label=" Opportunity Name" name="opportunityName" :value="data?.name" )
          InputSelect(label=" Opportunity Stage" name="opportunityStage" :options="stageOptions" :value="data?.stage" @change="checkIfCancelled" )
          InputText(label=" Profit (optional)" type="number" placeholder="Enter Profit" name="profit" :value="data?.profit" )
          InputSelect(:class="{'col-span-2': !switchType}" label=" Assign User" name="assignUser" isMultiple :options="users" :value="users?.filter((user: any) => data?.users?.map((user: any) => user.id)?.includes(user.value))?.map((user: any) => user.value)" )
        .grid.grid-cols-2.gap-3
          InputText.mt-4(label=" Estimated Budget (optional)" type="number" placeholder="Choose Estimated Budget SAR" name="estimatedValue" :value="data?.estimatedValue" )
          InputDate.mt-4(label=" Expected Close Date (optional)" disabledDate="past" placeholder="Enter Expected Close Date" :value="data?.expectedCloseDate || new Date()" name="expectedCloseDate" )
          InputSelect(label=" Priority (optional)" name="priority"  placeholder="Choose Priority" :options="priorityOptions" :value="data?.priority" )
          InputText(label=" Products/services (optional)" name="interestedIn"  placeholder="Enter Products/services"  :value="data?.interestedIn" )
        InputSelect(label=" Next Steps" isMultiple name="nextSteps" :options="stepsOptions" :value="data?.nextSteps" )
        InputSelect(label=" Reason for lose" name="reasons" :options="reasonOptions" :value="data?.reasonOfLose" v-if="isLose" )
        InputText(type="textarea" placeholder="Notes"  name="notes" :value="data?.notes" )

        //- InputText(type="textarea" placeholder="Notes"  name="notes" :value="data?.notes" )
</template>

<script lang="ts" setup>
  import { useForm } from "vee-validate";
  import * as yup from "yup";
  import isEmailValidator from "validator/lib/isEmail";
  import { defineEmits, defineProps } from "vue";
  const route = useRoute();
  const props = defineProps({
    loading: Boolean,
    label: String,
    data: {
      type: Object,
      required: false,
    },
    editMode: {
      type: Boolean,
      required: false,
    },
  });

  const switchValue = ref(true);
  const switchType = ref(true);
  const emit = defineEmits(["submit", "leadId"]);
  const validPhone = ref(true);
  const isEmail = ref(false);
  const isPhone = ref(false);
  const formSchema = yup.object({
    leadName: yup.string().when([], {
      is: () => switchType.value,
      then: () => yup.string().trim().required().min(2).max(100).label("Lead Name"),

      otherwise: () => yup.string().nullable().trim().max(100).label("Lead Name"),
    }),
    leadCompanyName: yup.string().nullable().trim().max(100).label("Company Name"),
    clientId: yup.string().when([], {
      is: () => !switchType.value,
      then: () => yup.string().required().label("Client"),

      otherwise: () => yup.string().nullable().label("Client"),
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
    opportunityName: yup.string().trim().required().min(2).max(100).label("Opportunity Name"),
    opportunityStage: yup.string().trim().required().min(2).max(100).label("Opportunity Stage"),
    assignUser: yup.array().of(yup.number()).required().min(1).label("Assign User"),
    estimatedValue: yup
      .number()
      .nullable()
      .max(10000000)
      .label("Estimated Budget")
      .transform((value: any, originalValue: any) => (String(originalValue).trim() === "" ? null : value)),
    profit: yup
      .number()
      .nullable()
      .max(10000000)
      .label("Profit")
      .transform((value: any, originalValue: any) => (String(originalValue).trim() === "" ? null : value)),
    expectedCloseDate: yup.date().nullable().label("Expected Close Date"),
    priority: yup.string().nullable().trim().max(100).label("Priority"),
    interestedIn: yup.string().nullable().trim().max(200).label("Interested In"),
    nextSteps: yup.array().of(yup.string()).required().min(1).label("Next Steps"),
    reasons: yup.string().when([], {
      is: () => isLose.value,
      then: () => yup.string().required().trim().min(2).max(250).label("Reason for lose"),
      otherwise: () =>
        yup
          .string()
          .trim()
          .nullable()
          .test(
            "min-length-if-entered",
            "Reason for lose must be at least 2 characters",
            (value: any) => !value || value.length >= 2
          )
          .trim()
          .max(250)
          .label("Reason for lose"),
    }),
    notes: yup
      .string()
      .trim()
      .nullable()
      .test("min-length-if-entered", "Notes must be at least 2 characters", (value: any) => !value || value.length >= 2)
      .trim()
      .max(2000)
      .label("Notes"),
  });

  const { handleSubmit } = useForm({
    validationSchema: formSchema,
  });

  const onSubmit = handleSubmit((values: any, actions: any) => {
    const formatedValues = {
      ...(switchType.value && {
        lead: {
          name: values.leadName,
          companyName: values.companyName,
          email: values.email,
          phone: normalizePhoneNumber(values.phone),
          users: values.assignUser,
        },
      }),
      opportunity: {
        name: values.opportunityName,
        stage: values.opportunityStage,
        estimatedValue: Number(values.estimatedValue),
        profit: Number(values.profit),
        expectedCloseDate: getYear(values.expectedCloseDate),
        priority: values.priority,
        interestedIn: values.interestedIn,
        nextSteps: values.nextSteps,
        reasonOfLose: values.reasons,
        users: values.assignUser,
        notes: values.notes,
        ...(route.path.includes("edit") && values.clientId && !switchType.value && { clientId: values.clientId }),
      },
      ...(!route.path.includes("edit") && values.clientId && { clientId: values.clientId }),
    };
    if (mappedLeads?.length && switchValue.value && switchType.value) emit("leadId", selectedLead.value?.id);
    emit("submit", formatedValues);
  });

  let users = await useApiFetch("users");
  users = users?.body?.docs?.map((e: any) => ({
    label: e.name,
    value: e.id,
  }));

  const selectedLead = ref<any>([]);
  const response = await getLeads();
  const leads = response.leads;

  const mappedLeads = leads?.map((e: any) => ({
    label: e.name,
    value: e.name,
    id: e.id,
  }));

  const leadId = props.data?.leadId || route.query?.leadId;

  if (props.data?.clientId) {
    switchType.value = false;
  }

  if (leadId) {
    let lead = selectedLead.value;

    if (props.data?.leadId) {
      lead = await getLead(leadId);
      if (lead) {
        selectedLead.value = lead;
      }
    } else {
      selectedLead.value = leads?.find((lead: any) => lead.id === leadId);
    }

    if (selectedLead.value) {
      isEmail.value = Boolean(selectedLead.value.email);
      isPhone.value = !isEmail.value && Boolean(selectedLead.value.phone);
    }
  }

  const mappedClients = ref<{ label: string; value: any }[]>();
  //  Get clients
  let { clients } = await getClients();
  // Map clients to Select Options
  mappedClients.value = clients?.map((e: any) => ({
    label: e.clientName,
    value: e.id,
  }));

  function getSelectedLead(e: any) {
    selectedLead.value = leads?.find((lead: any) => lead.id === e.id);
    if (selectedLead.value?.email) {
      isEmail.value = true;
    } else if (selectedLead.value?.phone) {
      isPhone.value = true;
    }
  }

  const isLeads = computed(() => {
    return mappedLeads?.length && switchValue.value ? resolveComponent("InputSelect") : resolveComponent("InputText");
  });

  const isLose = ref(false);
  function checkIfCancelled(value: any) {
    if (value.label === "Lost") {
      isLose.value = true;
    } else {
      isLose.value = false;
    }
  }

  if (props.data?.reasonOfLose) {
    isLose.value = true;
  }
</script>
