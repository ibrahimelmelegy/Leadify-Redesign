<template lang="pug">
el-form.border-t.pt-4(  autocomplete="off"   @submit.prevent='onSubmit'   ref="myForm" label-position="top"  :validationSchema="formSchema" )
  .flex.align-center.gap-1
    InputSelect( class="w-11/12	"  label=" Manpower Name" name="manpowerId" :options="manpowerOptions" :value=" isNew ? manpowerOptions[0]?.value  : data?.manpowerId" )
    el-button.mt-7.flex-1(size='medium' :icon="Plus" native-type="button" @click="addNewManPower = true" class="!rounded-2xl !border-[#e9e8eb] !py-7 !px-4")
  .grid.grid-cols-2.gap-3.items-center
    InputText(label="Estimate Work Day"  placeholder="Enter Estimate Work Day" name="estimatedWorkDays" :value="data?.estimatedWorkDays" )
    InputSelect.mt-6(label=" Mission" isMultiple name="mission" :options="projectMissions" :value="data?.mission" )
    InputText.mt-4(v-if="data?.id"   label="Actual Worked Days"  placeholder="Enter Actual Worked Days" name="actualWorkDays" :value="data?.actualWorkDays" )
    el-checkbox(label="Other Costs ?" v-model="isOtherCost")
  template(v-if="isOtherCost")
    InputText.mt-4(label="Other Costs"  placeholder="Enter Other Costs SAR" name="otherCosts" :value="data?.otherCosts" )
    InputText.mt-4(label="Other Cost Reason" type="textarea" placeholder="Enter Total Cost SAR" name="otherCostsReason" :value="data?.otherCostsReason" )
  slot(name="modal-footer")
</template>

<script setup lang="ts">
  import { useForm } from "vee-validate";
  import * as yup from "yup";
  import { Plus } from "@element-plus/icons-vue";
  import { ref, defineProps, defineEmits, defineModel } from "vue";
  const props = defineProps({
    loading: Boolean,
    isNew: Boolean,
    data: Object,
    manpowerOptions: Array as () => { label: string; value: string }[],
  });
  const emit = defineEmits(["confirm", "submit"]);
  const confirm = () => {
    emit("confirm");
  };
  const isOtherCost = ref(false);

  const addNewManPower = defineModel();
  const formSchema = yup.object({
    manpowerId: yup.string().required().min(1).label("Manpower Name"),
    estimatedWorkDays: yup
      .string() // Use string to allow flexible input (empty, float, or integer)
      .required()
      .test(
        "is-valid-number",
        "Please enter a valid number.", // Custom error message
        (value: any) => {
          if (!value) return true; // Allow empty input
          return /^\d*\.?\d*$/.test(value); // Check if value is a valid integer or float
        }
      )
      .max(25)
      .label("Estimate Work Day"),
    actualWorkDays: yup
      .string() // Use string to allow flexible input (empty, float, or integer)
      .nullable()
      .test(
        "is-valid-number",
        "Please enter a valid number.", // Custom error message
        (value: any) => {
          if (!value) return true; // Allow empty input
          return /^\d*\.?\d*$/.test(value); // Check if value is a valid integer or float
        }
      )
      .max(25)
      .label("Actual Worked Days"),
    mission: yup.array().of(yup.string()).required().min(1).label("Mission"),
    // foodAllowanceCost: yup
    //   .string() // Use string to allow flexible input (empty, float, or integer)
    //   .required()
    //   .test(
    //     'is-valid-number',
    //     'Please enter a valid number.', // Custom error message
    //     (value: any) => {
    //       if (!value) return true; // Allow empty input
    //       return /^\d*\.?\d*$/.test(value); // Check if value is a valid integer or float
    //     }
    //   )
    //   .max(25)
    //   .label('Food Allowance Cost'),
    otherCosts: yup.string().when([], {
      is: () => isOtherCost.value,
      then: () =>
        yup
          .string() // Use string to allow flexible input (empty, float, or integer)
          .required()
          .test(
            "is-valid-number",
            "Please enter a valid number.", // Custom error message
            (value: any) => {
              if (!value) return true; // Allow empty input
              return /^\d*\.?\d*$/.test(value); // Check if value is a valid integer or float
            }
          )
          .max(25)
          .label("Other Costs"),
      otherwise: () =>
        yup
          .string() // Use string to allow flexible input (empty, float, or integer)
          .nullable()
          .test(
            "is-valid-number",
            "Please enter a valid number.", // Custom error message
            (value: any) => {
              if (!value) return true; // Allow empty input
              return /^\d*\.?\d*$/.test(value); // Check if value is a valid integer or float
            }
          )
          .max(25)
          .label("Other Costs"),
    }),
    otherCostsReason: yup.string().when([], {
      is: () => isOtherCost.value,
      then: () => yup.string().required().trim().min(2).max(100).label("Other Cost Reason"),
      otherwise: () =>
        yup
          .string()
          .trim()
          .nullable()
          .test(
            "min-length-if-entered",
            "Other Cost Reason must be at least 2 characters",
            (value: any) => !value || value.length >= 2
          )
          .trim()
          .max(100)
          .label("Other Cost Reason"),
    }),
  });

  const { handleSubmit } = useForm({
    validationSchema: formSchema,
  });

  if (props.data?.id) {
    isOtherCost.value = props.data?.otherCosts ? true : false;
  }

  const onSubmit = handleSubmit(async (values: any) => {
    const formattedValues = cleanObject({
      ...values,
      estimatedWorkDays: Number(values.estimatedWorkDays),
      actualWorkDays: Number(values.actualWorkDays),
      // foodAllowanceCost: Number(values.foodAllowanceCost),
      otherCosts: Number(values.otherCosts),
    });
    try {
      // Attempt to create or update the project
      if (props.data?.id) {
        await updateProjectManPower(formattedValues, props.data.id);
      } else {
        await createProjectManPower(formattedValues);
      }
      emit("submit");
    } catch (error) {
      console.error("Project creation failed", error);
    }
    // emit('submit')
  });
</script>
