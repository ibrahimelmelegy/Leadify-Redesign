<template lang="pug">
    el-form(  autocomplete="off"   @submit.prevent='onSubmit'   ref="myForm" label-position="top"  :validationSchema="formSchema" )
      slot
      div(:class="{'2xl:w-1/2 w-[90%]  card m-auto bg-white p-10 rounded-3xl': !isModal}")
        .grid.grid-cols-2.gap-3
          InputText.mt-4(label="Name"  placeholder="Enter Name" name="name" :value="data?.name" )
          InputSelect.mt-4(label="Priority" name="priority" :options="taskPriorityOptions" :value="data?.priority" )
          InputSelect.mt-4(label="Status" name="status" :options="taskStatusOptions" :value="data?.status ?? route.query.status.toUpperCase()" )
          InputSelect.mt-4(label="User" name="userId" :options="users" :value="data?.userId" )
          InputSelect.mt-4(label="Client" name="clientId" :options="clients"  @change="[onFetchClient($event?.value)]" :value="data?.clientId" )
          InputSelect.mt-4(label="Sales Representative" name="salesRepresentativeId" :options="users" :value="data?.salesRepresentativeId" )
          InputText.mt-4(label="Cost"  placeholder="Enter Cost SAR" name="cost" :value="data?.cost" )
          InputText.mt-4(label="Down Payment"  placeholder="Enter Down Payment" name="downPayment" :value="data?.downPayment" )
          InputText.mt-4(label="Total Paid"  placeholder="Enter Total Paid" name="totalPaid" :value="data?.totalPaid" )
          //- InputDate.mt-4(label="Start Date"  placeholder="Enter Start  Date"  :value="data?.startDate || new Date()" name="startDate" )
          //- InputDate.mt-4(label="End Date"  placeholder="Enter End  Date"  :value="data?.endDate || new Date()" name="endDate" )
        .grid.grid-cols-1.gap-3
          InputText(type="textarea" placeholder="Notes"  name="notes" :value="data?.notes" )
      slot(name="modal-footer")

 
  
    </template>

<script lang="ts" setup>
import { useForm } from "vee-validate";
import * as yup from "yup";
import { defineEmits, defineProps } from "vue";
const router = useRouter();
const route = useRoute();
const props = defineProps({
  loading: Boolean,
  label: String,
  isModal: Boolean,
  data: {
    type: Object,
    required: false,
  },
});

const emit = defineEmits(["submit" ,"fetchClient"]);


const formSchema = yup.object({
  name: yup.string().trim().required().min(2).max(100).label("name"),
  cost: yup
    .string() // Use string to allow flexible input (empty, float, or integer)
    .required()
    .test(
      "is-valid-number",
      "Please enter a valid number.", // Custom error message
      (value: any) => {
        if (!value) return true; // Allow empty input
        return /^\d*\.?\d*$/.test(value); // Check if value is a valid integer or float
      }
    )
    .max(25)
    .label("Cost"),
  downPayment: yup
    .string() // Use string to allow flexible input (empty, float, or integer)
    .required()
    .test(
      "is-valid-number",
      "Please enter a valid number.", // Custom error message
      (value: any) => {
        if (!value) return true; // Allow empty input
        return /^\d*\.?\d*$/.test(value); // Check if value is a valid integer or float
      }
    )
    .max(25)
    .label("Down Payment"),
  totalPaid: yup
    .string() // Use string to allow flexible input (empty, float, or integer)
    .required()
    .test(
      "is-valid-number",
      "Please enter a valid number.", // Custom error message
      (value: any) => {
        if (!value) return true; // Allow empty input
        return /^\d*\.?\d*$/.test(value); // Check if value is a valid integer or float
      }
    )
    .max(25)
    .label("Total Paid"),
  status: yup.string().trim().nullable().max(100).label("Status"),
  priority: yup.string().trim().nullable().max(100).label("Priority"),
  clientId: yup.string().trim().nullable().label("client"),
  userId: yup.string().required().label("user"),
  salesRepresentativeId: yup.string().required().label("sales Representative"),
});

const { handleSubmit } = useForm({
  validationSchema: formSchema,
});

// Emit delete
function onFetchClient(id:string) {
  console.log(id)
  emit('fetchClient', id);
}
const users = ref<any[]>([]);
const clients = ref<any[]>([]);

onMounted(async () => {
  try {
    const [usersRes, clientsRes] = await Promise.all([
      useApiFetch("users?limit=10000"),
      useApiFetch("client?limit=10000")
    ]);
    
    users.value = usersRes?.body?.docs?.map((e: any) => ({
      label: e.name,
      value: e.id,
    })) || [];
    
    clients.value = [
      { label: "New Client", value: 0 },
      ...(clientsRes?.body?.docs?.map((e: any) => ({
        label: e.clientName,
        value: e.id,
      })) || []),
    ];
  } catch (e) {
    console.error('Failed to load form data:', e);
  }
});

const onSubmit = handleSubmit((values: any, actions: any) => {
  emit("submit", {
    ...values,
    cost: Number(values.cost),
    downPayment: Number(values.downPayment),
    totalPaid: Number(values.totalPaid),
  });
});
</script>
