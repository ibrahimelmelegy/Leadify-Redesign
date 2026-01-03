<template lang="pug">
.grid.grid-cols-2.gap-3
  InputDate(label="from", name="date", :value="value?.[position[0]]?.[0]" placeholder="MM/DD/YY", @value="(date) => handleDateChange(date, position[0])")
  InputDate(label="to", name="date" :value="value?.[position[1]]?.[0]" placeholder="MM/DD/YY", @value="(date) => handleDateChange(date, position[1])")
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  title: String,
  position: String,
  value: Object,
});

const emit = defineEmits(['value']);

const handleDateChange = (date: Date, type: string) => {
  emit('value', date, type);
};
</script>
