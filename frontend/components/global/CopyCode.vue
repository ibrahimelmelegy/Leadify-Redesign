<template lang="pug">
button.AppButton(    type="button" @click.stop="copyText(title)" :class="{'text-xs font-medium text-zinc-500 bg-stone-100 px-3 py-2 rounded-2xl' : background , '!p-1' :small }" ).flex.items-center.gap-1
    span {{ title }}
    Icon(name="ion:copy-outline")
</template>

<script setup>
const props = defineProps({
  title: String,
  background: Boolean,
  small: Boolean,
});
</script>

<style scoped lang="scss"></style>
