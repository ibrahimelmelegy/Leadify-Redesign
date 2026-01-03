<template>
  <div contenteditable="false">
    <div class="flex align-center justify-between">
      <div class="appLogo">
        <img class="w-[120px]" src="/images/Logo.png" alt="Logo" />
      </div>
      <div class="proposal-info">
        <p class="text-sm text-gray-400 font-medium mb-2">
          Reference: <span class="text-black">{{ proposalDetails?.reference }}</span>
        </p>
        <p class="text-sm text-gray-400 font-medium mb-4">
          Version: <span class="text-black">{{ proposalDetails?.version }}</span>
        </p>
      </div>
    </div>
  </div>
  <div class="my-2">
    <h1 style="font-weight: 600; margin: -20px 1px 1px 1px; font-size: x-large">
      TABLE OF CONTENTS
    </h1>
  </div>
  <div class="flex flex-col my-4" >
    <section v-for="(parent, index) in table" class="mb-4">
      <div
        style="font-weight: 400; color:black; font-size: large; "
        class="flex flex-row w-full justify-between  "
      >
        <h3>{{ index + 1 }} . {{ parent?.parent?.value.replace(/[0-9.:-]/g, "") }}</h3>
        <p>{{ parent?.parent?.page }}</p>
      </div>
      <ol style="font-weight: 300 ;color: gray;font-size: large" class="my-3 ml-4">
        <li v-for="(child, indexChild) in parent?.childs" style="margin-left: 10px">
          <div class="flex flex-row w-full justify-between">
            <p>
             <span class="mr-1"> {{ index + 1 }} . {{ indexChild + 1 }} </span>
                {{ child?.value.replace(/[0-9.:-]/g, "") }}
            </p>
            <p> {{ child?.page }}</p>
          </div>
        </li>
      </ol>
    </section>
  </div>
</template>
<script setup lang="ts">
const props = defineProps({
  table: {
    type: Array,
    required: true,
  },
  proposalDetails: {
    type: Object,
  },
});
</script>

<style lang="scss" scoped></style>
