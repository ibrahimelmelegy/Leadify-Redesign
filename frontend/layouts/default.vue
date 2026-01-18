<template lang="pug">
  section
      #allTheNav
        .nav
          Menu
      #main(:class="[fullNav && !mobile  ? 'marginedStart' : (mobile ? 'notMargined' :'collapseMargin' )] ")
        nav.navbar(  :class="{'marginedStart': fullNav && !mobile,'collapseMargin': !mobile && !fullNav,'notMargined': mobile && !fullNav,'navbar-scroll': showNavbar}" class="!pt-4 z-20 ")
          .flex.items-center.justify-between(:class="{'!pl-[32px] !pr-[50px] ' : !mobile , '!px-[20px] '  : mobile}")
            .flex.items-center.gap-2
              .headings(class="block lg:hidden" )
                button.toggle-icon(@click="openNav" :class="{'margined' : !fullNav}"): Icon.text-sm(name="ph:list-bold")
              div(class="breadcrumb")
                el-breadcrumb(:separator-icon="ArrowRight")      
                  el-breadcrumb-item(to="/") Dashboard
                  el-breadcrumb-item(v-for="(route, index) in breadcrumbRoutes",  :key="index", @click="getPath(route)" , class="cursor-pointer",  :class="{ 'last': index === breadcrumbRoutes.length - 1 }"  ) {{ route }}
            .flex.gap-3.items-center
              //- el-input.search-input(v-model="searchInput", placeholder="Search", :prefix-icon="Search" class="!w-[200] !md:w-[300px]")
              //- .flex.justify-center.items-center.bg-white.rounded-full.cursor-pointer.relative(class="!min-w-[48px] !min-h-[48px]")
              //-   Icon.text-neutral-800(name="IconNotifications"  size="20")
              //-   span.absolute.rounded-full.w-2.h-2.bg-red-500(class="top-[10px] right-[15px] ")
              .tools.flex.items-center(class="p-2 bg-white rounded-full gap-2.5" )
                DarkModeToggle
                el-dropdown(class="outline-0")
                      div.flex.gap-3.items-center.outline-0.border-0
                            Avatar(:src="user?.profilePicture", small)
                            p.mb-0.text-base.font-medium.text-neutral-800 {{user?.name}}
                                //- p.text-xs.font-medium.opacity-50 {{ user?.email }}
                            Icon.text-xl(name="iconamoon:arrow-down-2")
                      template(#dropdown='')
                        el-dropdown-menu
                            //- NuxtLink(:to="'/profile'"): el-dropdown-item
                            //-     p.text-xs profile
                            el-dropdown-item(@click="logout")
                                p.text-xs logout
              .notification(class="p-2 bg-white rounded-full")
               NuxtLink.flex.items-center(:to="`/notification`" )
                Icon.text-md(name="IconNotifications" )
                div.border.rounded-xl(v-if="response?.value?.unreadNotificationsCount > 0" class="h-[10px] w-[10px] bg-[red]" style="margin-left:-5px ; margin-top:-30px")
          .mt-4
        .slot-content(class="!mt-24" :class="{'!pl-[32px] !pr-[50px]' : !mobile, '!px-[20px] '  : mobile}")

            SpotlightSearch
            slot
  </template>
<script setup lang="ts">

import SpotlightSearch from '~/components/global/SpotlightSearch.vue';
import { useWindowSize } from "@vueuse/core";
import { storeToRefs } from "pinia";
import { useMain } from "~/stores/common";
import { ArrowRight, Search, Plus } from "@element-plus/icons-vue";
import { ElNotification } from "element-plus";
import { clearUser } from "~/composables/useUser";
const mainData = useMain();
const { fullNav, mobile, hideNav } = storeToRefs(mainData);
const { width, height } = useWindowSize();
const router = useRouter();
const route = useRoute();
const showNavbar = ref(false);
const showDropdown = ref(false);
const searchInput = ref("");

const response = ref<any>({});

onMounted(async () => {
  try {
    response.value = await useTableFilter("notification");
  } catch (e) {
    console.error('Failed to load notifications:', e);
  }
});

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

const mykey = ref("1");

function checkwidth() {
  if (width.value < 990) {
    mobile.value = true;
  } else {
    mobile.value = false;
  }
}
function openNav() {
  fullNav.value = !fullNav.value;
  if (mobile.value) {
    hideNav.value = !hideNav.value;
  }
}
async function logout() {
  const response = await useApiFetch("auth/logout", "POST");
  if (response?.message === "Logged out successfully") {
    const { clearPermissions } = await usePermissions();
    clearPermissions();
    clearUser();
    const accessToken = useCookie("access_token");
    accessToken.value = "";
    localStorage.removeItem("access_token");
    router.push("/login");
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

checkwidth();

watch(width, () => {
  checkwidth();
});

const user = ref<any>({});

onMounted(async () => {
    if (!user.value?.id) {
        try {
            const response = await useApiFetch("auth/me");
            user.value = response?.user;
        } catch (e) {
            console.error(e);
        }
    }
});

const breadcrumbRoutes = computed(() => {
  const pathSegments = route.path.split("/").filter(Boolean);

  // Regular expression for a UUID-like ID format
  const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

  // Check if the last item is a valid ID (UUID or numeric)
  if (pathSegments.length > 0) {
    const lastSegment = pathSegments[pathSegments.length - 1];

    // Check for UUID or numeric formats
    if (uuidRegex.test(lastSegment) || !isNaN(Number(lastSegment))) {
      pathSegments.pop(); // Remove the last item
    }
  }

  // Replace hyphens and underscores with spaces in each path segment
  const formattedSegments = pathSegments.map((segment: any) =>
    segment.replace(/[-_]/g, " ")
  );
  return formattedSegments;
});

const getPath = (routeName: string) => {
  const pathSegments = route.path.split("/").filter(Boolean);
  let pathGo = "";
  const indexStop = pathSegments.findIndex((route) => route ==routeName )
  pathSegments.forEach((el , indes) => {
    if (indes <= indexStop  ) pathGo = pathGo + "/" + el;
  });
 if(pathGo !== "/sales" && pathGo !== "/operations") router.push(pathGo);
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
  margin-top: 50px;
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
    background: #f8f7fa !important;
    z-index: 100;
    left: 0;
    position: fixed;
    padding-bottom: 3rem;
  }
}
.navbar {
  position: fixed;
  width: 100%;
  transition: all 0.2s ease-in;
  background: #f8f7fa !important;
  top: 0;
  left: 0;
  border-bottom: 1px solid $border;
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
.background-overlay {
  &::before {
    content: "";
    background-color: rgba(0, 0, 0, 0.411);
    position: absolute;
    width: 100%;
    height: 100%;
  }
}
.breadcrumb {
  display: none;
  @media screen and (min-width: 991px) {
    display: block;
  }
}
</style>
