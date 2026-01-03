<template lang="pug">
.img.avatar.cursor-pointer(:style="small && ' width:32px  ; height:32px  ;'  , (!big && !small) && 'width:50px  ; height:50px' " style="border-radius: 50%;overflow: hidden; display : flex ; justifyContent: center ; alignItems: center ; background:#e1e1e1 " :class="{'big' : big , 'bigger' : bigger}")
        LazyImg(:src="src"  v-if="!text" :small="true" @click="showfile()"  )

        .text(v-else)
            p.text-2xl.font-semibold(:class="{'big-text' : big }") {{ text[0].toUpperCase() }}
        el-dialog(v-model='fileShow'  class="file xl:!w-1/3 lg:!w-1/3 sm:!w-[90%] !w-full " align-center='' )
                LazyImg.m-auto(:src="src" :key="src" )

</template>

<script setup>
  const props = defineProps({
    src: String,
    small: Boolean,
    text: String,
    big: Boolean,
    bigger: Boolean,
    table: Boolean,
  });

  const fileShow = ref(false);
  function showfile(file) {
    if (!props.table) {
      fileShow.value = true;
    }
  }
  const runtimeConfig = useRuntimeConfig();
</script>

<style lang="scss" scoped>
  .big {
    width: 132px;
    height: 132px;
  }
  .big-text {
    font-size: 5em !important;
  }
  .bigger {
    width: 80px !important;
    height: 80px !important;
  }
  .avatar {
    transition: all 0.3s ease;
    border: 1px solid transparent;
    &:hover {
      border-color: $primary;
    }
  }
</style>
