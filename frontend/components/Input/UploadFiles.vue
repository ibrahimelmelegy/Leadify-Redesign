<template lang="pug">
el-form-item(:label="label" :error="errorMessage" class="!mb-6 w-full")
  el-upload.w-full(
    v-model:file-list="inputValue"
    :limit="limit"
    :name="name"
    action="#"
    :multiple="multiple"
    :before-upload="beforeUpload"
    :on-success="handleUploadSuccess"
    :on-remove="handleRemove"
    :http-request="handleUploadRequest"
    :class="{'upload-disabled-none' : limit === 1 && inputValue.length}"
    v-loading="loading"
  )
    el-icon.el-icon--upload
      upload-filled
    div.text-neutral-900
      | Drag and drop file here or
      p.text-neutral-400.text-xs JPG, JPEG, PNG, PDF, DOCX,EXCEL, PPTX, TXT ,CSV
    template(#tip)
      div.el-upload__tip
        | jpg/png files with a size less than 500kb
</template>

<script lang="ts" setup>
import { ElMessage } from "element-plus";
import { useField } from "vee-validate";
import type { UploadFile, UploadProps } from "element-plus";

const props = defineProps({
  name: String,
  value: {
    type: Array,
    default: [],
  },
  label: String,
  sizeInMb: {
    type: Number,
    default: 2, // Max file size in MB
  },
  formats: {
    type: Array,
    default: () => [
      "image/jpg",
      "image/jpeg",
      "image/png",
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv",
      "application/csv",
      "application/x-csv",
    ],
  },
  formatsError: {
    type: String,
  },
  tipNote: {
    type: Boolean,
    default: true,
  },
  limit: {
    type: Number,
    default: null,
  },
  innerClass: {
    type: String,
    default: "!mb-6",
  },
});

const icon = computed(() => {
  switch (props.type) {
    case "file":
      return "IconAdd";
    case "image":
      return "IconImage";
    case "video":
      return "IconVideo";
    default:
      return "IconImageList";
  }
});

const runtimeConfig = useRuntimeConfig();

const dialogImageUrl = ref("");
const dialogVisible = ref(false);
const disabled = ref(false);

const handlePictureCardPreview = (file: UploadFile) => {
  dialogImageUrl.value = file.url!;
  dialogVisible.value = true;
};

const handleUploadSuccess: UploadProps["onSuccess"] = (response, uploadFile) => {};

const { value: inputValue, errorMessage, handleBlur, handleChange, meta } = useField(
  props.name,
  undefined,
  {
    multiple: {
      type: Boolean,
      default: false,
    },
  }
);

watch(
  () => props.value,
  () => {
    if (props.value) {
      inputValue.value = props.value;
    }
  }
);
if (props.value.length) {
  inputValue.value = props.value;
}

const loading = ref(false);

const beforeUpload: UploadProps["beforeUpload"] = (file: File) => {
  if (!props.formats.includes(file.type)) {
    ElMessage.error(
      `Accept Upload ${props.formats
        .map((format: any) => format.split("/").pop())
        .join(", ")}`
    );
    return false;
  }

  if (file.size / 1024 / 1024 > props.sizeInMb) {
    ElMessage.error(`uploadMaxSize ${props.sizeInMb} MB`);
    return false;
  }

  return true;
};

const handleUploadRequest = async (params: any) => {
  const { file, filename, data } = params;
  try {
    loading.value = true;
    data.model = "PROJECT";

    const formData = new FormData();
    const fileToUpload = new File([file], file.name);

    formData.append(filename, fileToUpload);

    Object.entries(data).forEach(([key, value]: any) => {
      formData.append(key, value);
    });

    const response = await useApiFetch("upload", "POST", formData, false, true);
    if (response?.success) {
      return response.body;
    }
  } catch (error) {
    console.error("Upload failed:", error);
  } finally {
    loading.value = false;
  }
};

const handleRemove = (file: UploadFile) => {
  inputValue.value = inputValue.value?.filter((f: any) => f.uid !== file.uid);
};
</script>

<style lang="scss">
.el-upload-list {
  &--picture-card {
    .el-upload-list__item {
      border-radius: $raduis-base;
    }
  }
}
.upload-disabled-none {
  .el-upload.el-upload--text {
    display: none;
  }
}
.el-upload__tip {
  margin: 0 !important;
  opacity: 50%;
}
</style>
