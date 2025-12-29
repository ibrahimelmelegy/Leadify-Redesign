<template>
    <div>
      <div v-for="(item, index) in content" :key="index">
        <div v-if="item.type === 'title'">
          <input v-model="item.text" placeholder="Enter Title" />
        </div>
        <div v-if="item.type === 'subtitle'">
          <input v-model="item.text" placeholder="Enter Subtitle" />
        </div>
        <div v-if="item.type === 'description'">
          <textarea v-model="item.text" placeholder="Enter Description" />
        </div>
      </div>
      <button @click="addContent('title')">Add Title</button>
      <button @click="addContent('subtitle')">Add Subtitle</button>
      <button @click="addContent('description')">Add Description</button>
  
      <div>
        <button @click="goToNextStage">Next</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  const emit = defineEmits(['next']);
  
  const content = ref([]);
  
  const addContent = (type) => {
    content.value.push({ type, text: '' });
  };
  
  const goToNextStage = () => {
    emit('next'); // Emit event to move to the next stage
  };
  </script>
  