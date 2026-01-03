<template lang="pug">
    .stat-card(v-loading="loading")
            Icon.text-2xl.text-main(:name="icon?.name" :style="{color :icon?.color}")
            .stat-value(id="active-projects-count") {{ data }}
            .stat-label(id="active-projects-count") {{ name }}
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
      icon: {
        type: Object,
        required: true,
      },
     
    });
    </script>
    <style>
    .stat-card {
      flex: 1;
      min-width: 200px;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
      padding: 20px;
      text-align: center;
    }
    
    .stat-value {
      font-size: 24px;
      font-weight: bold;
      color: #3498db;
      margin: 10px 0;
    }
    
    .stat-label {
      color: #7f8c8d;
      font-size: 14px;
    }
    </style>
    