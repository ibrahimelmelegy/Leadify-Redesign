<template lang="pug">
el-button(:type="type" :size="size" :link="link" :native-type="nativeType" :plain="plain" :loading="loading" class="!rounded-2xl")
  .flex.items-center.gap-1
    Icon.rtl-flip(:name="icon" v-if="icon" :size="iconSize")
    span.mb-0 {{ text }}

</template>
<script setup lang="ts">
const props = defineProps({
  text: {
    type: String,
    required: true,
  },
  type: {
    type: String,
  },
  size: {
    type: String,
    default: 'large',
  },
  nativeType: {
    type: String,
  },
  plain: {
    type: Boolean,
    default: false,
  },
  link: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  icon: {
    type: String,
  },
  iconSize: {
    type: String,
  },
});
</script>
