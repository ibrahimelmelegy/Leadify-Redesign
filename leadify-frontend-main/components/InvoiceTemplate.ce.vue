<template lang="pug">
div.proposal
  .proposal-content(ref="captureRef")
    .proposal-content-pages.is-intro
      .proposal-content-pages-info
        .proposal-content-pages-info-data
          p.subtitle Reference: #[span(style="color:rgb(96, 58.4, 204) ;font-weight: lighter") {{modelValue?.proposalDetails?.reference}}]
          p.subtitle Version: #[span(style="color:rgb(96, 58.4, 204) ;font-weight: lighter") {{modelValue?.proposalDetails?.version}}]
          h1.title(style="font-weight: 600 ; color:gray;margin:1px ;font-size:xxx-large") {{modelValue?.proposalDetails?.type}}
          h1.title(style="font-weight: lighter ; color:rgb(96, 58.4, 204);margin:-20px 1px 1px 1px ;font-size:xxx-large") PROPOSAL
          h1.titlePrint(style="font-weight: 600 ; color:gray;margin:1px ;font-size:xxx-large;margin:20px 1px 10px 1px ;") {{modelValue?.proposalDetails?.type}}
          h1.titlePrint(style="font-weight: lighter ; color:rgb(96, 58.4, 204);margin:20px 1px 10px 1px ;font-size:xxx-large") PROPOSAL
          p.subtitle(style="font-weight: lighter ; font-size:larger ;margin: 0px 1px") PRESENTED TO:
          img(  style="margin-top: 10px" :src="`https://staging-api.hp-tech.com/assets/${modelValue?.proposalDetails?.companyLogo}`")
          p.subtitle For: #[span(style="color: rgb(96, 58.4, 204); font-weight: lighter"  class="mt-[40px]") {{ modelValue?.proposalDetails?.proposalFor }}]      
      .proposal-content-pages-shape
        img(src="/images/pdf-shape.png")
      .proposal-content-pages-shape2
        img(src="/images/pdf-shape-2.png")
      .proposal-content-pages-shape3
         a(href="https://www.hp-tech.com" class="mt-[40px] text-primary-purple-500" ) www.hp-tech.com  
</template>

<script>
export default {
  props: {
    modelValue: Object,
  },
};
</script>

<style lang="scss" scoped>
.proposal {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  &-content {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    &-pages {
      width: 100%;
      height: 100%;
      background: #ffffff;
      box-sizing: border-box;
      position: relative;
      &-shape {
        position: absolute;
        top: 0;
        right: 0;
        width: 100%;
        max-width: 650px;
        z-index: 1;
        pointer-events: none;
        img {
          width: 100%;
          height: 60%;
          object-fit: cover;
        }
      }
      &-shape2 {
        position: absolute;
        bottom: -2px;
        left: 0;
        width: 100%;
        max-width: 320px;
        z-index: 1;
        pointer-events: none;
        img {
          width: 100%;
          height: 60%;
          object-fit: cover;
        }
      }
      &-shape1 {
        position: absolute;
        left: 20%;
        width: 100%;
        max-width: 200px;
        z-index: 1;
        pointer-events: none;
        img {
          width: 100%;
          height: auto;
          object-fit: cover;
        }
      }
       &-shape3 {
        position: absolute;
        top: 25px;
        left:25px;
        width: 100%;
        max-width: 650px;
        z-index: 1;
      }
      &-info {
        z-index: 999 !important;
        padding: 4rem 2rem;
        width: 100%;
        height: 60%;
        display: flex;
        flex-direction: column;
        justify-content: end;
        align-items: center;
        &-data {
          .subtitle {
            font-size: larger;
            font-weight: lighter;
            color: gray;
            margin: 1px;
          }
          img {
            width: 100%;
            max-height: 150px;
            object-fit: contain;
          }
        }
      }
      &.is-intro {
        display: flex;
        justify-content: start;
        align-items: center;
      }
    }
  }
}
</style>
<style>
.titlePrint {
  display: none;
}
@media print {
  .title {
    display: none;
  }
  .titlePrint {
    display: block;
  }
}
</style>
