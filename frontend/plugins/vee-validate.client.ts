import { defineNuxtPlugin } from '#app'
import { Form, Field, ErrorMessage, configure } from 'vee-validate'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('VForm', Form)
  nuxtApp.vueApp.component('VField', Field)
  nuxtApp.vueApp.component('VErrorMessage', ErrorMessage)
  
  configure({
    validateOnBlur: true,
    validateOnChange: true,
    validateOnInput: false,
    validateOnModelUpdate: true,
  })
})
