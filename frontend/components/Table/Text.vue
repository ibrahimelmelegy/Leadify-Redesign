<template lang="pug">
div(:class="type") {{ value }}
  
</template>

<script setup>
const props = defineProps({
  value: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: false,
  },
});
</script>
