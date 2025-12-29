<template lang="pug">  
 el-form(@submit.prevent='onSubmit' )
  .grid.grid-cols-2.gap-3     
    InputSelect(label="Deal Stage" name="stage"  placeholder="Select Type"  :options="dealStageOptions" )
    InputSelect(label="Assigned User" name="userId"  placeholder="Select User"   :options="mappedUsers")
    InputSelect(label="Contact Type" name="contractType"  placeholder="Select Contact Type" :options="contractTypeOptions"  )
  .grid.grid-cols-2.gap-3
    InputDate(label="From Expected Signature Date" placeholder="Enter Date "  name="fromDate")  
    InputDate(label="To Expected Signature Date" placeholder="Enter Date "  name="toDate")  
  .flex.justify-end
    el-button(  native-type="submit" size='large' type="primary"  class="!rounded-2xl")  Show Filter Result 
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
  if( values["fromDate"]) {
    values["fromDate"] = [getYear(values["fromDate"].toISOString())];
  }
  if( values["toDate"]) {
    values["toDate"] = [getYear(values["toDate"].toISOString())];
  }
  emit('showFilter', values);
})

const ResetFilter = async () => {
  emit('showFilter', {
    stage: "",
    userId: "",
    contractType: "",
    fromDate: "",
    toDate: ""
  });
  resetForm()
}

</script>