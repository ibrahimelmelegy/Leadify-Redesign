<template lang="pug">
  OperationsProjectsFormFolder(
    :folder="currentFolder",
    :index="index",
    ref="childRefs",
    @onSubmit="onSubmit",
    :editMode="editMode && props.folder"
  )
  .flex.items-center.justify-between.my-4
    .flex.items-center.gap-x-2
      el-button.w-full(
        size="large", 
        plain, 
        type="primary", 
        class="!rounded-2xl",
        @click="handleCancel"
      ) Cancel
      el-button.w-full(
        size="large",
        @click="onSubmitFolders",
        type="primary",
        native-type="submit",
        :loading="isSubmitting",
        :disabled="isSubmitting",
        class="!px-5 !rounded-2xl"
      ) Save
  </template>
  
  <script lang="ts" setup>
  import { ref, defineProps, defineEmits, onMounted } from "vue";
  import { v4 as uuidv4 } from "uuid";
  import { ElMessage } from "element-plus";
  
  // Props and emits definition
  const emit = defineEmits(["onSubmit", "isValid"]);
  const route = useRoute();
  
  interface Props {
    folder?: {
      id: string;
      name: string;
      refs: string[];
    };
    editMode?: boolean;
    project: Record<string, any>;
  }
  
  const props = defineProps<Props>();
  
  // Reactive state
  const isSubmitting = ref(false);
  const childRefs = ref<Record<string, any>>({});
  const currentFolder = ref<any>({
    id: "",
    name: "",
    refs: [],
  });
  
  // Initialize folder data
  onMounted(() => {
    resetFolder();
    if (props.folder) {
      currentFolder.value = { ...props.folder };
    }
  });
  // Add a new folder
  // async function AddFolder() {
  //   if (!(await validateForm())) return;
  
  //   folders.value.push({
  //     id: uuidv4(),
  //     name: '',
  //     file: '',
  //   });
  // }
  
  /**
   * Deletes an folder from the list of folders.
   * @param {string} id - The ID of the folder to delete.
   * @returns {void}
   */
  // function onDelete(id: string): void {
  //   if (folders.value.length == 1) return;
  //   // Filter out the folder to be deleted from the list of folders
  //   const data = [...folders.value];
  //   data.splice(
  //     folders.value.findIndex((folder: Folder) => folder.id === id),
  //     1
  //   );
  //   folders.value = [...data];
  // }
  
  // Methods
  function resetFolder() {
    currentFolder.value = {
      id: uuidv4(),
      name: "",
      refs: [],
    };
  }
  
  function handleCancel() {
    resetFolder();
    emit("onSubmit");
  }
  
  function formattedBasicInfo(values: any) {
    if (!values) return {};
    return cleanObject({
      name: values?.name,
      type: values?.type,
      category: values?.category,
      clientId: values?.clientId,
      startDate:
        typeof values?.startDate === "string"
          ? values?.startDate
          : values?.startDate?.toISOString(),
      endDate:
        typeof values?.endDate === "string"
          ? values?.endDate
          : values?.endDate?.toISOString(),
      duration: Number(values?.duration),
      assignedUsersIds: values?.assignedUsers?.map((el: any) => el?.id),
      status: values?.status,
      description: values?.description,
      cancelledReason: values?.cancelReason,
    });
  }
  
  function formattedEtimadProjectInfo(values: any) {
    if (!values) return {};
    return cleanObject({
      abbreviation: values?.abbreviation,
      organizationName: values?.organizationName,
      rfpName: values?.rfpName,
      contractType: values?.contractType,
      tenderPrice: Number(values?.tenderPrice),
      businessLine: values?.businessLine,
      estimatedBudget: Number(values?.estimatedBudget),
      companyMargin: Number(values?.companyMargin),
      submissionDate:
        typeof values?.submissionDate === "string"
          ? values?.submissionDate
          : values?.submissionDate?.toISOString(),
      proposalStatus: values?.proposalStatus,
      applicationStatus: values?.applicationStatus,
    });
  }
  
  async function onSubmit (values: any) {
    try {
      let data;
      if (props.editMode && props.folder) {
        // Replace existing folder
        data = props.project.files.map((file: any , index: number) => {
          if (file.name === props.folder?.name ) {
            return {
              name: values?.name,
              refs: values?.file?.map((el: any) => el?.response)
            };
          }
          return file;
        });
      } else {
        // Add new folder
        data = [...(props?.project?.files || []), {
      
          name: values?.name,
          refs: values?.file?.map((el: any) => el?.response),
        }];
      }
      
      const basicInfo = formattedBasicInfo(props?.project);
      const etimadInfo = formattedEtimadProjectInfo(props?.project?.etimadProject);
  
      const projectInfo = {
        basicInfo: {
          ...basicInfo,
          ...(props?.project.etimadProject && { etimadInfo }),
          files: data,
        },
      };
     
      await updateProject({
        basicInfo: projectInfo?.basicInfo,
        projectId: props?.project?.id,
      });
  
      emit("onSubmit");
      resetFolder();
    } catch (error) {
      ElMessage.error("Failed to submit folder");
    }
  }
  
  async function validateForm(): Promise<boolean> {
    if (!childRefs.value) return false;
  
    try {
      await childRefs.value.validate();
      return !Object.keys(childRefs.value.errors).length;
    } catch {
      return false;
    }
  }
  
  async function onSubmitFolders() {
    try {
      isSubmitting.value = true;
      const isValid = await validateForm();
  
      if (!isValid) {
        ElMessage.error("Please fill in all required fields");
        return;
      }
  
      await onSubmitForm();
      emit("onSubmit");
    } catch (error) {
      ElMessage.error("Failed to submit folders");
    } finally {
      isSubmitting.value = false;
    }
  }
  
  async function onSubmitForm(): Promise<boolean> {
    try {
      const isFormValid = await validateForm();
      if (!isFormValid) return false;
  
      await childRefs.value.onSubmit();
      return true;
    } catch {
      return false;
    }
  }
  
  // Expose methods to parent
  defineExpose({ onSubmitFolders });
  </script>
  