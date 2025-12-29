<template lang="pug">
section
  #allTheNav
    .nav
      Menu
  #main(
    :class="[fullNav && !mobile ? 'marginedStart' : mobile ? 'notMargined' : 'collapseMargin']"
  )
    nav.navbar.z-20(
      :class="{ marginedStart: fullNav && !mobile, collapseMargin: !mobile && !fullNav, notMargined: mobile && !fullNav, 'navbar-scroll': showNavbar }",
      class="!py-4"
    )
      .flex.items-center.justify-between(
        :class="{ '!pl-[32px] !pr-[50px] ': !mobile, '!px-[20px] ': mobile }"
      )
        .flex.items-center(class="gap-[24px]")
          button.toggle-icon(@click="openNav", :class="{ margined: !fullNav }"): Icon.is-md(
            name="ph:list-bold"
          )
          .header
            h4 Prosacco Group
            .flex.gap-1.items-center(class="text-[#918E98]")
              span updated about 1 hour ago
        .flex.gap-3.items-center
          #proposal-actions.pr-3
            .flex.items-center
              el-button.bg-gray-100(
                v-if="!route.fullPath.includes('preview')",
                size="large",
                @click="proposal?.status == 'APPROVED' ? [router.push(`/sales/proposals/editor/preview/${route.params.slug}`)]: [saveContent() , router.push(`/sales/proposals/editor/preview/${route.params.slug}`)]",
                class="!rounded-2xl"
              )
                Icon(name="IconEye", size="20")
              el-button.bg-gray-100(
                v-if="route.fullPath.includes('preview')",
                size="large",
                :disabled="proposal?.status == 'APPROVED'",
                @click="router.push(`/sales/proposals/editor/content/${route.params.slug}`)",
                class="!rounded-2xl"
              )
                Icon(name="IconEdit", size="20")
              el-button(
                v-if="!route.fullPath.includes('preview')",
                size="large",
                type="primary",
                @click="[handlePrint()]",
                class="!bg-primary-purple-50 !text-primary-purple-500 !rounded-2xl"
              )
                Icon(name="IconExport", size="20")
                p.mx-1 Export
              el-button.w-full(
                v-if="!route.fullPath.includes('preview')",
                size="large",
                type="primary",
                :icon="Plus",
                class="!my-4 !rounded-2xl",
                :disabled="proposal?.status == 'APPROVED'",
                @click="saveContent"
              ) Save

    .slot-content(:class="{ '!pr-[20px]': mobile }")
      slot
</template>
    <script setup lang="ts">
import { storeToRefs } from "pinia";
import { useMain } from "~/stores/common";
import { ElNotification } from "element-plus";
import { Plus } from "@element-plus/icons-vue";
const mainData = useMain();
const { fullNav, mobile, hideNav } = storeToRefs(mainData);
const router = useRouter();
const route = useRoute();
const showNavbar = ref(false);
const showDropdown = ref(false);

function toggleDropdown(val: boolean) {
  showDropdown.value = val;
}
onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});

const handleScroll = () => {
  showNavbar.value = window.scrollY > 10;
};

if (process.client) {
  window.addEventListener("click", () => {
    showDropdown.value = false;
  });
}

mobile.value = true;
hideNav.value = true;
fullNav.value = false;

function openNav() {
  hideNav.value = !hideNav.value;
}
async function logout() {
  const response = await useApiFetch("auth/logout", "POST");
  if (response?.message === "Logged out successfully") {
    router.push("/login");
    const accessToken = useCookie("access_token");
    accessToken.value = "";
    ElNotification({
      title: "Success",
      type: "success",
      message: response.message,
    });
  } else {
    ElNotification({
      title: "Error",
      type: "error",
      message: response.message,
    });
  }
}

const user = ref({});
const proposal = await getProposal(route.params.slug);

if (!user.value?.id) {
  const response = await useApiFetch("auth/me");
  user.value = response?.user;
}

const saveContent = async () => {
  await updateProposal({
    id: route.params.slug,
    content: window.document.getElementsByClassName("editor")[0]?.innerHTML,
  });
};

const handlePrint = async () => {
  try {
    if (proposal?.status !== "APPROVED") await saveContent();
  } finally {
    window.print();
  }
};
</script>
    
<style lang="scss" scoped>
.website-body {
  .slot-content {
    background: #f8f7fa !important;
    padding: 0 !important;
    margin-top: 4rem !important;
  }
}
#main {
  height: fit-content;
  margin-top: 80px;
  transition: all 0.2s ease-in;
}
.toggleMenu {
  position: fixed;
  z-index: 3;

  bottom: 38px;
  left: 260px;
  transition: all 0.2s ease-in;
  &.margined {
    left: 0px;
  }
}
#allTheNav {
  position: relative;
  left: 0;
  .nav {
    top: 0;
    background: #ffffff !important;
    z-index: 100;
    left: 0;
    position: fixed;
    padding-bottom: 3rem;
  }
}
.navbar {
  position: fixed;
  width: 100%;
  height: 80px;
  align-content: center;
  transition: all 0.2s ease-in;
  background: #ffffff !important;
  top: 0;
  left: 0;
  border-bottom: 1px solid #e7e6e9 !important;
}

.top {
  .logo {
    position: absolute;
    height: 70px;
    padding: 2rem;
    z-index: 1000;
    border-radius: 0px 0 50px 0px;
    left: 0;
    // width: calc(100% + 5px);
    top: 0;
    width: 100%;
  }
}
.myicon {
  color: white;
  background-color: $primary;
  padding: 0.5rem;
  border-radius: 50%;
}
.marginedStart {
  margin-left: 260px;
  width: calc(100% - 260px);
}
.collapseMargin {
  margin-left: 105px;
  width: calc(100% - 105px) !important;
}
.notMargined {
  margin-left: 0px;
  width: 100% !important;
}
// .background-overlay {
//   &::before {
//     content: '';
//     background-color: rgba(0, 0, 0, 0.411);
//     position: absolute;
//     width: 100%;
//     height: 100%;
//   }
// }
.breadcrumb {
  display: none;
  @media screen and (min-width: 991px) {
    display: block;
  }
}
</style>
    