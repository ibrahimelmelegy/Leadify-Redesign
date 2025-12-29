<template lang="pug">  
 el-form(@submit.prevent='onSubmit' )
  .grid.grid-cols-2.gap-3     
   InputSelect(label="Role" name="role"  placeholder="Select role"   :options="manpowerRoles" )
   InputSelect(label="Availability Status" name="availabilityStatus"  placeholder="Select Availability Status"   :options="manpowerAvailabilityStatus" )
  .grid.grid-cols-2.gap-3     
   InputDate(label="From Date" placeholder="Enter Date Range" name="fromDate" )  
   InputDate(label="To Date" placeholder="Enter Date Range" name="toDate" ) 
  .flex.justify-end
   el-button.mt-2(  native-type="submit" size='large' type="primary"  class="!rounded-2xl")  Show Filter Result 
   el-button.mt-2(  @click="ResetFilter" size='large'   class="!rounded-2xl text-col")  Reset Filter  
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate';
const { handleSubmit, errors, values ,resetForm } = useForm();
const emit = defineEmits(['showFilter']);

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
  //await resetForm()
  emit('showFilter', {
    role: "",
    availabilityStatus: "",
    fromDate: "",
    toDate: "",
  });
  resetForm()
}

</script>