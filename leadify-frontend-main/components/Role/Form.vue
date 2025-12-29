<template lang="pug">
el-form(  autocomplete="off"   @submit.prevent='onSubmit'   ref="myForm" label-position="top"  :validationSchema="formSchema" )
  slot
  div(class="p-10  card m-auto bg-white rounded-3xl")
    InputText(label=" Role Name" name="name" placeholder="Enter Role Name" :value="data?.name" )
    InputText.mt-6(type="textarea" label="Description (optional)" placeholder="Enter Description"  name="description" :value="data?.description" )
</template>

<script lang="ts" setup>
  import { useForm } from "vee-validate";
  import * as yup from "yup";
  import { defineEmits, defineProps } from "vue";
  const router = useRouter();
  const props = defineProps({
    loading: Boolean,
    label: String,
    data: {
      type: Object,
      required: false,
    },
  });

  const emit = defineEmits(["submit"]);

  const formSchema = yup.object({
    name: yup.string().trim().required().min(2).max(100).label("Role Name"),
    description: yup
      .string()
      .trim()
      .nullable()
      .test("min-length-if-entered", "Notes must be at least 2 characters", (value: any) => !value || value.length >= 2)
      .trim()
      .max(2000)
      .label("Description"),
  });

  const { handleSubmit } = useForm({
    validationSchema: formSchema,
  });

  const onSubmit = handleSubmit((values: any, actions: any) => {
    emit("submit", values);
  });
</script>
