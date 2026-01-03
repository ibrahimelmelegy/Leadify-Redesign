<template>
  <div class="flex items-center justify-between mb-8">
    <!-- Title -->
    <div class="title font-bold text-2xl mb-1 capitalize">Additional Material</div>

    <!-- Action Buttons -->
    <div class="flex items-center gap-x-3">
      <!-- New Material Button -->
      <nuxt-link v-if="hasPermission('CREATE_ADDITIONAL_MATERIAL')" to="/operations/additional-material/add-material">
        <el-button size="large" native-type="submit" type="primary" :icon="Plus" class="w-full !my-4 !rounded-2xl">
          New Additional Material
        </el-button>
      </nuxt-link>

      <!-- Dropdown (Commented Out Section) -->
      <!--
    <el-dropdown trigger="click">
      <span class="el-dropdown-link">
        <button class="rounded-btn !px-4">
          <icon name="IconToggle" size="24"></icon>
        </button>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item>
            <nuxt-link class="flex items-center" :to="`/leads/1`">
              <icon class="text-md mr-2" size="20" name="IconImport"></icon>
              <p class="text-sm">Import</p>
            </nuxt-link>
          </el-dropdown-item>
          <el-dropdown-item>
            <nuxt-link class="flex items-center" :to="`/leads/1`">
              <icon class="text-md mr-2" size="20" name="IconExport"></icon>
              <p class="text-sm">Export</p>
            </nuxt-link>
          </el-dropdown-item>
          <el-dropdown-item>
            <nuxt-link class="flex items-center" :to="`/leads/1`">
              <icon class="text-md mr-2" size="20" name="IconArchived"></icon>
              <p class="text-sm">Archived</p>
            </nuxt-link>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    --></div>
  </div>
  <div class="bg-white rounded-3xl py-6">
    <el-table
      :data="finalData || []"
      style="width: 100%"
      :row-style="{ cursor: 'pointer' }"
      @current-change="handleRowClick"
    >
      <!-- Expand Column -->
      <el-table-column type="expand">
        <template #default="props">
          <div m="4">
            <el-table class="px-6" :data="props.row.materialItem">
              <el-table-column label="Item" prop="name" />
              <el-table-column label="Price" prop="price" />
            </el-table>
          </div>
        </template>
      </el-table-column>

      <!-- Category Column -->
      <el-table-column label="Category" :min-width="600">
        <template #default="scope">
          <p class="mb-2 text-base font-semibold">{{ scope.row?.name }}</p>
        </template>
      </el-table-column>

      <!-- Action Column -->
      <el-table-column label="Action" prop="action">
        <template #default="scope">
          <div @click.stop>
            <el-dropdown class="outline-0" trigger="click">
              <span class="el-dropdown-link">
                <div class="toggle-icon text-md">
                  <icon name="IconToggle" size="22"></icon>
                </div>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>
                    <nuxt-link class="flex items-center" :to="`/operations/additional-material/${scope.row?.id}`">
                      <icon class="text-md mr-2" name="IconEye"></icon>
                      <p class="text-sm">View</p>
                    </nuxt-link>
                  </el-dropdown-item>
                  <el-dropdown-item v-if="hasPermission('EDIT_ADDITIONAL_MATERIAL')">
                    <nuxt-link class="flex items-center" :to="`/operations/additional-material/edit/${scope.row?.id}`">
                      <icon class="text-md mr-2" name="IconEdit"></icon>
                      <p class="text-sm">Edit</p>
                    </nuxt-link>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- Pagination -->
    <div class="pagination mt-5 flex items-center flex-wrap gap-2 px-6 sm:justify-between justify-center">
      <div class="flex items-center gap-3">
        <span class="text-sm text-neutral-400">Show</span>
        <el-select v-model="limit" :placeholder="`${limit}`" style="width: 65px" @change="handleSizeChange">
          <el-option v-for="item in [10, 25, 50]" :key="item" :label="item" :value="item"></el-option>
        </el-select>
        <span class="text-sm text-neutral-400">entries</span>
      </div>
      <el-pagination
        background
        style="direction: ltr"
        :pager-count="4"
        :page-count="pagintaion?.totalPages"
        v-model:current-page="currentPage"
        :page-size="limit"
        layout="prev, pager, next"
        :total="pagintaion?.totalItems"
      ></el-pagination>
    </div>
  </div>
</template>

<script setup lang="ts">
  const { hasPermission } = await usePermissions();
  const limit = ref(10);
  const isLoading = ref(false);
  const currentPage = ref<number>(1);
  const sort = ref<any>({});
  const pagintaion = ref<any>({});
  const finalData = ref<any>([]);
  const router = useRouter();
  import { Plus } from "@element-plus/icons-vue";
  const handleSizeChange = (val: any) => {
    getData();
  };

  function handleRowClick(val: any) {
    router.push(`/operations/additional-material/${val.id}`);
  }

  watch(
    () => currentPage.value,
    () => {
      getData();
    }
  );

  async function getData() {
    isLoading.value = true;
    const data = await useTableFilter("additional-material", { limit: [limit.value], page: [currentPage.value] });
    finalData.value = data.formattedData;
    pagintaion.value = data.pagination;
    isLoading.value = false;
  }

  const response = await useTableFilter("additional-material");
  finalData.value = response.formattedData;
  pagintaion.value = response.pagination;
</script>
