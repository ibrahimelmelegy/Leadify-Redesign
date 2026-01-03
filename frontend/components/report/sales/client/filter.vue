<template lang="pug">
 el-form(@submit.prevent='onSubmit' )
  .grid.grid-cols-2.gap-3     
   InputSelect(label="Client Type" name="type"  placeholder="Select Type" :options="clientTypes" )
   InputSelect(label="Client Status " name="status"  placeholder="Select Status" :options="clientStatuses" )
   InputSelect(label="Assigned User" name="userId"  placeholder="Select User"  :options="mappedUsers" )
  .grid.grid-cols-2.gap-3
   InputDate(label="From Last Contact Date" placeholder="Enter Date"  name="fromLastContactDate")
   InputDate(label="To Last Contact Date" placeholder="Enter Date"  name="toLastContactDate")
  .flex.justify-end
   el-button(  native-type="submit" size='large' type="primary"  class="!rounded-2xl")  Show Filter Result 
   el-button(  @click="ResetFilter" size='large'   class="!rounded-2xl text-col")  Reset Filter  
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate';
const { handleSubmit, errors, values, resetForm } = useForm();
const emit = defineEmits(['showFilter']);

const data = ref("")
let users = await useApiFetch('users');
const mappedUsers = users?.body?.docs?.map((e: any) => ({
  label: e.name,
  value: e.id,
}));

const onSubmit = handleSubmit(async (values: any) => {
  if (values["fromLastContactDate"]) {
    values["fromLastContactDate"] = [getYear(values["fromLastContactDate"].toISOString())];
  }
  if (values["toLastContactDate"]) {
    values["toLastContactDate"] = [getYear(values["toLastContactDate"].toISOString())];
  }
  emit('showFilter', values);
})

const ResetFilter = async () => {
  //await resetForm()
  emit('showFilter', {
    type: "",
    status: "",
    userId: "",
    fromLastContactDate: "",
    toLastContactDate: ""
  });
  resetForm()
}

</script>