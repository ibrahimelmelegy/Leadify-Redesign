import { QuillEditor } from '@vueup/vue-quill';

import '@vueup/vue-quill/dist/vue-quill.snow.css';



export default defineNuxtPlugin((nuxtApp) => {

    nuxtApp.vueApp.use(QuillEditor, { ripple: true });
    // nuxtApp.vueApp.use(ImageUploader, { ripple: true });
    nuxtApp.vueApp.component("QuillEditor", QuillEditor);
  



    //other components that you need
});