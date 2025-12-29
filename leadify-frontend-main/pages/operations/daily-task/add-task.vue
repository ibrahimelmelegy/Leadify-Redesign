<template lang="pug">
    OperationsDailyTasksForm( :loading="loading" @fetchClient = "fetchClient" @submit="submitForm")
      .flex.items-center.justify-between.mb-8
        .title.font-bold.text-2xl.mb-1.capitalize Create {{route.query.status}} Project 
        .flex.items-center.gap-x-2
          el-button(   size='large' plain type="primary" class="w-full !rounded-2xl" @click="router.back()") Cancel
          el-button(   size='large' type="primary" native-type="submit" :loading="loading"  :disabled="loading" class="w-full !px-5 !rounded-2xl") Save
    ActionModel(v-model="openFormClient" , :loading="loadingClient",style="width:100wh",title="create Client" ,btn-text="save",@confirm="submitFormClient")
     template(#input)
      InputText.mt-3(label="Client Name" @change ="setClient" name="clientName" :value="data?.clientName" is-form)

      InputText.mt-3(label="Company Name" @change ="setCompany" name="companyName" :value="data?.companyName" is-form)
      InputText.mt-3(label="Email"  name="email" @change ="setEmail" :value=" data?.email" @value="val=> isEmail = !!val" is-form)
      p.mt-3 Phone Number
      InputPhone.mt-3(label=""  name="phone" @change ="setPhone" :value=" data?.phoneNumber" @value="val=> isPhone = !!val" @validphone="val=> validPhone = val" mode="international")
      InputSelect.mt-3(label=" Client Type" name="clientType"  @change ="setType" :options="clientTypes" :value="data?.clientType")
      
    </template>

<script lang="ts" setup>
useHead({
  title: "App HP Tech | Add Daily Task",
});
const route = useRoute();
const router = useRouter();
const switchValue = ref(true);
const validPhone = ref(true);
const isEmail = ref(false);
const isPhone = ref(false);
const openFormClient = ref(false);
const ClientNew = ref({
  name: "",
  phone: "",
  email: "",
  companyName: "",
  clientType: "",
});

let users = await useApiFetch("users");
users = users?.body?.docs?.map((e: any) => ({
  label: e.name,
  value: e.id,
}));

const selectedLead = ref<any>([]);

const leadId = null;

async function setClient(pre: any) {
  ClientNew.value.name = pre.target?.value;
}

async function setEmail(pre: any) {
  ClientNew.value.email =pre.target?.value
}
async function setPhone(pre: any) {
  ClientNew.value.phone =pre.target?.value
}
async function setCompany(pre: any) {
  ClientNew.value.companyName = pre.target?.value
}
async function setType(pre: any) {
  ClientNew.value.clientType =pre.target?.value
}

const fetchClient = (clientId: string) => {
  if (clientId == "0") openFormClient.value = true;
};

const loading = ref(false);
async function submitForm(values: DailyTask) {
  loading.value = true;
  await createDailyTask(values);
  loading.value = false;
}

const loadingClient = ref(false);
async function submitFormClient() {
  loadingClient.value = true;
  try {
    let formattedValues = cleanObject({
      clientName: ClientNew.value?.name,
      phone: ClientNew.value?.phone,
      email: ClientNew.value?.email,
      companyName: ClientNew.value?.companyName,
      clientType: ClientNew.value?.clientType,
    });
    console.log(ClientNew.value)
    await createClient(formattedValues, true);
  } catch (err) {
    console.log("Error saving forms:", err);
    loadingClient.value = false;
  } finally {
    openFormClient.value = false;
    loadingClient.value = false;
  }
}
</script>

<style lang="scss"></style>
