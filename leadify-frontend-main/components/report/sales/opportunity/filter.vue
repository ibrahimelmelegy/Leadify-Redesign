<template lang="pug">  
el-form(@submit.prevent='onSubmit' )
 .grid.grid-cols-2.gap-3     
   InputSelect(label="Opportunity Stage" name="stage"  placeholder="Select Stage" :options="stageOptions"  )
   InputSelect(label="Assigned User" name="userId"  placeholder="Select User"  :options="mappedUsers" )
   InputSelect(label="Assigned Priority" name="priority"  placeholder="Select Priority"  :options="priorityOptions" )
 .grid.grid-cols-2.gap-3
   InputDate(label="From Expected Close Date" placeholder="Enter Date Range"  name="fromExpectedCloseDate")
   InputDate(label="To Expected Close Date" placeholder="Enter Date Range"  name="toExpectedCloseDate")
 .flex.justify-end
   el-button(  native-type="submit" size='large' type="primary"  class="!rounded-2xl" )  Show Filter Result 
   el-button(  @click="ResetFilter" size='large'   class="!rounded-2xl text-col")  Reset Filter 
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate';
const { handleSubmit, errors, values,resetForm } = useForm();
const emit = defineEmits(['showFilter']);

let users = await useApiFetch('users');
const mappedUsers = users?.body?.docs?.map((e: any) => ({
  label: e.name,
  value: e.id,
}));

const onSubmit = handleSubmit(async (values:any) => {
  if( values["fromExpectedCloseDate"]) {
    values["fromExpectedCloseDate"] = [getYear(values["fromExpectedCloseDate"].toISOString())];
  }
  if( values["toExpectedCloseDate"]) {
    values["toExpectedCloseDate"] = [getYear(values["toExpectedCloseDate"].toISOString())];
  }
  emit('showFilter', values);
})

const ResetFilter = async () => {
  emit('showFilter', {
    stage: "",
    userId: "",
    priority: "",
    fromExpectedCloseDate: "",
    toExpectedCloseDate: ""
  });
  resetForm()
}

</script>