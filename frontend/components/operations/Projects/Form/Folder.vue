<template lang="pug">
el-form.border.p-10.rounded-3xl.mt-4(autocomplete="off" @submit.prevent="onSubmit" ref="formRef" label-position="top")
  .grid.grid-cols-1.gap-3
    InputText(label="Folder Name (optional)" placeholder="Enter Folder Name" name="name" :value="folder?.name")
    InputUploadFiles(label="Project Files (optional)" name="file" :limit="4" :formats="fileAttachmentsFormats" formatsError="Accept only PDF, Word, Jpg, Jpeg, Png, excel, pptx, txt" :tipNote="false" class="md:col-span-2" innerClass="!mb-0" :value="folder?.refs?.map((file: any) => ({name: file, response: file }))")
</template>
  
  <script lang="ts" setup>
  import { useForm } from "vee-validate";
  import * as yup from "yup";
  import { defineProps, defineEmits, defineModel, defineExpose, ref, watch } from "vue";
  // import { Delete } from '@element-plus/icons-vue';
  
  // Props
  const props = defineProps({
    folder: { type: Object, required: true },
    editMode: { type: Boolean, required: false },
    project: { type: Object, required: true },
  });
  
  //  Emit events
  // const emit = defineEmits(['onSubmit', 'onDelete']);
  const emit = defineEmits(["onSubmit"]);
  // Validation schema
  const formSchema = yup.object({
    name: yup
      .string()
      .trim()
      .nullable()
      .test(
        "min-length-if-entered",
        "Folder Name must be at least 2 characters",
        (value: any) => !value || value.length >= 2
      )
      .trim()
      .max(250)
      .label("Folder Name"),
    file: yup.array().notRequired().nullable().label("Project File"),
  });
  
  // Form setup
  const { handleSubmit, errors, validate, values, resetForm } = useForm({
    validationSchema: formSchema,
    initialValues: {
      name: props.folder?.name || '',
      file: props.folder?.refs?.map((file: any) => ({name: file, response: file })) || []
    }
  });
  
  // Watch for folder changes
  watch(() => props.folder, (newFolder) => {
    if (newFolder) {
      resetForm({
        values: {
          name: newFolder.name || '',
          file: newFolder.refs?.map((file: any) => ({name: file, response: file })) || []
        }
      });
    }
  }, { deep: true });
  
  const formRef = ref();
  
  //  Emit submittion values
  const onSubmit = handleSubmit(async (values: any) => {
    emit("onSubmit", {...values});
    if (!props.editMode) {
      await resetForm();
    }
  });
  
  // // Emit delete
  // function onDelete() {
  //   emit('onDelete', props.folder.id);
  // }
  
  // Expose methods to the parent component
  defineExpose({ onSubmit, validate, errors, values });
  </script>
  