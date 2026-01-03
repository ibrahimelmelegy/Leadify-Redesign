<template lang="pug">
    div
     .flex.items-center.justify-center(style="flex-direction: column; ")
      .flex.items-center.justify-between.mb-8.gap-2(class="w-[75%]")
        .title.font-bold.text-2xl.capitalize Notifications
        .title.font-medium.text-lg.capitalize(v-if="unreadNotificationsCount == 0" style ="color : #6D42E8;cursor: pointer" ) Mark all as read
        .title.font-medium.text-lg.capitalize( v-if = "unreadNotificationsCount > 0" style ="color : #ff0000;cursor: pointer" @click = "readNotifications") marking notification as unread {{unreadNotificationsCount}}
      .notify.bg-white(class="h-[75vh] mb-2 p-[16px]")
       el-spinner(size="large" v-if="isLoading" class="nuxt-loading-indicator")
       el-empty(v-if="finalData?.length ==  0 || !finalData " description="No notifications yet." image="/images/emptyNotify.png")
       .item.flex.flex-wrap.gap-2.items-center.justify-center(v-else-if="finalData && finalData?.length > 0")
         .w-full.my-2.p-2(v-for="notify in finalData" :key="notify?.id" :class="`item-data_${notify?.read}`" @click="() => readNotification(notify)")
            .flex.justify-between.items-center
             div.flex.gap-2
                Icon.p-2(name="IconRestore" class="text-[35px]" :class="`icon_${notify?.read}`"  )
                div
                 span {{notify?.body_ar}}
                 p.text-neutral-500.text-xs.mb-4.font-medium {{ notify?.createdAt }}
             div.rounded-full.bg-red-500.w-2.h-2(v-if="notify?.read == 'UN_READ'")
       .pagination.mt-5.flex.items-center.flex-wrap.gap-2.px-6(class="sm:justify-between justify-center" v-if="!withoutPagination ")
         .flex.items-center.gap-3
           span.text-sm.text-neutral-400 Show
             el-select(size="medium"  v-model="limit" :placeholder="limit"  style="width: 65px" @change="handleSizeChange")
               el-option( v-for="item in [10,25,50]" :key="item" :label="item" :value="item" )
               span.text-sm.text-neutral-400 entries
           el-pagination( background style="direction:ltr"  :pager-count="4"  :page-count="pagintaion?.totalPages" v-model:current-page='currentPage' :page-size='limit'  layout=' prev, pager, next' :total='pagintaion?.totalItems' )
</template>
<script setup lang="ts">
const limit = ref(10);
const isLoading = ref(false);
const currentPage = ref<number>(1);
const pagintaion = ref<any>({});
const filters = ref<any>({});
const finalData = ref<any>([]);
const unreadNotificationsCount = ref(0)

const response = await useTableFilter("notification");

pagintaion.value = response?.pagination;
finalData.value = response?.formattedData || [];
unreadNotificationsCount.value = response?.unreadNotificationsCount

async function getData() {
    isLoading.value = true;
    const data = await useTableFilter("notification", filters.value);
    finalData.value = data.formattedData;
    pagintaion.value = data.pagination;
    isLoading.value = false;
    unreadNotificationsCount.value = data?.unreadNotificationsCount

}


let intervalId: any;

onMounted(() => {
    // Start the interval when the component is mounted
    intervalId = setInterval(() => {
        getData(); // Your function to fetch notifications
    }, 15000); // 15 seconds in milliseconds
});

onBeforeUnmount(() => {
    // Clear the interval when the component is unmounted to prevent memory leaks
    if (intervalId) {
        clearInterval(intervalId);
    }
});

const readNotifications = async () => {
    try {
        await readAll();
    } finally {
        getData();
    }
};

const readNotification = async (data: any) => {
   try {
    let typeAssign = data.type.split("_")[0]?.split(" ")?.[0].toLowerCase();
    typeAssign !== "opportunity" ? (typeAssign = `${typeAssign}s`) : typeAssign;
    const path = `${
      typeAssign !== "projects" ? "sales" : "operations"
    }/${typeAssign}/${data.target}`;

    await read(data.id, path);
  } finally {
  }
};

const handleSizeChange = (val: any) => {
    filters.value["limit"] = val;
    getData();
};

watch(
    () => currentPage.value,
    () => {
        filters.value["page"] = currentPage.value;
        getData();
    }
);
</script>

<style lang="scss" scoped>
.notify {
    border-bottom: 1px solid white;
    border-radius: 24px;
    width: 70%;
    display: flex;
    flex-direction: column;
    padding: 10px;
}

.item {
    flex-direction: row;
    height: 60vh;
    width: 100%;
    overflow-y: auto;
    overflow-x: hidden;
}

.item:hover {
    cursor: pointer;
}

.item-data_UN_READ {
    background-color: #f8f7fa;
    border-radius: 20px;
}

.item-data_READ {
    background-color: #ffffff;
    border-radius: 20px;
}

.icon_READ {
    background-color: #f2edff;
    border-radius: 50%;
    color: #6d42e8;
}

.icon_UN_READ {
    background-color: #fff8e7;
    border-radius: 50%;
    color: #ffb72d;
}
</style>
