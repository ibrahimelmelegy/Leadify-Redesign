<template lang="pug">
.relative
  .toggle-indicator.cursor-pointer.flex.items-center.justify-center.absolute.rounded-full.w-10.h-10.bg-white.z-100.shadow.border(v-if="!mobile" @click="openNav" :class="{ 'right-[-7%]' : fullNav, 'right-[-22%]' : !fullNav }" class="top-[2%] z-10")
    Icon.text-neutral-800(:name="fullNav ? 'material-symbols:arrow-left-alt-rounded' : 'material-symbols:arrow-right-alt-rounded'" size="20")

  div.background-overlay.fixed.top-0.left-0.w-screen.h-full(class='z-[-1]' v-if="mobile && !hideNav" @click="hideNav = true")
  transition(:name='mobile ? "side" : "none"')
    el-menu.el-menu-vertical-demo.relative(class='!pl-[5px] h-[100vh] card-auto ' :class="{'overflow-x-hidden' : !fullNav }" v-if="mobile ? !hideNav : true" :collapse='mobile ? false : !fullNav' :default-openeds="defaultOpenMenus")
      .py-5.px-12.flex.items-center.gap-3(v-if="fullNav")
        img(class="cursor-pointer" src="/images/Logo.png" @click="router.push('/')")
      .py-5.px-5.flex.items-center.gap-3.relative.z-10(v-if="!fullNav")
        img(class="cursor-pointer !h-[40px] !max-h-[40px]" src="/images/logo-shape.png" @click="router.push('/')")
      template(v-for="(navLink, index) in menu")
        el-sub-menu(:index='`${index+1}`' v-if="navLink.submenu")
          template(#title)
            div
              Icon.myicon(size="20" :name="navLink.icon")
            .mr-2
            span {{navLink.name}}
          el-menu-item-group(v-for="(subLink, subIndex) in navLink.submenu")
            NuxtLink(:to="subLink.link" v-if="subLink.link == '/operations/daily-task' && user.id == 1")
              el-menu-item(:index="subLink.link" @click="mobileNavigate(subLink.link)" :class="{'is-active': route.fullPath.includes(subLink.link) && subLink.link == '/'}") {{subLink.name}}
            el-menu-item(:index="`${index+1}-${subIndex+1}`" :class="{'disabled-link' : getDisabled(subLink.role)}" v-else-if="getDisabled(subLink.role) && subLink.link !== '/operations/daily-task'") {{subLink.name}}
            NuxtLink(:to="subLink.link" v-else-if="subLink.link !== '/operations/daily-task'")
              el-menu-item(:index="subLink.link" @click="mobileNavigate(subLink.link)" :class="{'is-active': route.fullPath.includes(subLink.link) && subLink.link !== '/'}") {{subLink.name}}
        template(v-else)
          el-menu-item(:index='`${index+1}`' :class="{'disabled-link': getDisabled(navLink.role)}" v-if="navLink.link !== '/' && getDisabled(navLink.role)")
            el-icon
              Setting
            template(#title) {{navLink.name}}
          NuxtLink(:to="navLink.link" v-else)
            el-menu-item(:index="navLink.link" @click="mobileNavigate(navLink.link)" :class="{'is-active': route.fullPath.includes(navLink.link) && navLink.link !== '/'}")
              Icon.myicon.mr-2(size="20" :name="navLink.icon")
              template(#title) {{navLink.name}}


</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useMain } from "~/stores/common";

import { Document, Menu as IconMenu, Location, Setting } from "@element-plus/icons-vue";
const mainStore = useMain();
const { fullNav, mobile, hideNav } = storeToRefs(mainStore);
const { permissions } = storeToRefs(mainStore);
const route = useRoute();
const router = useRouter();
const user = ref<any>({});

onMounted(async () => {
  try {
    const response = await useApiFetch("auth/me");
    user.value = response?.user || {};
  } catch (e) {
    console.error('Failed to load user:', e);
  }
});

function mobileNavigate(link: string) {
  if (mobile.value) {
    hideNav.value = true;
  }
}

function getDisabled(role) {
  if (permissions.value.length) {
    return !permissions.value?.includes(role);
  } else {
    return false;
  }
}

const menu = [
  {
    link: "/",
    name: "Board",
    icon: "IconHome",
    submenu: false,
    isOpen: false, // New property
  },
  {
    submenu: [
      {
        link: "/sales/leads",
        name: "Leads",
      },
      {
        link: "/sales/clients",
        name: "Clients",
      },
      {
        link: "/sales/opportunity",
        name: "Opportunity",
      },
      {
        link: "/sales/deals",
        name: "Deals",
      },
      {
        link: "/sales/proposals",
        name: "Proposals",
      },
    ],
    name: "Sales",
    icon: "IconSales",
    isOpen: true, // Open this submenu
  },
  {
    submenu: [
      {
        link: "/operations/projects",
        name: "Projects",
      },
      {
        link: "/operations/daily-task",
        name: "Daily Tasks",
      },
      {
        link: "/operations/vehicle",
        name: "Vehicle",
      },
      {
        link: "/operations/manpower",
        name: "Manpower",
      },
      {
        link: "/operations/additional-material",
        name: "Additional Materials",
      },
      {
        link: "/operations/services",
        name: "Services",
      },
      {
        link: "/operations/assets",
        name: "Assets",
      },
    ],
    name: "Operations",
    icon: "IconOperations",
    isOpen: false, // Open this submenu
  },
  {
    link: "/roles",
    name: "Roles",
    icon: "IconRole",
    submenu: false,
    isOpen: false, // New property
  },
  {
    name: "Staff",
    icon: "IconStaff",
    link: "/staff",
    isOpen: false, // Open this submenu
  },
  {
    link: "/reports",
    name: "Report",
    icon: "IconReport",
    submenu: false,
    isOpen: false, // New property
  },
];

const defaultOpenMenus = menu
  .map((item, index) => (item.isOpen ? `${index + 1}` : null))
  .filter(Boolean);

function openNav() {
  fullNav.value = !fullNav.value;
  if (mobile.value) {
    hideNav.value = !hideNav.value;
  }
}
</script>

<style lang="scss">
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 260px;
}
.toggle-indicator {
  display: none;
  @media screen and (min-width: 991px) {
    display: flex;
  }
}
</style>
