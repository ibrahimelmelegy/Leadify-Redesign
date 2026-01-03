<template lang="pug">
.p-4(class="w-[100vw] h-[100vh] flex xl:gap-20 gap-8 flex-col md:flex-row md:items-center justify-between")
  .form.flex-1(class="xl:ms-28 lg:p-12 p-4")
      .form-sec.text-center
        .mb-8.m-auto(class="md:mb-14")
            h1.font-medium.text-lg.text-neutral-600 Welcome back 👋
            p.mt-2.text-neutral-900.text-2xl.font-semibold(class="md:text-3xl") Login to your account
      el-form( autocomplete="off"   @submit.prevent='onSubmit' ref="myForm" label-position="top" :validationSchema="formSchema")
          InputText(placeholder="Email" label="Email" name="email" )
          InputText(placeholder="Password" label="Password" name="password" :type="'password'" )
          p.text-xs.opacity-50
          .flex.justify-between.items-center.mt-4
            el-checkbox(label="Remember me" class="!text-neutral-900 font-normal")
            nuxt-link.text-secondary-blue-500.text-sm.font-medium(to="/forget-password") Forgot password?

          el-form-item.mt-6
            el-button(   size='large' :loading="loading" native-type="submit" type="primary"  class="w-full !my-4 !rounded-xl") Login
  .bg-black.rounded-3xl.py-8(class="order-first md:order-last md:flex-1 md:h-full" )
    img.ms-auto.px-6.mb-6(src="/images/light-logo.png" alt="login")
    div(class="shape")
      svg.max-w-full(xmlns="http://www.w3.org/2000/svg", width="612", height="570", viewBox="0 0 612 570", fill="none")
        path(fill-rule="evenodd", clip-rule="evenodd", d="M2.03168 70.6018C2.03168 31.6095 33.6411 0 72.6357 0H108.293C143.322 0 171.905 27.6096 173.464 62.255H368.996C384.095 62.255 396.328 74.4906 396.328 89.5834C396.328 104.676 384.095 116.912 368.996 116.912H289.838C273.019 116.912 258.494 126.697 251.629 140.884H325.726C364.718 140.884 396.328 172.493 396.328 211.486V294.384H542.146C580.306 294.384 611.238 325.318 611.238 363.478C611.238 401.637 580.306 432.571 542.146 432.571H420.186C382.879 432.571 352.639 462.812 352.639 500.116C352.639 538.192 321.77 569.059 283.694 569.059H-91.4299C-91.8158 569.059 -92.1289 568.745 -92.1289 568.36C-92.1289 567.974 -91.8158 567.661 -91.4299 567.661H283.694C321.001 567.661 351.241 537.42 351.241 500.116C351.241 462.04 382.11 431.173 420.186 431.173H542.146C579.53 431.173 609.84 400.865 609.84 363.478C609.84 326.09 579.53 295.782 542.146 295.782H396.328V301.765C396.328 339.985 427.309 370.968 465.532 370.968H574.504C574.888 370.968 575.203 371.281 575.203 371.667C575.203 372.053 574.888 372.367 574.504 372.367H465.532C426.54 372.367 394.93 340.756 394.93 301.765V211.486C394.93 173.266 363.949 142.282 325.726 142.282H250.986C248.7 147.497 247.428 153.261 247.428 159.321V172.505C247.428 189.419 233.713 203.129 216.803 203.129C199.88 203.129 186.179 189.164 186.179 172.258C186.179 155.077 200.104 140.884 217.3 140.884H250.084C257.047 125.901 272.23 115.514 289.838 115.514H368.996C383.319 115.514 394.93 103.904 394.93 89.5834C394.93 75.2624 383.319 63.653 368.996 63.653H173.513C173.527 64.18 173.534 64.7084 173.534 65.2384V95.7516C173.534 114.938 157.666 130.477 138.498 130.477C119.666 130.477 104.085 115.213 104.085 96.3654C104.085 77.5265 119.352 62.255 138.191 62.255H172.066C170.507 28.382 142.553 1.39806 108.293 1.39806H72.6357C34.4135 1.39806 3.42975 32.3816 3.42975 70.6018V164.124C3.42975 180.784 -10.0755 194.29 -26.7354 194.29C-43.3954 194.29 -56.9013 180.784 -56.9013 164.124V135.305C-56.9013 118.291 -70.6939 104.499 -87.7083 104.499C-104.723 104.499 -118.515 118.291 -118.515 135.305V140.167C-118.515 160.638 -135.11 177.233 -155.581 177.233H-270.301C-270.687 177.233 -271 176.92 -271 176.534C-271 176.148 -270.687 175.835 -270.301 175.835H-155.581C-135.883 175.835 -119.913 159.866 -119.913 140.167V135.305C-119.913 117.519 -105.494 103.101 -87.7083 103.101C-69.9215 103.101 -55.5033 117.519 -55.5033 135.305V164.124C-55.5033 180.013 -42.6237 192.892 -26.7354 192.892C-10.8479 192.892 2.03168 180.013 2.03168 164.124V70.6018ZM172.115 63.653H138.191C120.128 63.653 105.483 78.299 105.483 96.3654C105.483 114.424 120.421 129.079 138.498 129.079C156.911 129.079 172.136 114.149 172.136 95.7516V65.2384C172.136 64.7084 172.129 64.1799 172.115 63.653ZM249.462 142.282H217.3C200.894 142.282 187.577 155.834 187.577 172.258C187.577 188.407 200.67 201.731 216.803 201.731C232.944 201.731 246.03 188.646 246.03 172.505V159.321C246.03 153.278 247.253 147.52 249.462 142.282Z", fill="url(#paint0_linear_4753_4133)")
        defs
          linearGradient#paint0_linear_4753_4133(x1="233.07", y1="-90.425", x2="130.676", y2="506.398", gradientUnits="userSpaceOnUse")
            stop(offset="0.0020097", stop-color="#0572EC")
            stop(offset="0.973958", stop-color="#F17BA5")
</template>

<script lang="ts" setup>
  import { useForm } from "vee-validate";
  import * as yup from "yup";
  import isEmailValidator from "validator/lib/isEmail";
  import { useAuthStore } from "~/stores/auth";
  const auth = useAuthStore();
  import { useMain } from "~/stores/common";
  import { ElNotification } from "element-plus";
  const mainStore = useMain();
  definePageMeta({
    title: "Admin | Login",
    layout: "empty",
  });

  const noSpecialChar = /^[a-zA-Z\u0621-\u064A\s]+$/;
  const noArabicRegx = /^[^\u0600-\u06FF]+$/;
  const formSchema = yup.object({
    email: yup
      .string()
      .email()
      .max(50)
      .required()
      .label("email"),
    // password: yup
    //   .string()
    //   .required()
    //   .label('password')
    //   .matches(/^\S*$/, 'passwordValidateSpaces')
    //   .matches(/^(?=.*[A-Za-z]).*$/, 'passwordValidateLetter')
    //   .matches(/^[~`!@#$%^&*()_+=[\]\\{}|;':",.\/<>?a-zA-Z0-9-]+$/, 'passwordValidateEnglish')
    //   .max(50)
    //   .min(12),
    password: yup.string().required().label("password").max(50),
  });

  const router = useRouter();
  const route = useRoute();
  const loading = ref(false);

  const { handleSubmit, setFieldValue } = useForm({
    validationSchema: formSchema,
  });

  const onSubmit = handleSubmit(async (values: any, actions: any) => {
    loading.value = true;
    const response = await useApiFetch("auth/login", "POST", {
      email: values.email,
      password: values.password,
    });
    if (response?.token) {
      // Store token in both cookie and localStorage for compatibility
      const accessToken = useCookie("access_token", {
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      });
      accessToken.value = response?.token;
      // Also store in localStorage as fallback for iframe environments
      if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', response.token);
      }
      ElNotification({
        title: "Success",
        type: "success",
        message: response.message,
      });
      // Wait for storage to be set then reload
      setTimeout(() => {
        window.location.href = "/";
      }, 300);
    } else {
      ElNotification({
        title: "Error",
        type: "error",
        message: response.message,
      });
    }
    loading.value = false;
  });
</script>

<style lang="scss">
  .shape {
    display: block;
    @media screen and (max-width: 768px) {
      display: none;
    }
  }
</style>
