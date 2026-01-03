<template lang="pug">
.flex.items-center.justify-center.h-screen
    .text-center.bg-white.rounded-2xl.p-5
      div.m-auto(class="w-[500px]")
        h3.text-4xl.text-red-500.mb-4 {{error.statusCode}}
        p.text-xl.max-w-xl.text-gray-800.mb-10 {{error.message  || `Oops! This page is still under construction.`}}
        el-button(size='large' type="primary" @click="handleerror")  Go back Home

</template>

<script setup>
  defineProps(["error", "statusCode"]);

  const handleerror = () => {
    clearError({ redirect: "/" });
  };
</script>

<style scoped></style>
