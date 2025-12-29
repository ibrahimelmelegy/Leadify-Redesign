<template lang="pug">
el-form.mt-6.mb-24(  autocomplete="off"   @submit.prevent='onSubmit'   ref="myForm" label-position="top"  :validationSchema="formSchema" )
  .card.m-auto.bg-white.p-10.rounded-3xl(class="w-[90%] ")
    .title.font-bold.text-xl.capitalize.mb-8 Assets Info
    .flex.align-center.gap-1
      InputSelect.flex-1(label=" Assets" isMultiple name="assetIds" :options="assetsOptions"  :value="filteredAssets.map((asset: any) => asset.value)" :key="filteredAssets  || assetsOptions" @change="toggleAssetSelection")
      el-button.mt-7(size='medium' :icon="Plus" native-type="button" @click="addAsset = true" class="!rounded-2xl !border-[#e9e8eb] !color-[#e9e8eb] !py-7 !px-4")
    .bg-white.rounded-3xl.mt-3.border
      .title.font-bold.text-xl.capitalize.flex-1.p-10.pb-0 Perview
      AppTable(v-slot="{data}" without-filters without-search without-pagination :columns="table.columns" :key="table.data" :data="table.data" class="!py-0")
        .flex.items-center.py-2(@click.stop)
          el-button(class="!rounded-2xl" type='danger' link @click="toggleAssetSelection(data.id)"): Icon(name="IconDelete" size="20")
          el-button(class="!rounded-2xl" type='primary' link @click="selectAssetForEdit(data.id)"): Icon(name="IconEdit" size="20")
    .bg-white.rounded-3xl.mt-3.border
      AppTable(without-filters without-search without-action without-pagination :columns="assetsTotal.columns" :data="assetsTotal.data" :key="assetsTotal.data" class="!py-0")
  .endBar
      .flex.justify-between.w-full
        el-button(   size='large' plain type="primary" class=" !rounded-2xl" @click="emit('cancel')") Cancel
        .flex.items-center.gap-x-2
          el-button(type="primary"  size='large' link :loading="loading"  :disabled="loading" class=" !px-5 !rounded-2xl" @click="activeStep--") Back
          el-button(size='large' type="primary" native-type="submit" :loading="loading"  :disabled="loading" class=" !px-5 !rounded-2xl") {{ route.params.slug ? 'Update' : 'Next' }}
OperationsProjectsModalAsset(v-model="addAsset"  @confirm="fetchAssets" :asset="asset")
</template>

<script lang="ts" setup>
  import { useForm } from "vee-validate";
  import * as yup from "yup";
  import { defineEmits, defineProps, defineModel } from "vue";
  import { Plus } from "@element-plus/icons-vue";
  import { ElNotification } from "element-plus";

  const route = useRoute();
  const props = defineProps({
    loading: Boolean,
    label: String,
    data: {
      type: Object,
      required: false,
    },
    editMode: {
      type: Boolean,
      required: false,
    },
  });
  const activeStep = defineModel();
  const addAsset = ref(false);
  const assetsOptions = ref<{ label: string; value: string }[]>([]);
  const filteredAssets = ref<{ label: string; value: string }[]>([]);
  const assets = ref<Asset[]>([]);
  const asset = ref<Asset>();
  const assetsId = ref<string[]>([]);
  const emit = defineEmits(["submit", "cancel"]);

  const formSchema = yup.object({
    assetIds: yup.array().of(yup.string()).nullable().label("Assets"),
  });

  const { handleSubmit } = useForm({
    validationSchema: formSchema,
  });

  const onSubmit = handleSubmit(async (values: any, actions: any) => {
    try {
      // Attempt to create the project
      if (values.assetIds.length) {
        await createtAssociatedAssets({
          assetIds: values.assetIds,
        });
      }
      if (route.params.slug) {
        navigateTo("/operations/projects");
        ElNotification({
          type: "success",
          title: "Success",
          message: "Project updated successfully",
        });
      } else {
        activeStep.value++;
      }
    } catch (error) {
      // Handle the error and prevent the step from being incremented
      console.error("Project creation failed", error);
    }
    // emit('submit')
  });

  const table = reactive({
    columns: [
      {
        prop: "name",
        label: "Assets Name",
        component: "Text",
        // sortable: true,
        type: "font-bold",
        width: 150,
      },
      {
        prop: "rentPrice",
        label: "Rent Price",
        component: "Text",
        // sortable: true,
        type: "font-bold",
        width: 150,
      },
      {
        prop: "buyPrice",
        label: "Buy Price",
        component: "Text",
        // sortable: true,
        type: "font-bold",
        width: 150,
      },
    ],
    data: [] as Asset[],
  });
  const assetsTotal = reactive({
    columns: [
      {
        prop: "totalRentPrice",
        label: "Total Rent Price",
        component: "Text",
        // sortable: true,
        type: "font-default",
        width: 150,
      },
      {
        prop: "totalBuyPrice",
        label: "Total Buy Price",
        component: "Text",
        // sortable: true,
        type: "font-default",
        width: 150,
      },
      {
        prop: "totalAssetsCost",
        label: "Total Assets Cost",
        component: "Text",
        // sortable: true,
        type: "font-default",
        width: 150,
      },
    ],
    data: [] as any,
  });
  if (project.value?.projectAssets?.length) {
    assetsId.value = project.value?.projectAssets?.map((projectAsset: any) => projectAsset.assetId);
    updateTableData();
  }

  /**
   * Maps an array of assets into a format suitable for a select input.
   */
  function mapAssets(data: Asset[] = []): { label: string; value: string }[] {
    return data.map(({ name, id }) => ({ label: name, value: id }));
  }

  /**
   * Fetches the list of assets from the API and updates the select input with the results.
   */
  async function fetchAssets(id: string = "", isUpdate?: boolean) {
    const response = await useTableFilter("asset");
    assets.value = response?.formattedData || [];
    assetsTotal.data = [
      {
        totalRentPrice: project.value?.totalAssetRentPrice,
        totalBuyPrice: project.value?.totalAssetBuyPrice,
        totalAssetsCost: project.value?.totalAssetsCost,
      },
    ];
    assetsOptions.value = mapAssets(assets.value);
    if (isUpdate) {
      updateTableData();
      return;
    }
    toggleAssetSelection(id);
  }

  /**
   * Updates the table data and filtered assets list based on the selected asset IDs.
   */
  function updateTableData() {
    // Filter the assets based on the selected asset IDs
    table.data = assets.value?.filter(({ id }: Asset) => assetsId.value?.includes(id)) || [];

    // Calculate the total rent price by summing the rentPrice of each asset, ensuring the value is a number
    const totalRentPrice = table.data?.reduce((acc: number, { rentPrice }: Asset) => acc + (Number(rentPrice) || 0), 0);

    // Calculate the total buy price by summing the buyPrice of each asset, ensuring the value is a number
    const totalBuyPrice = table.data?.reduce((acc: number, { buyPrice }: Asset) => acc + (Number(buyPrice) || 0), 0);

    // Calculate the total assets cost by adding total rent price and buy price, ensuring the values are numbers
    const totalAssetsCost = (totalRentPrice || 0) + (totalBuyPrice || 0);

    // Update the assets total data
    assetsTotal.data = [
      {
        totalRentPrice,
        totalBuyPrice,
        totalAssetsCost,
      },
    ];

    // Map through the filtered assets (if necessary)
    filteredAssets.value = mapAssets([...table.data]);
  }

  /**
   * Toggles the selection of a asset by its ID.
   */
  function toggleAssetSelection(val: any) {
    const assetId = val.value || val;
    const index = assetsId.value?.indexOf(assetId);

    if (index !== -1) {
      assetsId.value.splice(index, 1);
    } else {
      assetsId.value.push(assetId);
    }
    updateTableData();
  }

  /**
   * Selects a asset for editing based on its ID and opens the asset form.
   */
  function selectAssetForEdit(id: string) {
    asset.value = assets.value?.find(({ id: assetId }: Asset) => assetId === id);
    addAsset.value = !!asset.value?.id;
  }

  await fetchAssets();
</script>
