<template lang="pug">
.bg-white.rounded-3xl.py-6
    .flex.justify-end.mx-2
      el-button(v-if="exportButton"  @click="()=> $emit('exportClick')" size='large'   class="!bg-primary-purple-50 !text-primary-purple-500 !rounded-2xl")
       Icon(  name="IconExport" size="20")
       p.mx-1 Export
    .px-6.flex.items-center.flex-wrap.gap-2.mb-6.justify-start
        .input.table-search(class="w-[250px]" v-if="!withoutSearch")
            el-input(size="large"
                style="height:50px"
                v-model="search"
                :placeholder="`search ${searchPlaceholder}`"
                :prefix-icon="Search"
                @input="searchTimeOut"
            )
        button.rounded-btn.flex.items-center(class="!text-primary-purple-700 !border-neutral-100 !rounded-3xl font-medium !px-4 !py-2.5" v-if="!withoutFilters" @click="filterBar = true")
            Icon(  name="IconFilter" size="20")
            span.mr-2 Filters
            span.font-bold.rounded-full.w-6.h-6.bg-primary-purple-50.flex.items-center.justify-center(v-if="numberOfFilters") {{ numberOfFilters }}
    div(:class="{ 'mt-4': !withoutSearch || !withoutFilters }")
        el-table(:data='finalData || []' stripe v-loading="isLoading || loading" ref="tableRef" style='width:100%' :row-style="{cursor:'pointer'}" @current-change="(val)=> $emit('handleRowClick' , val)"   @sort-change="handleSortChange" @filter-change="handleFilterChange"  :default-sort="sort" @selection-change="handleSelectionChange")
            el-table-column(type="index", width="50" :index="calculateIndex")
            el-table-column( class-name="wrap-text" :min-width="column?.width" :show-overflow-tooltip="true"   v-for="column in columns"  :filtered-value="filters[column?.prop]"  :prop="column.prop" :label="column.label"  :column-key="column.prop" :sortable="column?.sortable ? 'custom' : undefined" )
                template(#default="scope")
                    .flex.gap-2.items-center
                        div(v-if="column?.component==='AvatarText'" )
                              TableAvatarText(:image="scope.row[column?.prop]?.image" :with-image="scope.row[column?.prop]?.withImage" :title="scope.row[column?.prop]?.title" :text="scope.row[column?.prop]?.text" :type="column?.type"  @showFile='showfile')
                        div( v-else-if="column?.component==='Text'" )
                             TableText(:value="scope.row[column?.prop]" :type="column?.type" )
                        div( v-else-if="column?.type === 'select'" @click.stop)
                             TableLabel(:valueObject = "scope.row" :value="scope.row[column?.prop]" :type="column?.type"  :filters="column?.filters" )
                        div( v-else-if="column?.component==='Label'" )
                             TableLabel(:value="scope.row[column?.prop]" :type="column?.type"  :filters="column?.filters" )

            el-table-column(label="Action" min-width="150" fixed="right" v-if="!withoutAction")
              template(#default="scope")
                  slot(:data="scope.row")
            template(#empty style="text-align: center; padding: 20px;")
              el-empty(description="No matching records found" image="/images/empty.png")
        el-dialog(v-model='fileShow'   class=" !bg-transparent  !shadow-none xl:!w-1/3 lg:!w-1/3 sm:!w-[90%] !w-full " align-center='' )
                LazyImg.m-auto(:src="srcOverlay" :key="srcOverlay" )

        .pagination.mt-5.flex.items-center.flex-wrap.gap-2.px-6(class=" sm:justify-between justify-center" v-if="!withoutPagination")

            .flex.items-center.gap-3
              span.text-sm.text-neutral-400 Show
              el-select(size="medium"  v-model="limit" :placeholder="limit"  style="width: 65px" @change="handleSizeChange")
                el-option( v-for="item in [10,25,50]" :key="item" :label="item" :value="item" )
              span.text-sm.text-neutral-400 entries
            el-pagination( background style="direction:ltr"  :pager-count="4"  :page-count="pagintaion?.totalPages" v-model:current-page='currentPage' :page-size='limit'  layout=' prev, pager, next' :total='pagintaion?.totalItems' )
    TableFilter(v-model="filterBar" v-if="!withoutFilters" :filterOptions="filterOptions" @filter="handleFilter" @reset="handleReset")
</template>

<script setup lang="ts">
  import { Calendar, Search } from "@element-plus/icons-vue";
  import { fa } from "element-plus/es/locale/index.mjs";
  const filterBar = ref(false);
  const route = useRoute();
  const router = useRouter();
  const isLoading = ref(false);

  const tableRef = ref(null);
  const props = defineProps({
    columns: {
      type: Array,
      required: true,
    },
    filterOptions: {
      type: Array,
      required: true,
    },
    withoutFilters: {
      type: Boolean,
      required: false,
      default: false,
    },
    exportButton: {
      type: Boolean,
      required: false,
      default: false,
    },
    withoutPagination: {
      type: Boolean,
      required: false,
      default: false,
    },
    withoutSearch: {
      type: Boolean,
      required: false,
      default: false,
    },
    withoutAction: {
      type: Boolean,
      required: false,
      default: false,
    },
    data: {
      type: Array,
      required: true,
    },
    searchPlaceholder: {
      type: String,
      default: "",
    },
    position: {
      type: String,
      default: "",
    },
    pageInfo: {
      type: Object,
      required: false,
      default: { totalCount: 20, totalPages: 2 },
    },
    sortOptions: {
      type: Object,
      required: false,
    },
    externalLoading: {
      type: Boolean,
      required: false,
      default: false,
    },
  });

  watch(
    () => props.externalLoading,
    () => {
      isLoading.value = props.externalLoading;
    }
  );

  const fileShow = ref(false);
  const srcOverlay = ref("");

  const limit = ref(10);
  const currentPage = ref<number>(1);
  const sort = ref<any>({});
  const filters = ref<any>({});
  const search = ref<string | any>("");
  search.value = route.query.searchKey || "";
  const pagintaion = ref<any>({});
  pagintaion.value = props.pageInfo;
  sort.value = {
    prop: route.query.sortBy || "",
    order: route.query.sort === "ASC" ? "ascending" : "descending",
  };
  function showfile(value: any) {
    fileShow.value = true;
    srcOverlay.value = value;
  }

  // sort

  function handleSortChange({ prop, order }: { prop: string; order: string }) {
    const formatProp =
      prop === "leadDetails" || prop === "dealDetails" || prop === "staffDetails"
        ? "name"
        : prop === "ClientDetails"
        ? "clientName"
        : prop;
    const formatSort = order === "ascending" ? "ASC" : "DESC";
    filters.value["sortBy"] = formatProp;
    filters.value["sort"] = formatSort;
    getData();
  }

  // search
  let timer: any;
  function searchTimeOut() {
    clearTimeout(timer);
    timer = setTimeout(async () => {
      filters.value["searchKey"] = search.value;
      await getData();
    }, 500);
  }

  const finalData = ref<any>([]);
  finalData.value = props.data || [];
  async function getData() {
    isLoading.value = true;
    const data = await useTableFilter(props.position, filters.value);
    finalData.value = data.formattedData;
    pagintaion.value = data.pagination;
    isLoading.value = false;
  }
  function handleFilterChange(value: any) {
    // filters.value = value;
  }

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

  const handleFilter = async (filteration: any) => {
    if (isObjectValid(filteration)) {
      filters.value = { ...filters.value, ...filteration };
    } else {
      filters.value = {};
      tableRef.value?.clearSort();
    }
    await getData();
    filterBar.value = false;
    numberOfFilters.value = filterLength(filteration);
  };

  const handleReset = async () => {
    filters.value = {};
    await router.push({ path: route.path, query: {} });
    await getData();
    filterBar.value = false;
    numberOfFilters.value = 0;
    tableRef.value?.clearSort();
  };

  function calculateIndex(index: number) {
    const page: number = Number(route.query.page) || 1;
    const limit: number = Number(route.query.limit) || 10;
    return (page - 1) * limit + index + 1;
  }
</script>

<style lang="scss">
  .el-table {
    .blocked-row {
      background-color: rgba(247, 96, 129, 0.154);
      opacity: 60%;
    }

    .deleted-row {
      opacity: 40%;
    }

    .el-scrollbar__wrap.el-scrollbar__wrap--hidden-default {
      scrollbar-width: thin !important;
    }
  }
</style>
