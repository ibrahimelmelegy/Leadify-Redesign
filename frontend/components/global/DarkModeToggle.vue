<template lang="pug">
.dark-mode-toggle
  el-switch(
    v-model="isDark"
    :active-icon="Moon"
    :inactive-icon="Sunny"
    @change="toggleDarkMode"
  )
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Moon, Sunny } from '@element-plus/icons-vue';

const isDark = ref(false);

onMounted(() => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    isDark.value = true;
    document.documentElement.classList.add('dark');
  } else if (savedTheme === 'light') {
    isDark.value = false;
    document.documentElement.classList.remove('dark');
  } else {
    isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (isDark.value) {
      document.documentElement.classList.add('dark');
    }
  }
});

function toggleDarkMode(value: boolean) {
  if (value) {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }
}
</script>

<style scoped>
.dark-mode-toggle {
  display: flex;
  align-items: center;
}
</style>
