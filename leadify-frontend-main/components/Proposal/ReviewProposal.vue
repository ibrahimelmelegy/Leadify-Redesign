<template>
    <div class="proposal-review">
      <h2>Review Proposal</h2>
  
      <!-- Proposal Info Section -->
      <section>
        <h3>1- Titel</h3>
        <ol>
          <li><p> 1-1 subTitel:</p> </li>
          <li><p>1-2  subTitel:</p></li>
          <li><p>1-3  subTitel:</p> </li>
          <li><p>1-4  subTitel:</p></li>
          <li><p>1-5  subTitel:</p> </li>
        </ol>
      </section>
  
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  

  </script>
  
  <style scoped>
  .proposal-review {
    padding: 20px 40px;
    font-family: Arial, sans-serif;
    background-color:white;
    height:700px
  
  }
  
  h3 {
    margin-top: 10px;
    margin-bottom: 10px;
    font-weight:bolder;
    font-size:20px
  }
  
  p{
    margin-bottom: 5px;
    font-size:16px
  }
  section {
    margin-bottom: 20px;
  }
  
  </style>
  