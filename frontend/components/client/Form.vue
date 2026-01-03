<template lang="pug">
el-form.mb-24(  autocomplete="off"   @submit.prevent='onSubmit'   ref="myForm" label-position="top"  :validationSchema="formSchema" )
  slot
  .card.m-auto.bg-white.rounded-3xl(class="2xl:w-1/2 w-[90%] " :class="!withoutPading ? 'p-10' : 'p-[0px]'")
    .flex.align-center.justify-between
      span
      el-switch.my-4(v-if="!editMode && mappedLeads?.length" v-model="switchValue", size="large" inline-prompt, style="--el-switch-on-color: #7849FF; --el-switch-off-color: #918E98", active-text="Existing Lead", inactive-text="New Client")
    .grid.grid-cols-2.gap-3
      component.mt-3(:is="isLeads" :label="` ${switchValue && !editMode && mappedLeads?.length ? 'Lead' : 'Client'} Name`"  name="clientName" :options="mappedLeads" is-form :value="selectedLead?.name || data?.clientName" @change="getSelectedLead" )
      InputText.mt-3(label="Company Name"  name="companyName" :value="selectedLead?.companyName  || data?.companyName" is-form)
      InputText.mt-3(label="Email"  name="email" :value="selectedLead?.email || data?.email" @value="val=> isEmail = !!val" is-form)
      InputPhone.mt-3(label=" Phone Number"  name="phone" :value="selectedLead?.phone || data?.phoneNumber" @value="val=> isPhone = !!val" @validphone="val=> validPhone = val" mode="international")
      InputSelect.mt-3(label=" Client Type" name="clientType" :options="clientTypes" :value="data?.clientType")
      InputSelect.mt-3(label=" Assign User" name="users" isMultiple :options="users" :value="users?.filter((user: any) => data?.users?.map((user: any) => user.id)?.includes(user.value))?.map((user: any) => user.value)" )
    .grid.grid-cols-2.gap-3
      InputText(label=" City" name="city"  placeholder="Enter City"  :value="data?.city" )
      InputText(label=" Street Address" name="streetAddress"  placeholder="Enter Street Address"  :value="data?.streetAddress" )
      InputText.mt-3(label=" State" name="state"  placeholder="Enter State"  :value="data?.state" )
      InputText.mt-3(label=" zip code" name="zipCode"  placeholder="Enter zip code"  :value="data?.zipCode" )
      InputSelect.mt-3(label=" Industry" name="industry" :options="clientIndustries" :value="data?.industry" )
      InputSelect.mt-3(label=" Client Status" name="clientStatus" :options="clientStatuses" :value="data?.clientStatus" )
    InputUploadFiles.mt-3(label="Upload File *" name="file" :value="data?.fileUpload?.map((file: any) => ({name: file, response: file, uid: uuidv4() }))" multiple)
</template>

<script lang="ts" setup>
  import { useForm } from "vee-validate";
  import * as yup from "yup";
  import isEmailValidator from "validator/lib/isEmail";
  import { defineEmits, defineProps } from "vue";
  import { v4 as uuidv4 } from "uuid"; // To generate unique IDs
  const route = useRoute();
  const props = defineProps({
    loading: Boolean,
    withoutPading:Boolean,
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
  const emit = defineEmits(["submit", "leadId"]);
  const validPhone = ref(true);
  const isEmail = ref(false);
  const isPhone = ref(false);
  const formSchema = yup.object({
    clientName: yup.string().trim().required().min(2).max(100).label("Client Name"),
    companyName: yup.string().nullable().trim().max(100).label("Company Name"),
    email: yup.string().when([], {
      is: () => isPhone.value,
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
          .required("At least one of email or phone number is required")
          .test(
            "is-valid",
            (message: any) => "Invalid email",
            (value: any) => (value ? isEmailValidator(value) : new yup.ValidationError("Invalid value"))
          )
          .label("Email"),
    }),
    phone: yup.number().when([], {
      is: () => isEmail.value,
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
    clientType: yup.string().trim().nullable().max(100).label("Client Type"),
    users: yup.array().of(yup.number()).nullable().label("Assign User"),
    city: yup.string().nullable().trim().max(50).label("City"),
    streetAddress: yup.string().nullable().trim().max(100).label("Street Address"),
    state: yup.string().nullable().trim().max(50).label("State"),
    zipCode: yup.string().nullable().trim().max(10).label("Zip Code"),
    industry: yup.string().trim().nullable().max(100).label("Industry"),
    clientStatus: yup.string().trim().nullable().max(100).label("Client Status"),
    file: yup.array().nullable().label("Upload File *"),
  });

  const { handleSubmit } = useForm({
    validationSchema: formSchema,
  });

  const onSubmit = handleSubmit((values: any, actions: any) => {
    let formattedValues = cleanObject({
      ...values,
      ...(values.file?.length && { fileUpload: values.file?.map((file: any) => file.response) }),
      ...(selectedLead.value && switchValue.value && !props.editMode && { leadId: selectedLead.value?.id }),
    });
    delete formattedValues.file;

    emit("submit", formattedValues);
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

  function getSelectedLead(e: any) {
    selectedLead.value = leads?.find((lead: any) => lead.id === e.id);
    if (selectedLead.value?.email) {
      isEmail.value = true;
    } else if (selectedLead.value?.phone) {
      isPhone.value = true;
    }
  }

  const isLeads = computed(() => {
    return mappedLeads?.length && switchValue.value && !props.editMode
      ? resolveComponent("InputSelect")
      : resolveComponent("InputText");
  });
</script>
