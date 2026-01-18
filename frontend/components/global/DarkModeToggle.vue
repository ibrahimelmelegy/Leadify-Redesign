<template lang="pug">
.dark-mode-toggle
  el-switch(
    v-model="isDark"
    :active-icon="Moon"
    :inactive-icon="Sunny"
  )
</template>

<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core';
import { Moon, Sunny } from '@element-plus/icons-vue';

const isDark = useDark({
  selector: 'html',
  attribute: 'class',
  valueDark: 'dark',
  valueLight: '',
});
const toggleDark = useToggle(isDark);
</script>

<style scoped>
.dark-mode-toggle {
  display: flex;
  align-items: center;
}
</style>
