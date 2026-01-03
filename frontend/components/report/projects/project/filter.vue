<template lang="pug">  
 el-form(@submit.prevent='onSubmit' )
  .grid.grid-cols-2.gap-3     
   InputSelect(label="Project Type" name="type"  placeholder="Select Type" :options="projectCategories" )
   InputSelect(label="Project Status " name="status"  placeholder="Select Status" :options="projectStatuses" )
  .grid.grid-cols-2.gap-3
   InputDate(label="From Start Date" placeholder="Enter Start Date "  name="fromStartDate")
   InputDate(label="To Start Date" placeholder="Enter Start Date"  name="toStartDate")
   InputDate(label="From End Date" placeholder="Enter End Date"  name="fromEndDate")
   InputDate(label="To End Date" placeholder="Enter End Date"  name="toEndDate")
  .flex.justify-end
   el-button.mt-2(  native-type="submit" size='large' type="primary"  class="!rounded-2xl")  Show Filter Result 
   el-button.mt-2(  @click="ResetFilter" size='large'   class="!rounded-2xl text-col")  Reset Filter  
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate';
const { handleSubmit, errors, values ,resetForm } = useForm();
const emit = defineEmits(['showFilter']);

const onSubmit = handleSubmit(async (values:any) => {
  if( values["fromStartDate"]) {
    values["fromStartDate"] = [getYear(values["fromStartDate"].toISOString())];
  }
  if( values["toStartDate"]) {
    values["toStartDate"] = [getYear(values["toStartDate"].toISOString())];
  }
  if( values["fromEndDate"]) {
    values["fromEndDate"] = [getYear(values["fromEndDate"].toISOString())];
  }
  if( values["toEndDate"]) {
    values["toEndDate"] = [getYear(values["toEndDate"].toISOString())];
  }
  emit('showFilter', values);
})

const ResetFilter = async () => {
  //await resetForm()
  emit('showFilter', {
    type: "",
    status: "",
    fromStartDate: "",
    toStartDate: "",
    fromEndDate: "",
    toEndDate: "",
  });
  resetForm()
}

</script>