import { Cropper } from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component("Cropper", Cropper);
});
