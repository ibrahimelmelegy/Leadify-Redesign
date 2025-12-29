<template lang="pug">
.flex.items-center.justify-between(v-if="checkStatuesNumber(number) === 'Positive'" class="text-[#0DB355] font-semibold")
  .flex.items-center
    Icon.text-lg(name="line-md:arrow-up")
    .flex.items-center.gap-2
      p
        span.text-sm {{`+${number}`}}
          span %
      p.text-black.font-normal.text-sm vs last month
  img(src="/images/increase-chart.webp" alt="Increase chart")

.flex.items-center.justify-between(v-if="checkStatuesNumber(number) === 'Negative'" class="text-[#EE2424] font-semibold")
  .flex.items-center
    Icon.text-lg(name="line-md:arrow-down")
    .flex.items-center.gap-2
      p
        span.text-sm {{ number }}
          span %
      p.text-black.font-normal.text-sm vs last month
  img(src="/images/decrease-chart.webp" alt="decrease chart")


.flex.items-center.gap-1(v-if="!checkStatuesNumber(number) || checkStatuesNumber(number) === 'Zero'")
  span.text-sm.font-medium {{number}}
</template>

<script setup lang="ts">
const props = defineProps({
  number: {
    type: Number,
    required: true,
  },
});
</script>
