<template lang="pug">  
  el-form(@submit.prevent='onSubmit' )
   .grid.grid-cols-2.gap-3     
    InputSelect(label="Manufacturer" name="manufacturer"  placeholder="Select Manufacturer" :options="manufacturers" )
   .grid.grid-cols-4.gap-3     
    InputText(label="From Rent Cost" placeholder="Enter From Rent Cost" name="fromRentCost" )  
    InputText(label="To Rent Cost" placeholder="Enter To Rent Cost" name="toRentCost" )

    InputText(label="From Regular Maintenance Cost" placeholder="Enter From Regular Maintenance Cost" name="fromRegularMaintenanceCost" )  
    InputText(label="To Regular Maintenance Cost" placeholder="Enter To Regular Maintenance Cost" name="toRegularMaintenanceCost" )
   .flex.justify-end
    el-button.mt-2(  native-type="submit" size='large' type="primary"  class="!rounded-2xl" )  Show Filter Result 
    el-button.mt-2(  @click="ResetFilter" size='large'   class="!rounded-2xl text-col")  Reset Filter  
 </template>
 
 <script setup lang="ts">
 import { useForm } from 'vee-validate';
 const { handleSubmit, errors, values ,resetForm } = useForm();
 const emit = defineEmits(['showFilter']);

 const onSubmit = handleSubmit(async (values:any) => {
  emit('showFilter', values);
})

const ResetFilter = async () => {
  //await resetForm()
  emit('showFilter', {
    manufacturer: "",
    fromRentCost: "",
    toRentCost: "",
    fromRegularMaintenanceCost: "",
    toRegularMaintenanceCost: "",
  });
  resetForm()
}
 </script>