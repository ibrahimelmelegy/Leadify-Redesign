import { defineStore, skipHydrate } from "pinia";
import { useLocalStorage } from "@vueuse/core";
import { ElNotification } from "element-plus";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: useLocalStorage("access_token", ""),
    loadingeChangePassword: false,
    permissions: [],
    lang : "en"
  }),

  hydrate(state, initialState) {
    state.token = useLocalStorage("access_token", "");
  },

  actions: {
    setLocale(lang : string) {
      this.lang = lang
      useGqlHeaders({ lang: `eg-${this.lang}` });
    },
    setData(token: "") {
      useLocalStorage("access_token", token);
      this.token = token;
    },
    async changePassword(input: any) {
      const authStore = useAuthStore();

      this.loadingeChangePassword = true;

      const { data } = await useAsyncGql("changeAdminPassword", {
        input: {
          oldPassword: input.oldPassword,
          newPassword: input.password,
          confirmPassword: input.confirmPassword,
        },
      });

      this.loadingeChangePassword = false;
      authStore.setData(data.value.changeAdminPassword.data?.token);
      useGqlToken(authStore.token);
      if (data.value.changeAdminPassword.success) {
        ElNotification({
          type: "success",
          title: "Success",
          message: "Password has been changed successfully",
        });
      } else {
        ElNotification({
          title: "Error",
          type: "error",
          message: formatTextWithUnderscore(
            data.value.changeAdminPassword.message
          ),
        });
      }
      return {
        success: data.value.changeAdminPassword.success,
        message: data.value.changeAdminPassword.message,
      };
    },
    async loginBoard(values: any , successMessage : string) {

      // const { data } = await useAsyncGql("loginBoard", {
      //   input: {
      //     email: values.email,
      //     password: values.password,
      //     device: "DESKTOP",
      //   },
      // });

      // useGqlToken(this.token);
      ElMessage.success(useNuxtApp().$i18n.t("loggedInSuccessfully"));

      // if (data.value.emailAndPasswordLoginBoard.success) {
      //   this.setData(data.value.emailAndPasswordLoginBoard.data?.token);
      //   this.permissions =  data.value.emailAndPasswordLoginBoard.data.securityGroup.permissions,



      // } else {
      //   ElNotification({
      //     title: "Error",
      //     type: "error",
      //     message: formatTextWithUnderscore(
      //       data.value.emailAndPasswordLoginBoard.message
      //     ),
      //   });
      // }
      // return {
      //   success: data.value.emailAndPasswordLoginBoard.success,
      //   message: data.value.emailAndPasswordLoginBoard.message,
      // };
    },
  },
});
