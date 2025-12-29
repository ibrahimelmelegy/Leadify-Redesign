<template lang="pug">
div
  .statistics-filter.flex.items-center.justify-between
    ul.list-none.flex.border.rounded-3xl
      li.py-4.px-8(class="border-r border-neutral-100 cursor-pointer" @click="setCardsFilter('today')" :class="{ 'bg-secondary-blue-50 text-secondary-blue-500 rounded-s-3xl': activeCardFilter === 'today' }")
        button Today
      li.py-4.px-8(class="border-r border-neutral-100 cursor-pointer" @click="setCardsFilter('thisWeek')" :class="{ 'bg-secondary-blue-50 text-secondary-blue-500 ': activeCardFilter === 'thisWeek' }")
        button This week
      li.py-4.px-8(class="border-r border-neutral-100 cursor-pointer" @click="setCardsFilter('thisMonth')" :class="{ 'bg-secondary-blue-50 text-secondary-blue-500 ': activeCardFilter === 'thisMonth' }")
        button This month
      li.py-4.px-8.cursor-pointer(@click="setCardsFilter('last3Month')" :class="{ 'bg-secondary-blue-50 text-secondary-blue-500 rounded-e-3xl': activeCardFilter === 'last3Month' }")
        button Last 3 month

    el-select(size="large" @change="setCardsFilter('custom')"  class="!w-[120px]" )
      template(#prefix)
        Icon.text-lg.text-main(name="solar:calendar-minimalistic-linear")
      el-option(v-for="item in yearsFilterOptionTime" :key="item" :label="item.value" :value="item")
</template>

<script setup lang="ts">
const activeCardFilter = ref('today');

async function setCardsFilter(filter: string) {
  activeCardFilter.value = filter;
  // make api call
  // ....
}
</script>
