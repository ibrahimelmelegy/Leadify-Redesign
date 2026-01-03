<template lang="pug">
div.flex.items-center.gap-3(@click.stop)
        div(v-if="withImage")
          Avatar(v-if="image && !isText" :src="image" :table="true" @click="$emit('showFile' , image )")
          .text(v-else-if="title" :style="{ backgroundColor: randomBgColor() }")
            p.text-sm.font-semibold.whitespace-nowrap {{ getWordInitials(title) }}

        div
            h3.text-sm.font-medium.text-black {{ title }}
            p.text-xs {{ text }}
</template>

<script setup>
  const props = defineProps({
    image: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    withImage: {
      type: Boolean,
    },
    text: {
      type: String,
      required: false,
    },
  });
</script>
<style lang="postcss">
  .text {
    @apply border border-neutral-100 p-2 flex items-center justify-center text-white rounded-full w-[3rem] h-[3rem] min-w-[3rem] min-h-[3rem];
  }
</style>
