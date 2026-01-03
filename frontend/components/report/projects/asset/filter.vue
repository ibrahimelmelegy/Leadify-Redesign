<template lang="pug">  
  el-form(@submit.prevent='onSubmit' )
   .grid.grid-cols-2.gap-3     
    InputText(label="From Rent Price" placeholder="Enter From Rent Price" name="fromRentPrice" )  
    InputText(label="To Rent Price" placeholder="Enter To Rent Price" name="toRentPrice" ) 

    InputText(label="From Buy Price" placeholder="Enter From Buy Price" name="fromBuyPrice" )  
    InputText(label="To Buy Price" placeholder="Enter From Buy Price" name="toBuyPrice" ) 
   .flex.justify-end
    el-button.mt-2(  native-type="submit" size='large' type="primary"  class="!rounded-2xl")  Show Filter Result 
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
    fromRentPrice: "",
    toRentPrice: "",
    fromBuyPrice: "",
    toBuyPrice: "",
  });
  resetForm()
}

 </script>