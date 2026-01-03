<template lang="pug">
el-form.mt-6.mb-24(  autocomplete="off"   @submit.prevent='onSubmit'   ref="myForm" label-position="top"  :validationSchema="formSchema" )
  .card.m-auto.bg-white.p-10.rounded-3xl(class="w-[90%] ")
    .title.font-bold.text-xl.capitalize.mb-8 Vehicles Info
    .flex.align-center.gap-1
      InputSelect.flex-1(label=" Vehicles" isMultiple name="vehicles" :options="vehiclesOptions"  :value="filteredVehicles.map((vehicle: any) => vehicle.value)" :key="filteredVehicles.length  || vehiclesOptions.length" @change="toggleVehicleSelection")
      el-button.mt-7(size='medium' :icon="Plus" native-type="button" @click="vehicle = {}, addVehicle = true" class="!rounded-2xl !border-[#e9e8eb] !color-[#e9e8eb] !py-7 !px-4")
    .bg-white.rounded-3xl.mt-3.border
      AppTable(v-slot="{data}" without-filters without-search without-pagination :columns="table.columns" :data="table.data" :key="table.data" class="!py-0")
        .flex.items-center.py-2(@click.stop)
          el-button(class="!rounded-2xl" type='danger' link @click="toggleVehicleSelection(data.id)"): Icon(name="IconDelete" size="20")
          el-button(class="!rounded-2xl" type='primary' link @click="selectVehicleForEdit(data.id)"): Icon(name="IconEdit" size="20")
  .endBar
      .flex.justify-between.w-full
        el-button(   size='large' plain type="primary" class=" !rounded-2xl" @click="emit('cancel')") Cancel
        .flex.items-center.gap-x-2
          el-button( type="primary"  size='large' link :loading="loading"  :disabled="loading" class=" !px-5 !rounded-2xl" @click="activeStep--") Back
          el-button(   size='large' type="primary" native-type="submit" :loading="loading"  :disabled="loading" class=" !px-5 !rounded-2xl") Next
OperationsProjectsModalVehicle(v-model="addVehicle"  @confirm="fetchVehicles" :vehicle="vehicle")
</template>

<script lang="ts" setup>
  import { useForm } from "vee-validate";
  import * as yup from "yup";
  import { defineEmits, defineProps, defineModel } from "vue";
  import { Plus } from "@element-plus/icons-vue";
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
  const addVehicle = ref(false);
  const emit = defineEmits(["submit", "cancel"]);
  const vehiclesOptions = ref<{ label: string; value: string }[]>([]);
  const filteredVehicles = ref<{ label: string; value: string }[]>([]);
  const vehicles = ref<Vehicle[]>([]);
  const vehicle = ref<Vehicle>();
  const vehiclesId = ref<string[]>([]);
  const formSchema = yup.object({
    vehicles: yup.array().of(yup.string()).nullable().label("Vehicles"),
  });

  const { handleSubmit } = useForm({
    validationSchema: formSchema,
  });

  const onSubmit = handleSubmit(async (values: any) => {
    try {
      // Attempt to create the project
      if (values.vehicles.length) {
        await createtAssociatedVehicles({
          vehiclesIds: values.vehicles,
        });
      }
      activeStep.value++;
    } catch (error) {
      // Handle the error and prevent the step from being incremented
      console.error("Project creation failed", error);
    }
    // emit('submit')
  });

  const table = reactive({
    columns: [
      {
        prop: "plate",
        label: "Plate Number",
        component: "Text",
        // sortable: true,
        type: "font-bold",
        width: 130,
      },
      {
        prop: "manufacturer",
        label: "Manufacturer",
        component: "Text",
        // sortable: true,
        type: "font-bold",
        width: 150,
      },
      {
        prop: "rentCost",
        label: "Rent Cost",
        component: "Text",
        // sortable: true,
        type: "font-default",
        width: 120,
      },
      {
        prop: "gasCost",
        label: "Gas Cost",
        component: "Text",
        // sortable: true,
        type: "font-default",
        width: 120,
      },
      {
        prop: "oilCost",
        label: "Oil Cost",
        component: "Text",
        // sortable: true,
        type: "font-default",
        width: 150,
      },
      {
        prop: "regularMaintenanceCost",
        label: "Regular Maintenance Cost",
        component: "Text",
        // sortable: true,
        type: "font-default",
        width: 250,
      },
      {
        prop: "totalCost",
        label: "Total Cost",
        component: "Text",
        // sortable: true,
        type: "font-default",
        width: 250,
      },
    ],
    data: [] as Vehicle[],
  });

  if (project.value?.vehicles?.length) {
    vehiclesId.value = project.value?.vehicles.map(({ id }: Vehicle) => id);
    updateTableData();
  }

  /**
   * Maps an array of vehicles into a format suitable for a select input.
   */
  function mapVehicles(data: Vehicle[] = []): { label: string; value: string }[] {
    return data.map(({ plate, id }) => ({ label: plate, value: id }));
  }

  /**
   * Fetches the list of vehicles from the API and updates the select input with the results.
   */
  async function fetchVehicles(id: string = "", isUpdate?: boolean) {
    const response = await useTableFilter("vehicle");
    vehicles.value = response?.formattedData || [];
    vehiclesOptions.value = mapVehicles(vehicles.value);
    if (isUpdate) {
      updateTableData();
      return;
    }
    toggleVehicleSelection(id);
  }

  /**
   * Updates the table data and filtered vehicles list based on the selected vehicle IDs.
   */
  function updateTableData() {
    table.data =
      vehicles.value
        ?.filter(({ id }: Vehicle) => vehiclesId.value?.includes(id))
        ?.map((vehicle: Vehicle) => ({
          ...vehicle,
          totalCost:
            Number(vehicle.rentCost || 0) +
            Number(vehicle.gasCost || 0) +
            Number(vehicle.oilCost || 0) +
            Number(vehicle.regularMaintenanceCost || 0),
        })) || [];
    filteredVehicles.value = mapVehicles([...table.data]);
  }

  /**
   * Toggles the selection of a vehicle by its ID.
   */
  function toggleVehicleSelection(val: any) {
    const vehicleId = val.value || val;
    const index = vehiclesId.value?.indexOf(vehicleId);

    if (index !== -1) {
      vehiclesId.value.splice(index, 1);
    } else {
      vehiclesId.value.push(vehicleId);
    }
    updateTableData();
  }

  /**
   * Selects a vehicle for editing based on its ID and opens the vehicle form.
   */
  function selectVehicleForEdit(id: string) {
    vehicle.value = vehicles.value?.find(({ id: vehicleId }: Vehicle) => vehicleId === id);
    addVehicle.value = !!vehicle.value?.id;
  }

  await fetchVehicles();
</script>
