<template lang="pug">
el-form.mt-6.mb-24(  autocomplete="off"   @submit.prevent='onSubmit'   ref="myForm" label-position="top"  :validationSchema="formSchema" )
  .card.m-auto.bg-white.p-10.rounded-3xl(class="w-[90%] ")
    InputText.mt-4(label="Material Margin" placeholder="Enter Material Margin %" name="materialMargin" :value="project?.materialMargin" @value="getMaterialMargin" )
    .bg-white.rounded-3xl.mt-3.border.mt-8
      .flex.justify-justify-between.items-center.p-10.pb-0
        .title.font-bold.text-xl.capitalize.flex-1 Material Info
        el-button(class="!rounded-2xl" type='primary' @click='addMaterial = true, material = {}, selectedAddMaterialItem = {}' :icon="Plus" size="large" :loading="loading") Add
      AppTable(v-slot="{data}" without-filters without-search without-pagination :columns="table.columns" :data="table.data" :key="table.data" class="!py-0")
        .flex.items-center.py-2(@click.stop)
          el-button(class="!rounded-2xl" type='danger' link @click="deleteMaterial(data.id)"): Icon(name="IconDelete" size="20")
          el-button(class="!rounded-2xl" type='primary' link @click="addMaterial = true, material = materials.find((material: Material) => material.id === data.id), selectedAddMaterialItem = { [data.additionalMaterialId]: addMaterialItems[data.additionalMaterialId] }"): Icon(name="IconEdit" size="20")
    .bg-white.rounded-3xl.mt-3.border.mt-8
      .p-10.pb-0.title.font-bold.text-xl.capitalize.flex-1 preview
      AppTable(without-filters without-search without-action without-pagination :columns="preview.columns" :data="preview.data" :key="preview.data" class="!py-0")
  .endBar
      .flex.justify-between.w-full
        el-button(   size='large' plain type="primary" class=" !rounded-2xl" @click="emit('cancel')") Cancel
        .flex.items-center.gap-x-2
          el-button( type="primary"  size='large' link :loading="loading"  :disabled="loading" class=" !px-5 !rounded-2xl" @click="activeStep--") Back
          el-button(   size='large' type="primary" native-type="submit" :loading="loading"  :disabled="loading" class=" !px-5 !rounded-2xl") Next
OperationsProjectsModalMaterial(v-model="addMaterial" :data="material" :allAddMaterialItems="addMaterialItems" :selectedAddMaterialItem="selectedAddMaterialItem" v-if="addMaterial"  @confirm="getMaterial")
</template>

<script lang="ts" setup>
  import { useForm } from "vee-validate";
  import * as yup from "yup";
  import { defineEmits, defineProps, defineModel, ref, computed, onMounted } from "vue";
  import { Plus } from "@element-plus/icons-vue";

  const props = defineProps({
    loading: Boolean,
    label: String,
    // data: Object as () => Record<string, unknown>,
    editMode: Boolean,
  });

  const emit = defineEmits(["submit", "cancel"]);

  const activeStep = defineModel<number>();
  const addMaterial = ref(false);
  const materials = ref<Material[]>([]);
  const material = ref<Material>();
  const selectedAddMaterialItem = ref();
  const materialMargin = ref<number>(0);
  const addMaterials = ref<Material[]>([]);
  const addMaterialItems = ref<Record<number, AdditionalMaterial[]>>({});
  const route = useRoute();
  const services = ref<Service[]>([]);

  const formSchema = yup.object({
    materialMargin: yup.string().trim().required().min(1).max(100).label("Material Margin"),
  });

  const { handleSubmit, values } = useForm({
    validationSchema: formSchema,
  });

  const table = ref({
    columns: [
      { prop: "description", label: "Description", component: "Text", type: "font-default", width: 400 },
      { prop: "quantity", label: "Quantity", component: "Text", type: "font-default", width: 150 },
      { prop: "unitPrice", label: "Unit Price", component: "Text", type: "font-default", width: 120 },
      {
        prop: "additionalMaterial",
        label: "Additional Material Category",
        component: "Text",
        type: "font-default",
        width: 250,
      },
      {
        prop: "additionalMaterialCost",
        label: "Additional Material Cost",
        component: "Text",
        type: "font-default",
        width: 200,
      },
      { prop: "marginCommission", label: "Margin Commission", component: "Text", type: "font-default", width: 180 },
      { prop: "service", label: "Service", component: "Text", type: "font-default", width: 120 },
      { prop: "servicePrice", label: "Service Price", component: "Text", type: "font-default", width: 120 },
      {
        prop: "materialCost",
        label: "Material Cost",
        component: "Text",
        type: "font-default",
        width: 200,
      },
      {
        prop: "totalMaterialCost",
        label: "Total Material Cost",
        component: "Text",
        type: "font-default",
        width: 200,
      },
    ],
    data: [] as MaterialMappedData[],
  });
  const preview = ref({
    columns: [
      {
        prop: "totalMaterialCost",
        label: "Total Material Cost",
        component: "Text",
        type: "font-default",
        width: 200,
      },
      // {
      //   prop: 'totalAdditionalMaterialCost',
      //   label: 'Total Additional Material Cost',
      //   component: 'Text',
      //   type: 'font-default',
      //   width: 300,
      // },
    ],
    data: [] as any,
  });

  const response = await useTableFilter("additional-material");
  addMaterials.value = response?.formattedData || [];

  let serviceResponse = await useTableFilter("service");
  services.value = serviceResponse?.formattedData || [];

  if (project.value?.materials?.length) {
    materials.value = project.value.materials;
  }

  materialMargin.value = project.value?.materialMargin || 0;

  if (project.value?.additionalMaterialItem?.length) {
    addMaterialItems.value = project.value.additionalMaterialItem?.reduce((acc: any, item: any) => {
      const materiaId = item.AdditionalMaterialItem.additionalMateria; // Get the value of additionalMateria
      if (!acc[materiaId]) {
        acc[materiaId] = []; // If the key doesn't exist, initialize it as an array
      }
      acc[materiaId].push({
        id: item.AdditionalMaterialItem.id,
        price: item.AdditionalMaterialItem.price,
        quantity: item.quantity,
      });

      return acc;
    }, {});
  }

  const onSubmit = handleSubmit(async (values: any) => {
    const formattedValues = {
      materialMargin: Number(values.materialMargin),
      additionalMaterialItems: Object.keys(addMaterialItems.value).length ? addMaterialItems.value : {},
      materialsIds: materials.value.map((material: Material) => material.id) as number[],
    };

    try {
      if (formattedValues?.materialsIds?.length) {
        await createtAssociatedMaterial(formattedValues);
      }
      if (typeof activeStep.value === "number") activeStep.value++;
    } catch (error) {
      console.error("Project creation failed", error);
    }
  });

  function materialMappedData() {
    if (!materials.value.length) return [];

    return materials.value.map((material: Material) => {
      const additionalMaterials = addMaterialItems.value[material.additionalMaterialId || 0] || [];

      const totalAdditionalMaterialCost = additionalMaterials.reduce((sum: number, item: any) => {
        return sum + item.quantity * Number(item.price || 0);
      }, 0);

      const totalRelatedQuantity = materials.value
        .filter((m: any) => m.additionalMaterialId === material.additionalMaterialId)
        .reduce((sum: number, item: any) => sum + item.quantity, 0);

      const additionalMaterialCost = totalRelatedQuantity > 0 ? totalAdditionalMaterialCost / totalRelatedQuantity : 0;
      const marginCommission = (material.unitPrice + additionalMaterialCost) * (materialMargin.value / 100 || 0);
      const servicePrice = material.serviceId ? services.value.find((s: any) => s.id === material.serviceId)?.price : 0;
      const materialCost = material.unitPrice + additionalMaterialCost + marginCommission + (servicePrice || 0);
      const totalMaterialCost = materialCost * material.quantity;

      return {
        projectId: project.value.id,
        materialId: material.id,
        additionalMaterialId: material.additionalMaterialId,
        additionalMaterial: material.additionalMaterialId
          ? addMaterials.value.find((item: any) => item.id === material.additionalMaterialId)?.name
          : "-",
        description: material.description,
        quantity: material.quantity,
        unitPrice: material.unitPrice,
        additionalMaterialCost: +additionalMaterialCost.toFixed(2),
        marginCommission: +marginCommission.toFixed(2),
        materialCost: +materialCost.toFixed(2),
        totalMaterialCost: +totalMaterialCost.toFixed(2),
        service: material.serviceId ? services.value.find((s: any) => s.id === material.serviceId)?.type : "-",
        servicePrice,
        id: material.id,
      };
    });
  }

  function removeDuplicatesKeepLast(arr: any) {
    // Create a map to store the last occurrence of each object based on its id
    const map = new Map();

    // Iterate through the array
    for (const item of arr) {
      // Use the id as the key in the map
      map.set(item.id, item);
    }

    // Convert the map values back to an array
    return Array.from(map.values());
  }

  function handleAdditionalMaterialItem(newItem: any) {
    // Iterate over each key in the new item
    for (let key in newItem) {
      // Check if the key already exists in the existing data
      if (addMaterialItems.value?.hasOwnProperty(key)) {
        // If the key exists, override the existing array with the new array (no addition, only replacement)
        addMaterialItems.value[key] = newItem[key];
      } else {
        // If the key does not exist, add the new key-value pair
        addMaterialItems.value[key] = newItem[key];
      }
    }
  }

  async function getMaterial(addedMaterial?: Material, finalMaterialsItems?: any) {
    const response = await useTableFilter("additional-material");
    addMaterials.value = response?.formattedData || [];
    let serviceResponse = await useTableFilter("service");
    services.value = serviceResponse?.formattedData || [];
    if (addedMaterial) {
      const index = materials.value?.findIndex((material: Material) => material.id === addedMaterial.id);
      if (index !== -1) {
        materials.value[index] = { ...addedMaterial };
      } else {
        materials.value.push(addedMaterial);
      }
    }
    if (finalMaterialsItems) handleAdditionalMaterialItem(finalMaterialsItems);
    table.value.data = materialMappedData();
    preview.value.data = [
      {
        totalMaterialCost: formatNumber(
          materialMappedData()
            ?.reduce((sum: number, item: any) => sum + item.totalMaterialCost, 0)
            ?.toFixed(2)
        ),
        totalAdditionalMaterialCost: formatNumber(
          materialMappedData()
            ?.reduce((sum: number, item: any) => sum + item.additionalMaterialCost, 0)
            .toFixed(2)
        ),
      },
    ];
  }
  function excludeNameProperty(data: any) {
    if (!data || typeof data !== "object") return {};
    return Object.entries(data).reduce((acc, [key, value]: any) => {
      acc[key] = value.map(({ name, ...rest }: any) => rest);
      return acc;
    }, {} as Record<string, any>);
  }

  function convertArrayToObject(inputArray: any) {
    if (!Array.isArray(inputArray)) return {};
    return inputArray.reduce((acc: any, current: any) => {
      Object.keys(current).forEach((key) => (acc[key] = current[key]));
      return acc;
    }, {} as Record<string, any>);
  }

  interface Material {
    id: number;
    additionalMaterialId?: number;
    unitPrice: number;
    quantity: number;
    description: string;
    serviceId?: string;
    service?: { price?: number };
  }

  interface AdditionalMaterial {
    quantity: number;
    price: number;
  }

  interface MaterialMappedData {
    description: string;
    quantity: number;
    unitPrice: number;
    projectId: number;
    materialId: number;
    additionalMaterialCost: number;
    additionalMaterial?: string;
    marginCommission: number;
    materialCost: number;
    totalMaterialCost: number;
    service?: string;
    id?: number;
  }

  interface Service {
    id: string;
    name: string;
  }

  function getMaterialMargin(val: any) {
    materialMargin.value = Number(val);
    getMaterial();
  }

  getMaterial();

  function deleteMaterial(id: number) {
    materials.value = materials.value.filter((material: Material) => material.id !== id);
    getMaterial();
  }
</script>
