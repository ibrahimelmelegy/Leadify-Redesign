<template lang="pug">
el-card.p-6(v-loading="loading")
  .flex.flex-col
    p.text-sm.font-medium.mb-8 {{ name || '---' }}
    p.text-3xl.font-bold {{ data || '0'}}
    //- StatisticsCardIncreaseDecrease(:number="rate")
</template>

<script lang="ts" setup>
  const props = defineProps({
    name: {
      type: String,
      required: true,
    },
    data: {
      type: [Number, String],
      required: true,
    },
    // rate: {
    //   type: Number,
    //   required: true,
    // },
  });
</script>
