<template lang="pug">
.image(class="w-[100%]  h-[200px] overflow-hidden  flex justify-center border-dashed rounded-xl  border-2 border-teal-400" )
                            LazyImg(:src="src" class=" object-cover h-[100%] " )  
</template>

<script setup lang="ts">
const props = defineProps({
  src: String,
});
</script>

<style></style>
