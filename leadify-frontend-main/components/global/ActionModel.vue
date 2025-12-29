<template lang="pug">
el-dialog(v-model='dialog' width='500' align-center='')
    .text-center.text-neutral-600
      img.mb-3(class="mx-auto" :src="icon" alt="icon" v-if="icon")
      p.text-2xl.font-bold.mb-3 {{title}}
      span.text-lg {{description}}
    slot(name="input")
    template(#footer='')
        .dialog-footer
            .w-full.flex.mt-4
                el-button(  class="w-1/2 !rounded-2xl" @click='dialog = false' size="large"   ) Cancel
                el-button(class="w-1/2 !rounded-2xl !text-white" type='primary' @click='confirm' size="large" :loading="loading" :disabled="loading") {{btnText}}

</template>

<script setup>
const props = defineProps({
  title: String,
  description: String,
  loading: Boolean,
  icon: String,
  btnText: {
    type: String,
    default: 'Confirm',
  },
});
const emit = defineEmits(['confirm']);
const confirm = () => {
  emit('confirm');
};
const dialog = defineModel();
</script>
