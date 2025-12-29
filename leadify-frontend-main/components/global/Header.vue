<template lang="pug">
.header.flex.items-center.justify-between.mb-8
    div
        .title.font-bold.text-xl.mb-1 {{  route.path.split("/").filter((n) => n&& n !== 'ar')[0] ? formatTextWithyphen(route.path.split("/").filter((n) => n && n !== 'ar' )[0]).toLowerCase() : home  }}
        Breadcramp(:key="breadkey" :disableRoot="disableRoot")
    slot
</template>

<script setup>
const breadkey = ref(0);
const route = useRoute();
const props = defineProps({
  disableRoot: {
    type: Boolean,
    default: false,
  },
});

watch(
  () => route.path,
  () => {
    breadkey.value++;
  }
);
</script>
